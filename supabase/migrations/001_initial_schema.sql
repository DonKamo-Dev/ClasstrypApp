-- ============================================================
-- CLASSTRYP — Migration 001: Schema inicial
-- Plataforma de travel planning para Cartagena de Indias
-- ============================================================

-- Extensiones requeridas
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- búsqueda por texto

-- ============================================================
-- TIPOS ENUM
-- ============================================================

create type user_role as enum ('client', 'provider', 'admin');

create type provider_category as enum (
  'houses',       -- Casas / Villas
  'transport',    -- Transporte
  'boats',        -- Botes / Yates
  'experiences',  -- Experiencias
  'extras'        -- Servicios Extras
);

create type verification_status as enum (
  'pending',
  'verified',
  'rejected',
  'suspended'
);

create type listing_status as enum (
  'active',
  'inactive',
  'pending_review',
  'suspended'
);

create type price_unit as enum (
  'night',    -- por noche (casas)
  'day',      -- por día (botes, transporte)
  'service',  -- por servicio (experiencias, extras)
  'hour'      -- por hora (algunos extras)
);

create type booking_status as enum (
  'pending',    -- esperando confirmación del proveedor (24h)
  'confirmed',  -- proveedor aceptó, pago procesado
  'active',     -- check-in realizado
  'completed',  -- servicio prestado
  'cancelled',  -- cancelado (con política de reembolso)
  'disputed'    -- en disputa
);

create type booking_item_status as enum (
  'pending',
  'confirmed',
  'rejected',
  'completed',
  'cancelled'
);

create type payment_status as enum (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
  'partially_refunded'
);

create type payment_method as enum (
  'card',
  'pse',
  'transfer',
  'nequi'
);

create type payment_gateway as enum (
  'wompi',
  'payu'
);

create type payout_status as enum (
  'pending',
  'approved',
  'rejected',
  'transferred'
);

create type dispute_status as enum (
  'open',          -- recién abierta
  'mediation',     -- en período de mediación (48h entre partes)
  'admin_review',  -- Admin intervino
  'resolved'
);

create type notification_type as enum (
  'booking_new',
  'booking_confirmed',
  'booking_rejected',
  'booking_cancelled',
  'booking_completed',
  'payment_received',
  'payment_refunded',
  'payout_approved',
  'payout_rejected',
  'dispute_opened',
  'dispute_resolved',
  'review_received',
  'kyc_approved',
  'kyc_rejected',
  'system'
);

create type kyc_doc_type as enum (
  'cedula',
  'rut',
  'service_photo',
  'bank_certificate',
  'other'
);

create type kyc_doc_status as enum (
  'pending',
  'approved',
  'rejected'
);

create type push_target as enum (
  'all',
  'clients',
  'providers'
);

create type group_type as enum (
  'friends',
  'family',
  'couple',
  'corporate'
);

-- ============================================================
-- TABLA: profiles
-- Extiende auth.users con datos de la plataforma
-- ============================================================

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  role          user_role not null default 'client',
  full_name     text not null,
  phone         text,
  avatar_url    text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- TABLA: providers
-- Perfil extendido para usuarios con rol 'provider'
-- ============================================================

create table public.providers (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null unique references public.profiles(id) on delete cascade,
  category              provider_category not null,
  verification_status   verification_status not null default 'pending',
  bio                   text,
  rating                numeric(3,2) default 0 check (rating >= 0 and rating <= 5),
  total_reviews         integer not null default 0,
  total_bookings        integer not null default 0,
  -- Datos bancarios para retiros (encriptado en capa de aplicación)
  bank_info             jsonb,
  -- Notas internas del Admin (solo visible para admin)
  admin_notes           text,
  verified_at           timestamptz,
  suspended_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ============================================================
-- TABLA: kyc_documents
-- Documentos KYC subidos por el proveedor
-- ============================================================

create table public.kyc_documents (
  id            uuid primary key default uuid_generate_v4(),
  provider_id   uuid not null references public.providers(id) on delete cascade,
  doc_type      kyc_doc_type not null,
  url           text not null,
  status        kyc_doc_status not null default 'pending',
  admin_notes   text,
  uploaded_at   timestamptz not null default now(),
  reviewed_at   timestamptz,
  reviewed_by   uuid references public.profiles(id)
);

-- ============================================================
-- TABLA: listings
-- Servicios publicados por proveedores
-- ============================================================

create table public.listings (
  id              uuid primary key default uuid_generate_v4(),
  provider_id     uuid not null references public.providers(id) on delete cascade,
  category        provider_category not null,
  title           text not null,
  description     text,
  -- Ubicación (principalmente para casas y transporte)
  location_name   text,
  location_lat    numeric(10,7),
  location_lng    numeric(10,7),
  -- Precio
  price_base      numeric(12,2) not null check (price_base > 0),
  price_unit      price_unit not null,
  -- Capacidad
  capacity_min    integer not null default 1,
  capacity_max    integer not null,
  -- Metadatos específicos por categoría
  amenities       jsonb default '[]',   -- ["WiFi","Piscina","AC"]
  rules           jsonb default '{}',   -- {"pets":false,"smoking":false}
  extras_info     jsonb default '{}',   -- info adicional según categoría
  -- Estado
  status          listing_status not null default 'pending_review',
  -- Stats denormalizados (actualizados por triggers)
  rating          numeric(3,2) default 0 check (rating >= 0 and rating <= 5),
  total_reviews   integer not null default 0,
  total_bookings  integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- TABLA: listing_photos
-- Galería de fotos por listing (mínimo 5 requeridas)
-- ============================================================

create table public.listing_photos (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  url         text not null,
  sort_order  integer not null default 0,
  is_cover    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- TABLA: listing_availability
-- Calendario de disponibilidad por listing
-- ============================================================

create table public.listing_availability (
  id              uuid primary key default uuid_generate_v4(),
  listing_id      uuid not null references public.listings(id) on delete cascade,
  date            date not null,
  is_blocked      boolean not null default true,
  custom_price    numeric(12,2),  -- precio especial para ese día (null = precio base)
  block_reason    text,           -- "Mantenimiento", "Reserva personal", etc.
  created_at      timestamptz not null default now(),
  unique (listing_id, date)
);

-- ============================================================
-- TABLA: packages
-- Paquetes armados por el wizard del cliente
-- Se convierten en bookings al momento de pagar
-- ============================================================

create table public.packages (
  id              uuid primary key default uuid_generate_v4(),
  client_id       uuid not null references public.profiles(id) on delete cascade,
  group_type      group_type,
  adults          integer not null default 1 check (adults > 0),
  children        integer not null default 0 check (children >= 0),
  check_in        date not null,
  check_out       date not null,
  budget_min      numeric(12,2),
  budget_max      numeric(12,2),
  preferences     jsonb default '[]',  -- ["beach","party","relax"]
  -- Estado del paquete
  is_booked       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint check_dates check (check_out > check_in),
  constraint check_budget check (
    budget_max is null or budget_min is null or budget_max >= budget_min
  )
);

-- ============================================================
-- TABLA: bookings
-- Reservas confirmadas de la plataforma
-- ============================================================

create table public.bookings (
  id                  uuid primary key default uuid_generate_v4(),
  -- Referencia al paquete del wizard (null si viene del catálogo directo)
  package_id          uuid references public.packages(id),
  client_id           uuid not null references public.profiles(id),
  status              booking_status not null default 'pending',
  check_in            date not null,
  check_out           date not null,
  -- Montos (en COP)
  base_amount         numeric(12,2) not null check (base_amount > 0),
  client_fee_pct      numeric(5,2) not null default 5.00,   -- % tarifa cliente
  client_fee_amount   numeric(12,2) not null,               -- base * 5%
  total_charged       numeric(12,2) not null,               -- base + client_fee
  -- Timestamps de ciclo de vida
  confirmed_at        timestamptz,
  cancelled_at        timestamptz,
  completed_at        timestamptz,
  cancellation_reason text,
  -- Admin notes
  admin_notes         text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint check_dates check (check_out >= check_in),
  constraint check_amounts check (
    total_charged = base_amount + client_fee_amount
  )
);

-- ============================================================
-- TABLA: booking_items
-- Servicios individuales dentro de una reserva
-- Cada item = 1 proveedor
-- ============================================================

create table public.booking_items (
  id                    uuid primary key default uuid_generate_v4(),
  booking_id            uuid not null references public.bookings(id) on delete cascade,
  listing_id            uuid not null references public.listings(id),
  provider_id           uuid not null references public.providers(id),
  status                booking_item_status not null default 'pending',
  -- Precio pactado
  agreed_price          numeric(12,2) not null check (agreed_price > 0),
  -- Comisión Classtryp al proveedor
  provider_fee_pct      numeric(5,2) not null default 10.00,  -- 10%
  provider_fee_amount   numeric(12,2) not null,
  provider_payout       numeric(12,2) not null,               -- agreed_price - fee
  -- Ciclo de vida del item
  confirmed_at          timestamptz,
  rejected_at           timestamptz,
  rejection_reason      text,
  completed_at          timestamptz,
  -- Plazo de respuesta: 24h desde created_at
  response_deadline     timestamptz not null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint check_payout check (
    provider_payout = agreed_price - provider_fee_amount
  )
);

-- ============================================================
-- TABLA: payments
-- Transacciones de pago (via Wompi / PayU)
-- ============================================================

create table public.payments (
  id                      uuid primary key default uuid_generate_v4(),
  booking_id              uuid not null references public.bookings(id),
  amount                  numeric(12,2) not null check (amount > 0),
  currency                char(3) not null default 'COP',
  method                  payment_method not null,
  status                  payment_status not null default 'pending',
  gateway                 payment_gateway not null,
  gateway_transaction_id  text unique,
  gateway_response        jsonb,   -- respuesta completa del gateway
  refund_amount           numeric(12,2) default 0,
  refund_reason           text,
  created_at              timestamptz not null default now(),
  completed_at            timestamptz,
  refunded_at             timestamptz
);

-- ============================================================
-- TABLA: payouts
-- Retiros de ganancias solicitados por proveedores
-- ============================================================

create table public.payouts (
  id              uuid primary key default uuid_generate_v4(),
  provider_id     uuid not null references public.providers(id),
  amount          numeric(12,2) not null check (amount > 0),
  -- Cuenta destino snapshot al momento del retiro
  bank_info       jsonb not null,
  status          payout_status not null default 'pending',
  admin_notes     text,
  -- Quién procesó (Admin)
  processed_by    uuid references public.profiles(id),
  requested_at    timestamptz not null default now(),
  processed_at    timestamptz,
  transferred_at  timestamptz
);

-- ============================================================
-- TABLA: reviews
-- Reseñas del cliente sobre el servicio recibido
-- ============================================================

create table public.reviews (
  id            uuid primary key default uuid_generate_v4(),
  booking_id    uuid not null references public.bookings(id),
  listing_id    uuid not null references public.listings(id),
  client_id     uuid not null references public.profiles(id),
  provider_id   uuid not null references public.providers(id),
  rating        numeric(2,1) not null check (rating >= 1 and rating <= 5),
  comment       text,
  created_at    timestamptz not null default now(),
  -- Un cliente puede dejar máximo 1 reseña por servicio por reserva
  unique (booking_id, listing_id, client_id)
);

-- ============================================================
-- TABLA: disputes
-- Disputas e incidencias entre cliente y proveedor
-- ============================================================

create table public.disputes (
  id              uuid primary key default uuid_generate_v4(),
  booking_id      uuid not null references public.bookings(id),
  opened_by       uuid not null references public.profiles(id),
  reason          text not null,
  description     text,
  status          dispute_status not null default 'open',
  -- Resolución
  resolution      text,
  resolved_by     uuid references public.profiles(id),  -- admin que intervino
  -- Plazos (48h de mediación entre las partes)
  mediation_deadline  timestamptz,
  opened_at       timestamptz not null default now(),
  resolved_at     timestamptz
);

-- ============================================================
-- TABLA: messages
-- Chat en tiempo real entre cliente y proveedor por reserva
-- ============================================================

create table public.messages (
  id              uuid primary key default uuid_generate_v4(),
  booking_id      uuid not null references public.bookings(id),
  sender_id       uuid not null references public.profiles(id),
  content         text not null,
  attachment_url  text,
  created_at      timestamptz not null default now(),
  read_at         timestamptz
);

-- ============================================================
-- TABLA: notifications
-- Notificaciones in-app por usuario
-- ============================================================

create table public.notifications (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  type            notification_type not null,
  title           text not null,
  body            text,
  -- Referencia al objeto relacionado (booking, dispute, etc.)
  reference_id    uuid,
  reference_table text,
  is_read         boolean not null default false,
  created_at      timestamptz not null default now(),
  read_at         timestamptz
);

-- ============================================================
-- TABLA: favorites
-- Listings guardados por clientes
-- ============================================================

create table public.favorites (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (client_id, listing_id)
);

-- ============================================================
-- TABLA: featured_listings
-- Listings destacados en el home del cliente (gestionado por Admin)
-- ============================================================

create table public.featured_listings (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null unique references public.listings(id) on delete cascade,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- TABLA: banners
-- Banners de la sección Explorar (gestionado por Admin)
-- ============================================================

create table public.banners (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  image_url   text not null,
  target      push_target not null default 'all',
  link_url    text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- TABLA: push_notifications_log
-- Registro de notificaciones push masivas enviadas por Admin
-- ============================================================

create table public.push_notifications_log (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  message     text not null,
  target      push_target not null,
  sent_count  integer not null default 0,
  sent_by     uuid references public.profiles(id),
  sent_at     timestamptz not null default now()
);
