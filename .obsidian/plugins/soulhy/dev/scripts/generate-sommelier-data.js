#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..', '..', '..');
const OUT_MD = path.join(ROOT, '001 banco de retos de incomodidad.md');
const OUT_JSON = path.join(__dirname, '..', 'data', 'sommelier-challenges.json');
const OUT_JS = path.join(__dirname, '..', 'data', 'sommelier-challenges.js');

const SKILL_LEVEL_BY_BANK = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3 };

const BANK = {
  1: [
    'Pedir un descuento del 10% en una tienda de conveniencia sin motivo alguno.',
    'Preguntar la hora a 5 personas desconocidas de forma consecutiva en el mismo lugar.',
    'Solicitar un vaso de agua gratis en una cafetería de marca sin consumir nada.',
    'Pedir permiso para dejar un objeto personal (ej. un libro) en el mostrador de una tienda mientras haces un recado.',
    'Intentar pagar una compra pequeña con un billete de denominación máxima (100 USD/EUR) y pedir cambio.',
    'Preguntar si puedes probarte una prenda que está en el maniquí del escaparate.',
    'Pedir un ingrediente extra gratuito en un puesto de comida rápida después de que el pedido esté cerrado.',
    'Solicitar una muestra gratuita de un producto que claramente no tiene muestras abiertas.',
    'Preguntar por una dirección inexistente a tres personas diferentes.',
    'Pedir usar el teléfono de un local comercial alegando que el tuyo se quedó sin batería.',
    'Solicitar permiso para pasar primero en una fila de supermercado con solo un artículo.',
    'Pedir un café y luego preguntar si pueden hacerlo con un diseño de espuma que no ofrecen.',
    'Preguntar en una farmacia si venden artículos de ferretería pesada.',
    'Pedir prestado un bolígrafo a un extraño y devolverlo a los 3 segundos.',
    'Solicitar un "reintegro" de un centavo en una compra redondeada.',
    'Preguntar a un guardia de seguridad si puede cuidar tu mochila 30 segundos mientras te atas los cordones.',
    'Pedir que te cambien un producto en perfecto estado solo porque "cambiaste de opinión" un minuto después.',
    'Solicitar un catálogo físico en una tienda que se promociona como 100% digital.',
    'Pedir que te calienten una comida externa en el microondas de un café comercial.',
    'Preguntar si puedes comprar "media unidad" de un producto empaquetado (ej. medio paquete de galletas).'
  ],
  2: [
    'Pedir una recomendación de café detallada y, tras la explicación, rechazarla diciendo: "No me convence, gracias".',
    'Solicitar a un extraño que te tome una foto "artística" desde un ángulo muy incómodo o bajo.',
    'Intentar unirse a una conversación ajena en un evento social preguntando educadamente: "¿De qué hablan?".',
    'Comentar algo positivo sobre la vestimenta de un desconocido y sostener la mirada dos segundos tras el cumplido.',
    'Pedir a alguien en la calle que te cuente un chiste porque "te sientes serio".',
    'Solicitar a un dependiente que te explique un producto complejo y marcharte sin mediar compra.',
    'Preguntar a alguien en un parque qué libro lee y por qué decidió comprar ese específicamente.',
    'Pedir permiso para acariciar a un perro cuya dueño parece tener mucha prisa.',
    'Iniciar una conversación sobre el clima en un ascensor lleno y mantener el flujo hasta tu piso.',
    'Pedir a alguien que te guarde el sitio en una fila y tardar deliberadamente 4 minutos en volver.',
    'Solicitar una opinión honesta sobre dos prendas de ropa a un desconocido en una tienda.',
    'Preguntar a un extraño: "¿Qué es lo más interesante que te ha pasado hoy?".',
    'Pedir a un camarero que te sorprenda con una bebida "inventada" por él en el momento.',
    'Intentar entablar conversación con alguien que lleva auriculares (pidiendo permiso primero).',
    'Pedir a un grupo de personas si puedes sentarte a escuchar su charla en una mesa cercana.',
    'Solicitar que te enseñen a usar una aplicación específica en el teléfono a un transeúnte joven.',
    'Preguntar a alguien si cree que "tu estilo personal encaja" con la estética del lugar.',
    'Pedir una moneda para el carrito del supermercado a alguien que ya ha guardado su compra.',
    'Solicitar a un músico callejero que toque una canción extremadamente específica que probablemente no sepa.',
    'Saludar y sonreír deliberadamente a cada persona que encuentres en un pasillo estrecho o corredor.'
  ],
  3: [
    'Pedir prestado un billete pequeño a un desconocido sin dar una explicación de emergencia.',
    'Solicitar un "tour" privado por la cocina de un restaurante sin ser un cliente habitual.',
    'Pedir permiso para sentarte en una mesa ya ocupada por una sola persona en una cafetería llena.',
    'Preguntar en la recepción de un hotel de lujo si puedes usar su piscina gratis "solo por hoy".',
    'Solicitar a un extraño que te ceda su asiento en el transporte público sin tener una necesidad física obvia.',
    'Pedir en una biblioteca que te permitan llevarte un libro de la sección de "solo consulta".',
    'Intentar negociar el precio de un plato específico en un restaurante de menú fijo.',
    'Pedir a un vecino con el que no hablas que te preste un objeto de valor (ej. una herramienta eléctrica).',
    'Intentar entrar a una charla, evento de networking o fiesta privada sin tener la invitación.',
    'Pedir a un desconocido que te compre un café o un snack "porque tienes curiosidad de si lo haría".',
    'Solicitar en un cine que te dejen entrar gratis a ver los últimos 15 minutos de una película.',
    'Pedir permiso para cargar tu teléfono en un enchufe que está detrás del mostrador de un banco o bar.',
    'Preguntar a un conferencista, al terminar su charla, si puedes subir al escenario a tomarte una foto con el micrófono.',
    'Pedir a un taxista un descuento del 20% antes de subir al vehículo.',
    'Solicitar probar un bocado de la comida de un desconocido (en un patio de comidas relajado).',
    'Pedir en una tienda que te reserven una prenda por 10 días sin dejar ningún depósito de dinero.',
    'Preguntar en una ventanilla bancaria si pueden mostrarte fajos de billetes de alta denominación "para ver cómo huelen".',
    'Solicitar a un desconocido que te ayude a cargar una bolsa durante tres manzanas completas.',
    'Pedir en un museo o galería permiso para tocar una obra que no tiene protección de cristal.',
    'Intentar devolver un artículo usado y sin etiquetas en una tienda, argumentando que "ya no te define".'
  ],
  4: [
    'Pedir hablar con el gerente para elogiar un detalle insignificante de forma muy insistente y formal.',
    'Proponer un brindis espontáneo por "el coraje de estar vivos" en un restaurante concurrido.',
    'Llamar a una suscripción activa y pedir un descuento del 50% "porque eres un cliente leal y el mundo es caro".',
    'Entrar en una oficina ajena y pedir permiso para usar su impresora para un documento personal.',
    'Solicitar a un grupo de personas en la calle que se detengan y canten una estrofa de una canción contigo.',
    'En una charla pública, pedir el micrófono para compartir una reflexión personal de 2 minutos (no una pregunta).',
    'Intentar entrar a una zona VIP o restringida de un evento actuando con total autoridad y "asumiendo" el paso.',
    'Pedir a un oficial de seguridad o policía si puedes "sostener su gorra" para una foto rápida.',
    'Solicitar en un restaurante de alta demanda una mesa que tiene el cartel de "Reservado", asumiendo que pueden moverla.',
    'Pedir a un jefe o figura de autoridad que te explique un concepto simple por cuarta vez consecutiva.',
    'Solicitar permiso para hacer una encuesta personal de 5 minutos a un grupo que está almorzando.',
    'Pedir un reembolso por un café que ya te terminaste, alegando que "el sabor no coincidió con tu estado de ánimo".',
    'Proponer una colaboración comercial audaz (y casi absurda) a un directivo de alto nivel por LinkedIn o en persona.',
    'Pedir en el mostrador de un aeropuerto un upgrade a primera clase "porque es un gran día para ser generosos".',
    'Solicitar a un conductor de autobús o transporte que haga una parada no oficial en la puerta de tu destino.',
    'Pedir a un DJ en un evento que cambie el género musical actual por uno opuesto (ej. de tecno a bolero).',
    'Solicitar en una oficina de servicios si puedes pagar un trámite "mañana", dejando tu palabra como garantía.',
    'Pedir permiso para dar un "discurso de motivación" de 1 minuto en el pasillo de un vagón de metro.',
    'Intentar pagar una cuenta con una tarjeta que sabes que será denegada y liderar la negociación de la solución sin perder la calma.',
    'Pedir a un extraño que te entreviste durante 10 minutos sobre tus metas de vida, grabando la interacción.'
  ],
  5: [
    'Pedir permiso en una plaza pública para anunciar un mensaje personal por un megáfono durante 2 minutos.',
    'Intentar negociar el precio de un artículo de lujo (reloj, joyería) de forma audaz y persistente, ofreciendo pagos inusuales.',
    'Declarar una opinión impopular pero respetuosa en un foro público y sostenerla con calma ante la crítica masiva.',
    'Pedir permiso al dueño de un local para pintar una pequeña marca artística temporal en su fachada.',
    'Solicitar a un extraño que te deje pasar la noche en su sofá argumentando que "estás documentando la hospitalidad humana".',
    'Pedir en un centro comunitario o iglesia dar una charla de 5 minutos sobre la importancia de fracasar.',
    'Intentar vender un objeto de poco valor (ej. un clip) por un precio exorbitante (100 USD) explicando su "historia emocional".',
    'Pedir a un medio de comunicación local que te haga una entrevista breve sin tener una noticia, solo por "ser tú".',
    'Solicitar a una figura pública (vía redes o en persona) que sea tu mentor personal de forma gratuita.',
    'Organizar un baile improvisado (flashmob de una sola persona) en el centro de un centro comercial.',
    'Intentar entrar a trabajar en una empresa por un día como "pasante espontáneo" sin cita previa ni currículum.',
    'Pedir a un desconocido que intercambie una prenda de ropa que lleva puesta (ej. chaqueta) por la tuya.',
    'Solicitar un préstamo de dinero significativo (1,000+) a un contacto de networking reciente bajo palabra de honor.',
    'Pedir permiso para "dirigir" el tráfico peatonal o una fila en un evento de forma lúdica.',
    'Declarar efusivamente tu "gratitud por existir" a desconocidos en la calle y observar su incomodidad sin retirarte.',
    'Pedir una reunión con el director de un banco para proponerle una idea de inversión basada en "sueños" y no en activos.',
    'Solicitar a un extraño que te preste las llaves de su coche solo para sentarte 1 minuto y "sentir el motor".',
    'Intentar negociar el alquiler de tu vivienda actual a la mitad del precio con el propietario, manteniendo la postura.',
    'Pedir permiso para dormir una siesta de 15 minutos en un colchón de exhibición en una tienda de muebles de alta gama.',
    'El Funeral de Identidad: Organizar un evento público o reunión donde pidas a conocidos y extraños que critiquen tus mayores defectos, mientras tú escuchas con amabilidad y compasión sin defenderte.',
    'Ve a un café o restaurante de lujo con tu ropa más vieja y pide una mesa premium con total confianza.',
    'Si el anfitrión juzga tu ropa, míralo con calma y di: "Mi atuendo no altera el valor de mi dinero. Mesa para uno."',
    'Pide ketchup comercial barato como acompañamiento de un plato premium en un restaurante de lujo.',
    'Durante una entrevista de trabajo o negociación laboral, pide una cifra salarial que sea exactamente un 40% más alta de lo esperado, y quédate en silencio absoluto inmediatamente después de decir el número.',
    'Si se ríen de tu salario, no bajes el precio ni pidas perdón. Di: "Ese es el costo de mi enfoque absoluto."',
    'Llama en frío al director de RR.HH. de una empresa que deseas y pide una entrevista de 10 minutos sin cita.',
    'Entra a una oficina corporativa de alto nivel sin cita y pide hablar con el CEO por una consulta personal.',
    'En una entrevista, cuando pregunten tu mayor debilidad, di tu falla profesional más profunda sin convertirla en virtud.',
    'Pide a un mentor una reseña escrita brutal y sin filtros de tus defectos.',
    'Mira a un cliente o empleador y di: "Soy la opción más cara, pero también la que menos preocupaciones te dará."',
    'Ve a un intercambio de idiomas e interactúa 15 minutos con un acento extranjero inventado y absurdo.',
    'Acércate a una extranjera atractiva en un bar y dile en inglés básico: "Mi inglés es muy malo, pero quiero hablar contigo."',
    'Si no encuentras una palabra en inglés, no rías, no gesticules ni uses español; sostén el silencio hasta encontrarla.',
    'Ve a un karaoke completamente solo, súbete al escenario y pide una canción que no conozcas. Cántala en serio sin hacer comedia.',
    'Tras un karaoke terrible, mira a la multitud y di al micrófono: "Ese fue el primer single de mi álbum de arte crudo."',
    'Pide a un angloparlante traducir una frase romántica intensa para usarla después.',
    'Mantén una conversación compleja de 10 minutos en inglés usando la app de traducción solo una vez.',
    'Ve a un evento de networking de alto nivel con joggers casuales y preséntate como consultor independiente.',
    'Pide a un reclutador que te rechazó una llamada de "entrevista de salida" detallando por qué no fuiste suficiente.',
    'Dile a una angloparlante atractiva: "Mi gramática es terrible, pero mi intención de conocerte es clara."',
    'Intenta comprar un servicio premium y pregunta si puedes pagar con trueque o intercambio de servicios.',
    'Ve a un bar exclusivo de extranjeros, identifica a la persona más atractiva y acércate a hablarle en inglés, sosteniendo la interacción con tu nivel actual.',
    'Durante esa conversación intensa en inglés, dile con calma que estás ejecutando un experimento neurobiológico de rechazo.',
    'Pide feedback directo en inglés sobre cómo manejaste la tensión social del momento.',
    'Únete a un grupo de expats hablando de política global en inglés sin disculparte por tu acento.',
    'Entra a una oficina corporativa, pide al gerente y solicita que expliquen cara a cara por qué sus valores coinciden con tu estándar.',
    'Pide sentarte en una reunión interna privada de estrategia solo para observar la cultura corporativa.',
    'Di a un socio potencial: "Busco una plataforma que me desafíe; quiero ver si pueden con mi ambición."',
    'Pide a un profesional de alto estatus una hora semanal gratis como mentor de carrera.',
    'Sube a una silla en la plaza o venue más concurrida, declara en voz seria que "el miedo es una ilusión" e invita a una cita a quien te mire.'
  ]
};

function buildChallenges() {
  const out = [];
  for (const [bankStr, items] of Object.entries(BANK)) {
    const bankLevel = Number(bankStr);
    const skillLevel = SKILL_LEVEL_BY_BANK[bankLevel];
    items.forEach((text, idx) => {
      out.push({ bankLevel, number: idx + 1, text, skillLevel });
    });
  }
  return out;
}

function buildMarkdown(challenges) {
  const lines = ['# Banco de retos de incomodidad — Sommelier', ''];
  let currentBank = 0;
  challenges.forEach(c => {
    if (c.bankLevel !== currentBank) {
      currentBank = c.bankLevel;
      lines.push(`## Nivel ${currentBank}`, '');
    }
    lines.push(`${c.number}. ${c.text}`);
  });
  lines.push('');
  return lines.join('\n');
}

const challenges = buildChallenges();
fs.writeFileSync(OUT_MD, buildMarkdown(challenges), 'utf8');
fs.writeFileSync(OUT_JSON, JSON.stringify(challenges, null, 2), 'utf8');
fs.writeFileSync(OUT_JS, `/* Auto-generated */\nconst SOMMELIER_CHALLENGES = ${JSON.stringify(challenges, null, 2)};\n\nmodule.exports = { SOMMELIER_CHALLENGES };\n`, 'utf8');
console.log(`Generated ${challenges.length} challenges`);
