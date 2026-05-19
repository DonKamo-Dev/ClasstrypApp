# Classtryp — Supabase Database

## Orden de ejecución

Ejecutar en el SQL Editor de Supabase en este orden:

```
1. migrations/001_initial_schema.sql   → Enums, tablas, constraints
2. migrations/002_indexes_triggers.sql → Indexes, triggers, vistas
3. migrations/003_rls_policies.sql     → Row Level Security
4. seed.sql                            → Solo en dev/staging
```

## Tablas principales

| Tabla | Descripción |
|---|---|
| `profiles` | Extiende auth.users — clientes, proveedores, admin |
| `providers` | Perfil extendido del proveedor (1 por usuario) |
| `kyc_documents` | Documentos de verificación del proveedor |
| `listings` | Servicios publicados (casas, botes, etc.) |
| `listing_photos` | Galería de fotos por listing |
| `listing_availability` | Calendario de disponibilidad |
| `packages` | Paquetes armados por el wizard |
| `bookings` | Reservas confirmadas |
| `booking_items` | Servicios individuales por reserva |
| `payments` | Transacciones de pago (Wompi/PayU) |
| `payouts` | Retiros de proveedores |
| `reviews` | Reseñas de clientes |
| `disputes` | Disputas e incidencias |
| `messages` | Chat entre cliente y proveedor |
| `notifications` | Notificaciones in-app |
| `favorites` | Listings guardados por clientes |
| `featured_listings` | Destacados del home (Admin) |
| `banners` | Banners de la sección Explorar (Admin) |
| `push_notifications_log` | Historial de push masivos (Admin) |

## Comisiones (reglas de negocio hardcodeadas)

```
Cliente paga:     precio_base × 1.05   (5% tarifa de gestión)
Proveedor recibe: precio_base × 0.90   (10% comisión)
Classtryp gana:   precio_base × 0.15   (15% total)
```

Campos en `bookings`:
- `client_fee_pct` = 5.00 (default)
- `client_fee_amount` = base_amount × 0.05

Campos en `booking_items`:
- `provider_fee_pct` = 10.00 (default)
- `provider_fee_amount` = agreed_price × 0.10
- `provider_payout` = agreed_price - provider_fee_amount

## Variables de entorno requeridas (app)

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  ← Solo en backend/admin, NUNCA en cliente
```

## Realtime (Supabase)

Tablas con Realtime habilitado (configurar en Supabase Dashboard):
- `messages` — Chat en tiempo real
- `notifications` — Notificaciones en tiempo real
- `booking_items` — Updates de aceptación/rechazo del proveedor

## Storage Buckets requeridos

Crear en Supabase Storage:
- `listings` — Fotos de listings (público)
- `kyc` — Documentos KYC (privado, solo proveedor + admin)
- `banners` — Banners del admin (público)
- `avatars` — Fotos de perfil de usuarios (público)
