-- ============================================================================
-- Mountain Goats: CDMX - Seed Data
-- Description: Sample hikes for development and testing
-- ============================================================================

-- ============================================================================
-- Hike 1: Mirador de Coconetla
-- A beginner-friendly hike in Los Dinamos, CDMX
-- ============================================================================
INSERT INTO hikes (
    title,
    slug,
    description,
    short_description,
    date,
    location,
    meeting_point,
    price_hike_only,
    price_training_only,
    price_bundle,
    distance_km,
    elevation_gain_m,
    elevation_loss_m,
    max_altitude_msnm,
    min_altitude_msnm,
    difficulty_level,
    route_type,
    duration_hours,
    max_participants,
    training_preview,
    is_published,
    is_featured,
    tags,
    main_image_url,
    map_image_url,
    elevation_chart_url,
    featured_image_url
) VALUES (
    'Mirador de Coconetla',
    'mirador-de-coconetla',
    '<p>Descubre uno de los miradores más espectaculares del sur de la Ciudad de México en esta caminata por Los Dinamos. El Mirador de Coconetla ofrece vistas panorámicas del Valle de México y es perfecto para quienes inician en el mundo del senderismo.</p>
    
    <p>Esta ruta atraviesa bosques de oyamel y encino, siguiendo antiguos senderos utilizados por las comunidades locales. Durante el recorrido aprenderás sobre la flora y fauna endémica de la zona, incluyendo el ajolote de montaña.</p>
    
    <h3>Lo que incluye:</h3>
    <ul>
      <li>Guía certificado</li>
      <li>Snacks energéticos y agua</li>
      <li>Seguro de accidentes</li>
      <li>Fotografías del grupo</li>
    </ul>
    
    <h3>Requisitos:</h3>
    <ul>
      <li>Condición física básica</li>
      <li>Ropa cómoda y botas de senderismo</li>
      <li>Mochila pequeña (10-20L)</li>
      <li>Edad mínima: 12 años</li>
    </ul>',
    'Caminata perfecta para principiantes con vistas espectaculares del Valle de México desde Los Dinamos.',
    '2026-02-22 08:00:00+00',
    'Los Dinamos, Magdalena Contreras, CDMX',
    'Estacionamiento del 4to Dinamo, Los Dinamos',
    65000,   -- $650 MXN (hike only)
    85000,   -- $850 MXN (training only)
    120000,  -- $1,200 MXN (bundle)
    6.5,     -- 6.5 km distance
    388,     -- 388m elevation gain
    388,     -- 388m elevation loss (loop)
    3423,    -- Max altitude: 3,423 msnm
    2900,    -- Min altitude: 2,900 msnm
    3,       -- Difficulty: 3/10 (Basic)
    'Loop',
    3.5,     -- 3.5 hours duration
    20,      -- Max 20 participants
    'En este módulo aprenderás los fundamentos del senderismo: técnicas de caminata eficiente, uso correcto de bastones, hidratación y alimentación en ruta. Incluye una guía de equipo básico para tus primeras aventuras.',
    true,    -- Published
    true,    -- Featured
    ARRAY['beginner', 'cdmx', 'viewpoint', 'forest', 'day-hike'],
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200',
    'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'
);

-- ============================================================================
-- Hike 2: Nevado de Toluca - Cráter Summit
-- An advanced high-altitude summit attempt
-- ============================================================================
INSERT INTO hikes (
    title,
    slug,
    description,
    short_description,
    date,
    location,
    meeting_point,
    price_hike_only,
    price_training_only,
    price_bundle,
    distance_km,
    elevation_gain_m,
    elevation_loss_m,
    max_altitude_msnm,
    min_altitude_msnm,
    difficulty_level,
    route_type,
    duration_hours,
    max_participants,
    training_preview,
    is_published,
    is_featured,
    tags,
    main_image_url,
    map_image_url,
    elevation_chart_url,
    featured_image_url
) VALUES (
    'Nevado de Toluca: Cráter Summit',
    'nevado-de-toluca-crater-summit',
    '<p>Conquista el cuarto pico más alto de México en esta expedición desafiante al cráter del Nevado de Toluca (Xinantécatl). A 4,680 metros sobre el nivel del mar, experimentarás paisajes volcánicos únicos y las legendarias lagunas del Sol y la Luna en el interior del cráter.</p>
    
    <p>Esta ruta de nivel avanzado requiere excelente condición física y experiencia previa en alta montaña. Nuestros guías expertos te llevarán a través del terreno volcánico, enseñándote técnicas de alta altitud y protocolos de seguridad esenciales.</p>
    
    <h3>Lo que incluye:</h3>
    <ul>
      <li>Transporte redondo desde CDMX</li>
      <li>Guía certificado en alta montaña</li>
      <li>Snacks energéticos y hidratación</li>
      <li>Seguro de accidentes</li>
      <li>Fotografías profesionales del grupo</li>
    </ul>
    
    <h3>Requisitos:</h3>
    <ul>
      <li>Experiencia previa en caminatas de montaña</li>
      <li>Excelente condición cardiovascular</li>
      <li>Equipo de alta montaña (lista proporcionada al confirmar)</li>
      <li>Edad mínima: 18 años</li>
    </ul>',
    'Conquista el majestuoso Nevado de Toluca y descubre las legendarias lagunas del Sol y la Luna en el cráter a 4,680m.',
    '2026-02-15 05:00:00+00',
    'Nevado de Toluca National Park, Estado de México',
    'Estacionamiento Km 22, Carretera al Nevado de Toluca',
    189900,  -- $1,899 MXN
    99900,   -- $999 MXN
    249900,  -- $2,499 MXN
    12.5,
    1200,
    1200,
    4680,
    3800,
    8,
    'Out-and-Back',
    8.5,
    12,
    'En este módulo de entrenamiento aprenderás las técnicas esenciales para caminatas de alta montaña: ritmo adecuado, ejercicios de respiración, y estrategias de aclimatación. Cubriremos los desafíos específicos del terreno volcánico y cómo navegar el cráter de forma segura. Incluye videos de técnica, plan de entrenamiento de 4 semanas, y lista detallada de equipo.',
    true,
    true,
    ARRAY['high-altitude', 'volcanic', 'advanced', 'crater-lakes', 'summit'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
);

-- ============================================================================
-- Hike 3: Pico del Águila - Ajusco
-- A moderate hike to the highest point in CDMX
-- ============================================================================
INSERT INTO hikes (
    title,
    slug,
    description,
    short_description,
    date,
    location,
    meeting_point,
    price_hike_only,
    price_training_only,
    price_bundle,
    distance_km,
    elevation_gain_m,
    elevation_loss_m,
    max_altitude_msnm,
    min_altitude_msnm,
    difficulty_level,
    route_type,
    duration_hours,
    max_participants,
    training_preview,
    is_published,
    is_featured,
    tags,
    main_image_url,
    featured_image_url
) VALUES (
    'Pico del Águila - Ajusco',
    'pico-del-aguila-ajusco',
    '<p>Alcanza el punto más alto de la Ciudad de México en esta emocionante caminata al Pico del Águila en el Ajusco. Con 3,930 metros de altitud, esta cumbre ofrece vistas de 360° de la megalópolis y los volcanes Popocatépetl e Iztaccíhuatl.</p>
    
    <p>La ruta atraviesa bosques de pino y páramo de alta montaña, ofreciendo una introducción perfecta al montañismo para excursionistas con algo de experiencia. Es ideal como preparación para cumbres más desafiantes.</p>
    
    <h3>Lo que incluye:</h3>
    <ul>
      <li>Guía certificado</li>
      <li>Snacks y bebidas calientes en cumbre</li>
      <li>Seguro de accidentes</li>
      <li>Transporte desde Metro Universidad</li>
    </ul>
    
    <h3>Requisitos:</h3>
    <ul>
      <li>Experiencia básica en senderismo</li>
      <li>Buena condición física</li>
      <li>Ropa abrigadora (capas)</li>
      <li>Edad mínima: 15 años</li>
    </ul>',
    'Conquista el punto más alto de CDMX con vistas panorámicas de la ciudad y los volcanes.',
    '2026-02-08 07:00:00+00',
    'Ajusco, Tlalpan, CDMX',
    'Estacionamiento Parque Ejidal San Nicolás Totolapan',
    89900,   -- $899 MXN
    69900,   -- $699 MXN
    139900,  -- $1,399 MXN
    8.0,
    650,
    650,
    3930,
    3400,
    5,
    'Out-and-Back',
    5.0,
    16,
    'Prepárate para tu primera cumbre con nuestro módulo de técnicas de ascenso: manejo del ritmo, uso de bastones en pendiente, y prevención del mal de altura. Incluye rutina de acondicionamiento de 3 semanas.',
    true,
    true,
    ARRAY['summit', 'cdmx', 'moderate', 'panoramic-views', 'volcanos'],
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800'
);

-- ============================================================================
-- Hike 4: Desierto de los Leones
-- A relaxed forest walk, perfect for beginners
-- ============================================================================
INSERT INTO hikes (
    title,
    slug,
    description,
    short_description,
    date,
    location,
    meeting_point,
    price_hike_only,
    price_training_only,
    price_bundle,
    distance_km,
    elevation_gain_m,
    elevation_loss_m,
    max_altitude_msnm,
    min_altitude_msnm,
    difficulty_level,
    route_type,
    duration_hours,
    max_participants,
    training_preview,
    is_published,
    is_featured,
    tags,
    featured_image_url
) VALUES (
    'Desierto de los Leones',
    'desierto-de-los-leones',
    '<p>Explora los senderos del histórico Desierto de los Leones, el primer parque nacional de México. Esta caminata familiar te llevará a través de bosques de oyamel y pino, pasando por el antiguo convento carmelita del siglo XVII.</p>
    
    <p>Ideal para quienes buscan una experiencia relajada en la naturaleza sin alejarse demasiado de la ciudad. Perfecto para familias y principiantes absolutos.</p>
    
    <h3>Lo que incluye:</h3>
    <ul>
      <li>Guía naturalista</li>
      <li>Snacks saludables</li>
      <li>Visita guiada al Ex-Convento</li>
      <li>Actividades de mindfulness en bosque</li>
    </ul>',
    'Caminata relajada por el histórico bosque del Desierto de los Leones, ideal para familias.',
    '2026-03-01 09:00:00+00',
    'Desierto de los Leones, Cuajimalpa, CDMX',
    'Entrada principal del Parque Nacional',
    59900,   -- $599 MXN
    49900,   -- $499 MXN
    89900,   -- $899 MXN
    10.0,
    400,
    400,
    3700,
    3200,
    2,
    'Loop',
    4.0,
    25,
    'Introducción al senderismo consciente: aprende a caminar de forma eficiente, conectar con la naturaleza y practicar mindfulness en el bosque.',
    true,
    false,
    ARRAY['beginner', 'family', 'forest', 'historical', 'easy'],
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'
);

-- ============================================================================
-- Hike 5: La Malinche - Cumbre
-- A challenging volcano summit
-- ============================================================================
INSERT INTO hikes (
    title,
    slug,
    description,
    short_description,
    date,
    location,
    meeting_point,
    price_hike_only,
    price_training_only,
    price_bundle,
    distance_km,
    elevation_gain_m,
    elevation_loss_m,
    max_altitude_msnm,
    min_altitude_msnm,
    difficulty_level,
    route_type,
    duration_hours,
    max_participants,
    training_preview,
    is_published,
    is_featured,
    tags,
    featured_image_url
) VALUES (
    'La Malinche - Cumbre',
    'la-malinche-cumbre',
    '<p>Asciende a la quinta montaña más alta de México: La Malinche (Matlalcuéyetl). Con 4,461 metros, este volcán inactivo ofrece una de las experiencias de alta montaña más accesibles del país.</p>
    
    <p>La ruta comienza en el Centro Vacacional IMSS y asciende por senderos bien marcados a través de diferentes ecosistemas, desde bosques de pino hasta el páramo alpino. En días despejados, las vistas incluyen el Pico de Orizaba, Popocatépetl e Iztaccíhuatl.</p>
    
    <h3>Lo que incluye:</h3>
    <ul>
      <li>Transporte redondo desde CDMX</li>
      <li>Guía de alta montaña certificado</li>
      <li>Desayuno energético pre-ascenso</li>
      <li>Snacks y bebidas calientes</li>
      <li>Seguro de montaña</li>
    </ul>',
    'Conquista la quinta montaña más alta de México con vistas espectaculares de los volcanes del centro.',
    '2026-03-08 04:00:00+00',
    'Parque Nacional La Malinche, Tlaxcala',
    'Centro Vacacional IMSS Malintzi',
    229900,  -- $2,299 MXN
    119900,  -- $1,199 MXN
    299900,  -- $2,999 MXN
    11.0,
    1400,
    1400,
    4461,
    3000,
    7,
    'Out-and-Back',
    10.0,
    10,
    'Preparación integral para alta montaña: técnicas de ascenso en terreno suelto, manejo del frío extremo, y estrategias nutricionales para esfuerzos prolongados. Plan de 6 semanas incluido.',
    true,
    false,
    ARRAY['high-altitude', 'summit', 'volcano', 'challenging', 'dawn-start'],
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800'
);

-- ============================================================================
-- Update sequences if needed (PostgreSQL)
-- ============================================================================
-- No sequence updates needed as we're using UUID primary keys

