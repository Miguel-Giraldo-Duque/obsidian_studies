# Registro TPN N=1

Fuente de verdad del experimento. Lo escribe Soulhy (Taberna).

Flujo diario: exportar CSV de Vigilance Buddy → Taberna → subir CSV → KSS, hora de acostarte/levantarte, trataka → Registrar hoy.

Los CSV crudos quedan en `csv/YYYY-MM-DD.csv`. RT/SD/lapsos/SNR se calculan solos (anticipación <100 ms, lapso >500 ms). No copies el Average de la app.

`python analisis.py` en `experimento-foco-tpn` lee `registro.json`.