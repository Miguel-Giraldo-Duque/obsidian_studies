---
tipo: proyecto
estado: activo
inicio: ""
fin: ""
vow: Sociable
granos: 30
libros:
  - "[[Psycho-Cybernetics]]"
escuela:
  - Presencia
  - Autoridad
  - Calidez
---
# Me transformé en una persona sociable en 30 días

## Resultado (R)

_Pendiente — fecha:_

## Métricas (M)

- [ ] 

## Para qué

### Elevado



### Día a día



### Mezquino



### Lo que no quiero vivir



## Libros

- [[Psycho-Cybernetics]] — 5–10 pág/día, para publicar.

## Bitácora

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
