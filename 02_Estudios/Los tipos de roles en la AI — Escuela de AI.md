---
tags:
  - estudio
prioridad: normal
tema_iniciado: 2026-11-25
etapa_repaso: 0
ultimo_repaso: ""
proximo_repaso: 2026-11-26
fuente: "[[Escuelas/Escuela de AI/Los tipos de roles en la AI|Los tipos de roles en la AI]]"
---
Práctica de [[Escuelas/Escuela de AI/Los tipos de roles en la AI|Los tipos de roles en la AI]] (Escuela de AI, prioridad normal). Generada el 2026-11-25 (America/Buenos_Aires) a pedido de Miguel, sin Cornell previo. Fuente corta (solo raw), por eso son 3 preguntas. Hermanas: [[Harness — Escuela de AI]], [[Errores de arquitectura — Escuela de AI]], [[Ventas humanas — Práctica]].

## Preguntas

- **1. Nombrá los 3 roles y de qué se ocupa cada uno.**
    - **Respuesta:** AI engineer: tokens, el LLM, costos, el harness, el contexto, el system prompt. AI architect: RAG, escalabilidad, coordinación, evaluación, performance, observabilidad, automejora. Tu nota dice «foward Developez engine»; el nombre del rol es Forward Deployed Engineer (FDE): va al cliente, entiende qué necesita y cómo reaccionan sus usuarios, y lo vuelve una solución robusta en producción.
    - **Puntos clave:** AI engineer = modelo/contexto/costos · architect = RAG/escala/evals/observabilidad · FDE = cliente → solución

- **2. ¿Qué hace clave al Forward Deployed Engineer y qué prueba necesita su trabajo?**
    - **Respuesta:** Junta feedback constante del cliente y sus usuarios y, con conocimiento de ingeniería, implementa una solución funcional. Lo clave es validarla con una prueba real con un cliente real. Necesita saber hablar con clientes, escuchar y representar sus necesidades.
    - **Puntos clave:** feedback constante · prueba real con cliente real · escucha · ingeniería + negocio

- **3. Escenario: te contrata una cafetería para un asistente con AI. ¿Qué harías como FDE en la primera semana y qué le pasarías al engineer/architect?**
    - **Respuesta:** Como FDE: escuchar al dueño y a sus usuarios, definir el problema y una métrica, y armar un piloto que se pruebe con ellos (ver [[Errores de arquitectura — Escuela de AI]]). Al engineer: contexto, prompt, tools y costos. Al architect: RAG si hay documentos, evaluación y observabilidad.
    - **Puntos clave:** escuchar + definir problema y métrica · piloto real · repartir por rol
