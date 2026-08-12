/* SkillTreeService - Social skill tree, challenge quests, and boss links */

class SkillTreeService {
    constructor(plugin) {
        this.plugin = plugin;
    }

    clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    createId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    ensureSkillTree() {
        const s = this.plugin.settings;
        let changed = false;

        if (!s.skillTree) {
            s.skillTree = this.clone(DEFAULT_SKILL_TREE);
            changed = true;
        }

        if (!Array.isArray(s.skillTree.schools) || s.skillTree.schools.length === 0) {
            s.skillTree.schools = SKILL_TREE_SCHOOLS.map(school => school.id);
            changed = true;
        }

        if (!Array.isArray(s.skillTree.nodes)) {
            s.skillTree.nodes = [];
            changed = true;
        }

        if (typeof s.skillTree.seedCleaned !== 'boolean') {
            s.skillTree.seedCleaned = false;
            changed = true;
        }

        if (!Array.isArray(s.quests)) {
            s.quests = [];
            changed = true;
        }

        s.skillTree.nodes.forEach(node => {
            if (!Array.isArray(node.prerequisiteNodeIds)) {
                node.prerequisiteNodeIds = [];
                changed = true;
            }
            if (typeof node.currentLevel !== 'number') {
                node.currentLevel = 0;
                changed = true;
            }
            if (typeof node.maxLevel !== 'number') {
                node.maxLevel = 3;
                changed = true;
            }
            if (typeof node.acquired !== 'boolean') {
                node.acquired = node.currentLevel >= node.maxLevel;
                changed = true;
            }
            if (typeof node.imagePath !== 'string') {
                node.imagePath = '';
                changed = true;
            } else {
                const legacyRootIcon = node.imagePath.match(/^RpgImages\/(\d+\.(?:png|jpe?g|gif|webp|svg))$/i);
                if (legacyRootIcon) {
                    node.imagePath = `RpgImages/skills/${legacyRootIcon[1]}`;
                    changed = true;
                }
            }
            if (!node.nodeRole || !SKILL_TREE_NODE_ROLES[node.nodeRole]) {
                node.nodeRole = 'standard';
                changed = true;
            }
            if (typeof node.prerequisiteMinLevel !== 'number') {
                node.prerequisiteMinLevel = 2;
                changed = true;
            }
        });

        return changed;
    }

    cleanLegacySeed() {
        this.ensureSkillTree();
        if (this.plugin.settings.skillTree.seedCleaned) {
            return false;
        }

        const s = this.plugin.settings;
        let changed = false;
        const legacyNodeId = LEGACY_SOMMELIER_NODE_ID;

        const beforeNodes = s.skillTree.nodes.length;
        s.skillTree.nodes = s.skillTree.nodes.filter(node => node.id !== legacyNodeId);
        if (s.skillTree.nodes.length !== beforeNodes) {
            changed = true;
        }

        const beforeQuests = s.quests.length;
        s.quests = s.quests.filter(quest => {
            if (quest.id && quest.id.startsWith('quest_sommelier_')) return false;
            if (quest.skillNodeId === legacyNodeId) return false;
            return true;
        });
        if (s.quests.length !== beforeQuests) {
            changed = true;
        }

        s.skillTree.seedCleaned = true;
        return changed || true;
    }

    getTree() {
        this.ensureSkillTree();
        return this.plugin.settings.skillTree;
    }

    getNodes() {
        return this.getTree().nodes;
    }

    getNode(nodeId) {
        return this.getNodes().find(node => node.id === nodeId);
    }

    getSchoolInfo(schoolId) {
        return SKILL_TREE_SCHOOLS.find(school => school.id === schoolId)
            || SKILL_TREE_SCHOOLS.find(school => (school.aliases || []).includes(schoolId))
            || SKILL_TREE_SCHOOLS[0];
    }

    normalizeSchool(schoolId) {
        return this.getSchoolInfo(schoolId).id;
    }

    createNode({
        name,
        school,
        parentId = null,
        maxLevel = 3,
        description = '',
        linkedSkillId = null,
        imagePath = '',
        nodeRole = 'standard',
        prerequisiteNodeIds = [],
        prerequisiteMinLevel = 2
    }) {
        this.ensureSkillTree();
        const normalizedSchool = this.normalizeSchool(school || 'Autoridad');
        const normalizedRole = SKILL_TREE_NODE_ROLES[nodeRole] ? nodeRole : 'standard';
        const node = {
            id: this.createId('node'),
            name: name.trim(),
            school: normalizedSchool,
            parentId: parentId || null,
            maxLevel: Math.max(1, Number(maxLevel) || 3),
            currentLevel: 0,
            acquired: false,
            prerequisiteNodeIds: Array.isArray(prerequisiteNodeIds) ? [...prerequisiteNodeIds] : [],
            prerequisiteMinLevel: Math.max(1, Number(prerequisiteMinLevel) || 2),
            nodeRole: normalizedRole,
            linkedSkillId: linkedSkillId || null,
            description: description || '',
            imagePath: imagePath || ''
        };

        this.plugin.settings.skillTree.nodes.push(node);
        return node;
    }

    updateNode(nodeId, updates = {}) {
        const node = this.getNode(nodeId);
        if (!node) return null;

        if (updates.name !== undefined) node.name = updates.name.trim();
        if (updates.description !== undefined) node.description = updates.description;
        if (updates.imagePath !== undefined) node.imagePath = updates.imagePath || '';
        if (updates.maxLevel !== undefined) node.maxLevel = Math.max(1, Number(updates.maxLevel) || 1);
        if (updates.parentId !== undefined) node.parentId = updates.parentId || null;
        if (updates.nodeRole !== undefined && SKILL_TREE_NODE_ROLES[updates.nodeRole]) {
            node.nodeRole = updates.nodeRole;
        }
        if (updates.prerequisiteNodeIds !== undefined) {
            node.prerequisiteNodeIds = Array.isArray(updates.prerequisiteNodeIds) ? [...updates.prerequisiteNodeIds] : [];
        }
        if (updates.prerequisiteMinLevel !== undefined) {
            node.prerequisiteMinLevel = Math.max(1, Number(updates.prerequisiteMinLevel) || 2);
        }

        return node;
    }

    getPrerequisiteIds(node) {
        if (!node) return [];
        const prereqs = new Set([...(node.prerequisiteNodeIds || [])]);
        if (node.parentId) prereqs.add(node.parentId);
        return Array.from(prereqs);
    }

    getPrerequisiteStatus(node) {
        if (!node) return [];
        const requiredLevel = node.prerequisiteMinLevel ?? 2;
        return this.getPrerequisiteIds(node).map(id => {
            const prereq = this.getNode(id);
            const currentLevel = prereq?.currentLevel || 0;
            return {
                id,
                name: prereq?.name || id,
                currentLevel,
                maxLevel: prereq?.maxLevel || 0,
                requiredLevel,
                met: Boolean(prereq && currentLevel >= requiredLevel)
            };
        });
    }

    isNodeUnlocked(node) {
        if (!node) return false;

        const prereqIds = this.getPrerequisiteIds(node);
        if (prereqIds.length === 0) return true;

        const minLevel = node.prerequisiteMinLevel ?? 2;
        return prereqIds.every(id => {
            const prereq = this.getNode(id);
            return prereq && (prereq.currentLevel || 0) >= minLevel;
        });
    }

    getNodeQuests(nodeId, level = null) {
        this.ensureSkillTree();
        return this.plugin.settings.quests.filter(quest =>
            quest.kind === 'skill-challenge'
            && quest.skillNodeId === nodeId
            && (level === null || Number(quest.skillLevel) === Number(level))
        );
    }

    getLevelProgress(nodeId, level) {
        const quests = this.getNodeQuests(nodeId, level);
        const completed = quests.filter(quest => quest.completed);
        return {
            total: quests.length,
            completed: completed.length,
            done: quests.length > 0 && completed.length === quests.length
        };
    }

    createQuest({ skillNodeId, skillLevel, name, description, difficulty = 'medium', xp = 25, gold = 10, domain = 'communityVitality', linkedBossIds = [], bossDamage = 10 }) {
        this.ensureSkillTree();
        const node = this.getNode(skillNodeId);
        if (!node) return null;

        const quest = {
            ...this.clone(DEFAULT_SKILL_TREE_QUEST),
            id: this.createId('quest'),
            name: name.trim(),
            description: description || '',
            difficulty,
            xp: Number(xp) || 25,
            gold: Number(gold) || 10,
            domain,
            skillNodeId,
            skillLevel: Math.max(1, Number(skillLevel) || 1),
            school: node.school,
            linkedBossIds: Array.isArray(linkedBossIds) ? linkedBossIds : [],
            bossDamage: Number(bossDamage) || 10
        };

        this.plugin.settings.quests.push(quest);
        return quest;
    }

    recalculateNodeProgress(nodeId) {
        const node = this.getNode(nodeId);
        if (!node) return null;

        let highestCompletedLevel = 0;
        for (let level = 1; level <= node.maxLevel; level++) {
            const progress = this.getLevelProgress(nodeId, level);
            if (progress.done) highestCompletedLevel = level;
            else break;
        }

        const previousLevel = node.currentLevel || 0;
        const wasAcquired = Boolean(node.acquired);
        node.currentLevel = Math.max(previousLevel, highestCompletedLevel);
        node.acquired = node.currentLevel >= node.maxLevel;

        return {
            node,
            leveledUp: node.currentLevel > previousLevel,
            acquired: node.acquired && !wasAcquired
        };
    }

    recalculateAllProgress() {
        this.ensureSkillTree();
        this.getNodes().forEach(node => this.recalculateNodeProgress(node.id));
    }

    applyQuestCompletion(quest) {
        if (!quest || quest.kind !== 'skill-challenge' || !quest.skillNodeId) {
            return null;
        }

        return this.recalculateNodeProgress(quest.skillNodeId);
    }

    getSummary() {
        const nodes = this.getNodes();
        const quests = this.plugin.settings.quests.filter(q => q.kind === 'skill-challenge');
        return {
            nodes: nodes.length,
            acquired: nodes.filter(node => node.acquired).length,
            activeQuests: quests.filter(quest => !quest.completed).length,
            completedQuests: quests.filter(quest => quest.completed).length
        };
    }

    importSommelierBank({ nodeId = SOMMELIER_NODE_ID, bossId = PHOBOS_BOSS_ID } = {}) {
        this.ensureSkillTree();
        const node = this.getNode(nodeId);
        if (!node) {
            return { ok: false, error: 'Nodo Sommelier no encontrado.', created: 0 };
        }

        const existing = this.plugin.settings.quests.filter(
            q => q.source === 'sommelier-bank' && q.skillNodeId === nodeId
        );
        if (existing.length > 0) {
            return { ok: true, alreadyImported: true, created: 0, total: existing.length };
        }

        node.description = SOMMELIER_DESCRIPTION;
        node.maxLevel = 3;

        const difficultyBySkill = { 1: 'easy', 2: 'medium', 3: 'hard' };
        let created = 0;

        SOMMELIER_CHALLENGES.forEach(challenge => {
            const quest = {
                ...this.clone(DEFAULT_SKILL_TREE_QUEST),
                id: this.createId('quest'),
                name: `Reto ${challenge.bankLevel}.${challenge.number}`,
                description: challenge.text,
                difficulty: difficultyBySkill[challenge.skillLevel] || 'medium',
                xp: 10,
                gold: 5,
                domain: 'psychologicalWellbeing',
                skillNodeId: nodeId,
                skillLevel: challenge.skillLevel,
                school: node.school,
                linkedBossIds: [bossId],
                bossDamage: 10,
                source: 'sommelier-bank'
            };
            this.plugin.settings.quests.push(quest);
            created++;
        });

        this.recalculateAllProgress();
        return { ok: true, alreadyImported: false, created, total: created };
    }

    importBenevolenciaBank({ nodeId = BENEVOLENCIA_NODE_ID, bossId = KRYOS_BOSS_ID } = {}) {
        this.ensureSkillTree();
        const node = this.getNode(nodeId);
        if (!node) {
            return { ok: false, error: 'Nodo Benevolencia no encontrado.', created: 0 };
        }

        const existing = this.plugin.settings.quests.filter(
            q => q.source === 'benevolencia-bank' && q.skillNodeId === nodeId
        );
        if (existing.length > 0) {
            return { ok: true, alreadyImported: true, created: 0, total: existing.length };
        }

        node.maxLevel = 3;

        const difficultyBySkill = { 1: 'easy', 2: 'medium', 3: 'hard' };
        let created = 0;

        BENEVOLENCIA_CHALLENGES.forEach(challenge => {
            const quest = {
                ...this.clone(DEFAULT_SKILL_TREE_QUEST),
                id: this.createId('quest'),
                name: `Reto ${challenge.bankLevel}.${challenge.number}`,
                description: challenge.text,
                difficulty: difficultyBySkill[challenge.skillLevel] || 'medium',
                xp: 10,
                gold: 5,
                domain: 'psychologicalWellbeing',
                skillNodeId: nodeId,
                skillLevel: challenge.skillLevel,
                school: node.school,
                linkedBossIds: [bossId],
                bossDamage: 10,
                source: 'benevolencia-bank'
            };
            this.plugin.settings.quests.push(quest);
            created++;
        });

        this.recalculateAllProgress();
        return { ok: true, alreadyImported: false, created, total: created };
    }

    importEmpatiaBank({
        nodeId = EMPATIA_NODE_ID,
        bossIds = [KRYOS_BOSS_ID, PHOBOS_BOSS_ID]
    } = {}) {
        this.ensureSkillTree();
        const node = this.getNode(nodeId);
        if (!node) {
            return { ok: false, error: 'Nodo Empatía no encontrado.', created: 0 };
        }

        const existing = this.plugin.settings.quests.filter(
            q => q.source === 'empatia-bank' && q.skillNodeId === nodeId
        );
        if (existing.length > 0) {
            return { ok: true, alreadyImported: true, created: 0, total: existing.length };
        }

        node.maxLevel = 3;

        const difficultyBySkill = { 1: 'easy', 2: 'medium', 3: 'hard' };
        const linkedBossIds = Array.isArray(bossIds) ? [...bossIds] : [bossIds].filter(Boolean);
        let created = 0;

        EMPATIA_CHALLENGES.forEach(challenge => {
            const quest = {
                ...this.clone(DEFAULT_SKILL_TREE_QUEST),
                id: this.createId('quest'),
                name: `Reto ${challenge.bankLevel}.${challenge.number}`,
                description: challenge.text,
                difficulty: difficultyBySkill[challenge.skillLevel] || 'medium',
                xp: 10,
                gold: 5,
                domain: 'psychologicalWellbeing',
                skillNodeId: nodeId,
                skillLevel: challenge.skillLevel,
                school: node.school,
                linkedBossIds,
                bossDamage: 10,
                source: 'empatia-bank'
            };
            this.plugin.settings.quests.push(quest);
            created++;
        });

        this.recalculateAllProgress();
        return { ok: true, alreadyImported: false, created, total: created };
    }
}

module.exports = { SkillTreeService };
