-- ============================================================
-- CLASSTRYP — Migration 003: Row Level Security (RLS)
-- ============================================================
-- Principios:
--   • Clientes: ven su propio data + listings activos públicos
--   • Proveedores: gestionan sus propios listings/bookings
--   • Admin: acceso total (usa service_role o rol admin en profiles)
-- ============================================================

-- Habilitar RLS en todas las tablas
alter table public.profiles              enable row level security;
alter table public.providers             enable row level security;
alter table public.kyc_documents         enable row level security;
alter table public.listings              enable row level security;
alter table public.listing_photos        enable row level security;
alter table public.listing_availability  enable row level security;
alter table public.packages              enable row level security;
alter table public.bookings              enable row level security;
alter table public.booking_items         enable row level security;
alter table public.payments              enable row level security;
alter table public.payouts               enable row level security;
alter table public.reviews               enable row level security;
alter table public.disputes              enable row level security;
alter table public.messages              enable row level security;
alter table public.notifications         enable row level security;
alter table public.favorites             enable row level security;
alter table public.featured_listings     enable row level security;
alter table public.banners               enable row level security;
alter table public.push_notifications_log enable row level security;

-- ============================================================
-- HELPER FUNCTION: get_my_role()
-- Retorna el rol del usuario autenticado actual
-- ============================================================

create or replace function public.get_my_role()
returns user_role language sql security definer stable as $$
  select role from public.profiles where id = auth.uid()
$$;

-- ============================================================
-- HELPER FUNCTION: get_my_provider_id()
-- Retorna el provider.id del usuario autenticado
-- ============================================================

create or replace function public.get_my_provider_id()
returns uuid language sql security definer stable as $$
  select id from public.providers where user_id = auth.uid()
$$;

-- ============================================================
-- PROFILES
-- ============================================================

-- Cada usuario ve y edita solo su propio perfil
create policy "profiles: own profile"
  on public.profiles for all
  using (id = auth.uid());

-- Admin ve todos los perfiles
create policy "profiles: admin sees all"
  on public.profiles for select
  using (public.get_my_role() = 'admin');

-- ============================================================
-- PROVIDERS
-- ============================================================

-- Proveedor gestiona su propio registro
create policy "providers: manage own"
  on public.providers for all
  using (user_id = auth.uid());

-- Clientes ven proveedores verificados (para ver perfil en app)
create policy "providers: clients see verified"
  on public.providers for select
  using (
    verification_status = 'verified'
    and public.get_my_role() = 'client'
  );

-- Admin gestiona todos
create policy "providers: admin full access"
  on public.providers for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- KYC DOCUMENTS
-- ============================================================

-- Proveedor sube y ve sus propios documentos
create policy "kyc: own documents"
  on public.kyc_documents for all
  using (
    provider_id = public.get_my_provider_id()
  );

-- Admin ve y gestiona todos
create policy "kyc: admin full access"
  on public.kyc_documents for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- LISTINGS
-- ============================================================

-- Público: cualquier usuario autenticado puede ver listings activos
create policy "listings: public see active"
  on public.listings for select
  using (status = 'active');

-- Proveedor gestiona sus propios listings
create policy "listings: provider manages own"
  on public.listings for all
  using (provider_id = public.get_my_provider_id());

-- Admin gestiona todos
create policy "listings: admin full access"
  on public.listings for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- LISTING PHOTOS
-- ============================================================

-- Público ve fotos de listings activos
create policy "listing_photos: public see active"
  on public.listing_photos for select
  using (
    exists (
      select 1 from public.listings
      where id = listing_photos.listing_id and status = 'active'
    )
  );

-- Proveedor gestiona fotos de sus listings
create policy "listing_photos: provider manages own"
  on public.listing_photos for all
  using (
    exists (
      select 1 from public.listings l
      join public.providers p on p.id = l.provider_id
      where l.id = listing_photos.listing_id and p.user_id = auth.uid()
    )
  );

-- Admin acceso total
create policy "listing_photos: admin full access"
  on public.listing_photos for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- LISTING AVAILABILITY
-- ============================================================

-- Cualquier usuario autenticado ve disponibilidad
create policy "availability: public read"
  on public.listing_availability for select
  using (true);

-- Proveedor gestiona su propia disponibilidad
create policy "availability: provider manages own"
  on public.listing_availability for all
  using (
    exists (
      select 1 from public.listings l
      join public.providers p on p.id = l.provider_id
      where l.id = listing_availability.listing_id and p.user_id = auth.uid()
    )
  );

-- Admin acceso total
create policy "availability: admin full access"
  on public.listing_availability for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- PACKAGES
-- ============================================================

-- Cliente solo ve sus propios paquetes
create policy "packages: own"
  on public.packages for all
  using (client_id = auth.uid());

-- Admin ve todos
create policy "packages: admin full access"
  on public.packages for select
  using (public.get_my_role() = 'admin');

-- ============================================================
-- BOOKINGS
-- ============================================================

-- Cliente ve sus propias reservas
create policy "bookings: client sees own"
  on public.bookings for select
  using (client_id = auth.uid());

-- Cliente puede crear reservas
create policy "bookings: client creates"
  on public.bookings for insert
  with check (client_id = auth.uid());

-- Cliente puede cancelar sus reservas (UPDATE limitado)
create policy "bookings: client cancels"
  on public.bookings for update
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

-- Proveedor ve reservas que incluyen sus servicios
create policy "bookings: provider sees own"
  on public.bookings for select
  using (
    exists (
      select 1 from public.booking_items bi
      where bi.booking_id = bookings.id
        and bi.provider_id = public.get_my_provider_id()
    )
  );

-- Admin ve y gestiona todas las reservas
create policy "bookings: admin full access"
  on public.bookings for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- BOOKING ITEMS
-- ============================================================

-- Cliente ve items de sus reservas
create policy "booking_items: client sees own"
  on public.booking_items for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_items.booking_id and b.client_id = auth.uid()
    )
  );

-- Proveedor ve y gestiona sus propios items (aceptar/rechazar)
create policy "booking_items: provider manages own"
  on public.booking_items for all
  using (provider_id = public.get_my_provider_id());

-- Admin acceso total
create policy "booking_items: admin full access"
  on public.booking_items for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- PAYMENTS
-- ============================================================

-- Cliente ve pagos de sus reservas
create policy "payments: client sees own"
  on public.payments for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = payments.booking_id and b.client_id = auth.uid()
    )
  );

-- Proveedor ve pagos de reservas donde tiene items
create policy "payments: provider sees own"
  on public.payments for select
  using (
    exists (
      select 1 from public.bookings b
      join public.booking_items bi on bi.booking_id = b.id
      where b.id = payments.booking_id
        and bi.provider_id = public.get_my_provider_id()
    )
  );

-- Admin acceso total
create policy "payments: admin full access"
  on public.payments for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- PAYOUTS
-- ============================================================

-- Proveedor ve sus propios retiros
create policy "payouts: provider sees own"
  on public.payouts for select
  using (provider_id = public.get_my_provider_id());

-- Proveedor puede solicitar retiro
create policy "payouts: provider requests"
  on public.payouts for insert
  with check (provider_id = public.get_my_provider_id());

-- Admin gestiona todos los retiros
create policy "payouts: admin full access"
  on public.payouts for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- REVIEWS
-- ============================================================

-- Cualquier usuario autenticado ve reseñas
create policy "reviews: public read"
  on public.reviews for select
  using (true);

-- Cliente puede crear reseñas de sus reservas completadas
create policy "reviews: client creates"
  on public.reviews for insert
  with check (
    client_id = auth.uid()
    and exists (
      select 1 from public.bookings b
      where b.id = reviews.booking_id
        and b.client_id = auth.uid()
        and b.status = 'completed'
    )
  );

-- Admin puede eliminar reseñas inapropiadas
create policy "reviews: admin manages"
  on public.reviews for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- DISPUTES
-- ============================================================

-- Cliente ve disputas de sus reservas
create policy "disputes: client sees own"
  on public.disputes for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = disputes.booking_id and b.client_id = auth.uid()
    )
  );

-- Proveedor ve disputas que le conciernen
create policy "disputes: provider sees own"
  on public.disputes for select
  using (
    exists (
      select 1 from public.bookings b
      join public.booking_items bi on bi.booking_id = b.id
      where b.id = disputes.booking_id
        and bi.provider_id = public.get_my_provider_id()
    )
  );

-- Cliente o proveedor puede abrir una disputa
create policy "disputes: parties open"
  on public.disputes for insert
  with check (opened_by = auth.uid());

-- Admin gestiona todas las disputas
create policy "disputes: admin full access"
  on public.disputes for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- MESSAGES
-- ============================================================

-- Partes de la reserva ven los mensajes
create policy "messages: booking parties read"
  on public.messages for select
  using (
    exists (
      select 1 from public.bookings b
      left join public.booking_items bi on bi.booking_id = b.id
      where b.id = messages.booking_id
        and (
          b.client_id = auth.uid()
          or bi.provider_id = public.get_my_provider_id()
        )
    )
  );

-- Partes de la reserva pueden enviar mensajes
create policy "messages: booking parties write"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.bookings b
      left join public.booking_items bi on bi.booking_id = b.id
      where b.id = messages.booking_id
        and (
          b.client_id = auth.uid()
          or bi.provider_id = public.get_my_provider_id()
        )
    )
  );

-- Admin lee todos los mensajes (para gestión de disputas)
create policy "messages: admin reads all"
  on public.messages for select
  using (public.get_my_role() = 'admin');

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

-- Cada usuario ve solo sus notificaciones
create policy "notifications: own"
  on public.notifications for all
  using (user_id = auth.uid());

-- Admin ve todas
create policy "notifications: admin sees all"
  on public.notifications for select
  using (public.get_my_role() = 'admin');

-- ============================================================
-- FAVORITES
-- ============================================================

-- Cliente gestiona sus favoritos
create policy "favorites: own"
  on public.favorites for all
  using (client_id = auth.uid());

-- ============================================================
-- FEATURED LISTINGS
-- ============================================================

-- Todos los usuarios autenticados ven destacados activos
create policy "featured_listings: public read"
  on public.featured_listings for select
  using (is_active = true);

-- Solo Admin gestiona
create policy "featured_listings: admin manages"
  on public.featured_listings for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- BANNERS
-- ============================================================

-- Todos ven banners activos
create policy "banners: public read"
  on public.banners for select
  using (is_active = true);

-- Solo Admin gestiona
create policy "banners: admin manages"
  on public.banners for all
  using (public.get_my_role() = 'admin');

-- ============================================================
-- PUSH NOTIFICATIONS LOG
-- ============================================================

-- Solo Admin
create policy "push_log: admin only"
  on public.push_notifications_log for all
  using (public.get_my_role() = 'admin');
