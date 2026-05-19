-- ============================================================
-- CLASSTRYP — Migration 002: Indexes y Triggers
-- ============================================================

-- ============================================================
-- INDEXES
-- ============================================================

-- profiles
create index idx_profiles_role on public.profiles(role);

-- providers
create index idx_providers_category on public.providers(category);
create index idx_providers_verification_status on public.providers(verification_status);
create index idx_providers_user_id on public.providers(user_id);

-- listings
create index idx_listings_provider_id on public.listings(provider_id);
create index idx_listings_category on public.listings(category);
create index idx_listings_status on public.listings(status);
create index idx_listings_category_status on public.listings(category, status);
-- Búsqueda de texto en título y descripción
create index idx_listings_title_trgm on public.listings using gin (title gin_trgm_ops);
-- Búsqueda geoespacial básica
create index idx_listings_location on public.listings(location_lat, location_lng)
  where location_lat is not null and location_lng is not null;

-- listing_photos
create index idx_listing_photos_listing_id on public.listing_photos(listing_id);
create index idx_listing_photos_cover on public.listing_photos(listing_id) where is_cover = true;

-- listing_availability
create index idx_availability_listing_date on public.listing_availability(listing_id, date);
create index idx_availability_date on public.listing_availability(date);

-- packages
create index idx_packages_client_id on public.packages(client_id);
create index idx_packages_dates on public.packages(check_in, check_out);

-- bookings
create index idx_bookings_client_id on public.bookings(client_id);
create index idx_bookings_status on public.bookings(status);
create index idx_bookings_dates on public.bookings(check_in, check_out);
create index idx_bookings_package_id on public.bookings(package_id) where package_id is not null;

-- booking_items
create index idx_booking_items_booking_id on public.booking_items(booking_id);
create index idx_booking_items_provider_id on public.booking_items(provider_id);
create index idx_booking_items_listing_id on public.booking_items(listing_id);
create index idx_booking_items_status on public.booking_items(status);
create index idx_booking_items_deadline on public.booking_items(response_deadline)
  where status = 'pending';

-- payments
create index idx_payments_booking_id on public.payments(booking_id);
create index idx_payments_status on public.payments(status);
create index idx_payments_gateway_txid on public.payments(gateway_transaction_id)
  where gateway_transaction_id is not null;

-- payouts
create index idx_payouts_provider_id on public.payouts(provider_id);
create index idx_payouts_status on public.payouts(status);

-- reviews
create index idx_reviews_listing_id on public.reviews(listing_id);
create index idx_reviews_provider_id on public.reviews(provider_id);
create index idx_reviews_client_id on public.reviews(client_id);

-- disputes
create index idx_disputes_booking_id on public.disputes(booking_id);
create index idx_disputes_status on public.disputes(status);
create index idx_disputes_opened_by on public.disputes(opened_by);

-- messages
create index idx_messages_booking_id on public.messages(booking_id);
create index idx_messages_sender_id on public.messages(sender_id);
create index idx_messages_created_at on public.messages(booking_id, created_at desc);

-- notifications
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id) where is_read = false;

-- favorites
create index idx_favorites_client_id on public.favorites(client_id);
create index idx_favorites_listing_id on public.favorites(listing_id);

-- kyc_documents
create index idx_kyc_provider_id on public.kyc_documents(provider_id);
create index idx_kyc_status on public.kyc_documents(status);

-- ============================================================
-- FUNCIÓN: set_updated_at()
-- Actualiza automáticamente updated_at en cada UPDATE
-- ============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Aplicar trigger a todas las tablas con updated_at
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_updated_at_providers
  before update on public.providers
  for each row execute function public.set_updated_at();

create trigger set_updated_at_listings
  before update on public.listings
  for each row execute function public.set_updated_at();

create trigger set_updated_at_packages
  before update on public.packages
  for each row execute function public.set_updated_at();

create trigger set_updated_at_bookings
  before update on public.bookings
  for each row execute function public.set_updated_at();

create trigger set_updated_at_booking_items
  before update on public.booking_items
  for each row execute function public.set_updated_at();

create trigger set_updated_at_banners
  before update on public.banners
  for each row execute function public.set_updated_at();

-- ============================================================
-- FUNCIÓN: handle_new_user()
-- Crea automáticamente un profile cuando se registra un usuario
-- en Supabase Auth
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- FUNCIÓN: update_listing_rating()
-- Recalcula rating y total_reviews de un listing cuando
-- se inserta/actualiza/elimina una reseña
-- ============================================================

create or replace function public.update_listing_rating()
returns trigger language plpgsql as $$
declare
  v_listing_id uuid;
  v_provider_id uuid;
begin
  -- Determinar el listing_id a actualizar
  if TG_OP = 'DELETE' then
    v_listing_id := old.listing_id;
    v_provider_id := old.provider_id;
  else
    v_listing_id := new.listing_id;
    v_provider_id := new.provider_id;
  end if;

  -- Actualizar stats del listing
  update public.listings
  set
    rating = (
      select coalesce(round(avg(rating)::numeric, 2), 0)
      from public.reviews
      where listing_id = v_listing_id
    ),
    total_reviews = (
      select count(*) from public.reviews where listing_id = v_listing_id
    )
  where id = v_listing_id;

  -- Actualizar rating global del proveedor (promedio de todos sus listings)
  update public.providers
  set
    rating = (
      select coalesce(round(avg(r.rating)::numeric, 2), 0)
      from public.reviews r
      where r.provider_id = v_provider_id
    ),
    total_reviews = (
      select count(*) from public.reviews where provider_id = v_provider_id
    )
  where id = v_provider_id;

  return coalesce(new, old);
end;
$$;

create trigger on_review_changed
  after insert or update or delete on public.reviews
  for each row execute function public.update_listing_rating();

-- ============================================================
-- FUNCIÓN: set_booking_item_deadline()
-- Establece el plazo de 24h para respuesta del proveedor
-- ============================================================

create or replace function public.set_booking_item_deadline()
returns trigger language plpgsql as $$
begin
  new.response_deadline = new.created_at + interval '24 hours';
  return new;
end;
$$;

create trigger set_deadline_on_booking_item
  before insert on public.booking_items
  for each row execute function public.set_booking_item_deadline();

-- ============================================================
-- FUNCIÓN: set_dispute_mediation_deadline()
-- Establece 48h de plazo de mediación entre partes
-- ============================================================

create or replace function public.set_dispute_mediation_deadline()
returns trigger language plpgsql as $$
begin
  if new.status = 'mediation' and old.status = 'open' then
    new.mediation_deadline = now() + interval '48 hours';
  end if;
  return new;
end;
$$;

create trigger set_dispute_deadline
  before update on public.disputes
  for each row execute function public.set_dispute_mediation_deadline();

-- ============================================================
-- FUNCIÓN: update_booking_stats()
-- Actualiza total_bookings en listings y providers cuando
-- se completa un booking_item
-- ============================================================

create or replace function public.update_booking_stats()
returns trigger language plpgsql as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    update public.listings
    set total_bookings = total_bookings + 1
    where id = new.listing_id;

    update public.providers
    set total_bookings = total_bookings + 1
    where id = new.provider_id;
  end if;
  return new;
end;
$$;

create trigger on_booking_item_completed
  after update on public.booking_items
  for each row execute function public.update_booking_stats();

-- ============================================================
-- FUNCIÓN: cancel_expired_booking_items()
-- Cancela booking_items que vencieron sin respuesta del proveedor
-- Ejecutar periódicamente (cron job en Supabase o Edge Function)
-- ============================================================

create or replace function public.cancel_expired_booking_items()
returns integer language plpgsql security definer as $$
declare
  v_count integer;
begin
  update public.booking_items
  set
    status = 'cancelled',
    rejection_reason = 'Sin respuesta del proveedor en 24 horas'
  where
    status = 'pending'
    and response_deadline < now();

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- ============================================================
-- VISTA: admin_booking_summary
-- Vista para el panel admin con info consolidada de reservas
-- ============================================================

create or replace view public.admin_booking_summary as
select
  b.id,
  b.status,
  b.check_in,
  b.check_out,
  b.total_charged,
  b.base_amount,
  b.client_fee_amount,
  -- Info cliente
  cp.full_name as client_name,
  -- Total comisión Classtryp en esta reserva
  b.client_fee_amount + coalesce(sum(bi.provider_fee_amount), 0) as total_commission,
  -- Total pago a proveedores
  coalesce(sum(bi.provider_payout), 0) as total_payout_to_providers,
  count(bi.id) as services_count,
  b.created_at
from public.bookings b
join public.profiles cp on cp.id = b.client_id
left join public.booking_items bi on bi.booking_id = b.id
group by b.id, cp.full_name;
