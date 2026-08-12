---
tipo: guia
actualizado: 2026-06-29
---

# 05_Mentor - Guia

Integracion local de Cursor como tu Consejo/Mentor del sistema OMA-hechizos. Corre con tu plan Pro, sin API key, escribiendo directo en la boveda.

## Como usarlo
1. Abri esta boveda como carpeta en **Cursor**.
2. En el chat del agente, escribi el comando: **`/invocate-mentor`**.
3. El mentor: arranca con "Recordando...", lee tu estado real del personaje, repasa el historial y conduce una sesion corta.
4. Al cerrar, deja una nota en `Bitacora/AAAA-MM-DD.md` y actualiza `Memoria_Mentor.md`.

## Piezas del sistema
- `Memoria_Mentor.md` - memoria persistente (Entidades / Relaciones / Observaciones). Es el unico estado que el mentor recuerda entre sesiones.
- `Bitacora/` - historial de sesiones (una nota por dia).
- `.cursor/rules/mentor-oma.mdc` - quien es el mentor y sus criterios (tono, OMA, anti-sesgos).
- `.cursor/skills/invocate-mentor/SKILL.md` - el comando: los pasos que ejecuta al invocarlo.

## Regla vs comando (como funciona)
- La **regla** define *quien es* el mentor y *como* mentorea.
- El **comando** (`/invocate-mentor`) define *que pasos* ejecuta y *que archivos* lee, en orden.
- El comando tiene `disable-model-invocation: true`: por eso solo se activa cuando lo escribis con `/`, no solo.

## Fallback manual (sin Cursor)
Si no podes abrir Cursor, hace una mini auto-revision con "considera lo opuesto":
1. Que esperaba que pasara hoy vs que paso realmente.
2. Un dato concreto que **refutaria** mi conclusion de hoy.
3. Que depende de mi (accion) y que no (resultado).
4. Proximo paso pequeno y verificable para manana.

## Pendiente: crear .cursorignore (manual)
El agente no tiene permiso para escribir `.cursorignore`. Crealo vos en la raiz de la boveda con este contenido para que el mentor lea mas rapido:

```
# Acelera la lectura del agente/mentor
.obsidian/plugins/*/node_modules/
.obsidian/plugins/*/main.js
.obsidian/workspace.json
.obsidian/cache/
```
