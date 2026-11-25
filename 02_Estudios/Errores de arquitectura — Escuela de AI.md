---
tags:
  - estudio
prioridad: normal
tema_iniciado: 2026-11-25
etapa_repaso: 0
ultimo_repaso: ""
proximo_repaso: 2026-11-26
fuente: "[[Escuelas/Escuela de AI/Errores de arquitectura|Errores de arquitectura]]"
---
Práctica de [[Escuelas/Escuela de AI/Errores de arquitectura|Errores de arquitectura]] (Escuela de AI, prioridad normal). Generada el 2026-11-25 (America/Buenos_Aires) a pedido de Miguel, sin Cornell previo. Contraste con [Anthropic · Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) y [Anthropic · Define success criteria and build evaluations](https://docs.claude.com/en/docs/test-and-evaluate/develop-tests) (consultadas 2026-11-25). El Summary de la sesión tiene líneas personales ajenas al tema; no se usaron. Hermanas: [[Harness — Escuela de AI]], [[Los tipos de roles en la AI — Escuela de AI]].

## Preguntas

- **1. Un cliente te dice «quiero un agente que me haga los reportes». ¿Cuál es el primer error que evitás y qué preguntás?**
    - **Respuesta:** No arrancar por la solución. Primero entender qué problema de origen quiere resolver y por qué (qué lo motiva, qué acción quiere habilitar); después, cómo vamos a medir que se resolvió.
    - **Puntos clave:** problema de origen antes que solución · el porqué · cómo se mide

- **2. ¿Por qué Claude Code y los mejores modelos de código mejoran tan rápido, y qué le copiás a tu arquitectura?**
    - **Respuesta:** Porque tienen una medición clara: el test pasa o falla, el código corre o no, así que el feedback es directo. En tu arquitectura: definir una métrica concreta y relevante para el negocio, evaluar el sistema, mejorar y repetir.
    - **Puntos clave:** feedback claro (tests) · métrica concreta · evaluar → mejorar → repetir

- **3. ¿Qué pasa si le das al agente un contexto ambiguo, tipo «¿cómo lo harías tú?»?**
    - **Respuesta:** Genera resultados ambiguos que suenan creíbles («menos reuniones», «dejá de hacer X»), pero no hay forma medible de comprobar que te acercan al objetivo. Mejor plantear cómo acercarse a un objetivo con una métrica clara.
    - **Puntos clave:** contexto ambiguo → resultado ambiguo creíble · sin verificación · pedir contra una métrica

- **4. ¿Por qué no conviene arrancar con una arquitectura multi-agente que copie un organigrama humano?**
    - **Respuesta:** Porque agrega complejidad sin evidencia. Se empieza con un agente bajo medición y pruebas hacia un resultado concreto; si con uno basta, listo. Solo si con el tiempo delegar mejora el rendimiento, se suman agentes. No es blanco o negro, es «si hago esto es más probable el resultado». Anthropic: la solución más simple primero, complejidad solo cuando hace falta.
    - **Puntos clave:** empezar con 1 agente medido · evolucionar con evidencia · simple primero

- **5. ¿Cuáles son las 3 formas de evaluar un agente y qué aporta cada una?**
    - **Respuesta:** 1) Métricas reales de negocio, como portafolio: algunas cercanas al agente y otras rezagadas (revenue), lo más cuantitativas posible para repetirlas en el tiempo. 2) Un LLM/agente evaluador o juez que revisa hechos, si recuperó bien la información y si no inventa, antes de entregar. 3) Revisores humanos que dan feedback. Juntas muestran dónde mejorar y si de verdad se mueve el resultado. Anthropic recomienda criterios de éxito específicos y medibles, y usa evaluación con LLM además de la humana.
    - **Puntos clave:** métricas de negocio (portafolio) · LLM-as-judge · humanos · cuantitativo y repetible
