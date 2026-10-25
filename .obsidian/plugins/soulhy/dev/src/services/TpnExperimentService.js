/* TpnExperimentService - N=1 PVT/sleep protocol: JSON log, tavern RPG hooks, Flow quests */

const TPN_START = '2026-08-22';
const TPN_DAYS = 42;
const TPN_FOLDER = '01_Planificacion/experiments/tpn-n1';
const TPN_JSON_PATH = '01_Planificacion/experiments/tpn-n1/registro.json';
const TPN_CSV_FOLDER = '01_Planificacion/experiments/tpn-n1/csv';
const TPN_SOURCE = 'tpn-n1';
const TPN_ANTICIPATION_MS = 100;
const TPN_LAPSE_MS = 500;
const TPN_HABIT_ID = 'habit_tpn_protocol_pvt';
const TPN_HABIT_NAME = 'Protocolo TPN (PVT + sueño)';
const TPN_FLOW_NODE_ID = 'node_1785983669892_tu8ccua1d';
const TPN_N_ENSAYOS_DEFAULT = 50;

class TpnExperimentService {
    constructor(plugin) {
        this.plugin = plugin;
    }

    localIsoDate(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    parseIsoDate(iso) {
        const [y, m, d] = String(iso).split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    dayNumber(fecha) {
        const start = this.parseIsoDate(TPN_START);
        const cur = this.parseIsoDate(fecha);
        return Math.floor((cur.getTime() - start.getTime()) / 86400000) + 1;
    }

    weekNumber(dia) {
        if (dia < 1) return 1;
        return Math.min(6, Math.ceil(dia / 7));
    }

    tratakaTarget(semana) {
        return ({ 1: 0, 2: 2, 3: 4, 4: 6, 5: 8, 6: 10 })[semana] || 0;
    }

    dayMeta(dia) {
        const semana = this.weekNumber(dia);
        const trataka = this.tratakaTarget(semana);
        const fase = semana === 1 ? 'baseline' : 'intervencion';
        let skillLevel = 1;
        let bossDamage = 10;
        let difficulty = 'easy';
        let xp = 10;
        if (semana >= 5) {
            skillLevel = 3;
            bossDamage = 20;
            difficulty = 'hard';
            xp = 20;
        } else if (semana >= 3) {
            skillLevel = 2;
            bossDamage = 15;
            difficulty = 'medium';
            xp = 15;
        }
        return { dia, semana, trataka, fase, skillLevel, bossDamage, difficulty, xp };
    }

    questIdForDay(dia) {
        return `quest_tpn_n1_d${String(dia).padStart(2, '0')}`;
    }

    snrAtencional(rtMediaMs, rtSdMs, lapsos, nEnsayos = TPN_N_ENSAYOS_DEFAULT) {
        const rt = Number(rtMediaMs);
        const sd = Number(rtSdMs);
        const laps = Number(lapsos);
        const n = Number(nEnsayos) || TPN_N_ENSAYOS_DEFAULT;
        if (!(rt > 0) || !(sd >= 0) || !(laps >= 0) || !(n > 0)) return null;
        const velocidad = 1000 / rt;
        const cv = sd / rt;
        const tasa = laps / n;
        return Math.round((velocidad / (cv + tasa + 0.01)) * 1000) / 1000;
    }

    sleepQualityFromHours(hours) {
        const h = Number(hours);
        if (!Number.isFinite(h) || h <= 0) return { id: 'none', label: 'No sleep / All-nighter', hpRestore: -20 };
        if (h >= 8) return { id: 'excellent', label: '8+ hours, restful', hpRestore: 30 };
        if (h >= 7) return { id: 'good', label: '7-8 hours', hpRestore: 20 };
        if (h >= 5) return { id: 'fair', label: '5-7 hours', hpRestore: 10 };
        return { id: 'poor', label: 'Less than 5 hours', hpRestore: 0 };
    }

    hoursBetween(bed, wake) {
        if (!bed || !wake) return null;
        const a = this.hhmmToMin(bed);
        const b = this.hhmmToMin(wake);
        if (a == null || b == null) return null;
        let diff = b - a;
        if (diff <= 0) diff += 24 * 60;
        return Math.round((diff / 60) * 10) / 10;
    }

    hhmmToMin(hhmm) {
        const parts = String(hhmm || '').split(':').map(Number);
        if (parts.length < 2 || parts.some(n => Number.isNaN(n))) return null;
        return parts[0] * 60 + parts[1];
    }

    minutesAfterWake(horaPvt, horaLevantar) {
        const a = this.hhmmToMin(horaLevantar);
        const b = this.hhmmToMin(horaPvt);
        if (a == null || b == null) return null;
        let diff = b - a;
        if (diff < -12 * 60) diff += 24 * 60;
        return diff;
    }

    round(value, digits = 1) {
        const n = Number(value);
        if (!Number.isFinite(n)) return null;
        const f = 10 ** digits;
        return Math.round(n * f) / f;
    }

    sampleSd(values) {
        if (!values || values.length < 2) return 0;
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const varSum = values.reduce((a, x) => a + (x - avg) ** 2, 0);
        return Math.sqrt(varSum / (values.length - 1));
    }

    splitCsvLine(line) {
        const out = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    cur += '"';
                    i += 1;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c === ',' && !inQuotes) {
                out.push(cur);
                cur = '';
            } else {
                cur += c;
            }
        }
        out.push(cur);
        return out;
    }

    /**
     * Vigilance Buddy export: Task,TapTime,Milliseconds
     * Trial rows have a clock in TapTime. Footer rows use the same 3 columns
     * (Sex, Average response time, Slow responses, …) and must be ignored.
     * Lab convention: RT < 100 ms = anticipation; RT > 500 ms = lapse.
     */
    parseVigilanceBuddyCsv(text) {
        const raw = String(text || '').replace(/^\uFEFF/, '');
        const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) {
            throw new Error('El CSV está vacío o no es de Vigilance Buddy.');
        }
        const header = this.splitCsvLine(lines[0]).map(h => h.trim());
        if (!header.includes('Milliseconds') || !header.includes('TapTime')) {
            throw new Error('No reconozco el CSV. Tiene que ser el export de Vigilance Buddy (Task, TapTime, Milliseconds).');
        }
        const taps = [];
        const meta = {};
        let taskStamp = '';
        for (const line of lines.slice(1)) {
            const parts = this.splitCsvLine(line);
            if (parts.length < 3) continue;
            const task = parts[0].trim();
            const tapTime = parts[1].trim();
            const third = parts[2].trim();
            if (!taskStamp && /^\d{4}-\d{2}-\d{2}/.test(task)) taskStamp = task;
            if (/^\d{1,2}:\d{2}:\d{2}/.test(tapTime)) {
                const ms = Number(third);
                if (Number.isFinite(ms)) taps.push({ tapTime, ms });
            } else if (tapTime) {
                meta[tapTime] = third;
            }
        }
        if (!taps.length) {
            throw new Error('El CSV no tiene toques (filas con hora en TapTime).');
        }
        const anticipacionesList = taps.filter(t => t.ms < TPN_ANTICIPATION_MS);
        const valid = taps.filter(t => t.ms >= TPN_ANTICIPATION_MS);
        if (!valid.length) {
            throw new Error('Todos los toques son anticipaciones (<100 ms).');
        }
        const rts = valid.map(t => t.ms);
        const rtMedia = rts.reduce((a, b) => a + b, 0) / rts.length;
        const rtSd = this.sampleSd(rts);
        const lapsosList = rts.filter(x => x > TPN_LAPSE_MS);
        const nEnsayos = rts.length;
        const snr = this.snrAtencional(rtMedia, rtSd, lapsosList.length, nEnsayos);
        const fechaMatch = String(taskStamp).match(/^(\d{4}-\d{2}-\d{2})/);
        const clockMatch = String(taps[0].tapTime).match(/^(\d{1,2}):(\d{2})/);
        const horaPvt = clockMatch
            ? `${clockMatch[1].padStart(2, '0')}:${clockMatch[2]}`
            : '';
        const durationMeta = Number(meta['Test Duration in seconds']);
        return {
            fecha: fechaMatch ? fechaMatch[1] : null,
            hora_pvt: horaPvt,
            rt_media_ms: this.round(rtMedia, 1),
            rt_sd_ms: this.round(rtSd, 1),
            rt_mediana_ms: this.round([...rts].sort((a, b) => a - b)[Math.floor((rts.length - 1) / 2)], 1),
            rt_min_ms: Math.min(...rts),
            rt_max_ms: Math.max(...rts),
            lapsos: lapsosList.length,
            anticipaciones: anticipacionesList.length,
            n_ensayos: nEnsayos,
            n_taps: taps.length,
            duracion_s: Number.isFinite(durationMeta) ? durationMeta : null,
            snr_proxy: snr,
            app_average: meta['Average response time'] != null ? Number(meta['Average response time']) : null,
            app_false_positives: meta['Number of False Positives'] != null ? Number(meta['Number of False Positives']) : null,
            app_slow: meta['Slow responses (>500ms)'] != null ? Number(meta['Slow responses (>500ms)']) : null,
            source: 'vigilance-buddy'
        };
    }

    pvtHint(parsed, horaLevantar) {
        if (!parsed) return '';
        const bits = [
            `${parsed.n_ensayos} válidos`,
            `media ${parsed.rt_media_ms} ms`,
            `SD ${parsed.rt_sd_ms}`,
            `${parsed.lapsos} lapsos`,
            `${parsed.anticipaciones} anticipaciones`,
            parsed.snr_proxy != null ? `SNR ${parsed.snr_proxy}` : null,
            parsed.hora_pvt ? `PVT ${parsed.hora_pvt}` : null
        ].filter(Boolean);
        const lag = this.minutesAfterWake(parsed.hora_pvt, horaLevantar);
        let extra = '';
        if (lag != null) {
            if (lag < 30 || lag > 90) {
                extra = ` · ${lag} min después de levantarte (el protocolo pide 30–90).`;
            } else {
                extra = ` · ${lag} min después de levantarte.`;
            }
        }
        return bits.join(' · ') + extra;
    }

    energyDelta(kss, lapsos, roto) {
        let delta = 0;
        const k = Number(kss);
        const laps = Number(lapsos);
        if (Number.isFinite(k)) {
            if (k <= 4) delta += 10;
            else if (k >= 7) delta -= 15;
        }
        if (Number.isFinite(laps)) {
            if (laps <= 1) delta += 5;
            else if (laps >= 4) delta -= 10;
        }
        if (roto) delta -= 15;
        return delta;
    }

    mean(values) {
        const nums = values.filter(v => Number.isFinite(v));
        if (!nums.length) return null;
        return nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    focusPercent(entries, todaySnr) {
        if (todaySnr == null) return null;
        const week1 = (entries || [])
            .filter(e => e.semana === 1 && !e.protocolo_roto && e.snr_proxy != null)
            .map(e => Number(e.snr_proxy));
        const base = this.mean(week1);
        if (base && base > 0) {
            return Math.max(0, Math.min(100, Math.round(50 * (todaySnr / base))));
        }
        return Math.max(0, Math.min(100, Math.round((todaySnr / 20) * 100)));
    }

    ensureState() {
        const s = this.plugin.settings;
        if (!s.tpnExperiment || typeof s.tpnExperiment !== 'object') {
            s.tpnExperiment = {};
        }
        if (!Array.isArray(s.tpnExperiment.entries)) s.tpnExperiment.entries = [];
        if (!s.tpnExperiment.config) {
            s.tpnExperiment.config = { start: TPN_START, wake: '07:00', bed: '22:00' };
        }
        return s.tpnExperiment;
    }

    getEntries() {
        return this.ensureState().entries;
    }

    getEntry(fecha) {
        return this.getEntries().find(e => e.fecha === fecha) || null;
    }

    latestSnr() {
        const withSnr = this.getEntries().filter(e => e.snr_proxy != null);
        if (!withSnr.length) return null;
        return Number(withSnr[withSnr.length - 1].snr_proxy);
    }

    ensureHabit() {
        const s = this.plugin.settings;
        if (!Array.isArray(s.habits)) s.habits = [];
        let habit = s.habits.find(h => h.id === TPN_HABIT_ID || h.name === TPN_HABIT_NAME);
        if (!habit) {
            habit = {
                id: TPN_HABIT_ID,
                name: TPN_HABIT_NAME,
                xp: 10,
                gold: 5,
                domain: 'psychologicalWellbeing',
                difficulty: 'medium',
                linkedSkillIds: [],
                skillXp: 10,
                linkedBossIds: [GUILTMAL_BOSS_ID],
                bossDamage: 10,
                completed: false,
                streak: 0,
                bestStreak: 0,
                lastCompletedDate: null
            };
            s.habits.push(habit);
        } else {
            habit.id = TPN_HABIT_ID;
            habit.name = TPN_HABIT_NAME;
            if (!Array.isArray(habit.linkedBossIds) || !habit.linkedBossIds.includes(GUILTMAL_BOSS_ID)) {
                habit.linkedBossIds = [GUILTMAL_BOSS_ID];
            }
            if (habit.bossDamage == null) habit.bossDamage = 10;
        }
        return habit;
    }

    ensureProtocolQuests() {
        const s = this.plugin.settings;
        if (!Array.isArray(s.quests)) s.quests = [];
        let added = 0;
        for (let dia = 1; dia <= TPN_DAYS; dia++) {
            const id = this.questIdForDay(dia);
            if (s.quests.some(q => q.id === id)) continue;
            const meta = this.dayMeta(dia);
            const fecha = this.localIsoDate(new Date(this.parseIsoDate(TPN_START).getTime() + (dia - 1) * 86400000));
            const tratakaText = meta.trataka === 0
                ? 'sin trataka (baseline)'
                : `trataka ${meta.trataka} min`;
            s.quests.push({
                id,
                name: `TPN día ${dia} [S${meta.semana} · ${tratakaText}]`,
                description: `Protocolo N=1. Fecha ${fecha}. Registrar PVT + KSS en la Taberna. ${tratakaText}. Sueño a horario fijo. Completar el formulario cuenta como completar esta quest.`,
                xp: meta.xp,
                gold: 5,
                domain: 'psychologicalWellbeing',
                difficulty: meta.difficulty,
                completed: false,
                completedDate: null,
                kind: 'skill-challenge',
                skillNodeId: TPN_FLOW_NODE_ID,
                skillLevel: meta.skillLevel,
                school: 'Presencia',
                linkedBossIds: [GUILTMAL_BOSS_ID],
                bossDamage: meta.bossDamage,
                source: TPN_SOURCE,
                tpnDia: dia,
                tpnFecha: fecha
            });
            added += 1;
        }
        return added;
    }

    weeklySummary() {
        const buckets = {};
        for (const entry of this.getEntries()) {
            const semana = entry.semana;
            if (!semana) continue;
            if (!buckets[semana]) buckets[semana] = { snrs: [], lapsos: [], kss: [], n: 0, valid: 0 };
            buckets[semana].n += 1;
            const roto = Boolean(entry.protocolo_roto);
            if (!roto && entry.snr_proxy != null) {
                buckets[semana].valid += 1;
                buckets[semana].snrs.push(Number(entry.snr_proxy));
            }
            if (!roto && entry.lapsos != null) buckets[semana].lapsos.push(Number(entry.lapsos));
            if (!roto && entry.kss != null) buckets[semana].kss.push(Number(entry.kss));
        }
        const weeks = [];
        for (let semana = 1; semana <= 6; semana++) {
            const b = buckets[semana] || { snrs: [], lapsos: [], kss: [], n: 0, valid: 0 };
            weeks.push({
                semana,
                fase: semana === 1 ? 'baseline' : 'A+B',
                n: b.n,
                valid: b.valid,
                snr: this.mean(b.snrs),
                lapsos: this.mean(b.lapsos),
                kss: this.mean(b.kss)
            });
        }
        const s1 = weeks[0];
        const s6 = weeks[5];
        let verdict = 'Todavía no hay SNR en semana 1 y 6.';
        if (s1.snr != null && s6.snr != null && s1.valid >= 5 && s6.valid >= 5) {
            const delta = (s6.snr - s1.snr) / s1.snr;
            const lapsosOk = s1.lapsos == null || s6.lapsos == null || s6.lapsos <= s1.lapsos + 0.25;
            if (delta >= 0.15 && lapsosOk) verdict = `MEJORÓ el proxy de SNR (${(delta * 100).toFixed(1)}%).`;
            else if (delta >= 0.15) verdict = `MIXTO: sube SNR (${(delta * 100).toFixed(1)}%) pero suben los lapsos.`;
            else verdict = `NO se alcanzó el umbral (+${(delta * 100).toFixed(1)}%, hace falta +15%).`;
        } else if (s1.snr != null && s6.snr != null) {
            verdict = 'INCONCLUSO: menos de 5 días válidos en baseline o semana 6.';
        }
        return { weeks, verdict };
    }

    payload() {
        const state = this.ensureState();
        return {
            config: state.config,
            entries: state.entries
        };
    }

    async persistJson() {
        const vault = this.plugin.app.vault;
        const folder = vault.getAbstractFileByPath(TPN_FOLDER);
        if (!folder) {
            await vault.createFolder(TPN_FOLDER);
        }
        const content = JSON.stringify(this.payload(), null, 2);
        const file = vault.getAbstractFileByPath(TPN_JSON_PATH);
        if (file) {
            await vault.modify(file, content);
        } else {
            await vault.create(TPN_JSON_PATH, content);
        }
    }

    async persistCsv(fecha, csvText) {
        const vault = this.plugin.app.vault;
        if (!vault.getAbstractFileByPath(TPN_FOLDER)) {
            await vault.createFolder(TPN_FOLDER);
        }
        if (!vault.getAbstractFileByPath(TPN_CSV_FOLDER)) {
            await vault.createFolder(TPN_CSV_FOLDER);
        }
        const path = `${TPN_CSV_FOLDER}/${fecha}.csv`;
        const file = vault.getAbstractFileByPath(path);
        if (file) {
            await vault.modify(file, csvText);
        } else {
            await vault.create(path, csvText);
        }
        return path;
    }

    async submit(raw) {
        const s = this.plugin.settings;
        this.ensureState();
        this.ensureHabit();
        this.ensureProtocolQuests();

        let parsed = null;
        if (raw.csv_text) {
            parsed = this.parseVigilanceBuddyCsv(raw.csv_text);
        }

        const fecha = raw.fecha || parsed?.fecha || this.localIsoDate();
        const dia = this.dayNumber(fecha);
        const meta = this.dayMeta(dia);
        const existing = this.getEntry(fecha);
        const alreadyApplied = Boolean(existing && existing.rpgApplied);

        const pickNum = (...vals) => {
            for (const v of vals) {
                if (v === '' || v == null) continue;
                const n = Number(v);
                if (Number.isFinite(n)) return n;
            }
            return null;
        };

        const rt = pickNum(parsed?.rt_media_ms, raw.rt_media_ms, existing?.rt_media_ms);
        const sd = pickNum(parsed?.rt_sd_ms, raw.rt_sd_ms, existing?.rt_sd_ms);
        const lapsos = pickNum(parsed?.lapsos, raw.lapsos, existing?.lapsos);
        const anticipaciones = pickNum(parsed?.anticipaciones, raw.anticipaciones, existing?.anticipaciones);
        const nEnsayos = pickNum(parsed?.n_ensayos, raw.n_ensayos, existing?.n_ensayos) || TPN_N_ENSAYOS_DEFAULT;
        const kss = raw.kss === '' || raw.kss == null ? null : Number(raw.kss);
        const horaAcostar = raw.hora_acostar || s.tpnExperiment.config.bed;
        const horaLevantar = raw.hora_levantar || s.tpnExperiment.config.wake;
        const horas = this.hoursBetween(horaAcostar, horaLevantar);
        const trataka = raw.trataka_min === '' || raw.trataka_min == null ? meta.trataka : Number(raw.trataka_min);
        const minFoco = raw.min_foco_profundo === '' || raw.min_foco_profundo == null ? null : Number(raw.min_foco_profundo);
        const horaPvt = parsed?.hora_pvt || raw.hora_pvt || existing?.hora_pvt || '';
        let roto = Boolean(raw.protocolo_roto);
        if (horas != null && horas < 6.5) roto = true;
        if (rt == null) {
            throw new Error('Subí o pegá el CSV de Vigilance Buddy.');
        }
        if (kss == null || kss < 1 || kss > 9) {
            throw new Error('Poné el KSS (1–9).');
        }
        const snr = (rt != null && sd != null && lapsos != null)
            ? this.snrAtencional(rt, sd, lapsos, nEnsayos)
            : null;

        let csvArchivo = existing?.csv_archivo || '';
        if (raw.csv_text) {
            csvArchivo = await this.persistCsv(fecha, raw.csv_text);
        }

        const entry = {
            fecha,
            dia,
            semana: meta.semana,
            fase: meta.fase,
            trataka_min_objetivo: meta.trataka,
            hora_pvt: horaPvt,
            rt_media_ms: rt,
            rt_sd_ms: sd,
            rt_mediana_ms: pickNum(parsed?.rt_mediana_ms, existing?.rt_mediana_ms),
            lapsos,
            anticipaciones,
            n_ensayos: nEnsayos,
            n_taps: pickNum(parsed?.n_taps, existing?.n_taps),
            duracion_s: pickNum(parsed?.duracion_s, existing?.duracion_s),
            snr_proxy: snr,
            kss,
            hora_acostar: horaAcostar,
            hora_levantar: horaLevantar,
            horas_sueno: horas,
            trataka_min: trataka,
            trataka_hecho: trataka > 0 ? 1 : 0,
            min_foco_profundo: minFoco,
            protocolo_roto: roto ? 1 : 0,
            notas: raw.notas || '',
            csv_archivo: csvArchivo,
            pvt_source: parsed?.source || existing?.pvt_source || '',
            rpgApplied: alreadyApplied
        };

        const entries = this.getEntries().filter(e => e.fecha !== fecha);
        entries.push(entry);
        entries.sort((a, b) => a.fecha.localeCompare(b.fecha));
        s.tpnExperiment.entries = entries;

        let rpgNote = 'JSON actualizado.';
        if (!alreadyApplied) {
            if (horas != null) {
                const sleep = this.sleepQualityFromHours(horas);
                if (sleep.hpRestore >= 0) {
                    s.hp = Math.min(s.maxHp, s.hp + sleep.hpRestore);
                } else {
                    s.hp = Math.max(1, s.hp + sleep.hpRestore);
                }
                if (sleep.hpRestore > 0) {
                    s.energy = Math.min(s.maxEnergy || 100, (s.energy || 50) + sleep.hpRestore);
                }
                if (!s.sleepLog) s.sleepLog = [];
                s.sleepLog.unshift({
                    quality: sleep.id,
                    timestamp: new Date().toISOString(),
                    hpRestore: sleep.hpRestore,
                    source: TPN_SOURCE
                });
                s.sleepLog = s.sleepLog.slice(0, 42);
            }

            const eDelta = this.energyDelta(kss, lapsos, roto);
            s.energy = Math.max(0, Math.min(s.maxEnergy || 100, (s.energy || 100) + eDelta));

            const habitIndex = s.habits.findIndex(h => h.id === TPN_HABIT_ID);
            if (habitIndex >= 0 && !s.habits[habitIndex].completed) {
                await this.plugin.completeHabit(habitIndex);
            }

            if (dia >= 1 && dia <= TPN_DAYS) {
                const qid = this.questIdForDay(dia);
                const questIndex = s.quests.findIndex(q => q.id === qid);
                if (questIndex >= 0 && !s.quests[questIndex].completed) {
                    await this.plugin.completeQuest(questIndex);
                }
            }

            entry.rpgApplied = true;
            rpgNote = 'HP/energía, hábito y quest de hoy aplicados (una vez).';
        } else {
            rpgNote = 'Día ya registrado: números actualizados, sin segundo golpe a Guiltmal.';
        }

        await this.persistJson();
        await this.plugin.saveSettings();
        return { entry, rpgNote, snr };
    }
}

module.exports = { TpnExperimentService, TPN_START, TPN_HABIT_NAME, TPN_JSON_PATH, TPN_CSV_FOLDER };
