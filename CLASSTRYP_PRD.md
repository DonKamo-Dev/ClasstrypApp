# Classtryp — Product Requirements Document (PRD)
**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Estado:** En diseño

---

## 1. Visión del Producto

**Classtryp** es una plataforma de travel planning para Cartagena de Indias.  
No es solo un Airbnb — es un armador de paquetes de viaje completos donde el cliente entra, elige cada componente de su estadía y paga todo en una sola transacción.

> **"Arma tu viaje a Cartagena sin líos: casa, transporte, bote, experiencias y extras — todo en un solo pago."**

---

## 2. El Problema que Resuelve

Hoy en día, organizar un viaje a Cartagena en grupo requiere:
- Buscar casa en Airbnb
- Buscar bote por WhatsApp o Instagram
- Coordinar traslados del aeropuerto por separado
- Contratar experiencias en TripAdvisor u otro
- Buscar chef, fotógrafo, masajista cada uno por su cuenta
- Hacer 5-10 pagos diferentes a 5-10 personas distintas
- Coordinar todo sin saber si hay disponibilidad cruzada

**Classtryp lo resuelve en un solo flujo.**

---

## 3. Propuesta de Valor

| Para el **Cliente** | Para el **Proveedor** |
|---|---|
| Arma su paquete completo en minutos | Consigue clientes sin marketing |
| Un solo pago para todo | Gestiona reservas desde la app |
| Disponibilidad en tiempo real | Recibe pagos seguros y puntuales |
| Sin WhatsApp de ida y vuelta | Sin cobros en efectivo |
| Paquetes con IA según su presupuesto | Panel de ganancias claro |

---

## 4. Usuarios de la Plataforma

### 4.1 Cliente
Persona que viaja a Cartagena — grupos de amigos, familias, parejas, corporativos.  
Quiere organizar su viaje completo sin fricciones.

### 4.2 Proveedor
Persona o empresa que ofrece servicios en Cartagena.  
**Un proveedor solo puede registrarse en UNA categoría.**

| Categoría | Ejemplos |
|---|---|
| 🏠 Casas / Villas | Propietarios de casas, apartamentos, fincas |
| 🚐 Transporte | Traslados aeropuerto, vans privadas, conductores |
| 🛥️ Botes / Yates | Propietarios de lanchas, veleros, yates |
| 🤿 Experiencias | Tours, snorkel, city tours, buceo, kite |
| ✨ Servicios Extras | Chef, seguridad, enfermera, tatuador, masajista, DJ, fotógrafo |

### 4.3 Admin (Classtryp)
Panel web de control total: aprobar proveedores, gestionar reservas, ver comisiones, resolver disputas.

---

## 5. Modelo de Negocio

### Comisión por reserva — Modelo Airbnb

- Registro de clientes: **GRATIS**
- Registro de proveedores: **GRATIS**
- Classtryp cobra una comisión en cada reserva completada

**Estructura de comisión:**
```
Cliente paga:     Precio del servicio + 5% "Tarifa de gestión" (visible en el resumen)
Proveedor recibe: Precio del servicio - 10% comisión proveedor
Classtryp retiene: 5% (cliente) + 10% (proveedor) = 15% por reserva
```

**Ejemplo real:**
```
Servicio vale:    $1.000.000 COP
Cliente paga:     $1.050.000 COP  (+5% tarifa de gestión)
Proveedor recibe: $900.000 COP    (-10% comisión)
Classtryp gana:   $150.000 COP    (15% del valor base)
```

### Flujo de dinero
```
Cliente paga 100% ──► Classtryp retiene fondos
                           │
                    Reserva completada
                           │
              Classtryp transfiere al Proveedor
              (precio acordado - comisión proveedor)
```

El dinero **siempre pasa primero por Classtryp**. El proveedor recibe su pago después de que el servicio es confirmado como completado.

### Pasarela de Pagos Recomendada
- **Wompi** o **PayU** (Colombia) — soportan split de pagos y retiros a cuentas bancarias locales

---

## 6. El Paquete — Cómo Funciona

El cliente puede armar su paquete eligiendo **uno o más componentes**:

```
┌─────────────────────────────────────────────┐
│           PAQUETE CLASSTRYP                 │
│                                             │
│  1. 🏠 Casa / Villa        (obligatorio)    │
│  2. 🚐 Transporte          (opcional)       │
│  3. 🛥️ Bote / Yate         (opcional)       │
│  4. 🤿 Experiencias        (opcional, 1-N)  │
│  5. ✨ Servicios Extras    (opcional, 1-N)  │
│                                             │
│  💳 UN SOLO PAGO para todo                 │
└─────────────────────────────────────────────┘
```

La app sugiere combinaciones según:
- Tipo de grupo (amigos, familia, pareja, corporativo)
- Número de personas
- Fechas de viaje
- Presupuesto total
- Preferencias (qué no puede faltar)

---

## 7. Arquitectura de Pantallas

### Total: ~90 pantallas en 3 apps

---

### 7.1 Flujo Compartido (10 pantallas)
```
S-01  Splash Screen
S-02  Onboarding — Slide 1        "Tu casa en Cartagena"
S-03  Onboarding — Slide 2        "Tu bote privado"
S-04  Onboarding — Slide 3        "Todo en un solo pago"
S-05  Seleccionar tipo de usuario  Cliente / Proveedor
S-06  Login                        Email, Google, Apple
S-07  Registro Cliente
S-08  Registro Proveedor           + selección de categoría
S-09  Verificar teléfono           OTP / SMS
S-10  Recuperar contraseña
```

---

### 7.2 App Cliente (38 pantallas)

#### Descubrir
```
C-01  Home / Dashboard          Reservas activas, recomendados, categorías
C-02  Explorar / Catálogo       Búsqueda + filtros + cards
C-03  Filtros Avanzados         Fechas, precio, capacidad, categoría
C-04  Mapa de Cartagena         Pins por categoría
C-05  Notificaciones
```

#### Armar Paquete (Wizard IA)
```
C-06  Wizard — Tipo de grupo    Amigos / Familia / Pareja / Corporativo
C-07  Wizard — Fechas           Picker de rango de fechas
C-08  Wizard — Cantidad         Adultos y niños
C-09  Wizard — Presupuesto      Rango de inversión total
C-10  Wizard — Preferencias     ¿Qué no puede faltar?
C-11  Resultado del Paquete     Casa + Transporte + Bote + Exp sugeridos
C-12  Personalizar Paquete      Cambiar cada componente del paquete
C-13  Desglose de Precio        Subtotal por ítem + comisión plataforma
```

#### Detalle de Servicios
```
C-14  Detalle Casa / Villa      Fotos, amenities, reglas, mapa, reseñas
C-15  Galería de Fotos          Fullscreen swipe
C-16  Detalle Transporte        Tipo de vehículo, capacidad, ruta
C-17  Detalle Bote / Yate       Capacidad, ruta, capitán, fotos
C-18  Detalle Experiencia       Duración, incluye, punto de encuentro
C-19  Detalle Servicio Extra    Descripción, duración, qué incluye
C-20  Perfil del Proveedor      Rating, historial, reseñas
C-21  Comparar opciones         2-3 ítems lado a lado
```

#### Reservar y Pagar
```
C-22  Seleccionar Fechas        Calendario con disponibilidad real
C-23  Configurar Grupo          Adultos, niños, necesidades especiales
C-24  Seleccionar Add-ons       Agregar servicios extras al paquete
C-25  Resumen de Reserva        Todos los componentes + precio total
C-26  Pago                      Tarjeta, PSE, transferencia
C-27  Confirmación              Número de reserva, QR, próximos pasos
```

#### Mis Reservas
```
C-28  Lista de Reservas         Tabs: Próximas / En curso / Pasadas
C-29  Detalle Reserva Activa    Countdown, itinerario, contacto anfitrión
C-30  Detalle Reserva Pasada    Resumen + dejar reseña
C-31  Dejar Reseña              Rating + comentario por servicio
C-32  Cancelar Reserva          Política + confirmación
```

#### Cuenta
```
C-33  Favoritos                 Servicios guardados
C-34  Chat — Lista              Conversaciones abiertas
C-35  Chat — Conversación       Mensajes + fotos + estado reserva
C-36  Mi Perfil
C-37  Editar Perfil
C-38  Métodos de Pago           Tarjetas guardadas
C-39  Historial de Pagos
C-40  Configuración             Notificaciones, idioma, privacidad
```

---

### 7.3 App Proveedor (27 pantallas)

#### Dashboard
```
P-01  Home Proveedor            Reservas hoy, ingresos mes, ocupación %
P-02  Notificaciones            Nuevas reservas, mensajes, pagos
```

#### Mis Listings
```
P-03  Mis Listings              Lista de servicios publicados
P-04  Crear Listing — Tipo      Confirmar categoría del proveedor
P-05  Crear Listing — Info      Nombre, descripción, ubicación
P-06  Crear Listing — Fotos     Subir galería (mín. 5 fotos)
P-07  Crear Listing — Precio    Precio base, temporadas, descuentos
P-08  Crear Listing — Reglas    Capacidad, restricciones, cancelación
P-09  Crear Listing — Preview   Vista previa como la ve el cliente
P-10  Editar Listing
P-11  Disponibilidad            Calendario — bloquear / abrir fechas
P-12  Estado del Listing        Activo / En revisión / Suspendido
```

#### Reservas
```
P-13  Reservas Recibidas        Tabs: Pendientes / Confirmadas / Historial
P-14  Detalle de Reserva        Datos del cliente, fechas, servicios
P-15  Aceptar / Rechazar        Con mensaje al cliente
P-16  Check-in                  Instrucciones de llegada, acceso
```

#### Ganancias
```
P-17  Ganancias                 Ingresos totales, comisión Classtryp, neto
P-18  Detalle de Pago           Por reserva completada
P-19  Solicitar Retiro          Monto + cuenta bancaria destino
P-20  Estado de Retiros         Historial de transferencias
```

#### Cuenta Proveedor
```
P-21  Chat — Lista
P-22  Chat — Con Cliente
P-23  Mi Perfil Proveedor       Foto, descripción, rating general
P-24  Editar Perfil
P-25  Documentos / KYC          Cédula, RUT, fotos del servicio
P-26  Estado de Verificación    Pendiente / Aprobado / Requiere info
P-27  Configuración
```

---

### 7.4 Panel Admin — Web (15 pantallas)

```
A-01  Dashboard KPIs            Reservas, ingresos, comisiones, usuarios nuevos
A-02  Proveedores — Lista       Filtros: todos / pendientes / verificados / suspendidos
A-03  Proveedor — Detalle       Info + listings + historial + documentos
A-04  Aprobar / Rechazar Proveedor
A-05  Clientes — Lista
A-06  Cliente — Detalle         Reservas, pagos, reportes
A-07  Reservas — Lista          Todas las reservas de la plataforma
A-08  Reserva — Detalle         Cliente + proveedor + monto + comisión
A-09  Disputas / Incidencias    Abrir caso, historial, resolución
A-10  Comisiones                Monto total cobrado, desglose por mes
A-11  Retiros Pendientes        Aprobar o rechazar retiros de proveedores
A-12  Configuración             % comisión, políticas, categorías activas
A-13  Notificaciones Push       Enviar a clientes / proveedores / todos
A-14  Reportes                  Gráficas de ingresos, ocupación, tendencias
A-15  Gestión de Contenido      Destacados, banners, categorías
```

---

## 8. Resumen de Pantallas

| App | Pantallas |
|---|:---:|
| Flujo compartido | 10 |
| App Cliente | 40 |
| App Proveedor | 27 |
| Panel Admin (web) | 15 |
| **Total** | **92** |

---

## 9. Categorías de Proveedores

| # | Categoría | Ícono | Lo que ofrecen |
|---|---|---|---|
| 1 | Casas / Villas | 🏠 | Propiedades para hospedaje |
| 2 | Transporte | 🚐 | Traslados aeropuerto, vans, conductores privados |
| 3 | Botes / Yates | 🛥️ | Lanchas, veleros, catamaranes, yates |
| 4 | Experiencias | 🤿 | Tours, snorkel, buceo, city tour, kite, pesca |
| 5 | Servicios Extras | ✨ | Chef, DJ, fotógrafo, masajista, tatuador, enfermería, seguridad |

**Regla:** Un proveedor = una categoría. No puede cambiar de categoría una vez registrado (requiere contactar al Admin).

---

## 10. Stack Tecnológico (Propuesta)

| Capa | Tecnología | Razón |
|---|---|---|
| App Mobile (Cliente + Proveedor) | React Native + Expo | Ya iniciado, multiplataforma |
| Panel Admin | React + Next.js | Web, más cómodo para dashboard |
| Backend / API | Node.js + Express o Supabase | Por definir |
| Base de datos | PostgreSQL (via Supabase) | Relacional, ideal para reservas |
| Auth | Supabase Auth | Google, Apple, email incluidos |
| Pagos | Wompi / PayU Colombia | Soporte local + split de pagos |
| Storage (fotos) | Supabase Storage o Cloudinary | Imágenes de listings |
| Notificaciones Push | Expo Notifications + Firebase | |
| Chat en tiempo real | Supabase Realtime | |

---

## 11. Fases de Desarrollo

### Fase 1 — Diseño (Actual)
- [ ] Diseñar las 92 pantallas en Pencil (`Views Modules`)
- [ ] Definir design system completo (ya iniciado en `theme/index.js`)
- [ ] Validar flujos con usuarios reales antes de codificar

### Fase 2 — MVP Cliente
- [ ] Onboarding + Auth
- [ ] Wizard completo (6 pasos)
- [ ] Resultado del paquete (sin pago real)
- [ ] Explorar catálogo básico
- [ ] Detalle de cada tipo de servicio

### Fase 3 — MVP Proveedor
- [ ] Registro y verificación de proveedor
- [ ] Crear y publicar listings
- [ ] Gestionar disponibilidad
- [ ] Recibir y aceptar/rechazar reservas

### Fase 4 — Pagos
- [ ] Integrar pasarela (Wompi/PayU)
- [ ] Flujo completo de pago
- [ ] Retiros para proveedores
- [ ] Gestión de comisiones en Admin

### Fase 5 — Madurez
- [ ] Chat en tiempo real
- [ ] Reseñas y ratings
- [ ] Notificaciones push
- [ ] Panel Admin completo
- [ ] Reportes y analytics

---

## 12. Reglas de Negocio Definidas

### Comisión
- **5%** sobre el cliente — visible como "Tarifa de gestión" en el resumen de reserva
- **10%** sobre el proveedor — descontado al momento del pago
- Total para Classtryp: **15%** por reserva

### Confirmación de reserva
- **Request to Book** — el proveedor recibe la solicitud y tiene **24 horas** para aceptar o rechazar
- Si no responde en 24h, la solicitud se cancela automáticamente y el cliente no es cobrado
- El cargo al cliente se hace **solo cuando el proveedor acepta**

### Política de cancelación — Una sola para toda la plataforma
| Momento de cancelación | Reembolso al cliente |
|---|---|
| Más de 7 días antes | 100% |
| Entre 3 y 7 días antes | 50% |
| Menos de 3 días antes | 0% |
| Cancelación por el proveedor (cualquier momento) | 100% + compensación |

### Paquete mínimo
- **La casa es obligatoria** — todo paquete debe incluir alojamiento
- Los demás componentes (transporte, bote, experiencias, extras) son opcionales
- El Catálogo permite reservar servicios individuales sin wizard (sin casa obligatoria)

### Disputas
1. Cliente o proveedor abre una incidencia desde la app
2. Se abre un hilo de chat mediado — tienen **48 horas** para resolverlo entre ellos
3. Si no hay acuerdo, **Admin de Classtryp interviene** y toma la decisión final
4. La decisión del Admin es inapelable dentro de la plataforma

### Categorías de proveedor
- Un proveedor se registra en **una sola categoría**
- No puede cambiarla desde la app — debe contactar a Admin para solicitar cambio

---

*Documento generado el 13 de Mayo 2026 — Classtryp v1.0 — Decisiones cerradas*
