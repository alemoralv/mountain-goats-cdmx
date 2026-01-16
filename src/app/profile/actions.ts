'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ProfileUpdate, Gender } from '@/types/database';

export interface ProfileFormState {
  error: string | null;
  success: boolean;
  message?: string;
}

/**
 * Update user profile
 */
export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return { error: 'No autorizado. Por favor, inicia sesión.', success: false };
  }

  // Extract form data
  const fullName = formData.get('fullName') as string;
  const nickname = formData.get('nickname') as string;
  const bio = formData.get('bio') as string;
  const gender = formData.get('gender') as Gender | null;
  const dateOfBirth = formData.get('dateOfBirth') as string;
  const phone = formData.get('phone') as string;

  // Validate nickname
  if (!nickname || nickname.trim().length < 2) {
    return { error: 'El apodo debe tener al menos 2 caracteres.', success: false };
  }

  // Validate nickname uniqueness (excluding current user)
  const { data: existingNickname } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname.trim())
    .neq('id', user.id)
    .single();

  if (existingNickname) {
    return { error: 'Este apodo ya está en uso. Elige otro.', success: false };
  }

  // Build update object
  const updateData: ProfileUpdate = {
    nickname: nickname.trim(),
    full_name: fullName?.trim() || null,
    bio: bio?.trim() || null,
    gender: gender || null,
    date_of_birth: dateOfBirth || null,
    phone: phone?.trim() || null,
  };

  // Update profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id);

  if (updateError) {
    console.error('Profile update error:', updateError);
    return { error: 'No se pudo actualizar el perfil. Intenta de nuevo.', success: false };
  }

  revalidatePath('/profile');
  return { 
    error: null, 
    success: true, 
    message: '¡Perfil actualizado exitosamente!' 
  };
}

/**
 * Update emergency contact
 */
export async function updateEmergencyContact(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return { error: 'No autorizado.', success: false };
  }

  const contactName = formData.get('contactName') as string;
  const contactPhone = formData.get('contactPhone') as string;
  const contactRelationship = formData.get('contactRelationship') as string;

  if (!contactName || !contactPhone) {
    return { error: 'Nombre y teléfono del contacto son requeridos.', success: false };
  }

  const emergencyContact = {
    name: contactName.trim(),
    phone: contactPhone.trim(),
    relationship: contactRelationship?.trim() || '',
  };

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ emergency_contact: emergencyContact })
    .eq('id', user.id);

  if (updateError) {
    console.error('Emergency contact update error:', updateError);
    return { error: 'No se pudo actualizar el contacto de emergencia.', success: false };
  }

  revalidatePath('/profile');
  return { 
    error: null, 
    success: true, 
    message: '¡Contacto de emergencia actualizado!' 
  };
}


