/* VowService - Belief vows with grid-reveal evidence grains */

class VowService {
    constructor(plugin) {
        this.plugin = plugin;
    }

    createId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    ensureVows() {
        const s = this.plugin.settings;
        if (!Array.isArray(s.vows)) {
            s.vows = [];
        }
        return s.vows;
    }

    listVows() {
        return this.ensureVows();
    }

    getVow(vowId) {
        return this.ensureVows().find(v => String(v.id) === String(vowId)) || null;
    }

    targetCells(vow) {
        const cols = Math.max(1, Number(vow.cols) || 5);
        const rows = Math.max(1, Number(vow.rows) || 10);
        return cols * rows;
    }

    revealedCount(vow) {
        return Array.isArray(vow.grains) ? vow.grains.length : 0;
    }

    intensityLabel(vow) {
        const target = this.targetCells(vow);
        const count = this.revealedCount(vow);
        const pct = target > 0 ? count / target : 0;
        if (pct < 0.15) return 'Chispa';
        if (pct < 0.35) return 'Bajo brillo';
        if (pct < 0.6) return 'Tejido visible';
        if (pct < 0.85) return 'Casi completo';
        return 'Identidad bordada';
    }

    listVowImages(app) {
        const folder = typeof VOWS_IMAGES_FOLDER !== 'undefined'
            ? VOWS_IMAGES_FOLDER
            : 'RpgImages/vows';
        return app.vault.getFiles()
            .filter(file => {
                const p = file.path.replace(/\\/g, '/');
                return p.startsWith(`${folder}/`) &&
                    !p.includes('/_refs/') &&
                    /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name);
            })
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    }

    normalizeVow(raw) {
        const cols = Math.max(1, Number(raw.cols) || 5);
        const rows = Math.max(1, Number(raw.rows) || 10);
        return {
            id: raw.id || this.createId('vow'),
            title: (raw.title || '').trim() || 'Vow',
            inscription: (raw.inscription || raw.belief || '').trim(),
            imagePath: (raw.imagePath || '').trim(),
            cols,
            rows,
            grains: Array.isArray(raw.grains)
                ? raw.grains.map((g, i) => ({
                    id: g.id || `grain_${i}`,
                    date: g.date || '',
                    experience: g.experience || g.text || ''
                }))
                : []
        };
    }

    createVow({ title, inscription, imagePath, cols = 5, rows = 10 }) {
        const vows = this.ensureVows();
        const vow = this.normalizeVow({
            id: this.createId('vow'),
            title,
            inscription,
            imagePath,
            cols,
            rows,
            grains: []
        });
        vows.push(vow);
        return vow;
    }

    updateVow(vowId, patch) {
        const vow = this.getVow(vowId);
        if (!vow) return null;
        if (patch.title != null) vow.title = String(patch.title).trim() || vow.title;
        if (patch.inscription != null) vow.inscription = String(patch.inscription).trim();
        if (patch.imagePath != null) vow.imagePath = String(patch.imagePath).trim();
        if (patch.cols != null) vow.cols = Math.max(1, Number(patch.cols) || vow.cols);
        if (patch.rows != null) vow.rows = Math.max(1, Number(patch.rows) || vow.rows);
        return vow;
    }

    addGrain(vowId, { date, experience }) {
        const vow = this.getVow(vowId);
        if (!vow) throw new Error('Vow no encontrado');
        if (!Array.isArray(vow.grains)) vow.grains = [];
        const target = this.targetCells(vow);
        if (vow.grains.length >= target) {
            throw new Error(`Este vow ya tiene ${target} evidencias (meta completa)`);
        }
        const text = String(experience || '').trim();
        if (!text) throw new Error('La experiencia del hito está vacía');
        const grain = {
            id: this.createId('grain'),
            date: String(date || '').trim() || new Date().toISOString().slice(0, 10),
            experience: text
        };
        vow.grains.push(grain);
        return grain;
    }
}

module.exports = { VowService };
