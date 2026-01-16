import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import type { 
  HikeDifficultyLevel, 
  SessionDuration, 
  StrengthTrainingType, 
  TrainingDay,
  CalculatedTrainingPlan 
} from '@/types/database';

// Initialize Resend with API key (optional - will log to console if not configured)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Admin email to receive training plan notifications
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mountaingoatscdmx@gmail.com';

// Log warning if Resend is not configured
if (!resend) {
  console.warn('⚠️ RESEND_API_KEY not configured - emails will be logged to console instead');
}

// ============================================================================
// TYPES
// ============================================================================

interface FitnessAssessmentInput {
  firstName: string;
  age: string;
  maxRunningDistanceKm: string;
  comfortablePace: string;
  hikesLast3Months: string;
  typicalElevationGainM: string;
  strengthTrainingFrequency: string;
  strengthTrainingTypes: StrengthTrainingType[];
  availableDaysPerWeek: string;
  preferredTrainingDays: TrainingDay[];
  sessionDuration: SessionDuration;
  targetHikeName: string;
  targetHikeLevel: HikeDifficultyLevel;
  targetHikeDistanceKm: string;
  targetHikeElevationM: string;
  targetHikeDate: string;
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

function calculateFitnessLevel(
  maxRunningKm: number,
  hikesLast3Months: number,
  strengthFrequency: number
): 'beginner' | 'intermediate' | 'advanced' {
  let score = 0;
  
  // Running distance score
  if (maxRunningKm >= 10) score += 3;
  else if (maxRunningKm >= 5) score += 2;
  else if (maxRunningKm >= 2) score += 1;
  
  // Hiking experience score
  if (hikesLast3Months >= 6) score += 3;
  else if (hikesLast3Months >= 3) score += 2;
  else if (hikesLast3Months >= 1) score += 1;
  
  // Strength training score
  if (strengthFrequency >= 4) score += 2;
  else if (strengthFrequency >= 2) score += 1;
  
  if (score >= 6) return 'advanced';
  if (score >= 3) return 'intermediate';
  return 'beginner';
}

function calculateRecommendedWeeks(
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced',
  hikeLevel: HikeDifficultyLevel
): number {
  const baseWeeks: Record<HikeDifficultyLevel, number> = {
    '1': 4,
    '2': 6,
    '3': 8,
    '4': 12,
  };
  
  const fitnessModifier: Record<string, number> = {
    beginner: 2,
    intermediate: 0,
    advanced: -2,
  };
  
  return Math.max(4, baseWeeks[hikeLevel] + fitnessModifier[fitnessLevel]);
}

function getNextSaturday(fromDate: Date): Date {
  const date = new Date(fromDate);
  const dayOfWeek = date.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7; // Next Saturday
  date.setDate(date.getDate() + daysUntilSaturday);
  return date;
}

function calculateTrainingPhases(
  totalWeeks: number
): CalculatedTrainingPlan['phases'] {
  // Distribute weeks across phases
  const taperWeeks = Math.min(2, Math.floor(totalWeeks * 0.15));
  const peakWeeks = Math.max(1, Math.floor(totalWeeks * 0.2));
  const strengthWeeks = Math.max(2, Math.floor(totalWeeks * 0.3));
  const baseWeeks = totalWeeks - taperWeeks - peakWeeks - strengthWeeks;
  
  return {
    baseBuildingPhase: { 
      startWeek: 1, 
      endWeek: baseWeeks 
    },
    strengthBuildingPhase: { 
      startWeek: baseWeeks + 1, 
      endWeek: baseWeeks + strengthWeeks 
    },
    peakTrainingPhase: { 
      startWeek: baseWeeks + strengthWeeks + 1, 
      endWeek: baseWeeks + strengthWeeks + peakWeeks 
    },
    taperPhase: { 
      startWeek: totalWeeks - taperWeeks + 1, 
      endWeek: totalWeeks 
    },
  };
}

function generateRecoveryNotes(age: number): string[] {
  const notes: string[] = [];
  
  if (age >= 50) {
    notes.push('Considera 48+ horas de recuperación entre entrenamientos intensos');
    notes.push('Incluye estiramientos dinámicos antes y estáticos después de cada sesión');
    notes.push('Hidratación extra importante - mínimo 3L de agua diarios');
  } else if (age >= 40) {
    notes.push('Incluye al menos un día de descanso activo por semana');
    notes.push('Estiramientos de 10-15 minutos después de cada entrenamiento');
  } else if (age >= 30) {
    notes.push('Un día de descanso completo por semana es suficiente');
    notes.push('Foam rolling después de sesiones largas');
  } else {
    notes.push('Recuperación estándar - 1-2 días de descanso por semana');
  }
  
  return notes;
}

function generateRecommendations(
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced',
  hikeLevel: HikeDifficultyLevel,
  sessionDuration: SessionDuration
): string[] {
  const recommendations: string[] = [];
  
  if (fitnessLevel === 'beginner') {
    recommendations.push('Comienza gradualmente - no aumentes distancia más de 10% por semana');
    recommendations.push('Enfócate en construir resistencia base antes de intensidad');
    recommendations.push('Considera unirte a nuestros Herd Runs para motivación grupal');
  }
  
  if (hikeLevel === '3' || hikeLevel === '4') {
    recommendations.push('Incluye al menos 2 entrenamientos de altura (>3000m) antes del hike');
    recommendations.push('Practica con tu mochila cargada con peso similar al día del hike');
    recommendations.push('Invierte en buen equipo: botas de montaña y bastones de trekking');
  }
  
  if (sessionDuration === 'short') {
    recommendations.push('Maximiza tus sesiones con entrenamientos HIIT 2-3 veces por semana');
    recommendations.push('Complementa con caminatas largas los fines de semana');
  }
  
  recommendations.push('Mantén un registro de tus entrenamientos para ver tu progreso');
  
  return recommendations;
}

function calculateTrainingPlan(
  input: FitnessAssessmentInput,
  userEmail: string
): CalculatedTrainingPlan {
  const maxRunningKm = parseFloat(input.maxRunningDistanceKm) || 0;
  const age = parseInt(input.age) || 25;
  const hikesLast3Months = parseInt(input.hikesLast3Months) || 0;
  const strengthFrequency = parseInt(input.strengthTrainingFrequency) || 0;
  const targetDistanceKm = parseFloat(input.targetHikeDistanceKm) || 0;
  const targetElevationM = parseInt(input.targetHikeElevationM) || 0;
  
  const fitnessLevel = calculateFitnessLevel(maxRunningKm, hikesLast3Months, strengthFrequency);
  const recommendedWeeks = calculateRecommendedWeeks(fitnessLevel, input.targetHikeLevel);
  
  const today = new Date();
  const targetDate = new Date(input.targetHikeDate);
  const weeksUntilHike = Math.floor((targetDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000));
  
  // Training starts today
  const trainingStartDate = today.toISOString().split('T')[0];
  
  // First Herd Run is the next Saturday
  const firstHerdRun = getNextSaturday(today);
  const firstHerdRunDate = firstHerdRun.toISOString().split('T')[0];
  
  // Use available weeks or recommended, whichever is smaller
  const actualTrainingWeeks = Math.min(weeksUntilHike, recommendedWeeks);
  const phases = calculateTrainingPhases(actualTrainingWeeks);
  
  return {
    userName: input.firstName,
    userEmail,
    userAge: age,
    
    fitnessLevel,
    maxRunningDistanceKm: maxRunningKm,
    comfortablePace: input.comfortablePace,
    hikesLast3Months,
    strengthFrequency,
    
    targetHikeName: input.targetHikeName,
    targetHikeLevel: input.targetHikeLevel,
    targetHikeDistanceKm: targetDistanceKm,
    targetHikeElevationM: targetElevationM,
    targetHikeDate: input.targetHikeDate,
    
    trainingStartDate,
    weeksUntilHike,
    recommendedTrainingWeeks: actualTrainingWeeks,
    firstHerdRunDate,
    
    phases,
    
    availableDays: input.preferredTrainingDays,
    sessionDuration: input.sessionDuration,
    
    recoveryNotes: generateRecoveryNotes(age),
    recommendations: generateRecommendations(fitnessLevel, input.targetHikeLevel, input.sessionDuration),
  };
}

// ============================================================================
// EMAIL GENERATION
// ============================================================================

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function generateEmailHtml(plan: CalculatedTrainingPlan): string {
  const sessionDurationText = {
    short: '30-45 minutos',
    medium: '45-75 minutos',
    long: '75+ minutos',
  };

  const hikeLevelText = {
    '1': 'Nivel 1 (8-12km, <500m, 4-5h)',
    '2': 'Nivel 2 (12-18km, 500-1000m, 5-7h)',
    '3': 'Nivel 3 (18-25km, 1000-1500m, 7-9h)',
    '4': 'Nivel 4 (25+km, 1500+m, 9+h)',
  };

  const fitnessLevelText = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  };

  const dayTranslations: Record<TrainingDay, string> = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Registro - Plan de Entrenamiento</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #0a1929 0%, #102a43 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .header p {
      margin: 10px 0 0;
      opacity: 0.8;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 25px;
      padding-bottom: 25px;
      border-bottom: 1px solid #eee;
    }
    .section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #14532d;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .info-item {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 8px;
    }
    .info-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .highlight-box {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 1px solid #86efac;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .highlight-box h3 {
      margin: 0 0 10px;
      color: #14532d;
    }
    .phase-list {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 15px;
    }
    .phase-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .phase-item:last-child {
      border-bottom: none;
    }
    .phase-name {
      font-weight: 500;
    }
    .phase-weeks {
      color: #666;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .tag {
      background: #e5e7eb;
      color: #374151;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
    }
    .recommendations {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .recommendations li {
      padding: 8px 0 8px 24px;
      position: relative;
    }
    .recommendations li::before {
      content: "→";
      position: absolute;
      left: 0;
      color: #14532d;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏔️ Mountain Goats CDMX</h1>
      <p>Nuevo Registro de Entrenamiento</p>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">👤 Información del Usuario</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Nombre</div>
            <div class="info-value">${plan.userName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${plan.userEmail}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Edad</div>
            <div class="info-value">${plan.userAge} años</div>
          </div>
          <div class="info-item">
            <div class="info-label">Nivel de Condición</div>
            <div class="info-value">${fitnessLevelText[plan.fitnessLevel]}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">🏃 Condición Física Actual</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Max Distancia Corriendo</div>
            <div class="info-value">${plan.maxRunningDistanceKm} km</div>
          </div>
          <div class="info-item">
            <div class="info-label">Ritmo Cómodo</div>
            <div class="info-value">${plan.comfortablePace} min/km</div>
          </div>
          <div class="info-item">
            <div class="info-label">Hikes (últimos 3 meses)</div>
            <div class="info-value">${plan.hikesLast3Months}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Entren. Fuerza/Semana</div>
            <div class="info-value">${plan.strengthFrequency} días</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">🎯 Hike Meta</div>
        <div class="highlight-box">
          <h3>${plan.targetHikeName}</h3>
          <p style="margin: 0; color: #666;">${hikeLevelText[plan.targetHikeLevel]}</p>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Distancia</div>
            <div class="info-value">${plan.targetHikeDistanceKm} km</div>
          </div>
          <div class="info-item">
            <div class="info-label">Desnivel</div>
            <div class="info-value">${plan.targetHikeElevationM} m</div>
          </div>
          <div class="info-item">
            <div class="info-label">Fecha del Hike</div>
            <div class="info-value">${formatDate(plan.targetHikeDate)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Semanas Disponibles</div>
            <div class="info-value">${plan.weeksUntilHike} semanas</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📅 Plan de Entrenamiento Calculado</div>
        <div class="info-grid" style="margin-bottom: 15px;">
          <div class="info-item">
            <div class="info-label">Inicio del Entrenamiento</div>
            <div class="info-value">${formatDate(plan.trainingStartDate)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Semanas Recomendadas</div>
            <div class="info-value">${plan.recommendedTrainingWeeks} semanas</div>
          </div>
          <div class="info-item">
            <div class="info-label">Primer Herd Run</div>
            <div class="info-value">${formatDate(plan.firstHerdRunDate)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Duración por Sesión</div>
            <div class="info-value">${sessionDurationText[plan.sessionDuration]}</div>
          </div>
        </div>

        <div class="phase-list">
          <div class="phase-item">
            <span class="phase-name">🌱 Base Building</span>
            <span class="phase-weeks">Semanas ${plan.phases.baseBuildingPhase.startWeek}-${plan.phases.baseBuildingPhase.endWeek}</span>
          </div>
          <div class="phase-item">
            <span class="phase-name">💪 Strength Building</span>
            <span class="phase-weeks">Semanas ${plan.phases.strengthBuildingPhase.startWeek}-${plan.phases.strengthBuildingPhase.endWeek}</span>
          </div>
          <div class="phase-item">
            <span class="phase-name">⚡ Peak Training</span>
            <span class="phase-weeks">Semanas ${plan.phases.peakTrainingPhase.startWeek}-${plan.phases.peakTrainingPhase.endWeek}</span>
          </div>
          <div class="phase-item">
            <span class="phase-name">🧘 Taper</span>
            <span class="phase-weeks">Semanas ${plan.phases.taperPhase.startWeek}-${plan.phases.taperPhase.endWeek}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📆 Días Preferidos</div>
        <div class="tags">
          ${plan.availableDays.map(day => `<span class="tag">${dayTranslations[day]}</span>`).join('')}
        </div>
      </div>

      <div class="section">
        <div class="section-title">💡 Recomendaciones Personalizadas</div>
        <ul class="recommendations">
          ${plan.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <div class="section-title">🔄 Notas de Recuperación</div>
        <ul class="recommendations">
          ${plan.recoveryNotes.map(note => `<li>${note}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="footer">
      <p>Este email fue generado automáticamente por el sistema de Mountain Goats CDMX</p>
      <p>${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
    </div>
  </div>
</body>
</html>
`;
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado. Por favor inicia sesión.' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body: FitnessAssessmentInput = await request.json();

    // Validate required fields
    if (!body.firstName || !body.age || !body.maxRunningDistanceKm || !body.comfortablePace ||
        !body.targetHikeName || !body.targetHikeDistanceKm || !body.targetHikeElevationM || !body.targetHikeDate) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Calculate the training plan
    const trainingPlan = calculateTrainingPlan(body, user.email || 'No email');

    // Store the assessment in Supabase
    const { error: insertError } = await supabase
      .from('fitness_assessments')
      .upsert({
        user_id: user.id,
        first_name: body.firstName,
        age: parseInt(body.age),
        max_running_distance_km: parseFloat(body.maxRunningDistanceKm),
        comfortable_pace: body.comfortablePace,
        hikes_last_3_months: parseInt(body.hikesLast3Months) || 0,
        typical_elevation_gain_m: parseInt(body.typicalElevationGainM) || 0,
        strength_training_frequency: parseInt(body.strengthTrainingFrequency) || 0,
        strength_training_types: body.strengthTrainingTypes,
        available_days_per_week: parseInt(body.availableDaysPerWeek),
        preferred_training_days: body.preferredTrainingDays,
        session_duration: body.sessionDuration,
        target_hike_name: body.targetHikeName,
        target_hike_level: body.targetHikeLevel,
        target_hike_distance_km: parseFloat(body.targetHikeDistanceKm),
        target_hike_elevation_m: parseInt(body.targetHikeElevationM),
        target_hike_date: body.targetHikeDate,
        training_plan_email: ADMIN_EMAIL,
        training_plan_sent_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      // Continue anyway to send email - storage failure shouldn't block the user
    }

    // Send email to admin
    try {
      const emailHtml = generateEmailHtml(trainingPlan);
      
      if (resend) {
        console.log('📧 Attempting to send email via Resend...');
        console.log(`   To: ${ADMIN_EMAIL}`);
        console.log(`   Subject: 🏔️ Nuevo Registro: ${body.firstName} - ${body.targetHikeName}`);
        
        // Use Resend's default domain (onboarding@resend.dev) for testing
        // Once you verify your own domain in Resend, change this to your domain
        const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Mountain Goats <onboarding@resend.dev>';
        
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `🏔️ Nuevo Registro: ${body.firstName} - ${body.targetHikeName}`,
          html: emailHtml,
        });

        if (emailError) {
          console.error('❌ Resend email error:', JSON.stringify(emailError, null, 2));
          // Don't fail the request if email fails - data is saved
        } else {
          console.log(`✅ Email sent successfully!`);
          console.log(`   Email ID: ${emailData?.id}`);
        }
      } else {
        // Log to console if Resend not configured (development mode)
        console.log('='.repeat(80));
        console.log('📧 EMAIL WOULD BE SENT (RESEND_API_KEY not configured)');
        console.log('='.repeat(80));
        console.log(`To: ${ADMIN_EMAIL}`);
        console.log(`Subject: 🏔️ Nuevo Registro: ${body.firstName} - ${body.targetHikeName}`);
        console.log('-'.repeat(80));
        console.log('Training Plan Summary:');
        console.log(JSON.stringify(trainingPlan, null, 2));
        console.log('='.repeat(80));
      }
    } catch (emailErr) {
      console.error('❌ Email send exception:', emailErr);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Evaluación guardada exitosamente',
      trainingPlan: {
        fitnessLevel: trainingPlan.fitnessLevel,
        recommendedWeeks: trainingPlan.recommendedTrainingWeeks,
        trainingStartDate: trainingPlan.trainingStartDate,
        firstHerdRunDate: trainingPlan.firstHerdRunDate,
      },
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

