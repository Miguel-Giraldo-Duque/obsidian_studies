---
tipo: memoria-mentor
actualizado: 2026-08-05
version: 12
---

# Memoria del Mentor

> Memoria persistente del Consejo/Mentor del sistema OMA-hechizos.
> El mentor SIEMPRE lee este archivo al inicio de una sesion y guarda observaciones nuevas al cerrar.
> Formato estilo grafo de conocimiento: Entidades, Relaciones, Observaciones.

## Perfil del aprendiz
- Nombre del personaje: Soulhy
- Metodo de aprendizaje: OMA (Oportunidad, Motivacion, Habilidad)
- Sesgos a vigilar: confirmacion, auto-sabotaje, ilusion de control

## Entidades
> Tipos sugeridos: Hechizo, Sesgo, Estado, Evento, Meta, Persona, Componente.
> Formato: `- [Tipo] Nombre :: descripcion corta`

- [Persona] Soulhy :: aprendiz, personaje nivel 6 en el plugin vibe-rpg.
- [Componente] Regla mentor-oma :: `.cursor/rules/mentor-oma.mdc`, define identidad y criterios del mentor.
- [Componente] Comando invocate-mentor :: `.cursor/skills/invocate-mentor/SKILL.md`, se dispara con `/invocate-mentor`.
- [Componente] Memoria del mentor :: este archivo, unico estado persistente entre sesiones.
- [Componente] Bitacora :: `05_Mentor/Bitacora/`, historial de sesiones.
- [Evento] Integracion mentor local :: creada el 2026-06-29 (fase minima sin parches).
- [Meta] Activar sistema de parches :: IMPLEMENTADO en fase 1 el 2026-07-02 (ver Sistema OMA).
- [Componente] Sistema OMA :: `01_Planificacion/00_OMA/`, sistema manual de metricas/evaluaciones/parches; carpeta por skill.
- [Componente] Filosofia OMA :: `00_OMA/_FILOSOFIA.md`, manifiesto "el dominio es un camino / sommelier de mi propia incomodidad".
- [Componente] Regla oma-especialista :: `.cursor/rules/oma-especialista.mdc`, persona de los subagentes.
- [Componente] Skill /oma-metrica :: crea/calibra metricas de exito (Challenge Point + OCP).
- [Componente] Skill /oma-evaluar :: evalua experiencias (O-M-H) y genera parches.
- [Componente] KB Challenge Point :: `Manejo de errores/Challenge Point Framework.md` (Guadagnoli & Lee 2004).
- [Componente] KB Ciencia del dominio :: `Manejo de errores/Ciencia del dominio de habilidades.md`.
- [Estado] Quest 2-segundos_responder :: Carisma de Foco (renombrada 2026-07-03), nivel 1; metrica principal = ficha de retencion.
- [Estado] Soulhy nivel 6 :: XP 330, oro 140, fase "dissonance", 8 habitos completados, 0 jefes derrotados.
- [Jefe] CritisimGhost :: ~55/100 HP (estimado post 2026-07-18), voz "no merecedor / destello / payaso"; liberar candidez y unificar el corazon.
- [Jefe] Akrasia :: ~150/200 HP (estimado), brecha querer invitacion/conexion vs enviar; decir = hacer.
- [Estado] Dominios bajos :: Living Standards (31) y Time Use (38) muy por debajo del resto.
- [Persona] Markitos :: amigo del grupo de fiesta; invito "proxima con alcohol" 25 jun; silencio desde 26 jun tras bromas de Soulhy.
- [Persona] Afra :: interes romantico; dio indirecta; papa empujo a invitarla (2026-07-18); patron destello/retiro documentado desde 2026-06-26.
- [Estado] Herida aprobacion mama :: eco somatic: pecho/dolor al abrirse; entretener/mascara como intento de ganar aprobacion; no se resuelve en mentor — se nombra.
- [Patron] Destello vs luz constante :: culpa al bajar la mascara de entretenedor; miedo a no sostener atencion de quien gusta de el.
- [Evento] Sesion dolor merecimiento 2026-07-18 :: diagnostico auto-rechazo anticipado; micro-paso invitacion Afra.
- [Componente] Parche invitacion-espacio-comun :: activo 2026-07-04; cerrar loop chat con propuesta concreta.
- [Sesgo] Etiqueta identitaria social :: autoetiqueta "retrasado social" tras no responder; alimenta CritisimGhost.
- [Evento] Mensaje Marcos 2026-07-04 :: oportunidad de conexion digital no respondida a tiempo; miedo y ausencia en el medio como factores nombrados.
- [Componente] Skill Tree vibe-rpg :: tab Arbol en `vibe-rpg` para escuelas sociales, sub-skills, quests por nivel y dano a bosses vinculados.
- [Hechizo] Sommelier de la incomodidad :: seed del arbol social en Autoridad con 3 niveles y retos calibrados como quests.
- [Componente] Regla maestro-estudios :: `.cursor/rules/maestro-estudios.mdc`, crea practicas en `02_Estudios` desde notas fuente; ortografia + Challenge Point ~60% + curva 1-2-7-15-31.
- [Estado] Estudios Vercel AI SDK :: practicas `Vercel AI SDK.md` + `GenerateText.md` con `tema_iniciado: 2026-07-27`; GenerateText incluye ejercicios de codigo por dia de repaso.
- [Estado] Estudios Entrevista de comportamiento :: practica `02_Estudios/Entrevista de comportamiento.md`, `tema_iniciado: 2026-07-27`; fuente CV/behavioral (Exponent intro).
- [Estado] Estudios Downleveling :: practica `02_Estudios/Downleveling.md`, `tema_iniciado: 2026-08-05`; fuente `Escuela desarrollo web/CV/Downleveling.md` (Exponent Avoiding Downleveling).
- [Componente] Cronica del Sanador :: `05_Mentor/Cronica_Sanador/` — canon, estado corto y registro diario del lore.
- [Componente] Regla historiador-lore :: `.cursor/rules/historiador-lore.mdc` (alwaysApply: lee Estado_Actual al inicio).
- [Componente] Comando invocate-historiador :: `.cursor/skills/invocate-historiador/SKILL.md`.
- [Jefe] Kryos :: primordial guardian del hielo/mascara; ~1290/2000 HP; tomo Earth; Calidez lo derrite.
- [Jefe] Phobos Aliénos :: primordial del auto-rechazo/umbral; ~1300/2000 HP; tomo Fire; Sommelier + Empatia.
- [Jefe] Guiltmal :: legendario oculto; reflejo/arrepentimiento; Kryos+Phobos lo protegen; sin tomo.
- [Tomo] Fire :: Phobos — sostener el ardor del conocimiento / aprender en el dolor.
- [Tomo] Earth :: Kryos — belleza de la imperfeccion / vulnerabilidad transparente.
- [Hechizo] Flow :: skill Presencia; TPN vs DMN; 60 quests hardware→software social→caos; nodo `node_1785983669892_tu8ccua1d`.
- [Componente] Banco Flow :: `001 banco de retos de Flow.md` + mapa `02_Estudios/Quests_Flow.md` + script `_inject_flow_quests.py`.

## Relaciones
> Formato: `- Origen --tipoDeRelacion--> Destino  (nota opcional)`

- Comando invocate-mentor --carga--> Regla mentor-oma
- Comando invocate-mentor --lee--> Memoria del mentor
- Comando invocate-mentor --lee--> data.json (estado del personaje)
- Comando invocate-mentor --escribe--> Bitacora
- Comando invocate-mentor --actualiza--> Memoria del mentor
- Soulhy --invoca--> Comando invocate-mentor
- Soulhy --pelea--> Jefe CritisimGhost
- Soulhy --pelea--> Jefe Akrasia
- Estado Dominios bajos --señala--> Meta de equilibrar Living Standards y Time Use
- Skill /oma-metrica --carga--> Regla oma-especialista
- Skill /oma-evaluar --carga--> Regla oma-especialista
- Regla oma-especialista --usa--> KB Challenge Point
- Regla oma-especialista --usa--> KB Ciencia del dominio
- Regla oma-especialista --encarna--> Filosofia OMA
- Sistema OMA --contiene--> Quest 2-segundos_responder
- Skill /oma-evaluar --genera--> Parches (en carpeta de la skill)
- Soulhy --evita--> Mensaje Marcos 2026-07-04  (miedo + no presencia en medio)
- Etiqueta identitaria social --alimenta--> Jefe CritisimGhost
- Evento Mensaje Marcos 2026-07-04 --expone--> Jefe Akrasia  (querer conectar vs no enviar)
- Quest 2-segundos_responder --aun no probada en--> medio digital (WhatsApp/DM)
- Parche invitacion-espacio-comun --aplica_a--> Persona Markitos
- Skill /oma-evaluar --genero--> Parche invitacion-espacio-comun (2026-07-04)
- Skill Tree vibe-rpg --vive_en--> Componente Sistema OMA  (puente gamificado: quests sociales y progreso por niveles)
- Skill Tree vibe-rpg --extiende--> data.json  (nuevo bloque `skillTree` y quests `kind: skill-challenge`)
- Sommelier de la incomodidad --pertenece_a--> Skill Tree vibe-rpg
- Quests skill-challenge --danan--> Jefes vinculados  (`linkedBossIds` + `bossDamage`)
- Soulhy --desea_conectar_con--> Persona Afra
- Herida aprobacion mama --eco_en--> Dolor de pecho / Patron Destello
- Patron Destello vs luz constante --alimenta--> Jefe CritisimGhost
- Evento Sesion dolor merecimiento 2026-07-18 --expone--> Jefe Akrasia  (querer invitar vs no enviar)
- CritisimGhost --usa--> frase "ya se como termina" / "no merecedor"
- Regla maestro-estudios --escribe--> 02_Estudios
- Regla maestro-estudios --corrige--> Notas fuente (ortografia)
- Regla maestro-estudios --calibra_con--> KB Challenge Point (~60%)
- Estudios Vercel AI SDK --fuente--> Escuela desarrollo web/Vercel AI SDK
- Estudios Entrevista de comportamiento --fuente--> Escuela desarrollo web/CV/Entrevista de comportamiento.md
- Estudios Downleveling --fuente--> Escuela desarrollo web/CV/Downleveling.md
- Estudios Downleveling --hermano_de--> Estudios Entrevista de comportamiento
- Comando invocate-historiador --carga--> Regla historiador-lore
- Comando invocate-historiador --lee_escribe--> Cronica del Sanador
- Kryos --protege--> Guiltmal
- Phobos Aliénos --protege--> Guiltmal
- Kryos --misma_pared--> Phobos Aliénos
- Tomo Fire --preserva_sabiduria_de--> Phobos Aliénos
- Tomo Earth --preserva_sabiduria_de--> Kryos
- Soulhy --sana_no_extermina--> Jefes (Cronica del Sanador)
- Flow --pertenece_a--> Skill Tree vibe-rpg
- Flow --escuela--> Presencia
- Banco Flow --alimenta--> Quests skill-challenge (source flow-bank)
- Flow --dana--> Phobos Aliénos
- Flow --dana--> Kryos

## Observaciones
> Datapoints fechados por entidad. Formato: `- [AAAA-MM-DD] Entidad :: observacion`

- [2026-06-29] Sistema :: Memoria del mentor inicializada.
- [2026-06-29] Integracion mentor local :: implementada la fase minima (regla + comando + memoria + bitacora + README). Runtime local, sin API key, sin nube.
- [2026-06-29] Sistema :: pendiente manual: crear `.cursorignore` en la raiz (el agente no tiene permiso de escribirlo); contenido en `05_Mentor/README_Mentor.md`.
- [2026-06-29] Meta Activar sistema de parches :: queda fuera de alcance por decision del aprendiz; reactivar mas adelante.
- [2026-06-29] Soulhy :: primera sesion de mentoria registrada. Fortaleza: eje cuerpo-mente (Health 69, Psych 63) y fue a por el habito "hard" social en Plaza Irlanda.
- [2026-06-29] Soulhy :: energia concentrada en mente/cuerpo/social; Living Standards (31) y Time Use (38) sin habitos que los toquen.
- [2026-06-29] Akrasia :: identificado como brecha decir/hacer; ese dia tenia 6+ habitos pendientes (auto-sabotaje a vigilar).
- [2026-06-29] Soulhy :: proximo paso acordado = completar un habito pendiente pequeño en 2h (anclado en accion). Pendiente que confirme cual eligio.
- [2026-06-29] Material estudio :: creadas 3 notas Q&A en `02_Estudios` del bloque "Manejo de errores" (Aprender de exitos/errores, Metodo OMA, Obstaculos). Formato flashcard calcado de los ejemplos existentes.
- [2026-06-29] Sistema OMA :: la nota fuente confirma que el sistema de "parches" es el nucleo del metodo de aprendizaje (fase aun no activada para el mentor, pero ya documentada por el aprendiz).
- [2026-07-01] Material estudio :: creadas 2 notas Q&A en `02_Estudios` de "Escuela finanzas" (Banco central, Crecimiento deuda vs productividad).
- [2026-07-01] Soulhy :: amplia foco de estudio hacia finanzas; posible palanca para el dominio mas bajo del personaje (Living Standards 31). Sugerido vincular a un habito medible.
- [2026-07-02] Sistema OMA :: implementada fase 1 (filosofia + KB + plantillas + quest ejemplo + regla + 2 skills). Parches reactivados.
- [2026-07-02] Filosofia :: giro nuclear del sistema -> "el dominio es un camino, no un destino"; ninguna skill se termina, se le sube el reto.
- [2026-07-02] Regla OCP :: los subagentes SIEMPRE preguntan tension (1-10) y % exito; >90% subir dificultad ("Soulhy esta estancado"), <50% bajar, objetivo ~60%; registran en el log de progreso.
- [2026-07-02] Soulhy :: prefiere ejecutar por fases (investigacion primero, luego construir); senal sana anti-auto-sabotaje.
- [2026-07-03] Quest 2-segundos_responder :: renombrada y reencuadrada como Carisma de Foco (Julio). Metrica A = ficha retencion post-charla; Metrica B = secuencia 2s. OCP inicial: tension 5/10, pausa facil en tango (n=2).
- [2026-07-04] Soulhy :: sesion emocional por ciclo conectar/saboteo/mensaje de Marcos. Autoetiqueta dura; insight propio ya separa acto de identidad. CritisimGhost casi derrotado (20 HP) pero la voz critica sigue activa en lo social.
- [2026-07-04] Akrasia :: patron recurrente en digital: deseo de conexion + no abrir/responder chat. Habito "2 segundos" y hechizo Autocontrol sin practica en ese contexto.
- [2026-07-04] Marcos :: proximo paso = una oracion honesta en el chat antes del mediodia del dia siguiente; meta anclada en accion enviada, no en que la amistad "salga bien".
- [2026-07-04] Markitos :: /oma-evaluar chat 25-26 jun. Fracaso real = invitacion sin contra-propuesta; exito = fiesta previa + rapport. Parche activo: propuesta concreta (asado/cafe/grupo/tango) en 48h. NotebookLM fallo Playwright; briefing vault fallback.
- [2026-07-04] Quest 2-segundos_responder :: OCP 5/10, ~35% exito sub-habilidad digital; mantener N1 presencial.
- [2026-07-13] Skill Tree vibe-rpg :: implementada tab Arbol con escuelas Autoridad/Presencia/Calidez, creacion de sub-skills, quests por nivel, seed Sommelier y dano a bosses vinculados al completar quests. Build y sintaxis del bundle pasaron.
- [2026-07-18] Soulhy :: sesion por dolor de pecho ante Afra/papa. Insight propio: el que se rechaza es el; miedo al exito porque corazon abierto reactiva rechazo de mama.
- [2026-07-18] Herida aprobacion mama :: nombrada como origen somatic del dolor (continuidad 2026-06-26 y 2026-06-29); no se "cura" en sesion — se deja de usarla como veto a actuar.
- [2026-07-18] Afra :: oportunidad real (indirecta + papa); micro-paso = invitacion concreta enviada hoy antes 20:00; exito = enviada, no resultado de la cita.
- [2026-07-18] CritisimGhost :: activo en mascara/destello/no merecedor; Akrasia en el gap invitar vs quedarse en casa.
- [2026-07-18] Sesgos :: confirmacion ("ya se como termina"), auto-sabotaje ("cuando sea mas habil / Christian-Paul"), ilusion de control (aprobacion mama/entretener siempre).
- [2026-07-25] Material estudio :: creada nota Q&A `02_Estudios/Autoridad.md` (10 preguntas) desde `Escuela habilidades blandas/El mito del carisma/Autoridad.md`.
- [2026-07-25] Escuela finanzas :: reinicio de practicas — `tema_iniciado` actualizado a 2026-07-25 en Banco central, Crecimiento deuda vs productividad y Desequilibrios financieros.
- [2026-07-27] Maestro de Estudios :: creada regla `.cursor/rules/maestro-estudios.mdc` (flujo Q&A/codigo, OCP ~60%, curva 1-2-7-15-31).
- [2026-07-27] Material estudio :: ortografia corregida en notas fuente `Vercel AI SDK.md` y `GenerateText.md`.
- [2026-07-27] Material estudio :: creadas practicas `02_Estudios/Vercel AI SDK.md` (6 Q&A) y `02_Estudios/GenerateText.md` (6 Q&A + ejercicios dias 1/2/7/15/31), `tema_iniciado: 2026-07-27`.
- [2026-07-27] Material estudio :: ortografia + precision en `CV/Entrevista de comportamiento.md`; creada practica Q&A `02_Estudios/Entrevista de comportamiento.md` (12 flashcards, `tema_iniciado: 2026-07-27`).
- [2026-08-01] Cronica del Sanador :: canon fundacional — Soulhy sana bosses; Kryos+Phobos guardianes de Guiltmal; tomos Fire/Earth asignados; Historiador + /invocate-historiador activos.
- [2026-08-05] Material estudio :: evaluada nota `CV/Downleveling.md` vs articulo Exponent: nucleo ok (~55-60% fidelidad); corregidos BATNA (no BENDRA), mapa feature/problem/team/org/company, L-3 inventado; creada practica Q&A `02_Estudios/Downleveling.md` (12 flashcards, `tema_iniciado: 2026-08-05`).
- [2026-08-05] Estudios Downleveling :: agregadas 3 flashcards de investigar empresa + stack + checklist (green flags 1–2 del articulo); total 15 Q&A.
- [2026-08-05] Flow :: banco 60 quests (TPN/DMN) escrito + inject `flow-bank` en data.json (nodo Presencia Flow); mapa `Quests_Flow.md`.
