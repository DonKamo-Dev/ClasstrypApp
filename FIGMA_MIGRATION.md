# Classtryp — Plan de Migración a Figma
**Versión:** 1.0 | **Fecha:** Mayo 2026

---

## Por qué migrar a Figma

| Pencil | Figma |
|---|---|
| MCP inestable (bug de escritura) | MCP oficial estable y mantenido |
| Sin historial de versiones | Version history completo |
| Difícil colaboración en equipo | Colaboración en tiempo real |
| Handoff limitado al desarrollo | Dev Mode con specs automáticas |
| Sin librería de componentes robusta | Variables, componentes, Auto Layout |

---

## Paso 1 — Preparar Figma

### 1.1 Crear el archivo base
1. Ir a figma.com → New Design File
2. Nombrar: **"Classtryp — Design System & Screens"**
3. Crear las siguientes páginas:
   - `🎨 Design System` — colores, tipografía, componentes
   - `📱 Flujo Compartido` — S-01 a S-10
   - `👤 App Cliente` — C-01 a C-40
   - `🏪 App Proveedor` — P-01 a P-27
   - `⚙️ Panel Admin` — A-01 a A-15
   - `🗄️ Archive` — pantallas descartadas o en pausa

### 1.2 Instalar el plugin Figma MCP
1. En Figma desktop: **Plugins → Browse plugins → buscar "Figma MCP"**
2. O instalar desde: figma.com/community/plugin/figma-mcp
3. En Claude Code settings, agregar el MCP de Figma:
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["@figma/mcp-server"]
    }
  }
}
```

---

## Paso 2 — Design System en Figma

### 2.1 Variables de color (ya definidas en el PRD)
Crear en Figma → Local Variables → Color:

| Nombre | Valor |
|---|---|
| `color/primary` | #1A1A2E |
| `color/secondary` | #C9A84C |
| `color/background` | #F8F9FA |
| `color/surface` | #FFFFFF |
| `color/text-primary` | #1A1A2E |
| `color/text-secondary` | #6B7280 |
| `color/text-light` | #FFFFFF |
| `color/text-muted` | #9CA3AF |
| `color/border` | #E5E7EB |
| `color/success` | #10B981 |
| `color/warning` | #F59E0B |
| `color/error` | #EF4444 |

### 2.2 Estilos de texto
Crear Text Styles en Figma:

| Nombre | Fuente | Tamaño | Peso |
|---|---|---|---|
| `text/display` | Inter | 38px | 700 |
| `text/h1` | Inter | 30px | 700 |
| `text/h2` | Inter | 24px | 700 |
| `text/h3` | Inter | 20px | 600 |
| `text/body-lg` | Inter | 17px | 400 |
| `text/body` | Inter | 15px | 400 |
| `text/body-sm` | Inter | 13px | 400 |
| `text/caption` | Inter | 11px | 400 |

### 2.3 Componentes base a crear
En la página `🎨 Design System`, crear estos componentes reutilizables:

- **Button/Primary** — fondo navy, texto blanco
- **Button/Secondary** — fondo blanco, borde, texto navy
- **Button/Gold** — fondo gold #C9A84C, texto navy
- **Input/Default** — borde gris, label, placeholder
- **Input/Active** — borde navy
- **Input/Error** — borde rojo + mensaje
- **Card/Service** — imagen, título, precio, rating
- **Card/Booking** — estado, fechas, acciones
- **Tag/Category** — chip pill con ícono
- **StatusBar/Light** — sobre fondos oscuros
- **StatusBar/Dark** — sobre fondos claros
- **TabBar** — 5 tabs con estados active/inactive
- **Avatar** — foto de perfil circular
- **Rating/Stars** — 1-5 estrellas

---

## Paso 3 — Migrar las pantallas existentes de Pencil

### 3.1 Exportar de Pencil
1. En Pencil, seleccionar todas las pantallas (Ctrl+A en el canvas)
2. Exportar como **PNG @2x** (para referencia visual)
3. Guardar en: `APP CLASSTRYP/Pencil Export/`

### 3.2 Pantallas ya diseñadas a recrear en Figma

| # | Pantalla | Estado Pencil | Prioridad Figma |
|---|---|---|---|
| S-01 | Splash | ✅ | Alta |
| S-02 | Onboarding 1 | ✅ | Alta |
| S-03 | Onboarding 2 | ✅ | Alta |
| S-04 | Onboarding 3 | ✅ | Alta |
| S-05 | Seleccionar Perfil | ✅ | Alta |
| 01 | Welcome | ✅ | Alta |
| 02 | Login/Registro | ✅ | Alta |
| 03 | Wizard IA | ✅ | Alta |
| 04 | Resultado Paquete | ✅ | Alta |
| 05 | Dashboard Cliente | ✅ | Alta |
| 06 | Catálogo | ✅ | Alta |

### 3.3 Estrategia de recreación
**Con Claude + Figma MCP** (recomendado):
- Claude lee los screenshots exportados de Pencil
- Recrea cada pantalla en Figma usando el MCP
- Aplica las variables de color y text styles definidos

**Manual** (alternativa):
- Usar los screenshots de Pencil como referencia
- Recrear pantalla por pantalla en Figma

---

## Paso 4 — Flujo de trabajo futuro en Figma

### 4.1 Para cada pantalla nueva:
1. Abrir Figma + Claude Code
2. Decirle a Claude: "Diseña la pantalla X en Figma"
3. Claude usa el MCP de Figma para crear los frames
4. Verificar visualmente en Figma
5. Iterar si es necesario

### 4.2 Convenciones de naming en Figma
```
[Módulo] / [Número] — [Nombre]

Ejemplos:
  Flujo Compartido / S-06 — Login
  Cliente / C-14 — Detalle Casa
  Proveedor / P-01 — Dashboard
  Admin / A-01 — KPIs
```

### 4.3 Developer Handoff
1. Activar **Dev Mode** en Figma (requiere plan profesional)
2. El desarrollador inspecciona specs directamente en Figma
3. Figma genera snippets de CSS/React Native automáticamente
4. Usar plugin **Figma to React Native** para acelerar el código

---

## Paso 5 — Checklist de migración

### Preparación
- [ ] Crear archivo Figma "Classtryp"
- [ ] Crear las 6 páginas
- [ ] Instalar Figma MCP en Claude Code
- [ ] Configurar frame iPhone 14 (390×844) como preset

### Design System
- [ ] Crear todas las variables de color
- [ ] Crear todos los text styles
- [ ] Crear componente StatusBar/Light
- [ ] Crear componente StatusBar/Dark
- [ ] Crear componente Button/Primary
- [ ] Crear componente Button/Gold
- [ ] Crear componente Input/Default
- [ ] Crear componente Card/Service
- [ ] Crear componente TabBar

### Migración de pantallas
- [ ] Exportar todas las pantallas de Pencil como PNG @2x
- [ ] Recrear S-01 Splash en Figma
- [ ] Recrear S-02, S-03, S-04 Onboarding en Figma
- [ ] Recrear S-05 Seleccionar Perfil en Figma
- [ ] Recrear pantallas 01-06 originales de Pencil en Figma
- [ ] Verificar consistencia visual con los originales

### Validación
- [ ] Revisar que todos los colores usan variables
- [ ] Revisar que todos los textos usan text styles
- [ ] Confirmar que los componentes están correctamente enlazados
- [ ] Hacer test de prototipo con al menos el flujo principal

---

## Cuándo hacer la migración

**Recomendación:** Terminar de diseñar todas las pantallas en Pencil primero (usando los prompts), luego hacer la migración a Figma en una sola sesión. Esto evita trabajar en dos herramientas simultáneamente.

**Estimado:** ~2-3 horas para migración completa una vez que todas las pantallas estén diseñadas en Pencil.

---

*Documento creado el 13 de Mayo 2026 — Classtryp v1.0*
