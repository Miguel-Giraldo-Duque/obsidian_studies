---
tags:
  - sprint/semanal
---
# Agenda Semanal - <% tp.file.title %>

## 💼 Bloques de Trabajo y Experimentos
<%*
let match = tp.file.title.match(/(\d{4})-W(\d{2})/i);
let lunesSemana;
if (match) {
    let año = parseInt(match[1]);
    let semana = parseInt(match[2]);
    lunesSemana = moment().year(año).isoWeek(semana).startOf('isoWeek');
} else {
    lunesSemana = moment().startOf('isoWeek');
}
let lunes     = lunesSemana.clone().format("YYYY-MM-DD");
let martes    = lunesSemana.clone().add(1, 'days').format("YYYY-MM-DD");
let miercoles = lunesSemana.clone().add(2, 'days').format("YYYY-MM-DD");
let jueves    = lunesSemana.clone().add(3, 'days').format("YYYY-MM-DD");
let viernes   = lunesSemana.clone().add(4, 'days').format("YYYY-MM-DD");
let sabado    = lunesSemana.clone().add(5, 'days').format("YYYY-MM-DD");
let domingo   = lunesSemana.clone().add(6, 'days').format("YYYY-MM-DD");
_%>

### <% lunes %> - Lunes
- [ ] 

### <% martes %> - Martes
- [ ] 

### <% miercoles %> - Miércoles
- [ ] 

### <% jueves %> - Jueves
- [ ] 

### <% viernes %> - Viernes
- [ ] 

### <% sabado %> - Sábado
- [ ] 

### <% domingo %> - Domingo
- [ ] 

---
## 🏆 Hitos de la Semana  

```dataviewjs
let nombreArchivo = dv.current().file.name.trim();
let match = nombreArchivo.match(/(\d{4})-W(\d{2})/i);

if (!match) {
    dv.paragraph("_(Este bloque muestra los hitos una vez que la plantilla es aplicada a una nota semanal con formato YYYY-WXX)_");
} else {
    let lunes  = moment().year(parseInt(match[1])).isoWeek(parseInt(match[2])).startOf('isoWeek');
    let domingo = lunes.clone().endOf('isoWeek');

    // Buscamos las notas diarias que caen dentro del rango de esta semana
    let dias = dv.pages('"01_Planificacion/03_Diario"')
        .where(p => {
            let f = moment(p.file.name, "YYYY-MM-DD");
            return f.isValid()
                && !f.isBefore(lunes, 'day')
                && !f.isAfter(domingo, 'day');
        })
        .sort(p => p.file.name, 'asc');

    let filas = [];

    dias.forEach(p => {
        // Iteramos sobre los tres posibles hitos por día (hito1, hito2, hito3)
        // Si un día solo tuvo uno, hito2 y hito3 estarán vacíos y se ignoran
        [1, 2, 3].forEach(n => {
            let hito = p[`hito${n}`];

            // Solo agregamos la fila si el campo existe y tiene contenido real
            if (hito && String(hito).trim() !== "") {
                filas.push([
                    p.file.link,
                    String(hito),
                    p[`logro${n}`] ? String(p[`logro${n}`]) : "—",
                    p[`dificultad${n}`] ? `${p[`dificultad${n}`]}/10` : "—"
                ]);
            }
        });
    });

    if (filas.length === 0) {
        dv.paragraph("Todavía no hay hitos esta semana. Al cerrar cada día completá en la nota diaria el bloque Cierre del Día (frontmatter `hito1` / `logro1` / `dificultad1`, o los campos inline legacy).");
    } else {
        dv.table(
            ["📅 Día", "🏆 Hito", "💡 Qué hice para lograrlo", "🔥 Dificultad"],
            filas
        );
    }
}
````
