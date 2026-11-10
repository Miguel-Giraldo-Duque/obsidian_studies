---
tipo: setup-calendario
actualizado: 2026-11-10
---

# Full Calendar Remastered — setup MVP

## Qué quedó armado

| Pieza | Estado |
|-------|--------|
| Plugin `full-calendar-remastered` 0.13.7 | Instalado + habilitado |
| Calendario **Rutinas Soulhy** (Full Note) | `01_Planificacion/04_Calendario` |
| Calendario **ActivityWatch** (Full Note) | `01_Planificacion/04_Calendario/ActivityWatch` |
| Bloques diarios | Rutina AM 07–08 · Job search 08–08:30 · Noche 22–23 |
| ActivityWatch v0.14.1 | Instalado; API en `http://127.0.0.1:5600` |
| Google Calendar | **Pendiente** (pasos abajo) |

El plugin clásico `calendar` se deja: sirve Periodic Notes / vista de diarios.

## Verificación en Obsidian

1. Reload community plugins (o reiniciar Obsidian).
2. Command palette → `Full Calendar: Open Calendar`.
3. Vista día/semana: deben verse los 3 bloques recurrentes.
4. Settings → Full Calendar Remastered → Integrations → ActivityWatch: enabled, API `http://127.0.0.1:5600`, target = ActivityWatch.
5. Con AW corriendo: sync manual una vez (o esperar auto-sync 10′).

## ActivityWatch (tracker apps / browsers)

- App: `C:\Users\jefai\AppData\Local\Programs\ActivityWatch\aw-qt.exe`
- UI: <http://localhost:5600>
- **Autostart:** en el icono de bandeja de AW → marcar *Start at login* (si no quedó del installer).
- Extensión browser (Chrome/Edge): instalar *ActivityWatch Web Watcher* para tabs.
- Perfiles MVP en FCR: Deep Work / Coding · Job Search · Distraction.

Separación: **Rutinas Soulhy** = intención planificada · **ActivityWatch** = dónde se fue el tiempo de verdad.

## Google Calendar (cuando toque — no conectar aún)

1. Full Calendar Settings → Calendar Sources → **Add Source** → **Google Calendar**.
2. **Login with Google** (OAuth verificado del plugin; no hace falta Client ID custom).
3. Elegí solo el calendario **personal** de Google.
4. Dejá las series de rutinas en Full Note local; no dupliques AM/noche en Google.
5. Refresh: FCR Command `refresh calendars` o `Full Calendar: Revalidate remote calendars`.

Docs: [Google Calendar — FCR](https://obsidian-full-calendar-remastered.github.io/plugin-full-calendar/user/calendars/gcal/)

## Fuera de este MVP

- Bloques Qnow / ventas / domingo 15:00
- Quests Soulhy ligadas al calendario
- Reemplazar Toggl / WinClock (siguen en paralelo)
