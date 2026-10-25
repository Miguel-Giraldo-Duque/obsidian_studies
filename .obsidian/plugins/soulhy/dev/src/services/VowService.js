/* VowService - Belief vows with grid-reveal evidence grains */

const VOW_OVERFLOW_STEP_BONUS = 0.02;
const VOW_BONUS_CAP = 0.40;

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

    /** Cells visible on the banner grid (never exceeds target). */
    gridRevealedCount(vow) {
        return Math.min(this.revealedCount(vow), this.targetCells(vow));
    }

    isVowComplete(vow) {
        if (!vow) return false;
        return this.revealedCount(vow) >= this.targetCells(vow);
    }

    intensityLabel(vow) {
        const target = this.targetCells(vow);
        const count = this.gridRevealedCount(vow);
        const pct = target > 0 ? count / target : 0;
        if (pct < 0.15) return 'Chispa';
        if (pct < 0.35) return 'Bajo brillo';
        if (pct < 0.6) return 'Tejido visible';
        if (pct < 0.85) return 'Casi completo';
        return 'Identidad bordada';
    }

    /**
     * Effective XP/damage bonus for a completed vow.
     * base + 0.02 per full overflow block of `target` grains, capped at 0.40.
     * Incomplete vows contribute 0 (multipliers already filter them).
     */
    effectiveBonus(vow, kind = 'xp') {
        if (!this.isVowComplete(vow)) return 0;
        const baseKey = kind === 'damage' ? 'damageBonus' : 'xpBonus';
        const base = this.normalizeBonus(vow[baseKey]);
        const target = this.targetCells(vow);
        const extras = Math.max(0, this.revealedCount(vow) - target);
        const steps = target > 0 ? Math.floor(extras / target) : 0;
        return Math.min(VOW_BONUS_CAP, base + steps * VOW_OVERFLOW_STEP_BONUS);
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

    knownDomainIds() {
        if (typeof DEFAULT_DOMAINS !== 'undefined' && Array.isArray(DEFAULT_DOMAINS)) {
            return DEFAULT_DOMAINS.map(d => d.id);
        }
        return [
            'psychologicalWellbeing', 'health', 'timeUse', 'education',
            'culturalResilience', 'goodGovernance', 'communityVitality',
            'ecologicalAwareness', 'livingStandards'
        ];
    }

    normalizeSchoolIds(raw) {
        const list = Array.isArray(raw) ? raw : [];
        const ids = [];
        const seen = new Set();
        for (const item of list) {
            const id = typeof resolveSkillTreeSchoolId === 'function'
                ? resolveSkillTreeSchoolId(item)
                : String(item || '').trim();
            if (!id || seen.has(id)) continue;
            const known = typeof SKILL_TREE_SCHOOLS !== 'undefined'
                && SKILL_TREE_SCHOOLS.some(school => school.id === id);
            if (!known) continue;
            seen.add(id);
            ids.push(id);
        }
        return ids;
    }

    normalizeDomainIds(raw) {
        const list = Array.isArray(raw) ? raw : [];
        const known = new Set(this.knownDomainIds());
        const ids = [];
        const seen = new Set();
        for (const item of list) {
            const id = String(item || '').trim();
            if (!id || seen.has(id) || !known.has(id)) continue;
            seen.add(id);
            ids.push(id);
        }
        return ids;
    }

    normalizeBonus(value, fallback = 0.2) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    formatVowMultiplier(multiplier) {
        const n = Number(multiplier);
        if (!Number.isFinite(n) || n === 1) return '';
        return `×${(Math.round(n * 100) / 100).toFixed(2)}`;
    }

    /** Per-vow multipliers for toast/UI (completed + matching school/domain). */
    listMatchingVowContributions({ school, domain } = {}) {
        return this.getMatchingCompletedVows({ school, domain }).map(vow => {
            const xpBonus = this.effectiveBonus(vow, 'xp');
            const damageBonus = this.effectiveBonus(vow, 'damage');
            return {
                id: vow.id,
                title: vow.title || 'Vow',
                imagePath: (vow.imagePath || '').trim(),
                xpMultiplier: 1 + xpBonus,
                damageMultiplier: 1 + damageBonus
            };
        });
    }

    formatContributionLabel(multiplier) {
        const n = Number(multiplier);
        if (!Number.isFinite(n)) return '1.00x';
        return `${(Math.round(n * 100) / 100).toFixed(2)}x`;
    }

    vowMatchesContext(vow, { school, domain } = {}) {
        const schoolId = typeof resolveSkillTreeSchoolId === 'function'
            ? resolveSkillTreeSchoolId(school)
            : String(school || '').trim();
        const domainId = String(domain || '').trim();
        const schools = Array.isArray(vow.schools) ? vow.schools : [];
        const domains = Array.isArray(vow.domains) ? vow.domains : [];
        if (schoolId && schools.includes(schoolId)) return true;
        if (domainId && domains.includes(domainId)) return true;
        return false;
    }

    getMatchingCompletedVows({ school, domain } = {}) {
        return this.listVows().filter(vow => {
            if (!this.isVowComplete(vow)) return false;
            return this.vowMatchesContext(vow, { school, domain });
        });
    }

    getVowXpMultiplier({ school, domain } = {}) {
        let product = 1;
        for (const vow of this.getMatchingCompletedVows({ school, domain })) {
            product *= (1 + this.effectiveBonus(vow, 'xp'));
        }
        return product;
    }

    getVowDamageMultiplier({ school, domain } = {}) {
        let product = 1;
        for (const vow of this.getMatchingCompletedVows({ school, domain })) {
            product *= (1 + this.effectiveBonus(vow, 'damage'));
        }
        return product;
    }

    /** @deprecated Prefer getVowXpMultiplier({ school }); kept for skill-tree UI */
    getVowQuestMultiplier(school) {
        return this.getVowXpMultiplier({ school });
    }

    normalizeVow(raw) {
        const cols = Math.max(1, Number(raw.cols) || 5);
        const rows = Math.max(1, Number(raw.rows) || 10);
        const id = raw.id || this.createId('vow');
        const schools = raw.schools == null && String(id) === 'autocompasion'
            ? ['Autoridad', 'Presencia', 'Calidez']
            : this.normalizeSchoolIds(raw.schools);
        let domains;
        if (raw.domains == null && String(id) === 'autocompasion') {
            domains = ['psychologicalWellbeing'];
        } else {
            domains = this.normalizeDomainIds(raw.domains);
        }
        const grains = Array.isArray(raw.grains)
            ? raw.grains.map((g, i) => ({
                id: g.id || `grain_${i}`,
                date: g.date || '',
                experience: g.experience || g.text || ''
            }))
            : [];
        const complete = grains.length >= cols * rows;
        return {
            id,
            title: (raw.title || '').trim() || 'Vow',
            inscription: (raw.inscription || raw.belief || '').trim(),
            imagePath: (raw.imagePath || '').trim(),
            cols,
            rows,
            schools,
            domains,
            xpBonus: this.normalizeBonus(raw.xpBonus),
            damageBonus: this.normalizeBonus(raw.damageBonus),
            completedAt: raw.completedAt || (complete ? new Date().toISOString() : null),
            grains
        };
    }

    createVow({ title, inscription, imagePath, cols = 5, rows = 10, schools = [], domains = [] }) {
        const vows = this.ensureVows();
        const vow = this.normalizeVow({
            id: this.createId('vow'),
            title,
            inscription,
            imagePath,
            cols,
            rows,
            schools,
            domains,
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
        if (patch.schools != null) vow.schools = this.normalizeSchoolIds(patch.schools);
        if (patch.domains != null) vow.domains = this.normalizeDomainIds(patch.domains);
        if (patch.xpBonus != null) vow.xpBonus = this.normalizeBonus(patch.xpBonus, vow.xpBonus);
        if (patch.damageBonus != null) vow.damageBonus = this.normalizeBonus(patch.damageBonus, vow.damageBonus);
        return vow;
    }

    /**
     * True if this vow already has a grain with the same date + experience text.
     * Used to block linking the same hito to the same vow twice.
     */
    hasGrainMatching(vowId, { date, experience }) {
        const vow = this.getVow(vowId);
        if (!vow || !Array.isArray(vow.grains)) return false;
        const text = String(experience || '').trim();
        const day = String(date || '').trim();
        if (!text) return false;
        return vow.grains.some(g =>
            String(g.experience || '').trim() === text &&
            (!day || String(g.date || '').trim() === day)
        );
    }

    addGrain(vowId, { date, experience }) {
        const vow = this.getVow(vowId);
        if (!vow) throw new Error('Vow no encontrado');
        if (!Array.isArray(vow.grains)) vow.grains = [];
        const target = this.targetCells(vow);
        const text = String(experience || '').trim();
        if (!text) throw new Error('La experiencia del hito está vacía');
        const day = String(date || '').trim() || new Date().toISOString().slice(0, 10);
        if (this.hasGrainMatching(vowId, { date: day, experience: text })) {
            throw new Error('Este hito ya está vinculado a este vow');
        }
        const grain = {
            id: this.createId('grain'),
            date: day,
            experience: text
        };
        vow.grains.push(grain);
        if (!vow.completedAt && vow.grains.length >= target) {
            vow.completedAt = new Date().toISOString();
        }
        return grain;
    }
}

module.exports = { VowService };
