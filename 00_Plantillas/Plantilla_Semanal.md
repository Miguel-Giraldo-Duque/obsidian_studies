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
        // Hasta 5 hitos por día (hitoN + bienN; legacy logroN / dificultadN)
        [1, 2, 3, 4, 5].forEach(n => {
            let hito = p[`hito${n}`];

            if (hito && String(hito).trim() !== "") {
                let bien = p[`bien${n}`] != null && String(p[`bien${n}`]).trim() !== ""
                    ? String(p[`bien${n}`])
                    : (p[`logro${n}`] ? String(p[`logro${n}`]) : "—");
                let proxima = p[`proxima${n}`] != null && String(p[`proxima${n}`]).trim() !== ""
                    ? String(p[`proxima${n}`])
                    : "—";
                filas.push([
                    p.file.link,
                    String(hito),
                    bien,
                    proxima
                ]);
            }
        });
    });

    if (filas.length === 0) {
        dv.paragraph("Todavía no hay hitos esta semana. Completá el cierre con «Cuéntame la historia de hoy» (frontmatter `hito1` / `bien1` / `proxima1`).");
    } else {
        dv.table(
            ["📅 Día", "🏆 Qué pasó", "💡 Qué hice bien", "🎯 Próxima acción"],
            filas
        );
    }
}
````
