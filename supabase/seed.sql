-- ============================================================
-- CLASSTRYP — Seed: Datos de prueba
-- Ejecutar DESPUÉS de las 3 migrations
-- SOLO para entorno de desarrollo / staging
-- ============================================================

-- ============================================================
-- USUARIOS DE PRUEBA
-- Contraseña para todos: Classtryp2026!
-- ============================================================
-- NOTA: Supabase crea auth.users automáticamente al registrar
-- Estos inserts en profiles requieren que ya existan en auth.users.
-- Usar el Admin Dashboard de Supabase para crear los usuarios
-- y luego actualizar sus profiles con estos datos.
-- ============================================================

-- Para testing local, insertar UUIDs fijos:
do $$
declare
  -- Clientes
  v_client1   uuid := 'a0000000-0000-0000-0000-000000000001';
  v_client2   uuid := 'a0000000-0000-0000-0000-000000000002';
  -- Proveedores
  v_prov1     uuid := 'b0000000-0000-0000-0000-000000000001'; -- casas
  v_prov2     uuid := 'b0000000-0000-0000-0000-000000000002'; -- botes
  v_prov3     uuid := 'b0000000-0000-0000-0000-000000000003'; -- transporte
  v_prov4     uuid := 'b0000000-0000-0000-0000-000000000004'; -- experiencias
  v_prov5     uuid := 'b0000000-0000-0000-0000-000000000005'; -- extras
  -- Admin
  v_admin     uuid := 'c0000000-0000-0000-0000-000000000001';
  -- Provider records
  v_prov1_rec uuid;
  v_prov2_rec uuid;
  v_prov3_rec uuid;
  v_prov4_rec uuid;
  v_prov5_rec uuid;
  -- Listing IDs
  v_listing1  uuid;
  v_listing2  uuid;
  v_listing3  uuid;
  v_listing4  uuid;
  v_listing5  uuid;
  -- Booking
  v_booking1  uuid;
begin

  -- --------------------------------------------------------
  -- PROFILES
  -- --------------------------------------------------------
  insert into public.profiles (id, role, full_name, phone)
  values
    (v_client1, 'client',   'Carlos Martinez',  '+57 300 111 2233'),
    (v_client2, 'client',   'Laura Vélez',       '+57 310 444 5566'),
    (v_prov1,   'provider', 'Juan Romero',        '+57 315 777 8899'),
    (v_prov2,   'provider', 'María García',       '+57 318 222 3344'),
    (v_prov3,   'provider', 'Roberto Silva',      '+57 313 555 6677'),
    (v_prov4,   'provider', 'Catalina Cruz',      '+57 312 888 9900'),
    (v_prov5,   'provider', 'Felipe Torres',      '+57 316 111 2200'),
    (v_admin,   'admin',    'Admin Classtryp',   '+57 300 000 0000')
  on conflict (id) do nothing;

  -- --------------------------------------------------------
  -- PROVIDERS
  -- --------------------------------------------------------
  insert into public.providers (user_id, category, verification_status, bio, rating, total_reviews, bank_info)
  values
    (v_prov1, 'houses', 'verified',
     'Propietario de casas de lujo en Bocagrande y Manga. 5 años ofreciendo alojamiento premium en Cartagena.',
     4.8, 24,
     '{"bank":"Bancolombia","account":"123-456789-00","type":"ahorros","holder":"Juan Romero"}'),

    (v_prov2, 'boats', 'verified',
     'Flota de lanchas y veleros para recorridos por las Islas del Rosario y bahía de Cartagena.',
     4.9, 18,
     '{"bank":"Davivienda","account":"987-654321-00","type":"corriente","holder":"María García"}'),

    (v_prov3, 'transport', 'verified',
     'Servicio de traslados aeropuerto y city tours. Flotilla de vans climatizadas para grupos.',
     4.7, 31,
     '{"bank":"Nequi","account":"318-222-3344","type":"nequi","holder":"Roberto Silva"}'),

    (v_prov4, 'experiences', 'pending',
     'Tours de snorkel, buceo y city tour en Cartagena. Guías certificados.',
     0, 0, null),

    (v_prov5, 'extras', 'verified',
     'Chef privado, DJ, fotógrafo y servicios de bienestar para grupos VIP en Cartagena.',
     5.0, 8,
     '{"bank":"Bancolombia","account":"456-789012-00","type":"ahorros","holder":"Felipe Torres"}')
  on conflict (user_id) do nothing;

  -- Capturar IDs de providers
  select id into v_prov1_rec from public.providers where user_id = v_prov1;
  select id into v_prov2_rec from public.providers where user_id = v_prov2;
  select id into v_prov3_rec from public.providers where user_id = v_prov3;
  select id into v_prov4_rec from public.providers where user_id = v_prov4;
  select id into v_prov5_rec from public.providers where user_id = v_prov5;

  -- --------------------------------------------------------
  -- KYC DOCUMENTS (para proveedor verificado)
  -- --------------------------------------------------------
  insert into public.kyc_documents (provider_id, doc_type, url, status, reviewed_by, reviewed_at)
  values
    (v_prov1_rec, 'cedula',        'https://storage.classtryp.co/kyc/prov1_cedula.jpg',   'approved', v_admin, now() - interval '30 days'),
    (v_prov1_rec, 'rut',           'https://storage.classtryp.co/kyc/prov1_rut.pdf',      'approved', v_admin, now() - interval '30 days'),
    (v_prov1_rec, 'service_photo', 'https://storage.classtryp.co/kyc/prov1_casa1.jpg',    'approved', v_admin, now() - interval '30 days'),
    (v_prov4_rec, 'cedula',        'https://storage.classtryp.co/kyc/prov4_cedula.jpg',   'pending', null, null),
    (v_prov4_rec, 'rut',           'https://storage.classtryp.co/kyc/prov4_rut.pdf',      'pending', null, null)
  on conflict do nothing;

  -- --------------------------------------------------------
  -- LISTINGS
  -- --------------------------------------------------------
  insert into public.listings (
    id, provider_id, category, title, description,
    location_name, location_lat, location_lng,
    price_base, price_unit, capacity_min, capacity_max,
    amenities, rules, status, rating, total_reviews
  ) values
    -- Casa 1
    (
      uuid_generate_v4(), v_prov1_rec, 'houses',
      'Villa Bocagrande Premium',
      'Casa de lujo en primera línea de mar, Bocagrande. 4 habitaciones, piscina privada, jacuzzi y vista al mar. Perfecta para grupos de hasta 12 personas.',
      'Bocagrande, Cartagena', 10.4004, -75.5499,
      850000, 'night', 4, 12,
      '["WiFi","Piscina","Jacuzzi","AC","Cocina equipada","BBQ","Parqueadero","Netflix","Vista al mar"]',
      '{"check_in":"15:00","check_out":"12:00","pets":false,"smoking":false,"parties":true,"min_nights":2}',
      'active', 4.9, 12
    ),
    -- Casa 2
    (
      uuid_generate_v4(), v_prov1_rec, 'houses',
      'Apartamento Manga Moderno',
      'Apartamento moderno en Manga. 2 habitaciones, terraza con vista a la bahía. Ideal para parejas o grupos pequeños.',
      'Manga, Cartagena', 10.4083, -75.5214,
      420000, 'night', 2, 6,
      '["WiFi","AC","Cocina equipada","Terraza","Vista bahía","Smart TV"]',
      '{"check_in":"14:00","check_out":"11:00","pets":false,"smoking":false,"parties":false,"min_nights":1}',
      'active', 4.7, 8
    ),
    -- Bote
    (
      uuid_generate_v4(), v_prov2_rec, 'boats',
      'Lancha Esmeralda 20 personas',
      'Lancha de lujo con capacidad para 20 personas. Tour por Islas del Rosario, snorkel incluido, nevera con bebidas. Capitán y marinero incluidos.',
      'Muelle Turístico de Cartagena', 10.4229, -75.5386,
      1200000, 'day', 8, 20,
      '["Nevera","Snorkel","Capitán","Marinero","Música","Toldo","Chaleco salvavidas"]',
      '{"min_hours":4,"includes":"snorkel, bebidas sin alcohol","departure":"8:00 AM","return":"4:00 PM"}',
      'active', 5.0, 10
    ),
    -- Transporte
    (
      uuid_generate_v4(), v_prov3_rec, 'transport',
      'Van Ejecutiva Aeropuerto – Cartagena',
      'Traslado aeropuerto Rafael Núñez a tu destino en Cartagena. Van climatizada, conductor profesional, hasta 8 pasajeros con equipaje.',
      'Aeropuerto Rafael Núñez, Cartagena', 10.4462, -75.5130,
      180000, 'service', 1, 8,
      '["AC","WiFi","Agua","Conductor profesional","Rastreo GPS"]',
      '{"includes":"equipaje de mano y maleta","service_hours":"06:00-22:00","note":"Confirmar vuelo 24h antes"}',
      'active', 4.8, 15
    ),
    -- Extra: Chef
    (
      uuid_generate_v4(), v_prov5_rec, 'extras',
      'Chef Privado para eventos',
      'Chef ejecutivo con experiencia en gastronomía caribeña y fusión. Incluye compra de ingredientes, preparación y servicio. Menú personalizado.',
      'A domicilio, Cartagena', null, null,
      650000, 'service', 4, 30,
      '["Menú personalizado","Ingredientes incluidos","Servicio","Maridaje"]',
      '{"advance_booking":"48 horas","includes":"ingredientes y servicio","duration":"4-6 horas"}',
      'active', 5.0, 6
    )
  on conflict do nothing;

  -- Capturar IDs de listings
  select id into v_listing1 from public.listings where title = 'Villa Bocagrande Premium';
  select id into v_listing2 from public.listings where title = 'Apartamento Manga Moderno';
  select id into v_listing3 from public.listings where title = 'Lancha Esmeralda 20 personas';
  select id into v_listing4 from public.listings where title = 'Van Ejecutiva Aeropuerto – Cartagena';
  select id into v_listing5 from public.listings where title = 'Chef Privado para eventos';

  -- --------------------------------------------------------
  -- FOTOS DE LISTINGS (placeholder URLs)
  -- --------------------------------------------------------
  insert into public.listing_photos (listing_id, url, sort_order, is_cover)
  values
    (v_listing1, 'https://storage.classtryp.co/listings/villa_boca_1.jpg', 1, true),
    (v_listing1, 'https://storage.classtryp.co/listings/villa_boca_2.jpg', 2, false),
    (v_listing1, 'https://storage.classtryp.co/listings/villa_boca_3.jpg', 3, false),
    (v_listing1, 'https://storage.classtryp.co/listings/villa_boca_4.jpg', 4, false),
    (v_listing1, 'https://storage.classtryp.co/listings/villa_boca_5.jpg', 5, false),
    (v_listing3, 'https://storage.classtryp.co/listings/lancha_1.jpg', 1, true),
    (v_listing3, 'https://storage.classtryp.co/listings/lancha_2.jpg', 2, false),
    (v_listing3, 'https://storage.classtryp.co/listings/lancha_3.jpg', 3, false),
    (v_listing3, 'https://storage.classtryp.co/listings/lancha_4.jpg', 4, false),
    (v_listing3, 'https://storage.classtryp.co/listings/lancha_5.jpg', 5, false)
  on conflict do nothing;

  -- --------------------------------------------------------
  -- BOOKING (reserva completada para mostrar flujo completo)
  -- --------------------------------------------------------
  insert into public.packages (id, client_id, group_type, adults, children, check_in, check_out, is_booked)
  values (
    uuid_generate_v4(), v_client1, 'friends', 8, 0,
    current_date + 30, current_date + 34, true
  );

  insert into public.bookings (
    id, client_id, status,
    check_in, check_out,
    base_amount, client_fee_pct, client_fee_amount, total_charged,
    confirmed_at
  ) values (
    uuid_generate_v4(), v_client1, 'confirmed',
    current_date + 30, current_date + 34,
    4400000, 5.00, 220000, 4620000,
    now()
  ) returning id into v_booking1;

  -- Items del booking
  insert into public.booking_items (
    booking_id, listing_id, provider_id, status,
    agreed_price, provider_fee_pct, provider_fee_amount, provider_payout,
    response_deadline, confirmed_at
  ) values
    -- Casa
    (v_booking1, v_listing1, v_prov1_rec, 'confirmed',
     3400000, 10.00, 340000, 3060000,
     now() + interval '24 hours', now()),
    -- Transporte
    (v_booking1, v_listing4, v_prov3_rec, 'confirmed',
     180000, 10.00, 18000, 162000,
     now() + interval '24 hours', now()),
    -- Chef
    (v_booking1, v_listing5, v_prov5_rec, 'confirmed',
     650000, 10.00, 65000, 585000,
     now() + interval '24 hours', now()),
    -- Bote
    (v_booking1, v_listing3, v_prov2_rec, 'confirmed',
     170000, 10.00, 17000, 153000,
     now() + interval '24 hours', now());

  -- Pago
  insert into public.payments (booking_id, amount, method, status, gateway, gateway_transaction_id)
  values (v_booking1, 4620000, 'card', 'completed', 'wompi', 'WOMPI-TEST-' || extract(epoch from now())::text);

  -- --------------------------------------------------------
  -- FAVORITOS
  -- --------------------------------------------------------
  insert into public.favorites (client_id, listing_id)
  values
    (v_client1, v_listing1),
    (v_client1, v_listing3),
    (v_client2, v_listing1)
  on conflict do nothing;

  -- --------------------------------------------------------
  -- DESTACADOS (para home del cliente)
  -- --------------------------------------------------------
  insert into public.featured_listings (listing_id, sort_order, is_active, created_by)
  values
    (v_listing1, 1, true, v_admin),
    (v_listing3, 2, true, v_admin),
    (v_listing5, 3, true, v_admin)
  on conflict do nothing;

  -- --------------------------------------------------------
  -- BANNERS
  -- --------------------------------------------------------
  insert into public.banners (title, image_url, target, is_active, sort_order, created_by)
  values
    ('Semana de playas en Cartagena', 'https://storage.classtryp.co/banners/playas_2026.jpg', 'all', true, 1, v_admin),
    ('Descuentos en botes privados', 'https://storage.classtryp.co/banners/botes_2026.jpg', 'clients', true, 2, v_admin)
  on conflict do nothing;

end;
$$;
