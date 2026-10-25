# -*- coding: utf-8 -*-
"""Inject 30 daily quests into campaign La humildad de volver a empezar (idempotent)."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
data_path = root / ".obsidian/plugins/soulhy/data.json"

CAMPAIGN_ID = "qcamp_1787778256809_4n4iwk"
BOSS_ID = "1786983444165"  # Guiltmal
SOURCE = "humildad-bank"


def _meta(day):
    if day <= 7:
        return {"difficulty": "easy", "skillLevel": 1, "xp": 10, "bossDamage": 25}
    if day <= 21:
        return {"difficulty": "medium", "skillLevel": 2, "xp": 15, "bossDamage": 25}
    return {"difficulty": "hard", "skillLevel": 3, "xp": 20, "bossDamage": 30}


# (day, short_title, description) — 1 quest per day; warmup + misión + diario folded in
BANK = [
    (1, "5 saludos en passing",
     "Saluda o da un cumplido a 5 personas mientras caminas junto a ellas en la calle, supermercado, gimnasio o centro comercial. Ejemplos: \"Buenos días\", \"Me gustan tus zapatos\", \"Feliz jueves\", \"Qué bonita chaqueta\". Hazlo con contacto visual, sonrisa y voz firme. No esperes respuesta, solo suelta el saludo y sigue tu camino. Celébrate después de CADA uno: palmada mental, \"¡Sí! ¡Vamos!\" o choca tus propias manos. Eres un guerrero por dar el primer paso. No pienses en el resultado, solo en la acción. Si alguien no responde, no importa: tú hiciste tu parte. Al final del día, escribe en tu diario que cumpliste con tu misión. Eso es un LOGRO GIGANTE."),
    (2, "5 saludos, lugares distintos",
     "Saluda o da un cumplido a 5 personas en passing. Elige lugares distintos: hoy prueba en la cafetería, en el trabajo, en el parque. Recuerda: voz clara, sonrisa, contacto visual. Ejemplo: \"Hola, que tengas buen día\", \"Lindas gafas\". Celébrate tras cada saludo y siéntete orgulloso de estar construyendo un nuevo hábito. Al completar la cuota, registra en tu diario cómo te sentiste: ¿fue más fácil que ayer? ¿Alguna persona te devolvió el saludo con una sonrisa? Anótalo como evidencia de tu progreso."),
    (3, "5 saludos con tonalidad",
     "5 saludos en passing. Hoy intenta variar los cumplidos: fíjate en accesorios, ropa, o simplemente da un \"Feliz día\" con energía. La clave es la TONALIDAD: proyecta tu voz como si estuvieras feliz de estar vivo. Celébrate después de cada uno, eres un guerrero social en entrenamiento. Al completar la cuota de 5, reflexión en diario: \"Hoy hice mi misión. Estoy demostrándome que puedo hacer cosas incómodas. Mañana subo el nivel.\""),
    (4, "10 saludos, 3 mujeres",
     "Hoy subes la intensidad: intenta dar 10 saludos o cumplidos en passing (puedes hacerlos en varias salidas a lo largo del día). De esos 10, procura que al menos 3 sean a mujeres. Si ves a alguien con algo llamativo, es tu oportunidad. Ejemplo: \"Hola, me encanta tu mochila\", \"Buenos días, que tengas un gran martes\". Celébrate cada vez, eres imparable. Al final del día, escribe en tu diario: \"Hoy hice 10. Mi zona de incomodidad se está expandiendo. Esto es un GRAN LOGRO.\""),
    (5, "10 saludos en zonas densas",
     "10 saludos en passing (mínimo 3 a mujeres). Ponte el reto de hacerlos en lugares donde haya más gente: centro comercial, calle principal, estación de tren. No te escondas: busca el contacto humano. Celébrate al terminar cada uno, aunque sientas que te salió raro o tartamudeaste. Hacerlo ya es ganar. Cumple tu cuota y escribe en diario: \"Estoy notando que mi mente se está acostumbrando a esta acción. Me siento más vivo y presente.\""),
    (6, "10 cumplidos específicos",
     "10 saludos en passing (3-5 mujeres). Hoy añade un pequeño desafío: intenta que tus cumplidos sean más específicos. En lugar de \"me gusta tu chaqueta\", di \"me gusta ese color en ti\" o \"tu estilo es muy original\". Celébrate con entusiasmo tras cada saludo, eres un guerrero forjando su confianza. Al completar los 10, registra en diario: \"Cada día me cuesta menos. Estoy cambiando mi identidad de alguien que no habla a alguien que se atreve.\""),
    (7, "10 saludos, 5 mujeres",
     "10 saludos en passing (mínimo 5 mujeres). Sé audaz: si ves a una chica que te parece atractiva, dale un cumplido genuino. Recuerda: estás en passing, no tienes que quedarte a conversar. Suelta el cumplido y sigue caminando. Celébrate con fiesta interior después de cada interacción. Has completado la primera semana. Eres un GUERRERO. Cumple tu misión y escribe en el diario una reflexión de toda la semana: \"He hecho 70+ saludos esta semana. El mundo no se acabó. Mi confianza está en crecimiento. Voy por más.\""),
    (8, "5 direcciones",
     "Calentamiento: haz 5 saludos en passing. Buenos días, cumplidos, lo que sea. Celébrate al terminar cada uno. Misión: detén a 5 personas y pregúntales por direcciones. Ejemplo: \"Disculpa, ¿sabes dónde queda el Starbucks?\" o \"¿Me puedes decir cómo llegar a la calle principal?\" Cuando te respondan, agradéceles y, si quieres, añade un cumplido rápido: \"Gracias, que tengas buen día, me gustan tus zapatos\". Luego retírate. Celébrate cada vez que pares a alguien, aunque te pongas nervioso. Hacerlo ya es un triunfo."),
    (9, "Direcciones + contacto visual",
     "Calentamiento: 5 saludos en passing. Sonríe, contacto visual, voz firme. Celébrate. Misión: detén a 5 personas y pregúntales por direcciones. Si te dicen que no saben, agradece igual: \"Gracias de todas formas\". Añade un cumplido o saludo al despedirte. Practica mantener el contacto visual mientras preguntas. Celébrate después de cada interacción. Eres un guerrero dominando el arte de detener gente."),
    (10, "Dirección + cumplido bonita",
     "Calentamiento: 5 saludos en passing. Hazlos con energía y buen tono. Celébrate. Misión: detén a 5 personas para pedir direcciones. Y AHORA, EL RETO: si la persona que detienes es una chica que te parece atractiva, al despedirte dile: \"Por cierto, pensé que te veías muy bonita hoy, cuídate\". Suelta el cumplido y retírate sin esperar nada. Celébrate como un campeón cada vez que te atrevas a hacerlo. Esto es un nivel superior."),
    (11, "2-3 chicas, cumplido bonita",
     "Calentamiento: 5 saludos en passing. Siempre con sonrisa. Celébrate. Misión: detén a 5 personas por direcciones. Busca específicamente detener al menos a 2 o 3 chicas para practicar el cumplido de \"bonita\". Recuerda: no te quedas a conversar, solo sueltas el cumplido con seguridad y te vas. Celébrate con fuerza después de cada uno. Te estás convirtiendo en alguien valiente."),
    (12, "3 mujeres, estilo o bonita",
     "Calentamiento: 5 saludos en passing. Varía los cumplidos para mantenerte fresco. Celébrate. Misión: detén a 5 personas por direcciones. Intenta que al menos 3 sean mujeres a las que les des el cumplido extra de \"bonita\" o \"me gusta tu estilo\". Si te tiembla la voz, no importa, hazlo igual. El coraje no es no tener miedo, es hacerlo a pesar del miedo. Celébrate como el guerrero que eres."),
    (13, "Sin presión + diario vs S1",
     "Calentamiento: 5 saludos en passing. Ahora debería costarte menos. Celébrate. Misión: detén a 5 personas por direcciones. Hoy ve con la mentalidad de que no hay presión: ellos pueden o no saber la dirección, pero tú cumples con tu misión de detenerlos, preguntar, dar un cumplido y retirarte. Celébrate al final de cada interacción. Registra en tu diario cómo te sientes comparado con la semana 1."),
    (14, "Salto de identidad",
     "Calentamiento: 5 saludos en passing. Tu calentamiento diario, ya deberías hacerlo casi automáticamente. Celébrate. Misión: detén a 5 personas (intenta que 3-4 sean mujeres) y aplica todo lo aprendido: dirección + cumplido bonito al despedirte. Reflexiona: hace 14 días no podías ni saludar a nadie. Ahora estás deteniendo desconocidos con confianza. Escribe en tu diario: \"He dado un salto enorme. Mi identidad está cambiando.\" Celébrate con todo, has completado 2 semanas."),
    (15, "False time: 5 cumplidos y me voy",
     "Calentamiento: 5-10 saludos en passing. Calienta el motor social. Celébrate tras cada uno. Misión (False Time Constraint): detén a 5 personas y diles: \"Oye disculpa, en realidad tengo que irme, pero solo quería decirte...\" Si es hombre: \"...que me gusta tu chaqueta/zapatos. ¡Cuídate!\" Si es mujer: \"...que pensé que tenías un look muy interesante\" o \"...que te ves muy linda hoy\". Sueltas el cumplido, das media vuelta y te vas. Celébrate con intensidad, estás mostrando intención y eso es de guerreros."),
    (16, "False time: intención romántica",
     "Calentamiento: 5-10 saludos en passing. Hazlos con energía. Celébrate. Misión (False Time): detén a 5 personas y aplica la frase: \"Tengo que irme pero quería decirte...\" Busca que la mayoría sean mujeres para practicar mostrar intención romántica. Ejemplo: \"Te vi pasar y pensé que tenías una presencia muy bonita, quería decírtelo. ¡Que tengas buen día!\" y te vas. Celébrate porque estás rompiendo barreras mentales."),
    (17, "False time: cumplidos variados",
     "Calentamiento: 5-10 saludos en passing. Cada vez más naturales. Celébrate. Misión (False Time): detén a 5 personas. Prueba variar el cumplido: \"Me gusta tu energía\", \"Tienes un estilo muy único\", \"Pensé que tenías una sonrisa bonita y quería decírtelo\". Usa siempre el \"tengo que irme\" al inicio para quitarte presión. Celébrate al final de cada interacción. Estás construyendo un nuevo súper poder."),
    (18, "False time: 5 mujeres, atractiva",
     "Calentamiento: 5-10 saludos en passing. Sonríe, proyecta, disfruta. Celébrate. Misión (False Time): detén a 5 mujeres (si puedes) y dales un cumplido con intención. Ejemplo: \"Hola, sé que tengo que irme pero te vi y quería decirte que me parece que eres muy atractiva. Que tengas lindo día\". Retírate inmediatamente. Esto entrena a tu cerebro para mostrar interés sin esperar validación. Celébrate con orgullo, eres un guerrero sin miedo al rechazo."),
    (19, "False time: cumplido directo",
     "Calentamiento: 5-10 saludos en passing. Sigue calentando. Celébrate. Misión (False Time): detén a 5 personas (mínimo 3 mujeres). Usa la técnica del \"tengo que irme\" y da el cumplido más directo que te atrevas: \"Te quería decir que me pareces muy linda\". No esperes respuesta, solo suéltalo y vete. Esto es exponerte progresivamente. Celébrate de forma épica después de cada uno."),
    (20, "False time: genuino y específico",
     "Calentamiento: 5-10 saludos en passing. Ya casi automático. Celébrate. Misión (False Time): detén a 5 personas. Hoy intenta que los cumplidos sean más específicos y genuinos. Observa algo real: su ropa, su sonrisa, su forma de caminar. Ejemplo: \"Me gusta cómo combinas los colores\". Celébrate y escribe en tu diario cómo te sientes al mostrar tu autenticidad sin filtros."),
    (21, "False time: hito 3 semanas",
     "Calentamiento: 5-10 saludos en passing. Llegó el día 21. Celébrate como siempre. Misión (False Time): detén a 5 personas. Hoy es un día especial: has llegado a la semana 3. Aplica todo lo aprendido. Intenta que todos tus targets sean mujeres para practicar la intención. Después de esta misión, escribe en tu diario: \"He completado 3 semanas. Mi cerebro ha cambiado. Ya no soy el que se quedaba callado. Soy un guerrero social en formación.\" Celébrate con todo, este es un hito enorme."),
    (22, "Intención + pregunta, 30s",
     "Calentamiento: 5-10 saludos en passing. Siempre el calentamiento. Celébrate. Misión (Intención + Pregunta): detén a 5 personas y ahora elimina el \"tengo que irme\". La nueva frase es: \"Oye disculpa, iba caminando hacia allá, pero te vi y quería decirte que me pareces muy bonita / me gusta tu look. ¿Cómo va tu día, por cierto?\". Esta vez te quedas a escuchar su respuesta. Si responde bien, intenta mantener la conversación al menos 30 segundos. Si no, agradece y retírate. Celébrate por atreverte a preguntar y quedarte."),
    (23, "Conversación 1 minuto",
     "Calentamiento: 5-10 saludos en passing. Celébrate. Misión (Intención + Conversación): detén a 5 personas (prioriza mujeres). Da el cumplido + pregunta por su día. Ahora intenta alargar la conversación 1 minuto. Si la chica responde bien, pregúntale su nacionalidad: \"¿De qué nacionalidad eres, por cierto? Es que me parecías...\" y comenta sobre eso. Si la conversación fluye, bien. Si no, agradece y retírate. Celébrate cada vez que logres más de 1 minuto de charla."),
    (24, "Charla 1-2 min + observación",
     "Calentamiento: 5-10 saludos en passing. Celébrate. Misión (Intención + Charla): detén a 5 personas. Usa la técnica de cumplido + pregunta. Si la conversación avanza, haz una observación sobre ella: \"Pareces muy energética\", \"Tienes una sonrisa muy cálida\". El objetivo es hablar 1-2 minutos. Celébrate con entusiasmo si logras mantener la interacción. Registra en diario las respuestas que te dieron y cómo te sentiste."),
    (25, "Conversación extendida 2 min",
     "Calentamiento: 5-10 saludos en passing. Celébrate. Misión (Conversación extendida): detén a 5 personas. Ahora, además de cumplido + pregunta, añade un cumplido más avanzado: \"Te vi y pensé: esta chica parece interesante, tengo que conocerla\". Luego haz preguntas abiertas sobre su día, lo que hace, etc. Intenta llegar a los 2 minutos de conversación con al menos 2 de las 5. Celébrate cada vez que la charla fluya."),
    (26, "Conversación + nombre",
     "Calentamiento: 5-10 saludos en passing. Celébrate. Misión (Conversación + Nombre): detén a 5 personas. Haz cumplido + pregunta. Si notas que la conversación va bien (la chica sonríe, te hace preguntas de vuelta), preséntate: \"Por cierto, soy [tu nombre]\" y extiende la mano para un apretón. Pregúntale su nombre. Practica este gesto de confianza. Celébrate cada vez que logres un nombre y una sonrisa."),
    (27, "Observaciones específicas 2-3 min",
     "Calentamiento: 5-10 saludos en passing. Celébrate. Misión (Conversación + Observaciones): detén a 5 personas. En la conversación, haz observaciones específicas sobre ella: \"Me da la sensación de que eres una persona muy divertida\" o \"Pareces alguien que tiene metas claras\". Esto profundiza la interacción. Intenta llegar a 2-3 minutos de charla. Celébrate al final de cada buena conversación. Estás aprendiendo a conectar."),
    (28, "Posible cierre: café o IG",
     "Calentamiento: 5-10 saludos en passing. Celébrate. Misión (Conversación + Posible cierre): detén a 5 personas. Ahora, si la conversación va bien y ves interés, atrévete a pedir algo: \"Oye, me caíste muy bien, ¿te gustaría tomar un café alguna vez?\" o \"¿Me darías tu Instagram para seguir en contacto?\". No importa si dice que sí o que no, el simple hecho de pedirlo es un TRIUNFO. Celébrate con toda tu alma si te atreves a pedir el contacto."),
    (29, "Ensayo general: estructura completa",
     "Calentamiento: 5-10 saludos en passing. Celébrate. Misión (Conversación completa): detén a 5 personas. Hoy es el ensayo general del día 30. Aplica toda la estructura: cumplido → pregunta → observación → nombre → intento de cierre. Si la conversación se apaga, no importa, soltaste todo tu arsenal. Registra en tu diario tus mejores interacciones. Celébrate por lo lejos que has llegado. Hace 29 días no podías ni saludar."),
    (30, "Celebración final",
     "Calentamiento: 5-10 saludos en passing. Celebra cada uno con la conciencia de que es tu último día de calentamiento de este ciclo. Misión (La celebración final): hoy es el GRAN DÍA. Sal y detén a 5 personas (mujeres idealmente). Aplica TODO lo aprendido: sonríe, contacto visual, voz firme, cumplido genuino, pregunta, escucha activa, observaciones, nombre, y si el momento lo permite, pide el contacto. No importa el resultado. El simple hecho de haber llegado hasta aquí te convierte en un guerrero diferente al del Día 1."),
]


def inject():
    days = [d for d, _, _ in BANK]
    if days != list(range(1, 31)):
        raise SystemExit("BANK mismatch: expected days 1-30, got %r" % days)

    d = json.loads(data_path.read_text(encoding="utf-8"))
    camps = d.setdefault("questCampaigns", [])
    camp = next((c for c in camps if c.get("id") == CAMPAIGN_ID), None)
    if camp is None:
        raise SystemExit("Campaign %s not found" % CAMPAIGN_ID)

    before = len(d["quests"])
    d["quests"] = [q for q in d["quests"] if q.get("source") != SOURCE]
    removed = before - len(d["quests"])
    if removed:
        print("Removed %d previous %s quests" % (removed, SOURCE))

    new_ids = []
    for day, title, desc in BANK:
        meta = _meta(day)
        qid = "quest_humildad_d%02d" % day
        d["quests"].append({
            "id": qid,
            "name": "Reto %d [%s]" % (day, title),
            "description": desc,
            "xp": meta["xp"],
            "gold": 5,
            "domain": "psychologicalWellbeing",
            "difficulty": meta["difficulty"],
            "completed": False,
            "completedDate": None,
            "kind": "campaign-challenge",
            "skillNodeId": "",
            "skillLevel": meta["skillLevel"],
            "school": "Campo",
            "linkedBossIds": [BOSS_ID],
            "bossDamage": meta["bossDamage"],
            "source": SOURCE,
            "campaignId": CAMPAIGN_ID,
        })
        new_ids.append(qid)

    camp["questIds"] = new_ids
    camp["sourceTag"] = SOURCE
    camp["description"] = (
        "Ciclo de 30 días (30 retos): passing → detener por direcciones → false time "
        "→ conversación. Humildad de volver a empezar en campo. Daña a Guiltmal. "
        "No sube nodos del Árbol."
    )
    camp["school"] = "Campo"
    camp["linkedBossIds"] = [BOSS_ID]
    camp["defaultBossDamage"] = 25

    data_path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    bank = [q for q in d["quests"] if q.get("source") == SOURCE]
    assert len(bank) == 30, len(bank)
    assert camp["questIds"] == [q["id"] for q in bank]
    dmg_sum = sum(q["bossDamage"] for q in bank)
    print("OK campaign", camp["id"], camp["name"])
    print("OK quests=%d bossDamage_sum=%d" % (len(bank), dmg_sum))
    for q in bank:
        print("  - %s dmg=%s %s L%s" % (q["name"], q["bossDamage"], q["difficulty"], q["skillLevel"]))
    print("Wrote", data_path)


if __name__ == "__main__":
    inject()
