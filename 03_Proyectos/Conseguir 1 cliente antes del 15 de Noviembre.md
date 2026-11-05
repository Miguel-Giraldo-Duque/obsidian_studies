---
tipo: proyecto
estado: activo
inicio: 2026-11-05
fin: 2026-11-15
vow: Soy vendedor
granos: 30
libros: []
escuela: []
---
# Sprint: 1 cliente antes del 15 Nov

North Star (lag): **1 seña** cobrada o compromiso escrito ≤ 15-nov  
Inicio: 05-nov | Fin: 15-nov | Días: **11** | Score meta: ≥ **85%** de tácticas del día

## 1) Objetivo

Conseguir **1 seña** de sitio web antes del 15 de noviembre (calle + referidos).

## 2) Key Results

- [ ] KR1: 1 cliente con seña (30% o acuerdo escrito con fecha de pago)
- [ ] KR2: 3–5 leads calientes (next step agendado: reunión, propuesta o seña)
- [ ] KR3: 1 video simulado del agente listo para mostrar (8 Onzas)

## 3) Lead measures (lo que controlás)

| Lead | Meta diaria | Meta sprint (11 días) |
|------|-------------|------------------------|
| Visitas a locales (dueño + pitch) | **4** | **45** |
| Referidos / mensajes enviados | según tácticas del día | familia + abogado + planos + Lina |
| Role-plays (guion en voz alta) | ≥ 1 | todos los días de calle |

## 4) Tácticas binarias del sprint (pool)

Marcá acá cuando **terminaron** en el sprint. El **día a día** vive en §5: cada día listás las acciones que mueven hacia estos KR.

### Calle
- [ ] Cumplir ritmo 4 locales/día en rubros de octubre (meta 45)
- [ ] Guion 30s + precio/seña firmes (role-play antes de salir)

### Referidos (pasar al día en que las hagas)
- [ ] Mensajes a familia: **solo nombre / presentación**, sin plata
- [ ] Abogado: **sitio gratis + 30%** de derivados
- [ ] Amigo de planos: trato vía **Lina**
- [ ] Reunión Lina: sitio gratis + **15%** cliente nuevo **o** tarifa normal si va en su paquete

### Producto / demo
- [ ] Video del agente para **8 Onzas** (simulado)

### Estudio (ratos muertos; ventas primero)
Orden: **1) Ventas LI → 2) GEO/SEO LI → 3) Psycho-Cybernetics**.

## 5) Acciones diarias → score (Dataview)

Cada día = checklist. **Agregá o borrá ítems** y `Planeadas` / `Hechas` / `Score` se recalculan solos (todo lo que no sea `habito ·`).

Prefijos:
- `role ·` role-play
- `local ·` cada visita (meta 4/día)
- `msj ·` / `ref ·` mensajes o referidos
- `review ·` review nocturno
- `habito ·` **no cuenta** en el score (P0)

### Tablero (auto)

```dataviewjs
const page = dv.current();
const days = [
  "2026-11-05","2026-11-06","2026-11-07","2026-11-08","2026-11-09",
  "2026-11-10","2026-11-11","2026-11-12","2026-11-13","2026-11-14","2026-11-15"
];

function isHabito(t) {
  const s = (t.text || "").toLowerCase().trim();
  return s.startsWith("habito");
}
function kind(t) {
  const s = (t.text || "").toLowerCase().trim();
  if (s.startsWith("local")) return "local";
  if (s.startsWith("msj") || s.startsWith("ref")) return "msj";
  if (s.startsWith("role")) return "role";
  if (s.startsWith("review")) return "review";
  return "otro";
}

let totalLocales = 0;
let totalPlaneadas = 0;
let totalHechas = 0;
const rows = days.map(d => {
  const tasks = page.file.tasks
    .where(t => (t.section?.subpath || "").startsWith(d))
    .array();
  const scored = tasks.filter(t => !isHabito(t));
  const planeadas = scored.length; // dinámico: crece/baja al editar el checklist
  const hechas = scored.filter(t => t.completed).length;
  totalPlaneadas += planeadas;
  totalHechas += hechas;
  const pct = planeadas === 0 ? null : hechas / planeadas;
  const score = pct === null ? "—" : Math.round(pct * 100) + "%";
  const locales = scored.filter(t => kind(t) === "local" && t.completed).length;
  const msjs = scored.filter(t => kind(t) === "msj" && t.completed).length;
  const role = scored.filter(t => kind(t) === "role" && t.completed).length;
  totalLocales += locales;
  const mark = pct === null ? "" : (pct >= 0.85 ? "✅" : (pct >= 0.65 ? "⚠️" : "❌"));
  return [
    d.slice(8) + (d === "2026-11-15" ? " cierre" : ""),
    planeadas,
    hechas,
    score + (mark ? " " + mark : ""),
    locales,
    msjs,
    role
  ];
});

const sprintPct = totalPlaneadas === 0 ? "—" : Math.round((totalHechas / totalPlaneadas) * 100) + "%";
dv.paragraph(`**Locales:** ${totalLocales} / 45 · **Score sprint:** ${totalHechas}/${totalPlaneadas} (${sprintPct})`);
dv.paragraph("_Sumá una línea `- [ ] msj · …` o borrá un local: Planeadas cambia solo._");
dv.table(
  ["Día", "Planeadas", "Hechas", "Score", "Locales", "Msjs/ref", "Role"],
  rows
);
```

### 2026-11-05
- [ ] role · Role-play guion 30s + seña
- [ ] local · Local 1 (dueño + pitch)
- [ ] local · Local 2
- [ ] local · Local 3
- [ ] local · Local 4
- [ ] review · Aplicar una corrección
- [ ] habito · Teatro 10 min
- [ ] habito · Cuando sienta incomodidad me dire es parte del proceso
- [ ] habito · Noche éxito + corrección
- [ ] habito · Cuando tome acción por un objetivo me voy a celebrar levantando los brazos y decir "1M de 10"

### 2026-11-06
- [ ] role · Role-play guion 30s + seña
- [ ] local · Local 1 (dueño + pitch)
- [ ] local · Local 2
- [ ] local · Local 3
- [ ] local · Local 4
- [ ] review · Aplicar una corrección
- [ ] habito · Teatro 10 min
- [ ] habito · Cuando sienta incomodidad me dire es parte del proceso
- [ ] habito · Noche éxito + corrección
- [ ] habito · Cuando tome acción por un objetivo me voy a celebrar levantando los brazos y decir "1M de 10"

### 2026-11-07
- [ ] role · Role-play guion 30s + seña
- [ ] local · Local 1 (dueño + pitch)
- [ ] local · Local 2
- [ ] local · Local 3
- [ ] local · Local 4
- [ ] review · Aplicar una corrección
- [ ] habito · Teatro 10 min
- [ ] habito · Cuando sienta incomodidad me dire es parte del proceso
- [ ] habito · Noche éxito + corrección
- [ ] habito · Cuando tome acción por un objetivo me voy a celebrar levantando los brazos y decir "1M de 10"

### 2026-11-08
- [ ] role · Role-play guion 30s + seña
- [ ] local · Local 1 (dueño + pitch)
- [ ] local · Local 2
- [ ] local · Local 3
- [ ] local · Local 4
- [ ] review · Aplicar una corrección
- [ ] habito · Teatro 10 min
- [ ] habito · Cuando sienta incomodidad me dire es parte del proceso
- [ ] habito · Noche éxito + corrección
- [ ] habito · Cuando tome acción por un objetivo me voy a celebrar levantando los brazos y decir "1M de 10"

### 2026-11-09
- [ ] role · Role-play guion 30s + seña
- [ ] local · Local 1 (dueño + pitch)
- [ ] local · Local 2
- [ ] local · Local 3
- [ ] local · Local 4
- [ ] review · Aplicar una corrección
- [ ] habito · Teatro 10 min
- [ ] habito · Cuando sienta incomodidad me dire es parte del proceso
- [ ] habito · Noche éxito + corrección
- [ ] habito · Cuando tome acción por un objetivo me voy a celebrar levantando los brazos y decir "1M de 10"

### 2026-11-10
- [ ] role · Role-play guion 30s + seña
- [ ] local · Local 1 (dueño + pitch)
- [ ] local · Local 2
- [ ] local · Local 3
- [ ] local · Local 4
- [ ] review · Aplicar una corrección
- [ ] habito · Teatro 10 min
- [ ] habito · Cuando sienta incomodidad me dire es parte del proceso
- [ ] habito · Noche éxito + corrección
- [ ] habito · Cuando tome acción por un objetivo me voy a celebrar levantando los brazos y decir "1M de 10"

### 2026-11-11
- [ ] role · Role-play guion 30s + seña
- [ ] local · Local 1 (dueño + pitch)
- [ ] local · Local 2
- [ ] local · Local 3
- [ ] local · Local 4
- [ ] review · Aplicar una corrección
- [ ] habito · Teatro 10 min
- [ ] habito · Cuando sienta incomodidad me dire es parte del proceso
- [ ] habito · Noche éxito + corrección
- [ ] habito · Cuando tome acción por un objetivo me voy a celebrar levantando los brazos y decir "1M de 10"

### 2026-11-12
- [ ] role · Role-play guion 30s + seña
- [ ] local · Local 1 (dueño + pitch)
- [ ] local · Local 2
- [ ] local · Local 3
- [ ] local · Local 4
- [ ] review · Aplicar una corrección
- [ ] habito · Teatro 10 min
- [ ] habito · Cuando sienta incomodidad me dire es parte del proceso
- [ ] habito · Noche éxito + corrección
- [ ] habito · Cuando tome acción por un objetivo me voy a celebrar levantando los brazos y decir "1M de 10"

### 2026-11-13
- [ ] role · Role-play guion 30s + seña
- [ ] local · Local 1 (dueño + pitch)
- [ ] local · Local 2
- [ ] local · Local 3
- [ ] local · Local 4
- [ ] review · Aplicar una corrección
- [ ] habito · Teatro 10 min
- [ ] habito · Cuando sienta incomodidad me dire es parte del proceso
- [ ] habito · Noche éxito + corrección
- [ ] habito · Cuando tome acción por un objetivo me voy a celebrar levantando los brazos y decir "1M de 10"

### 2026-11-14
- [ ] role · Role-play guion 30s + seña
- [ ] local · Local 1 (dueño + pitch)
- [ ] local · Local 2
- [ ] local · Local 3
- [ ] local · Local 4
- [ ] review · Aplicar una corrección
- [ ] habito · Teatro 10 min
- [ ] habito · Cuando sienta incomodidad me dire es parte del proceso
- [ ] habito · Noche éxito + corrección
- [ ] habito · Cuando tome acción por un objetivo me voy a celebrar levantando los brazos y decir "1M de 10"

### 2026-11-15
- [ ] role · Role-play guion 30s + seña
- [ ] local · Local 1 (dueño + pitch)
- [ ] local · Local 2
- [ ] local · Local 3
- [ ] local · Local 4
- [ ] review · Aplicar una corrección
- [ ] habito · Teatro 10 min
- [ ] habito · Cuando sienta incomodidad me dire es parte del proceso
- [ ] habito · Noche éxito + corrección
- [ ] habito · Cuando tome acción por un objetivo me voy a celebrar levantando los brazos y decir "1M de 10"

## 6) Errores (fuera de este doc)

- Diario de errores: **archivo aparte**.  
- Al plan de este sprint entra **solo 1** corrección a la vez.  
- Sostenerla **7–14 días** o **20 reps** antes de cambiar.

## 7) WAM con el padre

- **15–30 min** / semana (o 2× en este sprint).  
- Agenda: score del tablero → qué funcionó → dónde trabás → compromisos → cierre.  
- Número primero, sin excusas largas.

## 9) Estacionamiento → diciembre

- Agente IA completo / APIs de modelos  
- LinkedIn Premium Business  
- SEO/GEO profundo (más allá de ratos muertos)  
- Todo lo que no mueva seña esta semana  

## 10) Hábitos P0 (identidad: Soy vendedor)

Están en cada día como `habito ·` (no entran al score). Lista maestra:

- Teatro / ensayo de pitch **10 min**  
- Cuando vaya entrar en un local voy a entonces imaginar la sonrisa de las personas
- Cuando sienta incomodidad entonces me dire que es una sensación normal que pasan los mejores, que es natural, me amo incondicionalmente, respiro largo y corto suelto vas a lograr [situación incomoda] y voy a caminar un paso. 
- **Salir** a vender **antes** que cursos  
- Erguido en **3 segundos**  
- Noche: **1 éxito + 1 corrección**  
- Al despertar: creencia / vow (*Soy vendedor*)

---

## Para qué

### Elevado

- Mandarle 500 dólares a mi madre así paga el tratamiento de mi Draco
- Por que quiero cumplirme el sueño de entrenarme con los mejores socialmente de Latinoamérica en las formas en que puedo aportar valor, quiero dejar a alguien con una sensación positiva y descubrir lo que ignoro sobre como hacerlo

### Día a día

- Desde la gratitud aportar a la casa que me da calor, a la comida que alimenta a mi papa y familia
- Para cumplirme mi palabra. 
-  Libertad financiera
-  Ejercitar mi mentalidad al máximo y construir la evidencia a la creencia que si puedo vivir como yo defina, que solo tengo meterle actitud.
- Invitar a las chicas que me gusten sin estar preocupado
- Comprarme una campera contra el frio de Buenos Aires
### Mezquino
- Irme a vivir solo por un tiempo con un balcón y hacerle fck yea al mundo sin camisa!

 - Callar a todaa la putisima idea interna de que no soy suficiente apra vivir la vida que yo quiero. 
 
-  Ir en ropa comun y pedirme una comida cara mirando al mesereo

### Que sentiré
Orgulloso, poderoso , esa emoción sera la estructura para cambiar mi vida financiera, animarme a tomar mas riesgos y vivir como putas yo quiero. Eso me llevara construir mi independencia y a que seguramente este por mi cuenta como lobo

### Lo que pása si no tomo acción

-  Sumido en mi propio arrepentimiento con mi vida y con el sentimiento que no tengo mucho que poner en mi tumba.

Dígase acción todo paso que me acerque a la meta




---

## Ruta de aprendizaje (ratos muertos)

Orden: **1) Ventas LI → 2) GEO/SEO LI → 3) Psycho-Cybernetics**.

### 1) Fundamentos de ventas B2B/B2C (LinkedIn Learning)

**[3 Simple Steps to the Perfect Sales Pitch](https://www.linkedin.com/learning/3-simple-steps-to-the-perfect-sales-pitch)** (Amber Lethem)
1. Don't be salesy
2. Discover, dig, display
3. Proper price positioning
4. Choice between two positives
5. Back-end objection handling

**[Sales Foundations](https://www.linkedin.com/learning/sales-foundations)** (Jeff Bloomfield)
1. Identify your customer's issues when selling
2. How to frame your solution when selling
3. How to show proof of your solution
4. (opcional) Create a prospecting process

### 2) GEO + SEO (LinkedIn Learning)

1. [AI search and generative engine optimization (GEO)](https://www.linkedin.com/learning/ai-and-digital-marketing-trends/ai-search-and-generative-engine-optimization-geo)
2. [How to get started with SEO and GEO](https://www.linkedin.com/learning/digital-marketing-foundations-26945172/how-to-get-started-with-seo-geo) (`digital-marketing-foundations-26945172`)
3. AI for discovery + SEO measurement and AI — [SEO Foundations](https://www.linkedin.com/learning/seo-foundations-14828080)
4. [Learning Local SEO](https://www.linkedin.com/learning/learning-local-seo): general vs local → ranking factors → GMB/GBP → reviews → tags → content for searcher intent
5. SEO Foundations selectas: keywords · on-page · structured data · Search Console · measuring performance
6. (opcional entrega) [Using AI as Your SEO Assistant](https://www.linkedin.com/learning/using-ai-as-your-seo-assistant): schema markup · intent keywords · optimize content

### 3) [[Psycho-Cybernetics]] (7 piezas)

PDF: `04_Libros/Maxwell Maltz - Psycho-Cybernetics (0, Perigee) - libgen.li.pdf`

0. Prefacio  
1. Ch.1 Autoimagen  
2. Ch.2 Success Mechanism  
3. Ch.3 Imaginación  
4. Ch.4 Creencias falsas  
5. Ch.6 No atascar (Relax / Don’t Jam)  
6. Ch.14 Winning Feeling  

---

## Bitácora (vow)

```dataviewjs
const page = dv.current();
const label = String(page.vow ?? "").trim();
const target = Number(page.granos) > 0 ? Number(page.granos) : 30;
const vows = app.plugins?.plugins?.soulhy?.settings?.vows;

if (!label) {
    dv.paragraph("Indicá el vow en el frontmatter (`vow`).");
} else if (!Array.isArray(vows)) {
    dv.paragraph("Soulhy no está cargado. Abrí el plugin y recargá esta nota.");
} else {
    const q = label.toLowerCase();
    const vow = vows.find(v => String(v.title || "").trim().toLowerCase() === q)
        || vows.find(v => String(v.inscription || "").toLowerCase().includes(q));
    if (!vow) {
        dv.paragraph(`No encuentro el vow «${label}» en Soulhy.`);
    } else {
        const grains = (Array.isArray(vow.grains) ? vow.grains : [])
            .map((g, i) => ({ date: g.date || "", experience: g.experience || "", _i: i }))
            .sort((a, b) => {
                const byDate = String(a.date).localeCompare(String(b.date));
                return byDate !== 0 ? byDate : a._i - b._i;
            });
        dv.paragraph(`**${grains.length} de ${target}**`);
        if (grains.length === 0) {
            dv.paragraph("Todavía no hay granos en este vow.");
        } else {
            dv.table(
                ["Día", "Fecha", "Hito"],
                grains.map((g, i) => [`Día ${i + 1}`, g.date, g.experience])
            );
        }
    }
}
```
