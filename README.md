# Job Tracker

App web para trackear tu búsqueda laboral: procesos, entrevistas, skills y recursos útiles. Sin backend ni registro: todo se guarda en el navegador y se respalda exportando/importando un archivo JSON.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Zustand (estado + persistencia en `localStorage`)
- React Router v7
- FullCalendar (vista mes / semana / lista)
- dnd-kit (drag & drop del tablero Kanban)
- i18next (interfaz en español)

## Funcionalidades

- **Dashboard**: registrar actividad en 1 click, actividad de la semana por tipo, próximos eventos, procesos por etapa y reporte semanal exportable a Markdown.
- **Procesos**: tablero Kanban por etapas (Guardado → Postulado → En entrevista → Oferta / Rechazado / Sin respuesta) con drag & drop.
- **Calendario**: contactos, entrevistas, postulaciones, seguimientos y tareas; eventos vinculables a un proceso.
- **Perfil**: skills duras y blandas, obtenidas / por obtener, con nivel y notas objetivo.
- **Enlaces útiles**: bookmarks con tags, búsqueda y filtro.
- **Preferencias**: exportar/importar JSON (para continuar en otro navegador o PC) y borrar datos.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción en dist/
npm run preview  # sirve el build localmente
npm run lint     # oxlint
```

## Deploy en Vercel

1. Subí el repo a GitHub.
2. En [vercel.com](https://vercel.com) → *Add New Project* → importá el repo.
3. Vercel detecta Vite automáticamente (framework: **Vite**, build: `npm run build`, output: `dist`).
4. Deploy. El `vercel.json` incluido reescribe las rutas al `index.html` para que funcione el router.

## Datos

- Se guardan bajo la clave `job-tracker-data` en el `localStorage` del navegador.
- En **Preferencias** podés descargar un JSON con todo y volver a cargarlo en cualquier navegador/PC (reemplaza los datos actuales).
- El archivo exportado incluye un `schemaVersion` para migraciones futuras.

## Estructura

```
src/
├─ components/    Layout y encabezados compartidos
├─ features/      Módulos por área (procesos, calendario, perfil, enlaces)
├─ lib/           Utilidades (fechas, reporte semanal, backup)
├─ pages/         Una página por sección del sidebar
├─ store/         Tipos de dominio + store Zustand con persist
└─ i18n/          Traducciones (es)
```
