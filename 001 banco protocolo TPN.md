# Banco protocolo TPN N=1 — quests diarias de Flow

> Skill: **Flow** · `source: tpn-n1` · Nodo: `node_1785983669892_tu8ccua1d`
> Cada día = una quest. Completar el formulario de la Taberna completa la quest del día y pega a Guiltmal.

| Días | Semana | Nivel | Trataka | Daño |
| --- | --- | --- | --- | --- |
| 1–7 | 22–28 ago | Lv1 | 0 (baseline) | 10 |
| 8–14 | 29 ago – 4 sep | Lv1 | 2 min | 10 |
| 15–21 | 5–11 sep | Lv2 | 4 min | 15 |
| 22–28 | 12–18 sep | Lv2 | 6 min | 15 |
| 29–35 | 19–25 sep | Lv3 | 8 min | 20 |
| 36–42 | 26 sep – 2 oct | Lv3 | 10 min | 20 |

Las 42 quests las crea Soulhy al abrir la Taberna (`TpnExperimentService.ensureProtocolQuests`). No hace falta reinyectar el banco de 60 Flow.
