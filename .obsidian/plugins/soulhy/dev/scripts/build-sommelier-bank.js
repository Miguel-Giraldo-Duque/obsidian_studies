#!/usr/bin/env node
/**
 * Parse 001 banco de retos de incomodidad.md and emit:
 * - restructured markdown (Spanish, simple lists by nivel)
 * - dev/data/sommelier-challenges.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..', '..', '..');
const SOURCE = path.join(ROOT, '001 banco de quest', '001 banco de retos de incomodidad.md');
const OUT_MD = path.join(ROOT, '001 banco de quest', '001 banco de retos de incomodidad.md');
const OUT_JSON = path.join(__dirname, '..', 'data', 'sommelier-challenges.json');

const SKILL_LEVEL_BY_BANK = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3 };
const DIFFICULTY_BY_SKILL = { 1: 'easy', 2: 'medium', 3: 'hard' };

function skillLevelForBank(bankLevel) {
    return SKILL_LEVEL_BY_BANK[bankLevel] || 1;
}

function cleanText(text) {
    return text
        .replace(/\*\*/g, '')
        .replace(/\[🚨[^\]]*\]:\s*/g, '')
        .replace(/^\s*-\s*/, '')
        .trim();
}

function isMostlySpanish(text) {
    const spanishHints = /\b(pedir|preguntar|solicitar|extraño|grupo|mirada|voz|sin|con|una|el|la|los|las|que|por|para|durante|manteniendo|acércate|súbete|ve a|cuando|dile|mírala)\b/i;
    return spanishHints.test(text) || /[áéíóúñ¿¡]/i.test(text);
}

const EN_TRANSLATIONS = {
    1: 'Pide la hora a un desconocido, haz un cumplido sincero sobre su estilo y aléjate de inmediato antes de que pueda responder.',
    2: 'Pregunta a un desconocido en la calle cómo llegar a un punto de referencia muy visible que está justo frente a ambos.',
    3: 'Pregunta en una cafetería qué bebida es la opción más "romántica" porque estás planeando una cita ideal hipotética.',
    4: 'Mira a alguien en un espacio público, di un "¡Buenos días!" enérgico y, cuando se vea confundido, mantén contacto visual con calma sin corregirlo.',
    5: 'Pide a alguien en una librería que recomiende un libro para superar la sobreanalítica profunda.',
    6: 'Acércate a un desconocido en un parque y pregúntale si cree que las redes sociales arruinaron el cortejo humano genuino.',
    7: 'Pide un 10% de descuento en un café de cadena, diciendo que quieres ver si igualan tu buen ánimo de hoy.',
    8: 'Pregunta a un vendedor si puedes llevar gratis un artículo del escaparate porque combina con tu outfit.',
    9: 'Pide prestados 5 dólares a un desconocido prometiendo devolverlos "en un universo paralelo".',
    10: 'Siéntate junto a alguien en un banco público, permanece en silencio 2 minutos y luego ofrece un cumplido cálido y sereno.',
    11: 'Pide a un desconocido que califique tu carisma accesible del 1 al 10 basándose solo en tu forma de caminar.',
    12: 'Ofrece un precio menor a un comerciante independiente; cuando diga no, mantén mirada en silencio 5 segundos completos.',
    13: 'Pide a un bartender de alto nivel un vaso de agua del grifo tibia con una rodaja de cebolla cruda.',
    14: 'En un ascensor lleno, voltea hacia la multitud y di con calma: "Este silencio pesa, deberíamos crear un saludo secreto."',
    15: 'Pide a un desconocido que modele su mejor caminata de alta confianza para que aprendas de su postura.',
    16: 'Regala una flor a un desconocido diciendo "Esto es para alegrar tu día un 10%" y aléjate sin ver su reacción.',
    17: 'Entra a una concesionaria de autos de lujo con ropa muy casual y pide probar el modelo más caro.',
    18: 'Pregunta a un desconocido si cree en el destino o si cruzarse ahora es solo una anomalía estadística.',
    19: 'Intenta pagar un artículo de precio medio usando solo monedas de la denominación más baja.',
    20: 'Ve a la recepción de un hotel boutique de lujo y pide un upgrade gratis porque "el clima afuera está muy gris".',
    21: 'Pide a un cajero o barista una lección de vida profunda e improvisada antes de pagar.',
    22: 'Acércate a un orador o ejecutivo tras un evento y pide que escuche tu pitch de 30 segundos con brutal honestidad.',
    23: 'Pide a un desconocido leer su palma e inventa un futuro mundano y poco glamoroso con cara seria.',
    24: 'Pregunta si prefieren una cita de lujo estructurada o comer comida callejera sentados en la acera.',
    25: 'Pide a un guardia o policía direcciones a la "zona segura más cercana para introvertidos".',
    26: 'Pide a un desconocido sostener tu mirada 30 segundos en medio de una calle concurrida sin decir palabra.',
    27: 'Mira una obra en una galería, pregunta al curador por qué cuesta tanto y di que parece una estafa visual.',
    28: 'Pide a un vendedor usar el micrófono de la tienda para un breve anuncio a los compradores.',
    29: 'Acércate a una figura de autoridad y pide un tour de su área solo para empleados por curiosidad.',
    30: 'Pregunta a un conductor estacionado si te daría un viaje gratis a un destino a 15 minutos.',
    31: 'Acércate a un grupo de 3 o más desconocidos y pregunta: "¿Puedo unirme a su conversación aunque no los conozca?"',
    32: 'En una conversación grupal, cuenta una historia muy seca e aburrida (ej. cómo organizaste tu cajón de calcetines) y deja que caiga en silencio.',
    33: 'Cuenta un chiste deliberadamente malo a un grupo; si nadie ríe, míralos y explica seriamente la mecánica del chiste.',
    34: 'En un grupo, detente a mitad de frase, mira el piso 5 segundos y di "Perdí completamente el hilo" sin reír.',
    35: 'Siéntate en una mesa grande ocupada por desconocidos y pide comer ahí porque no te gusta comer solo.',
    36: 'Interrumpe una discusión inteligente y di: "No tengo idea de qué hablan. Explíquenmelo como a un niño."',
    38: 'Acércate a un grupo y pregunta: "¿Qué es lo primero de mi vibra o apariencia que les genera incomodidad?"',
    39: 'Únete a un grupo en un bar, habla 3 minutos, detente, di "Esta conversación terminó" y aléjate con rigidez.',
    40: 'Pide a un grupo que califique tu estilo de acercamiento del 1 al 10 sin sonreír mientras dan feedback.',
    41: 'Cuenta a desconocidos una teoría bizarra (ej. vivimos en una simulación controlada por pájaros) con expresión intensa y seria.',
    42: 'Camina hacia atrás 20 metros por una calle peatonal muy concurrida absorbiendo las miradas sin reaccionar.',
    43: 'Detente en medio de una multitud, inclina la cabeza al cielo 2 minutos y observa cómo los grupos te evitan.',
    44: 'Pide a un grupo en un evento que te enseñen su peor y más incómodo movimiento de baile en el momento.',
    45: 'Compra en una tienda una combinación bizarra de artículos (cuchillo grande, cinta, bolsas de basura y un osito rosa) en silencio total.',
    46: 'Pregunta a un grupo algo existencial profundo: "¿Qué haces cuando te das cuenta de que nada de esto importa?"',
    47: 'Siéntate junto a un grupo e imita sutilmente su postura colectiva sin decir palabra durante 1 minuto.',
    48: 'Pide a desconocidos cantar un verso contigo para superar una fobia personal profunda.',
    49: 'Di a un grupo: "Estoy haciendo un experimento de rechazo y necesito que me abuchen colectivamente de este lugar."',
    51: 'Tras los 3 malos chistes en el Open Mic, quédate 30 segundos más explicando técnicamente por qué el silencio es fascinante.',
    52: 'Siéntate solo en una mesa prominente y pide platos y cubiertos extra para tu "ego invisible".',
    53: 'Camina por un mercado con una mancha falsa ridícula en la camisa interactuando con vendedores sin mencionarla.',
    54: 'Finge ser guía local ante turistas y dales datos históricos absurdos e inventados sobre un edificio básico.',
    55: 'Pregunta a un grupo: "¿Quién es el líder alfa de este círculo y cómo lo desafío?"',
    56: 'Quédate en una plaza con los brazos abiertos como estatua humana hasta que al menos 5 grupos te miren confundidos.',
    57: 'Pide una papa frita del plato de alguien en un café porque "compartir construye comunidad global".',
    58: 'Pide colarte en una fila porque eres demasiado perezoso para esperar ahí.',
    59: 'Lee a un grupo elegante un poema dramático y oscuro con tono totalmente plano.',
    60: 'Camina frente a un grupo modelando como pasarela parisina y sostén contacto visual intenso con su líder.',
    61: 'Pide a desconocidos apoyar tu cabeza en su hombro 10 segundos para recargar energía.',
    62: 'Ve a un bar concurrido solo y pide una bebida infantil (leche con chocolate) mirando intensamente a grupos cercanos.',
    63: 'Cuenta una historia personal que te haga ver poco cool, sin convertirla en chiste.',
    64: 'Acércate a un grupo, abre un cuaderno y toma notas formales de sus interacciones con mirada clínica.',
    65: 'Anuncia que se te acabaron las cosas interesantes para encajar y quédate en silencio con ellos.',
    66: 'Acércate a alguien que te atrae y pregunta: "¿Cuál es la primera red flag que mi presencia te señala?"',
    67: 'Dile a alguien atractivo que quieres practicar tu peor línea de ligue para ver su reacción.',
    68: 'Pide a un desconocido atractivo una lección de mirada seductora perfecta.',
    69: 'Mira a alguien atractivo, cruza miradas y manda una bebida con nota: "De un hombre aterrorizado de acercarse."',
    70: 'Dile a alguien: "Tu presencia me intimida, voy a quedarme aquí hasta que mi pánico baje."',
    71: 'Pregunta a una mujer cuál es el rasgo más atractivo en un hombre que no tenga que ver con su cuerpo.',
    72: 'Tóstale a alguien atractivo solo a través del reflejo en un espejo.',
    73: 'Pide el rechazo más educado, definitivo y helado posible para construir carácter.',
    74: 'Pide a una mujer en la calle su mejor consejo para entender el deseo femenino.',
    76: 'Si pierdes el reto del helado por contacto visual, págalo con calma y di que valió la pena ver sus ojos de cerca.',
    77: 'Si ganas el reto del helado, reclama el premio con firmeza y mantén conversación seria mientras comen.',
    78: 'Pide a una mujer sostener tu mano 15 segundos para cruzar la calle por "vértigo emocional" en multitudes.',
    80: 'Si rechaza tu expresión de deseo, quédate con el pinchazo, asiente y di "Entiendo y lo respeto" sin huir.',
    81: 'Pregunta a grupos de mujeres su opinión honesta sobre cuánto importa el tamaño del pene vs. la conexión emocional.',
    83: 'Tras la confesión sexual cruda, no bajes la mirada ni pidas perdón; mantén la cabeza alta y deja respirar la vulnerabilidad.',
    84: 'Di a un desconocido atractivo: "Quiero pedir tu número pero mi ego dice que no soy lo suficientemente atractivo."',
    85: 'Ofrece ser modelo anatómico masculino desnudo en una escuela de arte o estudio de dibujo.',
    86: 'Quédate completamente desnudo ante una clase de dibujo dejando que te observen con objetividad clínica.',
    87: 'Pide a alguien atractivo una "calificación" de tus habilidades de coqueteo tras 2 minutos de charla.',
    88: 'Siéntate junto a alguien atractivo y lee en voz alta un libro sobre sexualidad o intimidad.',
    89: 'Pregunta si la química física se puede fabricar solo con confianza cruda.',
    90: 'Di directamente: "Me atraes mucho y elijo decírtelo sin escudo cómico ni juegos."',
    91: 'Pide escribir en una servilleta una descripción honesta de su belleza estética frente a ella.',
    92: 'Di: "Pensar en besarte acelera mi corazón y quería ser honesto sobre esa tensión."',
    93: 'Pide su número especificando que solo lo dé si siente una chispa genuina.',
    94: 'Di: "Te noté, pensé cinco frases ingeniosas, pero decidí saludarte siendo yo mismo."',
    95: 'Pide apartarse de sus amigos 1 minuto para una conversación ininterrumpida.',
    96: 'Di en una cita: "Soy inexperto en romance; todo lo que digo ahora es crudo y sin pulir."',
    97: 'Pide sentarse en silencio absoluto 1 minuto mirándose a los ojos.',
    98: 'Di: "Mi deseo por ti es transparente y estoy bien con cualquier respuesta."',
    99: 'Invítala a una cita formal este fin de semana y quédate quieto mientras te evalúa.',
    100: 'Acércate a alguien intimidante, declara tu atracción y entrégale un papel con "Sí / No" para un café.',
    101: 'Ve a un café o restaurante de lujo con tu ropa más vieja y pide una mesa premium con total confianza.',
    102: 'Si el anfitrión juzga tu ropa, míralo con calma y di: "Mi atuendo no altera el valor de mi dinero. Mesa para uno."',
    103: 'Pide ketchup comercial barato como acompañamiento de un plato premium en un restaurante de lujo.',
    105: 'Si se ríen de tu salario, no bajes el precio ni pidas perdón. Di: "Ese es el costo de mi enfoque absoluto."',
    106: 'Llama en frío al director de RR.HH. de una empresa que deseas y pide una entrevista de 10 minutos sin cita.',
    107: 'Entra a una oficina corporativa de alto nivel sin cita y pide hablar con el CEO por una consulta personal.',
    108: 'En una entrevista, cuando pregunten tu mayor debilidad, di tu falla profesional más profunda sin convertirla en virtud.',
    109: 'Pide a un mentor una reseña escrita brutal y sin filtros de tus defectos.',
    110: 'Mira a un cliente o empleador y di: "Soy la opción más cara, pero también la que menos preocupaciones te dará."',
    111: 'Ve a un intercambio de idiomas e interactúa 15 minutos con un acento extranjero inventado y absurdo.',
    112: 'Acércate a una extranjera atractiva en un bar y dile en inglés básico: "Mi inglés es muy malo, pero quiero hablar contigo."',
    113: 'Si no encuentras una palabra en inglés, no rías, no gesticules ni uses español; sostén el silencio hasta encontrarla.',
    115: 'Tras un karaoke terrible, mira a la multitud y di al micrófono: "Ese fue el primer single de mi álbum de arte crudo."',
    116: 'Pide a un angloparlante traducir una frase romántica intensa para usarla después.',
    117: 'Mantén una conversación compleja de 10 minutos en inglés usando la app de traducción solo una vez.',
    118: 'Ve a un evento de networking de alto nivel con joggers casuales y preséntate como consultor independiente.',
    119: 'Pide a un reclutador que te rechazó una llamada de "entrevista de salida" detallando por qué no fuiste suficiente.',
    120: 'Dile a una angloparlante atractiva: "Mi gramática es terrible, pero mi intención de conocerte es clara."',
    121: 'Intenta comprar un servicio premium y pregunta si puedes pagar con trueque o intercambio de servicios.',
    123: 'Durante la conversación intensa en inglés, dile con calma que estás ejecutando un experimento neurobiológico de rechazo.',
    124: 'Pide feedback directo en inglés sobre cómo manejaste la tensión social del momento.',
    125: 'Únete a un grupo de expats hablando de política global en inglés sin disculparte por tu acento.',
    126: 'Entra a una oficina corporativa, pide al gerente y solicita que expliquen cara a cara por qué sus valores coinciden con tu estándar.',
    127: 'Pide sentarte en una reunión interna privada de estrategia solo para observar la cultura corporativa.',
    128: 'Di a un socio potencial: "Busco una plataforma que me desafíe; quiero ver si pueden con mi ambición."',
    129: 'Pide a un profesional de alto estatus una hora semanal gratis como mentor de carrera.',
    130: 'Sube a una silla en la plaza o venue más concurrida, declara en voz seria que "el miedo es una ilusión" e invita a una cita a quien te mire.'
};

function toSpanish(challengeNum, raw) {
    const cleaned = cleanText(raw);
    if (isMostlySpanish(cleaned)) return cleaned;
    if (EN_TRANSLATIONS[challengeNum]) return EN_TRANSLATIONS[challengeNum];
    return cleaned;
}

function parseSource(content) {
    const sections = content.split(/^## \d+\.\s+Nivel \d+/m).slice(1);
    const challenges = [];

    sections.forEach((section, idx) => {
        const bankLevel = idx + 1;
        const skillLevel = skillLevelForBank(bankLevel);
        let number = 0;

        const lines = section.split('\n');
        for (const line of lines) {
            const challengeMatch = line.match(/^\s*-\s*\*\*Challenge (\d+)\*\*:\s*(.+)$/i);
            if (challengeMatch) {
                number++;
                const num = parseInt(challengeMatch[1], 10);
                challenges.push({
                    bankLevel,
                    number,
                    challengeNum: num,
                    text: toSpanish(num, challengeMatch[2]),
                    skillLevel
                });
                continue;
            }

            const numberedMatch = line.match(/^\s*(\d+)\.\s+(.+)$/);
            if (numberedMatch && !line.includes('**Challenge')) {
                number++;
                challenges.push({
                    bankLevel,
                    number,
                    challengeNum: null,
                    text: cleanText(numberedMatch[2]),
                    skillLevel
                });
            }
        }
    });

    return challenges;
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

function main() {
    const content = fs.readFileSync(SOURCE, 'utf8');
    const challenges = parseSource(content);

    const md = buildMarkdown(challenges);
    fs.writeFileSync(OUT_MD, md, 'utf8');

    const json = challenges.map(c => ({
        bankLevel: c.bankLevel,
        number: c.number,
        text: c.text,
        skillLevel: c.skillLevel
    }));
    fs.writeFileSync(OUT_JSON, JSON.stringify(json, null, 2), 'utf8');

    const jsPath = path.join(__dirname, '..', 'data', 'sommelier-challenges.js');
    const jsContent = `/* Auto-generated by dev/scripts/build-sommelier-bank.js */\nconst SOMMELIER_CHALLENGES = ${JSON.stringify(json, null, 2)};\n\nmodule.exports = { SOMMELIER_CHALLENGES };\n`;
    fs.writeFileSync(jsPath, jsContent, 'utf8');

    const byBank = {};
    const bySkill = {};
    challenges.forEach(c => {
        byBank[c.bankLevel] = (byBank[c.bankLevel] || 0) + 1;
        bySkill[c.skillLevel] = (bySkill[c.skillLevel] || 0) + 1;
    });

    console.log(`Challenges: ${challenges.length}`);
    console.log('By bank:', byBank);
    console.log('By skill:', bySkill);
    console.log('Wrote:', OUT_MD);
    console.log('Wrote:', OUT_JSON);
}

main();
