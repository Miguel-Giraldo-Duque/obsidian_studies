# -*- coding: utf-8 -*-
"""Inject campaña Vendedor de calle + roadmap 2026-10-22 → 2026-11-01 (idempotent)."""
import json
import shutil
from datetime import datetime
from pathlib import Path

root = Path(__file__).resolve().parents[2]
data_path = root / ".obsidian/plugins/soulhy/data.json"
backup_dir = root / ".obsidian/plugins/soulhy/backups"

CAMPAIGN_ID = "qcamp_ventas_calle"
EVENT_ID = "qevent_ventas_calle"
BOSS_ID = "1786983444165"  # Guiltmal
SOURCE = "ventas-bank"
FLOWER_ID = "flower8"
START = "2026-10-22"
END = "2026-11-01"
DURATION_DAYS = 11  # 22/10 inclusive → 1/11

# (day, title, nivel, xp, dmg, difficulty, description)
BANK = [
    (1, "Ensayo general", 1, 10, 25, "easy",
     "Hoy no vendés: ensayás la apertura y la escucha hasta que salgan solas. "
     "1) Grabate la apertura tres veces, un foco por toma: velocidad lenta, sonrisa y mirada, pausa después de la pregunta. "
     "2) Role-play (alguien de confianza o el espejo) de dueño ocupado: 3 preguntas de descubrimiento y un «ahora no». "
     "3) Tres tarjetas si→entonces: si siento que molesto → «le traigo un dato que no tiene»; si dice ahora no → «¿mañana a esta hora te queda mejor?»; si me quedo en blanco → «¿hoy cómo los encuentra la gente nueva?». "
     "4) Abrí la demo y revisá que cargue (hotspot), brillo alto, batería llena. "
     "ANTES: «Miguel, ensayar es parte de ganar.» Instruccional: lento y con pausa. "
     "DURANTE: «Está yendo bien; cada toma es una repetición.» "
     "DESPUÉS: puño arriba, «¡listo para Kikiriki!». "
     "Diario: la toma que más me gustó fue ___ porque ___; mañana solo tengo que entrar y preguntar."),
    (2, "Kikiriki: abrir y escuchar", 1, 10, 25, "easy",
     "Terrero 1525, ideal 15:00–17:30. El reto se cumple si entrás, abrís, hacés 3 preguntas, mostrás la demo y pedís UN paso siguiente. Un no también cuenta. "
     "En la vereda: captura de Google «pollo frito» / «pollo frito coreano»; el botón Sitio web de Kikiriki manda a pedir.tucan.la, no a algo propio. Preguntá por Pedro o Claudia. Demo y WhatsApp listos. "
     "Guion: 1) «Hola, soy Miguel, armo páginas para locales de comida del barrio. ¿Es mal momento para mostrarte algo de tres minutos que vi buscándolos en Google?» Si es mal momento, agendá y andate: reto cumplido. "
     "2) Mini contrato: si no sirve, me decís que no. "
     "3) Dato de la captura. "
     "4) Tres preguntas (cómo los encuentra la gente nueva, WhatsApp de menú/precios, qué queda después de Rappi) y un espejo. "
     "5) Demo atada a lo que dijeron. "
     "6) «¿Te gustaría que la armemos para Kikiriki?» y callate. Si duda: demo por WhatsApp y volver en una fecha. "
     "ANTES: «Miguel, le traés un dato de su negocio.» Instruccional: pregunta y silencio. "
     "DURANTE: «Solo está confundido, pronto me va a entender.» "
     "DESPUÉS: a media cuadra, salto o puño. Registro y, si quedó demo, WhatsApp el mismo día. "
     "Diario: dijeron textual «___». Me costó ___. Hice bien ___. Paso siguiente: ___."),
    (3, "Cazador de no", 2, 12, 26, "medium",
     "Juntá 3 «no» en 3 locales distintos. Después de cada no, una pregunta más. Antes, 10 min de revisión de Kikiriki: ¿qué quedó más bajo, la página, vos, o que vas a cumplir? "
     "Guion del reto 2. Ante el no: «Te entiendo. ¿Qué tendría que tener algo así para que te sirva?» o «¿Por qué no, si puedo preguntar?». "
     "Si nadie dice que no, pediste poco: subí y pedí el cierre. WhatsApp o «volvé» es bonus, no reemplaza los 3 no. "
     "ANTES: «Miguel, hoy salís a buscar no. Cada no te acerca a los dos sí.» "
     "DURANTE: «Este no es de hoy, de este local, y no es sobre mí.» "
     "DESPUÉS: un festejo por cada no y uno grande al tercero. "
     "Diario: No #1 ___ (por qué). No #2 ___. No #3 ___. Qué aprendí de quedarme después del no: ___."),
    (4, "Detective del gap", 2, 12, 26, "medium",
     "No mostrás la demo hasta tener el estado actual y una frase de estado futuro dicha por el dueño. 3 locales. "
     "Casillas: entorno (cómo trabajan hoy), problema, impacto («¿y eso qué te genera?»), causa («¿por qué creés que pasa?»), emoción («¿cómo te cae eso?»). "
     "Pain funnel: «Contame más…», «¿Me das un ejemplo?», «¿Hace cuánto pasa?». "
     "Futuro: «Si esto estuviera resuelto, ¿cómo sería una semana buena?» Esa frase es la que repetís en la demo. "
     "Sin gap no hay precio. Si no lo encontraste: «Dejame pensarlo para tu caso y vuelvo el ___ con algo concreto.» "
     "ANTES: «A la gente le gusta que la escuchen.» Instruccional: pregunto y espero 3 segundos. "
     "DURANTE: si contesta corto, «contame más». "
     "DESPUÉS: celebración por cada gap; si no salió completo, celebrá igual que entraste. "
     "Diario: hoy ___ → quiere ___. La pregunta que más abrió: «___»."),
    (5, "Espejo y etiqueta", 2, 12, 26, "medium",
     "En cada charla: 2 etiquetas, 2 espejos y 1 resumen, hasta un «eso es así». Mínimo 3 locales. Si hay vuelta a Kikiriki, esa es la visita principal. "
     "Etiquetas: «Parece que los viernes los desbordan.» «Suena a que ya te vendieron cosas que no sirvieron.» "
     "Espejos: 1–3 palabras con tono de pregunta («¿Muy caro?», «¿Por Instagram?») y silencio. "
     "Resumen: «A ver si entendí: ___ . ¿Es así?» "
     "Antes de salir, 2 minutos de etiquetas grabadas. "
     "ANTES: «Hoy no tenés que convencer a nadie, solo entender.» Instruccional: etiqueta, silencio, espejo. "
     "DURANTE: si te corrige, «me está explicando». "
     "DESPUÉS: cada «eso es así» es un gol. "
     "Diario: etiqueta que funcionó «___». ¿Conseguí «eso es así»? Sí/No, con ___."),
    (6, "El dato que no sabía", 3, 15, 27, "medium",
     "Antes de cada visita, un dato de Google a medida, dicho en los primeros 30 segundos. 3 locales, horario valle. "
     "Buscá «<rubro> en <barrio>»: posición, si hay botón Sitio web, adónde lleva, qué competidor cercano sí tiene web. "
     "Frase: «Buscando ___ en el barrio, ___ aparece antes y tiene página con el menú; ustedes mandan a Instagram.» "
     "Abrí la demo en la sección que conecta con ese dato. "
     "Si desafían: «El que no te conoce elige en Google en 10 segundos; ahí es donde se pierde.» Sin pelear. "
     "ANTES: «Sabés algo de su negocio que él no sabe.» Instruccional: dato primero, demo después. "
     "DURANTE: «Si se sorprende, es porque el dato pega.» "
     "DESPUÉS: celebración. Bonus doble si dijo «no sabía eso». "
     "Diario: el dato que más pegó fue ___ en ___. Reacción textual: «___»."),
    (7, "Vender las vacaciones", 3, 15, 27, "medium",
     "Reescribí la demo para vender el resultado (el cliente nuevo que encuentra y escribe), no la técnica. "
     "Ecuación: resultado soñado = más gente nueva que escribe directo; probabilidad = competidor que ya aparece + «si no te gusta, la ajusto»; tiempo = online en una semana; esfuerzo = 20 minutos del dueño. "
     "Pitch de 90 segundos. Grabalo 5 veces, un foco por toma: tono de certeza, ritmo, frase de resultado, transición al cierre, silencio final. "
     "Puntuate 1–10: confianza en la página, en vos, en que cumplís. "
     "Si podés, 1 o 2 visitas entre las 15 y las 17 con la versión nueva. "
     "ANTES: «Estás vendiendo algo que le hace bien al local.» Instruccional: vacaciones, no el vuelo. "
     "DURANTE: «Esta toma es la repetición que me enseña.» "
     "DESPUÉS: guardá la mejor como toma oficial y celebrá de pie. "
     "Diario: mi frase de resultado es «___». Toma oficial #___. Decena más baja: ___."),
    (8, "Gimnasio de objeciones", 4, 18, 28, "hard",
     "Tarjetas Apoyo → Giro → Pedido, ensayadas en voz alta. Mañana no se improvisa. "
     "Instagram: «Buenísimo, seguí usándolo» → el que no te conoce busca en Google, y desde la página lo mando a tu Instagram → «¿Te muestro el botón?». "
     "Rappi/Tucán: «Perfecto, que siga» → la página es para que el que ya te eligió escriba directo → «¿Cuánto queda después de la comisión?». "
     "Es caro: «Es una inversión» → «¿Comparado con qué?» → opción en cuotas, sin bajar el número. "
     "Lo pienso: «Dale» → «¿Qué te hace dudar: el precio, si sirve o el tiempo?» → fecha concreta. "
     "No tengo tiempo: «Por eso lo hago yo; de vos son 20 minutos» → «¿Martes o miércoles te saco las fotos?». "
     "Role-play, 3 rondas, grabá la tercera. Un pedido de rechazo en cualquier lado para mantener el músculo. "
     "ANTES: «Una objeción es una pregunta disfrazada.» Instruccional: apoyo primero, nunca discuto. "
     "DESPUÉS: celebración al terminar la tercera ronda. "
     "Diario: la objeción que más me cuesta es ___. Mi mejor respuesta: «___»."),
    (9, "Ya tengo Instagram", 4, 18, 28, "hard",
     "4 contactos (valle, o 2 visitas + 2 seguimientos). Cazá «ya tengo Instagram» o «ya estoy en Rappi» y respondé acordando. "
     "Etiqueta primero: «Parece que Instagram les viene funcionando.» Después la tarjeta del gimnasio. "
     "Prueba en el celu: búsqueda donde Instagram no aparece como menú en Maps, y un competidor que sí. "
     "Pedí un paso chico: WhatsApp, volver, o demo a medida. Si no aparece la objeción: «¿Hoy dónde mostrás el menú?». "
     "ANTES: «Cuando dice Instagram, me está contando cómo vende hoy.» Instruccional: etiqueta, apoyo, muestro. "
     "DURANTE: «Solo está confundido entre Instagram y Google.» "
     "DESPUÉS: festejo cada vez que usaste la tarjeta, saliera bien o no. "
     "Diario: escuché esa objeción ___ veces. Mejor respuesta: «___». Resultado: ___."),
    (10, "Es caro", 4, 18, 28, "hard",
     "Decí el precio en voz alta, con calma y sin pedir perdón, en al menos 2 charlas. 4 visitas; mínimo 2 con el número dicho. Siempre después del gap y la demo. "
     "Anclaje: «Todo junto (página, dominio, Google armado y hosting del primer año) son 1.000 dólares, pago único. Si te queda más cómodo, 400 de entrada y 60 por mes.» Silencio. "
     "Si dice es caro: «Te entiendo» → «¿Caro comparado con qué?» o «¿Qué tendría que traerte para que valga la pena?» → volvé a SU gap. "
     "No bajes el precio en el momento. Descuento pedido = otra estructura o sacar algo, no regalar. "
     "ANTES: «El precio es justo y lo que das vale más.» Instruccional: digo el número y me callo. "
     "DURANTE: «Está calculando, no rechazando.» "
     "DESPUÉS: festejo cada vez que dijiste el número sin titubear. "
     "Diario: dije el precio ___ veces. Reacción: «___». ¿Ofrecí descuento? Sí/No. Pregunta: «___»."),
    (11, "Lo pienso", 4, 18, 28, "hard",
     "«Lo pienso» es una duda que no dijeron. Destapala y andate siempre con una fecha. 4 visitas o seguimientos. "
     "«Dale, totalmente. ¿Qué te queda dando vueltas: el precio, si sirve, o el tiempo?» "
     "«¿Sería una locura que paso el viernes a esta hora y me decís sí o no?» "
     "Permiso para el no: «Si es un no, decímelo; me sirve más que un capaz.» "
     "Fecha y hora anotadas delante de la persona. WhatsApp con la demo esa tarde. "
     "ANTES: «Un no claro también es una victoria.» Instruccional: calibrada, después fecha. "
     "DURANTE: «Solo está dudando; pronto me va a decir qué es.» "
     "DESPUÉS: celebrá cada fecha y cada no claro. "
     "Diario: detrás del «lo pienso» de ___ había: ___. Fecha: ___."),
    (12, "Pedir el sí y callarse", 5, 20, 30, "hard",
     "En cada charla con decisor donde haya gap y demo, pedí el cierre y callate. Meta: pedirlo al menos 2 veces (visitas nuevas o vueltas, Kikiriki incluido si quedó). "
     "Resumen con sus palabras: «Me dijiste que ___ y que ___. Esto ataca las dos cosas.» "
     "«¿La armamos para <local>?» o «¿Te queda mejor de una, o con la entrada y la cuota?» Silencio, aunque dure. Contá hasta 10. "
     "Si dice que sí: seña (alias o Mercado Pago), checklist y fecha de fotos. Si no: calibrada y fecha, como el reto anterior. "
     "ANTES: «Pedir es darle la oportunidad de resolver su problema.» Instruccional: pregunto y cuento hasta 10. "
     "DURANTE: «Está decidiendo.» "
     "DESPUÉS: celebración grande por cada cierre pedido. Si hay sí, la más grande de la campaña y un llamado a alguien querido. "
     "Diario: pedí el cierre ___ veces. Respuestas: ___. En el silencio sentí: ___."),
    (13, "Seguimiento sin miedo", 5, 20, 30, "hard",
     "Repasá todos los contactos abiertos. Fecha acordada = en persona. Los que no contestan, pregunta orientada al no. Mínimo 4 seguimientos y 1 puerta nueva. "
     "Ordenalos por calor. En persona: «La otra vez me dijiste que ___; vengo por la respuesta.» "
     "WhatsApp a los mudos: «Hola ___, ¿abandonaste la idea de la página para <local>?» Sin culpa. "
     "Después de 2 contactos sin respuesta, un último mensaje amable y a «más adelante» (volver en 4–6 semanas). "
     "ANTES: «El seguimiento es servicio; dijiste que ibas a volver y cumplís.» Instruccional: resumen y pregunta. "
     "DURANTE: «Si duda es porque le importa.» "
     "DESPUÉS: celebración por cada seguimiento, conteste o no. "
     "Diario: seguimientos ___. Respuestas ___. Contactos vivos: ___."),
    (14, "Jefe final: el balance", 5, 20, 30, "hard",
     "Cerrás la campaña con números, no con sensaciones. Si hay una vuelta agendada, ese contacto va primero. "
     "Contá: puertas, conversaciones con decisor, demos, precios dichos, cierres pedidos, sí, no (XP de valentía) y XP total. "
     "Tasa = sí ÷ conversaciones con decisor. Con esa tasa, cuántas puertas necesitás en noviembre por cada venta. "
     "Mirá la toma del reto 1 y grabá hoy la misma apertura. Compará. "
     "1 fortaleza y 1 «todavía no domino ___». Eso es el primer reto de noviembre. Agenda días y bloques fijos de visitas. "
     "ANTES: «Hiciste algo que la mayoría no se anima a hacer.» Instruccional: números, no sensaciones. "
     "DURANTE: «Ahora sé exactamente qué entrenar.» "
     "DESPUÉS: celebración de fin de campaña (correr, una comida, contárselo a alguien). Te la ganaste por haber jugado. "
     "Al completar este reto se abre la Flor Vereda. "
     "Diario: en la campaña, ___ puertas, ___ no, ___ sí. Lo que más creció: ___. En noviembre entreno: ___."),
]

SCHEDULE = {
    "2026-10-22": ["quest_ventas_d01", "quest_ventas_d02"],
    "2026-10-23": ["quest_ventas_d03"],
    "2026-10-24": ["quest_ventas_d04"],
    "2026-10-25": ["quest_ventas_d05"],
    "2026-10-26": ["quest_ventas_d06", "quest_ventas_d07"],
    "2026-10-27": ["quest_ventas_d08"],
    "2026-10-28": ["quest_ventas_d09"],
    "2026-10-29": ["quest_ventas_d10"],
    "2026-10-30": ["quest_ventas_d11"],
    "2026-10-31": ["quest_ventas_d12"],
    "2026-11-01": ["quest_ventas_d13", "quest_ventas_d14"],
}


def inject():
    days = [d for d, *_ in BANK]
    if days != list(range(1, 15)):
        raise SystemExit("BANK mismatch: expected days 1-14")
    scheduled = [qid for ids in SCHEDULE.values() for qid in ids]
    expected = ["quest_ventas_d%02d" % d for d in days]
    if scheduled != expected:
        raise SystemExit("SCHEDULE mismatch")
    if list(SCHEDULE)[0] != START or list(SCHEDULE)[-1] != END:
        raise SystemExit("window mismatch")

    raw = data_path.read_text(encoding="utf-8")
    d = json.loads(raw)
    backup_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y-%m-%d-pre-ventas-quests")
    backup = backup_dir / ("data.json." + stamp)
    if not backup.exists():
        shutil.copyfile(data_path, backup)

    before = len(d["quests"])
    d["quests"] = [q for q in d["quests"] if q.get("source") != SOURCE]
    removed = before - len(d["quests"])

    new_ids = []
    for day, title, nivel, xp, dmg, difficulty, desc in BANK:
        qid = "quest_ventas_d%02d" % day
        d["quests"].append({
            "id": qid,
            "name": "Reto %d [%s]" % (day, title),
            "description": desc,
            "xp": xp,
            "gold": 5,
            "domain": "livingStandards",
            "difficulty": difficulty,
            "completed": False,
            "completedDate": None,
            "kind": "campaign-challenge",
            "skillNodeId": "",
            "skillLevel": nivel,
            "school": "Campo",
            "linkedBossIds": [BOSS_ID],
            "bossDamage": dmg,
            "source": SOURCE,
            "campaignId": CAMPAIGN_ID,
        })
        new_ids.append(qid)

    camps = d.setdefault("questCampaigns", [])
    camps[:] = [c for c in camps if c.get("id") != CAMPAIGN_ID and c.get("sourceTag") != SOURCE]
    camps.append({
        "id": CAMPAIGN_ID,
        "name": "Vendedor de calle",
        "description": (
            "14 retos de venta en la vereda (22/10 al 1/11). Meta: 2 ventas. "
            "El reto se cumple por la acción: un no suma. Daña a Guiltmal. "
            "No sube nodos del Árbol. Cerrar el roadmap abre la Flor Vereda."
        ),
        "school": "Campo",
        "linkedBossIds": [BOSS_ID],
        "defaultBossDamage": 25,
        "flowerId": FLOWER_ID,
        "questIds": new_ids,
        "sourceTag": SOURCE,
        "createdAt": datetime.now().isoformat(timespec="milliseconds") + "Z",
    })

    events = d.setdefault("questEvents", [])
    events[:] = [e for e in events if e.get("id") != EVENT_ID]
    events.append({
        "id": EVENT_ID,
        "name": "Vendedor de calle",
        "status": "active",
        "startDate": START,
        "durationDays": DURATION_DAYS,
        "dailyQuota": 2,
        "poolQuestIds": new_ids,
        "weekConstraints": {
            "1": {"campaignIds": [CAMPAIGN_ID]},
            "2": {"campaignIds": [CAMPAIGN_ID]},
        },
        "assignments": {day: list(ids) for day, ids in SCHEDULE.items()},
        "completedInEvent": [],
        "flowerId": FLOWER_ID,
        "flowerUnlocked": False,
        "createdAt": datetime.now().isoformat(timespec="milliseconds") + "Z",
        "completedAt": None,
    })

    flower = next((f for f in d.get("flowers", []) if f.get("id") == FLOWER_ID), None)
    if flower is None:
        raise SystemExit("flower8 missing")
    if flower.get("unlocked"):
        raise SystemExit("flower8 already unlocked; pick another")
    flower["name"] = "Flor Vereda"
    flower["description"] = (
        "Esta flor representa haber entrado al local.\n\n"
        "El no es XP de valentía, no un veredicto. "
        "Vender es traer un dato que el dueño no tenía, decir el precio sin pedir perdón "
        "y pedir el sí en silencio. Se abre al cerrar el roadmap Vendedor de calle."
    )
    flower["bossId"] = None
    flower["roadmapEventId"] = None
    flower["unlocked"] = False
    flower["unlockedAt"] = None
    flower["damageReport"] = None

    data_path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    bank = [q for q in d["quests"] if q.get("source") == SOURCE]
    event = next(e for e in d["questEvents"] if e["id"] == EVENT_ID)
    assert len(bank) == 14
    assert event["poolQuestIds"] == [q["id"] for q in bank]
    assert event["assignments"]["2026-11-01"] == ["quest_ventas_d13", "quest_ventas_d14"]
    dmg_sum = sum(q["bossDamage"] for q in bank)
    xp_sum = sum(q["xp"] for q in bank)
    print("removed_previous", removed)
    print("OK campaign", CAMPAIGN_ID)
    print("OK event", EVENT_ID, START, "to", END, "days", DURATION_DAYS)
    print("OK quests=%d xp=%d dmg=%d flower=%s" % (len(bank), xp_sum, dmg_sum, FLOWER_ID))
    for day, ids in SCHEDULE.items():
        names = [next(q["name"] for q in bank if q["id"] == i) for i in ids]
        print(" ", day, " | ".join(names))
    print("backup", backup)


if __name__ == "__main__":
    inject()
