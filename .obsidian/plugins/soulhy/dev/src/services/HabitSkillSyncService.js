/* HabitSkillSyncService - Connect Obsidian habit checklists to skill XP */

class HabitSkillSyncService {
    constructor(plugin) {
        this.plugin = plugin;
        this.skillService = new SkillService(plugin);
    }

    ensureSettings() {
        const existing = this.plugin.settings.habitSkillSync || {};
        this.plugin.settings.habitSkillSync = {
            ...JSON.parse(JSON.stringify(DEFAULT_HABIT_SKILL_SYNC)),
            ...existing,
            processedTasks: existing.processedTasks || {},
            mappings: {
                ...DEFAULT_HABIT_SKILL_SYNC.mappings,
                ...(existing.mappings || {})
            },
            skillCategories: {
                ...DEFAULT_HABIT_SKILL_SYNC.skillCategories,
                ...(existing.skillCategories || {})
            }
        };

        return this.plugin.settings.habitSkillSync;
    }

    isWeeklyNote(file) {
        const settings = this.ensureSettings();
        return Boolean(
            file?.path &&
            file.path.startsWith(settings.weeklyFolder + '/') &&
            file.path.endsWith('.md')
        );
    }

    async syncAll(showNotice = false) {
        const settings = this.ensureSettings();
        if (!settings.enabled) {
            if (showNotice) new Notice('Habit skill sync is disabled.');
            return { awarded: [], skipped: 0 };
        }

        const weeklyNotes = this.plugin.app.vault
            .getMarkdownFiles()
            .filter(file => this.isWeeklyNote(file));

        return this.syncFiles(weeklyNotes, showNotice);
    }

    async syncFile(file, showNotice = false) {
        if (!this.isWeeklyNote(file)) {
            return { awarded: [], skipped: 0 };
        }

        return this.syncFiles([file], showNotice);
    }

    async syncFiles(files, showNotice = false) {
        const settings = this.ensureSettings();
        const awarded = [];
        let skipped = 0;

        for (const file of files) {
            const content = await this.plugin.app.vault.read(file);
            const completedHabits = this.extractCompletedHabits(content, file.path);

            for (const habit of completedHabits) {
                if (settings.processedTasks[habit.key]) {
                    skipped++;
                    continue;
                }

                const skillName = this.resolveSkillName(habit.name);
                if (!skillName) {
                    skipped++;
                    continue;
                }

                const skill = this.findOrCreateSkill(skillName);
                const result = this.skillService.addSkillXp(skill.id, settings.xpPerHabit);

                settings.processedTasks[habit.key] = new Date().toISOString();
                awarded.push({
                    habitName: habit.name,
                    skillName: skill.name,
                    xp: settings.xpPerHabit,
                    levelsGained: result?.levelsGained || 0
                });
            }
        }

        if (awarded.length > 0) {
            await this.plugin.saveSettings();
            this.plugin.refreshViews();
        }

        if (showNotice) {
            this.showSummary(awarded, skipped);
        }

        return { awarded, skipped };
    }

    extractCompletedHabits(content, filePath) {
        return content
            .split('\n')
            .map((line, index) => ({ line, index }))
            .map(({ line, index }) => {
                const match = line.match(/^\s*-\s*\[x\]\s*\[habito::\s*([^\]]+)\]/i);
                if (!match) return null;

                const name = match[1].trim();
                return {
                    name,
                    key: `${filePath}::${index + 1}::${name.toLowerCase()}`
                };
            })
            .filter(Boolean);
    }

    resolveSkillName(habitName) {
        const settings = this.ensureSettings();
        if (settings.mappings[habitName]) {
            return settings.mappings[habitName];
        }

        const normalizedHabit = this.normalize(habitName);
        const mappingMatch = Object.entries(settings.mappings).find(([source]) =>
            this.normalize(source) === normalizedHabit
        );
        if (mappingMatch) {
            return mappingMatch[1];
        }

        return null;
    }

    findOrCreateSkill(skillName) {
        const existing = this.skillService.getSkills().find(skill =>
            this.normalize(skill.name) === this.normalize(skillName)
        );

        if (existing) {
            return existing;
        }

        const settings = this.ensureSettings();
        const category = settings.skillCategories[skillName] || 'mind';
        return this.skillService.createSkill(skillName, category, 'habit-checklist');
    }

    normalize(value) {
        return String(value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    showSummary(awarded, skipped) {
        if (awarded.length === 0) {
            new Notice(skipped > 0 ? 'No new habit skill XP to sync.' : 'No completed mapped habits found.');
            return;
        }

        const totalXp = awarded.reduce((sum, item) => sum + item.xp, 0);
        const levelUps = awarded.filter(item => item.levelsGained > 0);
        const skillNames = [...new Set(awarded.map(item => item.skillName))].join(', ');
        const levelText = levelUps.length > 0 ? `\nLevel ups: ${levelUps.map(item => item.skillName).join(', ')}` : '';

        new Notice(`Habit skills synced: +${totalXp} XP to ${skillNames}${levelText}`);
    }
}

module.exports = { HabitSkillSyncService };
