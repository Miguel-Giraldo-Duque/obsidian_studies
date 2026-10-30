/* QuestSuggestionService — campañas sugeridas por el Maestro de Estudios.
 * Una sugerida = un archivo JSON (schema soulhy.suggestion/v1) en SUGGESTIONS_FOLDER del vault.
 * El Maestro solo crea archivos en estado 'propuesta'; el plugin solo cambia `estado` (+ `decision`).
 * Al aceptar se crea un pack normal (questCampaigns) + quests kind 'campaign-challenge'
 * (no suben el Árbol de skills: skillNodeId queda solo como metadata en campaign.maestro).
 */

const SUGGESTION_SCHEMA = 'soulhy.suggestion/v1';
const SUGGESTION_ESTADOS = ['propuesta', 'aprobada', 'rechazada', 'activa', 'pausada'];
const SUGGESTION_TIPOS = ['social', 'tecnica'];
const SUGGESTION_FASES = ['instalacion', 'variacion', 'mantenimiento'];
const SUGGESTION_FASE_DIFFICULTY = { instalacion: 'easy', variacion: 'medium', mantenimiento: 'hard' };
const SUGGESTION_TIPO_DOMAIN = { social: 'communityVitality', tecnica: 'education' };

class QuestSuggestionService {
    constructor(plugin) {
        this.plugin = plugin;
    }

    get campaignService() {
        if (!this.plugin.questCampaignService) {
            this.plugin.questCampaignService = new QuestCampaignService(this.plugin);
        }
        return this.plugin.questCampaignService;
    }

    get folderPath() {
        return SUGGESTIONS_FOLDER;
    }

    isSuggestionPath(path) {
        return typeof path === 'string' && path.startsWith(SUGGESTIONS_FOLDER + '/') && path.endsWith('.json');
    }

    // ---------------------------------------------------------------- ids

    slug(id) {
        return String(id || '')
            .toLowerCase()
            .replace(/[^a-z0-9_]+/g, '_')
            .replace(/^_+|_+$/g, '');
    }

    campaignIdFor(s) {
        return 'qcamp_' + this.slug(s && s.id);
    }

    questIdFor(s, dia) {
        return 'quest_' + this.slug(s && s.id) + '_d' + String(Number(dia)).padStart(2, '0');
    }

    // ---------------------------------------------------------------- lookups

    findNode(id) {
        if (!id) return null;
        return (this.plugin.settings.skillTree?.nodes || []).find(n => n.id === id) || null;
    }

    findBoss(id) {
        if (id === null || id === undefined || id === '') return null;
        return (this.plugin.settings.bossFights || []).find(b => String(b.id) === String(id)) || null;
    }

    findFlower(id) {
        if (!id) return null;
        return (this.plugin.settings.flowers || []).find(f => f.id === id) || null;
    }

    // ---------------------------------------------------------------- load

    /**
     * Lee todos los .json de la carpeta. Nunca lanza por un archivo roto:
     * cada entrada trae { file, path, data, errors[], warnings[], parseError }.
     */
    async loadAll() {
        const vault = this.plugin.app.vault;
        const folder = vault.getAbstractFileByPath(SUGGESTIONS_FOLDER);
        if (!folder || !Array.isArray(folder.children)) return [];

        const files = folder.children.filter(f => f && f.extension === 'json');
        const out = [];
        for (const file of files) {
            const entry = { file, path: file.path, data: null, errors: [], warnings: [], parseError: false };
            try {
                const raw = await vault.read(file);
                entry.data = JSON.parse(raw);
            } catch (e) {
                entry.parseError = true;
                entry.errors.push('JSON inválido: ' + (e && e.message ? e.message : String(e)));
                out.push(entry);
                continue;
            }
            const res = this.validate(entry.data);
            entry.errors = res.errors;
            entry.warnings = res.warnings;
            out.push(entry);
        }
        out.sort((a, b) => {
            const ca = String(a.data?.creado || '');
            const cb = String(b.data?.creado || '');
            if (ca !== cb) return ca < cb ? 1 : -1;
            return a.path < b.path ? -1 : 1;
        });
        return out;
    }

    /** Las que se muestran en la pestaña: estado 'propuesta' o archivos sin estado legible. */
    pending(entries) {
        return (entries || []).filter(e => {
            if (!e.data || typeof e.data !== 'object') return true;
            const estado = e.data.estado;
            if (!SUGGESTION_ESTADOS.includes(estado)) return true;
            return estado === 'propuesta';
        });
    }

    // ---------------------------------------------------------------- validate

    validate(s) {
        const errors = [];
        const warnings = [];
        if (!s || typeof s !== 'object' || Array.isArray(s)) {
            return { errors: ['La sugerida debe ser un objeto JSON'], warnings };
        }
        const str = (v) => typeof v === 'string' && v.trim().length > 0;
        const optStr = (v) => v === undefined || v === null || typeof v === 'string';

        if (s.schema !== SUGGESTION_SCHEMA) errors.push('schema debe ser "' + SUGGESTION_SCHEMA + '"');
        if (!str(s.id) || !/^[A-Za-z0-9_-]{3,80}$/.test(s.id)) {
            errors.push('id obligatorio: 3-80 caracteres [A-Za-z0-9_-]');
        }
        if (!SUGGESTION_ESTADOS.includes(s.estado)) errors.push('estado inválido (' + SUGGESTION_ESTADOS.join('|') + ')');
        if (!SUGGESTION_TIPOS.includes(s.tipo)) errors.push('tipo inválido (' + SUGGESTION_TIPOS.join('|') + ')');
        if (!SUGGESTION_FASES.includes(s.fase)) errors.push('fase inválida (' + SUGGESTION_FASES.join('|') + ')');
        ['skill', 'fuente', 'if_then', 'metrica', 'reto_objetivo'].forEach(k => {
            if (!str(s[k])) errors.push(k + ' obligatorio (texto)');
        });
        ['nombre', 'descripcion', 'escuela', 'creado'].forEach(k => {
            if (!optStr(s[k])) errors.push(k + ' debe ser texto o null');
        });

        if (s.skillNodeId !== undefined && s.skillNodeId !== null && s.skillNodeId !== '') {
            if (typeof s.skillNodeId !== 'string' || !this.findNode(s.skillNodeId)) {
                errors.push('skillNodeId no existe en el Árbol: ' + s.skillNodeId);
            }
        }

        if (s.boss !== undefined && s.boss !== null && s.boss !== '') {
            const boss = this.findBoss(s.boss);
            if (!boss) errors.push('boss no existe: ' + s.boss);
            else if (boss.defeated) warnings.push('El boss ' + boss.name + ' ya está liberado: las quests no le harán daño');
        } else {
            warnings.push('Sin boss vinculado');
        }

        if (s.flor !== undefined && s.flor !== null && s.flor !== '') {
            if (!this.findFlower(s.flor)) errors.push('flor no existe: ' + s.flor);
        }

        if (s.danio_boss !== undefined && s.danio_boss !== null) {
            const n = Number(s.danio_boss);
            if (!Number.isFinite(n) || n <= 0 || n > 10000) errors.push('danio_boss debe ser un número > 0');
        }

        if (!Array.isArray(s.misiones) || s.misiones.length === 0) {
            errors.push('misiones debe ser una lista no vacía');
        } else {
            const dias = new Set();
            s.misiones.forEach((m, i) => {
                const label = 'misiones[' + i + ']';
                if (!m || typeof m !== 'object') {
                    errors.push(label + ' debe ser un objeto');
                    return;
                }
                if (!str(m.titulo)) errors.push(label + '.titulo obligatorio');
                if (!str(m.criterio_exito)) errors.push(label + '.criterio_exito obligatorio');
                if (!Number.isInteger(m.dia) || m.dia < 1 || m.dia > 99) {
                    errors.push(label + '.dia debe ser entero 1-99');
                } else if (dias.has(m.dia)) {
                    errors.push(label + '.dia repetido: ' + m.dia);
                } else {
                    dias.add(m.dia);
                }
            });
        }

        // Colisiones de IDs (solo si el id es usable)
        if (errors.length === 0) {
            const campId = this.campaignIdFor(s);
            const existingCamp = this.campaignService.get(campId);
            if (existingCamp) {
                if (existingCamp.suggestionId && existingCamp.suggestionId !== s.id) {
                    errors.push('Ya existe la campaña ' + campId + ' de otra sugerida');
                } else {
                    warnings.push('Ya existe la campaña ' + campId + ': aceptar solo completa lo que falte');
                }
            }
            const quests = this.plugin.settings.quests || [];
            s.misiones.forEach(m => {
                const qid = this.questIdFor(s, m.dia);
                const q = quests.find(x => x.id === qid);
                if (q && q.campaignId && q.campaignId !== campId) {
                    errors.push('El id de quest ' + qid + ' ya lo usa otra campaña');
                }
            });
        }

        return { errors, warnings };
    }

    // ---------------------------------------------------------------- mapping

    /**
     * Sugerida → { campaign, quests } (sin efectos). `overrides` = campos del pack
     * editados en la vista: name, description, school, defaultBossDamage, flowerId, linkedBossIds.
     * Defensivo: tolera datos incompletos (para pintar el editor de una sugerida inválida).
     */
    toCampaignPayload(s, overrides = {}) {
        s = (s && typeof s === 'object') ? s : {};
        const node = this.findNode(s.skillNodeId);
        const fase = SUGGESTION_FASES.includes(s.fase) ? s.fase : 'instalacion';
        const bossIds = (s.boss !== undefined && s.boss !== null && s.boss !== '') ? [String(s.boss)] : [];
        const fallbackName = [s.skill, fase].filter(Boolean).join(' · ') || String(s.id || 'Sugerida');

        const base = {
            name: (typeof s.nombre === 'string' && s.nombre.trim()) ? s.nombre.trim() : fallbackName,
            description: typeof s.descripcion === 'string' ? s.descripcion : '',
            school: (typeof s.escuela === 'string' && s.escuela.trim()) ? s.escuela.trim() : (node ? node.school : 'Campo'),
            defaultBossDamage: Number(s.danio_boss) > 0 ? Number(s.danio_boss) : 25,
            flowerId: s.flor || null,
            linkedBossIds: bossIds
        };
        const o = overrides || {};
        const pick = (k) => (o[k] !== undefined ? o[k] : base[k]);

        const campaign = {
            id: this.campaignIdFor(s),
            name: String(pick('name') || base.name).trim() || base.name,
            description: pick('description') || '',
            school: String(pick('school') || '').trim() || base.school,
            defaultBossDamage: Number(pick('defaultBossDamage')) > 0 ? Number(pick('defaultBossDamage')) : 25,
            flowerId: pick('flowerId') || null,
            linkedBossIds: Array.isArray(pick('linkedBossIds')) ? pick('linkedBossIds').map(String) : [],
            sourceTag: null,
            suggestionId: s.id || null,
            maestro: {
                schema: SUGGESTION_SCHEMA,
                tipo: s.tipo || null,
                skill: s.skill || null,
                skillNodeId: s.skillNodeId || null,
                fuente: s.fuente || null,
                if_then: s.if_then || null,
                fase: s.fase || null,
                metrica: s.metrica || null,
                reto_objetivo: s.reto_objetivo || null,
                creado: s.creado || null
            }
        };

        const misiones = (Array.isArray(s.misiones) ? s.misiones : [])
            .filter(m => m && typeof m === 'object')
            .slice()
            .sort((a, b) => (Number(a.dia) || 0) - (Number(b.dia) || 0));

        const quests = misiones.map(m => {
            const desc = ['✔ Éxito: ' + (m.criterio_exito || '')];
            if (s.if_then) desc.push('Si→entonces: ' + s.if_then);
            return {
                id: this.questIdFor(s, m.dia),
                name: 'Reto ' + m.dia + ' [' + (m.titulo || '') + ']',
                description: desc.join('\n'),
                xp: 10,
                gold: 5,
                domain: SUGGESTION_TIPO_DOMAIN[s.tipo] || 'psychologicalWellbeing',
                difficulty: SUGGESTION_FASE_DIFFICULTY[fase],
                school: campaign.school,
                linkedBossIds: [...campaign.linkedBossIds],
                bossDamage: campaign.defaultBossDamage,
                source: 'maestro',
                maestroDia: m.dia,
                suggestionId: s.id || null
            };
        });

        campaign.questIds = quests.map(q => q.id);
        return { campaign, quests };
    }

    // ---------------------------------------------------------------- actions

    /**
     * Crea (o completa, si ya existía) la campaña + quests, guarda settings y marca el archivo 'activa'.
     * Idempotente: IDs fijos derivados de s.id.
     */
    async accept(entry, overrides = {}) {
        const s = entry && entry.data;
        const { errors } = this.validate(s);
        if (errors.length) return { ok: false, errors };

        const campSvc = this.campaignService;
        const { campaign: payload, quests } = this.toCampaignPayload(s, overrides);

        let campaign = campSvc.get(payload.id);
        let created = false;
        if (!campaign) {
            campaign = campSvc.create({
                id: payload.id,
                name: payload.name,
                description: payload.description,
                school: payload.school,
                linkedBossIds: payload.linkedBossIds,
                defaultBossDamage: payload.defaultBossDamage,
                flowerId: payload.flowerId,
                questIds: [],
                sourceTag: null
            });
            created = true;
        }
        campSvc.update(campaign.id, { suggestionId: payload.suggestionId, maestro: payload.maestro });
        if (!Array.isArray(campaign.questIds)) campaign.questIds = [];

        let questsCreated = 0;
        const allQuests = this.plugin.settings.quests || [];
        quests.forEach(fields => {
            const existing = allQuests.find(q => q.id === fields.id);
            if (existing) {
                if (!campaign.questIds.includes(existing.id)) campaign.questIds.push(existing.id);
                if (!existing.campaignId) existing.campaignId = campaign.id;
                return;
            }
            const q = campSvc.addQuest(campaign.id, fields);
            if (q) {
                q.maestroDia = fields.maestroDia;
                q.suggestionId = fields.suggestionId;
                questsCreated += 1;
            }
        });

        await this.plugin.saveSettings();

        let fileMarked = false;
        let markError = null;
        try {
            await this.markFile(entry.file, 'activa', { campaignId: campaign.id });
            fileMarked = true;
        } catch (e) {
            markError = e && e.message ? e.message : String(e);
            console.error('[Soulhy] No se pudo marcar la sugerida como activa', e);
        }

        return { ok: true, campaign, created, questsCreated, fileMarked, markError };
    }

    async discard(entry) {
        if (!entry || entry.parseError || !entry.file) {
            return { ok: false, errors: ['El archivo no es JSON válido: corregilo o borralo a mano'] };
        }
        await this.markFile(entry.file, 'rechazada', {});
        return { ok: true };
    }

    /** Cambia solo `estado` y agrega `decision` (read-modify-write atómico con vault.process). */
    async markFile(file, estado, extra = {}) {
        const vault = this.plugin.app.vault;
        const transform = (text) => {
            const d = JSON.parse(text);
            d.estado = estado;
            d.decision = { estado, at: new Date().toISOString(), ...extra };
            return JSON.stringify(d, null, 2) + '\n';
        };
        if (typeof vault.process === 'function') {
            await vault.process(file, transform);
        } else {
            const text = await vault.read(file);
            await vault.modify(file, transform(text));
        }
    }
}

module.exports = { QuestSuggestionService };
