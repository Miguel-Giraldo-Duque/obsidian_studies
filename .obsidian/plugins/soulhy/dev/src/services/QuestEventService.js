/* QuestEventService — multi-roadmap quest events with daily board + flower reward */

class QuestEventService {
    constructor(plugin) {
        this.plugin = plugin;
    }

    ensureStore() {
        if (!Array.isArray(this.plugin.settings.questEvents)) {
            this.plugin.settings.questEvents = [];
        }
        return this.plugin.settings.questEvents;
    }

    localIsoDate(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    parseIsoDate(iso) {
        const [y, m, d] = String(iso || '').split('-').map(Number);
        if (!y || !m || !d) return null;
        return new Date(y, m - 1, d);
    }

    addDaysIso(iso, days) {
        const d = this.parseIsoDate(iso);
        if (!d) return this.localIsoDate();
        d.setDate(d.getDate() + days);
        return this.localIsoDate(d);
    }

    dayNumber(event, fecha = this.localIsoDate()) {
        const start = this.parseIsoDate(event.startDate);
        const cur = this.parseIsoDate(fecha);
        if (!start || !cur) return 1;
        return Math.floor((cur.getTime() - start.getTime()) / 86400000) + 1;
    }

    weekNumber(event, fecha = this.localIsoDate()) {
        const dia = this.dayNumber(event, fecha);
        if (dia < 1) return 1;
        const maxWeek = Math.max(1, Math.ceil((Number(event.durationDays) || 30) / 7));
        return Math.min(maxWeek, Math.ceil(dia / 7));
    }

    listEvents() {
        return this.ensureStore();
    }

    getEvent(id) {
        return this.ensureStore().find(e => e.id === id) || null;
    }

    getActiveEvents() {
        return this.ensureStore().filter(e => e.status === 'active');
    }

    getQuestById(questId) {
        return (this.plugin.settings.quests || []).find(q => q.id === questId) || null;
    }

    questIdsInOtherActiveEvents(exceptEventId = null) {
        const taken = new Set();
        this.getActiveEvents().forEach(ev => {
            if (exceptEventId && ev.id === exceptEventId) return;
            (ev.poolQuestIds || []).forEach(id => taken.add(id));
        });
        return taken;
    }

    progress(event) {
        const total = (event.poolQuestIds || []).length;
        const done = (event.completedInEvent || []).length;
        return {
            done,
            total,
            pct: total > 0 ? Math.round((done / total) * 100) : 0
        };
    }

    getEligiblePoolForWeek(event, weekNum) {
        const constraints = (event.weekConstraints || {})[String(weekNum)] || {};
        const campaignIds = Array.isArray(constraints.campaignIds) ? constraints.campaignIds : [];
        const nodeIds = Array.isArray(constraints.skillNodeIds) ? constraints.skillNodeIds : [];
        const schoolIds = Array.isArray(constraints.schoolIds) ? constraints.schoolIds : [];
        const completed = new Set(event.completedInEvent || []);
        const taken = this.questIdsInOtherActiveEvents(event.id);

        return (event.poolQuestIds || []).filter(qid => {
            if (completed.has(qid)) return false;
            if (taken.has(qid)) return false;
            const quest = this.getQuestById(qid);
            if (!quest || quest.completed) return false;
            if (campaignIds.length > 0) {
                const cid = quest.campaignId || '';
                if (!campaignIds.includes(cid)) return false;
            }
            if (nodeIds.length > 0 && !nodeIds.includes(quest.skillNodeId)) return false;
            if (schoolIds.length > 0 && !schoolIds.includes(quest.school)) return false;
            return true;
        });
    }

    campaignsInPool(event) {
        const map = new Map();
        const camps = this.plugin.settings.questCampaigns || [];
        (event.poolQuestIds || []).forEach(qid => {
            const q = this.getQuestById(qid);
            if (!q?.campaignId) return;
            if (map.has(q.campaignId)) return;
            const camp = camps.find(c => c.id === q.campaignId);
            map.set(q.campaignId, camp || { id: q.campaignId, name: q.campaignId });
        });
        return [...map.values()];
    }

    pickFromPool(event, weekNum, quota) {
        const eligible = this.getEligiblePoolForWeek(event, weekNum);
        const bySchool = {};
        eligible.forEach(qid => {
            const quest = this.getQuestById(qid);
            const school = quest?.school || 'Other';
            if (!bySchool[school]) bySchool[school] = [];
            bySchool[school].push(qid);
        });

        const schools = Object.keys(bySchool);
        const picked = [];
        let guard = 0;
        while (picked.length < quota && guard < 50) {
            let progressed = false;
            for (const school of schools) {
                if (picked.length >= quota) break;
                const list = bySchool[school];
                if (list && list.length > 0) {
                    picked.push(list.shift());
                    progressed = true;
                }
            }
            if (!progressed) break;
            guard += 1;
        }
        return picked;
    }

    createEvent(payload = {}) {
        const startDate = payload.startDate || this.localIsoDate();
        const durationDays = Math.max(1, Number(payload.durationDays) || 30);
        const dailyQuota = Math.max(1, Number(payload.dailyQuota) || 3);
        const poolQuestIds = Array.from(new Set(payload.poolQuestIds || []));
        const taken = this.questIdsInOtherActiveEvents();
        const filteredPool = poolQuestIds.filter(id => !taken.has(id));

        const event = {
            ...JSON.parse(JSON.stringify(DEFAULT_QUEST_EVENT)),
            id: payload.id || `qevent_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            name: payload.name || 'Roadmap',
            status: 'active',
            startDate,
            durationDays,
            dailyQuota,
            poolQuestIds: filteredPool,
            weekConstraints: payload.weekConstraints || {},
            assignments: {},
            completedInEvent: [],
            flowerId: payload.flowerId || null,
            flowerUnlocked: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.ensureStore().push(event);
        this.ensureTodayBoardForEvent(event);
        return event;
    }

    updateEvent(id, patch = {}) {
        const event = this.getEvent(id);
        if (!event) return null;
        Object.assign(event, patch);
        return event;
    }

    /**
     * Edit roadmap config without wiping status, assignments, or progress.
     * Extends weekConstraints for a longer duration from the last configured week.
     */
    applyRoadmapEdit(id, payload = {}) {
        const event = this.getEvent(id);
        if (!event) return null;

        const name = (payload.name != null && String(payload.name).trim())
            ? String(payload.name).trim()
            : (event.name || 'Roadmap');
        const startDate = payload.startDate || event.startDate || this.localIsoDate();
        const durationDays = Math.max(1, Number(payload.durationDays) || event.durationDays || 30);
        const dailyQuota = Math.max(1, Number(payload.dailyQuota) || event.dailyQuota || 3);

        const poolQuestIds = Array.from(new Set(payload.poolQuestIds || event.poolQuestIds || []));
        const taken = this.questIdsInOtherActiveEvents(id);
        const filteredPool = poolQuestIds.filter(qid => !taken.has(qid));

        const weekConstraints = payload.weekConstraints
            ? JSON.parse(JSON.stringify(payload.weekConstraints))
            : JSON.parse(JSON.stringify(event.weekConstraints || {}));
        const weeks = Math.ceil(durationDays / 7);
        const existingKeys = Object.keys(weekConstraints)
            .map(Number)
            .filter(n => !Number.isNaN(n))
            .sort((a, b) => a - b);
        const lastKey = existingKeys.length ? String(existingKeys[existingKeys.length - 1]) : null;
        const lastCampaignIds = lastKey
            ? [...(weekConstraints[lastKey].campaignIds || [])]
            : [];
        for (let w = 1; w <= weeks; w++) {
            const key = String(w);
            if (!weekConstraints[key]) {
                weekConstraints[key] = { campaignIds: [...lastCampaignIds] };
            }
        }

        const nextFlowerId = Object.prototype.hasOwnProperty.call(payload, 'flowerId')
            ? (payload.flowerId || null)
            : (event.flowerId || null);
        const flowerUnlocked = nextFlowerId !== event.flowerId
            ? false
            : !!event.flowerUnlocked;

        Object.assign(event, {
            name,
            startDate,
            durationDays,
            dailyQuota,
            poolQuestIds: filteredPool,
            weekConstraints,
            flowerId: nextFlowerId,
            flowerUnlocked
        });

        this.ensureTodayBoard();
        return event;
    }

    setStatus(id, status) {
        const event = this.getEvent(id);
        if (!event) return null;
        if (!['active', 'paused', 'done'].includes(status)) return event;
        const wasDone = event.status === 'done';
        event.status = status;
        if (status === 'done' && !event.completedAt) {
            event.completedAt = new Date().toISOString();
        }
        if (status === 'active' && wasDone) {
            event.completedAt = null;
        }
        if (status === 'active') {
            this.ensureTodayBoardForEvent(event);
        }
        return event;
    }

    /**
     * Calendar window ended, but an active roadmap still feeds Hoy
     * while the last week's constraints have open quests.
     */
    shouldScheduleDay(event, fecha = this.localIsoDate()) {
        const dia = this.dayNumber(event, fecha);
        if (dia < 1) return false;
        const duration = Number(event.durationDays) || 30;
        if (dia <= duration) return true;
        const week = this.weekNumber(event, fecha);
        return this.getEligiblePoolForWeek(event, week).length > 0;
    }

    getTodayAssignment(event, fecha = this.localIsoDate()) {
        if (!event.assignments) event.assignments = {};
        return event.assignments[fecha] || [];
    }

    ensureTodayBoardForEvent(event, fecha = this.localIsoDate()) {
        if (event.status !== 'active') return [];
        if (!event.assignments) event.assignments = {};

        if (!this.shouldScheduleDay(event, fecha)) {
            return event.assignments[fecha] || [];
        }

        if (Object.prototype.hasOwnProperty.call(event.assignments, fecha)) {
            return event.assignments[fecha] || [];
        }

        const week = this.weekNumber(event, fecha);
        const quota = Math.max(1, Number(event.dailyQuota) || 3);
        const picked = this.pickFromPool(event, week, quota);
        event.assignments[fecha] = picked;
        return picked;
    }

    /**
     * Rollover: incomplete yesterday assignments stay preferred for today (1 day).
     * Then fill remaining quota from pool.
     */
    ensureTodayBoard(fecha = this.localIsoDate()) {
        const yesterday = this.addDaysIso(fecha, -1);
        let changed = false;

        this.getActiveEvents().forEach(event => {
            if (!event.assignments) event.assignments = {};
            if (!this.shouldScheduleDay(event, fecha)) return;

            if (Object.prototype.hasOwnProperty.call(event.assignments, fecha)) {
                return;
            }

            const yIds = event.assignments[yesterday] || [];
            const completed = new Set(event.completedInEvent || []);
            const rolled = yIds.filter(id => {
                const q = this.getQuestById(id);
                return q && !q.completed && !completed.has(id);
            });

            const week = this.weekNumber(event, fecha);
            const quota = Math.max(1, Number(event.dailyQuota) || 3);
            const need = Math.max(0, quota - rolled.length);
            const fill = need > 0
                ? this.pickFromPool(event, week, need).filter(id => !rolled.includes(id))
                : [];
            event.assignments[fecha] = [...rolled, ...fill].slice(0, quota);
            changed = true;
        });

        return changed;
    }

    unlockEventFlower(event) {
        if (!event?.flowerId || event.flowerUnlocked) return null;
        const flower = this.plugin.getFlowerById
            ? this.plugin.getFlowerById(event.flowerId)
            : (this.plugin.settings.flowers || []).find(f => f.id === event.flowerId);
        if (!flower) return null;

        flower.unlocked = true;
        flower.unlockedAt = new Date().toISOString();
        flower.roadmapEventId = event.id;
        if (!flower.bossId) {
            // leave bossId unset; roadmap origin via roadmapEventId
        }
        event.flowerUnlocked = true;
        return flower;
    }

    completeEvent(event, { grantFlower = false } = {}) {
        event.status = 'done';
        event.completedAt = new Date().toISOString();
        const flower = grantFlower ? this.unlockEventFlower(event) : null;
        return { event, flower };
    }

    onQuestCompleted(questId) {
        if (!questId) return null;
        let closed = null;

        this.ensureStore().forEach(event => {
            if (event.status === 'done') return;
            if (!(event.poolQuestIds || []).includes(questId)) return;

            if (!Array.isArray(event.completedInEvent)) event.completedInEvent = [];
            if (!event.completedInEvent.includes(questId)) {
                event.completedInEvent.push(questId);
            }

            const { done, total } = this.progress(event);
            if (total > 0 && done >= total) {
                closed = this.completeEvent(event, { grantFlower: true });
            }
        });

        return closed;
    }

    getUnifiedTodayBoard(fecha = this.localIsoDate()) {
        this.ensureTodayBoard(fecha);
        const rows = [];
        this.getActiveEvents().forEach(event => {
            const ids = this.getTodayAssignment(event, fecha);
            ids.forEach(qid => {
                const quest = this.getQuestById(qid);
                if (!quest) return;
                rows.push({ event, quest, questId: qid });
            });
        });
        return rows;
    }

    schoolsInPool(event) {
        const schools = new Set();
        (event.poolQuestIds || []).forEach(qid => {
            const q = this.getQuestById(qid);
            if (q?.school) schools.add(q.school);
        });
        return [...schools];
    }

    nodesInPool(event) {
        const map = new Map();
        const nodes = this.plugin.settings.skillTree?.nodes || [];
        (event.poolQuestIds || []).forEach(qid => {
            const q = this.getQuestById(qid);
            if (!q?.skillNodeId) return;
            if (map.has(q.skillNodeId)) return;
            const node = nodes.find(n => n.id === q.skillNodeId);
            map.set(q.skillNodeId, node || { id: q.skillNodeId, name: q.skillNodeId, school: q.school });
        });
        return [...map.values()];
    }
}

module.exports = { QuestEventService };
