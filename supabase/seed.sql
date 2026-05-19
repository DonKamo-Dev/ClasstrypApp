-- ============================================================
-- CLASSTRYP — Seed: Datos de prueba
-- Ejecutar DESPUÉS de las 3 migrations
-- SOLO para entorno de desarrollo / staging
-- ============================================================

do $$
declare
  v_client1   uuid := 'a0000000-0000-0000-0000-000000000001';
  v_client2   uuid := 'a0000000-0000-0000-0000-000000000002';
  v_prov1     uuid := 'b0000000-0000-0000-0000-000000000001';
  v_prov2     uuid := 'b0000000-0000-0000-0000-000000000002';
  v_prov3     uuid := 'b0000000-0000-0000-0000-000000000003';
  v_prov4     uuid := 'b0000000-0000-0000-0000-000000000004';
  v_prov5     uuid := 'b0000000-0000-0000-0000-000000000005';
  v_admin     uuid := 'c0000000-0000-0000-0000-000000000001';
  v_prov1_rec uuid;
  v_prov2_rec uuid;
  v_prov3_rec uuid;
  v_prov4_rec uuid;
  v_prov5_rec uuid;
  v_listing1  uuid;
  v_listing2  uuid;
  v_listing3  uuid;
  v_listing4  uuid;
  v_listing5  uuid;
  v_booking1  uuid;
begin

  -- --------------------------------------------------------
  -- PASO 1: Crear usuarios en auth.users primero
  -- (requerido por FK profiles_id_fkey)
  -- --------------------------------------------------------
  insert into auth.users (
    id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud
  ) values
    (v_client1, 'carlos@classtryp.test',  crypt('Classtryp2026!', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Carlos Martinez","role":"client"}',    false, 'authenticated', 'authenticated'),
    (v_client2, 'laura@classtryp.test',   crypt('Classtryp2026!', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Laura Vélez","role":"client"}',         false, 'authenticated', 'authenticated'),
    (v_prov1,   'juan@classtryp.test',    crypt('Classtryp2026!', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Juan Romero","role":"provider"}',       false, 'authenticated', 'authenticated'),
    (v_prov2,   'maria@classtryp.test',   crypt('Classtryp2026!', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"María García","role":"provider"}',      false, 'authenticated', 'authenticated'),
    (v_prov3,   'roberto@classtryp.test', crypt('Classtryp2026!', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Roberto Silva","role":"provider"}',     false, 'authenticated', 'authenticated'),
    (v_prov4,   'catalina@classtryp.test',crypt('Classtryp2026!', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Catalina Cruz","role":"provider"}',     false, 'authenticated', 'authenticated'),
    (v_prov5,   'felipe@classtryp.test',  crypt('Classtryp2026!', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Felipe Torres","role":"provider"}',    false, 'authenticated', 'authenticated'),
    (v_admin,   'admin@classtryp.test',   crypt('Classtryp2026!', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin Classtryp","role":"admin"}',      false, 'authenticated', 'authenticated')
  on conflict (id) do nothing;

  -- --------------------------------------------------------
  -- PASO 2: Profiles (el trigger handle_new_user ya los crea
  -- automáticamente, pero como insertamos directo en auth.users
  -- puede que no se dispare — hacemos upsert manual)
  -- --------------------------------------------------------
  insert into public.profiles (id, role, full_name, phone)
  values
    (v_client1, 'client',   'Carlos Martinez',   '+57 300 111 2233'),
    (v_client2, 'client',   'Laura Vélez',        '+57 310 444 5566'),
    (v_prov1,   'provider', 'Juan Romero',         '+57 315 777 8899'),
    (v_prov2,   'provider', 'María García',        '+57 318 222 3344'),
    (v_prov3,   'provider', 'Roberto Silva',       '+57 313 555 6677'),
    (v_prov4,   'provider', 'Catalina Cruz',       '+57 312 888 9900'),
    (v_prov5,   'provider', 'Felipe Torres',       '+57 316 111 2200'),
    (v_admin,   'admin',    'Admin Classtryp',    '+57 300 000 0000')
  on conflict (id) do nothing;

  -- --------------------------------------------------------
  -- PASO 3: Providers
  -- --------------------------------------------------------
  insert into public.providers (user_id, category, verification_status, bio, rating, total_reviews, bank_info)
  values
    (v_prov1, 'houses', 'verified',
     'Propietario de casas de lujo en Bocagrande y Manga. 5 años ofreciendo alojamiento premium en Cartagena.',
     4.8, 24, '{"bank":"Bancolombia","account":"123-456789-00","type":"ahorros","holder":"Juan Romero"}'),
    (v_prov2, 'boats', 'verified',
     'Flota de lanchas y veleros para recorridos por las Islas del Rosario y bahía de Cartagena.',
     4.9, 18, '{"bank":"Davivienda","account":"987-654321-00","type":"corriente","holder":"María García"}'),
    (v_prov3, 'transport', 'verified',
     'Servicio de traslados aeropuerto y city tours. Flotilla de vans climatizadas para grupos.',
     4.7, 31, '{"bank":"Nequi","account":"318-222-3344","type":"nequi","holder":"Roberto Silva"}'),
    (v_prov4, 'experiences', 'pending',
     'Tours de snorkel, buceo y city tour en Cartagena. Guías certificados.',
     0, 0, null),
    (v_prov5, 'extras', 'verified',
     'Chef privado, DJ, fotógrafo y servicios de bienestar para grupos VIP en Cartagena.',
     5.0, 8, '{"bank":"Bancolombia","account":"456-789012-00","type":"ahorros","holder":"Felipe Torres"}')
  on conflict (user_id) do nothing;

  select id into v_prov1_rec from public.providers where user_id = v_prov1;
  select id into v_prov2_rec from public.providers where user_id = v_prov2;
  select id into v_prov3_rec from public.providers where user_id = v_prov3;
  select id into v_prov4_rec from public.providers where user_id = v_prov4;
  select id into v_prov5_rec from public.providers where user_id = v_prov5;

  -- --------------------------------------------------------
  -- PASO 4: KYC Documents
  -- --------------------------------------------------------
  insert into public.kyc_documents (provider_id, doc_type, url, status, reviewed_by, reviewed_at)
  values
    (v_prov1_rec, 'cedula',        'https://storage.classtryp.co/kyc/prov1_cedula.jpg', 'approved', v_admin, now() - interval '30 days'),
    (v_prov1_rec, 'rut',           'https://storage.classtryp.co/kyc/prov1_rut.pdf',   'approved', v_admin, now() - interval '30 days'),
    (v_prov1_rec, 'service_photo', 'https://storage.classtryp.co/kyc/prov1_casa1.jpg', 'approved', v_admin, now() - interval '30 days'),
    (v_prov4_rec, 'cedula',        'https://storage.classtryp.co/kyc/prov4_cedula.jpg','pending',  null,    null),
    (v_prov4_rec, 'rut',           'https://storage.classtryp.co/kyc/prov4_rut.pdf',   'pending',  null,    null)
  on conflict do nothing;

  -- --------------------------------------------------------
  -- PASO 5: Listings
  -- --------------------------------------------------------
  insert into public.listings (
    id, provider_id, category, title, description,
    location_name, location_lat, location_lng,
    price_base, price_unit, capacity_min, capacity_max,
    amenities, rules, status, rating, total_reviews
  ) values
    (uuid_generate_v4(), v_prov1_rec, 'houses',
     'Villa Bocagrande Premium',
     'Casa de lujo en primera línea de mar, Bocagrande. 4 habitaciones, piscina privada, jacuzzi y vista al mar.',
     'Bocagrande, Cartagena', 10.4004, -75.5499,
     850000, 'night', 4, 12,
     '["WiFi","Piscina","Jacuzzi","AC","Cocina equipada","BBQ","Parqueadero","Netflix","Vista al mar"]',
     '{"check_in":"15:00","check_out":"12:00","pets":false,"smoking":false,"parties":true,"min_nights":2}',
     'active', 4.9, 12),
    (uuid_generate_v4(), v_prov1_rec, 'houses',
     'Apartamento Manga Moderno',
     'Apartamento moderno en Manga. 2 habitaciones, terraza con vista a la bahía.',
     'Manga, Cartagena', 10.4083, -75.5214,
     420000, 'night', 2, 6,
     '["WiFi","AC","Cocina equipada","Terraza","Vista bahía","Smart TV"]',
     '{"check_in":"14:00","check_out":"11:00","pets":false,"smoking":false,"parties":false,"min_nights":1}',
     'active', 4.7, 8),
    (uuid_generate_v4(), v_prov2_rec, 'boats',
     'Lancha Esmeralda 20 personas',
     'Lancha de lujo con capacidad para 20 personas. Tour Islas del Rosario, snorkel incluido.',
     'Muelle Turístico de Cartagena', 10.4229, -75.5386,
     1200000, 'day', 8, 20,
     '["Nevera","Snorkel","Capitán","Marinero","Música","Toldo","Chaleco salvavidas"]',
     '{"min_hours":4,"includes":"snorkel, bebidas sin alcohol","departure":"8:00 AM","return":"4:00 PM"}',
     'active', 5.0, 10),
    (uuid_generate_v4(), v_prov3_rec, 'transport',
     'Van Ejecutiva Aeropuerto – Cartagena',
     'Traslado aeropuerto Rafael Núñez. Van climatizada, hasta 8 pasajeros.',
     'Aeropuerto Rafael Núñez, Cartagena', 10.4462, -75.5130,
     180000, 'service', 1, 8,
     '["AC","WiFi","Agua","Conductor profesional","Rastreo GPS"]',
     '{"includes":"equipaje de mano y maleta","service_hours":"06:00-22:00"}',
     'active', 4.8, 15),
    (uuid_generate_v4(), v_prov5_rec, 'extras',
     'Chef Privado para eventos',
     'Chef ejecutivo con experiencia en gastronomía caribeña. Incluye ingredientes y servicio.',
     'A domicilio, Cartagena', null, null,
     650000, 'service', 4, 30,
     '["Menú personalizado","Ingredientes incluidos","Servicio","Maridaje"]',
     '{"advance_booking":"48 horas","duration":"4-6 horas"}',
     'active', 5.0, 6)
  on conflict do nothing;

  select id into v_listing1 from public.listings where title = 'Villa Bocagrande Premium';
  select id into v_listing2 from public.listings where title = 'Apartamento Manga Moderno';
  select id into v_listing3 from public.listings where title = 'Lancha Esmeralda 20 personas';
  select id into v_listing4 from public.listings where title = 'Van Ejecutiva Aeropuerto – Cartagena';
  select id into v_listing5 from public.listings where title = 'Chef Privado para eventos';

  -- --------------------------------------------------------
  -- PASO 6: Fotos
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
  -- PASO 7: Booking de prueba
  -- --------------------------------------------------------
  insert into public.packages (id, client_id, group_type, adults, children, check_in, check_out, is_booked)
  values (uuid_generate_v4(), v_client1, 'friends', 8, 0, current_date + 30, current_date + 34, true);

  insert into public.bookings (
    id, client_id, status, check_in, check_out,
    base_amount, client_fee_pct, client_fee_amount, total_charged, confirmed_at
  ) values (
    uuid_generate_v4(), v_client1, 'confirmed',
    current_date + 30, current_date + 34,
    4400000, 5.00, 220000, 4620000, now()
  ) returning id into v_booking1;

  insert into public.booking_items (
    booking_id, listing_id, provider_id, status,
    agreed_price, provider_fee_pct, provider_fee_amount, provider_payout,
    response_deadline, confirmed_at
  ) values
    (v_booking1, v_listing1, v_prov1_rec, 'confirmed', 3400000, 10.00, 340000, 3060000, now() + interval '24h', now()),
    (v_booking1, v_listing4, v_prov3_rec, 'confirmed',  180000, 10.00,  18000,  162000, now() + interval '24h', now()),
    (v_booking1, v_listing5, v_prov5_rec, 'confirmed',  650000, 10.00,  65000,  585000, now() + interval '24h', now()),
    (v_booking1, v_listing3, v_prov2_rec, 'confirmed',  170000, 10.00,  17000,  153000, now() + interval '24h', now());

  insert into public.payments (booking_id, amount, method, status, gateway, gateway_transaction_id)
  values (v_booking1, 4620000, 'card', 'completed', 'wompi', 'WOMPI-TEST-' || extract(epoch from now())::text);

  -- --------------------------------------------------------
  -- PASO 8: Favoritos, Destacados y Banners
  -- --------------------------------------------------------
  insert into public.favorites (client_id, listing_id)
  values (v_client1, v_listing1), (v_client1, v_listing3), (v_client2, v_listing1)
  on conflict do nothing;

  insert into public.featured_listings (listing_id, sort_order, is_active, created_by)
  values (v_listing1, 1, true, v_admin), (v_listing3, 2, true, v_admin), (v_listing5, 3, true, v_admin)
  on conflict do nothing;

  insert into public.banners (title, image_url, target, is_active, sort_order, created_by)
  values
    ('Semana de playas en Cartagena', 'https://storage.classtryp.co/banners/playas_2026.jpg', 'all', true, 1, v_admin),
    ('Descuentos en botes privados',  'https://storage.classtryp.co/banners/botes_2026.jpg', 'clients', true, 2, v_admin)
  on conflict do nothing;

end;
$$;
