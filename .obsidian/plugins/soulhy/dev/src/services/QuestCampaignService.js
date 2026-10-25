/* QuestCampaignService — packs of campaign-challenge quests (EveVacum-style) */

class QuestCampaignService {
    constructor(plugin) {
        this.plugin = plugin;
    }

    ensureStore() {
        if (!Array.isArray(this.plugin.settings.questCampaigns)) {
            this.plugin.settings.questCampaigns = [];
        }
        return this.plugin.settings.questCampaigns;
    }

    list() {
        return this.ensureStore();
    }

    get(id) {
        return this.ensureStore().find(c => c.id === id) || null;
    }

    getQuestById(questId) {
        return (this.plugin.settings.quests || []).find(q => q.id === questId) || null;
    }

    getQuests(campaign) {
        const ids = campaign?.questIds || [];
        return ids.map(id => this.getQuestById(id)).filter(Boolean);
    }

    create(payload = {}) {
        const campaign = {
            ...JSON.parse(JSON.stringify(DEFAULT_QUEST_CAMPAIGN)),
            id: payload.id || `qcamp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            name: payload.name || 'Nueva campaña',
            description: payload.description || '',
            school: payload.school || 'Campo',
            linkedBossIds: Array.isArray(payload.linkedBossIds) ? payload.linkedBossIds : [],
            defaultBossDamage: Number(payload.defaultBossDamage) || 25,
            flowerId: payload.flowerId || null,
            questIds: Array.isArray(payload.questIds) ? [...payload.questIds] : [],
            sourceTag: payload.sourceTag || null,
            createdAt: new Date().toISOString()
        };
        this.ensureStore().push(campaign);
        return campaign;
    }

    update(id, patch = {}) {
        const campaign = this.get(id);
        if (!campaign) return null;
        Object.assign(campaign, patch);
        return campaign;
    }

    delete(id) {
        const store = this.ensureStore();
        const idx = store.findIndex(c => c.id === id);
        if (idx < 0) return false;
        store.splice(idx, 1);
        return true;
    }

    addQuest(campaignId, fields = {}) {
        const campaign = this.get(campaignId);
        if (!campaign) return null;

        const quest = {
            ...JSON.parse(JSON.stringify(DEFAULT_CAMPAIGN_QUEST)),
            id: `quest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            name: fields.name || 'Nueva quest',
            description: fields.description || '',
            xp: Number(fields.xp) || 10,
            gold: Number(fields.gold) || 5,
            domain: fields.domain || 'psychologicalWellbeing',
            difficulty: fields.difficulty || 'easy',
            school: fields.school || campaign.school || 'Campo',
            linkedBossIds: Array.isArray(fields.linkedBossIds) && fields.linkedBossIds.length
                ? fields.linkedBossIds
                : [...(campaign.linkedBossIds || [])],
            bossDamage: Number(fields.bossDamage) || campaign.defaultBossDamage || 25,
            campaignId: campaign.id,
            source: campaign.sourceTag || 'campaign',
            kind: 'campaign-challenge',
            skillNodeId: '',
            skillLevel: 1,
            completed: false,
            completedDate: null
        };

        if (!Array.isArray(this.plugin.settings.quests)) {
            this.plugin.settings.quests = [];
        }
        this.plugin.settings.quests.push(quest);
        if (!campaign.questIds.includes(quest.id)) {
            campaign.questIds.push(quest.id);
        }
        return quest;
    }

    removeQuestFromCampaign(campaignId, questId, { deleteQuest = false } = {}) {
        const campaign = this.get(campaignId);
        if (!campaign) return false;
        campaign.questIds = (campaign.questIds || []).filter(id => id !== questId);
        if (deleteQuest) {
            const qIdx = (this.plugin.settings.quests || []).findIndex(q => q.id === questId);
            if (qIdx >= 0) this.plugin.settings.quests.splice(qIdx, 1);
        } else {
            const quest = this.getQuestById(questId);
            if (quest && quest.campaignId === campaignId) {
                quest.campaignId = '';
            }
        }
        return true;
    }

    /**
     * Link existing skill-challenge quests into a campaign without changing kind/skillNodeId.
     * Sets campaignId so roadmap weekConstraints can filter by campaign.
     */
    linkExistingQuests(campaignId, questIds = []) {
        const campaign = this.get(campaignId);
        if (!campaign) return { linked: 0, skipped: 0 };
        let linked = 0;
        let skipped = 0;
        if (!Array.isArray(campaign.questIds)) campaign.questIds = [];

        questIds.forEach(qid => {
            const quest = this.getQuestById(qid);
            if (!quest) {
                skipped += 1;
                return;
            }
            if (campaign.questIds.includes(qid)) {
                skipped += 1;
                return;
            }
            campaign.questIds.push(qid);
            quest.campaignId = campaignId;
            linked += 1;
        });
        return { linked, skipped };
    }

    /**
     * One-shot: group evevacum-bank quests into a campaign pack.
     * @returns {boolean} true if store changed
     */
    ensureEveVacumCampaign() {
        this.ensureStore();
        const existing = this.ensureStore().find(c => c.sourceTag === EVEVACUM_CAMPAIGN_SOURCE);
        const eveQuests = (this.plugin.settings.quests || []).filter(
            q => q.source === EVEVACUM_CAMPAIGN_SOURCE
        );
        if (eveQuests.length === 0) return false;

        if (existing) {
            let changed = false;
            eveQuests.forEach(q => {
                if (!existing.questIds.includes(q.id)) {
                    existing.questIds.push(q.id);
                    changed = true;
                }
                if (q.campaignId !== existing.id) {
                    q.campaignId = existing.id;
                    if (q.kind !== 'campaign-challenge' && !q.skillNodeId) {
                        q.kind = 'campaign-challenge';
                    }
                    changed = true;
                }
            });
            return changed;
        }

        const bossIds = [...new Set(
            eveQuests.flatMap(q => Array.isArray(q.linkedBossIds) ? q.linkedBossIds : [])
        )];
        const campaign = this.create({
            name: 'EveVacum — ecos de campo',
            description: 'Retos de campo / presencia social (eco EveVacum). No suben nodos del Árbol.',
            school: 'Campo',
            linkedBossIds: bossIds.length ? bossIds : [EVEVACUM_BOSS_ID],
            defaultBossDamage: 25,
            questIds: eveQuests.map(q => q.id),
            sourceTag: EVEVACUM_CAMPAIGN_SOURCE
        });

        eveQuests.forEach(q => {
            q.campaignId = campaign.id;
            if (!q.skillNodeId) q.kind = 'campaign-challenge';
        });
        return true;
    }
}

module.exports = { QuestCampaignService };
