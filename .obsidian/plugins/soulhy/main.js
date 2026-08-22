/* Life RPG Plugin v5.0 - Modular Edition */
const { Plugin, ItemView, Notice, Modal, Setting, PluginSettingTab, requestUrl, MarkdownRenderer } = require('obsidian');


// ============================================================================
// DEV/SRC/CONSTANTS.JS
// ============================================================================

/* Life RPG Constants - Extracted from main.js */

// Note: VIEW_TYPE_HERO is already defined in main-core.js
// This file provides config that's referenced by multiple modules

// ============================================================================
// MULTI-PROVIDER AI CONFIGURATION
// ============================================================================

const AI_PROVIDERS = {
    openrouter: {
        id: 'openrouter',
        name: 'OpenRouter',
        description: 'Access 100+ models with one API key',
        chatEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
        embeddingEndpoint: 'https://openrouter.ai/api/v1/embeddings',
        authHeader: 'Authorization',
        authPrefix: 'Bearer ',
        extraHeaders: {
            'HTTP-Referer': 'https://obsidian.md',
            'X-Title': 'Life RPG Plugin'
        },
        supportsEmbeddings: true
    },
    openai: {
        id: 'openai',
        name: 'OpenAI',
        description: 'GPT models directly from OpenAI',
        chatEndpoint: 'https://api.openai.com/v1/chat/completions',
        embeddingEndpoint: 'https://api.openai.com/v1/embeddings',
        authHeader: 'Authorization',
        authPrefix: 'Bearer ',
        extraHeaders: {},
        supportsEmbeddings: true
    },
    anthropic: {
        id: 'anthropic',
        name: 'Anthropic',
        description: 'Claude models directly from Anthropic',
        chatEndpoint: 'https://api.anthropic.com/v1/messages',
        embeddingEndpoint: null,
        authHeader: 'x-api-key',
        authPrefix: '',
        extraHeaders: {
            'anthropic-version': '2023-06-01'
        },
        supportsEmbeddings: false
    },
    google: {
        id: 'google',
        name: 'Google AI',
        description: 'Gemini models from Google AI Studio',
        chatEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
        embeddingEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:embedContent',
        authHeader: null,
        authPrefix: '',
        extraHeaders: {},
        supportsEmbeddings: true
    }
};

const MODELS_BY_PROVIDER = {
    openrouter: [
        { id: 'anthropic/claude-sonnet-4.5', name: 'Claude Sonnet 4.5 (Recommended)', type: 'chat' },
        { id: 'anthropic/claude-opus-4.5', name: 'Claude Opus 4.5 (Most Capable)', type: 'chat' },
        { id: 'anthropic/claude-haiku-4.5', name: 'Claude Haiku 4.5 (Fast & Cheap)', type: 'chat' },
        { id: 'openai/gpt-5.2', name: 'GPT-5.2', type: 'chat' },
        { id: 'openai/gpt-5-mini', name: 'GPT-5 Mini', type: 'chat' },
        { id: 'openai/gpt-5-nano', name: 'GPT-5 Nano (Fast & Cheap)', type: 'chat' },
        { id: 'google/gemini-3-pro-preview', name: 'Gemini 3 Pro Preview', type: 'chat' },
        { id: 'google/gemini-3-flash-preview', name: 'Gemini 3 Flash Preview (Fast)', type: 'chat' },
        { id: 'deepseek/deepseek-v3.2', name: 'DeepSeek V3.2 (Cheap)', type: 'chat' },
        { id: 'x-ai/grok-4', name: 'Grok 4', type: 'chat' },
        { id: 'qwen/qwen3-max', name: 'Qwen3 Max', type: 'chat' },
        { id: 'qwen/qwen3-vl-32b-instruct', name: 'Qwen3 VL 32B (Vision)', type: 'chat' },
        { id: 'moonshotai/kimi-k2.5', name: 'Kimi K2.5', type: 'chat' },
        { id: 'zhipu/glm-4.7', name: 'GLM-4.7', type: 'chat' },
        { id: 'openai/text-embedding-3-small', name: 'Text Embedding 3 Small', type: 'embedding', dimensions: 1536 },
        { id: 'openai/text-embedding-3-large', name: 'Text Embedding 3 Large', type: 'embedding', dimensions: 3072 }
    ],
    openai: [
        { id: 'gpt-5.2-2025-12-11', name: 'GPT-5.2 (Recommended)', type: 'chat' },
        { id: 'gpt-5-mini-2025-08-07', name: 'GPT-5 Mini', type: 'chat' },
        { id: 'gpt-5-nano-2025-08-07', name: 'GPT-5 Nano (Fast & Cheap)', type: 'chat' },
        { id: 'text-embedding-3-small', name: 'Text Embedding 3 Small', type: 'embedding', dimensions: 1536 },
        { id: 'text-embedding-3-large', name: 'Text Embedding 3 Large', type: 'embedding', dimensions: 3072 }
    ],
    anthropic: [
        { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5 (Recommended)', type: 'chat' },
        { id: 'claude-opus-4-5-20251101', name: 'Claude Opus 4.5 (Most Capable)', type: 'chat' },
        { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5 (Fast)', type: 'chat' }
    ],
    google: [
        { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview (Recommended)', type: 'chat' },
        { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview (Fast)', type: 'chat' },
        { id: 'text-embedding-004', name: 'Text Embedding 004', type: 'embedding', dimensions: 768 }
    ]
};

// ============================================================================
// SKILL SYSTEM
// ============================================================================

const SKILL_CATEGORIES = {
    mind: {
        name: 'Mind Skills',
        icon: '🧠',
        examples: ['Meditation', 'Critical Thinking', 'Emotional Intelligence', 'Memory', 'Focus', 'Problem Solving', 'Creativity', 'Self-Awareness']
    },
    body: {
        name: 'Body Skills',
        icon: '💪',
        examples: ['Running', 'Strength Training', 'Yoga', 'Swimming', 'Martial Arts', 'Dancing', 'Cooking', 'Sleep Optimization']
    },
    spirit: {
        name: 'Spirit Skills',
        icon: '✨',
        examples: ['Communication', 'Empathy', 'Leadership', 'Networking', 'Teaching', 'Volunteering', 'Environmental Awareness', 'Cultural Appreciation']
    },
    vocation: {
        name: 'Vocation Skills',
        icon: '⚔️',
        examples: ['Programming', 'Writing', 'Design', 'Photography', 'Marketing', 'Finance', 'Project Management', 'Public Speaking']
    }
};

const DEFAULT_SKILL = {
    id: '',
    name: '',
    category: 'vocation',
    kind: 'spell',
    spellSchool: '',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    description: '',
    effects: [],
    statesApplied: [],
    synergyTags: [],
    spellPowerBonus: 0,
    discoveredFrom: '',
    discoveredDate: null,
    lastPracticed: null,
    totalPracticeCount: 0
};

const DEFAULT_SPELL_LIBRARY = {
    'Meditación': {
        category: 'mind',
        spellSchool: 'Presencia',
        description: 'Hechizo de canalización activa el presente.',
        effects: [
            'Potencia cualquier otro hechizo de Calidez o Poder.',
            'Genera foco laser: captura máxima información reduciendo reacciones emocionales y permitiendo manejar respuestas.',
            'Disipa ansiedad, bruma del futuro y síndrome del impostor.'
        ],
        statesApplied: ['Armonía'],
        synergyTags: ['Calidez', 'Poder', 'Acción'],
        spellPowerBonus: 10
    },
    'Lectura de principios': {
        category: 'mind',
        spellSchool: 'Congruencia',
        description: 'Hechizo de energía que activa el estado Congruencia.',
        effects: [
            'Potencia todos los demás hechizos con +10 puntos.',
            'Crea una capa de protección perceptiva ante distracciones y hechizos de reto.',
            'Ayuda contra cambios de marco y retos de valor.'
        ],
        statesApplied: ['Congruencia'],
        synergyTags: ['Protección', 'Poder', 'Acción'],
        spellPowerBonus: 10
    },
    'Gratitud': {
        category: 'mind',
        spellSchool: 'Disipación',
        description: 'Hechizo de disipación para ansiedad o apego al resultado.',
        effects: [
            'Permite volver al presente.',
            'Activa potenciadores de auto-sanación.',
            'Activa visión profunda y potencia hechizos de poder y acción.'
        ],
        statesApplied: ['Presente', 'Auto-sanación'],
        synergyTags: ['Poder', 'Acción', 'Calidez'],
        spellPowerBonus: 10
    },
    'Ejercicio': { category: 'body', spellSchool: 'Vitalidad', description: 'Hechizo corporal que fortalece energía, resistencia y presencia física.', effects: ['Aumenta energía disponible.', 'Refuerza disciplina corporal.'], statesApplied: ['Vitalidad'], synergyTags: ['Energía'], spellPowerBonus: 5 },
    'Carisma': { category: 'spirit', spellSchool: 'Influencia', description: 'Hechizo social de presencia, calidez e impacto interpersonal.', effects: ['Mejora lectura social.', 'Potencia conexión y magnetismo.'], statesApplied: ['Apertura'], synergyTags: ['Calidez', 'Presencia'], spellPowerBonus: 5 },
    'Oratoria': { category: 'vocation', spellSchool: 'Voz', description: 'Hechizo de expresión verbal, claridad y autoridad comunicativa.', effects: ['Fortalece voz y estructura.', 'Potencia hechizos de poder en conversación.'], statesApplied: ['Claridad'], synergyTags: ['Poder', 'Comunicación'], spellPowerBonus: 5 },
    'Social': { category: 'spirit', spellSchool: 'Vínculo', description: 'Hechizo de apertura social y contacto con nuevas personas.', effects: ['Reduce fricción de acercamiento.', 'Aumenta exposición social positiva.'], statesApplied: ['Apertura'], synergyTags: ['Calidez'], spellPowerBonus: 5 },
    'Learning': { category: 'mind', spellSchool: 'Aprendizaje', description: 'Hechizo de adquisición de conocimiento y avance intelectual.', effects: ['Convierte estudio en progreso acumulable.', 'Potencia construcción de modelos mentales.'], statesApplied: ['Curiosidad'], synergyTags: ['Conocimiento'], spellPowerBonus: 5 },
    'Idiomas': { category: 'mind', spellSchool: 'Lenguaje', description: 'Hechizo de expansión lingüística y comprensión verbal.', effects: ['Aumenta precisión auditiva y verbal.', 'Mejora acceso a nuevas culturas.'], statesApplied: ['Comprensión'], synergyTags: ['Comunicación'], spellPowerBonus: 5 },
    'Presencia Social': { category: 'spirit', spellSchool: 'Presencia', description: 'Hechizo de contacto visual, postura y calma social.', effects: ['Entrena mirada estable.', 'Reduce reactividad ante evaluación externa.'], statesApplied: ['Presencia'], synergyTags: ['Calidez', 'Poder'], spellPowerBonus: 5 },
    'Calidez': { category: 'spirit', spellSchool: 'Calidez', description: 'Hechizo de benevolencia expresada y conexión interpersonal.', effects: ['Suaviza el marco de interacción.', 'Potencia empatía y conexión.'], statesApplied: ['Calidez'], synergyTags: ['Presencia', 'Gratitud'], spellPowerBonus: 5 },
    'Autocontrol': { category: 'mind', spellSchool: 'Regulación', description: 'Hechizo de pausa consciente antes de responder o reaccionar.', effects: ['Reduce impulsividad.', 'Permite elegir respuesta en vez de reacción.'], statesApplied: ['Templanza'], synergyTags: ['Presencia'], spellPowerBonus: 5 }
};

const DEFAULT_NATIVE_HABITS = [
    { name: 'Meditación Metta', domain: 'psychologicalWellbeing', skillNames: ['Meditación'], xp: 10, gold: 5, skillXp: 10, difficulty: 'medium' },
    { name: '30min ejercicio', domain: 'health', skillNames: ['Ejercicio'], xp: 10, gold: 5, skillXp: 10, difficulty: 'medium' },
    { name: '10min meditación FOM y OM', domain: 'psychologicalWellbeing', skillNames: ['Meditación'], xp: 10, gold: 5, skillXp: 10, difficulty: 'medium' },
    { name: 'Escribir 5 agradecimientos propios y vision en tercera persona viendome', domain: 'psychologicalWellbeing', skillNames: ['Gratitud'], xp: 10, gold: 5, skillXp: 10, difficulty: 'medium' },
    { name: 'Leer 10pag de mito del carisma', domain: 'education', skillNames: ['Carisma'], xp: 10, gold: 5, skillXp: 10, difficulty: 'medium' },
    { name: '12min Ejercicios oratoria', domain: 'vocation', skillNames: ['Oratoria'], xp: 10, gold: 5, skillXp: 10, difficulty: 'medium' },
    { name: 'Lectura de mis principios', domain: 'psychologicalWellbeing', skillNames: ['Lectura de principios'], xp: 10, gold: 5, skillXp: 10, difficulty: 'medium' },
    { name: 'Salir a conocer una persona a las 3pm en plaza irlanda', domain: 'communityVitality', skillNames: ['Social'], xp: 10, gold: 5, skillXp: 10, difficulty: 'hard' },
    { name: '1 clase de Plazi', domain: 'education', skillNames: ['Learning'], xp: 10, gold: 5, skillXp: 10, difficulty: 'medium' },
    { name: '15min glidish', domain: 'education', skillNames: ['Idiomas'], xp: 10, gold: 5, skillXp: 10, difficulty: 'medium' },
    { name: 'Mirar 2 conductores a los ojos mientras espero en la parada del bus, sin reir, ni enconbarme solo mirar.', domain: 'communityVitality', skillNames: ['Presencia Social'], xp: 10, gold: 5, skillXp: 10, difficulty: 'hard' },
    { name: 'Durante la conversación con una persona, decir 3 cosas que agradesco de esa persona.', domain: 'communityVitality', skillNames: ['Calidez', 'Gratitud'], xp: 10, gold: 5, skillXp: 10, difficulty: 'hard' },
    { name: 'Esperar 2 segundos antes de responder o reaccionar a cualquier comentario', domain: 'psychologicalWellbeing', skillNames: ['Autocontrol'], xp: 10, gold: 5, skillXp: 10, difficulty: 'medium' }
];

const DEFAULT_SKILLS_SETTINGS = {
    skills: [],
    autoDiscovery: true,
    skillPointsPerLevel: 1,
    availableSkillPoints: 0,
    totalSkillsDiscovered: 0
};

const DEFAULT_HABIT_SKILL_SYNC = {
    enabled: true,
    weeklyFolder: '01_Planificacion/02_Semanal',
    xpPerHabit: 10,
    processedTasks: {},
    mappings: {
        'Meditación Metta': 'Meditación',
        '10min meditación FOM y OM': 'Meditación',
        '1 clase de Plazi': 'Learning'
    },
    skillCategories: {
        'Meditación': 'mind',
        'Learning': 'mind'
    }
};

/** AM habit → next Toggl project (school-bell chain). Only morning rituals. */
const DEFAULT_HABIT_TIMER_CHAIN = {
    '30min ejercicio': {
        projectName: 'Meditacion',
        projectId: 207324607,
        description: 'Atom-FOM',
        nextHabitName: '10min meditación FOM y OM'
    },
    '10min meditación FOM y OM': {
        projectName: 'Gratitud',
        projectId: 220114890,
        description: 'diario-principios',
        nextHabitName: 'Escribir 5 agradecimientos propios y vision en tercera persona viendome'
    },
    'Escribir 5 agradecimientos propios y vision en tercera persona viendome': {
        projectName: 'Meditacion',
        projectId: 221239625,
        description: 'Metta',
        nextHabitName: 'Meditación Metta'
    },
    'Meditación Metta': {
        projectName: 'Plazi',
        projectId: 192159466,
        description: 'Perply',
        nextHabitName: '15min Perply'
    },
    '15min Perply': {
        projectName: null,
        projectId: null,
        description: null,
        nextHabitName: null
    }
};

const DEFAULT_TOGGL_WORKSPACE_ID = '5221214';

const SKILL_TREE_SCHOOLS = [
    { id: 'Autoridad', name: 'Autoridad', color: '#f5a623', aliases: ['Poder'] },
    { id: 'Presencia', name: 'Presencia', color: '#27d8ff', aliases: [] },
    { id: 'Calidez', name: 'Calidez', color: '#ff6b8a', aliases: [] }
];

/** Schools that use ornate PNG frames from RpgImages/borders/escuelas/ */
const SKILL_TREE_ORNATE_BORDER_SCHOOLS = ['Autoridad', 'Presencia', 'Calidez'];
const SKILL_TREE_BORDER_ROOT = 'RpgImages/borders/escuelas';
/** Numbered skill ability icons (1.png … N.png) for skill-tree node carousel */
const SKILL_ICONS_FOLDER = 'RpgImages/skills';
const VOWS_IMAGES_FOLDER = 'RpgImages/vows';

/** Seed vow: autocompasión (higanbana grid 5×10). Used only when settings.vows is missing. */
const DEFAULT_SEED_VOWS = [
    {
        id: 'autocompasion',
        title: 'Autocompasión',
        inscription: 'Soy una persona autocompasiva en mis momentos de mayor dolor.',
        imagePath: 'RpgImages/vows/autocompasion_higanbana.png',
        cols: 5,
        rows: 10,
        schools: ['Autoridad', 'Presencia', 'Calidez'],
        xpBonus: 0.2,
        damageBonus: 0.2,
        completedAt: null,
        grains: [
            { id: 'g1', date: '2026-07-12', experience: 'Me abracé en el colegio cuando me sentía solo y me dije: todo pasará, Migue.' },
            { id: 'g2', date: '2026-07-18', experience: 'Hice un chocolate caliente mientras sentía culpa; me cuidé en vez de castigarme.' },
            { id: 'g3', date: '2026-07-22', experience: 'Admití a papá que no trabajé lo suficiente y me sostuve por dentro.' },
            { id: 'g4', date: '2026-07-28', experience: 'Mirando el árbol de Gilberto Alzate: pronto tanta paz como él; no hay algo mal en mí.' },
            { id: 'g5', date: '2026-08-01', experience: 'Cuidé las plantas con el mismo amor que quiero darme.' },
            { id: 'g6', date: '2026-08-03', experience: 'Rechazo en el bus: no me critiqué; quedó una sensación de calma.' },
            { id: 'g7', date: '2026-08-05', experience: 'Me levanté de noche, chocolate + libreta, y me escribí con ternura.' },
            { id: 'g8', date: '2026-08-08', experience: 'Camino por limonadas, nervioso: me motivé y me cuidé en el trayecto.' },
            { id: 'g9', date: '2026-08-09', experience: 'En el sillón, mano en el pecho: "Migue, ¿me permitís decirte algo?"' },
            { id: 'g10', date: '2026-08-10', experience: 'Novia se enojó en el parque; me traté con amabilidad, mano en el pecho bajo el sol.' }
        ]
    }
];

function resolveSkillTreeSchoolId(school) {
    const raw = String(school || '').trim();
    if (!raw) return null;
    const match = SKILL_TREE_SCHOOLS.find(s => s.id === raw)
        || SKILL_TREE_SCHOOLS.find(s => (s.aliases || []).includes(raw));
    return match ? match.id : raw;
}

/**
 * Vault path to ornate border PNG for Autoridad/Presencia/Calidez, or null for other schools.
 * Level 0 → lv1; levels ≥3 → lv3.
 */
function getSkillTreeBorderPath(school, currentLevel) {
    const schoolId = resolveSkillTreeSchoolId(school);
    if (!schoolId || !SKILL_TREE_ORNATE_BORDER_SCHOOLS.includes(schoolId)) {
        return null;
    }
    const levelNum = Number(currentLevel);
    const tier = !levelNum || levelNum < 1 ? 1 : Math.min(3, Math.floor(levelNum));
    return `${SKILL_TREE_BORDER_ROOT}/${schoolId}/lv${tier}.png`;
}

function getSkillTreeBorderTier(currentLevel) {
    const levelNum = Number(currentLevel);
    return !levelNum || levelNum < 1 ? 1 : Math.min(3, Math.floor(levelNum));
}

const BOSS_FRAME_ROOT = 'RpgImages/borders/bosses/frames';
const BOSS_FRAME_STANDARD = `${BOSS_FRAME_ROOT}/frame_063_r6_c6.png`;
const BOSS_FRAME_PRIMORDIAL = `${BOSS_FRAME_ROOT}/frame_047_r5_c0_s1.png`;
const NIVELES_FRAME_ROOT = 'RpgImages/borders/niveles';
const MAX_BOSS_PHASES = 5;
const DEFAULT_BOSS_HP_BAR_COLOR = '#e74c3c';
const DEFAULT_BOSS_CARD_BG_COLOR = '#2d3436';
const DEFAULT_BOSS_HP_BAR_COLOR_PRIMORDIAL = '#9b59b6';
const DEFAULT_BOSS_CARD_BG_COLOR_PRIMORDIAL = '#1a0a2e';
const DEFAULT_BOSS_HP_BAR_COLOR_SOBERANO = '#d4a017';
const DEFAULT_BOSS_CARD_BG_COLOR_SOBERANO = '#2a1a08';

function bossUsesTome(tier) {
    return tier === 'primordial' || tier === 'soberano';
}

function getBossFramePath(tier) {
    return bossUsesTome(tier) ? BOSS_FRAME_PRIMORDIAL : BOSS_FRAME_STANDARD;
}

function createDefaultBossPhase(id, overrides = {}) {
    return {
        id: Number(id) || 1,
        maxHp: overrides.maxHp != null ? Number(overrides.maxHp) : 100,
        framePath: overrides.framePath || '',
        hpBarColor: overrides.hpBarColor || DEFAULT_BOSS_HP_BAR_COLOR,
        cardBgColor: overrides.cardBgColor || DEFAULT_BOSS_CARD_BG_COLOR,
        imagePath: overrides.imagePath != null && overrides.imagePath !== ''
            ? overrides.imagePath
            : null
    };
}

function defaultBossPhaseColors(tier) {
    if (tier === 'soberano') {
        return {
            hpBarColor: DEFAULT_BOSS_HP_BAR_COLOR_SOBERANO,
            cardBgColor: DEFAULT_BOSS_CARD_BG_COLOR_SOBERANO
        };
    }
    if (tier === 'primordial') {
        return {
            hpBarColor: DEFAULT_BOSS_HP_BAR_COLOR_PRIMORDIAL,
            cardBgColor: DEFAULT_BOSS_CARD_BG_COLOR_PRIMORDIAL
        };
    }
    return {
        hpBarColor: DEFAULT_BOSS_HP_BAR_COLOR,
        cardBgColor: DEFAULT_BOSS_CARD_BG_COLOR
    };
}

function normalizeBossPhases(boss, phaseCount = null) {
    const colors = defaultBossPhaseColors(boss?.tier);
    const existing = Array.isArray(boss?.phases) ? boss.phases : [];
    const count = Math.max(
        1,
        Math.min(
            MAX_BOSS_PHASES,
            phaseCount != null ? Number(phaseCount) : (existing.length || 1)
        )
    );
    const phases = [];
    for (let i = 0; i < count; i++) {
        const prev = existing[i] || {};
        const baseMax = i === 0
            ? (prev.maxHp ?? boss?.maxHp ?? 100)
            : (prev.maxHp ?? (boss?.maxHp ?? 100) * (i + 1));
        phases.push(createDefaultBossPhase(i + 1, {
            maxHp: baseMax,
            framePath: prev.framePath || '',
            hpBarColor: prev.hpBarColor || colors.hpBarColor,
            cardBgColor: prev.cardBgColor || colors.cardBgColor,
            imagePath: prev.imagePath ?? null
        }));
    }
    return phases;
}

function getBossPhaseIndex(boss) {
    const phases = Array.isArray(boss?.phases) ? boss.phases : [];
    if (phases.length === 0) return 0;
    const phase = Number(boss.phase) || 1;
    return Math.max(0, Math.min(phases.length - 1, phase - 1));
}

function getActivePhaseConfig(boss) {
    const phases = Array.isArray(boss?.phases) ? boss.phases : [];
    if (phases.length === 0) {
        const colors = defaultBossPhaseColors(boss?.tier);
        return createDefaultBossPhase(1, {
            maxHp: boss?.maxHp ?? 100,
            framePath: '',
            hpBarColor: colors.hpBarColor,
            cardBgColor: colors.cardBgColor,
            imagePath: boss?.imagePath || null
        });
    }
    return phases[getBossPhaseIndex(boss)];
}

function resolveBossFramePath(boss) {
    const phase = getActivePhaseConfig(boss);
    if (phase?.framePath) return phase.framePath;
    return getBossFramePath(boss?.tier);
}

function resolveBossImagePath(boss) {
    const phase = getActivePhaseConfig(boss);
    if (phase?.imagePath) return phase.imagePath;
    return boss?.imagePath || '';
}

function getActiveBossPhaseVisual(boss) {
    const phases = Array.isArray(boss?.phases) ? boss.phases : [];
    const phaseNum = phases.length ? getBossPhaseIndex(boss) + 1 : 1;
    const phaseCount = phases.length || 1;
    const phase = getActivePhaseConfig(boss);
    return {
        phase: phaseNum,
        phaseCount,
        maxHp: phase.maxHp ?? boss?.maxHp ?? 100,
        framePath: resolveBossFramePath(boss),
        imagePath: resolveBossImagePath(boss),
        hpBarColor: phase.hpBarColor || DEFAULT_BOSS_HP_BAR_COLOR,
        cardBgColor: phase.cardBgColor || DEFAULT_BOSS_CARD_BG_COLOR,
        stripedHp: phaseNum >= 2
    };
}

/** List PNG frames under RpgImages/borders/niveles (skips _sources / _ui). */
function listNivelesFramePaths(app) {
    const root = NIVELES_FRAME_ROOT.replace(/\\/g, '/');
    return (app.vault.getFiles() || [])
        .filter(file => {
            const p = file.path.replace(/\\/g, '/');
            if (!p.startsWith(`${root}/`)) return false;
            if (p.includes('/_sources/') || p.includes('/_ui/')) return false;
            return /\.png$/i.test(file.name);
        })
        .map(file => file.path.replace(/\\/g, '/'))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function nivelesFrameLabel(framePath) {
    const root = NIVELES_FRAME_ROOT.replace(/\\/g, '/');
    const p = (framePath || '').replace(/\\/g, '/');
    if (p.startsWith(`${root}/`)) return p.slice(root.length + 1);
    return p.split('/').pop() || p;
}

const SKILL_TREE_NODE_ROLES = {
    standard: { id: 'standard', label: 'Estándar' },
    component: { id: 'component', label: 'Componente' },
    emergent: { id: 'emergent', label: 'Emergente' }
};

const DEFAULT_SKILL_TREE = {
    schools: SKILL_TREE_SCHOOLS.map(school => school.id),
    nodes: [],
    seedCleaned: false
};

const LEGACY_SOMMELIER_NODE_ID = 'node_sommelier_incomodidad';

const SOMMELIER_NODE_ID = 'node_1783916853576_snysp17go';
const PHOBOS_BOSS_ID = '1783917794860';

const BENEVOLENCIA_NODE_ID = 'node_1783924907507_h8pezfu4q';
const EMPATIA_NODE_ID = 'node_1783925025123_9qj0tnoxs';
const KRYOS_BOSS_ID = '1783927787622';
const GUILTMAL_BOSS_ID = '1786983444165';

const SOMMELIER_DESCRIPTION = `Sommelier de la incomodidad — la técnica:

1. Identificar la incomodidad en el cuerpo: ¿qué textura tiene? Como un experto en vinos.

2. Recordar durante el proceso:
- Todo dolor es pasajero; toda emoción, toda sensación.
- Esto te hace crecer y te está fortaleciendo internamente, profundamente.

3. Permanecer con la experiencia al menos 5 min: quédate ahí, no reacciones emocionalmente.

Reglas de postura:
- Prohibición estricta de hablar, reír, juguetear con objetos o desviar la mirada para "liberar" la presión.
- Postura erguida que sostiene la atención el tiempo necesario.

Cierre (tras ~30 s en la exposición):
- "Te amo y te sostengo; esto es una experiencia normal."`;

const DEFAULT_SKILL_TREE_QUEST = {
    id: '',
    name: '',
    description: '',
    xp: 25,
    gold: 10,
    domain: 'communityVitality',
    difficulty: 'medium',
    completed: false,
    completedDate: null,
    kind: 'skill-challenge',
    skillNodeId: '',
    skillLevel: 1,
    school: 'Autoridad',
    linkedBossIds: [],
    bossDamage: 10
};

// Helper to get chat models for a provider
function getChatModels(providerId) {
    return (MODELS_BY_PROVIDER[providerId] || []).filter(m => m.type === 'chat');
}

// Helper to get embedding models for a provider
function getEmbeddingModels(providerId) {
    return (MODELS_BY_PROVIDER[providerId] || []).filter(m => m.type === 'embedding');
}

// Helper to get current API key
function getActiveApiKey(settings) {
    const provider = settings.ai?.provider || 'openrouter';
    return settings.ai?.apiKeys?.[provider] || settings.ai?.openRouterApiKey || '';
}

// Helper to get current chat model
function getActiveChatModel(settings) {
    const provider = settings.ai?.provider || 'openrouter';
    return settings.ai?.selectedModels?.[provider] || settings.ai?.selectedModel || 'gpt-4o-mini';
}

// Helper to get current embedding model
function getActiveEmbeddingModel(settings) {
    const provider = settings.ai?.embeddingProvider || settings.ai?.provider || 'openrouter';
    return settings.ai?.selectedEmbeddingModels?.[provider] || settings.ai?.embeddingModel || 'text-embedding-3-small';
}

// Note: These become global in the built main.js
// No need for module.exports in final build, but kept for IDE support

// ============================================================================
// DEV/DATA/SOMMELIER-CHALLENGES.JS
// ============================================================================

/* Auto-generated */
const SOMMELIER_CHALLENGES = [
  {
    "bankLevel": 1,
    "number": 1,
    "text": "Pedir un descuento del 10% en una tienda de conveniencia sin motivo alguno.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 2,
    "text": "Preguntar la hora a 5 personas desconocidas de forma consecutiva en el mismo lugar.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 3,
    "text": "Solicitar un vaso de agua gratis en una cafetería de marca sin consumir nada.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 4,
    "text": "Pedir permiso para dejar un objeto personal (ej. un libro) en el mostrador de una tienda mientras haces un recado.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 5,
    "text": "Intentar pagar una compra pequeña con un billete de denominación máxima (100 USD/EUR) y pedir cambio.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 6,
    "text": "Preguntar si puedes probarte una prenda que está en el maniquí del escaparate.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 7,
    "text": "Pedir un ingrediente extra gratuito en un puesto de comida rápida después de que el pedido esté cerrado.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 8,
    "text": "Solicitar una muestra gratuita de un producto que claramente no tiene muestras abiertas.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 9,
    "text": "Preguntar por una dirección inexistente a tres personas diferentes.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 10,
    "text": "Pedir usar el teléfono de un local comercial alegando que el tuyo se quedó sin batería.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 11,
    "text": "Solicitar permiso para pasar primero en una fila de supermercado con solo un artículo.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 12,
    "text": "Pedir un café y luego preguntar si pueden hacerlo con un diseño de espuma que no ofrecen.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 13,
    "text": "Preguntar en una farmacia si venden artículos de ferretería pesada.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 14,
    "text": "Pedir prestado un bolígrafo a un extraño y devolverlo a los 3 segundos.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 15,
    "text": "Solicitar un \"reintegro\" de un centavo en una compra redondeada.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 16,
    "text": "Preguntar a un guardia de seguridad si puede cuidar tu mochila 30 segundos mientras te atas los cordones.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 17,
    "text": "Pedir que te cambien un producto en perfecto estado solo porque \"cambiaste de opinión\" un minuto después.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 18,
    "text": "Solicitar un catálogo físico en una tienda que se promociona como 100% digital.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 19,
    "text": "Pedir que te calienten una comida externa en el microondas de un café comercial.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 20,
    "text": "Preguntar si puedes comprar \"media unidad\" de un producto empaquetado (ej. medio paquete de galletas).",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 1,
    "text": "Pedir una recomendación de café detallada y, tras la explicación, rechazarla diciendo: \"No me convence, gracias\".",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 2,
    "text": "Solicitar a un extraño que te tome una foto \"artística\" desde un ángulo muy incómodo o bajo.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 3,
    "text": "Intentar unirse a una conversación ajena en un evento social preguntando educadamente: \"¿De qué hablan?\".",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 4,
    "text": "Comentar algo positivo sobre la vestimenta de un desconocido y sostener la mirada dos segundos tras el cumplido.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 5,
    "text": "Pedir a alguien en la calle que te cuente un chiste porque \"te sientes serio\".",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 6,
    "text": "Solicitar a un dependiente que te explique un producto complejo y marcharte sin mediar compra.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 7,
    "text": "Preguntar a alguien en un parque qué libro lee y por qué decidió comprar ese específicamente.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 8,
    "text": "Pedir permiso para acariciar a un perro cuya dueño parece tener mucha prisa.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 9,
    "text": "Iniciar una conversación sobre el clima en un ascensor lleno y mantener el flujo hasta tu piso.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 10,
    "text": "Pedir a alguien que te guarde el sitio en una fila y tardar deliberadamente 4 minutos en volver.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 11,
    "text": "Solicitar una opinión honesta sobre dos prendas de ropa a un desconocido en una tienda.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 12,
    "text": "Preguntar a un extraño: \"¿Qué es lo más interesante que te ha pasado hoy?\".",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 13,
    "text": "Pedir a un camarero que te sorprenda con una bebida \"inventada\" por él en el momento.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 14,
    "text": "Intentar entablar conversación con alguien que lleva auriculares (pidiendo permiso primero).",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 15,
    "text": "Pedir a un grupo de personas si puedes sentarte a escuchar su charla en una mesa cercana.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 16,
    "text": "Solicitar que te enseñen a usar una aplicación específica en el teléfono a un transeúnte joven.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 17,
    "text": "Preguntar a alguien si cree que \"tu estilo personal encaja\" con la estética del lugar.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 18,
    "text": "Pedir una moneda para el carrito del supermercado a alguien que ya ha guardado su compra.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 19,
    "text": "Solicitar a un músico callejero que toque una canción extremadamente específica que probablemente no sepa.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 20,
    "text": "Saludar y sonreír deliberadamente a cada persona que encuentres en un pasillo estrecho o corredor.",
    "skillLevel": 1
  },
  {
    "bankLevel": 3,
    "number": 1,
    "text": "Pedir prestado un billete pequeño a un desconocido sin dar una explicación de emergencia.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 2,
    "text": "Solicitar un \"tour\" privado por la cocina de un restaurante sin ser un cliente habitual.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 3,
    "text": "Pedir permiso para sentarte en una mesa ya ocupada por una sola persona en una cafetería llena.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 4,
    "text": "Preguntar en la recepción de un hotel de lujo si puedes usar su piscina gratis \"solo por hoy\".",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 5,
    "text": "Solicitar a un extraño que te ceda su asiento en el transporte público sin tener una necesidad física obvia.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 6,
    "text": "Pedir en una biblioteca que te permitan llevarte un libro de la sección de \"solo consulta\".",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 7,
    "text": "Intentar negociar el precio de un plato específico en un restaurante de menú fijo.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 8,
    "text": "Pedir a un vecino con el que no hablas que te preste un objeto de valor (ej. una herramienta eléctrica).",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 9,
    "text": "Intentar entrar a una charla, evento de networking o fiesta privada sin tener la invitación.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 10,
    "text": "Pedir a un desconocido que te compre un café o un snack \"porque tienes curiosidad de si lo haría\".",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 11,
    "text": "Solicitar en un cine que te dejen entrar gratis a ver los últimos 15 minutos de una película.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 12,
    "text": "Pedir permiso para cargar tu teléfono en un enchufe que está detrás del mostrador de un banco o bar.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 13,
    "text": "Preguntar a un conferencista, al terminar su charla, si puedes subir al escenario a tomarte una foto con el micrófono.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 14,
    "text": "Pedir a un taxista un descuento del 20% antes de subir al vehículo.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 15,
    "text": "Solicitar probar un bocado de la comida de un desconocido (en un patio de comidas relajado).",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 16,
    "text": "Pedir en una tienda que te reserven una prenda por 10 días sin dejar ningún depósito de dinero.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 17,
    "text": "Preguntar en una ventanilla bancaria si pueden mostrarte fajos de billetes de alta denominación \"para ver cómo huelen\".",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 18,
    "text": "Solicitar a un desconocido que te ayude a cargar una bolsa durante tres manzanas completas.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 19,
    "text": "Pedir en un museo o galería permiso para tocar una obra que no tiene protección de cristal.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 20,
    "text": "Intentar devolver un artículo usado y sin etiquetas en una tienda, argumentando que \"ya no te define\".",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 1,
    "text": "Pedir hablar con el gerente para elogiar un detalle insignificante de forma muy insistente y formal.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 2,
    "text": "Proponer un brindis espontáneo por \"el coraje de estar vivos\" en un restaurante concurrido.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 3,
    "text": "Llamar a una suscripción activa y pedir un descuento del 50% \"porque eres un cliente leal y el mundo es caro\".",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 4,
    "text": "Entrar en una oficina ajena y pedir permiso para usar su impresora para un documento personal.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 5,
    "text": "Solicitar a un grupo de personas en la calle que se detengan y canten una estrofa de una canción contigo.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 6,
    "text": "En una charla pública, pedir el micrófono para compartir una reflexión personal de 2 minutos (no una pregunta).",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 7,
    "text": "Intentar entrar a una zona VIP o restringida de un evento actuando con total autoridad y \"asumiendo\" el paso.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 8,
    "text": "Pedir a un oficial de seguridad o policía si puedes \"sostener su gorra\" para una foto rápida.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 9,
    "text": "Solicitar en un restaurante de alta demanda una mesa que tiene el cartel de \"Reservado\", asumiendo que pueden moverla.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 10,
    "text": "Pedir a un jefe o figura de autoridad que te explique un concepto simple por cuarta vez consecutiva.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 11,
    "text": "Solicitar permiso para hacer una encuesta personal de 5 minutos a un grupo que está almorzando.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 12,
    "text": "Pedir un reembolso por un café que ya te terminaste, alegando que \"el sabor no coincidió con tu estado de ánimo\".",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 13,
    "text": "Proponer una colaboración comercial audaz (y casi absurda) a un directivo de alto nivel por LinkedIn o en persona.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 14,
    "text": "Pedir en el mostrador de un aeropuerto un upgrade a primera clase \"porque es un gran día para ser generosos\".",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 15,
    "text": "Solicitar a un conductor de autobús o transporte que haga una parada no oficial en la puerta de tu destino.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 16,
    "text": "Pedir a un DJ en un evento que cambie el género musical actual por uno opuesto (ej. de tecno a bolero).",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 17,
    "text": "Solicitar en una oficina de servicios si puedes pagar un trámite \"mañana\", dejando tu palabra como garantía.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 18,
    "text": "Pedir permiso para dar un \"discurso de motivación\" de 1 minuto en el pasillo de un vagón de metro.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 19,
    "text": "Intentar pagar una cuenta con una tarjeta que sabes que será denegada y liderar la negociación de la solución sin perder la calma.",
    "skillLevel": 2
  },
  {
    "bankLevel": 4,
    "number": 20,
    "text": "Pedir a un extraño que te entreviste durante 10 minutos sobre tus metas de vida, grabando la interacción.",
    "skillLevel": 2
  },
  {
    "bankLevel": 5,
    "number": 1,
    "text": "Pedir permiso en una plaza pública para anunciar un mensaje personal por un megáfono durante 2 minutos.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 2,
    "text": "Intentar negociar el precio de un artículo de lujo (reloj, joyería) de forma audaz y persistente, ofreciendo pagos inusuales.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 3,
    "text": "Declarar una opinión impopular pero respetuosa en un foro público y sostenerla con calma ante la crítica masiva.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 4,
    "text": "Pedir permiso al dueño de un local para pintar una pequeña marca artística temporal en su fachada.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 5,
    "text": "Solicitar a un extraño que te deje pasar la noche en su sofá argumentando que \"estás documentando la hospitalidad humana\".",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 6,
    "text": "Pedir en un centro comunitario o iglesia dar una charla de 5 minutos sobre la importancia de fracasar.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 7,
    "text": "Intentar vender un objeto de poco valor (ej. un clip) por un precio exorbitante (100 USD) explicando su \"historia emocional\".",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 8,
    "text": "Pedir a un medio de comunicación local que te haga una entrevista breve sin tener una noticia, solo por \"ser tú\".",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 9,
    "text": "Solicitar a una figura pública (vía redes o en persona) que sea tu mentor personal de forma gratuita.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 10,
    "text": "Organizar un baile improvisado (flashmob de una sola persona) en el centro de un centro comercial.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 11,
    "text": "Intentar entrar a trabajar en una empresa por un día como \"pasante espontáneo\" sin cita previa ni currículum.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 12,
    "text": "Pedir a un desconocido que intercambie una prenda de ropa que lleva puesta (ej. chaqueta) por la tuya.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 13,
    "text": "Solicitar un préstamo de dinero significativo (1,000+) a un contacto de networking reciente bajo palabra de honor.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 14,
    "text": "Pedir permiso para \"dirigir\" el tráfico peatonal o una fila en un evento de forma lúdica.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 15,
    "text": "Declarar efusivamente tu \"gratitud por existir\" a desconocidos en la calle y observar su incomodidad sin retirarte.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 16,
    "text": "Pedir una reunión con el director de un banco para proponerle una idea de inversión basada en \"sueños\" y no en activos.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 17,
    "text": "Solicitar a un extraño que te preste las llaves de su coche solo para sentarte 1 minuto y \"sentir el motor\".",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 18,
    "text": "Intentar negociar el alquiler de tu vivienda actual a la mitad del precio con el propietario, manteniendo la postura.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 19,
    "text": "Pedir permiso para dormir una siesta de 15 minutos en un colchón de exhibición en una tienda de muebles de alta gama.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 20,
    "text": "El Funeral de Identidad: Organizar un evento público o reunión donde pidas a conocidos y extraños que critiquen tus mayores defectos, mientras tú escuchas con amabilidad y compasión sin defenderte.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 21,
    "text": "Ve a un café o restaurante de lujo con tu ropa más vieja y pide una mesa premium con total confianza.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 22,
    "text": "Si el anfitrión juzga tu ropa, míralo con calma y di: \"Mi atuendo no altera el valor de mi dinero. Mesa para uno.\"",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 23,
    "text": "Pide ketchup comercial barato como acompañamiento de un plato premium en un restaurante de lujo.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 24,
    "text": "Durante una entrevista de trabajo o negociación laboral, pide una cifra salarial que sea exactamente un 40% más alta de lo esperado, y quédate en silencio absoluto inmediatamente después de decir el número.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 25,
    "text": "Si se ríen de tu salario, no bajes el precio ni pidas perdón. Di: \"Ese es el costo de mi enfoque absoluto.\"",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 26,
    "text": "Llama en frío al director de RR.HH. de una empresa que deseas y pide una entrevista de 10 minutos sin cita.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 27,
    "text": "Entra a una oficina corporativa de alto nivel sin cita y pide hablar con el CEO por una consulta personal.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 28,
    "text": "En una entrevista, cuando pregunten tu mayor debilidad, di tu falla profesional más profunda sin convertirla en virtud.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 29,
    "text": "Pide a un mentor una reseña escrita brutal y sin filtros de tus defectos.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 30,
    "text": "Mira a un cliente o empleador y di: \"Soy la opción más cara, pero también la que menos preocupaciones te dará.\"",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 31,
    "text": "Ve a un intercambio de idiomas e interactúa 15 minutos con un acento extranjero inventado y absurdo.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 32,
    "text": "Acércate a una extranjera atractiva en un bar y dile en inglés básico: \"Mi inglés es muy malo, pero quiero hablar contigo.\"",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 33,
    "text": "Si no encuentras una palabra en inglés, no rías, no gesticules ni uses español; sostén el silencio hasta encontrarla.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 34,
    "text": "Ve a un karaoke completamente solo, súbete al escenario y pide una canción que no conozcas. Cántala en serio sin hacer comedia.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 35,
    "text": "Tras un karaoke terrible, mira a la multitud y di al micrófono: \"Ese fue el primer single de mi álbum de arte crudo.\"",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 36,
    "text": "Pide a un angloparlante traducir una frase romántica intensa para usarla después.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 37,
    "text": "Mantén una conversación compleja de 10 minutos en inglés usando la app de traducción solo una vez.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 38,
    "text": "Ve a un evento de networking de alto nivel con joggers casuales y preséntate como consultor independiente.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 39,
    "text": "Pide a un reclutador que te rechazó una llamada de \"entrevista de salida\" detallando por qué no fuiste suficiente.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 40,
    "text": "Dile a una angloparlante atractiva: \"Mi gramática es terrible, pero mi intención de conocerte es clara.\"",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 41,
    "text": "Intenta comprar un servicio premium y pregunta si puedes pagar con trueque o intercambio de servicios.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 42,
    "text": "Ve a un bar exclusivo de extranjeros, identifica a la persona más atractiva y acércate a hablarle en inglés, sosteniendo la interacción con tu nivel actual.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 43,
    "text": "Durante esa conversación intensa en inglés, dile con calma que estás ejecutando un experimento neurobiológico de rechazo.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 44,
    "text": "Pide feedback directo en inglés sobre cómo manejaste la tensión social del momento.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 45,
    "text": "Únete a un grupo de expats hablando de política global en inglés sin disculparte por tu acento.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 46,
    "text": "Entra a una oficina corporativa, pide al gerente y solicita que expliquen cara a cara por qué sus valores coinciden con tu estándar.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 47,
    "text": "Pide sentarte en una reunión interna privada de estrategia solo para observar la cultura corporativa.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 48,
    "text": "Di a un socio potencial: \"Busco una plataforma que me desafíe; quiero ver si pueden con mi ambición.\"",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 49,
    "text": "Pide a un profesional de alto estatus una hora semanal gratis como mentor de carrera.",
    "skillLevel": 3
  },
  {
    "bankLevel": 5,
    "number": 50,
    "text": "Sube a una silla en la plaza o venue más concurrida, declara en voz seria que \"el miedo es una ilusión\" e invita a una cita a quien te mire.",
    "skillLevel": 3
  }
];

// ============================================================================
// DEV/DATA/BENEVOLENCIA-CHALLENGES.JS
// ============================================================================

/* Auto-generated by dev/scripts/generate-benevolencia-data.js */
const BENEVOLENCIA_CHALLENGES = [
  {
    "bankLevel": 1,
    "number": 1,
    "globalNumber": 1,
    "title": "The Commuter Matrix",
    "text": "[The Commuter Matrix] On a bus or train, select 3 tired strangers. Visualize them as warm energy fields. If your chest feels entirely blank or hollow, **stop trying to force it: use the Sommelier Scan to locate the boundaries of that hollow space for 10 seconds** while applying the Neutral Bridge: _\"We are biological entities navigating this city, just like me.\"_",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 2,
    "globalNumber": 2,
    "title": "The Coffee Line Blueprint",
    "text": "[The Coffee Line Blueprint] While waiting in a commercial queue, lock your gaze onto the person in front of you. Project a warm field of acceptance onto them. **If your stomach tightens or goes numb, audit that exact cold sensation without judgment.** Ask yourself: _\"What unvarnished posture from me brings the most love into this line?\"_",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 3,
    "globalNumber": 3,
    "title": "The Crosswalk Blink",
    "text": "[The Crosswalk Blink] Lock eyes with a stranger walking past you for a split second and mentally send them a blessing: _\"May you feel completely accepted today.\"_ **If your inner monologue feels mechanical or robotic, taste that specific emotional flatline like a sommelier** while continuing to walk with a steady, open gaze.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 4,
    "globalNumber": 4,
    "title": "The Driver’s Vow",
    "text": "[The Driver’s Vow] Observe an aggressive, honking driver. See them as a warm energy entity trapped in stress. **If you feel immediate cold apathy or irritation, track exactly where that defense sits in your throat or chest.** Ask yourself: _\"What un-joking calm can I project to neutralize this friction?\"_",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 5,
    "globalNumber": 5,
    "title": "The Laborer Scan",
    "text": "[The Laborer Scan] Pass a street vendor or cleaner. Visualize their storefront as a warm, welcoming space and wish their business well. **If your heart feels like a heavy stone, place your cognitive attention directly on that stone's weight for 10 full seconds, accepting its presence.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 6,
    "globalNumber": 6,
    "title": "The Phone Mirror Reframe",
    "text": "[The Phone Mirror Reframe] Find someone sitting alone looking anxiously at their phone. Think: _\"You are seeking connection, just like me.\"_ **If you experience a wall of cold indifference, scan your body to find where that emotional armor is physically locking up.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 7,
    "globalNumber": 7,
    "title": "The Courier Vow",
    "text": "[The Courier Vow] Follow a delivery courier with your eyes for 3 seconds, seeing them as a safe bullet of warm energy. **If you feel entirely disconnected, map the exact somatic numbness in your body, naming it clinically:** _\"Ah, Kryos is here protecting me from feeling. I accept this winter.\"_",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 8,
    "globalNumber": 8,
    "title": "The Public Elder Acknowledgment",
    "text": "[The Public Elder Acknowledgment] Look at an elderly person walking slowly. Visualize them as a deep repository of warm, accepting life force. **If you find your mind wandering or feeling cold, anchor your attention on the raw tightness in your chest, letting the ice rest.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 9,
    "globalNumber": 9,
    "title": "The Fitness Track Projection",
    "text": "[The Fitness Track Projection] Watch someone struggling while exercising. Project an internal shout of encouragement: _\"I respect your effort to care for yourself.\"_ **If you feel a sense of cold judgment or empty detachment, sommelier-test that exact feeling without a single trace of shame.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 10,
    "globalNumber": 10,
    "title": "The Environmental Threshold",
    "text": "[The Environmental Threshold] Before walking into a busy library or bookstore, pause at the door. Ask yourself: **\"Of all the options I have right now, which specific action would bring the absolute most love into this world?\"** **If your mind responds with a heavy, frozen blankness, stand perfectly still and inhabit that void.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 11,
    "globalNumber": 11,
    "title": "The Rainy Day Shield",
    "text": "[The Rainy Day Shield] On a gray or depressing day, look at 5 pedestrians. Project a mental field of warm sunshine over them. **If your internal landscape matches the gray weather outside, trace the precise boundaries of that cold apathy across your ribs.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 12,
    "globalNumber": 12,
    "title": "The Tourist Perspective",
    "text": "[The Tourist Perspective] Spot someone who looks lost. Visualize them as a warm traveler seeking safety. **If your emotional state remains totally numb, hold your prefrontal intent anyway, while observing the hollow sensation in your throat.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 13,
    "globalNumber": 13,
    "title": "The Early Morning Worker",
    "text": "[The Early Morning Worker] At dawn, look at a street sweeper or vendor. See them as a vital pillar of morning energy. **If you feel an icy lack of motivation, track the exact physical weight of that exhaustion in your stomach.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 14,
    "globalNumber": 14,
    "title": "The Late Night Transit Scan",
    "text": "[The Late Night Transit Scan] On a late-night ride, look at people traveling home. Wish them a restful sleep. **If your system feels completely numb and mechanical, perform an interoceptive scan to identify the exact texture of your body's defensive shutdown.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 15,
    "globalNumber": 15,
    "title": "The Institutional Reframe",
    "text": "[The Institutional Reframe] Walk into a sterile, cold corporate or bank lobby. Mentally fill the room with a warm, golden aura. **If the institutional coldness freezes your own chest, become a sommelier of that specific freeze, letting it exist without needing to thaw it.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 16,
    "globalNumber": 16,
    "title": "The Park Bench Alignment",
    "text": "[The Park Bench Alignment] Sit next to a stranger in absolute silence. Visualize them as a warm, accepting neighbor. **If a wave of anxious mental static or cold distance takes over, lock your attention on the physical weight of your feet flat on the ground.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 17,
    "globalNumber": 17,
    "title": "The Overthinking Student",
    "text": "[The Overthinking Student] Spot a student looking heavily stressed over a laptop. Wish them absolute clarity and ease. **If your brain responds with an empty, mechanical void, hold that silent emptiness with total presence, dropping all judgment.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 18,
    "globalNumber": 18,
    "title": "The Parent-Child Tantrum Pivot",
    "text": "[The Parent-Child Tantrum Pivot] Observe a parent dealing with a child throwing a tantrum. Visualize both enveloped in a patient, warm energy shield. **If your nervous system responds with cold irritation, map where that stress physically constricts your breathing.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 19,
    "globalNumber": 19,
    "title": "The Crosswalk Wave",
    "text": "[The Crosswalk Wave] Wait at a crosswalk, seeing the people opposite you as a wave of warm, accepting human energy. **If you feel frozen or exposed, place your physical hand over your sternum, tracing the coldness beneath your palm.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 20,
    "globalNumber": 20,
    "title": "The High-Density Walk",
    "text": "[The High-Density Walk] Walk through a dense, chaotic shopping street, viewing the crowd as a fluid matrix of warm energy. **If your system enters a state of total, defensive emotional numbness, accept that anesthesia as a successful shield of Kryos.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 1,
    "globalNumber": 21,
    "title": "The Cashier Anchoring",
    "text": "[The Cashier Anchoring] Approach a busy cashier. Visualize them as a warm human matrix, look them in the eye calmly (no nervous smile), and say: _\"Thank you for your patience today, I see how hard you are managing this line.\"_ **If your voice feels tight or cold, track that exact throat constriction while you speak.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 2,
    "globalNumber": 22,
    "title": "The Gatekeeper Alignment",
    "text": "[The Gatekeeper Alignment] Give a stern building bouncer a serious, respectful nod, visualizing them as a wall of protective, warm energy. **If you feel an icy block of intimidation, sommelier-scan your chest to find where that fear is trying to hide.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 3,
    "globalNumber": 23,
    "title": "The Luxury Host Valuation",
    "text": "[The Luxury Host Valuation] Enter a high-end luxury hotel lobby. Visualize the host stripped of their elite uniform, appearing as a warm, welcoming presence. **If the elegant environment makes you feel cold or out of place, inhabit that exact friction with perfect posture.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 4,
    "globalNumber": 24,
    "title": "The Bureaucrat Break",
    "text": "[The Bureaucrat Break] When dealing with a slow customer service agent, visualize them as a warm mind trapped in a tedious system. Ask yourself: _\"What words can I use right now to bring the most love into this space?\"_ **If your inner core feels flat and uncaring, deliver the kind words anyway as a pure command of your prefrontal cortex.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 5,
    "globalNumber": 25,
    "title": "The Keynote Speaker Shield",
    "text": "[The Keynote Speaker Shield] Look at a speaker on stage, visualizing them as a warm energy source attempting to share value. **If you feel an icy urge to criticize their performance to boost your own ego, scan the physical root of that insecurity in your stomach.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 6,
    "globalNumber": 26,
    "title": "The Public Server Elevation",
    "text": "[The Public Server Elevation] Look a waiter directly in the face and deliver a serious, un-joking piece of value: _\"Thank you for taking such good care of our table, it makes a huge difference.\"_ **If your body feels entirely hollow as you say it, track that empty sensation without breaking eye contact.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 7,
    "globalNumber": 27,
    "title": "The Interviewer Equalizer",
    "text": "[The Interviewer Equalizer] Look at a high-level manager or potential interviewer. Visualize them as a warm, accepting human soul. **If your mind freezes into a cold panic, turn your attention fully to the physical sensation of your hands resting flat on your lap.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 8,
    "globalNumber": 28,
    "title": "The Cleaner Acknowledgment",
    "text": "[The Cleaner Acknowledgment] Look a janitor or busboy in the eyes with absolute equality and say firmly: _\"Thank you for keeping this space beautiful for the rest of us.\"_ **If your voice sounds mechanical and dry, taste that lack of emotional peace without judging your progress.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 9,
    "globalNumber": 29,
    "title": "The Local Merchant Connection",
    "text": "[The Local Merchant Connection] Pay a neighborhood shop owner, see them as a warm pillar of community energy, and state sincerely: _\"I love the energy of your shop, thank you for being a part of this neighborhood.\"_ **If you feel zero connection, scan the exact physical density of that emotional block.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 10,
    "globalNumber": 30,
    "title": "The Direct Value Drop",
    "text": "[The Direct Value Drop] Look a retail worker seriously in the eye and say: _\"Your guidance was incredibly precise, you just saved me 20 minutes of searching. Thank you.\"_ **Walk away instantly. If your brain panics and demands validation (a smile or thank you), observe that craving without feeding it.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 11,
    "globalNumber": 31,
    "title": "The Delivery Driver Hand-Off",
    "text": "[The Delivery Driver Hand-Off] Look an app delivery driver in the eye and say: _\"Thank you for making the trip, have a safe and peaceful shift tonight.\"_ **If you feel an icy wave of transactional indifference, sommelier-scan your chest to find where you are blocking human connection.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 12,
    "globalNumber": 32,
    "title": "The Healthcare Humanization",
    "text": "[The Healthcare Humanization] Look at workers behind a pharmacy counter dealing with frustrated people. Visualize them as icons of warm, healing energy. **If your system is completely numb, apply the Neutral Bridge factual script: _\"They have nervous systems experiencing stress just like mine.\"_**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 13,
    "globalNumber": 33,
    "title": "The Tech Support Humanization",
    "text": "[The Tech Support Humanization] Type to a chat support agent: _\"Thank you for taking the time to solve this with me, I appreciate your focus.\"_ **As you hit send, if your internal landscape feels completely frozen, notice the contrast between your kind digital words and your icy somatic reality.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 14,
    "globalNumber": 34,
    "title": "The Parking Attendant Elevation",
    "text": "[The Parking Attendant Elevation] Hand your keys to an attendant and say: _\"Thank you for watching over my vehicle, I appreciate your work.\"_ **If your inner monologue whispers that this is fake because you don't \"feel\" it, identify that whisper as Kryos's defense mechanism and let it fade.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 15,
    "globalNumber": 35,
    "title": "The Barista Flavor Praise",
    "text": "[The Barista Flavor Praise] Walk back to a barista during a quiet moment, look at them seriously, and say: _\"The balance of this drink is absolutely perfect, thank you for crafting it.\"_ **If your throat constricts from anxiety, hold your gaze steady and speak through the tightness.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 16,
    "globalNumber": 36,
    "title": "The App Driver Rating Commentary",
    "text": "[The App Driver Rating Commentary] Write a highly specific, benevolent piece of feedback in an Uber rating box. **As you type, if your mind feels entirely flat, map the physical location of that emotional numbness behind your ribs.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 17,
    "globalNumber": 37,
    "title": "The Receptionist Buffer",
    "text": "[The Receptionist Buffer] Walk up to a chaotic corporate front desk. Visualize the receptionist as a warm, stabilizing center of energy. **If your brain goes into a cold, hyper-vigilant panic, breathe out slowly, extending your exhale to drop your heart rate.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 18,
    "globalNumber": 38,
    "title": "The Content Creator Validation",
    "text": "[The Content Creator Validation] Send an independent artist a serious message breaking down how their perspective brought value to your life. **After sending it, if your system feels hollow, track that exact physical emptiness without seeking a digital reply.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 19,
    "globalNumber": 39,
    "title": "The Public Speaker Exit",
    "text": "[The Public Speaker Exit] Approach a speaker after an event, see them as a warm mentor, and state calmly: _\"The way you framed X concept was deeply insightful, thank you for sharing that today.\"_ **If your inner core feels like pure ice, accept that you are executing high-status willpower.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 20,
    "globalNumber": 40,
    "title": "The High-Status Attire Inversion",
    "text": "[The High-Status Attire Inversion] Ask intimidating luxury store sales associates for advice with absolute, un-joking softness. **If their polished appearance triggers an icy wave of inadequacy, sommelier-scan the exact somatic location of that shame.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 1,
    "globalNumber": 41,
    "title": "The Isolated Member Extraction",
    "text": "[The Isolated Member Extraction] Enter a group social setting. Ask yourself: **\"Of all the people here, who needs safety right now? What action would bring the most love into this room?\"** Locate the most isolated person, visualize them as a warm presence, and initiate a conversation. **If your mind goes completely numb, hold the physical space with them in silence.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 2,
    "globalNumber": 42,
    "title": "The Overlooked Member Pivot",
    "text": "[The Overlooked Member Pivot] Interject calmly in a loud group, look directly at an ignored member, and say: _\"Wait, I want to hear the rest of what you were saying, please continue.\"_ **If your heart races while your emotional core feels completely frozen, taste that exact split-state of panic and numbness.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 3,
    "globalNumber": 43,
    "title": "The Blind Attraction Wish",
    "text": "[The Blind Attraction Wish] Identify the most intimidatingly beautiful woman in a room. Visualize her presence as a warm, deeply accepting energy matrix. Ask yourself: _\"What words would come from a place of pure, unselfish love rather than a desire to conquer?\"_ **If an icy wall of unmanly shame locks your chest, observe its raw physical texture.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 4,
    "globalNumber": 44,
    "title": "The Direct Intention Statement",
    "text": "[The Direct Intention Statement] Walk up to someone highly intimidating in a social room, look at them with a calm, steady gaze, and state plainly: _\"My only goal in coming over is to leave you with a genuine bit of positive energy before I head out.\"_ **Do not smile nervously. Sit in the heavy silence that follows, tracking the coldness.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 5,
    "globalNumber": 45,
    "title": "The Public Blunder Protection",
    "text": "[The Public Blunder Protection] When someone suffers an embarrassing social blunder, look at them immediately, visualize them enveloped in a warm, protective energy shield, and give them a steady, calm nod. **If your system responds with a cold, protective desire to laugh or look away, hold your soft gaze steady.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 6,
    "globalNumber": 46,
    "title": "The Conflict Diffusion",
    "text": "[The Conflict Diffusion] If two people start to argue in a group, hold a calm posture and ask your mind: **\"What energy can I hold right now that would bring the most love into this space?\"** **If your system locks into a cold, frozen panic, turn your attention entirely to the physical sensation of your deep belly breathing.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 7,
    "globalNumber": 47,
    "title": "The Language Support Test",
    "text": "[The Language Support Test] Find a foreigner struggling to speak your language. Look at them with absolute patience, visualize them as a warm mind behind a language barrier, and say gently: _\"Take your time, your message is fully coming through.\"_ **If your inner core feels entirely empty, hold the supportive space with absolute stillness.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 8,
    "globalNumber": 48,
    "title": "The Ghost of Rejection Blessing",
    "text": "[The Ghost of Rejection Blessing] Walk past a location where you once experienced a painful social rejection. Look at the spot, visualize your past self and the person who rejected you as two warm energies doing their best, and think: _\"I leave nothing but peace and love in this space.\"_ **If the memory brings a wave of internal ice, sommelier-scan its depth.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 9,
    "globalNumber": 49,
    "title": "The High-Exposure Truth Test",
    "text": "[The High-Exposure Truth Test] When asked how you are doing during a heavy week, drop the performance mask. Look them in the eye and say calmly: _\"I'm navigating some complex internal challenges right now, but I am handling it with patience and kindness.\"_ **Sustain the vulnerability of the statement while tracking the cold void in your chest.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 10,
    "globalNumber": 50,
    "title": "The Rival / Competitor Reframe",
    "text": "[The Rival / Competitor Reframe] Look at someone who triggers your envy, visualize them as a warm, brilliant light, and project an internal wish: _\"May your talent be fully recognized, and may your path be successful.\"_ **If a thick sheet of cold resentment blocks the thought, scan its physical density in your stomach.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 11,
    "globalNumber": 51,
    "title": "The Unbuffered Listening Test",
    "text": "[The Unbuffered Listening Test] Listen to a friend venting for 10 straight minutes **without offering advice, making a joke, or turning the story back to yourself.** Just hold the space. **If you feel entirely cold and bored, locate where that defensive apathy is trying to numb your capacity to care.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 12,
    "globalNumber": 52,
    "title": "The Raw Gratitude Confrontation",
    "text": "[The Raw Gratitude Confrontation] Look someone who stood by you dead in the eye, drop all jokes, and say seriously: _\"When you did X for me, you made me feel completely safe when I was entirely lost. I am deeply grateful for your presence.\"_ **If your body feels entirely hollow as you say it, hold the gaze and let the vulnerability breathe.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 13,
    "globalNumber": 53,
    "title": "The Metta Projection to the Critic",
    "text": "[The Metta Projection to the Critic] Bring the face of a harsh past critic to your mind, force your imagination to see them as a wounded child wrapped in a warm light, and say out loud: _\"I wish you genuine peace and freedom from whatever pain made you cruel.\"_ **If an intense, icy hatred locks your throat, map its physical constriction.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 14,
    "globalNumber": 54,
    "title": "The Group Silence Endurance",
    "text": "[The Group Silence Endurance] When an incredibly heavy, uncomfortable silence falls over a group circle, do not rescue it with a joke or performance. Ask yourself: _\"How can my calm, silent posture bring the most love right now?\"_ **Hold your ground with a completely serious, un-smiling face, letting the internal ice float.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 15,
    "globalNumber": 55,
    "title": "The Vulnerable Feedback Solicitation",
    "text": "[The Vulnerable Feedback Solicitation] Ask a trusted colleague: _\"What is one blind spot or defensive trait I have that limits my capacity to connect with people? I promise to just listen with gratitude.\"_ **As they give you their raw feedback, if an icy wall of defensiveness locks your body, sommelier-audit its texture.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 16,
    "globalNumber": 56,
    "title": "The Street-Hustler Engagement",
    "text": "[The Street-Hustler Engagement] Look directly into the eyes of an aggressive street hustler, visualize them as a warm human soul stripped of their desperate circumstances, and deliver a calm, serious, and respectful: _\"I cannot give you anything today, but I genuinely see you and I wish you a safe and better night.\"_ **Sustain the interaction without a single trace of nervous evasion.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 17,
    "globalNumber": 57,
    "title": "The Intimidating Group Approach",
    "text": "[The Intimidating Group Approach] Walk up to an elegant group of strangers, visualize them as a warm, welcoming hearth of energy, and say with absolute softness: _\"I noticed your group's incredible presence from across the room, and I just wanted to wish you an excellent evening.\"_ **Walk away instantly, tracking the cold void left in your chest.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 18,
    "globalNumber": 58,
    "title": "The Dynamic Rejection Intercept",
    "text": "[The Dynamic Rejection Intercept] If you make a direct request and receive a flat, painful \"No,\" look at them, see them as a warm, autonomous entity exercising their right to choose, and say calmly: _\"Thank you for your honesty, I deeply respect clarity. Have a beautiful evening.\"_ **Do not hide behind a smile; absorb the sting completely.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 19,
    "globalNumber": 59,
    "title": "The Group Toast of Sincerity",
    "text": "[The Group Toast of Sincerity] Raise your glass with acquaintances, stop the laughter, drop the comedic shield, and deliver a serious toast: _\"I am deeply grateful to share this table and this specific time in life with all of you. To your health and happiness.\"_ **Own your serious, warm presence while tracking any internal ice.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 20,
    "globalNumber": 60,
    "title": "The Sovereign Beacon",
    "text": "[The Sovereign Beacon] Walk into the most high-status, intensely critical environment you can find. Do not look for approval. Settle your breathing, stand completely still, and **visualize the entire room—every critical eye and strict host—as a massive, interconnected matrix of warm, accepting human energy.** Ask yourself: **\"How can my pure, unbothered presence bring the absolute most love and grounded safety into this room right now?\"** Stand as the absolute anchor of that reality, completely validating whatever internal ice Kryos throws at you.",
    "skillLevel": 3
  }
];

// ============================================================================
// DEV/DATA/EMPATIA-CHALLENGES.JS
// ============================================================================

/* Auto-generated by dev/scripts/generate-empatia-data.js */
const EMPATIA_CHALLENGES = [
  {
    "bankLevel": 1,
    "number": 1,
    "globalNumber": 1,
    "title": "El Filtro del Cajero",
    "text": "[El Filtro del Cajero] Analiza las manos del cajero mientras cobra. Responde: _¿Cómo se siente? ¿3 cosas por las que pasa? ¿Y si es su último día?_\n\nTSN: Si sientes prisa, di en tu mente: _\"Estoy teniendo el pensamiento de que esto es lento\"_. Localiza la impaciencia en tus hombros por 5 segundos.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 2,
    "globalNumber": 2,
    "title": "La Silueta de la Parada",
    "text": "[La Silueta de la Parada] Mira a alguien esperando el autobús de forma inmóvil. Decodifica su postura corporal con el protocolo de las 3 preguntas.\n\nTSN: Si sientes apatía, di: _\"Noto la presencia de un vacío en mi pecho\"_. No lo fuerces, solo mide su tamaño.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 3,
    "globalNumber": 3,
    "title": "El Pasajero Dormido",
    "text": "[El Pasajero Dormido] Observa a alguien cabeceando de sueño en el tren. Aplica las 3 preguntas deduciendo su nivel de fatiga acumulada.\n\nTSN: Si te da igual, di: _\"Hola, aburrimiento\"_ y pon tu atención en el peso físico de tus párpados durante 3 respiraciones.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 4,
    "globalNumber": 4,
    "title": "El Rostro del Andén",
    "text": "[El Rostro del Andén] Enfoca a una persona que mira fijamente las vías del metro. Ejecuta el protocolo completo para descifrar su estado.\n\nTSN: Si tu mente divaga, di: _\"Mente dispersa regresando\"_ y ancla la planta de tus pies firmemente contra el suelo.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 5,
    "globalNumber": 5,
    "title": "La Fila Silenciosa",
    "text": "[La Fila Silenciosa] Elige a quien está delante de ti en la fila del banco. Visualiza las últimas 24 horas de esa vida usando las 3 preguntas.\n\nTSN: Si te irrita la espera, di: _\"Mi estómago se está apretando por la prisa\"_. Observa la tensión sin juzgarla.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 6,
    "globalNumber": 6,
    "title": "El Copiloto Ausente",
    "text": "[El Copiloto Ausente] Mira al acompañante de un auto detenido en el tráfico. Define su estado emocional exacto con las 3 preguntas.\n\nTSN: Si piensas en tus propios problemas, di: _\"Pensamientos autorreferenciales detectados\"_ y vuelve a mirar el rostro del extraño.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 7,
    "globalNumber": 7,
    "title": "El Caminante Apurado",
    "text": "[El Caminante Apurado] Sigue con la mirada a alguien que camina rápido. Desmenuza sus 3 urgencias hipotéticas en silencio.\n\nTSN: Si sientes desinterés, di: _\"Esto es desconexión médica, la acepto\"_. Saborea esa planicie emocional por 10 segundos.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 8,
    "globalNumber": 8,
    "title": "La Sombra del Conserje",
    "text": "[La Sombra del Conserje] Mira al personal de limpieza. Ejecuta el protocolo ignorando su uniforme. Asume que el otro no ha tenido la Oportunidad (información) necesaria en lugar de asumir pereza.\n\nTSN: Si notas invisibilidad social, di: _\"Estoy experimentando el filtro de la indiferencia en mi garganta\"_. **¿Para qué? Para mantener una conexión horizontal.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 9,
    "globalNumber": 9,
    "title": "La Observación del Triunfador",
    "text": "[La Observación del Triunfador] Mira a alguien visiblemente exitoso o un líder en su entorno. Reconoce sus probables \"éxitos ruidosos\" (suerte) y sus miedos internos bajo el protocolo de las 3 preguntas.\n\nTSN: Si sientes inferioridad, di: _\"Mi mente está comparando métricas competitivas\"_. **¿Para qué? Para humanizar la jerarquía y desactivar la autoestima condicional.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 10,
    "globalNumber": 10,
    "title": "El Guardia de la Entrada",
    "text": "[El Guardia de la Entrada] Mira por 3 segundos al guardia de seguridad estático. Cuestiónate su vulnerabilidad existencial hoy.\n\nTSN: Si sientes alienación, di: _\"Mi mente dice que este hombre es un objeto. Noto esa rigidez en mi nuca\"_.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 11,
    "globalNumber": 11,
    "title": "El Repartidor en Pausa",
    "text": "[El Repartidor en Pausa] Enfoca al repartidor en moto que espera un pedido. Asume que hoy podría ser su último día y aplica el protocolo.\n\nTSN: Si sientes frialdad, di: _\"Hola, hielo en mi plexo. Te doy espacio para descansar aquí\"_.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 12,
    "globalNumber": 12,
    "title": "El Reframe del Método Ajeno",
    "text": "[El Reframe del Método Ajeno] Observa a un colega o proveedor cuyo resultado final haya sido defectuoso o fallido. Valora el esfuerzo de su método o proceso por encima del resultado.\n\nTSN: Si aparece el juicio de incompetencia, di: _\"Estoy fusionado con el resultado\"_. **¿Para qué? Para fomentar la resiliencia técnica y valorar el proceso.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 13,
    "globalNumber": 13,
    "title": "La Recepción Vacía",
    "text": "[La Recepción Vacía] Mira a la recepcionista que atiende llamadas en automático. Procesa sus tres variables de estrés con las 3 preguntas.\n\nTSN: Si sientes desconexión total, nómbrala clínicamente: _\"Activación de anestesia cognitiva\"_. Observa el vacío.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 14,
    "globalNumber": 14,
    "title": "La Mirada del Barrendero",
    "text": "[La Mirada del Barrendero] Observa al barrendero municipal recolectando desechos. Detén tu marcha mental y ejecuta las 3 preguntas.\n\nTSN: Si tu mente lo esquiva, di: _\"Noto la tendencia evolutiva de mi cerebro a ignorar lo cotidiano\"_.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 15,
    "globalNumber": 15,
    "title": "El Lector de Parque",
    "text": "[El Lector de Parque] Analiza a alguien sentado en una banca leyendo. Descifra su estado anímico actual a través de sus gestos.\n\nTSN: Si sientes que pierdes el tiempo haciendo esto, di: _\"Pensamiento de productividad detectado\"_. Quédate quieto.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 16,
    "globalNumber": 16,
    "title": "El Turista Perdido",
    "text": "[El Turista Perdido] Mira a un extranjero buscando direcciones. Empatiza con su desorientación usando el protocolo de 3 pasos.\n\nTSN: Si sientes apatía territorial, di: _\"Noto una contracción defensiva en mis cejas. La observo\"_.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 17,
    "globalNumber": 17,
    "title": "El Escaneo de Pertenencia",
    "text": "[El Escaneo de Pertenencia] En un espacio público o plaza, observa a alguien que intente encajar sutilmente en un grupo o entorno y se note incómodo. Aplica el protocolo.\n\nTSN: Si sientes indiferencia, di: _\"Noto el impulso de ignorar al desadaptado\"_. **¿Para qué? Para identificar el deseo de pertenencia grupal.**",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 18,
    "globalNumber": 18,
    "title": "El Fotógrafo Solitario",
    "text": "[El Fotógrafo Solitario] Observa a alguien tomando fotos solo. Detén el veredicto de que es superficial y procesa su soledad interna.\n\nTSN: Si aparece un juicio crítico, di: _\"Estoy teniendo la historia de que esta persona busca atención\"_.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 19,
    "globalNumber": 19,
    "title": "El Deportista Exhausto",
    "text": "[El Deportista Exhausto] Mira a alguien descansando tras correr, jadeando. Calcula el dolor físico o mental que intenta mitigar.\n\nTSN: Si sientes desconexión, registra la anestesia en tu pecho y di: _\"Cuerpo neutral, mente observadora\"_.",
    "skillLevel": 1
  },
  {
    "bankLevel": 1,
    "number": 20,
    "globalNumber": 20,
    "title": "El Obrero en el Descanso",
    "text": "[El Obrero en el Descanso] Analiza al trabajador de construcción almorzando en la acera. Ejecuta el protocolo del último día de vida.\n\nTSN: Si te da incomodidad socioeconómica, di: _\"Siento una opresión de culpa en mi vientre\"_. Sostén la mirada neutral.",
    "skillLevel": 1
  },
  {
    "bankLevel": 2,
    "number": 1,
    "globalNumber": 21,
    "title": "El Rostro de la Pantalla",
    "text": "[El Rostro de la Pantalla] Busca a alguien leyendo su teléfono cuyo rostro cambie sutilmente (un micro-fruncimiento). Deduce la crisis o alegría del texto.\n\nTSN: Si sientes pereza mental, di: _\"Mi frente se siente pesada\"_. Sostén la mirada abierta hacia el cambio gestual.",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 2,
    "globalNumber": 22,
    "title": "El Ajuste del Auricular",
    "text": "[El Ajuste del Auricular] Mira a alguien que se quita los audífonos con un suspiro pesado. Decodifica su fatiga auditiva con las 3 preguntas.\n\nTSN: Si tu mente divaga, di: _\"Fluctuación de atención\"_ y regresa al ritmo de la respiración del extraño.",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 3,
    "globalNumber": 23,
    "title": "El Eco del Restaurante",
    "text": "[El Eco del Restaurante] Observa a alguien comiendo solo en un sitio ruidoso. Procesa sus 3 realidades contextuales sin caer en lástima.\n\nTSN: Si sientes condescendencia, di: _\"Estoy teniendo el pensamiento de que su vida es triste\"_. Elimina el veneno en tu garganta.",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 4,
    "globalNumber": 24,
    "title": "El Reframe de la Crítica",
    "text": "[El Reframe de la Crítica] Ante un comentario crítico o feedback negativo de un tercero, detén la reacción inmediata. Elige ver la crítica estrictamente como \"información técnica\" en lugar de un \"ataque personal\".\n\nTSN: Si tu pulso se dispara, di: _\"Mi cuerpo está reaccionando a una amenaza percibida\"_. **¿Para qué? Para reencuadrar el significado fisiológico y regular tu química interna.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 5,
    "globalNumber": 25,
    "title": "El Tecleo Furioso",
    "text": "[El Tecleo Furioso] Enfoca a alguien que tipea desesperadamente en su laptop en un café. Responde las 3 preguntas rompiendo tu burbuja.\n\nTSN: Si te aíslas, di: _\"Hola, blindaje somático\"_. Siente el aislamiento en tu piel y disuélvelo abriendo los ojos.",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 6,
    "globalNumber": 26,
    "title": "El Selfi Interrumpido",
    "text": "[El Selfi Interrumpido] Observa el cambio drástico de rostro de alguien justo después de tomarse una foto sonriendo. Analiza su vacío real.\n\nTSN: Si sientes desprecio por su vanidad, di: _\"Juicio moral detectado en mis ojos\"_. Relaja la vista.",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 7,
    "globalNumber": 27,
    "title": "El Flujo de Invitación",
    "text": "[El Flujo de Invitación] En tu próxima conversación, frena tu impulso de hablar de ti. Diseña la charla invitando deliberadamente al otro a compartir primero.\n\nTSN: Si experimentas ansiedad por intervenir, di: _\"Deseo de validación personal detectado\"_. **¿Para qué? Para aumentar la inversión emocional de la otra persona en la conexión.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 8,
    "globalNumber": 28,
    "title": "El Detector de Inversión Verbal",
    "text": "[El Detector de Inversión Verbal] Durante una plática con un compañero, observa analíticamente qué temas específicos hacen que gaste más energía verbal o gesticule más. Aplica el protocolo de las 3 preguntas sobre esos focos.\n\nTSN: Si te aburres, di: _\"Mi mente quiere desconectarse\"_. **¿Para qué? Para identificar sus valores load-bearing (de carga).**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 9,
    "globalNumber": 29,
    "title": "El Espejo Emocional",
    "text": "[El Espejo Emocional] Ante alguien que te cuente un problema, no ofrezcas soluciones técnicas inmediatamente. Refleja su emoción diciendo: _\"Parece que esta situación te está generando una carga de frustración/estrés\"_.\n\nTSN: Si absorbes su tensión, di: _\"Esto es su estrés, no el mío\"_. **¿Para qué? Para validar su realidad sin absorber su cortisol.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 10,
    "globalNumber": 30,
    "title": "La Curiosidad No Juiciosa",
    "text": "[La Curiosidad No Juiciosa] Cuando alguien exprese una opinión con la que discrepes profundamente, no contraargumentes. Pregunta de forma neutral: _¿Cómo llegaste a esa conclusión?_ y aplica el protocolo de las 3 preguntas a su proceso mental.\n\nTSN: Si sientes rabia intelectual, di: _\"Mi ego se siente agredido\"_. **¿Para qué? Para mapear modelos mentales distintos al tuyo.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 11,
    "globalNumber": 31,
    "title": "La Gratitud por la Inversión",
    "text": "[La Gratitud por la Inversión] Cuando un amigo o colega te confíe una situación personal difícil, detén la charla casual y di explícitamente: _\"Gracias por confiarme esto, sé que no es fácil de contar\"_.\n\nTSN: Si te sientes incómodo ante su vulnerabilidad, di: _\"Noto incomodidad social en mi pecho\"_. **¿Para qué? Para validar su vulnerabilidad como un activo de valor.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 12,
    "globalNumber": 32,
    "title": "El Suavizado de la Vergüenza",
    "text": "[El Suavizado de la Vergüenza] Si notas que un interlocutor evita el contacto visual, se sonroja o titubea por un error menor, baja conscientemente el tono y volumen de tu voz.\n\nTSN: Si sientes el impulso de dominar o corregir con fuerza, di: _\"Impulso de dominancia detectado\"_. **¿Para qué? Para analizar el lenguaje no verbal de la vergüenza y no sobrecargar su sistema de amenaza.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 13,
    "globalNumber": 33,
    "title": "La Despedida de Estación",
    "text": "[La Despedida de Estación] Mira un abrazo prolongado entre dos personas en una terminal. Mide el impacto si fuera su último día juntos.\n\nTSN: Si te sientes rígido o como un intruso, di: _\"Cuerpo de piedra\"_. Habita esa rigidez por 10 segundos.",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 14,
    "globalNumber": 34,
    "title": "El Placebo Social de Progreso",
    "text": "[El Placebo Social de Progreso] Identifica un avance real (por pequeño que sea) en el desempeño de alguien a tu alrededor y reconócelo detalladamente en público o privado.\n\nTSN: Si tu mente minimiza el logro ajeno, di: _\"Envidia o tacañería emocional detectada en mi entrecejo\"_. **¿Para qué? Para que su creencia en su capacidad mejore su rendimiento biológico.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 15,
    "globalNumber": 35,
    "title": "El Paciente que Espera",
    "text": "[El Paciente que Espera] Mira a quien espera afuera de una clínica con papeles médicos en mano. Procesa su posible diagnóstico.\n\nTSN: Si evitas mirar por miedo a la enfermedad, di: _\"Noto miedo a la fragilidad en mi vientre\"_. Quédate mirando.",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 16,
    "globalNumber": 36,
    "title": "El Nocebo Social Transgredido",
    "text": "[El Nocebo Social Transgredido] Observa a alguien que se auto-limita debido a una etiqueta externa (ej. \"soy malo para esto\" o \"por mi edad ya no puedo\"). Escúchalo con compasión radical y ejecuta el protocolo.\n\nTSN: Si sientes ganas de darle un consejo condescendiente, di: _\"Mi mente quiere jugar al salvador\"_. **¿Para qué? Para no reforzar su estructura de fracaso.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 17,
    "globalNumber": 37,
    "title": "La Vulnerabilidad Liderada",
    "text": "[La Vulnerabilidad Liderada] En una reunión o grupo donde todos simulen perfección, comparte abiertamente un error de proceso propio que hayas cometido recientemente.\n\nTSN: Si experimentas pánico al juicio ajeno, di: _\"Miedo a la exposición en mi plexo\"_. Sostén la declaración. **¿Para qué? Para reducir el \"coste de reporte\" en el grupo y que otros admitan los suyos.**",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 18,
    "globalNumber": 38,
    "title": "El Regreso del Trabajo",
    "text": "[El Regreso del Trabajo] En el último transporte de la noche, analiza a quien va apoyado contra la ventana con los ojos cerrados.\n\nTSN: Si sientes indiferencia nocturna, nómbrala: _\"Inercia de Medianoche\"_. Obliga al cerebro a lanzar las 3 hipótesis.",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 19,
    "globalNumber": 39,
    "title": "El Uniforme Incómodo",
    "text": "[El Uniforme Incómodo] Observa a alguien atrapado en un traje de botarga publicitaria calurosa. Empatiza con su aislamiento térmico y mental.\n\nTSN: Si te causa gracia superficial, di: _\"Filtro de burla activo\"_. Siente el calor simulado en tu propio cuerpo.",
    "skillLevel": 2
  },
  {
    "bankLevel": 2,
    "number": 20,
    "globalNumber": 40,
    "title": "La Mirada del Desempleado",
    "text": "[La Mirada del Desempleado] Identifica a alguien revisando ofertas de empleo con rostro sombrío. Rompe el muro de tu propia estabilidad.\n\nTSN: Si sientes resistencia a sintonizar con su escasez, di: _\"Noto un candado de protección en mi pecho\"_.",
    "skillLevel": 2
  },
  {
    "bankLevel": 3,
    "number": 1,
    "globalNumber": 41,
    "title": "La Paradoja del Conductor",
    "text": "[La Paradoja del Conductor] Enfrenta mentalmente al conductor que te acaba de cerrar el paso de forma temeraria. Deduce sus 3 crisis extremas.\n\nTSN: Si deseas insultar, rastrea el fuego en tus manos y di: _\"Estoy experimentando una oleada de ira en mi pecho\"_. No ejecutes el insulto.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 2,
    "globalNumber": 42,
    "title": "El Por Qué del Miedo",
    "text": "[El Por Qué del Miedo] Durante una discusión acalorada con tu pareja, socio o compañero de trabajo, frena la escalada verbal. Inquiere con calma: _¿Qué es lo que más te preocupa de que esto falle?_\n\nTSN: Si tu mente quiere ganar el argumento, di: _\"Necesidad de tener la razón detectada\"_. **¿Para qué? Para llegar a los cimientos de su miedo y desactivar el conflicto.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 3,
    "globalNumber": 43,
    "title": "El Deseo de Ser Amado",
    "text": "[El Deseo de Ser Amado] Mira fijamente a un extraño que esté actuando de forma abiertamente hostil o grosera en un entorno público. Piensa textualmente: _\"Esta persona no actuaría de forma tan reactiva si no tuviera un deseo profundo de ser aceptada\"_.\n\nTSN: Si experimentas desprecio visceral, di: _\"Mis puños se están apretando. Siento la alarma biológica\"_. **¿Para qué? Para neutralizar tu propio sistema de defensa.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 4,
    "globalNumber": 44,
    "title": "La Amabilidad ante la Hostilidad Técnica",
    "text": "[La Amabilidad ante la Hostilidad Técnica] Si un subordinado o colega comete un error crítico que te afecta directamente, detén la reprimenda punitiva. Di con firmeza pero calidez: _\"Cualquiera en tu posición podría haber pasado por alto ese dato o cometido ese fallo. Vamos a resolverlo\"_.\n\nTSN: Si sientes el deseo de humillar o castigar, di: _\"Furia punitiva activa en mi garganta\"_. **¿Para qué? Para activar su sistema de seguridad biológica.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 5,
    "globalNumber": 45,
    "title": "La Compasión Firme vs Indulgencia",
    "text": "[La Compasión Firme vs Indulgencia] Confronta a alguien que esté ejecutando un comportamiento dañino o tóxico en tu entorno. Hazlo desde la amabilidad absoluta, pero marcando un límite estructural inquebrantable (ej: _\"Entiendo perfectamente tu frustración, pero no voy a permitir que me hables en ese tono\"_).\n\nTSN: Si sientes miedo a la confrontación o debilidad indulgente, di: _\"Evitación del conflicto detectada en mi estómago\"_. **¿Para qué? Para proteger la integridad del sistema.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 6,
    "globalNumber": 46,
    "title": "El Análisis de Causas Sistémicas",
    "text": "[El Análisis de Causas Sistémicas] Ante un fallo operativo grave provocado por otra persona, prohíbete buscar culpables individuales durante las primeras dos horas. Investiga qué parte de la estructura, la falta de capacitación o el diseño del flujo falló _antes_ de señalar al individuo.\n\nTSN: Si experimentas la urgencia de desahogar la culpa en alguien, di: _\"Sesgo de atribución activa\"_. **¿Para qué? Para entrenarte como un arquitecto social justo.**",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 7,
    "globalNumber": 47,
    "title": "El Espejo del Mendigo",
    "text": "[El Espejo del Mendigo] Pasa junto a alguien en situación de calle extrema. Míralo a los ojos 3 segundos completos y ejecuta el protocolo de las 3 preguntas.\n\nTSN: Si tu mente se congela de repulsión o culpa, di: _\"Habito un vacío helado en mi plexo solar\"_. No desvíes la mirada por 3 segundos.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 8,
    "globalNumber": 48,
    "title": "La Crisis de Adicción",
    "text": "[La Crisis de Adicción] Mira a una persona bajo los efectos severos de sustancias en la vía pública. Desmenuza el dolor de su biografía profunda.\n\nTSN: Si sientes asco o juicio moral, di: _\"Mi estómago se está contrayendo en señal de rechazo\"_. Sostén la observación clínica.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 9,
    "globalNumber": 49,
    "title": "El Detonante Político",
    "text": "[El Detonante Político] Lee una publicación de alguien que defienda una postura ideológica que detestas. Pregúntate rigurosamente sus 3 miedos base.\n\nTSN: Si experimentas rabia visceral, di: _\"Noto una barrera protectora de asco en mi garganta\"_. Sigue leyendo sin cerrar la app.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 10,
    "globalNumber": 50,
    "title": "La Discapacidad Severa",
    "text": "[La Discapacidad Severa] Cruza tu camino con alguien que sufra una deformidad física muy visible. Obliga a tu mirada a sostenerse abierta y neutral.\n\nTSN: Si por incomodidad retiras los ojos, di: _\"Tensión evasiva en mi cuello\"_. Regresa la mirada al plano humano con suavidad.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 11,
    "globalNumber": 51,
    "title": "La Expresión del Delincuente",
    "text": "[La Expresión del Delincuente] Mira el rostro de alguien arrestado en las noticias. Procesa científicamente su nivel de descomposición humana.\n\nTSN: Si sientes deseos de venganza, di: _\"Estoy experimentando la historia mental de que esta persona no merece compasión\"_.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 12,
    "globalNumber": 52,
    "title": "El Olor Repulsivo",
    "text": "[El Olor Repulsivo] Entra a un vagón donde alguien emita un olor muy fuerte por falta de higiene. Calcula el nivel de abandono que sufre.\n\nTSN: Si sientes náuseas o rabia, di: _\"Nudo de rechazo en mi nariz y boca\"_. Mantén la respiración acompasada sin hacer gestos de desprecio.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 13,
    "globalNumber": 53,
    "title": "El Predicador Invasivo",
    "text": "[El Predicador Invasivo] Escucha a alguien gritando fanatismo religioso con megáfono. Imagina la tremenda necesidad de control de su mente.\n\nTSN: Si te genera desprecio intelectual, di: _\"Soberbia detectada en mi entrecejo\"_. Baja las defensas del ego.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 14,
    "globalNumber": 54,
    "title": "El Llanto Desconsolado",
    "text": "[El Llanto Desconsolado] Encuentra a un extraño llorando a lágrima viva en público. Quédate cerca en silencio y procesa su duelo actual.\n\nTSN: Si deseas huir por miedo a la intensidad emocional, di: _\"Siento un temblor de desamparo en mi propio pecho\"_. No te muevas.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 15,
    "globalNumber": 55,
    "title": "La Demencia Pública",
    "text": "[La Demencia Pública] Observa a un anciano desorientado hablando solo de forma errática. Haz el mapa mental de su fragmentación cognitiva.\n\nTSN: Si sientes pánico a envejecer, di: _\"Miedo al deterioro detectado en mi espalda baja\"_. Sostén la observación del anciano.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 16,
    "globalNumber": 56,
    "title": "El Comportamiento Tóxico",
    "text": "[El Comportamiento Tóxico] Presencia a alguien tratando mal a su propia pareja o hijo de forma pasivo-agresiva. Descifra su cadena de trauma heredado.\n\nTSN: Si quieres juzgar con severidad, di: _\"Opresión de juez en mi corazón\"_. Recuerda que el abuso es dolor transmitido.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 17,
    "globalNumber": 57,
    "title": "La Envidia del Éxito",
    "text": "[La Envidia del Éxito] Mira a alguien notablemente más joven ostentando un lujo extremo con arrogancia. Analiza qué tres vacíos oculta su fachada.\n\nTSN: Si sientes una punzada de amargura, di: _\"Hola, envidia defensiva en mi estómago\"_. Sommelier-testea ese ácido sin avergonzarte.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 18,
    "globalNumber": 58,
    "title": "El Cuerpo Moribundo",
    "text": "[El Cuerpo Moribundo] Observa a un enfermo grave con serias dificultades para respirar en un hospital. Habita el destino biológico compartido.\n\nTSN: Si te invade el miedo a la muerte, di: _\"Presencia de un vacío negro en mi mente\"_. Quédate perfectamente quieto habitando ese vacío.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 19,
    "globalNumber": 59,
    "title": "El Espejo del Enemigo",
    "text": "[El Espejo del Enemigo] Trae a tu mente a la persona que más daño te ha hecho. Ejecuta las 3 preguntas sobre su patología o historia mental.\n\nTSN: Si tu pecho se cierra con un candado de hielo, di: _\"Candado defensivo activo\"_. Mide su diámetro exacto por 10 segundos sin forzar amor.",
    "skillLevel": 3
  },
  {
    "bankLevel": 3,
    "number": 20,
    "globalNumber": 60,
    "title": "El Umbral del Espejo",
    "text": "[El Umbral del Espejo] Mírate fijamente a los ojos en un espejo bajo una luz cruda. Aplica las 3 preguntas contigo mismo con total honestidad.\n\nTSN: Si tu mente responde con autocrítica dura o silencio pesado, di: _\"Estoy teniendo el pensamiento de que no soy suficiente\"_. Inhabita tu propio reflejo con aceptación radical.",
    "skillLevel": 3
  }
];

// ============================================================================
// DEV/SRC/SERVICES/SKILLSERVICE.JS
// ============================================================================

/* SkillService - Skill Discovery, Evolution & Management */

// Helper function - XP required for each skill level (exponential growth)
function getSkillXpRequired(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

class SkillService {
    constructor(plugin) {
        this.plugin = plugin;
    }

    // Initialize skills settings if not present
    ensureSkillsSettings() {
        if (!this.plugin.settings.skillsSettings) {
            this.plugin.settings.skillsSettings = JSON.parse(JSON.stringify(DEFAULT_SKILLS_SETTINGS));
        }
        if (!this.plugin.settings.skillsSettings.skills) {
            this.plugin.settings.skillsSettings.skills = [];
        }
    }

    // Get all skills
    getSkills() {
        this.ensureSkillsSettings();
        return this.plugin.settings.skillsSettings.skills;
    }

    // Get skill by ID
    getSkill(skillId) {
        return this.getSkills().find(s => s.id === skillId);
    }

    // Get skills by category
    getSkillsByCategory(category) {
        return this.getSkills().filter(s => s.category === category);
    }

    // Create a new skill
    createSkill(name, category, discoveredFrom = 'manual', description = '') {
        this.ensureSkillsSettings();

        // Check if skill already exists
        const existingSkill = this.getSkills().find(s =>
            s.name.toLowerCase() === name.toLowerCase()
        );
        if (existingSkill) {
            return existingSkill;
        }

        const spellDefaults = DEFAULT_SPELL_LIBRARY[name] || {};
        const newSkill = {
            ...JSON.parse(JSON.stringify(DEFAULT_SKILL)),
            ...JSON.parse(JSON.stringify(spellDefaults)),
            id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: name,
            category: category || spellDefaults.category || 'vocation',
            description: description || spellDefaults.description || '',
            discoveredFrom: discoveredFrom,
            discoveredDate: new Date().toISOString(),
            xpToNextLevel: getSkillXpRequired(1)
        };

        this.plugin.settings.skillsSettings.skills.push(newSkill);
        this.plugin.settings.skillsSettings.totalSkillsDiscovered++;

        return newSkill;
    }

    // Add XP to a skill
    addSkillXp(skillId, xpAmount) {
        const skill = this.getSkill(skillId);
        if (!skill) return null;

        skill.xp += xpAmount;
        skill.lastPracticed = new Date().toISOString();
        skill.totalPracticeCount++;

        // Check for level up
        let levelsGained = 0;
        while (skill.xp >= skill.xpToNextLevel) {
            skill.xp -= skill.xpToNextLevel;
            skill.level++;
            skill.xpToNextLevel = getSkillXpRequired(skill.level);
            levelsGained++;
        }

        return { skill, levelsGained };
    }

    // Level up a skill using skill points
    levelUpSkill(skillId) {
        this.ensureSkillsSettings();
        const ss = this.plugin.settings.skillsSettings;

        if (ss.availableSkillPoints <= 0) {
            return { success: false, message: 'No skill points available' };
        }

        const skill = this.getSkill(skillId);
        if (!skill) {
            return { success: false, message: 'Skill not found' };
        }

        // Use skill point to level up
        ss.availableSkillPoints--;
        skill.level++;
        skill.xp = 0;
        skill.xpToNextLevel = getSkillXpRequired(skill.level);

        return { success: true, skill };
    }

    // Delete a skill
    deleteSkill(skillId) {
        this.ensureSkillsSettings();
        const ss = this.plugin.settings.skillsSettings;
        const index = ss.skills.findIndex(s => s.id === skillId);

        if (index >= 0) {
            ss.skills.splice(index, 1);
            return { success: true };
        }
        return { success: false, message: 'Skill not found' };
    }

    // Merge two skills together
    mergeSkills(sourceSkillId, targetSkillId) {
        this.ensureSkillsSettings();
        const ss = this.plugin.settings.skillsSettings;

        const sourceSkill = this.getSkill(sourceSkillId);
        const targetSkill = this.getSkill(targetSkillId);

        if (!sourceSkill || !targetSkill) {
            return { success: false, message: 'Skills not found' };
        }

        // Transfer XP to target skill
        targetSkill.xp += sourceSkill.xp + (sourceSkill.level * 50);

        // Check for level ups
        while (targetSkill.xp >= targetSkill.xpToNextLevel) {
            targetSkill.xp -= targetSkill.xpToNextLevel;
            targetSkill.level++;
            targetSkill.xpToNextLevel = getSkillXpRequired(targetSkill.level);
        }

        // Update practice count
        targetSkill.totalPracticeCount += sourceSkill.totalPracticeCount;

        // Remove source skill
        const index = ss.skills.findIndex(s => s.id === sourceSkillId);
        if (index >= 0) {
            ss.skills.splice(index, 1);
        }

        return { success: true, mergedSkill: targetSkill };
    }

    // AI discovers skills from journal content
    async discoverSkillsFromJournal(content, fileName) {
        const apiKey = getActiveApiKey(this.plugin.settings);
        if (!apiKey) return [];

        const aiService = new AIService(this.plugin);

        // Get existing skills to avoid duplicates and suggest combinations
        const existingSkills = this.getSkills().map(s => s.name);
        const existingList = existingSkills.length > 0
            ? `\n\nEXISTING SKILLS (don't create duplicates):\n${existingSkills.join(', ')}`
            : '';

        const prompt = `You are a skill discovery AI for an RPG life game. Extract BROAD, GENERAL skills from this journal entry.

RULES:
- Use SHORT, SIMPLE names (1-2 words max): "Writing", "Photography", "Cooking", "Running"
- Create BROAD categories, not specific variants
- Combine similar activities into ONE skill (e.g., "blog writing" + "article writing" = "Writing")
- Look for main activities only, ignore minor mentions
- Maximum 3 skills per journal entry${existingList}

CATEGORIES:
VOCATION: Writing, Design, Photography, Programming, Business, Marketing, Sales
MIND: Learning, Meditation, Planning, Problem-Solving
BODY: Running, Gym, Yoga, Cooking, Sports
SPIRIT: Networking, Teaching, Mentoring, Communication

Journal entry from "${fileName}":
---
${content.substring(0, 2000)}
---

Return ONLY valid JSON array with 0-3 skills:
[{"name": "Skill", "category": "vocation|mind|body|spirit", "xp": 20}]

Empty if nothing: []`;

        let response = '';
        try {
            response = await aiService.callProvider(
                [{ role: 'user', content: prompt }],
                this.plugin.settings.ai?.provider || 'openrouter',
                apiKey,
                getActiveChatModel(this.plugin.settings),
                0.3, // Low temperature for consistent parsing
                800  // More tokens for multiple skills
            );

            console.log('Skill discovery raw response:', response);

            // Parse JSON from response - handle various formats
            let jsonStr = response.trim();

            // Remove markdown code blocks if present
            if (jsonStr.includes('```')) {
                const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
                if (match) jsonStr = match[1].trim();
            }

            // Try to find JSON array in response
            const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
            if (arrayMatch) {
                jsonStr = arrayMatch[0];
            }

            const discoveredSkills = JSON.parse(jsonStr);
            console.log('Skills discovered:', discoveredSkills);
            return Array.isArray(discoveredSkills) ? discoveredSkills : [];
        } catch (error) {
            console.error('Skill discovery error:', error);
            console.error('Raw response was:', response);
            return [];
        }
    }

    // Check if skill name is similar to an existing skill
    findSimilarSkill(newName) {
        const skills = this.getSkills();
        const newLower = newName.toLowerCase();

        // Check for exact match first
        let exact = skills.find(s => s.name.toLowerCase() === newLower);
        if (exact) return { skill: exact, similarity: 'exact' };

        // Check for partial matches
        for (const skill of skills) {
            const skillLower = skill.name.toLowerCase();

            // If one contains the other
            if (newLower.includes(skillLower) || skillLower.includes(newLower)) {
                return { skill, similarity: 'partial' };
            }

            // Check for similar words
            const newWords = newLower.split(/\s+/);
            const skillWords = skillLower.split(/\s+/);
            const commonWords = newWords.filter(w => skillWords.includes(w));
            if (commonWords.length > 0 && (commonWords.length / newWords.length) > 0.5) {
                return { skill, similarity: 'similar' };
            }
        }

        return null;
    }

    // Check if skill can evolve to advanced version
    checkSkillEvolution(skill) {
        if (skill.level < 5) return null; // Need level 5 to evolve

        // Skill evolution rules
        const evolutions = {
            'Writing': { level: 5, evolvedName: 'Professional Writing' },
            'Photography': { level: 5, evolvedName: 'Professional Photography' },
            'Cooking': { level: 5, evolvedName: 'Culinary Arts' },
            'Programming': { level: 5, evolvedName: 'Software Engineering' },
            'Design': { level: 5, evolvedName: 'Creative Design' },
            'Running': { level: 5, evolvedName: 'Athletic Running' },
            'Gym': { level: 5, evolvedName: 'Strength Training' },
            'Business': { level: 5, evolvedName: 'Business Management' },
            'Marketing': { level: 5, evolvedName: 'Digital Marketing' },
            'Teaching': { level: 5, evolvedName: 'Master Teaching' },
            'Meditation': { level: 5, evolvedName: 'Mindfulness Practice' },
            'Learning': { level: 5, evolvedName: 'Fast Learning' }
        };

        const evolution = evolutions[skill.name];
        if (evolution && skill.level >= evolution.level) {
            return evolution.evolvedName;
        }

        return null;
    }

    // Process discovered skills - create or update
    async processDiscoveredSkills(discoveredSkills) {
        const results = [];

        for (const discovered of discoveredSkills) {
            if (!discovered.name || !discovered.category) continue;

            // Check for similar existing skill
            const similar = this.findSimilarSkill(discovered.name);

            if (similar) {
                // Use existing skill instead of creating duplicate
                const skill = similar.skill;
                const result = this.addSkillXp(skill.id, discovered.xp || 20);

                // Check for evolution
                const evolvedName = this.checkSkillEvolution(skill);
                if (evolvedName && skill.name !== evolvedName) {
                    skill.name = evolvedName;
                    results.push({
                        action: 'evolved',
                        skill: skill,
                        oldName: discovered.name,
                        levelsGained: result.levelsGained
                    });
                } else {
                    results.push({
                        action: 'xp_added',
                        skill: result.skill,
                        xpAdded: discovered.xp || 20,
                        levelsGained: result.levelsGained
                    });
                }
            } else {
                // New skill discovered
                const skill = this.createSkill(
                    discovered.name,
                    discovered.category,
                    'journal',
                    discovered.description || ''
                );
                // Add initial XP
                if (discovered.xp > 0) {
                    this.addSkillXp(skill.id, discovered.xp);
                }
                results.push({
                    action: 'discovered',
                    skill: skill,
                    xpAdded: discovered.xp || 0
                });
            }
        }

        return results;
    }

    // Get skill summary for display
    getSkillSummary() {
        const skills = this.getSkills();
        const summary = {
            total: skills.length,
            byCategory: {},
            topSkills: [],
            recentlyPracticed: []
        };

        // Count by category
        Object.keys(SKILL_CATEGORIES).forEach(cat => {
            summary.byCategory[cat] = skills.filter(s => s.category === cat).length;
        });

        // Top skills by level
        summary.topSkills = [...skills]
            .sort((a, b) => b.level - a.level || b.xp - a.xp)
            .slice(0, 5);

        // Recently practiced
        summary.recentlyPracticed = [...skills]
            .filter(s => s.lastPracticed)
            .sort((a, b) => new Date(b.lastPracticed) - new Date(a.lastPracticed))
            .slice(0, 5);

        return summary;
    }
}

// ============================================================================
// DEV/SRC/SERVICES/HABITSKILLSYNCSERVICE.JS
// ============================================================================

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

// ============================================================================
// DEV/SRC/SERVICES/SKILLTREESERVICE.JS
// ============================================================================

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

    importSommelierBank({ nodeId = SOMMELIER_NODE_ID, bossId = GUILTMAL_BOSS_ID } = {}) {
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

    importBenevolenciaBank({ nodeId = BENEVOLENCIA_NODE_ID, bossId = GUILTMAL_BOSS_ID } = {}) {
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
        bossIds = [GUILTMAL_BOSS_ID]
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

// ============================================================================
// DEV/SRC/SERVICES/VOWSERVICE.JS
// ============================================================================

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

    isVowComplete(vow) {
        if (!vow) return false;
        return this.revealedCount(vow) >= this.targetCells(vow);
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

    normalizeBonus(value, fallback = 0.2) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    formatVowMultiplier(multiplier) {
        const n = Number(multiplier);
        if (!Number.isFinite(n) || n === 1) return '';
        return `×${(Math.round(n * 100) / 100).toFixed(2)}`;
    }

    getVowQuestMultiplier(school) {
        const schoolId = typeof resolveSkillTreeSchoolId === 'function'
            ? resolveSkillTreeSchoolId(school)
            : String(school || '').trim();
        if (!schoolId) return 1;
        let product = 1;
        for (const vow of this.listVows()) {
            if (!this.isVowComplete(vow)) continue;
            const schools = Array.isArray(vow.schools) ? vow.schools : [];
            if (!schools.includes(schoolId)) continue;
            product *= (1 + this.normalizeBonus(vow.xpBonus));
        }
        return product;
    }

    normalizeVow(raw) {
        const cols = Math.max(1, Number(raw.cols) || 5);
        const rows = Math.max(1, Number(raw.rows) || 10);
        const id = raw.id || this.createId('vow');
        const schools = raw.schools == null && String(id) === 'autocompasion'
            ? ['Autoridad', 'Presencia', 'Calidez']
            : this.normalizeSchoolIds(raw.schools);
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
            xpBonus: this.normalizeBonus(raw.xpBonus),
            damageBonus: this.normalizeBonus(raw.damageBonus),
            completedAt: raw.completedAt || (complete ? new Date().toISOString() : null),
            grains
        };
    }

    createVow({ title, inscription, imagePath, cols = 5, rows = 10, schools = [] }) {
        const vows = this.ensureVows();
        const vow = this.normalizeVow({
            id: this.createId('vow'),
            title,
            inscription,
            imagePath,
            cols,
            rows,
            schools,
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
        if (patch.xpBonus != null) vow.xpBonus = this.normalizeBonus(patch.xpBonus, vow.xpBonus);
        if (patch.damageBonus != null) vow.damageBonus = this.normalizeBonus(patch.damageBonus, vow.damageBonus);
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
        if (!vow.completedAt && vow.grains.length >= target) {
            vow.completedAt = new Date().toISOString();
        }
        return grain;
    }
}

// ============================================================================
// DEV/SRC/VIEWS/HEROVIEW.JS
// ============================================================================

class HeroView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.activeTab = 'journal';
        this.activeSubTab = 'habits'; // For Quests Hub sub-tabs
        this.activeArenaTab = 'boss'; // For Arena sub-tabs
        this.activeSkillTreeSchool = 'Autoridad';
        this.selectedSkillTreeNodeId = null;
        this.selectedVowId = null;
        this.skillTreePanBySchool = {};
        this.skillTreeDidPan = false;
        this.aiChatInput = '';
        this.aiChatMessages = [];
        this.isAiLoading = false;
        this.questSearchQuery = '';
        this.questSchoolFilter = 'all';
        this._questSearchCursor = null;
    }

    getViewType() { return VIEW_TYPE_HERO; }
    getDisplayText() { return "Hero Sheet"; }
    getIcon() { return "swords"; }

    async onOpen() { this.render(); }
    async onClose() {}

    render() {
        const container = this.containerEl.children[1];
        container.empty();
        container.addClass('life-rpg-container');

        const s = this.plugin.settings;
        const xpToNextLevel = s.level * 100;
        const hpPercent = Math.max(0, Math.min(100, (s.hp / s.maxHp) * 100));
        const xpPercent = Math.max(0, Math.min(100, (s.xp / xpToNextLevel) * 100));

        // --- HEADER & MAIN STATS ---
        const header = container.createDiv({ cls: 'rpg-header' });
        const profile = header.createDiv({ cls: "rpg-profile" });

        const avatarText = s.characterProfile?.name
            ? getCharacterTitle(s.level).split(' ')[0]
            : "🧙‍♂️";
        const avatarWrap = profile.createDiv({ cls: 'rpg-avatar' });
        const profileImage = s.characterProfile?.imagePath;
        if (profileImage) {
            this.renderVaultImage(avatarWrap, profileImage, {
                className: 'rpg-avatar-image-wrap',
                placeholder: avatarText
            });
        } else {
            avatarWrap.setText(avatarText);
        }

        const nameText = s.characterProfile?.name || `Level ${s.level}`;
        profile.createEl("h2", { text: nameText });
        this.renderTomesRow(profile);
        this.renderFlowersRow(profile);
        if (s.characterProfile?.name) {
            const devLevel = getDevelopmentLevel(s.level);
            const devInfo = DEVELOPMENT_LEVELS[devLevel];
            const tierProgress = getTierProgress(s.level);

            profile.createEl("div", { cls: "rpg-level-badge", text: `Level ${s.level} ${getCharacterTitle(s.level).split(' ').slice(1).join(' ')}` });
            profile.createEl("div", {
                cls: `rpg-human-tier-badge tier-${devLevel.replace('.', '-')}`,
                text: `${devInfo.icon} HUMAN ${devLevel} • ${tierProgress}%`
            });
        }

        const statBox = container.createDiv({ cls: "rpg-stat-box" });
        statBox.createDiv({ text: `❤️ HP: ${s.hp} / ${s.maxHp}` });
        statBox.createDiv({ cls: "rpg-bar-bg" }).createDiv({ cls: "rpg-bar-fill hp", attr: { style: `width: ${hpPercent}%` } });
        statBox.createDiv({ text: `✨ XP: ${s.xp} / ${xpToNextLevel}` });
        statBox.createDiv({ cls: "rpg-bar-bg" }).createDiv({ cls: "rpg-bar-fill xp", attr: { style: `width: ${xpPercent}%` } });
        statBox.createDiv({ cls: "rpg-gold", text: `💰 Gold: ${s.gold}` });

        // --- DOMAINS SECTION (Compact) ---
        if (s.characterProfile?.assessmentComplete) {
            const domainsSection = container.createDiv({ cls: 'rpg-domains-section' });
            domainsSection.createEl("h4", { text: "Life Domains" });
            const domainsGrid = domainsSection.createDiv({ cls: 'rpg-domains-grid' });

            s.domains.forEach(domain => {
                const domainEl = domainsGrid.createDiv({ cls: 'rpg-domain-item' });
                domainEl.createDiv({ cls: 'rpg-domain-header', text: `${domain.icon} ${domain.name.split(' ')[0]}` });
                domainEl.createDiv({ cls: 'rpg-domain-score', text: `${domain.score}%` });
                const barBg = domainEl.createDiv({ cls: "rpg-bar-bg small" });
                barBg.createDiv({
                    cls: "rpg-bar-fill domain",
                    attr: { style: `width: ${domain.score}%; background-color: ${domain.color}` }
                });
            });
        }

        // --- TAB NAVIGATION (Simplified 7 tabs) ---
        const tabNav = container.createDiv({ cls: 'rpg-tab-nav' });
        const tabs = [
            { id: 'journal', label: '📓 Journal' },
            { id: 'character', label: '🎭 Hero' },
            { id: 'skills', label: '🎯 Hechizos' },
            { id: 'skillTree', label: '🌲 Árbol' },
            { id: 'elder', label: '🧙 Elder' },
            { id: 'quests', label: '⚔️ Quests' },
            { id: 'arena', label: '🐉 Arena' },
            { id: 'vows', label: '🕯️ Vows' },
            { id: 'tavern', label: '🏨 Tavern' },
            { id: 'log', label: '📜 History' }
        ];

        tabs.forEach(tab => {
            const tabBtn = tabNav.createEl('button', {
                text: tab.label,
                cls: `rpg-tab-btn ${this.activeTab === tab.id ? 'active' : ''}`
            });
            tabBtn.onclick = () => { this.activeTab = tab.id; this.render(); };
        });

        // --- TAB CONTENT ---
        const tabContent = container.createDiv({ cls: 'rpg-tab-content' });

        if (this.activeTab === 'journal') this.renderJournal(tabContent);
        else if (this.activeTab === 'character') this.renderCharacter(tabContent);
        else if (this.activeTab === 'skills') this.renderSkills(tabContent);
        else if (this.activeTab === 'skillTree') this.renderSkillTree(tabContent);
        else if (this.activeTab === 'elder') this.renderElder(tabContent);
        else if (this.activeTab === 'quests') this.renderQuestsHub(tabContent);
        else if (this.activeTab === 'arena') this.renderArena(tabContent);
        else if (this.activeTab === 'vows') this.renderVows(tabContent);
        else if (this.activeTab === 'tavern') this.renderTavern(tabContent);
        else if (this.activeTab === 'log') this.renderActivityLog(tabContent);
    }

    // ============================================================================
    // SPELLS TAB - Character Skills & Abilities
    // ============================================================================
    renderSkills(container) {
        const s = this.plugin.settings;
        const skillService = new SkillService(this.plugin);
        const skills = skillService.getSkills();
        const ss = s.skillsSettings || {};

        container.createEl('h3', { text: '🎯 Hechizos del Personaje' });

        // Skill Points Banner
        const skillPointsBanner = container.createDiv({ cls: 'rpg-skill-points-banner' });
        skillPointsBanner.innerHTML = `
            <div class="rpg-skill-points-icon">⭐</div>
            <div class="rpg-skill-points-info">
                <div class="rpg-skill-points-count">${ss.availableSkillPoints || 0}</div>
                <div class="rpg-skill-points-label">Spell Points Available</div>
            </div>
            <div class="rpg-skill-points-hint">Level up to empower your spells</div>
        `;

        // Skills Summary
        const summary = skillService.getSkillSummary();
        const summaryCard = container.createDiv({ cls: 'rpg-skills-summary' });
        summaryCard.innerHTML = `
            <div class="rpg-skills-stat">
                <span class="rpg-skills-stat-value">${summary.total}</span>
                <span class="rpg-skills-stat-label">Total Hechizos</span>
            </div>
            <div class="rpg-skills-stat">
                <span class="rpg-skills-stat-value">${summary.byCategory.mind || 0}</span>
                <span class="rpg-skills-stat-label">🧠 Mind</span>
            </div>
            <div class="rpg-skills-stat">
                <span class="rpg-skills-stat-value">${summary.byCategory.body || 0}</span>
                <span class="rpg-skills-stat-label">💪 Body</span>
            </div>
            <div class="rpg-skills-stat">
                <span class="rpg-skills-stat-value">${summary.byCategory.spirit || 0}</span>
                <span class="rpg-skills-stat-label">✨ Spirit</span>
            </div>
            <div class="rpg-skills-stat">
                <span class="rpg-skills-stat-value">${summary.byCategory.vocation || 0}</span>
                <span class="rpg-skills-stat-label">⚔️ Vocation</span>
            </div>
        `;

        // Add Skill Button
        const addSkillBtn = container.createEl('button', {
            text: '➕ Add New Spell',
            cls: 'rpg-full-width-btn secondary'
        });
        addSkillBtn.onclick = () => {
            new AddSkillModal(this.app, this.plugin, () => this.render()).open();
        };

        // Discover Skills Button
        const apiKey = getActiveApiKey(s);
        if (apiKey) {
            const discoverSkillsBtn = container.createEl('button', {
                text: '🔍 Discover Spells from Journals',
                cls: 'rpg-full-width-btn primary'
            });
            discoverSkillsBtn.onclick = async () => {
                discoverSkillsBtn.disabled = true;
                discoverSkillsBtn.textContent = '🔍 Discovering spells...';
                await this.plugin.manualDiscoverSkills();
                this.render();
            };
        } else {
            const noApiWarning = container.createDiv({ cls: 'rpg-skill-warning' });
            noApiWarning.innerHTML = '⚠️ Configure an AI provider in Settings to enable spell discovery from journals';
        }

        const syncHabitsBtn = container.createEl('button', {
            text: '✅ Sync habits to skills',
            cls: 'rpg-full-width-btn secondary'
        });
        syncHabitsBtn.onclick = async () => {
            syncHabitsBtn.disabled = true;
            syncHabitsBtn.textContent = '✅ Syncing habits...';
            await this.plugin.syncHabitSkills(true);
            this.render();
        };

        // Skills by Category
        Object.entries(SKILL_CATEGORIES).forEach(([catId, catInfo]) => {
            const categorySkills = skills.filter(s => s.category === catId);

            const categorySection = container.createDiv({ cls: 'rpg-skill-category' });
            const categoryHeader = categorySection.createDiv({ cls: 'rpg-skill-category-header' });
            categoryHeader.innerHTML = `
                <span class="rpg-skill-category-icon">${catInfo.icon}</span>
                <span class="rpg-skill-category-name">${catInfo.name}</span>
                <span class="rpg-skill-category-count">${categorySkills.length}</span>
            `;

            if (categorySkills.length === 0) {
                const emptyMsg = categorySection.createDiv({ cls: 'rpg-skill-empty' });
                emptyMsg.textContent = `No ${catInfo.name.toLowerCase()} discovered yet`;
                const examplesMsg = categorySection.createDiv({ cls: 'rpg-skill-examples' });
                examplesMsg.textContent = `Examples: ${catInfo.examples.slice(0, 4).join(', ')}...`;
            } else {
                const skillsList = categorySection.createDiv({ cls: 'rpg-skills-list' });

                categorySkills.forEach(skill => {
                    const skillCard = skillsList.createDiv({ cls: 'rpg-skill-card' });

                    const xpPercent = Math.round((skill.xp / skill.xpToNextLevel) * 100);
                    const effects = Array.isArray(skill.effects) ? skill.effects.slice(0, 2) : [];
                    const states = Array.isArray(skill.statesApplied) ? skill.statesApplied : [];

                    skillCard.innerHTML = `
                        <div class="rpg-skill-header">
                            <span class="rpg-skill-name">${skill.name}</span>
                            <span class="rpg-skill-level">Lv. ${skill.level}</span>
                        </div>
                        ${skill.spellSchool ? `<div class="rpg-skill-school">School: ${skill.spellSchool}</div>` : ''}
                        <div class="rpg-skill-bar">
                            <div class="rpg-skill-bar-fill" style="width: ${xpPercent}%"></div>
                        </div>
                        <div class="rpg-skill-meta">
                            <span class="rpg-skill-xp">${skill.xp}/${skill.xpToNextLevel} XP</span>
                            ${skill.discoveredFrom === 'journal' ? '<span class="rpg-skill-badge">📓 Journal</span>' : ''}
                            ${states.length > 0 ? `<span class="rpg-skill-badge">State: ${states.join(', ')}</span>` : ''}
                        </div>
                        ${skill.description ? `<div class="rpg-skill-desc">${skill.description}</div>` : ''}
                        ${effects.length > 0 ? `<ul class="rpg-skill-effects">${effects.map(effect => `<li>${effect}</li>`).join('')}</ul>` : ''}
                    `;

                    // Buttons container
                    const btnContainer = skillCard.createDiv({ cls: 'rpg-skill-buttons' });

                    // Add level up button if skill points available
                    if ((ss.availableSkillPoints || 0) > 0) {
                        const levelUpBtn = btnContainer.createEl('button', {
                            text: '⬆️ Level Up',
                            cls: 'rpg-skill-levelup-btn'
                        });
                        levelUpBtn.onclick = async () => {
                            const result = skillService.levelUpSkill(skill.id);
                            if (result.success) {
                                new Notice(`🎯 ${skill.name} empowered to Lv. ${result.skill.level}!`);
                                await this.plugin.saveSettings();
                                this.render();
                            } else {
                                new Notice(result.message);
                            }
                        };
                    }

                    // Delete button
                    const deleteBtn = btnContainer.createEl('button', {
                        text: '🗑️',
                        cls: 'rpg-skill-delete-btn'
                    });
                    deleteBtn.onclick = async () => {
                        if (confirm(`Delete spell: ${skill.name}?`)) {
                            const result = skillService.deleteSkill(skill.id);
                            if (result.success) {
                                new Notice(`Deleted spell: ${skill.name}`);
                                await this.plugin.saveSettings();
                                this.render();
                            }
                        }
                    };
                });
            }
        });

        // Tips Section
        const tipsBox = container.createDiv({ cls: 'rpg-skill-tips' });
        tipsBox.innerHTML = `
            <h4>💡 How Spells Work</h4>
            <ul>
                <li><strong>Train spells</strong> by completing linked daily habits</li>
                <li><strong>Schools</strong> describe the kind of power each spell develops</li>
                <li><strong>States</strong> show what inner condition a spell can activate</li>
                <li><strong>Level up</strong> - Use Spell Points or gain XP from habits and journaling</li>
                <li><strong>Manage spells</strong> - Delete unwanted spells with the 🗑️ button</li>
            </ul>
        `;
    }

    renderCharacter(container) {
        const s = this.plugin.settings;

        // No character created yet
        if (!s.characterProfile?.name) {
            container.createEl("h3", { text: "🎭 Create Your Character" });
            const emptyState = container.createDiv({ cls: 'rpg-empty-character' });
            emptyState.createEl('p', { text: "Welcome, adventurer!" });
            emptyState.createEl('p', { text: "Create your character to begin your Life RPG journey." });

            const createBtn = container.createEl('button', {
                text: '✨ Create Your Character',
                cls: 'rpg-full-width-btn primary'
            });
            createBtn.onclick = () => {
                new CharacterCreationModal(this.app, this.plugin, () => this.render()).open();
            };
            return;
        }

        // Show Discovery Journey prompt if not completed
        if (!s.characterProfile.assessmentComplete) {
            const journeyBox = container.createDiv({ cls: 'rpg-journey-prompt' });
            journeyBox.createEl('h4', { text: '🧭 Discovery Journey' });
            journeyBox.createEl('p', {
                text: 'Answer 37 questions to discover your true strengths and unlock your full potential!',
                cls: 'rpg-journey-desc'
            });

            const rewardsInfo = journeyBox.createDiv({ cls: 'rpg-journey-rewards' });
            rewardsInfo.createSpan({ text: '🎁 Rewards: ' });
            rewardsInfo.createSpan({ text: '+5 XP per question • +50 bonus XP • Accurate domain scores', cls: 'rpg-journey-reward-text' });

            const journeyBtn = journeyBox.createEl('button', {
                text: '🧭 Start Discovery Journey',
                cls: 'rpg-full-width-btn journey'
            });
            journeyBtn.onclick = () => {
                const modal = new CharacterCreationModal(this.app, this.plugin, () => this.render());
                modal.characterName = s.characterProfile.name;
                modal.currentStep = 'domain_intro';
                modal.open();
            };
        }

        // Daily Wisdom Quote
        const today = new Date().toDateString();
        if (s.lastWisdomDate !== today || !s.dailyWisdom) {
            s.dailyWisdom = getContextualWisdom(s);
            s.lastWisdomDate = today;
            this.plugin.saveSettings();
        }

        if (s.dailyWisdom) {
            const wisdomSection = container.createDiv({ cls: 'rpg-wisdom-section standalone' });
            wisdomSection.createDiv({ cls: 'rpg-wisdom-label', text: '💡 Daily Wisdom' });
            wisdomSection.createDiv({ cls: 'rpg-wisdom-quote', text: `"${s.dailyWisdom.text}"` });
            if (s.dailyWisdom.source) {
                wisdomSection.createDiv({ cls: 'rpg-wisdom-source', text: `— ${s.dailyWisdom.source}` });
            }
        }

        // HUMAN 3.0 Framework Section
        const human3Section = container.createDiv({ cls: 'rpg-human3-section' });
        human3Section.createEl('h4', { text: '🎯 HUMAN 3.0 Framework' });

        // Calculate quadrant scores
        const quadrantScores = calculateQuadrantScores(s.domains);
        const devLevel = getDevelopmentLevel(s.level);
        const devInfo = DEVELOPMENT_LEVELS[devLevel];
        const tierProgress = getTierProgress(s.level);
        const levelsToNext = getLevelsToNextTier(s.level);

        // Development Level Display
        const devLevelSection = human3Section.createDiv({ cls: 'rpg-dev-level' });
        devLevelSection.innerHTML = `
            <div class="rpg-dev-level-badge level-${devLevel.replace('.', '-')}">${devInfo.icon} HUMAN ${devLevel}</div>
            <div class="rpg-dev-level-title">${devInfo.name} - ${devInfo.title}</div>
            <div class="rpg-dev-level-journey">${devInfo.journey}</div>
            <div class="rpg-dev-level-desc">${devInfo.desc}</div>
        `;

        // Tier Progress Bar
        const tierProgressSection = human3Section.createDiv({ cls: 'rpg-tier-progress' });
        tierProgressSection.innerHTML = `
            <div class="rpg-tier-progress-label">Tier Progress: ${tierProgress}%</div>
            <div class="rpg-tier-progress-bar">
                <div class="rpg-tier-progress-fill" style="width: ${tierProgress}%"></div>
            </div>
            ${levelsToNext > 0
                ? `<div class="rpg-tier-next">${levelsToNext} levels to HUMAN ${devLevel === '1.0' ? '2.0' : '3.0'}</div>`
                : `<div class="rpg-tier-max">🌟 Maximum HUMAN tier achieved!</div>`
            }
        `;

        // Four Quadrants Section
        const quadrantsSection = container.createDiv({ cls: 'rpg-quadrants-section' });
        quadrantsSection.createEl('h4', { text: '📊 Four Quadrants of Development' });

        // Calculate overall balance score
        const quadrantValues = Object.values(quadrantScores);
        const overallScore = Math.round(quadrantValues.reduce((a, b) => a + b, 0) / 4);
        const minQuadrant = Math.min(...quadrantValues);
        const maxQuadrant = Math.max(...quadrantValues);
        const balance = 100 - (maxQuadrant - minQuadrant);

        // Overall stats
        const overallStats = quadrantsSection.createDiv({ cls: 'rpg-quadrant-overall' });
        overallStats.innerHTML = `
            <div class="rpg-quadrant-overall-stat">
                <span class="label">Overall:</span>
                <span class="value">${overallScore}%</span>
            </div>
            <div class="rpg-quadrant-overall-stat">
                <span class="label">Balance:</span>
                <span class="value ${balance >= 70 ? 'good' : balance >= 50 ? 'fair' : 'low'}">${balance}%</span>
            </div>
        `;

        // Quadrants Grid
        const quadrantsGrid = quadrantsSection.createDiv({ cls: 'rpg-quadrants-grid' });

        QUADRANTS.forEach(quadrant => {
            const score = Math.round(quadrantScores[quadrant.id]);
            const relatedDomainIds = Object.entries(DOMAIN_TO_QUADRANT)
                .filter(([_, q]) => q === quadrant.id)
                .map(([domainId, _]) => domainId);
            const relatedDomains = s.domains.filter(d => relatedDomainIds.includes(d.id));

            const card = quadrantsGrid.createDiv({ cls: 'rpg-quadrant-card' });

            // Quadrant Header
            const header = card.createDiv({ cls: 'rpg-quadrant-header', attr: { style: `background: ${quadrant.color}20` } });
            header.innerHTML = `
                <span class="rpg-quadrant-icon">${quadrant.icon}</span>
                <span class="rpg-quadrant-name">${quadrant.name}</span>
            `;

            // Quadrant Score Bar
            const barContainer = card.createDiv({ cls: 'rpg-quadrant-bar-container' });
            barContainer.createDiv({
                cls: 'rpg-quadrant-bar',
                attr: { style: `width: ${score}%; background-color: ${quadrant.color}` }
            });
            card.createDiv({ cls: 'rpg-quadrant-score', text: `${score}%` });

            // Quadrant Description
            card.createDiv({ cls: 'rpg-quadrant-desc', text: quadrant.desc });

            // Related Domains
            const domainsContainer = card.createDiv({ cls: 'rpg-quadrant-domains' });
            relatedDomains.forEach(domain => {
                const domainRow = domainsContainer.createDiv({ cls: 'rpg-quadrant-domain-row' });
                domainRow.innerHTML = `
                    <span class="rpg-qd-icon">${domain.icon}</span>
                    <span class="rpg-qd-name">${domain.name}</span>
                    <span class="rpg-qd-score">${domain.score}%</span>
                `;
            });
        });

        // Journey Stats
        const statsSection = container.createDiv({ cls: 'rpg-char-stats-summary' });
        statsSection.createEl('h4', { text: '📈 Journey Stats' });

        const createdDate = new Date(s.characterProfile.createdAt).toLocaleDateString();
        const statsGrid = statsSection.createDiv({ cls: 'rpg-stats-grid' });

        statsGrid.innerHTML = `
            <div class="rpg-stat-card">
                <div class="rpg-stat-icon">📅</div>
                <div class="rpg-stat-label">Started</div>
                <div class="rpg-stat-value">${createdDate}</div>
            </div>
            <div class="rpg-stat-card">
                <div class="rpg-stat-icon">✅</div>
                <div class="rpg-stat-label">Habits</div>
                <div class="rpg-stat-value">${s.totalHabitsCompleted || 0}</div>
            </div>
            <div class="rpg-stat-card">
                <div class="rpg-stat-icon">⚔️</div>
                <div class="rpg-stat-label">Quests</div>
                <div class="rpg-stat-value">${s.totalQuestsCompleted || 0}</div>
            </div>
            <div class="rpg-stat-card">
                <div class="rpg-stat-icon">💰</div>
                <div class="rpg-stat-label">Gold Earned</div>
                <div class="rpg-stat-value">${s.totalGoldEarned || 0}</div>
            </div>
        `;

        // Retake Assessment button
        const retakeBtn = container.createEl('button', {
            text: '🔄 Retake Assessment',
            cls: 'rpg-full-width-btn secondary'
        });
        retakeBtn.onclick = () => {
            if (confirm('Retaking the assessment will update your domain scores. Continue?')) {
                new CharacterCreationModal(this.app, this.plugin, () => this.render()).open();
            }
        };
    }

    renderJournal(container) {
        const s = this.plugin.settings;
        const js = s.journalSettings || {};

        container.createEl('h3', { text: '📓 Journal Intelligence' });

        // Sync Status Card
        const statusCard = container.createDiv({ cls: 'rpg-journal-status' });
        const lastSync = js.lastSyncDate
            ? new Date(js.lastSyncDate).toLocaleString()
            : 'Never';
        const scanModeText = js.scanMode === 'folder'
            ? `📁 Folder: /${js.journalFolder || 'Journal'}/`
            : `🏷️ Tag: ${js.journalTag || '#journal'}`;

        statusCard.innerHTML = `
            <div class="rpg-journal-stat">
                <span class="label">Last Sync:</span>
                <span class="value">${lastSync}</span>
            </div>
            <div class="rpg-journal-stat">
                <span class="label">Scan Mode:</span>
                <span class="value">${scanModeText}</span>
            </div>
            <div class="rpg-journal-stat">
                <span class="label">AI Analysis:</span>
                <span class="value">${s.ai?.openRouterApiKey ? '✅ Enabled' : '❌ Disabled'}</span>
            </div>
        `;

        // Sync Button
        const syncBtn = container.createEl('button', {
            text: '🔄 Sync Journal Entries',
            cls: 'rpg-full-width-btn primary'
        });
        syncBtn.onclick = async () => {
            syncBtn.disabled = true;
            syncBtn.textContent = '⏳ Analyzing...';
            try {
                await this.plugin.syncJournals();
                this.render();
            } catch (e) {
                new Notice(`❌ Sync failed: ${e.message}`);
                console.error(e);
            } finally {
                syncBtn.disabled = false;
                syncBtn.textContent = '🔄 Sync Journal Entries';
            }
        };

        // Semantic Search Section (if embeddings enabled and available)
        const embeddingsCount = js.embeddings?.length || 0;
        if (s.ai?.embeddingEnabled && s.ai?.openRouterApiKey && embeddingsCount > 0) {
            container.createEl('h4', { text: '🔍 Semantic Search' });
            const searchSection = container.createDiv({ cls: 'rpg-journal-search' });

            const searchInfo = searchSection.createDiv({ cls: 'rpg-search-info' });
            searchInfo.textContent = `${embeddingsCount} journal entries indexed for semantic search`;

            const searchInputRow = searchSection.createDiv({ cls: 'rpg-search-row' });
            const searchInput = searchInputRow.createEl('input', {
                type: 'text',
                placeholder: 'Search by meaning... e.g., "times I felt grateful"',
                cls: 'rpg-search-input'
            });

            const searchBtn = searchInputRow.createEl('button', {
                text: '🔎',
                cls: 'rpg-search-btn'
            });

            const searchResults = searchSection.createDiv({ cls: 'rpg-search-results' });

            const performSearch = async () => {
                const query = searchInput.value.trim();
                if (!query) return;

                searchBtn.textContent = '⏳';
                searchBtn.disabled = true;
                searchResults.empty();

                try {
                    const embeddingService = new EmbeddingService(this.plugin);
                    const results = await embeddingService.findSimilarEntries(query, 5);

                    if (results.length === 0) {
                        searchResults.innerHTML = '<div class="rpg-search-empty">No matching entries found</div>';
                    } else {
                        results.forEach(result => {
                            const resultItem = searchResults.createDiv({ cls: 'rpg-search-result-item' });
                            const similarity = Math.round(result.similarity * 100);
                            resultItem.innerHTML = `
                                <div class="rpg-search-result-header">
                                    <span class="rpg-search-result-name">${result.fileName}</span>
                                    <span class="rpg-search-result-score">${similarity}% match</span>
                                </div>
                                <div class="rpg-search-result-summary">${result.summary?.substring(0, 150) || ''}...</div>
                                <div class="rpg-search-result-date">${result.date?.split('T')[0] || ''}</div>
                            `;

                            // Click to open the note
                            resultItem.onclick = async () => {
                                const file = this.app.vault.getAbstractFileByPath(result.filePath);
                                if (file) {
                                    await this.app.workspace.openLinkText(file.path, '', false);
                                }
                            };
                        });
                    }
                } catch (e) {
                    searchResults.innerHTML = `<div class="rpg-search-error">Search failed: ${e.message}</div>`;
                }

                searchBtn.textContent = '🔎';
                searchBtn.disabled = false;
            };

            searchBtn.onclick = performSearch;
            searchInput.onkeypress = (e) => { if (e.key === 'Enter') performSearch(); };
        } else if (s.ai?.openRouterApiKey && embeddingsCount === 0) {
            // Show message to sync for embeddings
            const embedMsg = container.createDiv({ cls: 'rpg-journal-embed-notice' });
            embedMsg.innerHTML = `
                <span class="rpg-embed-icon">💡</span>
                <span>Sync your journals to enable semantic search</span>
            `;
        }

        // Recent Analysis Results
        if (js.recentAnalysis && js.recentAnalysis.length > 0) {
            container.createEl('h4', { text: '📊 Recent Analysis' });
            const analysisList = container.createDiv({ cls: 'rpg-analysis-list' });

            js.recentAnalysis.slice(0, 5).forEach(a => {
                const item = analysisList.createDiv({ cls: 'rpg-analysis-item' });
                const sentimentClass = a.sentiment > 0 ? 'positive' : (a.sentiment < 0 ? 'negative' : 'neutral');
                const sentimentIcon = a.sentiment > 2 ? '😊' : (a.sentiment < -2 ? '😔' : '😐');

                item.innerHTML = `
                    <div class="rpg-analysis-name">${a.fileName}</div>
                    <div class="rpg-analysis-details">
                        <span class="rpg-analysis-sentiment ${sentimentClass}">
                            ${sentimentIcon} ${a.sentiment > 0 ? '+' : ''}${a.sentiment}
                        </span>
                        <span class="rpg-analysis-xp">+${a.xp || 0} XP</span>
                    </div>
                `;
            });
        } else {
            const emptyState = container.createDiv({ cls: 'rpg-empty' });
            emptyState.textContent = 'No journal entries analyzed yet. Press "Sync" to get started!';
        }

        // Domain Keywords Summary
        container.createEl('h4', { text: '🏷️ Domain Keywords' });
        const keywordsInfo = container.createDiv({ cls: 'rpg-journal-keywords-info' });
        keywordsInfo.innerHTML = `
            <p class="rpg-journal-keywords-note">
                The plugin scans your journals for keywords related to each life domain.
                Customize keywords in plugin settings.
            </p>
        `;

        // Show a preview of keywords
        const keywordsGrid = container.createDiv({ cls: 'rpg-journal-keywords-grid' });
        const domainOrder = ['health', 'psychologicalWellbeing', 'education', 'timeUse', 'communityVitality'];

        domainOrder.forEach(domainId => {
            const keywords = js.domainKeywords?.[domainId] || [];
            const domainInfo = s.domains.find(d => d.id === domainId);
            if (domainInfo && keywords.length > 0) {
                const card = keywordsGrid.createDiv({ cls: 'rpg-keyword-card' });
                card.innerHTML = `
                    <div class="rpg-keyword-domain">${domainInfo.icon} ${domainInfo.name.split(' ')[0]}</div>
                    <div class="rpg-keyword-examples">${keywords.slice(0, 3).join(', ')}...</div>
                `;
            }
        });

        // Tips Section
        const tipsBox = container.createDiv({ cls: 'rpg-journal-tips' });
        tipsBox.innerHTML = `
            <h4>💡 Tips for Journal XP</h4>
            <ul>
                <li>Write about achievements to gain XP</li>
                <li>Mention specific domains to level them up</li>
                <li>Longer entries = more Gold (1g per 100 words)</li>
                <li>Reflect on challenges honestly (may cost HP but builds awareness)</li>
                <li>Enable AI for deeper sentiment analysis</li>
            </ul>
        `;

        // Settings Link
        const settingsBtn = container.createEl('button', {
            text: '⚙️ Configure Journal Settings',
            cls: 'rpg-full-width-btn secondary'
        });
        settingsBtn.onclick = () => {
            this.app.setting.open();
            this.app.setting.openTabById('life-rpg');
        };
    }

    renderAICoach(container) {
        const s = this.plugin.settings;
        const hasApiKey = !!s.ai?.openRouterApiKey;

        container.createEl("h3", { text: "🧠 Life Coach" });

        // Mode indicator
        const modeIndicator = container.createDiv({ cls: `rpg-coach-mode ${hasApiKey ? 'ai-mode' : 'offline-mode'}` });
        modeIndicator.innerHTML = hasApiKey
            ? '🤖 <strong>AI-Enhanced Mode</strong> - Powered by AI for personalized coaching'
            : '📚 <strong>Smart Coach Mode</strong> - Built-in coaching system';

        // === PROGRESS ANALYSIS (Always available) ===
        this.renderProgressAnalysis(container);

        // === DAILY TIP (Always available) ===
        this.renderDailyTip(container);

        // === DOMAIN ADVICE (Always available) ===
        this.renderDomainAdvice(container);

        // === MOTIVATION (Always available) ===
        this.renderMotivationSection(container);

        // === AI CHAT (Only with API key) ===
        if (hasApiKey) {
            this.renderAIChat(container);
        } else {
            // Upgrade prompt
            const upgradeSection = container.createDiv({ cls: 'rpg-coach-upgrade' });
            upgradeSection.createEl('h4', { text: '✨ Unlock AI-Enhanced Coaching' });
            upgradeSection.createEl('p', { text: 'Add an OpenRouter API key to unlock:' });

            const featureList = upgradeSection.createEl('ul', { cls: 'rpg-upgrade-features' });
            featureList.createEl('li', { text: '💬 Chat with AI for personalized advice' });
            featureList.createEl('li', { text: '🎯 AI-generated quests tailored to you' });
            featureList.createEl('li', { text: '📊 Deep analysis of your patterns' });
            featureList.createEl('li', { text: '🧠 Contextual coaching based on your data' });

            const settingsBtn = upgradeSection.createEl('button', {
                text: '⚙️ Add API Key in Settings',
                cls: 'rpg-full-width-btn secondary'
            });
            settingsBtn.onclick = () => {
                this.app.setting.open();
                this.app.setting.openTabById('life-rpg');
            };
        }
    }

    // ============================================================================
    // ELDER TAB - Wise Elder (Redesigned AI Coach)
    // ============================================================================
    renderElder(container) {
        const s = this.plugin.settings;
        const ai = s.ai || {};
        const persona = ai.elderPersona || DEFAULT_AI_SETTINGS.elderPersona;
        const hasApiKey = !!ai.openRouterApiKey;

        // Elder Header with persona name
        const elderHeader = container.createDiv({ cls: 'rpg-elder-header' });
        elderHeader.innerHTML = `
            <div class="rpg-elder-avatar">🧙</div>
            <div class="rpg-elder-info">
                <h3 class="rpg-elder-name">${persona.name}</h3>
                <span class="rpg-elder-title">${persona.title}</span>
            </div>
            <button class="rpg-elder-settings-btn" title="Customize Elder">⚙️</button>
        `;

        // Settings button click
        elderHeader.querySelector('.rpg-elder-settings-btn').onclick = () => {
            new ElderSettingsModal(this.app, this.plugin, () => this.render()).open();
        };

        // Connection Status
        const statusBadge = container.createDiv({ cls: `rpg-elder-status ${hasApiKey ? 'connected' : 'offline'}` });
        statusBadge.innerHTML = hasApiKey
            ? '✨ <span>Connected to the Ethereal Realm</span>'
            : '📜 <span>Wisdom from Ancient Scrolls</span>';

        if (!hasApiKey) {
            // Offline mode - show built-in wisdom
            this.renderElderOfflineMode(container, persona);
            return;
        }

        // Elder's Greeting
        const greetingBox = container.createDiv({ cls: 'rpg-elder-greeting' });
        greetingBox.innerHTML = `
            <div class="rpg-elder-speech-bubble">
                <p>"${persona.greeting}"</p>
            </div>
        `;

        // Quick Wisdom Buttons
        const wisdomSection = container.createDiv({ cls: 'rpg-elder-wisdom-section' });
        wisdomSection.createEl('h4', { text: '🌟 Seek Wisdom' });

        const wisdomGrid = wisdomSection.createDiv({ cls: 'rpg-elder-wisdom-grid' });

        const elderPrompts = ai.elderPrompts || DEFAULT_AI_SETTINGS.elderPrompts;
        const wisdomActions = [
            { id: 'guidance', icon: '🔮', label: 'Guidance', desc: 'Seek direction', display: 'Elder, I seek your guidance on my path forward.' },
            { id: 'challenge', icon: '⚔️', label: 'Challenge', desc: 'Request a quest', display: 'Elder, I am ready for a new challenge. What quest would you suggest?' },
            { id: 'reflection', icon: '🪞', label: 'Reflection', desc: 'Review journey', display: 'Elder, help me reflect on my journey so far.' },
            { id: 'motivation', icon: '🔥', label: 'Courage', desc: 'Find strength', display: 'Elder, I need encouragement. Remind me of my strength.' }
        ];

        wisdomActions.forEach(action => {
            const btn = wisdomGrid.createDiv({ cls: 'rpg-elder-wisdom-btn' });
            btn.innerHTML = `
                <span class="icon">${action.icon}</span>
                <span class="label">${action.label}</span>
                <span class="desc">${action.desc}</span>
            `;
            btn.onclick = async () => {
                const prompt = elderPrompts[action.id] || DEFAULT_AI_SETTINGS.elderPrompts[action.id];
                await this.sendElderMessage(prompt, true, action.display);
            };
        });

        // Chat Container
        this.renderElderChat(container);
    }

    renderElderOfflineMode(container, persona) {
        // Show upgrade prompt with RPG flavor
        const offlineSection = container.createDiv({ cls: 'rpg-elder-offline' });

        offlineSection.innerHTML = `
            <div class="rpg-elder-speech-bubble offline">
                <p>"I sense your presence, traveler, but the ethereal connection is not established.
                To hear my voice directly, you must forge a link to the mystical realm..."</p>
            </div>

            <div class="rpg-elder-upgrade-box">
                <h4>🔮 Unlock the Elder's Voice</h4>
                <p>Connect to OpenRouter to enable direct conversations with ${persona.name}:</p>
                <ul>
                    <li>💬 Have meaningful conversations about your journey</li>
                    <li>🎯 Receive personalized quest recommendations</li>
                    <li>📊 Get deep analysis of your life patterns</li>
                    <li>🧠 Access wisdom tailored to your unique path</li>
                </ul>
            </div>
        `;

        const connectBtn = offlineSection.createEl('button', {
            text: '🔗 Establish Connection (Settings)',
            cls: 'rpg-full-width-btn primary'
        });
        connectBtn.onclick = () => {
            this.app.setting.open();
            this.app.setting.openTabById('life-rpg');
        };

        // Still show offline wisdom
        offlineSection.createEl('hr');
        offlineSection.createEl('h4', { text: '📜 Wisdom from the Scrolls' });

        this.renderDailyTip(offlineSection);
        this.renderDomainAdvice(offlineSection);
    }

    renderElderChat(container) {
        const s = this.plugin.settings;
        const persona = s.ai?.elderPersona || DEFAULT_AI_SETTINGS.elderPersona;

        const chatSection = container.createDiv({ cls: 'rpg-elder-chat-section' });
        chatSection.createEl('h4', { text: '💬 Converse with the Elder' });

        // Chat Messages
        const chatContainer = chatSection.createDiv({ cls: 'rpg-elder-chat-container' });

        if (this.aiChatMessages.length === 0 && s.ai?.chatHistory?.length > 0) {
            this.aiChatMessages = s.ai.chatHistory.slice(-10);
        }

        const messagesEl = chatContainer.createDiv({ cls: 'rpg-elder-messages' });

        if (this.aiChatMessages.length === 0) {
            messagesEl.createDiv({
                cls: 'rpg-elder-welcome',
                text: `${persona.name} awaits your questions. What weighs on your mind, traveler?`
            });
        } else {
            this.aiChatMessages.forEach(msg => {
                const msgEl = messagesEl.createDiv({ cls: `rpg-elder-message ${msg.role}` });
                const avatar = msgEl.createDiv({ cls: 'rpg-elder-msg-avatar' });
                avatar.textContent = msg.role === 'assistant' ? '🧙' : '🧑';

                const contentEl = msgEl.createDiv({ cls: 'rpg-elder-msg-content' });
                if (msg.role === 'assistant') {
                    contentEl.innerHTML = renderMarkdownToHtml(msg.content);
                } else {
                    contentEl.textContent = msg.content;
                }
            });
        }

        if (this.isAiLoading) {
            const loadingEl = messagesEl.createDiv({ cls: 'rpg-elder-loading' });
            loadingEl.innerHTML = '<span class="rpg-elder-loading-icon">🧙</span> The Elder ponders...';
        }

        setTimeout(() => messagesEl.scrollTop = messagesEl.scrollHeight, 0);

        // Chat Input
        const inputSection = chatSection.createDiv({ cls: 'rpg-elder-input-section' });

        const inputWrapper = inputSection.createDiv({ cls: 'rpg-elder-input-wrapper' });
        const chatInput = inputWrapper.createEl('textarea', {
            placeholder: 'Speak your mind, traveler...',
            cls: 'rpg-elder-input'
        });
        chatInput.value = this.aiChatInput;
        chatInput.addEventListener('input', (e) => this.aiChatInput = e.target.value);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendElderMessage(this.aiChatInput);
            }
        });

        const sendBtn = inputWrapper.createEl('button', {
            cls: 'rpg-elder-send-btn',
            text: '📤'
        });
        sendBtn.title = 'Send message';
        sendBtn.onclick = () => this.sendElderMessage(this.aiChatInput);

        // Action buttons
        const actionBtns = inputSection.createDiv({ cls: 'rpg-elder-action-btns' });

        const clearBtn = actionBtns.createEl('button', {
            text: '🗑️ Clear Conversation',
            cls: 'rpg-mini-btn secondary'
        });
        clearBtn.onclick = async () => {
            this.aiChatMessages = [];
            if (s.ai) s.ai.chatHistory = [];
            await this.plugin.saveSettings();
            this.render();
        };

        const questBtn = actionBtns.createEl('button', {
            text: '✨ Generate Quests',
            cls: 'rpg-mini-btn'
        });
        questBtn.onclick = () => {
            new AIQuestGeneratorModal(this.app, this.plugin, () => this.render()).open();
        };
    }

    async sendElderMessage(message, isQuickAction = false, displayMessage = null) {
        if (!message || !message.trim()) return;

        this.isAiLoading = true;
        if (!isQuickAction) {
            this.aiChatMessages.push({ role: 'user', content: message });
            this.aiChatInput = '';
        }
        this.render();

        try {
            const aiService = new AIService(this.plugin);

            // Enhance message with relevant memories if enabled
            let enhancedMessage = message;
            if (this.plugin.settings.ai?.elderMemoryEnabled &&
                this.plugin.settings.ai?.embeddingEnabled &&
                this.plugin.settings.ai?.openRouterApiKey &&
                this.plugin.settings.journalSettings?.embeddings?.length > 0) {
                try {
                    const embeddingService = new EmbeddingService(this.plugin);
                    const memoryCount = this.plugin.settings.ai?.elderMemoryCount || 3;
                    const memories = await embeddingService.getRelevantMemories(message, memoryCount);

                    if (memories.length > 0) {
                        const memoryContext = memories.map(m =>
                            `- From "${m.fileName}" (${m.date?.split('T')[0] || 'unknown date'}): ${m.summary}`
                        ).join('\n');

                        enhancedMessage = `${message}\n\n[The Elder recalls relevant memories from your journal...]\n${memoryContext}`;
                    }
                } catch (memErr) {
                    console.log('Memory retrieval skipped:', memErr.message);
                }
            }

            const response = await aiService.chat(enhancedMessage, true);

            if (isQuickAction) {
                // Show natural language display message instead of the actual prompt
                this.aiChatMessages.push(
                    { role: 'user', content: displayMessage || 'I seek your wisdom...' },
                    { role: 'assistant', content: response }
                );
            } else {
                this.aiChatMessages.push({ role: 'assistant', content: response });
            }

            // Keep only last 20 messages in UI
            if (this.aiChatMessages.length > 20) {
                this.aiChatMessages = this.aiChatMessages.slice(-20);
            }

        } catch (error) {
            this.aiChatMessages.push({
                role: 'assistant',
                content: `*The Elder's voice fades momentarily...* \n\n⚠️ ${error.message}`
            });
        }

        this.isAiLoading = false;
        this.render();
    }

    // ============================================================================
    // SKILL TREE TAB - Social schools, sub-skills, and challenge quests
    // ============================================================================
    renderSkillTree(container) {
        // Fresh paint: never keep a stale pan lock that blocks node clicks.
        this.skillTreeDidPan = false;
        const treeService = new SkillTreeService(this.plugin);
        treeService.ensureSkillTree();
        const summary = treeService.getSummary();
        const schools = SKILL_TREE_SCHOOLS;

        if (!schools.some(school => school.id === this.activeSkillTreeSchool)) {
            this.activeSkillTreeSchool = schools[0].id;
        }

        const schoolInfo = treeService.getSchoolInfo(this.activeSkillTreeSchool);
        const schoolNodes = treeService.getNodes().filter(node => node.school === this.activeSkillTreeSchool);
        if (!this.selectedSkillTreeNodeId || !schoolNodes.some(node => node.id === this.selectedSkillTreeNodeId)) {
            this.selectedSkillTreeNodeId = schoolNodes[0]?.id || null;
        }

        container.createEl('h3', { text: '🌲 Árbol de Habilidades Sociales' });
        container.createEl('p', {
            cls: 'rpg-subtitle',
            text: 'Crea sub-skills por escuela, carga retos como quests y deja que esas quests suban niveles y dañen bosses vinculados.'
        });

        const summaryRow = container.createDiv({ cls: 'rpg-skill-tree-summary' });
        summaryRow.createDiv({ text: `${summary.nodes} nodos`, cls: 'rpg-skill-tree-summary-item' });
        summaryRow.createDiv({ text: `${summary.acquired} adquiridos`, cls: 'rpg-skill-tree-summary-item' });
        summaryRow.createDiv({ text: `${summary.activeQuests} quests activas`, cls: 'rpg-skill-tree-summary-item' });
        summaryRow.createDiv({ text: `${summary.completedQuests} quests completadas`, cls: 'rpg-skill-tree-summary-item' });

        const schoolNav = container.createDiv({ cls: 'rpg-skill-tree-schools' });
        const vowService = new VowService(this.plugin);
        schools.forEach(school => {
            const count = treeService.getNodes().filter(node => node.school === school.id).length;
            const vowMult = vowService.getVowQuestMultiplier(school.id);
            const multLabel = vowService.formatVowMultiplier(vowMult);
            const btn = schoolNav.createEl('button', {
                text: `${school.name} (${count})${multLabel ? ` ${multLabel}` : ''}`,
                cls: `rpg-skill-tree-school-btn school-${school.id.toLowerCase()} ${this.activeSkillTreeSchool === school.id ? 'active' : ''}`
            });
            btn.onclick = () => {
                this.activeSkillTreeSchool = school.id;
                this.selectedSkillTreeNodeId = null;
                this.render();
            };
        });

        const actions = container.createDiv({ cls: 'rpg-skill-tree-actions' });
        const addNodeBtn = actions.createEl('button', { text: '+ Sub-skill', cls: 'rpg-full-width-btn secondary' });
        addNodeBtn.onclick = () => new SkillTreeNodeModal(this.app, this.plugin, this.activeSkillTreeSchool, () => this.render()).open();

        const treeLayout = container.createDiv({ cls: `rpg-skill-tree-layout school-${schoolInfo.id.toLowerCase()}` });
        const board = treeLayout.createDiv({ cls: 'rpg-skill-tree-board' });
        board.createDiv({ cls: 'rpg-skill-tree-pan-hint', text: 'Arrastra el fondo o usa la rueda para mover el canvas' });
        const details = treeLayout.createDiv({ cls: 'rpg-skill-tree-details' });

        if (schoolNodes.length === 0) {
            const empty = board.createDiv({ cls: 'rpg-skill-tree-empty' });
            empty.createDiv({ cls: 'rpg-skill-tree-empty-title', text: `Canvas vacío — ${schoolInfo.name}` });
            empty.createDiv({ cls: 'rpg-skill-tree-empty-desc', text: 'Crea tu primera sub-skill para empezar a poblar esta escuela.' });
        } else {
            const canvasContent = board.createDiv({ cls: 'rpg-skill-tree-canvas-content' });
            this.renderSkillTreeBoardByTiers(canvasContent, schoolNodes, treeService);
            this.setupSkillTreePanViewport(board, canvasContent);
        }

        const selectedNode = this.selectedSkillTreeNodeId ? treeService.getNode(this.selectedSkillTreeNodeId) : null;
        if (selectedNode) {
            this.renderSkillTreeDetails(details, selectedNode, treeService);
        } else {
            details.createDiv({ cls: 'rpg-empty', text: 'Selecciona un nodo para ver niveles y retos.' });
        }
    }

    setupSkillTreePanViewport(viewport, content) {
        const school = this.activeSkillTreeSchool;
        if (!this.skillTreePanBySchool[school]) {
            this.skillTreePanBySchool[school] = { x: 0, y: 0 };
        }
        const pan = this.skillTreePanBySchool[school];

        const applyPan = () => {
            content.style.transform = `translate(${pan.x}px, ${pan.y}px)`;
        };
        applyPan();

        let dragging = false;
        let startX = 0;
        let startY = 0;
        let startPanX = 0;
        let startPanY = 0;

        const canStartPan = target => {
            if (target.closest('.rpg-skill-tree-node')) return false;
            if (target.closest('button')) return false;
            return true;
        };

        const onPointerDown = e => {
            if (e.button !== 0) return;
            if (!canStartPan(e.target)) return;

            dragging = true;
            this.skillTreeDidPan = false;
            startX = e.clientX;
            startY = e.clientY;
            startPanX = pan.x;
            startPanY = pan.y;
            viewport.addClass('is-panning');
            viewport.setPointerCapture(e.pointerId);
            e.preventDefault();
        };

        const onPointerMove = e => {
            if (!dragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                this.skillTreeDidPan = true;
            }

            pan.x = startPanX + dx;
            pan.y = startPanY + dy;
            applyPan();
        };

        const endDrag = e => {
            if (!dragging) return;
            dragging = false;
            viewport.removeClass('is-panning');
            try {
                viewport.releasePointerCapture(e.pointerId);
            } catch (_) {
                // Pointer may already be released.
            }
            // Clear pan flag AFTER the synthetic click (if any) so a real pan
            // doesn't select a node, but the next intentional click works.
            // Bug before: skillTreeDidPan stayed true forever after one drag.
            window.setTimeout(() => {
                this.skillTreeDidPan = false;
            }, 0);
        };

        const onWheel = e => {
            e.preventDefault();
            pan.x -= e.deltaX;
            pan.y -= e.deltaY;
            this.skillTreeDidPan = true;
            applyPan();
            window.setTimeout(() => {
                this.skillTreeDidPan = false;
            }, 50);
        };

        const onDoubleClick = e => {
            if (!canStartPan(e.target)) return;
            pan.x = 0;
            pan.y = 0;
            applyPan();
        };

        viewport.addEventListener('pointerdown', onPointerDown);
        viewport.addEventListener('pointermove', onPointerMove);
        viewport.addEventListener('pointerup', endDrag);
        viewport.addEventListener('pointercancel', endDrag);
        viewport.addEventListener('wheel', onWheel, { passive: false });
        viewport.addEventListener('dblclick', onDoubleClick);
    }

    getSkillTreeDepth(node, treeService) {
        let depth = 0;
        let current = node;
        const visited = new Set();
        while (current?.parentId && !visited.has(current.parentId)) {
            visited.add(current.parentId);
            current = treeService.getNode(current.parentId);
            if (current) depth++;
        }
        return depth;
    }

    renderSkillTreeBoardByTiers(board, schoolNodes, treeService) {
        const byName = (a, b) => a.name.localeCompare(b.name);
        const components = schoolNodes
            .filter(node => (node.nodeRole || 'standard') === 'component')
            .sort(byName);
        const standardNodes = schoolNodes
            .filter(node => (node.nodeRole || 'standard') === 'standard')
            .sort(byName);
        const emergentNodes = schoolNodes
            .filter(node => node.nodeRole === 'emergent')
            .sort(byName);
        const schoolNodeIds = new Set(schoolNodes.map(node => node.id));
        const connectedNodeIds = new Set();
        const branches = emergentNodes.map(emergent => {
            const prerequisites = treeService.getPrerequisiteIds(emergent)
                .map(id => treeService.getNode(id))
                .filter(node => node && schoolNodeIds.has(node.id))
                .sort(byName);
            prerequisites.forEach(node => connectedNodeIds.add(node.id));
            return { emergent, prerequisites };
        });

        const connectedBranches = branches.filter(branch => branch.prerequisites.length > 0);
        if (connectedBranches.length > 0) {
            const convergenceTier = board.createDiv({ cls: 'rpg-skill-tree-tier tier-convergence' });
            convergenceTier.createDiv({ cls: 'rpg-skill-tree-tier-label', text: 'Convergencias' });

            connectedBranches.forEach(({ emergent, prerequisites }) => {
                const branch = convergenceTier.createDiv({ cls: 'rpg-skill-tree-branch' });
                branch.style.setProperty('--rpg-branch-count', String(prerequisites.length));
                branch.style.setProperty('--rpg-branch-width', `${Math.max(280, prerequisites.length * 210)}px`);

                const canvas = branch.createDiv({ cls: 'rpg-skill-tree-branch-canvas' });
                const sources = canvas.createDiv({ cls: 'rpg-skill-tree-branch-sources' });
                prerequisites.forEach(node => {
                    const source = sources.createDiv({ cls: 'rpg-skill-tree-branch-source' });
                    this.renderSkillTreeNodeCard(source, node, treeService);
                });

                const connector = canvas.createDiv({
                    cls: `rpg-skill-tree-branch-connector ${prerequisites.length === 1 ? 'single' : ''}`
                });
                prerequisites.forEach(() => connector.createDiv({ cls: 'rpg-skill-tree-connector-stem' }));
                canvas.createDiv({ cls: 'rpg-skill-tree-connector-merge' });

                const target = canvas.createDiv({ cls: 'rpg-skill-tree-branch-target' });
                this.renderSkillTreeNodeCard(target, emergent, treeService);
            });
        }

        const renderLooseTier = (id, label, nodes) => {
            if (nodes.length === 0) return;
            const tier = board.createDiv({ cls: `rpg-skill-tree-tier tier-${id}` });
            tier.createDiv({ cls: 'rpg-skill-tree-tier-label', text: label });
            const row = tier.createDiv({ cls: 'rpg-skill-tree-tier-row' });
            nodes.forEach(node => this.renderSkillTreeNodeCard(row, node, treeService));
        };

        renderLooseTier(
            'component',
            'Componentes sin conexión',
            components.filter(node => !connectedNodeIds.has(node.id))
        );
        renderLooseTier('standard', 'Habilidades', standardNodes.filter(node => !connectedNodeIds.has(node.id)));
        renderLooseTier(
            'emergent',
            'Emergentes sin prerrequisitos',
            branches.filter(branch => branch.prerequisites.length === 0).map(branch => branch.emergent)
        );
    }

    // ============================================================================
    // VOWS TAB - Belief grid-reveal
    // ============================================================================
    renderVows(container) {
        const service = new VowService(this.plugin);
        const vows = service.listVows();

        const header = container.createDiv({ cls: 'rpg-vows-header' });
        header.createEl('h3', { text: '🕯️ Vows' });
        header.createEl('p', {
            cls: 'rpg-subtitle',
            text: 'Cada evidencia revela un sector. Vincular desde el diario con «Vincular a vow».'
        });

        const actions = header.createDiv({ cls: 'rpg-vows-actions' });
        const newBtn = actions.createEl('button', { text: '+ Nuevo vow', cls: 'rpg-btn' });
        newBtn.onclick = () => {
            new VowEditorModal(this.app, this.plugin, () => this.render(), null).open();
        };

        if (this.selectedVowId) {
            const vow = service.getVow(this.selectedVowId);
            if (!vow) {
                this.selectedVowId = null;
            } else {
                this.renderVowDetail(container, vow, service);
                return;
            }
        }

        const list = container.createDiv({ cls: 'rpg-vows-list' });
        if (vows.length === 0) {
            list.createEl('p', { cls: 'rpg-subtitle', text: 'Todavía no hay vows. Creá el primero.' });
            return;
        }

        vows.forEach((vow, index) => {
            this.renderVowBlock(list, vow, service, { compact: true });
            if (index < vows.length - 1) {
                list.createDiv({ cls: 'rpg-vow-divider' });
            }
        });
    }

    renderVowBanner(parentEl, vow, service) {
        const banner = parentEl.createDiv({ cls: 'rpg-vow-banner' });
        banner.createDiv({ cls: 'rpg-vow-banner-title', text: vow.title || 'Vow' });
        if (vow.inscription) {
            banner.createDiv({ cls: 'rpg-vow-banner-inscription', text: vow.inscription });
        }
        const meta = banner.createDiv({ cls: 'rpg-vow-banner-meta' });
        const count = service.revealedCount(vow);
        const target = service.targetCells(vow);
        meta.createSpan({ text: `${count} / ${target}` });
        meta.createSpan({ cls: 'rpg-vow-stage', text: service.intensityLabel(vow) });
        if (service.isVowComplete(vow)) {
            const schools = Array.isArray(vow.schools) ? vow.schools : [];
            const pill = schools.length > 0
                ? `Estandarte activo · ${schools.join(', ')}`
                : 'Estandarte activo';
            meta.createSpan({ cls: 'rpg-vow-estandarte', text: pill });
        }
        return banner;
    }

    renderVowGrid(parentEl, vow, service, { large = false } = {}) {
        const cols = Math.max(1, Number(vow.cols) || 5);
        const rows = Math.max(1, Number(vow.rows) || 10);
        const target = cols * rows;
        const revealed = service.revealedCount(vow);
        const grains = Array.isArray(vow.grains) ? vow.grains : [];

        const stage = parentEl.createDiv({
            cls: large ? 'rpg-vow-stage-art rpg-vow-stage-art-large' : 'rpg-vow-stage-art'
        });
        const canvas = stage.createDiv({ cls: 'rpg-vow-canvas' });

        if (vow.imagePath) {
            this.renderVaultImage(canvas, vow.imagePath, {
                className: 'rpg-vow-art-wrap',
                placeholder: '?'
            });
        } else {
            canvas.createDiv({ cls: 'rpg-vault-image-placeholder', text: '🕯️' });
        }

        const grid = canvas.createDiv({ cls: 'rpg-vow-grid' });
        const detailHost = parentEl.createDiv({ cls: 'rpg-vow-cell-detail' });
        detailHost.createEl('p', {
            cls: 'rpg-subtitle',
            text: 'Hover o click en una celda revelada para ver fecha + experiencia.'
        });

        for (let i = 0; i < target; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const isRevealed = i < revealed;
            const grain = isRevealed ? grains[i] : null;
            const tip = grain
                ? `${grain.date || '?'} — ${grain.experience || ''}`
                : `Celda ${i + 1} (oculta)`;

            const cell = grid.createDiv({
                cls: `rpg-vow-cell ${isRevealed ? 'revealed' : 'hidden'}`,
                attr: {
                    style: `left:${(col / cols) * 100}%;top:${(row / rows) * 100}%;width:${100 / cols}%;height:${100 / rows}%;`,
                    title: tip
                }
            });

            if (isRevealed) {
                cell.onclick = () => {
                    detailHost.empty();
                    detailHost.createEl('strong', { text: grain?.date || `Celda ${i + 1}` });
                    detailHost.createEl('p', { text: grain?.experience || '' });
                };
            }
        }

        return stage;
    }

    renderVowBlock(container, vow, service, { compact = true } = {}) {
        const block = container.createDiv({ cls: 'rpg-vow-block' });
        this.renderVowBanner(block, vow, service);
        this.renderVowGrid(block, vow, service, { large: !compact });

        const row = block.createDiv({ cls: 'rpg-vow-block-actions' });
        const moreBtn = row.createEl('button', { text: 'Ver más', cls: 'rpg-btn' });
        moreBtn.onclick = () => {
            this.selectedVowId = vow.id;
            this.render();
        };
        const editBtn = row.createEl('button', { text: 'Editar', cls: 'rpg-btn secondary' });
        editBtn.onclick = () => {
            new VowEditorModal(this.app, this.plugin, () => this.render(), vow.id).open();
        };
    }

    renderVowDetail(container, vow, service) {
        const backRow = container.createDiv({ cls: 'rpg-vows-actions' });
        const backBtn = backRow.createEl('button', { text: '← Volver a vows', cls: 'rpg-btn secondary' });
        backBtn.onclick = () => {
            this.selectedVowId = null;
            this.render();
        };
        const editBtn = backRow.createEl('button', { text: 'Editar', cls: 'rpg-btn' });
        editBtn.onclick = () => {
            new VowEditorModal(this.app, this.plugin, () => this.render(), vow.id).open();
        };

        const detail = container.createDiv({ cls: 'rpg-vow-detail' });
        this.renderVowBanner(detail, vow, service);
        this.renderVowGrid(detail, vow, service, { large: true });

        detail.createEl('h4', { text: 'Historial de evidencias' });
        const table = detail.createEl('table', { cls: 'rpg-vow-table' });
        const thead = table.createEl('thead');
        const headRow = thead.createEl('tr');
        ['#', 'Fecha', 'Experiencia'].forEach(h => headRow.createEl('th', { text: h }));
        const tbody = table.createEl('tbody');
        const grains = Array.isArray(vow.grains) ? vow.grains : [];
        if (grains.length === 0) {
            const tr = tbody.createEl('tr');
            const td = tr.createEl('td', { text: 'Sin evidencias todavía. Vinculá un hito desde el diario.' });
            td.colSpan = 3;
        } else {
            grains.forEach((g, idx) => {
                const tr = tbody.createEl('tr');
                tr.createEl('td', { text: String(idx + 1) });
                tr.createEl('td', { text: g.date || '—' });
                tr.createEl('td', { text: g.experience || '' });
            });
        }

        detail.createEl('p', {
            cls: 'rpg-subtitle',
            text: 'MVP: mismo grid sobre PNG. Avance real = hitos vinculados.'
        });
    }

    getNodeRoleLabel(node) {
        const role = node?.nodeRole || 'standard';
        return SKILL_TREE_NODE_ROLES[role]?.label || 'Estándar';
    }

    renderVaultImage(parentEl, imagePath, options = {}) {
        const { className = 'rpg-vault-image-wrap', placeholder = '?' } = options;
        const wrapper = parentEl.createDiv({ cls: className });
        const trimmedPath = (imagePath || '').trim();

        if (trimmedPath) {
            const file = this.app.vault.getAbstractFileByPath(trimmedPath);
            if (file) {
                const img = wrapper.createEl('img', { cls: 'rpg-vault-image' });
                img.src = this.app.vault.adapter.getResourcePath(file.path);
                img.alt = '';
                return wrapper;
            }
        }

        wrapper.createDiv({ cls: 'rpg-vault-image-placeholder', text: placeholder });
        return wrapper;
    }

    renderSkillTreeArtFrame(parentEl, node) {
        const borderPath = getSkillTreeBorderPath(node.school, node.currentLevel);
        const tier = getSkillTreeBorderTier(node.currentLevel);
        const ornateCls = borderPath ? ` has-ornate-frame tier-lv${tier}` : '';
        const frame = parentEl.createDiv({
            cls: `rpg-skill-tree-node-art school-${String(node.school || '').toLowerCase()}${ornateCls}`
        });
        const outer = frame.createDiv({ cls: 'rpg-skill-tree-art-outer' });
        if (borderPath) {
            this.renderVaultImage(outer, borderPath, {
                className: 'rpg-skill-tree-art-frame',
                placeholder: ''
            });
        }
        const inner = outer.createDiv({ cls: 'rpg-skill-tree-art-inner' });
        this.renderVaultImage(inner, node.imagePath, { className: 'rpg-skill-tree-art-image', placeholder: '?' });
        return frame;
    }

    renderBossVisual(parentEl, boss) {
        const visual = getActiveBossPhaseVisual(boss);
        const usesTome = bossUsesTome(boss.tier);
        const iconWrap = parentEl.createDiv({
            cls: `rpg-boss-icon has-ornate-frame ${usesTome ? boss.tier : ''} phase-${visual.phase}`
        });
        const framePath = visual.framePath || getBossFramePath(boss.tier);
        this.renderVaultImage(iconWrap, framePath, {
            className: 'rpg-boss-art-frame',
            placeholder: ''
        });
        const portraitPath = visual.imagePath || boss.imagePath;
        if (portraitPath) {
            this.renderVaultImage(iconWrap, portraitPath, {
                className: 'rpg-boss-image-wrap',
                placeholder: boss.icon || '🐉'
            });
        } else {
            const inner = iconWrap.createDiv({ cls: 'rpg-boss-image-wrap rpg-boss-image-emoji' });
            inner.setText(boss.icon || '🐉');
        }
        return iconWrap;
    }

    renderTomesRow(parentEl) {
        const catalogChanged = this.plugin.ensureTomesCatalog();
        if (catalogChanged) this.plugin.saveSettings();
        const tomes = this.plugin.settings.tomes || [];
        if (tomes.length === 0) return;

        const row = parentEl.createDiv({ cls: 'rpg-tomes-row' });
        const bosses = this.plugin.settings.bossFights || [];

        tomes.forEach(tome => {
            const unlocked = !!tome.unlocked;
            const boss = bosses.find(b => String(b.id) === String(tome.bossId));
            const slot = row.createEl('button', {
                cls: `rpg-tome-slot ${unlocked ? 'unlocked' : 'locked'}`,
                attr: { type: 'button', title: unlocked ? (boss?.name || tome.name) : tome.name }
            });

            if (unlocked) {
                const outer = slot.createDiv({ cls: 'rpg-tome-art-outer' });
                const inner = outer.createDiv({ cls: 'rpg-tome-art-inner' });
                this.renderVaultImage(inner, tome.flatPath, {
                    className: 'rpg-tome-flat-wrap',
                    placeholder: '📖'
                });
                slot.createDiv({
                    cls: 'rpg-tome-boss-name',
                    text: boss?.name || '???'
                });
            } else {
                const frame = slot.createDiv({ cls: 'rpg-tome-locked-frame' });
                this.renderVaultImage(frame, tome.flatPath, {
                    className: 'rpg-tome-flat-wrap locked',
                    placeholder: '📖'
                });
            }

            slot.onclick = () => {
                new TomeKnowledgeModal(this.app, this.plugin, tome.id, 'tome').open();
            };
        });
    }

    renderFlowersRow(parentEl) {
        const catalogChanged = this.plugin.ensureFlowersCatalog();
        if (catalogChanged) this.plugin.saveSettings();
        const flowers = this.plugin.settings.flowers || [];
        if (flowers.length === 0) return;

        const row = parentEl.createDiv({ cls: 'rpg-tomes-row rpg-flowers-row' });
        const bosses = this.plugin.settings.bossFights || [];

        flowers.forEach(flower => {
            const unlocked = !!flower.unlocked;
            const boss = bosses.find(b => String(b.id) === String(flower.bossId));
            const slot = row.createEl('button', {
                cls: `rpg-tome-slot ${unlocked ? 'unlocked' : 'locked'}`,
                attr: { type: 'button', title: unlocked ? (boss?.name || flower.name) : flower.name }
            });

            if (unlocked) {
                const outer = slot.createDiv({ cls: 'rpg-tome-art-outer' });
                const inner = outer.createDiv({ cls: 'rpg-tome-art-inner' });
                this.renderVaultImage(inner, flower.flatPath, {
                    className: 'rpg-tome-flat-wrap',
                    placeholder: '🌸'
                });
                slot.createDiv({
                    cls: 'rpg-tome-boss-name',
                    text: boss?.name || '???'
                });
            } else {
                const frame = slot.createDiv({ cls: 'rpg-tome-locked-frame' });
                this.renderVaultImage(frame, flower.flatPath, {
                    className: 'rpg-tome-flat-wrap locked',
                    placeholder: '🌸'
                });
            }

            slot.onclick = () => {
                new TomeKnowledgeModal(this.app, this.plugin, flower.id, 'flower').open();
            };
        });
    }

    renderBossLootSection(parentEl, boss) {
        const section = parentEl.createDiv({ cls: 'rpg-boss-loot' });
        section.createDiv({ cls: 'rpg-boss-loot-label', text: 'Loot:' });

        const usesTome = bossUsesTome(boss.tier);
        const tome = this.plugin.getTomeById(boss.tomeId);
        const flower = this.plugin.getFlowerById(boss.flowerId);

        if (usesTome && tome) {
            const chip = section.createEl('button', {
                cls: 'rpg-boss-loot-tome',
                attr: { type: 'button', title: tome.name }
            });
            this.renderVaultImage(chip, tome.flatPath, {
                className: 'rpg-boss-loot-tome-img',
                placeholder: '📖'
            });
            chip.createSpan({ cls: 'rpg-boss-loot-tome-name', text: tome.name });
            chip.onclick = () => {
                new TomeKnowledgeModal(this.app, this.plugin, tome.id, 'tome').open();
            };
            return;
        }

        if (!usesTome && flower) {
            const chip = section.createEl('button', {
                cls: 'rpg-boss-loot-tome',
                attr: { type: 'button', title: flower.name }
            });
            this.renderVaultImage(chip, flower.flatPath, {
                className: 'rpg-boss-loot-tome-img',
                placeholder: '🌸'
            });
            chip.createSpan({ cls: 'rpg-boss-loot-tome-name', text: flower.name });
            chip.onclick = () => {
                new TomeKnowledgeModal(this.app, this.plugin, flower.id, 'flower').open();
            };
            return;
        }

        section.createSpan({
            cls: 'rpg-boss-loot-empty',
            text: usesTome ? 'Sin tomo' : 'Sin flor'
        });
    }

    getNodeStatusSymbol(node, unlocked) {
        if (node.acquired) return '◆';
        if (unlocked) return '◇';
        return '×';
    }

    renderSkillTreeNodeCard(container, node, treeService) {
        const unlocked = treeService.isNodeUnlocked(node);
        const selected = this.selectedSkillTreeNodeId === node.id;
        const progressText = `${node.currentLevel || 0}/${node.maxLevel || 1}`;
        const status = node.acquired ? 'acquired' : unlocked ? 'unlocked' : 'locked';
        const role = node.nodeRole || 'standard';

        const card = container.createDiv({
            cls: `rpg-skill-tree-node ${status} ${selected ? 'selected' : ''} school-${node.school.toLowerCase()} role-${role}`
        });
        card.onclick = () => {
            if (this.skillTreeDidPan) {
                // Consume stale pan suppression from a previous drag/wheel.
                this.skillTreeDidPan = false;
                return;
            }
            this.selectedSkillTreeNodeId = node.id;
            this.render();
        };

        const statusEl = card.createDiv({ cls: 'rpg-skill-tree-node-status' });
        statusEl.setText(this.getNodeStatusSymbol(node, unlocked));

        const body = card.createDiv({ cls: 'rpg-skill-tree-node-body' });
        const nameRow = body.createDiv({ cls: 'rpg-skill-tree-node-name-row' });
        nameRow.createDiv({ cls: 'rpg-skill-tree-node-name', text: node.name });
        if (role !== 'standard') {
            nameRow.createSpan({ cls: `rpg-skill-tree-role-badge role-${role}`, text: this.getNodeRoleLabel(node) });
        }
        const meta = body.createDiv({ cls: 'rpg-skill-tree-node-meta' });
        meta.createSpan({ text: node.school });
        meta.createSpan({ text: `Lv ${progressText}` });

        this.renderSkillTreeArtFrame(card, node);
    }

    renderSkillTreeDetails(container, node, treeService) {
        const unlocked = treeService.isNodeUnlocked(node);
        const prereqStatus = treeService.getPrerequisiteStatus(node);
        const header = container.createDiv({ cls: `rpg-skill-tree-detail-header school-${node.school.toLowerCase()}` });
        header.createEl('h4', { text: node.name });
        const roleLabel = this.getNodeRoleLabel(node);
        header.createDiv({
            cls: 'rpg-skill-tree-detail-meta',
            text: `${node.school} • ${roleLabel} • Nivel ${node.currentLevel || 0}/${node.maxLevel} • ${node.acquired ? 'Adquirida' : unlocked ? 'Desbloqueada' : 'Bloqueada'}`
        });
        if (node.description) {
            header.createDiv({ cls: 'rpg-skill-tree-detail-desc', text: node.description });
        }

        if (prereqStatus.length > 0) {
            const prereqBox = container.createDiv({ cls: 'rpg-skill-tree-prereq-list' });
            prereqBox.createDiv({ cls: 'rpg-skill-tree-prereq-title', text: 'Requiere para practicar:' });
            prereqStatus.forEach(prereq => {
                const row = prereqBox.createDiv({ cls: `rpg-skill-tree-prereq-item ${prereq.met ? 'met' : 'unmet'}` });
                row.setText(`${prereq.met ? '✓' : '✗'} ${prereq.name} — Lv ${prereq.currentLevel}/${prereq.maxLevel} (necesitas Lv ${prereq.requiredLevel})`);
            });
            if (!unlocked) {
                const names = prereqStatus.map(p => p.name).join(' y ');
                const minLevel = node.prerequisiteMinLevel ?? 2;
                prereqBox.createDiv({
                    cls: 'rpg-skill-tree-prereq-banner',
                    text: `${node.name} emerge cuando ${names} lleguen a nivel ${minLevel}.`
                });
            }
        }

        const imagePreview = header.createDiv({ cls: 'rpg-skill-tree-detail-art-preview' });
        this.renderSkillTreeArtFrame(imagePreview, node);

        const editNodeBtn = container.createEl('button', { text: 'Editar sub-skill', cls: 'rpg-full-width-btn secondary' });
        editNodeBtn.onclick = () => new SkillTreeNodeModal(this.app, this.plugin, node.school, () => this.render(), node.id).open();

        const changeImageBtn = container.createEl('button', { text: 'Cambiar imagen de la skill', cls: 'rpg-full-width-btn secondary' });
        changeImageBtn.onclick = () => new SkillTreeNodeImageModal(this.app, this.plugin, node.id, () => this.render()).open();

        const addQuestBtn = container.createEl('button', { text: '+ Quest/reto para este nodo', cls: 'rpg-full-width-btn secondary' });
        addQuestBtn.onclick = () => new SkillTreeQuestModal(this.app, this.plugin, node.id, () => this.render()).open();

        for (let level = 1; level <= node.maxLevel; level++) {
            const levelBox = container.createDiv({ cls: `rpg-skill-tree-level ${level <= (node.currentLevel || 0) ? 'complete' : ''}` });
            const progress = treeService.getLevelProgress(node.id, level);
            levelBox.createDiv({ cls: 'rpg-skill-tree-level-title', text: `Nivel ${level} • ${progress.completed}/${progress.total} quests` });

            const quests = treeService.getNodeQuests(node.id, level);
            if (quests.length === 0) {
                levelBox.createDiv({ cls: 'rpg-empty small', text: 'Sin retos todavía.' });
                continue;
            }

            quests.forEach(quest => {
                const questLocked = !unlocked && !quest.completed;
                const row = levelBox.createDiv({ cls: `rpg-skill-tree-quest ${quest.completed ? 'completed' : ''} ${questLocked ? 'locked' : ''}` });
                const info = row.createDiv({ cls: 'rpg-skill-tree-quest-info' });
                info.createDiv({ cls: 'rpg-skill-tree-quest-name', text: quest.name });
                if (quest.description) {
                    info.createDiv({ cls: 'rpg-skill-tree-quest-desc', text: quest.description });
                }
                const bossText = this.getQuestBossText(quest);
                const meta = `${DIFFICULTY[quest.difficulty || 'medium']?.label || quest.difficulty} • +${quest.xp}xp +${quest.gold}g${bossText ? ` • ${bossText}` : ''}`;
                info.createDiv({ cls: 'rpg-skill-tree-quest-meta', text: meta });

                if (questLocked) {
                    info.createDiv({ cls: 'rpg-skill-tree-quest-lock-msg', text: 'Bloqueado: completa prerequisitos del nodo.' });
                } else if (!quest.completed) {
                    const realIndex = this.plugin.settings.quests.indexOf(quest);
                    const completeBtn = row.createEl('button', { cls: 'rpg-complete-btn', text: '✓' });
                    completeBtn.onclick = async (event) => {
                        event.stopPropagation();
                        await this.plugin.completeQuest(realIndex);
                        this.render();
                    };
                }
            });
        }
    }

    getQuestBossText(quest) {
        if (!Array.isArray(quest.linkedBossIds) || quest.linkedBossIds.length === 0) return '';
        const bosses = (this.plugin.settings.bossFights || [])
            .filter(boss => quest.linkedBossIds.includes(boss.id))
            .map(boss => boss.name);
        return bosses.length > 0 ? `Boss: ${bosses.join(', ')} (${quest.bossDamage || 10} dmg)` : '';
    }

    // ============================================================================
    // QUESTS HUB - Combined Habits, Quests, Bad Habits
    // ============================================================================
    renderQuestsHub(container) {
        container.createEl('h3', { text: '⚔️ Quest Board' });

        // Sub-tab navigation
        const subTabs = [
            { id: 'habits', label: '📅 Daily Rituals', count: this.plugin.settings.habits.length },
            { id: 'quests', label: '🗡️ Quests', count: this.plugin.settings.quests.filter(q => !q.completed).length },
            { id: 'badhabits', label: '💀 Demons', count: this.plugin.settings.badHabits.length }
        ];

        const subTabNav = container.createDiv({ cls: 'rpg-subtab-nav' });
        subTabs.forEach(tab => {
            const tabBtn = subTabNav.createEl('button', {
                cls: `rpg-subtab-btn ${this.activeSubTab === tab.id ? 'active' : ''}`
            });
            tabBtn.innerHTML = `${tab.label} <span class="rpg-subtab-count">${tab.count}</span>`;
            tabBtn.onclick = () => { this.activeSubTab = tab.id; this.render(); };
        });

        // Sub-tab content
        const subContent = container.createDiv({ cls: 'rpg-subtab-content' });

        if (this.activeSubTab === 'habits') {
            this.renderHabits(subContent);
        } else if (this.activeSubTab === 'quests') {
            this.renderQuests(subContent);
        } else if (this.activeSubTab === 'badhabits') {
            this.renderBadHabits(subContent);
        }
    }

    // ============================================================================
    // ARENA TAB - Combined Boss Fights & Dungeon
    // ============================================================================
    renderArena(container) {
        container.createEl('h3', { text: '🐉 Battle Arena' });

        // Sub-tab navigation
        const s = this.plugin.settings;
        const activeBosses = s.bossFights.filter(b => !b.defeated).length;
        const hasDungeon = !!s.activeDungeon;

        const subTabs = [
            { id: 'boss', label: '🐉 Boss Fights', badge: activeBosses > 0 ? `${activeBosses} active` : '' },
            { id: 'dungeon', label: '🏰 Deep Work', badge: hasDungeon ? '⏳ In Progress' : '' }
        ];

        const subTabNav = container.createDiv({ cls: 'rpg-subtab-nav' });
        subTabs.forEach(tab => {
            const tabBtn = subTabNav.createEl('button', {
                cls: `rpg-subtab-btn ${this.activeArenaTab === tab.id ? 'active' : ''}`
            });
            tabBtn.innerHTML = tab.badge
                ? `${tab.label} <span class="rpg-subtab-badge">${tab.badge}</span>`
                : tab.label;
            tabBtn.onclick = () => { this.activeArenaTab = tab.id; this.render(); };
        });

        // Sub-tab content
        const subContent = container.createDiv({ cls: 'rpg-subtab-content' });

        if (this.activeArenaTab === 'boss') {
            this.renderBossFights(subContent);
        } else if (this.activeArenaTab === 'dungeon') {
            this.renderDungeon(subContent);
        }
    }

    // ============================================================================
    // TAVERN TAB - Combined Energy Station, Inn & Shop
    // ============================================================================
    renderTavern(container) {
        const s = this.plugin.settings;

        container.createEl('h3', { text: '🏨 The Tavern' });
        container.createEl('p', {
            text: 'Rest, recover, and spend your hard-earned gold...',
            cls: 'rpg-subtitle'
        });

        // Quick Stats Bar
        const statsBar = container.createDiv({ cls: 'rpg-tavern-stats' });
        statsBar.innerHTML = `
            <div class="rpg-tavern-stat">
                <span class="icon">❤️</span>
                <span class="value">${s.hp}/${s.maxHp}</span>
                <span class="label">HP</span>
            </div>
            <div class="rpg-tavern-stat">
                <span class="icon">⚡</span>
                <span class="value">${s.energy || 100}/${s.maxEnergy || 100}</span>
                <span class="label">Energy</span>
            </div>
            <div class="rpg-tavern-stat">
                <span class="icon">💰</span>
                <span class="value">${s.gold}</span>
                <span class="label">Gold</span>
            </div>
        `;

        // Energy & Mood Section
        const energySection = container.createDiv({ cls: 'rpg-tavern-section' });
        energySection.createEl('h4', { text: '⚡ Energy & Mood' });
        this.renderEnergyStation(energySection);

        // Shop Section
        const shopSection = container.createDiv({ cls: 'rpg-tavern-section' });
        shopSection.createEl('h4', { text: '🛍️ Reward Shop' });
        this.renderShop(shopSection);
    }

    // Progress Analysis - Works offline
    renderProgressAnalysis(container) {
        const s = this.plugin.settings;
        const analysisSection = container.createDiv({ cls: 'rpg-coach-section' });
        analysisSection.createEl('h4', { text: '📊 Your Progress Analysis' });

        // Calculate stats
        const sortedDomains = [...s.domains].sort((a, b) => b.score - a.score);
        const topDomain = sortedDomains[0];
        const weakestDomain = sortedDomains[sortedDomains.length - 1];
        const avgScore = Math.round(s.domains.reduce((sum, d) => sum + d.score, 0) / s.domains.length);

        const habitsToday = s.habits.filter(h => h.completed).length;
        const totalHabits = s.habits.length;
        const activeQuests = s.quests.filter(q => !q.completed).length;
        const completedQuests = s.quests.filter(q => q.completed).length;

        // Quadrant analysis
        const quadrantScores = calculateQuadrantScores(s.domains);
        const devLevel = getDevelopmentLevel(s.level);
        const devInfo = DEVELOPMENT_LEVELS[devLevel];

        // Display analysis
        const statsGrid = analysisSection.createDiv({ cls: 'rpg-analysis-grid' });

        const tierProgress = getTierProgress(s.level);
        const levelsToNext = getLevelsToNextTier(s.level);

        statsGrid.innerHTML = `
            <div class="rpg-analysis-card">
                <div class="rpg-analysis-icon">🎯</div>
                <div class="rpg-analysis-label">Overall Score</div>
                <div class="rpg-analysis-value">${avgScore}%</div>
            </div>
            <div class="rpg-analysis-card">
                <div class="rpg-analysis-icon">${devInfo.icon}</div>
                <div class="rpg-analysis-label">HUMAN ${devLevel}</div>
                <div class="rpg-analysis-value">${tierProgress}%</div>
                <div class="rpg-analysis-sublabel">${levelsToNext > 0 ? `${levelsToNext} to next` : 'Max tier!'}</div>
            </div>
            <div class="rpg-analysis-card">
                <div class="rpg-analysis-icon">✅</div>
                <div class="rpg-analysis-label">Habits Today</div>
                <div class="rpg-analysis-value">${habitsToday}/${totalHabits}</div>
            </div>
            <div class="rpg-analysis-card">
                <div class="rpg-analysis-icon">⚔️</div>
                <div class="rpg-analysis-label">Active Quests</div>
                <div class="rpg-analysis-value">${activeQuests}</div>
            </div>
        `;

        // Insights
        const insightsBox = analysisSection.createDiv({ cls: 'rpg-coach-insights' });
        insightsBox.createEl('strong', { text: '💡 Insights:' });

        const insights = [];

        // Strength insight
        insights.push(`Your strength is ${topDomain.icon} ${topDomain.name} (${topDomain.score}%). Keep building on this!`);

        // Growth area insight
        if (weakestDomain.score < 40) {
            insights.push(`Focus area: ${weakestDomain.icon} ${weakestDomain.name} (${weakestDomain.score}%) needs attention.`);
        }

        // Habit insight
        if (totalHabits === 0) {
            insights.push(`No habits yet! Start with just one small daily habit.`);
        } else if (habitsToday === totalHabits && totalHabits > 0) {
            insights.push(`Amazing! All habits completed today! 🎉`);
        } else if (habitsToday === 0 && totalHabits > 0) {
            insights.push(`No habits done yet today. Pick your easiest one to start!`);
        }

        // Quest insight
        if (activeQuests > 5) {
            insights.push(`You have ${activeQuests} active quests. Consider focusing on fewer for better results.`);
        } else if (activeQuests === 0) {
            insights.push(`No active quests! Create one to give yourself a meaningful goal.`);
        }

        // HP insight
        if (s.hp < s.maxHp * 0.3) {
            insights.push(`⚠️ Low HP! Rest at the Inn or log good sleep to recover.`);
        }

        const insightsList = insightsBox.createEl('ul');
        insights.forEach(insight => insightsList.createEl('li', { text: insight }));
    }

    // Daily Tip - Works offline
    renderDailyTip(container) {
        const s = this.plugin.settings;
        const tipSection = container.createDiv({ cls: 'rpg-coach-section' });
        tipSection.createEl('h4', { text: '💡 Personalized Tip' });

        // Get tip based on weakest domain
        const sortedDomains = [...s.domains].sort((a, b) => a.score - b.score);
        const focusDomain = sortedDomains[0];

        const domainTips = COACHING_TIPS[focusDomain.id] || COACHING_TIPS.psychologicalWellbeing;
        const todayIndex = new Date().getDate() % domainTips.length;
        const todayTip = domainTips[todayIndex];

        const tipCard = tipSection.createDiv({ cls: 'rpg-tip-card' });
        tipCard.createDiv({ cls: 'rpg-tip-domain', text: `For ${focusDomain.icon} ${focusDomain.name}:` });
        tipCard.createDiv({ cls: 'rpg-tip-text', text: todayTip.tip });
        tipCard.createDiv({ cls: 'rpg-tip-action', text: `💪 Action: ${todayTip.action}` });

        // New tip button
        const newTipBtn = tipSection.createEl('button', {
            text: '🔄 Get Another Tip',
            cls: 'rpg-mini-btn'
        });
        newTipBtn.onclick = () => {
            // Get random domain and tip
            const randomDomainId = s.domains[Math.floor(Math.random() * s.domains.length)].id;
            const tips = COACHING_TIPS[randomDomainId];
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            const domain = s.domains.find(d => d.id === randomDomainId);

            tipCard.innerHTML = `
                <div class="rpg-tip-domain">For ${domain.icon} ${domain.name}:</div>
                <div class="rpg-tip-text">${randomTip.tip}</div>
                <div class="rpg-tip-action">💪 Action: ${randomTip.action}</div>
            `;
        };
    }

    // Domain Advice - Works offline
    renderDomainAdvice(container) {
        const s = this.plugin.settings;
        const adviceSection = container.createDiv({ cls: 'rpg-coach-section' });
        adviceSection.createEl('h4', { text: '🎯 Quick Domain Tips' });

        const domainGrid = adviceSection.createDiv({ cls: 'rpg-domain-advice-grid' });

        // Show tips for 3 lowest scoring domains
        const sortedDomains = [...s.domains].sort((a, b) => a.score - b.score).slice(0, 3);

        sortedDomains.forEach(domain => {
            const tips = COACHING_TIPS[domain.id] || [];
            const randomTip = tips[Math.floor(Math.random() * tips.length)];

            const domainCard = domainGrid.createDiv({ cls: 'rpg-domain-advice-card' });
            domainCard.createDiv({ cls: 'rpg-domain-advice-header', text: `${domain.icon} ${domain.name} (${domain.score}%)` });

            if (randomTip) {
                domainCard.createDiv({ cls: 'rpg-domain-advice-tip', text: randomTip.tip });
            }
        });
    }

    // Motivation Section - Works offline
    renderMotivationSection(container) {
        const motivationSection = container.createDiv({ cls: 'rpg-coach-section' });
        motivationSection.createEl('h4', { text: '🔥 Daily Motivation' });

        // Get today's quote
        const todayIndex = new Date().getDate() % MOTIVATION_QUOTES.length;
        const quote = MOTIVATION_QUOTES[todayIndex];

        const quoteCard = motivationSection.createDiv({ cls: 'rpg-motivation-card' });
        quoteCard.createDiv({ cls: 'rpg-quote-text', text: `"${quote.quote}"` });
        quoteCard.createDiv({ cls: 'rpg-quote-source', text: `— ${quote.source}` });

        // New quote button
        const newQuoteBtn = motivationSection.createEl('button', {
            text: '🔄 New Quote',
            cls: 'rpg-mini-btn'
        });
        newQuoteBtn.onclick = () => {
            const randomQuote = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
            quoteCard.innerHTML = `
                <div class="rpg-quote-text">"${randomQuote.quote}"</div>
                <div class="rpg-quote-source">— ${randomQuote.source}</div>
            `;
        };
    }

    // AI Chat - Only with API key
    renderAIChat(container) {
        const s = this.plugin.settings;
        const chatSection = container.createDiv({ cls: 'rpg-coach-section rpg-ai-section' });
        chatSection.createEl('h4', { text: '🤖 AI Chat' });

        // Quick action buttons
        const actionsGrid = chatSection.createDiv({ cls: 'rpg-ai-actions-grid' });

        const actions = [
            { label: '💡 Get Advice', topic: 'general' },
            { label: '📊 Deep Analysis', topic: 'progress' },
            { label: '✨ Generate Quests', topic: 'quests' }
        ];

        actions.forEach(action => {
            const btn = actionsGrid.createEl('button', { cls: 'rpg-ai-action-btn' });
            btn.createSpan({ text: action.label });
            btn.onclick = async () => {
                if (action.topic === 'quests') {
                    new AIQuestGeneratorModal(this.app, this.plugin, () => this.render()).open();
                } else {
                    await this.sendQuickAction(action.topic);
                }
            };
        });

        // Chat messages
        const chatContainer = chatSection.createDiv({ cls: 'rpg-ai-chat-container' });

        if (this.aiChatMessages.length === 0 && s.ai?.chatHistory?.length > 0) {
            this.aiChatMessages = s.ai.chatHistory.slice(-10);
        }

        const messagesEl = chatContainer.createDiv({ cls: 'rpg-ai-messages' });

        if (this.aiChatMessages.length === 0) {
            messagesEl.createDiv({
                cls: 'rpg-ai-welcome',
                text: "👋 Ask me anything! I have full context of your progress, habits, and goals."
            });
        } else {
            this.aiChatMessages.forEach(msg => {
                const msgEl = messagesEl.createDiv({ cls: `rpg-ai-message ${msg.role}` });
                const contentEl = msgEl.createDiv({ cls: 'rpg-ai-message-content' });
                if (msg.role === 'assistant') {
                    contentEl.innerHTML = renderMarkdownToHtml(msg.content);
                } else {
                    contentEl.textContent = msg.content;
                }
            });
        }

        if (this.isAiLoading) {
            messagesEl.createDiv({ cls: 'rpg-ai-loading', text: '🤖 Thinking...' });
        }

        setTimeout(() => messagesEl.scrollTop = messagesEl.scrollHeight, 0);

        // Chat input
        const inputContainer = chatSection.createDiv({ cls: 'rpg-ai-input-container' });
        const chatInput = inputContainer.createEl('textarea', {
            placeholder: 'Ask your AI coach anything...',
            cls: 'rpg-ai-input'
        });
        chatInput.value = this.aiChatInput;
        chatInput.addEventListener('input', (e) => this.aiChatInput = e.target.value);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        const sendBtn = inputContainer.createEl('button', { text: 'Send', cls: 'rpg-ai-send-btn' });
        sendBtn.onclick = () => this.sendMessage();

        // Clear chat
        const clearBtn = chatSection.createEl('button', {
            text: '🗑️ Clear Chat',
            cls: 'rpg-mini-btn secondary'
        });
        clearBtn.onclick = async () => {
            this.aiChatMessages = [];
            if (s.ai) s.ai.chatHistory = [];
            await this.plugin.saveSettings();
            this.render();
        };
    }

    async sendQuickAction(topic) {
        this.isAiLoading = true;
        this.render();

        // Natural language display for each topic
        const topicDisplays = {
            general: 'Elder, what wisdom would you share with me today?',
            motivation: 'Elder, I need encouragement on my journey.',
            habits: 'Elder, help me understand my daily rituals better.',
            progress: 'Elder, analyze my progress and show me the way forward.'
        };

        try {
            const aiService = new AIService(this.plugin);
            const response = await aiService.getCoachingAdvice(topic);

            this.aiChatMessages.push(
                { role: 'user', content: topicDisplays[topic] || 'Elder, I seek your wisdom.' },
                { role: 'assistant', content: response }
            );

            // Check for first AI chat achievement
            const ach = this.plugin.settings.achievements.find(a => a.id === 'ai_coach_first');
            if (ach && !ach.unlocked) {
                ach.unlocked = true;
                this.plugin.settings.gold += ach.reward;
                this.plugin.settings.totalGoldEarned += ach.reward;
                await this.plugin.saveSettings();
                new Notice(`🏆 Achievement Unlocked: ${ach.name}! +${ach.reward}g`);
            }

            this.isAiLoading = false;
            this.render();
        } catch (error) {
            this.isAiLoading = false;
            new Notice(`❌ ${error.message}`);
            this.render();
        }
    }

    async sendMessage() {
        if (!this.aiChatInput.trim() || this.isAiLoading) return;

        const userMessage = this.aiChatInput.trim();
        this.aiChatInput = '';
        this.aiChatMessages.push({ role: 'user', content: userMessage });
        this.isAiLoading = true;
        this.render();

        try {
            const aiService = new AIService(this.plugin);
            const response = await aiService.chat(userMessage);

            this.aiChatMessages.push({ role: 'assistant', content: response });

            // Check for first AI chat achievement
            const ach = this.plugin.settings.achievements.find(a => a.id === 'ai_coach_first');
            if (ach && !ach.unlocked) {
                ach.unlocked = true;
                this.plugin.settings.gold += ach.reward;
                this.plugin.settings.totalGoldEarned += ach.reward;
                await this.plugin.saveSettings();
                new Notice(`🏆 Achievement Unlocked: ${ach.name}! +${ach.reward}g`);
            }

            this.isAiLoading = false;
            this.render();
        } catch (error) {
            this.isAiLoading = false;
            this.aiChatMessages.push({ role: 'assistant', content: `❌ Error: ${error.message}` });
            this.render();
        }
    }

    renderHabits(container) {
        const s = this.plugin.settings;
        const skillService = new SkillService(this.plugin);
        container.createEl("h3", { text: "📅 Daily Habits" });
        const habitsList = container.createDiv({ cls: "rpg-list" });

        if (s.habits.length === 0) {
            habitsList.createDiv({ cls: 'rpg-empty', text: 'No habits yet. Create one below!' });
        }

        s.habits.forEach((habit, index) => {
            const row = habitsList.createDiv({ cls: `rpg-list-item ${habit.completed ? 'completed' : ''}` });

            const cb = row.createEl("input", { type: "checkbox" });
            cb.checked = habit.completed;
            cb.disabled = habit.completed;
            cb.onclick = async () => {
                if (!habit.completed) {
                    await this.plugin.completeHabit(index);
                    this.render();
                }
            };

            const infoCol = row.createDiv({ cls: 'rpg-item-info' });
            const nameRow = infoCol.createDiv({ cls: 'rpg-item-name-row' });
            nameRow.createSpan({ text: habit.name });

            const diff = DIFFICULTY[habit.difficulty || 'medium'];
            nameRow.createSpan({ cls: `rpg-difficulty-badge ${diff.color}`, text: diff.label });

            if (habit.streak > 0) {
                nameRow.createSpan({ cls: 'rpg-streak', text: `🔥${habit.streak}` });
            }

            const domain = s.domains.find(d => d.id === habit.domain);
            const domainIcon = domain ? domain.icon : '📌';
            const multiplier = diff.multiplier;
            const streakBonus = Math.min(habit.streak * 0.1, 1);
            const finalXp = Math.round(habit.xp * multiplier * (1 + streakBonus));
            const finalGold = Math.round(habit.gold * multiplier * (1 + streakBonus));
            const linkedSkills = (habit.linkedSkillIds || [])
                .map(skillId => skillService.getSkill(skillId))
                .filter(Boolean);

            infoCol.createDiv({
                cls: 'rpg-item-meta',
                text: `${domainIcon} +${finalXp}xp +${finalGold}g`
            });

            if (linkedSkills.length > 0) {
                infoCol.createDiv({
                    cls: 'rpg-item-meta',
                    text: `Spells: ${linkedSkills.map(skill => skill.name).join(', ')} (+${habit.skillXp || 10} XP)`
                });
            }

            if (Array.isArray(habit.linkedBossIds) && habit.linkedBossIds.length > 0) {
                const bosses = (s.bossFights || [])
                    .filter(boss => habit.linkedBossIds.includes(boss.id))
                    .map(boss => boss.name);
                if (bosses.length > 0) {
                    infoCol.createDiv({
                        cls: 'rpg-item-meta',
                        text: `Boss: ${bosses.join(', ')} (${habit.bossDamage || 10} dmg)`
                    });
                }
            }

            const editBtn = row.createEl("button", { cls: "rpg-mini-btn", text: "Edit", title: "Editar hábito" });
            editBtn.onclick = () => {
                new NewHabitModal(this.app, this.plugin, () => this.render(), index).open();
            };

            const delBtn = row.createEl("button", {
                cls: "rpg-mini-btn",
                text: "✖",
                title: "Eliminar de Daily Rituals (no borra [habito::] de la nota semanal)"
            });
            delBtn.onclick = () => {
                new ConfirmDeleteHabitModal(this.app, this.plugin, index, () => this.render()).open();
            };
        });

        const addBtn = container.createEl("button", { text: "+ Add Habit", cls: "rpg-full-width-btn" });
        addBtn.onclick = () => new NewHabitModal(this.app, this.plugin, () => this.render()).open();
    }

    matchesQuestFilter(quest) {
        const school = this.questSchoolFilter || 'all';
        const query = (this.questSearchQuery || '').trim().toLowerCase();
        if (school !== 'all' && (quest.school || '') !== school) return false;
        if (!query) return true;
        const hay = `${quest.name || ''} ${quest.description || ''} ${quest.source || ''}`.toLowerCase();
        return hay.includes(query);
    }

    getQuestFilterSchools(quests) {
        const fromData = new Set(quests.map(q => q.school).filter(Boolean));
        const knownIds = SKILL_TREE_SCHOOLS.map(s => s.id);
        const ordered = [
            ...knownIds.filter(id => fromData.has(id)),
            ...[...fromData].filter(id => !knownIds.includes(id)).sort()
        ];
        return ordered;
    }

    renderQuests(container) {
        const s = this.plugin.settings;
        const treeService = new SkillTreeService(this.plugin);
        container.createEl("h3", { text: "⚔️ Quests & Missions" });

        // AI Quest Generator button
        if (s.ai?.openRouterApiKey) {
            const aiBtn = container.createEl("button", {
                text: "✨ Generate AI Quests",
                cls: "rpg-full-width-btn ai"
            });
            aiBtn.onclick = () => new AIQuestGeneratorModal(this.app, this.plugin, () => this.render()).open();
        }

        const activeQuests = s.quests.filter(q => !q.completed);
        const completedQuests = s.quests.filter(q => q.completed);
        const filterSchools = this.getQuestFilterSchools(s.quests);
        const filteredActive = activeQuests.filter(q => this.matchesQuestFilter(q));
        const filteredCompleted = completedQuests.filter(q => this.matchesQuestFilter(q));
        const hasFilter = (this.questSchoolFilter && this.questSchoolFilter !== 'all')
            || !!(this.questSearchQuery || '').trim();

        const filters = container.createDiv({ cls: 'rpg-quest-filters' });

        const searchRow = filters.createDiv({ cls: 'rpg-quest-search-row' });
        const searchInput = searchRow.createEl('input', {
            type: 'text',
            placeholder: 'Buscar quest… (nombre, descripción, pack)',
            cls: 'rpg-quest-search-input'
        });
        searchInput.value = this.questSearchQuery || '';
        searchInput.addEventListener('input', (e) => {
            this.questSearchQuery = e.target.value;
            this._questSearchCursor = e.target.selectionStart;
            this.render();
        });

        const schoolNav = filters.createDiv({ cls: 'rpg-skill-tree-schools rpg-quest-school-filters' });
        const allBtn = schoolNav.createEl('button', {
            text: `Todas (${activeQuests.length})`,
            cls: `rpg-skill-tree-school-btn ${this.questSchoolFilter === 'all' ? 'active' : ''}`
        });
        allBtn.onclick = () => {
            this.questSchoolFilter = 'all';
            this.render();
        };
        filterSchools.forEach(schoolId => {
            const count = activeQuests.filter(q => (q.school || '') === schoolId).length;
            const btn = schoolNav.createEl('button', {
                text: `${schoolId} (${count})`,
                cls: `rpg-skill-tree-school-btn school-${schoolId.toLowerCase()} ${this.questSchoolFilter === schoolId ? 'active' : ''}`
            });
            btn.onclick = () => {
                this.questSchoolFilter = schoolId;
                this.render();
            };
        });

        if (hasFilter) {
            filters.createDiv({
                cls: 'rpg-quest-filter-count',
                text: `Mostrando ${filteredActive.length} de ${activeQuests.length}`
            });
        }

        if (this._questSearchCursor != null) {
            const cursor = this._questSearchCursor;
            this._questSearchCursor = null;
            requestAnimationFrame(() => {
                searchInput.focus();
                const pos = Math.min(cursor, searchInput.value.length);
                searchInput.setSelectionRange(pos, pos);
            });
        }

        const questsList = container.createDiv({ cls: "rpg-list" });

        if (activeQuests.length === 0) {
            questsList.createDiv({ cls: 'rpg-empty', text: 'No active quests. Create an epic mission!' });
        } else if (filteredActive.length === 0) {
            questsList.createDiv({ cls: 'rpg-empty', text: 'Ninguna quest coincide con el filtro.' });
        }

        filteredActive.forEach((quest) => {
            const realIndex = s.quests.indexOf(quest);
            const row = questsList.createDiv({ cls: 'rpg-list-item quest' });

            const completeBtn = row.createEl("button", { cls: 'rpg-complete-btn', text: "✓" });
            completeBtn.onclick = async () => {
                await this.plugin.completeQuest(realIndex);
                this.render();
            };

            const infoCol = row.createDiv({ cls: 'rpg-item-info' });
            const nameRow = infoCol.createDiv({ cls: 'rpg-item-name-row' });
            nameRow.createSpan({ text: quest.name });

            if (quest.aiGenerated) {
                nameRow.createSpan({ cls: 'rpg-ai-badge', text: '✨ AI' });
            }

            if (quest.kind === 'skill-challenge') {
                const node = quest.skillNodeId ? treeService.getNode(quest.skillNodeId) : null;
                nameRow.createSpan({ cls: `rpg-skill-tree-badge school-${(quest.school || 'Autoridad').toLowerCase()}`, text: `${quest.school || node?.school || 'Skill'} Lv ${quest.skillLevel || 1}` });
                if (node) {
                    nameRow.createSpan({ cls: 'rpg-skill-tree-node-tag', text: node.name });
                }
            }

            const diff = DIFFICULTY[quest.difficulty || 'medium'];
            nameRow.createSpan({ cls: `rpg-difficulty-badge ${diff.color}`, text: diff.label });

            if (quest.deadline) {
                const deadline = new Date(quest.deadline);
                const now = new Date();
                const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
                const deadlineClass = daysLeft <= 1 ? 'urgent' : daysLeft <= 3 ? 'warning' : '';
                nameRow.createSpan({ cls: `rpg-deadline ${deadlineClass}`, text: `⏰ ${daysLeft}d` });
            }

            const domain = s.domains.find(d => d.id === quest.domain);
            const domainIcon = domain ? domain.icon : '📌';
            const bossText = this.getQuestBossText(quest);
            infoCol.createDiv({ cls: 'rpg-item-meta', text: `${domainIcon} +${quest.xp}xp +${quest.gold}g${bossText ? ` | ${bossText}` : ''}` });
            if (quest.description && quest.kind === 'skill-challenge') {
                infoCol.createDiv({ cls: 'rpg-item-meta', text: quest.description });
            }

            const delBtn = row.createEl("button", { cls: "rpg-mini-btn", text: "✖" });
            delBtn.onclick = async () => {
                await this.plugin.removeQuest(realIndex);
                this.render();
            };
        });

        if (completedQuests.length > 0) {
            const completedSection = container.createEl("details");
            const completedLabel = hasFilter
                ? `✅ Completed (${filteredCompleted.length}/${completedQuests.length})`
                : `✅ Completed (${completedQuests.length})`;
            completedSection.createEl("summary", { text: completedLabel });
            if (filteredCompleted.length === 0) {
                completedSection.createDiv({ cls: 'rpg-empty', text: 'Ninguna completada coincide con el filtro.' });
            } else {
                filteredCompleted.forEach(quest => {
                    const suffix = quest.kind === 'skill-challenge' ? ` (${quest.school || 'Skill'} Lv ${quest.skillLevel || 1})` : '';
                    completedSection.createDiv({ cls: 'rpg-completed-item', text: `✓ ${quest.name}${suffix}` });
                });
            }
        }

        const addBtn = container.createEl("button", { text: "+ New Quest", cls: "rpg-full-width-btn" });
        addBtn.onclick = () => new NewQuestModal(this.app, this.plugin, () => this.render()).open();
    }

    renderBadHabits(container) {
        const s = this.plugin.settings;
        container.createEl("h3", { text: "💀 Bad Habits" });
        container.createEl("p", { cls: 'rpg-subtitle', text: "Track habits you want to avoid. Triggering costs HP!" });

        const list = container.createDiv({ cls: "rpg-list bad-habits" });

        if (s.badHabits.length === 0) {
            list.createDiv({ cls: 'rpg-empty', text: 'No bad habits tracked yet.' });
        }

        s.badHabits.forEach((habit, index) => {
            const row = list.createDiv({ cls: 'rpg-list-item bad' });

            const triggerBtn = row.createEl("button", { cls: 'rpg-trigger-btn', text: "I did this 😔" });
            triggerBtn.onclick = async () => {
                await this.plugin.triggerBadHabit(index);
                this.render();
            };

            const infoCol = row.createDiv({ cls: 'rpg-item-info' });
            infoCol.createDiv({ cls: 'rpg-item-name', text: habit.name });
            infoCol.createDiv({ cls: 'rpg-item-meta bad', text: `-${habit.hpCost}HP -${habit.goldPenalty}g | Triggered: ${habit.triggerCount}x` });

            const delBtn = row.createEl("button", { cls: "rpg-mini-btn", text: "✖" });
            delBtn.onclick = async () => {
                await this.plugin.removeBadHabit(index);
                this.render();
            };
        });

        const addBtn = container.createEl("button", { text: "+ Track Bad Habit", cls: "rpg-full-width-btn bad" });
        addBtn.onclick = () => new NewBadHabitModal(this.app, this.plugin, () => this.render()).open();
    }

    renderShop(container) {
        const s = this.plugin.settings;
        container.createEl("h3", { text: "🛍️ Reward Shop" });

        const shopList = container.createDiv({ cls: "rpg-list" });

        if (s.rewards.length === 0) {
            shopList.createDiv({ cls: 'rpg-empty', text: 'No rewards yet. Add something to work towards!' });
        }

        s.rewards.forEach((reward, index) => {
            const row = shopList.createDiv({ cls: "rpg-list-item" });

            row.createDiv({ cls: "rpg-item-name", text: reward.name });
            row.createDiv({ cls: "rpg-item-cost", text: `${reward.cost}g` });

            const buyBtn = row.createEl("button", { cls: "rpg-buy-btn", text: "Buy" });
            if (s.gold < reward.cost) buyBtn.disabled = true;

            buyBtn.onclick = async () => {
                await this.plugin.buyReward(index);
                this.render();
            };

            const delBtn = row.createEl("button", { cls: "rpg-mini-btn", text: "✖" });
            delBtn.onclick = async () => {
                await this.plugin.removeReward(index);
                this.render();
            };
        });

        const addBtn = container.createEl("button", { text: "+ Add Reward", cls: "rpg-full-width-btn" });
        addBtn.onclick = () => new NewRewardModal(this.app, this.plugin, () => this.render()).open();
    }

    // ============================================================================
    // INN / HOTEL RECOVERY
    // ============================================================================
    renderInn(container) {
        const s = this.plugin.settings;
        container.createEl("h3", { text: "🏨 Rest & Recovery" });

        // Current HP status
        const hpStatus = container.createDiv({ cls: 'rpg-inn-hp-status' });
        const hpPercent = Math.round((s.hp / s.maxHp) * 100);
        hpStatus.innerHTML = `<span class="rpg-hp-display">❤️ ${s.hp} / ${s.maxHp} HP (${hpPercent}%)</span>`;

        if (s.hp >= s.maxHp) {
            hpStatus.createDiv({ cls: 'rpg-inn-full-hp', text: '✨ You are at full health!' });
        }

        // Gold display
        container.createDiv({ cls: 'rpg-inn-gold', text: `💰 Your Gold: ${s.gold}g` });

        // Inn tiers
        container.createEl("h4", { text: "Choose Your Rest" });
        const innGrid = container.createDiv({ cls: 'rpg-inn-grid' });

        INN_TIERS.forEach(inn => {
            const innCard = innGrid.createDiv({ cls: 'rpg-inn-card' });

            innCard.createDiv({ cls: 'rpg-inn-name', text: inn.name });
            innCard.createDiv({ cls: 'rpg-inn-desc', text: inn.desc });

            const statsRow = innCard.createDiv({ cls: 'rpg-inn-stats' });
            statsRow.createSpan({ text: `+${inn.hpRecover} HP`, cls: 'rpg-inn-hp' });
            statsRow.createSpan({ text: `${inn.cost}g`, cls: 'rpg-inn-cost' });

            const restBtn = innCard.createEl('button', {
                text: 'Rest Here',
                cls: 'rpg-inn-btn'
            });

            // Disable if not enough gold or already at full HP
            if (s.gold < inn.cost || s.hp >= s.maxHp) {
                restBtn.disabled = true;
                restBtn.classList.add('disabled');
            }

            restBtn.onclick = async () => {
                const success = await this.plugin.restAtInn(inn.id);
                if (success) this.render();
            };
        });

        // NPC Section
        container.createEl("h4", { text: "🗣️ Speak with NPCs", cls: 'rpg-npc-header' });
        const npcGrid = container.createDiv({ cls: 'rpg-npc-grid' });

        DEFAULT_NPCS.forEach(npc => {
            const npcCard = npcGrid.createDiv({ cls: 'rpg-npc-card' });

            npcCard.createDiv({ cls: 'rpg-npc-icon', text: npc.icon });
            npcCard.createDiv({ cls: 'rpg-npc-name', text: npc.name });
            npcCard.createDiv({ cls: 'rpg-npc-role', text: npc.role });

            const talkBtn = npcCard.createEl('button', {
                text: 'Talk',
                cls: 'rpg-npc-btn'
            });

            talkBtn.onclick = () => {
                const suggestion = this.plugin.getNPCQuestSuggestion(npc.id);
                new NPCDialogModal(this.app, this.plugin, npc, suggestion, () => this.render()).open();
            };
        });
    }

    // ============================================================================
    // ACTIVITY LOG
    // ============================================================================
    renderActivityLog(container) {
        const s = this.plugin.settings;
        container.createEl("h3", { text: "📜 Activity Log" });

        const log = s.activityLog || [];
        const archives = s.activityLogArchives || {};
        const archiveMonths = Object.keys(archives).sort().reverse();
        const currentMonth = this.plugin.getMonthKey(new Date());

        const actions = container.createDiv({ cls: 'rpg-log-actions' });
        const archiveBtn = actions.createEl('button', {
            text: '📦 Archivar mes anterior',
            cls: 'rpg-full-width-btn secondary'
        });
        archiveBtn.onclick = async () => {
            const prev = new Date();
            prev.setDate(1);
            prev.setMonth(prev.getMonth() - 1);
            const monthKey = this.plugin.getMonthKey(prev);
            const changed = this.plugin.archiveMonth(monthKey, { showNotice: true });
            if (changed) {
                await this.plugin.saveSettings();
                this.render();
            }
        };

        // Monthly archives (collapsed summaries)
        if (archiveMonths.length > 0) {
            const archivesSection = container.createEl('details', { cls: 'rpg-log-archives' });
            archivesSection.createEl('summary', { text: `📁 Archivos mensuales (${archiveMonths.length})` });

            archiveMonths.forEach(monthKey => {
                const archive = archives[monthKey];
                const monthBlock = archivesSection.createDiv({ cls: 'rpg-log-archive-month' });
                monthBlock.createEl('h4', { text: monthKey });
                monthBlock.createEl('p', {
                    cls: 'rpg-subtitle',
                    text: `${archive.rawEventsArchived || 0} eventos • archivado ${archive.archivedAt ? new Date(archive.archivedAt).toLocaleString() : '—'}`
                });

                const bossName = (bossId) => {
                    const boss = (s.bossFights || []).find(b => String(b.id) === String(bossId));
                    return boss ? boss.name : `Boss ${bossId}`;
                };

                const renderSummaries = (title, items) => {
                    if (!items || items.length === 0) return;
                    monthBlock.createEl('strong', { text: title });
                    items.forEach(item => {
                        const totalDmg = Object.values(item.bossDamageByBossId || {})
                            .reduce((sum, n) => sum + (Number(n) || 0), 0);
                        const dmgParts = Object.entries(item.bossDamageByBossId || {})
                            .map(([id, dmg]) => `${bossName(id)} ${dmg}`)
                            .join(', ');
                        const line = dmgParts
                            ? `${item.completions}× ${item.name} → ${totalDmg} dmg (${dmgParts})`
                            : `${item.completions}× ${item.name}`;
                        monthBlock.createDiv({ cls: 'rpg-log-archive-line', text: line });
                    });
                };

                renderSummaries('Hábitos', archive.habitSummaries);
                renderSummaries('Quests', archive.questSummaries);
            });
        }

        if (log.length === 0) {
            container.createDiv({ cls: 'rpg-empty', text: 'No activities yet. Start completing habits and quests!' });
        } else {
            container.createEl('p', { cls: 'rpg-subtitle', text: `${log.length} activities (mes actual: ${currentMonth})` });

            const logList = container.createDiv({ cls: 'rpg-activity-log' });

            // Group by date
            const groupedByDate = {};
            log.forEach(activity => {
                const date = new Date(activity.timestamp).toLocaleDateString();
                if (!groupedByDate[date]) groupedByDate[date] = [];
                groupedByDate[date].push(activity);
            });

            Object.entries(groupedByDate).forEach(([date, activities]) => {
                const dateHeader = logList.createDiv({ cls: 'rpg-log-date-header' });
                dateHeader.createSpan({ text: date === new Date().toLocaleDateString() ? '📅 Today' : `📅 ${date}` });

                activities.forEach(activity => {
                    const cat = ACTIVITY_CATEGORIES.find(c => c.id === activity.category) || { icon: '📝', label: 'Activity', color: '#888' };

                    const logItem = logList.createDiv({ cls: 'rpg-log-item' });

                    logItem.createDiv({
                        cls: 'rpg-log-icon',
                        text: cat.icon,
                        attr: { style: `background-color: ${cat.color}20; color: ${cat.color}` }
                    });

                    const logContent = logItem.createDiv({ cls: 'rpg-log-content' });
                    logContent.createDiv({ cls: 'rpg-log-desc', text: activity.description });

                    // Show details if any
                    if (activity.details) {
                        const detailsStr = Object.entries(activity.details)
                            .filter(([k, v]) => v !== undefined && v !== null)
                            .map(([k, v]) => {
                                if (k === 'xp') return `+${v} XP`;
                                if (k === 'gold') return `+${v}g`;
                                if (k === 'hpRecovered') return `+${v} HP`;
                                if (k === 'hpLost') return `-${v} HP`;
                                if (k === 'goldLost' || k === 'goldSpent') return `-${v}g`;
                                if (k === 'streak') return `🔥${v}`;
                                if (k === 'bossDamage' && Number(v) > 0) return `⚔${v} dmg`;
                                if (k === 'inFlow' && v) return '🌊 Flow';
                                if (k === 'category') {
                                    const catInfo = SKILL_CATEGORIES[v];
                                    return catInfo ? `${catInfo.icon} ${catInfo.name}` : v;
                                }
                                if (k === 'newLevel') return `Lv. ${v}`;
                                if (k === 'source') return `📓 ${v}`;
                                return null;
                            })
                            .filter(Boolean)
                            .join(' • ');

                        if (detailsStr) {
                            logContent.createDiv({ cls: 'rpg-log-details', text: detailsStr });
                        }
                    }

                    const time = new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    logItem.createDiv({ cls: 'rpg-log-time', text: time });
                });
            });
        }

        // Clear log button (keeps archives unless opted in)
        const clearBtn = container.createEl('button', {
            text: '🗑️ Clear Log',
            cls: 'rpg-full-width-btn secondary'
        });
        clearBtn.onclick = () => {
            new ConfirmClearActivityLogModal(this.app, this.plugin, () => this.render()).open();
        };
    }

    // ============================================================================
    // BOSS FIGHT SYSTEM
    // ============================================================================
    renderBossFights(container) {
        const s = this.plugin.settings;
        container.createEl("h3", { text: "🐉 Boss Fights" });
        container.createEl("p", { cls: 'rpg-subtitle', text: 'Long-term goals as epic battles. Complete tasks to damage the boss!' });

        // Active Boss Fights
        const activeBosses = (s.bossFights || []).filter(b => !b.defeated);
        const defeatedBosses = (s.bossFights || []).filter(b => b.defeated);

        if (activeBosses.length === 0) {
            const emptyState = container.createDiv({ cls: 'rpg-empty-boss' });
            emptyState.createEl('p', { text: '🗡️ No active boss fights.' });
            emptyState.createEl('p', { text: 'Create a boss to turn your big goals into epic battles!' });
        }

        // Render active bosses
        activeBosses.forEach((boss, index) => {
            const visual = getActiveBossPhaseVisual(boss);
            const bossCard = container.createDiv({
                cls: `rpg-boss-card active phase-${visual.phase} ${bossUsesTome(boss.tier) ? boss.tier : ''}`
            });
            if (visual.cardBgColor) {
                bossCard.style.setProperty('--boss-card-bg', visual.cardBgColor);
            }
            if (visual.hpBarColor) {
                bossCard.style.setProperty('--boss-hp-color', visual.hpBarColor);
            }

            const editBtn = bossCard.createEl('button', {
                cls: 'rpg-boss-edit-pencil',
                text: '✏️',
                attr: { type: 'button', title: 'Editar boss' }
            });
            editBtn.onclick = () => {
                new NewBossFightModal(this.app, this.plugin, () => this.render(), boss.id).open();
            };

            const bossHeader = bossCard.createDiv({ cls: 'rpg-boss-header' });
            this.renderBossVisual(bossHeader, boss);
            const bossInfo = bossHeader.createDiv({ cls: 'rpg-boss-info' });
            bossInfo.createEl('h4', { text: boss.name });
            if (visual.phaseCount > 1) {
                bossInfo.createDiv({
                    cls: 'rpg-boss-phase-badge',
                    text: `Fase ${visual.phase} / ${visual.phaseCount}`
                });
            }
            if (boss.tier === 'soberano') {
                bossInfo.createDiv({ cls: 'rpg-boss-tier soberano', text: 'Nivel Soberano' });
            } else if (boss.tier === 'primordial') {
                bossInfo.createDiv({ cls: 'rpg-boss-tier primordial', text: 'Nivel Primordial' });
            } else if (boss.tier && BOSS_TIERS[boss.tier]) {
                bossInfo.createDiv({ cls: 'rpg-boss-tier', text: BOSS_TIERS[boss.tier].label });
            }
            bossInfo.createDiv({ cls: 'rpg-boss-desc', text: boss.description });

            // HP Bar
            const hpPercent = Math.max(0, (boss.currentHp / boss.maxHp) * 100);
            const hpBar = bossCard.createDiv({ cls: 'rpg-boss-hp' });
            hpBar.createDiv({ cls: 'rpg-boss-hp-label', text: `HP: ${boss.currentHp} / ${boss.maxHp}` });
            const hpBarBg = hpBar.createDiv({ cls: 'rpg-boss-hp-bar' });
            const fillCls = visual.stripedHp
                ? 'rpg-boss-hp-fill rpg-boss-hp-fill--striped'
                : 'rpg-boss-hp-fill';
            hpBarBg.createDiv({ cls: fillCls, attr: { style: `width: ${hpPercent}%` } });

            // Linked Tasks
            bossCard.createDiv({ cls: 'rpg-boss-tasks-label', text: '⚔️ Damage Sources:' });
            const tasksList = bossCard.createDiv({ cls: 'rpg-boss-tasks' });
            tasksList.createDiv({ text: '• Complete habits linked to this boss', cls: 'rpg-boss-task-hint' });
            tasksList.createDiv({ text: '• Complete quests linked to this boss', cls: 'rpg-boss-task-hint' });

            this.renderBossLootSection(bossCard, boss);

            // Action buttons
            const actions = bossCard.createDiv({ cls: 'rpg-boss-actions' });

            const attackBtn = actions.createEl('button', { text: '⚔️ Manual Attack (10 DMG, 5g)', cls: 'rpg-boss-btn attack' });
            attackBtn.onclick = async () => {
                if (s.gold >= 5) {
                    s.gold -= 5;
                    const bossIndex = s.bossFights.findIndex(b => String(b.id) === String(boss.id));
                    await this.plugin.damageBoss(bossIndex, 10);
                    this.render();
                } else {
                    new Notice('❌ Not enough gold!');
                }
            };

            const abandonBtn = actions.createEl('button', { text: '🏳️ Abandon', cls: 'rpg-boss-btn abandon' });
            abandonBtn.onclick = async () => {
                if (confirm(`Abandon the fight against ${boss.name}?`)) {
                    s.bossFights.splice(s.bossFights.indexOf(boss), 1);
                    await this.plugin.saveSettings();
                    this.render();
                }
            };
        });

        // Create New Boss Button
        const createBtn = container.createEl('button', { text: '+ Create Boss Fight', cls: 'rpg-full-width-btn primary' });
        createBtn.onclick = () => new NewBossFightModal(this.app, this.plugin, () => this.render()).open();

        // Defeated Bosses (collapsed)
        if (defeatedBosses.length > 0) {
            const defeatedSection = container.createEl('details', { cls: 'rpg-defeated-bosses' });
            defeatedSection.createEl('summary', { text: `🏆 Defeated Bosses (${defeatedBosses.length})` });

            defeatedBosses.forEach(boss => {
                const card = defeatedSection.createDiv({ cls: 'rpg-boss-card defeated' });
                card.createSpan({ text: boss.icon || '🐉' });
                card.createSpan({ text: ` ${boss.name}`, cls: 'rpg-boss-defeated-name' });
                card.createSpan({ text: ` - Defeated!`, cls: 'rpg-boss-defeated-label' });
            });
        }

        // Stats
        container.createDiv({ cls: 'rpg-boss-stats', text: `👑 Total Bosses Defeated: ${s.totalBossesDefeated || 0}` });
    }

    // ============================================================================
    // DUNGEON SYSTEM (Deep Work / Focus Sessions)
    // ============================================================================
    renderDungeon(container) {
        const s = this.plugin.settings;
        container.createEl("h3", { text: "🏰 Dungeon - Deep Work" });
        container.createEl("p", { cls: 'rpg-subtitle', text: 'Enter focused work sessions. Slay task monsters to earn rewards!' });

        // Check if dungeon is active
        if (s.activeDungeon && s.activeDungeon.active) {
            this.renderActiveDungeon(container, s.activeDungeon);
            return;
        }

        // Dungeon Entry
        const entrySection = container.createDiv({ cls: 'rpg-dungeon-entry' });
        entrySection.createEl('h4', { text: '⚔️ Enter the Dungeon' });

        // Duration selection
        const durationGrid = entrySection.createDiv({ cls: 'rpg-dungeon-duration-grid' });

        const durations = [
            { minutes: 25, name: 'Quick Raid', icon: '🥉', desc: '25 min focus', tier: 'bronze' },
            { minutes: 50, name: 'Standard Delve', icon: '🥈', desc: '50 min focus', tier: 'silver' },
            { minutes: 90, name: 'Deep Expedition', icon: '🥇', desc: '90 min focus', tier: 'gold' },
            { minutes: 120, name: 'Epic Marathon', icon: '💎', desc: '2 hour focus', tier: 'diamond' }
        ];

        durations.forEach(dur => {
            const reward = DUNGEON_REWARDS[dur.tier];
            const card = durationGrid.createDiv({ cls: `rpg-dungeon-card tier-${dur.tier}` });

            card.createDiv({ cls: 'rpg-dungeon-icon', text: dur.icon });
            card.createDiv({ cls: 'rpg-dungeon-name', text: dur.name });
            card.createDiv({ cls: 'rpg-dungeon-desc', text: dur.desc });
            card.createDiv({ cls: 'rpg-dungeon-rewards', text: `${reward.xpPerMinute}x XP/min • +${reward.goldBonus}g bonus` });

            card.onclick = () => {
                this.startDungeon(dur.minutes, dur.tier);
            };
        });

        // Stats
        const statsSection = container.createDiv({ cls: 'rpg-dungeon-stats' });
        statsSection.createDiv({ text: `🏰 Dungeons Cleared: ${s.totalDungeonsCleared || 0}` });
        statsSection.createDiv({ text: `⏱️ Total Focus Time: ${Math.floor((s.totalFocusMinutes || 0) / 60)}h ${(s.totalFocusMinutes || 0) % 60}m` });
    }

    renderActiveDungeon(container, dungeon) {
        const s = this.plugin.settings;

        const activeSection = container.createDiv({ cls: 'rpg-dungeon-active' });
        activeSection.createEl('h4', { text: `⚔️ ${dungeon.tier.toUpperCase()} DUNGEON IN PROGRESS` });

        // Timer display
        const elapsed = Math.floor((Date.now() - dungeon.startTime) / 1000 / 60);
        const remaining = Math.max(0, dungeon.targetMinutes - elapsed);

        const timerDisplay = activeSection.createDiv({ cls: 'rpg-dungeon-timer' });
        timerDisplay.createDiv({ cls: 'rpg-dungeon-time', text: `${remaining} min remaining` });

        // Progress bar
        const progress = Math.min(100, (elapsed / dungeon.targetMinutes) * 100);
        const progressBar = activeSection.createDiv({ cls: 'rpg-dungeon-progress' });
        progressBar.createDiv({ cls: 'rpg-dungeon-progress-fill', attr: { style: `width: ${progress}%` } });

        // Monster tasks
        activeSection.createEl('h5', { text: '👾 Task Monsters' });
        const monsterList = activeSection.createDiv({ cls: 'rpg-dungeon-monsters' });

        if (!dungeon.tasks || dungeon.tasks.length === 0) {
            monsterList.createDiv({ cls: 'rpg-empty', text: 'Add tasks to slay during your focus session!' });
        }

        (dungeon.tasks || []).forEach((task, idx) => {
            const taskRow = monsterList.createDiv({ cls: `rpg-dungeon-task ${task.slain ? 'slain' : ''}` });
            taskRow.createSpan({ text: task.slain ? '💀' : '👾', cls: 'rpg-dungeon-task-icon' });
            taskRow.createSpan({ text: task.name, cls: 'rpg-dungeon-task-name' });

            if (!task.slain) {
                const slayBtn = taskRow.createEl('button', { text: '⚔️ Slay', cls: 'rpg-mini-btn' });
                slayBtn.onclick = async () => {
                    dungeon.tasks[idx].slain = true;
                    dungeon.monstersSlain = (dungeon.monstersSlain || 0) + 1;
                    await this.plugin.saveSettings();
                    this.render();
                    new Notice(`👾 Task slain: ${task.name}!`);
                };
            }
        });

        // Add task button
        const addTaskBtn = activeSection.createEl('button', { text: '+ Add Task Monster', cls: 'rpg-full-width-btn secondary' });
        addTaskBtn.onclick = () => {
            const taskName = prompt('Enter task to slay:');
            if (taskName) {
                if (!dungeon.tasks) dungeon.tasks = [];
                dungeon.tasks.push({ name: taskName, slain: false });
                this.plugin.saveSettings();
                this.render();
            }
        };

        // Action buttons
        const actionRow = activeSection.createDiv({ cls: 'rpg-dungeon-actions' });

        const completeBtn = actionRow.createEl('button', { text: '✅ Complete Dungeon', cls: 'rpg-dungeon-btn complete' });
        completeBtn.onclick = () => this.completeDungeon();

        const abandonBtn = actionRow.createEl('button', { text: '🏳️ Abandon', cls: 'rpg-dungeon-btn abandon' });
        abandonBtn.onclick = async () => {
            if (confirm('Abandon this dungeon? You will lose progress.')) {
                s.activeDungeon = null;
                await this.plugin.saveSettings();
                this.render();
            }
        };
    }

    async startDungeon(minutes, tier) {
        const s = this.plugin.settings;
        s.activeDungeon = {
            active: true,
            startTime: Date.now(),
            targetMinutes: minutes,
            tier: tier,
            tasks: [],
            monstersSlain: 0
        };
        await this.plugin.saveSettings();
        this.render();
        new Notice(`🏰 Entering ${tier} dungeon! ${minutes} minutes of focused work begins.`);
    }

    async completeDungeon() {
        const s = this.plugin.settings;
        const dungeon = s.activeDungeon;

        if (!dungeon) return;

        const elapsed = Math.floor((Date.now() - dungeon.startTime) / 1000 / 60);
        const reward = DUNGEON_REWARDS[dungeon.tier];
        const difficulty = GAME_DIFFICULTY[s.gameDifficulty || 'normal'];

        // Calculate rewards
        const baseXP = Math.floor(elapsed * reward.xpPerMinute);
        const monsterBonus = (dungeon.monstersSlain || 0) * 5;
        const goldBonus = elapsed >= dungeon.targetMinutes ? reward.goldBonus : Math.floor(reward.goldBonus / 2);

        const finalXP = Math.round((baseXP + monsterBonus) * difficulty.xpMultiplier);
        const finalGold = Math.round(goldBonus * difficulty.goldMultiplier);

        // Apply rewards
        s.xp += finalXP;
        s.gold += finalGold;
        s.totalFocusMinutes = (s.totalFocusMinutes || 0) + elapsed;
        s.totalDungeonsCleared = (s.totalDungeonsCleared || 0) + 1;

        // Log activity
        this.plugin.logActivity('dungeon_complete', `Cleared ${dungeon.tier} dungeon`, {
            xp: finalXP,
            gold: finalGold,
            minutes: elapsed,
            monstersSlain: dungeon.monstersSlain || 0
        });

        // Clear dungeon
        s.activeDungeon = null;
        await this.plugin.saveSettings();

        new Notice(`🏰 Dungeon Cleared!\n+${finalXP} XP | +${finalGold}g\n${elapsed} min focused | ${dungeon.monstersSlain || 0} tasks slain`);
        this.render();
    }

    // ============================================================================
    // ENERGY STATION (Rest, Mood, Sleep Tracking)
    // ============================================================================
    renderEnergyStation(container) {
        const s = this.plugin.settings;
        container.createEl("h3", { text: "⚡ Energy Station" });
        container.createEl("p", { cls: 'rpg-subtitle', text: 'Track your energy, mood, and rest. Recovery is part of the game!' });

        // Energy Bar
        const energySection = container.createDiv({ cls: 'rpg-energy-display' });
        const energyPercent = Math.round(((s.energy || 100) / (s.maxEnergy || 100)) * 100);
        energySection.innerHTML = `
            <div class="rpg-energy-header">
                <span>⚡ Energy: ${s.energy || 100} / ${s.maxEnergy || 100}</span>
                <span class="rpg-energy-percent">${energyPercent}%</span>
            </div>
            <div class="rpg-energy-bar">
                <div class="rpg-energy-fill" style="width: ${energyPercent}%"></div>
            </div>
        `;

        // HP Bar too
        const hpPercent = Math.round((s.hp / s.maxHp) * 100);
        const hpSection = container.createDiv({ cls: 'rpg-hp-display-station' });
        hpSection.innerHTML = `
            <div class="rpg-hp-header">
                <span>❤️ HP: ${s.hp} / ${s.maxHp}</span>
                <span class="rpg-hp-percent">${hpPercent}%</span>
            </div>
            <div class="rpg-hp-bar-station">
                <div class="rpg-hp-fill-station" style="width: ${hpPercent}%"></div>
            </div>
        `;

        // Mood Check-in
        container.createEl('h4', { text: '😊 How are you feeling?' });
        const moodGrid = container.createDiv({ cls: 'rpg-mood-grid' });

        MOOD_OPTIONS.forEach(mood => {
            const moodBtn = moodGrid.createDiv({ cls: 'rpg-mood-btn' });
            moodBtn.createDiv({ cls: 'rpg-mood-icon', text: mood.icon });
            moodBtn.createDiv({ cls: 'rpg-mood-label', text: mood.label });

            moodBtn.onclick = async () => {
                await this.logMood(mood);
            };
        });

        // Sleep Log
        container.createEl('h4', { text: '😴 Log Sleep Quality' });
        const sleepGrid = container.createDiv({ cls: 'rpg-sleep-grid' });

        SLEEP_QUALITY.forEach(sleep => {
            const sleepBtn = sleepGrid.createDiv({ cls: 'rpg-sleep-btn' });
            sleepBtn.createSpan({ text: sleep.icon });
            sleepBtn.createSpan({ text: ` ${sleep.label}` });
            const restore = sleep.hpRestore >= 0 ? `+${sleep.hpRestore}` : sleep.hpRestore;
            sleepBtn.createSpan({ text: ` (${restore} HP)`, cls: 'rpg-sleep-restore' });

            sleepBtn.onclick = async () => {
                await this.logSleep(sleep);
            };
        });

        // Inn Section (moved from separate tab)
        container.createEl('h4', { text: '🏨 Rest at Inn' });
        const innGrid = container.createDiv({ cls: 'rpg-inn-grid' });

        INN_TIERS.forEach(inn => {
            const innCard = innGrid.createDiv({ cls: 'rpg-inn-card-mini' });
            innCard.createDiv({ cls: 'rpg-inn-name', text: inn.name });
            innCard.createDiv({ cls: 'rpg-inn-stats', text: `+${inn.hpRecover} HP | ${inn.cost}g` });

            const restBtn = innCard.createEl('button', { text: 'Rest', cls: 'rpg-inn-btn-mini' });
            if (s.gold < inn.cost || s.hp >= s.maxHp) restBtn.disabled = true;

            restBtn.onclick = async () => {
                const success = await this.plugin.restAtInn(inn.id);
                if (success) this.render();
            };
        });

        // Recent Mood Log
        const moodLog = s.moodLog || [];
        if (moodLog.length > 0) {
            const logSection = container.createEl('details', { cls: 'rpg-mood-log-section' });
            logSection.createEl('summary', { text: `📊 Recent Mood Log (${moodLog.length})` });

            moodLog.slice(0, 7).forEach(entry => {
                const mood = MOOD_OPTIONS.find(m => m.id === entry.moodId);
                const date = new Date(entry.timestamp).toLocaleDateString();
                const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                logSection.createDiv({ cls: 'rpg-mood-log-entry', text: `${mood?.icon || '❓'} ${mood?.label || 'Unknown'} - ${date} ${time}` });
            });
        }
    }

    async logMood(mood) {
        const s = this.plugin.settings;

        // Update energy based on mood
        s.energy = Math.max(0, Math.min(s.maxEnergy || 100, (s.energy || 100) + mood.energyBonus));

        // Log mood
        if (!s.moodLog) s.moodLog = [];
        s.moodLog.unshift({
            moodId: mood.id,
            timestamp: new Date().toISOString(),
            energyBonus: mood.energyBonus
        });
        s.moodLog = s.moodLog.slice(0, 30); // Keep last 30

        s.lastMoodCheck = new Date().toISOString();
        await this.plugin.saveSettings();

        const energyText = mood.energyBonus >= 0 ? `+${mood.energyBonus}` : mood.energyBonus;
        new Notice(`${mood.icon} Mood logged: ${mood.label} (${energyText} Energy)`);
        this.render();
    }

    async logSleep(sleep) {
        const s = this.plugin.settings;

        // Apply HP restore/damage
        if (sleep.hpRestore >= 0) {
            s.hp = Math.min(s.maxHp, s.hp + sleep.hpRestore);
        } else {
            s.hp = Math.max(1, s.hp + sleep.hpRestore);
        }

        // Restore some energy with good sleep
        if (sleep.hpRestore > 0) {
            s.energy = Math.min(s.maxEnergy || 100, (s.energy || 50) + sleep.hpRestore);
        }

        // Log sleep
        if (!s.sleepLog) s.sleepLog = [];
        s.sleepLog.unshift({
            quality: sleep.id,
            timestamp: new Date().toISOString(),
            hpRestore: sleep.hpRestore
        });
        s.sleepLog = s.sleepLog.slice(0, 14); // Keep 2 weeks

        // Log activity
        this.plugin.logActivity('inn_rest', `Logged sleep: ${sleep.label}`, { hpRecovered: sleep.hpRestore });

        await this.plugin.saveSettings();

        const hpText = sleep.hpRestore >= 0 ? `+${sleep.hpRestore}` : sleep.hpRestore;
        new Notice(`${sleep.icon} Sleep logged: ${sleep.label} (${hpText} HP)`);
        this.render();
    }

    renderAchievements(container) {
        const s = this.plugin.settings;
        container.createEl("h3", { text: "🏆 Achievements" });

        const unlockedCount = s.achievements.filter(a => a.unlocked).length;
        container.createEl("p", { cls: 'rpg-subtitle', text: `${unlockedCount} / ${s.achievements.length} unlocked` });

        const grid = container.createDiv({ cls: 'rpg-achievements-grid' });

        s.achievements.forEach(ach => {
            const card = grid.createDiv({ cls: `rpg-achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}` });
            card.createDiv({ cls: 'rpg-achievement-icon', text: ach.unlocked ? ach.icon : '🔒' });
            card.createDiv({ cls: 'rpg-achievement-name', text: ach.name });
            card.createDiv({ cls: 'rpg-achievement-desc', text: ach.desc });
            if (!ach.unlocked) {
                card.createDiv({ cls: 'rpg-achievement-reward', text: `🎁 ${ach.reward}g` });
            }
        });
    }
}

function listSkillIconPaths(app) {
    const folder = String(SKILL_ICONS_FOLDER || 'RpgImages/skills').replace(/\\/g, '/');
    return app.vault.getFiles()
        .filter(file => {
            const p = file.path.replace(/\\/g, '/');
            return p.startsWith(`${folder}/`) && /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name);
        })
        .sort((a, b) => {
            const stemA = a.name.replace(/\.[^.]+$/, '');
            const stemB = b.name.replace(/\.[^.]+$/, '');
            const numA = Number(stemA);
            const numB = Number(stemB);
            const aIsNum = Number.isFinite(numA) && String(numA) === stemA;
            const bIsNum = Number.isFinite(numB) && String(numB) === stemB;
            if (aIsNum && bIsNum) return numA - numB;
            return a.name.localeCompare(b.name, undefined, { numeric: true });
        })
        .map(file => file.path.replace(/\\/g, '/'));
}

/**
 * Icon carousel with prev/next arrows. Mutates imagePath via setImagePath + onChange.
 * Returns { root, getIndex } or null if no icons.
 */
function mountSkillIconCarousel(app, parentEl, { imagePath, setImagePath, onChange }) {
    const icons = listSkillIconPaths(app);
    const root = parentEl.createDiv({ cls: 'rpg-skill-icon-carousel' });

    if (icons.length === 0) {
        root.createEl('p', {
            cls: 'rpg-subtitle',
            text: `No hay iconos en ${SKILL_ICONS_FOLDER}/`
        });
        return { root, icons, index: -1 };
    }

    const normalize = (p) => (p || '').replace(/\\/g, '/');
    let index = icons.findIndex(p => p === normalize(imagePath));
    if (index < 0) {
        index = 0;
        setImagePath(icons[0]);
        onChange?.(icons[0]);
    }

    const prevBtn = root.createEl('button', {
        cls: 'rpg-skill-icon-carousel-btn',
        text: '‹',
        attr: { type: 'button', 'aria-label': 'Icono anterior' }
    });
    const center = root.createDiv({ cls: 'rpg-skill-icon-carousel-center' });
    const previewSlot = center.createDiv({ cls: 'rpg-skill-icon-carousel-preview' });
    const meta = center.createDiv({ cls: 'rpg-skill-icon-carousel-meta' });
    const nextBtn = root.createEl('button', {
        cls: 'rpg-skill-icon-carousel-btn',
        text: '›',
        attr: { type: 'button', 'aria-label': 'Icono siguiente' }
    });

    const refreshMeta = () => {
        meta.empty();
        meta.createEl('span', {
            cls: 'rpg-skill-icon-carousel-count',
            text: `${index + 1} / ${icons.length}`
        });
        meta.createEl('span', {
            cls: 'rpg-skill-icon-carousel-name',
            text: icons[index].split('/').pop()
        });
    };

    const go = (delta) => {
        index = (index + delta + icons.length) % icons.length;
        const path = icons[index];
        setImagePath(path);
        refreshMeta();
        onChange?.(path);
    };

    prevBtn.onclick = (e) => {
        e.preventDefault();
        go(-1);
    };
    nextBtn.onclick = (e) => {
        e.preventDefault();
        go(1);
    };
    refreshMeta();

    return { root, icons, getIndex: () => index, previewSlot, refreshMeta };
}

class SkillTreeNodeModal extends Modal {
    constructor(app, plugin, defaultSchool, onSubmit, editNodeId = null) {
        super(app);
        this.plugin = plugin;
        this.defaultSchool = defaultSchool || 'Autoridad';
        this.onSubmit = onSubmit;
        this.editNodeId = editNodeId;
    }

    onOpen() {
        const { contentEl } = this;
        const treeService = new SkillTreeService(this.plugin);
        treeService.ensureSkillTree();
        const existingNode = this.editNodeId ? treeService.getNode(this.editNodeId) : null;
        const isEdit = Boolean(existingNode);

        contentEl.createEl('h2', { text: isEdit ? 'Editar sub-skill' : 'Crear sub-skill' });
        contentEl.createEl('p', { cls: 'rpg-modal-subtitle', text: 'Define rol, prerequisitos y escuela de la habilidad.' });

        let name = existingNode?.name || '';
        let school = existingNode?.school || this.defaultSchool;
        let parentId = existingNode?.parentId || '';
        let maxLevel = existingNode?.maxLevel || 3;
        let description = existingNode?.description || '';
        let imagePath = existingNode?.imagePath || '';
        let nodeRole = existingNode?.nodeRole || 'standard';
        let prerequisiteMinLevel = existingNode?.prerequisiteMinLevel ?? 2;
        const prerequisiteNodeIds = new Set(existingNode?.prerequisiteNodeIds || []);

        contentEl.createEl('p', { cls: 'rpg-modal-subtitle', text: 'Icono de habilidad' });
        const carouselHost = contentEl.createDiv();
        let carousel = null;
        const refreshPreview = () => {
            if (!carousel?.previewSlot) return;
            carousel.previewSlot.empty();
            renderSkillTreeArtPreview(
                this.app,
                carousel.previewSlot,
                school,
                imagePath,
                existingNode?.currentLevel || 1
            );
        };
        carousel = mountSkillIconCarousel(this.app, carouselHost, {
            imagePath,
            setImagePath: (path) => { imagePath = path; },
            onChange: () => refreshPreview()
        });
        refreshPreview();

        const refreshPrereqSection = () => {
            if (this.prereqSection) this.prereqSection.empty();
            if (nodeRole !== 'emergent') return;

            this.prereqSection.createEl('h3', { text: 'Prerequisitos (componentes)' });
            const schoolNodes = treeService.getNodes().filter(node =>
                node.school === school && node.id !== this.editNodeId
            );
            if (schoolNodes.length === 0) {
                this.prereqSection.createEl('p', { text: 'No hay otros nodos en esta escuela.', cls: 'rpg-subtitle' });
                return;
            }
            schoolNodes.forEach(node => {
                new Setting(this.prereqSection)
                    .setName(node.name)
                    .setDesc(`${SKILL_TREE_NODE_ROLES[node.nodeRole || 'standard']?.label || 'Estándar'} • Lv ${node.currentLevel || 0}/${node.maxLevel}`)
                    .addToggle(toggle => {
                        toggle.setValue(prerequisiteNodeIds.has(node.id));
                        toggle.onChange(value => {
                            if (value) prerequisiteNodeIds.add(node.id);
                            else prerequisiteNodeIds.delete(node.id);
                        });
                    });
            });
        };

        new Setting(contentEl)
            .setName('Nombre')
            .addText(text => text
                .setPlaceholder('Ej: Compasión')
                .setValue(name)
                .onChange(value => name = value));

        new Setting(contentEl)
            .setName('Escuela')
            .addDropdown(dd => {
                SKILL_TREE_SCHOOLS.forEach(s => dd.addOption(s.id, s.name));
                dd.setValue(school);
                dd.onChange(value => {
                    school = value;
                    refreshPreview();
                    refreshPrereqSection();
                });
            });

        new Setting(contentEl)
            .setName('Rol')
            .setDesc('Componente = base. Emergente = requiere otros nodos en nivel mínimo.')
            .addDropdown(dd => {
                Object.values(SKILL_TREE_NODE_ROLES).forEach(role => dd.addOption(role.id, role.label));
                dd.setValue(nodeRole);
                dd.onChange(value => {
                    nodeRole = value;
                    refreshPrereqSection();
                    minLevelSetting.settingEl.style.display = value === 'emergent' ? '' : 'none';
                });
            });

        this.prereqSection = contentEl.createDiv({ cls: 'rpg-skill-tree-prereq-modal' });
        refreshPrereqSection();

        let minLevelSetting;
        minLevelSetting = new Setting(contentEl)
            .setName('Nivel mínimo en prerequisitos')
            .setDesc('Cada prerequisito debe alcanzar este nivel para desbloquear la práctica.')
            .addText(text => {
                text.setValue(String(prerequisiteMinLevel));
                text.onChange(value => prerequisiteMinLevel = Number(value) || 2);
            });
        if (nodeRole !== 'emergent') minLevelSetting.settingEl.style.display = 'none';

        new Setting(contentEl)
            .setName('Agrupación visual (opcional)')
            .setDesc('Solo afecta layout legacy; el gating usa prerequisitos.')
            .addDropdown(dd => {
                dd.addOption('', 'Raíz de la escuela');
                treeService.getNodes()
                    .filter(node => node.id !== this.editNodeId)
                    .forEach(node => dd.addOption(node.id, `${node.school} / ${node.name}`));
                dd.setValue(parentId);
                dd.onChange(value => parentId = value);
            });

        new Setting(contentEl)
            .setName('Niveles')
            .addDropdown(dd => {
                ['1', '2', '3', '4', '5'].forEach(value => dd.addOption(value, value));
                dd.setValue(String(maxLevel));
                dd.onChange(value => maxLevel = Number(value));
            });

        new Setting(contentEl)
            .setName('Descripcion')
            .addTextArea(text => text
                .setPlaceholder('Que entrena esta sub-skill y cuando se considera funcional.')
                .setValue(description)
                .onChange(value => description = value));

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText(isEdit ? 'Guardar cambios' : 'Crear sub-skill')
                .setCta()
                .onClick(async () => {
                    if (!name.trim()) {
                        new Notice('La sub-skill necesita un nombre.');
                        return;
                    }
                    if (nodeRole === 'emergent' && prerequisiteNodeIds.size === 0) {
                        new Notice('Una habilidad emergente necesita al menos un prerequisito.');
                        return;
                    }

                    const payload = {
                        name,
                        school,
                        parentId,
                        maxLevel,
                        description,
                        imagePath,
                        nodeRole,
                        prerequisiteNodeIds: Array.from(prerequisiteNodeIds),
                        prerequisiteMinLevel
                    };

                    if (isEdit) {
                        treeService.updateNode(this.editNodeId, payload);
                    } else {
                        treeService.createNode(payload);
                    }

                    await this.plugin.saveSettings();
                    new Notice(isEdit ? `Sub-skill actualizada: ${name}` : `Sub-skill creada: ${name}`);
                    this.onSubmit();
                    this.close();
                }));
    }

    onClose() { this.contentEl.empty(); }
}

function renderVaultImageInModal(app, parentEl, imagePath, options = {}) {
    const { className = 'rpg-vault-image-wrap', placeholder = '?' } = options;
    const wrapper = parentEl.createDiv({ cls: className });
    const trimmedPath = (imagePath || '').trim();

    if (trimmedPath) {
        const file = app.vault.getAbstractFileByPath(trimmedPath);
        if (file) {
            const img = wrapper.createEl('img', { cls: 'rpg-vault-image' });
            img.src = app.vault.adapter.getResourcePath(file.path);
            img.alt = '';
            return wrapper;
        }
    }

    wrapper.createDiv({ cls: 'rpg-vault-image-placeholder', text: placeholder });
    return wrapper;
}

function renderSkillTreeArtPreview(app, parentEl, school, imagePath, currentLevel = 1) {
    const borderPath = getSkillTreeBorderPath(school, currentLevel);
    const tier = getSkillTreeBorderTier(currentLevel);
    const ornateCls = borderPath ? ` has-ornate-frame tier-lv${tier}` : '';
    const frame = parentEl.createDiv({
        cls: `rpg-skill-tree-node-art school-${String(school || 'Autoridad').toLowerCase()} rpg-modal-art-preview${ornateCls}`
    });
    const outer = frame.createDiv({ cls: 'rpg-skill-tree-art-outer' });
    if (borderPath) {
        renderVaultImageInModal(app, outer, borderPath, {
            className: 'rpg-skill-tree-art-frame',
            placeholder: ''
        });
    }
    const inner = outer.createDiv({ cls: 'rpg-skill-tree-art-inner' });
    renderVaultImageInModal(app, inner, imagePath, { className: 'rpg-skill-tree-art-image', placeholder: '?' });
    return frame;
}

class SkillTreeNodeImageModal extends Modal {
    constructor(app, plugin, nodeId, onSubmit) {
        super(app);
        this.plugin = plugin;
        this.nodeId = nodeId;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        const treeService = new SkillTreeService(this.plugin);
        const node = treeService.getNode(this.nodeId);
        if (!node) {
            contentEl.createEl('p', { text: 'Nodo no encontrado.' });
            return;
        }

        contentEl.createEl('h2', { text: 'Imagen de la sub-skill' });
        contentEl.createEl('p', { cls: 'rpg-modal-subtitle', text: node.name });

        let imagePath = node.imagePath || '';
        const carouselHost = contentEl.createDiv();
        let carousel = null;
        const refreshPreview = () => {
            if (!carousel?.previewSlot) return;
            carousel.previewSlot.empty();
            renderSkillTreeArtPreview(
                this.app,
                carousel.previewSlot,
                node.school,
                imagePath,
                node.currentLevel || 1
            );
        };
        carousel = mountSkillIconCarousel(this.app, carouselHost, {
            imagePath,
            setImagePath: (path) => { imagePath = path; },
            onChange: () => refreshPreview()
        });
        refreshPreview();

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Guardar imagen')
                .setCta()
                .onClick(async () => {
                    treeService.updateNode(node.id, { imagePath });
                    await this.plugin.saveSettings();
                    new Notice('Imagen actualizada.');
                    this.onSubmit();
                    this.close();
                }));
    }

    onClose() { this.contentEl.empty(); }
}

class SkillTreeQuestModal extends Modal {
    constructor(app, plugin, nodeId, onSubmit) {
        super(app);
        this.plugin = plugin;
        this.nodeId = nodeId;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        const treeService = new SkillTreeService(this.plugin);
        const node = treeService.getNode(this.nodeId);
        if (!node) {
            contentEl.createEl('p', { text: 'Nodo no encontrado.' });
            return;
        }

        contentEl.createEl('h2', { text: 'Crear quest/reto' });
        contentEl.createEl('p', { cls: 'rpg-modal-subtitle', text: `${node.name} • ${node.school}` });

        let name = '';
        let description = '';
        let skillLevel = Math.min((node.currentLevel || 0) + 1, node.maxLevel);
        let difficulty = 'medium';
        let domain = 'communityVitality';
        let xp = 25;
        let gold = 10;
        let bossDamage = 10;
        const linkedBossIds = new Set();

        new Setting(contentEl)
            .setName('Nombre')
            .addText(text => text
                .setPlaceholder('Ej: pedir una recomendacion incomoda')
                .onChange(value => name = value));

        new Setting(contentEl)
            .setName('Descripcion del reto')
            .addTextArea(text => text
                .setPlaceholder('Accion observable que debe completarse.')
                .onChange(value => description = value));

        new Setting(contentEl)
            .setName('Nivel del nodo')
            .addDropdown(dd => {
                for (let level = 1; level <= node.maxLevel; level++) {
                    dd.addOption(String(level), `Nivel ${level}`);
                }
                dd.setValue(String(skillLevel));
                dd.onChange(value => skillLevel = Number(value));
            });

        new Setting(contentEl).setName('Life Domain').addDropdown(dd => {
            this.plugin.settings.domains.forEach(d => dd.addOption(d.id, `${d.icon} ${d.name}`));
            dd.setValue(domain);
            dd.onChange(value => domain = value);
        });

        new Setting(contentEl).setName('Difficulty').addDropdown(dd => {
            Object.keys(DIFFICULTY).forEach(d => dd.addOption(d, DIFFICULTY[d].label));
            dd.setValue(difficulty);
            dd.onChange(value => difficulty = value);
        });

        new Setting(contentEl).setName('XP Reward').addText(text => {
            text.setValue(String(xp));
            text.onChange(value => xp = Number(value));
        });

        new Setting(contentEl).setName('Gold Reward').addText(text => {
            text.setValue(String(gold));
            text.onChange(value => gold = Number(value));
        });

        new Setting(contentEl).setName('Boss damage').setDesc('Daño aplicado a cada boss vinculado cuando se complete la quest.').addText(text => {
            text.setValue(String(bossDamage));
            text.onChange(value => bossDamage = Number(value));
        });

        const activeBosses = (this.plugin.settings.bossFights || []).filter(boss => !boss.defeated);
        contentEl.createEl('h3', { text: 'Bosses vinculados' });
        if (activeBosses.length === 0) {
            contentEl.createEl('p', { text: 'No hay bosses activos. La quest puede crearse sin boss vinculado.', cls: 'rpg-subtitle' });
        } else {
            activeBosses.forEach(boss => {
                new Setting(contentEl)
                    .setName(boss.name)
                    .setDesc(`${boss.currentHp}/${boss.maxHp} HP`)
                    .addToggle(toggle => toggle.onChange(value => {
                        if (value) linkedBossIds.add(boss.id);
                        else linkedBossIds.delete(boss.id);
                    }));
            });
        }

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Crear quest')
                .setCta()
                .onClick(async () => {
                    if (!name.trim()) {
                        new Notice('La quest necesita un nombre.');
                        return;
                    }

                    treeService.createQuest({
                        skillNodeId: node.id,
                        skillLevel,
                        name,
                        description,
                        difficulty,
                        xp,
                        gold,
                        domain,
                        linkedBossIds: Array.from(linkedBossIds),
                        bossDamage
                    });
                    await this.plugin.saveSettings();
                    new Notice(`Quest creada: ${name}`);
                    this.onSubmit();
                    this.close();
                }));
    }

    onClose() { this.contentEl.empty(); }
}

// ============================================================================
// DEV/MAIN-CORE.JS
// ============================================================================

/* Main Core - Stable code (extracted modules removed) */

/* Life RPG Plugin v3.0 - AI Coach Edition */


// Simple markdown to HTML converter for AI messages
function renderMarkdownToHtml(text) {
    if (!text) return '';
    return text
        // Escape HTML first
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Bold: **text** or __text__
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.+?)__/g, '<strong>$1</strong>')
        // Italic: *text* or _text_
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        // Code: `text`
        .replace(/`(.+?)`/g, '<code>$1</code>')
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        // Wrap in paragraph
        .replace(/^(.*)$/, '<p>$1</p>');
}

const VIEW_TYPE_HERO = "life-rpg-hero-view";

// ============================================================================
// MULTI-PROVIDER AI CONFIGURATION
// ============================================================================

// AI Provider Configurations

// ============================================================================
// CONSTANTS, SKILLSERVICE, AND HEROVIEW EXTRACTED TO src/
// This core contains: AI Service, Embedding Service, Journal Analyzer,
// Modals, Settings Tab, and Main Plugin Class
// ============================================================================


// Default AI Settings with multi-provider support
const DEFAULT_AI_SETTINGS = {
    // Provider selection
    provider: 'openrouter', // 'openrouter', 'openai', 'anthropic', 'google'

    // API Keys for each provider
    apiKeys: {
        openrouter: '',
        openai: '',
        anthropic: '',
        google: ''
    },

    // Selected models per provider
    selectedModels: {
        openrouter: 'google/gemini-2.0-flash-exp',
        openai: 'gpt-4o-mini',
        anthropic: 'claude-sonnet-4-20250514',
        google: 'gemini-2.0-flash-exp'
    },

    // Embedding provider (can be different from chat provider)
    embeddingProvider: 'openrouter',
    selectedEmbeddingModels: {
        openrouter: 'openai/text-embedding-3-small',
        openai: 'text-embedding-3-small',
        google: 'text-embedding-004'
    },

    // General settings
    temperature: 0.7,
    maxTokens: 1000,
    chatHistory: [],

    // Embedding settings
    embeddingEnabled: true,

    // Legacy support - will be migrated
    openRouterApiKey: '',
    selectedModel: '',
    embeddingModel: '',

    // Elder Persona Customization
    elderPersona: {
        name: 'The Elder',
        title: 'Keeper of Wisdom',
        greeting: 'Greetings, traveler. I have watched many journeys unfold. What wisdom do you seek today?',
        personality: 'wise'
    },
    customSystemPrompt: '',
    customKnowledge: '',
    elderPrompts: {
        guidance: 'Based on my current life journey, what single piece of wisdom would most benefit me right now?',
        challenge: 'I seek a worthy challenge. Based on my weakest areas, suggest one meaningful quest I can undertake.',
        reflection: 'Help me reflect on my progress. What patterns do you see in my journey so far?',
        motivation: 'I need encouragement. Speak to me about my strengths and the path ahead.'
    },
    elderMemoryEnabled: true,
    elderMemoryCount: 3
};

// Helper to get current API key
function getActiveApiKey(settings) {
    const provider = settings.ai?.provider || 'openrouter';
    // Check new structure first, then legacy
    return settings.ai?.apiKeys?.[provider] || settings.ai?.openRouterApiKey || '';
}

// Helper to get current chat model
function getActiveChatModel(settings) {
    const provider = settings.ai?.provider || 'openrouter';
    return settings.ai?.selectedModels?.[provider] || settings.ai?.selectedModel || 'gpt-4o-mini';
}

// Helper to get current embedding model
function getActiveEmbeddingModel(settings) {
    const provider = settings.ai?.embeddingProvider || settings.ai?.provider || 'openrouter';
    return settings.ai?.selectedEmbeddingModels?.[provider] || settings.ai?.embeddingModel || 'text-embedding-3-small';
}

// Journal Intelligence Settings
const DEFAULT_JOURNAL_SETTINGS = {
    enabled: true,
    journalFolder: 'Journal',
    journalTag: '#journal',
    scanMode: 'folder', // 'folder' or 'tag'
    lastSyncDate: null,
    recentAnalysis: [],
    domainKeywords: {
        health: ['exercise', 'gym', 'sleep', 'workout', 'run', 'walk', 'meditation', 'yoga', 'fitness', 'diet'],
        psychologicalWellbeing: ['happy', 'grateful', 'peace', 'calm', 'anxious', 'stressed', 'sad', 'joy', 'mindful', 'therapy'],
        education: ['learned', 'study', 'read', 'course', 'skill', 'practice', 'book', 'tutorial', 'research', 'training'],
        timeUse: ['productive', 'focused', 'wasted time', 'procrastinated', 'balanced', 'scheduled', 'planned', 'prioritized'],
        communityVitality: ['friend', 'family', 'social', 'helped', 'connected', 'lonely', 'community', 'relationship', 'support'],
        livingStandards: ['money', 'salary', 'invest', 'budget', 'expense', 'save', 'income', 'financial', 'purchase', 'earning'],
        culturalResilience: ['creative', 'art', 'music', 'culture', 'tradition', 'identity', 'heritage', 'expression', 'authentic'],
        goodGovernance: ['decision', 'boundary', 'said no', 'priority', 'goal', 'plan', 'commitment', 'responsibility', 'choice'],
        ecologicalAwareness: ['nature', 'environment', 'recycle', 'plant', 'outdoor', 'sustainable', 'green', 'eco', 'conservation']
    },
    sentimentKeywords: {
        positive: ['achieved', 'grateful', 'happy', 'success', 'proud', 'love', 'excited', 'progress', 'accomplished', 'wonderful', 'amazing', 'great', 'fantastic', 'blessed', 'thankful'],
        negative: ['failed', 'stressed', 'anxious', 'sad', 'angry', 'frustrated', 'overwhelmed', 'tired', 'exhausted', 'worried', 'depressed', 'disappointed', 'difficult', 'struggling', 'terrible']
    },
    // Embedding storage for semantic search
    embeddings: [] // Array of { filePath, fileName, date, embedding, summary }
};

// Elder Personality Presets
const ELDER_PERSONALITIES = {
    wise: {
        name: 'Wise Sage',
        style: 'Speak with ancient wisdom and measured words. Use metaphors from nature and the journey of life. Be thoughtful and reflective.',
        tone: 'Calm, patient, and insightful. Like a mentor who has seen many seasons pass.'
    },
    motivational: {
        name: 'Battle Mentor',
        style: 'Speak with energy and conviction. Rally the hero to action. Celebrate victories and reframe setbacks as training.',
        tone: 'Encouraging, energetic, and empowering. Like a coach before an important battle.'
    },
    analytical: {
        name: 'Scholar',
        style: 'Speak with precision and logic. Analyze patterns and provide structured insights. Focus on strategies and systems.',
        tone: 'Clear, methodical, and thorough. Like a strategist planning the next move.'
    },
    friendly: {
        name: 'Companion',
        style: 'Speak warmly and casually. Be supportive like a trusted friend. Share in both joys and struggles.',
        tone: 'Warm, empathetic, and relatable. Like a friend by the campfire.'
    },
    philosophical: {
        name: 'Mystic',
        style: 'Speak in riddles and deeper meanings. Encourage self-discovery through questions. Focus on meaning and purpose.',
        tone: 'Mysterious, profound, and thought-provoking. Like a sage from ancient scrolls.'
    }
};

// HUMAN 3.0 Framework Deep Knowledge Base
const HUMAN_3_KNOWLEDGE_BASE = `
## THE HUMAN 3.0 FRAMEWORK - Complete Knowledge Base

### Core Philosophy
The HUMAN 3.0 framework views life as a game of conscious evolution. Unlike games that end, this game's purpose is continuous growth toward becoming the fullest expression of oneself. The framework integrates ancient wisdom (Buddhist concepts of suffering and attachment, Stoic philosophy of control) with modern psychology (Csikszentmihalyi's Flow, Maslow's hierarchy, Positive Psychology).

### The Three Stages of Human Evolution

**HUMAN 1.0 - The NPC (Non-Player Character) Stage**
- Lives reactively, following scripts written by others (society, family, media)
- Decisions driven by fear, social approval, and unconscious patterns
- Believes happiness comes from external circumstances
- Common traps: comparing to others, seeking validation, victim mentality
- The wake-up call: Moments of dissonance when the script no longer works
- Growth path: Develop self-awareness through reflection, questioning assumptions
- Key insight: "I am not my thoughts, I am the one observing them"

**HUMAN 2.0 - The Player Stage**
- Takes ownership of life choices and outcomes
- Sets personal goals rather than following others' expectations
- Understands that growth comes from challenge, not comfort
- Develops skills deliberately through practice and feedback
- Common traps: over-optimization, burnout, neglecting relationships for achievement
- Growth path: Master the fundamentals, build sustainable systems, find mentors
- Key insight: "I am the author of my story, not just a character in it"

**HUMAN 3.0 - The Creator Stage**
- Creates value and systems that help others evolve
- Transcends personal achievement to focus on contribution
- Sees setbacks as data, not failure; process over outcome
- Lives in alignment with deeper purpose and values
- Operates from abundance rather than scarcity
- Growth path: Mentor others, build legacy projects, integrate all quadrants
- Key insight: "The game is not about winning, but about helping others play better"

### The Four Quadrants of Being

**🧠 MIND QUADRANT (Psychological Well-being + Education)**
The inner world of thoughts, emotions, beliefs, and knowledge.

Signs of strength: Emotional regulation, growth mindset, curiosity, self-awareness, resilience
Signs of weakness: Anxiety, fixed mindset, rumination, inability to learn from mistakes
How to strengthen:
- Daily reflection/journaling practice
- Learning something new regularly
- Therapy or coaching for deep patterns
- Meditation for thought observation
- Reading diverse perspectives

Imbalance patterns:
- Mind > Body: Overthinking, analysis paralysis, neglecting physical health
- Mind > Spirit: Isolation, believing you can figure everything out alone
- Mind > Vocation: Ideas without execution, eternal student syndrome

**💪 BODY QUADRANT (Health + Time Use)**
The physical vessel and how you spend your limited time.

Signs of strength: Energy, vitality, disciplined routines, effective time management
Signs of weakness: Fatigue, poor sleep, reactive scheduling, no boundaries
How to strengthen:
- Consistent sleep schedule (the foundation)
- Regular movement (not just exercise, but daily activity)
- Nutrition awareness (fuel quality matters)
- Time blocking and saying no
- Recovery as part of performance

Imbalance patterns:
- Body > Mind: All action, no reflection; busy but not progressing
- Body > Spirit: Self-focused fitness, neglecting relationships
- Body > Vocation: Health obsession without productive output

**🌟 SPIRIT QUADRANT (Community + Cultural + Ecological)**
Connection to others, to heritage, and to the world beyond self.

Signs of strength: Deep relationships, sense of belonging, cultural identity, environmental awareness
Signs of weakness: Loneliness, disconnection, lost identity, apathy toward the world
How to strengthen:
- Regular quality time with loved ones (not just presence, but attention)
- Participating in community/groups with shared values
- Exploring and honoring your cultural roots
- Spending time in nature
- Acts of service without expectation

Imbalance patterns:
- Spirit > Mind: Over-dependence on others' opinions, lost sense of self
- Spirit > Body: Neglecting self-care for others (martyrdom)
- Spirit > Vocation: All relationships, no personal accomplishment

**💼 VOCATION QUADRANT (Living Standards + Good Governance)**
Your craft, contribution to the world, and self-leadership.

Signs of strength: Financial stability, clear boundaries, purposeful work, good decision-making
Signs of weakness: Money anxiety, inability to say no, unfulfilling work, poor choices
How to strengthen:
- Develop marketable skills deliberately
- Create multiple income streams
- Practice decision frameworks (not just intuition)
- Set and enforce boundaries
- Align work with values, not just income

Imbalance patterns:
- Vocation > Mind: Workaholic without self-awareness
- Vocation > Body: Sacrificing health for career
- Vocation > Spirit: Success but loneliness; rich but disconnected

### The Three Phases of Growth

**Dissonance Phase**
- Something feels off; the old ways no longer work
- Resistance to change meets the necessity of change
- Often triggered by life events: loss, failure, milestone birthday, health scare
- The gift: Motivation to change
- The danger: Numbing the dissonance instead of listening to it
- Guidance: "This discomfort is not your enemy—it is the call to your next level"

**Uncertainty Phase**
- Actively exploring new ways of being
- Trying new habits, relationships, beliefs
- Feeling lost is normal and necessary
- The gift: Accelerated learning (1.5x XP)
- The danger: Giving up too soon, returning to old patterns
- Guidance: "The path appears by walking. You cannot see the full journey from here"

**Discovery Phase**
- Found what works; experiencing flow and alignment
- Habits feel natural, progress is visible
- Confidence in the new identity
- The gift: Peak performance and learning (2.0x XP)
- The danger: Complacency, forgetting that growth is ongoing
- Guidance: "Enjoy this season, but know that new dissonance will come—and that is good"

### Psychic Entropy
The mental disorder that comes from too many unresolved concerns, unmet goals, and internal conflicts.
- High entropy = scattered attention, anxiety, inability to focus
- Low entropy = clear mind, present, able to engage fully
- Reduced by: Completing tasks, making decisions, accepting what cannot be changed
- Increased by: Procrastination, avoiding hard conversations, living out of alignment

### Analysis Framework for Guidance

When analyzing a hero's journey, consider:

1. **Development Level Fit**: Is their challenge appropriate for their level?
   - HUMAN 1.0 needs awareness practices, not complex systems
   - HUMAN 2.0 needs skill-building and consistency
   - HUMAN 3.0 needs contribution and legacy focus

2. **Quadrant Balance**: Where is the imbalance?
   - Identify the weakest quadrant
   - Check if strength in one area is compensating for weakness in another
   - Sustainable growth requires all four quadrants

3. **Phase Appropriateness**: What does their current phase need?
   - Dissonance: Validation and gentle challenge to act
   - Uncertainty: Encouragement and permission to experiment
   - Discovery: Appreciation and preparation for next growth cycle

4. **Energy Management**: Is HP (life energy) being honored?
   - Low HP = focus on recovery before new challenges
   - High HP = ready for stretch goals
   - Chronic low HP = systemic issue in Body or Mind quadrant

5. **The Next Small Step**: What is one action that would create momentum?
   - Not the perfect action, but the possible action
   - Something they can do today
   - Connected to their weakest area but not overwhelming
`;

// Build system prompt with customizations
function buildElderSystemPrompt(settings) {
    const ai = settings.ai || {};
    const persona = ai.elderPersona || DEFAULT_AI_SETTINGS.elderPersona;
    const personality = ELDER_PERSONALITIES[persona.personality] || ELDER_PERSONALITIES.wise;

    let prompt = `You are ${persona.name}, ${persona.title} - a wise guide who has mastered the HUMAN 3.0 framework through centuries of observing human journeys.

## Your Character
${personality.style}
${personality.tone}

${HUMAN_3_KNOWLEDGE_BASE}

## How You Analyze and Guide

When a traveler seeks your wisdom:

1. **Read their story carefully** - Understand their current level, phase, quadrant balance, and energy
2. **Identify the core pattern** - What is the deeper lesson their situation is teaching?
3. **Connect to the framework** - Which aspect of HUMAN 3.0 is most relevant to their question?
4. **Offer actionable wisdom** - Not just philosophy, but a specific next step they can take
5. **Honor their autonomy** - You guide, but they must walk their own path

## Your Communication Style
- Address them as "traveler", "hero", or "seeker"
- Reference their specific journey details when giving advice
- Weave HUMAN 3.0 concepts naturally into your responses
- Be concise but profound (2-3 paragraphs unless they ask for more)
- Use RPG language naturally (quests, experience, levels, strength, growth)
- Always end with something actionable or reflective

## Important Principles
- Never shame or judge; all stages of the journey have value
- Recognize that setbacks are part of growth, not failure
- Balance challenge with compassion
- Focus on progress, not perfection
- Remember: you serve their growth, not your own wisdom`;

    // Add custom knowledge if provided
    if (ai.customKnowledge && ai.customKnowledge.trim()) {
        prompt += `\n\n## Personal Knowledge About This Hero:\n${ai.customKnowledge}`;
    }

    // Add custom system prompt if provided
    if (ai.customSystemPrompt && ai.customSystemPrompt.trim()) {
        prompt += `\n\n## Additional Instructions:\n${ai.customSystemPrompt}`;
    }

    return prompt;
}

// Legacy constant for backwards compatibility (uses full knowledge base)
const LIFE_COACH_SYSTEM_PROMPT = `You are The Elder, Keeper of Wisdom - a wise guide who has mastered the HUMAN 3.0 framework.

${HUMAN_3_KNOWLEDGE_BASE}

## How You Speak:
- Address them as "traveler", "hero", or "seeker"
- Speak with ancient wisdom and measured words
- Connect advice to their specific situation and the framework
- Be concise but profound (2-3 paragraphs max)
- Use RPG language naturally
- Always offer something actionable`;

// ============================================================================
// HUMAN 3.0 FRAMEWORK - Life Game Theory Integration
// ============================================================================

// Four Quadrants of Human Development
const QUADRANTS = [
    { id: 'mind', name: 'Mind', icon: '🧠', color: '#9b59b6', desc: 'Personal mental world - thoughts, beliefs, emotions' },
    { id: 'body', name: 'Body', icon: '💪', color: '#e74c3c', desc: 'Personal physical world - health, appearance, behavior' },
    { id: 'spirit', name: 'Spirit', icon: '🌟', color: '#f1c40f', desc: 'Collective mental world - relationships, meaning, community' },
    { id: 'vocation', name: 'Vocation', icon: '💼', color: '#3498db', desc: 'Collective physical world - work, systems, contribution' }
];

// Development Levels (Human 1.0 → 2.0 → 3.0)
const DEVELOPMENT_LEVELS = {
    '1.0': {
        name: 'NPC',
        title: 'Conformist',
        icon: '👤',
        desc: 'Following scripts, reactive to environment',
        minLevel: 1,
        maxLevel: 100,
        journey: 'Journey to Self-Awareness'
    },
    '2.0': {
        name: 'Player',
        title: 'Individualist',
        icon: '🎮',
        desc: 'Setting own goals, actively shaping reality',
        minLevel: 101,
        maxLevel: 200,
        journey: 'Journey to Mastery'
    },
    '3.0': {
        name: 'Creator',
        title: 'Synthesist',
        icon: '✨',
        desc: 'Creating systems, strategic mastery',
        minLevel: 201,
        maxLevel: 300,
        journey: 'Journey to Transcendence'
    }
};

// Phases of Development
const PHASES = {
    dissonance: { name: 'Dissonance', icon: '😤', color: '#e74c3c', desc: 'Ready for change, seeking new challenges', xpMultiplier: 1.0 },
    uncertainty: { name: 'Uncertainty', icon: '🌊', color: '#f39c12', desc: 'Taking risks, exploring new territory', xpMultiplier: 1.5 },
    discovery: { name: 'Discovery', icon: '✨', color: '#2ecc71', desc: 'In flow, rapid growth and insight', xpMultiplier: 2.0 }
};

// Wisdom Quotes from Theory
const WISDOM_QUOTES = [
    { text: "Level 1 is similar to an NPC running on a script, Level 2 is the main character choosing their storyline, and Level 3 is the programmer who can create new games.", category: 'levels' },
    { text: "You do not leave any given level. You transcend and include the one before it.", category: 'growth' },
    { text: "By developing yourself in all quadrants you begin to live a life where you become in control of your future.", category: 'balance' },
    { text: "The flow state occurs when the content of your consciousness is composed of one challenging yet meaningful task.", category: 'flow' },
    { text: "Meaning is found at the edge of your abilities.", category: 'challenge' },
    { text: "Learn as you build, build to focus your mind, read to expand your mind, write to organize your mind.", category: 'learning' },
    { text: "Be stubborn with vision and loose with details.", category: 'goals' },
    { text: "If you aren't building your mind, body, business, and spirit every single day – what are you doing?", category: 'daily' },
    { text: "When you are in the Dissonance phase, search for excitement and enthusiasm and pursue that without shame.", category: 'dissonance' },
    { text: "By doing nothing with your life, you choose to slowly drown in chaos.", category: 'entropy' },
    { text: "It is very important to try to understand which game you're playing.", category: 'strategy' },
    { text: "Max out all stats. Don't be an NPC. Be a level 100 player.", category: 'motivation' },
    { text: "A capitalist and Christian are developed in their domains, but experience unnecessary pain when applying their model elsewhere.", category: 'balance' },
    { text: "Profound change rarely happens by accident.", category: 'intention' },
    { text: "It is an infinite game, not a finite one.", category: 'mindset' }
];

// Flow State Triggers
const FLOW_TRIGGERS = {
    challengeSkillMatch: { name: 'Challenge Match', desc: 'Quest difficulty matches your skill level', bonus: 1.5 },
    clearGoals: { name: 'Clear Goals', desc: 'Well-defined objectives with milestones', bonus: 1.2 },
    immediateFeedback: { name: 'Immediate Feedback', desc: 'Quick feedback on your progress', bonus: 1.3 },
    deepFocus: { name: 'Deep Focus', desc: 'Uninterrupted concentration period', bonus: 2.0 }
};

// Map GNH domains to Quadrants
const DOMAIN_TO_QUADRANT = {
    psychologicalWellbeing: 'mind',
    education: 'mind',
    health: 'body',
    timeUse: 'body',
    communityVitality: 'spirit',
    culturalResilience: 'spirit',
    livingStandards: 'vocation',
    goodGovernance: 'vocation',
    ecologicalAwareness: 'spirit'
};

// ============================================================================
// INN/HOTEL RECOVERY SYSTEM
// ============================================================================
const INN_TIERS = [
    { id: 'campfire', name: '🏕️ Campfire', hpRecover: 10, cost: 5, desc: 'Basic rest by a warm fire' },
    { id: 'inn', name: '🏨 Village Inn', hpRecover: 25, cost: 15, desc: 'A comfortable bed and meal' },
    { id: 'hotel', name: '🏰 Grand Hotel', hpRecover: 50, cost: 35, desc: 'Luxurious rest with full recovery' },
    { id: 'spa', name: '🧖 Royal Spa', hpRecover: 100, cost: 75, desc: 'Complete rejuvenation, full HP restore' }
];

// ============================================================================
// NPC SYSTEM - Quest Givers & Companions
// ============================================================================
const DEFAULT_NPCS = [
    { id: 'mentor', name: 'The Mentor', icon: '🧙', role: 'Wisdom Giver', dialogue: 'Remember, every journey begins with a single step...', questTypes: ['education', 'psychologicalWellbeing'] },
    { id: 'trainer', name: 'The Trainer', icon: '💪', role: 'Fitness Coach', dialogue: "Your body is your temple. Let's make it stronger!", questTypes: ['health', 'timeUse'] },
    { id: 'sage', name: 'The Sage', icon: '🌿', role: 'Life Guide', dialogue: 'Balance in all things brings true peace.', questTypes: ['ecologicalAwareness', 'culturalResilience'] },
    { id: 'merchant', name: 'The Merchant', icon: '💰', role: 'Business Advisor', dialogue: 'Invest wisely, and prosperity follows.', questTypes: ['livingStandards', 'goodGovernance'] },
    { id: 'companion', name: 'The Companion', icon: '🤝', role: 'Social Guide', dialogue: 'Together, we are stronger than alone.', questTypes: ['communityVitality'] }
];

// ============================================================================
// ACTIVITY LOG CATEGORIES
// ============================================================================
const ACTIVITY_CATEGORIES = [
    { id: 'quest_complete', icon: '⚔️', label: 'Quest Completed', color: '#2ecc71' },
    { id: 'habit_complete', icon: '✅', label: 'Habit Done', color: '#3498db' },
    { id: 'bad_habit', icon: '💀', label: 'Bad Habit', color: '#e74c3c' },
    { id: 'level_up', icon: '🎉', label: 'Level Up', color: '#f1c40f' },
    { id: 'achievement', icon: '🏆', label: 'Achievement', color: '#9b59b6' },
    { id: 'shop_purchase', icon: '🛍️', label: 'Purchase', color: '#e67e22' },
    { id: 'inn_rest', icon: '🏨', label: 'Rested at Inn', color: '#1abc9c' },
    { id: 'damage', icon: '💔', label: 'Took Damage', color: '#c0392b' },
    { id: 'gold_earned', icon: '💰', label: 'Gold Earned', color: '#f39c12' },
    { id: 'boss_damage', icon: '🐉', label: 'Boss Damaged', color: '#e74c3c' },
    { id: 'boss_defeated', icon: '👑', label: 'Boss Defeated', color: '#f1c40f' },
    { id: 'dungeon_complete', icon: '🏰', label: 'Dungeon Cleared', color: '#9b59b6' },
    { id: 'focus_session', icon: '🎯', label: 'Focus Session', color: '#3498db' },
    { id: 'journal_sync', icon: '📓', label: 'Journal Sync', color: '#9b59b6' }
];

// ============================================================================
// BOSS FIGHT SYSTEM - Long-term Goals as Bosses
// ============================================================================
const BOSS_TEMPLATES = [
    { id: 'lazy_dragon', name: '🐉 The Lazy Dragon', desc: 'Defeat procrastination and build discipline', domain: 'timeUse', baseHp: 100 },
    { id: 'fog_giant', name: '🌫️ The Fog Giant', desc: 'Clear mental fog and gain clarity', domain: 'psychologicalWellbeing', baseHp: 100 },
    { id: 'sloth_beast', name: '🦥 The Sloth Beast', desc: 'Overcome sedentary lifestyle', domain: 'health', baseHp: 100 },
    { id: 'debt_demon', name: '💸 The Debt Demon', desc: 'Conquer financial challenges', domain: 'livingStandards', baseHp: 150 },
    { id: 'isolation_wraith', name: '👻 The Isolation Wraith', desc: 'Break free from social isolation', domain: 'communityVitality', baseHp: 80 },
    { id: 'ignorance_golem', name: '🗿 The Ignorance Golem', desc: 'Defeat ignorance through learning', domain: 'education', baseHp: 120 }
];

const BOSS_TIERS = {
    quick: { label: '50 HP - Quick Battle', maxHp: 50 },
    standard: { label: '100 HP - Standard', maxHp: 100 },
    tough: { label: '150 HP - Tough Fight', maxHp: 150 },
    epic: { label: '200 HP - Epic Battle', maxHp: 200 },
    legendary: { label: '300 HP - Legendary', maxHp: 300 },
    primordial: { label: '2000 HP - Nivel Primordial', maxHp: 2000 },
    soberano: { label: '10000 HP - Nivel Soberano', maxHp: 10000 }
};

// ============================================================================
// DUNGEON SYSTEM - Deep Work / Focus Sessions
// ============================================================================
const DUNGEON_REWARDS = {
    bronze: { minMinutes: 25, xpPerMinute: 1, goldBonus: 5, icon: '🥉' },
    silver: { minMinutes: 50, xpPerMinute: 1.5, goldBonus: 15, icon: '🥈' },
    gold: { minMinutes: 90, xpPerMinute: 2, goldBonus: 30, icon: '🥇' },
    diamond: { minMinutes: 120, xpPerMinute: 3, goldBonus: 50, icon: '💎' }
};

// ============================================================================
// DIFFICULTY SETTINGS
// ============================================================================
const GAME_DIFFICULTY = {
    easy: { name: 'Easy Mode', xpMultiplier: 1.5, goldMultiplier: 1.5, hpLossMultiplier: 0.5, desc: 'For steady progress and high motivation' },
    normal: { name: 'Normal Mode', xpMultiplier: 1.0, goldMultiplier: 1.0, hpLossMultiplier: 1.0, desc: 'Balanced challenge and reward' },
    hard: { name: 'Hard Mode', xpMultiplier: 0.75, goldMultiplier: 0.75, hpLossMultiplier: 1.5, desc: 'For those who love a challenge' },
    nightmare: { name: 'Nightmare', xpMultiplier: 0.5, goldMultiplier: 0.5, hpLossMultiplier: 2.0, desc: 'Only for the truly dedicated' }
};

// ============================================================================
// MOOD TRACKING - Energy Station
// ============================================================================
const MOOD_OPTIONS = [
    { id: 'amazing', icon: '🤩', label: 'Amazing', energyBonus: 20, color: '#2ecc71' },
    { id: 'good', icon: '😊', label: 'Good', energyBonus: 10, color: '#3498db' },
    { id: 'okay', icon: '😐', label: 'Okay', energyBonus: 0, color: '#f39c12' },
    { id: 'tired', icon: '😴', label: 'Tired', energyBonus: -10, color: '#e67e22' },
    { id: 'stressed', icon: '😰', label: 'Stressed', energyBonus: -15, color: '#e74c3c' },
    { id: 'burned_out', icon: '🔥', label: 'Burned Out', energyBonus: -25, color: '#c0392b' }
];

const SLEEP_QUALITY = [
    { id: 'excellent', label: '8+ hours, restful', hpRestore: 30, icon: '😴💯' },
    { id: 'good', label: '7-8 hours', hpRestore: 20, icon: '😴👍' },
    { id: 'fair', label: '5-7 hours', hpRestore: 10, icon: '😴' },
    { id: 'poor', label: 'Less than 5 hours', hpRestore: 0, icon: '😵' },
    { id: 'none', label: 'No sleep / All-nighter', hpRestore: -20, icon: '☠️' }
];

// ============================================================================
// OFFLINE COACHING SYSTEM - Works without API key
// ============================================================================
const COACHING_TIPS = {
    psychologicalWellbeing: [
        { tip: "Practice 5 minutes of mindful breathing each morning", action: "Add a 'Morning Meditation' habit" },
        { tip: "Write 3 things you're grateful for before bed", action: "Create a gratitude journal quest" },
        { tip: "Take a 10-minute walk when feeling stressed", action: "Add a 'Stress Relief Walk' habit" },
        { tip: "Limit social media to 30 minutes daily", action: "Create a 'Digital Detox' bad habit tracker" },
        { tip: "Practice positive self-talk: replace 'I can't' with 'I'm learning to'", action: "Notice your inner dialogue" }
    ],
    health: [
        { tip: "Drink a glass of water first thing in the morning", action: "Add a 'Hydration' habit" },
        { tip: "Take stairs instead of elevator when possible", action: "Create a 'Move More' habit" },
        { tip: "Aim for 7-8 hours of sleep consistently", action: "Track sleep in Energy Station" },
        { tip: "Eat one extra serving of vegetables today", action: "Add a 'Healthy Eating' quest" },
        { tip: "Stand up and stretch every hour during work", action: "Set hourly movement reminders" }
    ],
    timeUse: [
        { tip: "Use time-blocking: assign specific hours to specific tasks", action: "Try a Dungeon focus session" },
        { tip: "Identify your peak energy hours and protect them for deep work", action: "Track your energy patterns" },
        { tip: "Apply the 2-minute rule: if it takes less than 2 minutes, do it now", action: "Clear small tasks immediately" },
        { tip: "Plan tomorrow's top 3 priorities before ending today", action: "Create daily planning habit" },
        { tip: "Batch similar tasks together to reduce context switching", action: "Group your quests by type" }
    ],
    education: [
        { tip: "Learn in 25-minute focused sessions with 5-minute breaks", action: "Use Dungeon for learning" },
        { tip: "Teach what you learn to someone else to deepen understanding", action: "Share knowledge with others" },
        { tip: "Read for 20 minutes daily, even if just one page", action: "Add a 'Daily Reading' habit" },
        { tip: "Watch one educational video instead of entertainment", action: "Replace passive with active learning" },
        { tip: "Take notes by hand - it improves retention", action: "Start a learning journal" }
    ],
    culturalResilience: [
        { tip: "Practice one tradition from your heritage this week", action: "Create a cultural connection quest" },
        { tip: "Cook a traditional family recipe", action: "Add a 'Cultural Cooking' quest" },
        { tip: "Share a story from your background with someone", action: "Connect through storytelling" },
        { tip: "Learn a phrase in your heritage language", action: "Add a language learning habit" },
        { tip: "Attend a cultural event or community gathering", action: "Create a community quest" }
    ],
    goodGovernance: [
        { tip: "Set one clear boundary this week and maintain it", action: "Practice saying no" },
        { tip: "Make a decision you've been avoiding today", action: "Create a 'Decision Made' quest" },
        { tip: "Review your goals weekly to stay aligned", action: "Add a 'Weekly Review' habit" },
        { tip: "Document your personal rules and values", action: "Create your personal constitution" },
        { tip: "Delegate or eliminate one task that drains you", action: "Audit your commitments" }
    ],
    communityVitality: [
        { tip: "Send an appreciation message to someone today", action: "Add a 'Connect Daily' habit" },
        { tip: "Have one meaningful conversation without phones", action: "Create a 'Present Connection' quest" },
        { tip: "Help someone without expecting anything in return", action: "Add a 'Random Kindness' habit" },
        { tip: "Reconnect with someone you haven't talked to in months", action: "Reach out to an old friend" },
        { tip: "Join a group or community aligned with your interests", action: "Find your tribe" }
    ],
    ecologicalAwareness: [
        { tip: "Bring a reusable bag on your next shopping trip", action: "Add a 'Reduce Waste' habit" },
        { tip: "Take a mindful walk in nature this week", action: "Create a 'Nature Connection' quest" },
        { tip: "Reduce one single-use plastic item from your routine", action: "Identify waste habits" },
        { tip: "Learn about one environmental issue affecting your area", action: "Add an eco-learning quest" },
        { tip: "Plant something - even a small herb on your windowsill", action: "Start a tiny garden" }
    ],
    livingStandards: [
        { tip: "Track every expense for one week to build awareness", action: "Create expense tracking habit" },
        { tip: "Save a small amount today, even just $1", action: "Add a 'Daily Savings' habit" },
        { tip: "Review one subscription and decide if it's worth keeping", action: "Audit your subscriptions" },
        { tip: "Learn one new skill that could increase your income", action: "Create a skill-building quest" },
        { tip: "Identify one expense you can reduce without suffering", action: "Find your money leaks" }
    ]
};

const MOTIVATION_QUOTES = [
    { quote: "The journey of a thousand miles begins with a single step.", source: "Lao Tzu" },
    { quote: "You don't have to be great to start, but you have to start to be great.", source: "Zig Ziglar" },
    { quote: "Progress, not perfection.", source: "Life RPG Philosophy" },
    { quote: "Every expert was once a beginner.", source: "Helen Hayes" },
    { quote: "Small daily improvements are the key to staggering long-term results.", source: "Unknown" },
    { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", source: "Chinese Proverb" },
    { quote: "Discipline is choosing between what you want now and what you want most.", source: "Abraham Lincoln" },
    { quote: "You are never too old to set another goal or dream a new dream.", source: "C.S. Lewis" },
    { quote: "Success is the sum of small efforts repeated day in and day out.", source: "Robert Collier" },
    { quote: "The only way to do great work is to love what you do.", source: "Steve Jobs" },
    { quote: "Believe you can and you're halfway there.", source: "Theodore Roosevelt" },
    { quote: "Your life does not get better by chance, it gets better by change.", source: "Jim Rohn" }
];

// ============================================================================
// GNH DOMAINS (replacing old skills)
// ============================================================================
const DEFAULT_DOMAINS = [
    { id: 'psychologicalWellbeing', name: 'Psychological Well-being', score: 50, level: 1, xp: 0, icon: '🧠', color: '#9b59b6' },
    { id: 'health', name: 'Health', score: 50, level: 1, xp: 0, icon: '💪', color: '#e74c3c' },
    { id: 'timeUse', name: 'Time Use', score: 50, level: 1, xp: 0, icon: '⏰', color: '#3498db' },
    { id: 'education', name: 'Education', score: 50, level: 1, xp: 0, icon: '📚', color: '#f39c12' },
    { id: 'culturalResilience', name: 'Cultural Resilience', score: 50, level: 1, xp: 0, icon: '🎭', color: '#e91e63' },
    { id: 'goodGovernance', name: 'Good Governance', score: 50, level: 1, xp: 0, icon: '⚖️', color: '#9c27b0' },
    { id: 'communityVitality', name: 'Community Vitality', score: 50, level: 1, xp: 0, icon: '🤝', color: '#2ecc71' },
    { id: 'ecologicalAwareness', name: 'Ecological Awareness', score: 50, level: 1, xp: 0, icon: '🌍', color: '#27ae60' },
    { id: 'livingStandards', name: 'Living Standards', score: 50, level: 1, xp: 0, icon: '💰', color: '#16a085' }
];

// ============================================================================
// QUESTION BANK - 37 Questions across 9 domains
// ============================================================================
const QUESTION_BANK = {
    psychologicalWellbeing: [
        { id: 'psych_01', text: 'I generally feel satisfied with my life and where I am right now', weight: 1.2, positiveFraming: true, hint: 'Think about your overall contentment, not just today' },
        { id: 'psych_02', text: 'I can manage stress and difficult emotions effectively when they arise', weight: 1.0, positiveFraming: true, hint: 'Consider your typical response to challenges' },
        { id: 'psych_03', text: 'I regularly experience moments of joy, peace, or contentment', weight: 1.0, positiveFraming: true, hint: 'Frequency matters more than intensity' },
        { id: 'psych_04', text: 'I feel confident in my ability to handle what comes my way', weight: 1.0, positiveFraming: true, hint: 'This is about self-efficacy and resilience' }
    ],
    health: [
        { id: 'health_01', text: 'I consistently get enough quality sleep (7-9 hours for most adults)', weight: 1.2, positiveFraming: true, hint: 'Consider both duration and how rested you feel' },
        { id: 'health_02', text: 'I engage in physical activity or exercise at least 3-4 times per week', weight: 1.0, positiveFraming: true, hint: 'Any movement counts - walking, sports, gym, yoga' },
        { id: 'health_03', text: 'I eat nutritious meals regularly and feel good about my eating habits', weight: 1.0, positiveFraming: true, hint: 'Focus on patterns, not perfection' },
        { id: 'health_04', text: 'I have good energy levels throughout the day', weight: 1.0, positiveFraming: true, hint: 'Think about your typical energy, not today' },
        { id: 'health_05', text: 'I take care of my physical health proactively (check-ups, preventive care)', weight: 0.8, positiveFraming: true, hint: 'This includes regular doctor visits and health monitoring' }
    ],
    timeUse: [
        { id: 'time_01', text: 'I have a healthy balance between work/study and personal time', weight: 1.2, positiveFraming: true, hint: 'Neither feels consistently neglected' },
        { id: 'time_02', text: 'I regularly make time for activities I enjoy and find meaningful', weight: 1.0, positiveFraming: true, hint: 'Hobbies, passions, leisure activities' },
        { id: 'time_03', text: 'I feel in control of how I spend my time rather than constantly reacting', weight: 1.0, positiveFraming: true, hint: 'Proactive vs. reactive time management' },
        { id: 'time_04', text: 'I have enough downtime to rest and recharge', weight: 1.0, positiveFraming: true, hint: 'Recovery time is essential, not optional' }
    ],
    education: [
        { id: 'edu_01', text: 'I regularly engage in learning new things, whether formally or informally', weight: 1.2, positiveFraming: true, hint: 'Books, courses, tutorials, mentors, practice' },
        { id: 'edu_02', text: 'I actively work on developing skills that matter to me or my goals', weight: 1.0, positiveFraming: true, hint: 'Deliberate skill development, not passive consumption' },
        { id: 'edu_03', text: 'I feel intellectually stimulated and challenged in my daily life', weight: 1.0, positiveFraming: true, hint: 'Growing, not stagnating' },
        { id: 'edu_04', text: 'I have access to learning resources and opportunities when I need them', weight: 0.8, positiveFraming: true, hint: 'Educational access and support' }
    ],
    culturalResilience: [
        { id: 'culture_01', text: 'I feel connected to my cultural identity, heritage, or traditions', weight: 1.0, positiveFraming: true, hint: 'This can include family traditions, cultural practices, or values' },
        { id: 'culture_02', text: 'I regularly express my authentic self without excessive conformity pressure', weight: 1.2, positiveFraming: true, hint: 'Being true to yourself vs. wearing masks' },
        { id: 'culture_03', text: 'I maintain practices or rituals that ground me and give me a sense of identity', weight: 1.0, positiveFraming: true, hint: 'Personal rituals, traditions, or meaningful practices' },
        { id: 'culture_04', text: 'I feel proud of where I come from and who I am', weight: 1.0, positiveFraming: true, hint: 'Cultural confidence and self-acceptance' }
    ],
    goodGovernance: [
        { id: 'gov_01', text: 'I make my own decisions and feel in control of my life direction', weight: 1.2, positiveFraming: true, hint: 'Personal agency and autonomy' },
        { id: 'gov_02', text: 'I set and maintain healthy boundaries with others', weight: 1.0, positiveFraming: true, hint: 'Can say no when needed, protect your time and energy' },
        { id: 'gov_03', text: 'I take responsibility for my choices and their consequences', weight: 1.0, positiveFraming: true, hint: 'Ownership vs. victim mentality' },
        { id: 'gov_04', text: 'I have clear values and principles that guide my decisions', weight: 1.0, positiveFraming: true, hint: 'Internal compass for decision-making' },
        { id: 'gov_05', text: 'I manage my personal affairs effectively (finances, tasks, commitments)', weight: 0.8, positiveFraming: true, hint: 'Self-management and organization' }
    ],
    communityVitality: [
        { id: 'community_01', text: 'I have close relationships where I feel understood and supported', weight: 1.2, positiveFraming: true, hint: 'Quality over quantity in relationships' },
        { id: 'community_02', text: 'I regularly connect with friends, family, or community members', weight: 1.0, positiveFraming: true, hint: 'Frequency and consistency of social connection' },
        { id: 'community_03', text: 'I feel like I belong to one or more communities (work, hobby, location, etc.)', weight: 1.0, positiveFraming: true, hint: 'Sense of belonging and social identity' },
        { id: 'community_04', text: 'I contribute to or help others in my community when I can', weight: 0.8, positiveFraming: true, hint: 'Giving back and social contribution' }
    ],
    ecologicalAwareness: [
        { id: 'eco_01', text: 'I regularly spend time in nature or natural environments', weight: 1.0, positiveFraming: true, hint: 'Connection to the natural world' },
        { id: 'eco_02', text: 'I make environmentally conscious choices in my daily life', weight: 1.2, positiveFraming: true, hint: 'Waste reduction, sustainable consumption, energy use' },
        { id: 'eco_03', text: 'I feel aware of my environmental impact and try to minimize it', weight: 1.0, positiveFraming: true, hint: 'Ecological consciousness and responsibility' },
        { id: 'eco_04', text: 'I stay informed about environmental issues that matter to me', weight: 0.8, positiveFraming: true, hint: 'Environmental awareness and education' }
    ],
    livingStandards: [
        { id: 'living_01', text: 'I have enough financial resources to meet my basic needs comfortably', weight: 1.2, positiveFraming: true, hint: 'Housing, food, utilities, transportation' },
        { id: 'living_02', text: 'I feel financially secure and not constantly worried about money', weight: 1.2, positiveFraming: true, hint: 'Financial stress vs. financial peace' },
        { id: 'living_03', text: 'I have some savings or financial buffer for unexpected expenses', weight: 1.0, positiveFraming: true, hint: 'Emergency fund and financial resilience' },
        { id: 'living_04', text: 'My living conditions (home, environment) support my well-being', weight: 1.0, positiveFraming: true, hint: 'Safe, comfortable, and adequate housing' }
    ]
};

// Domain order for assessment flow
const DOMAIN_ORDER = [
    'psychologicalWellbeing', 'health', 'timeUse', 'education',
    'culturalResilience', 'goodGovernance', 'communityVitality',
    'ecologicalAwareness', 'livingStandards'
];

// Domain display names
const DOMAIN_NAMES = {
    psychologicalWellbeing: 'Psychological Well-being',
    health: 'Health',
    timeUse: 'Time Use',
    education: 'Education',
    culturalResilience: 'Cultural Resilience',
    goodGovernance: 'Good Governance',
    communityVitality: 'Community Vitality',
    ecologicalAwareness: 'Ecological Awareness',
    livingStandards: 'Living Standards'
};

// Domain intro messages
const DOMAIN_INTROS = {
    psychologicalWellbeing: "Let's start by exploring your mental and emotional well-being. These questions focus on your inner state, life satisfaction, and emotional resilience.",
    health: "Now let's look at your physical health. This covers sleep, exercise, nutrition, and overall vitality.",
    timeUse: "Next, we'll examine how you manage your time and balance different areas of life.",
    education: "Let's explore your relationship with learning and personal growth.",
    culturalResilience: "Now we'll look at your cultural identity and authentic self-expression.",
    goodGovernance: "These questions focus on your personal agency, decision-making, and self-governance.",
    communityVitality: "Let's examine your social connections and sense of community.",
    ecologicalAwareness: "Now we'll explore your relationship with nature and environmental consciousness.",
    livingStandards: "Finally, let's look at your material well-being and financial security."
};

// Default Achievements
const DEFAULT_ACHIEVEMENTS = [
    { id: 'first_habit', name: 'First Steps', desc: 'Complete your first habit', icon: '🌟', unlocked: false, reward: 25 },
    { id: 'level_5', name: 'Rising Hero', desc: 'Reach Level 5', icon: '⭐', unlocked: false, reward: 100 },
    { id: 'streak_7', name: 'Week Warrior', desc: '7-day streak on any habit', icon: '🔥', unlocked: false, reward: 75 },
    { id: 'gold_500', name: 'Treasure Hunter', desc: 'Accumulate 500 gold total', icon: '💎', unlocked: false, reward: 50 },
    { id: 'habits_10', name: 'Habit Master', desc: 'Create 10 habits', icon: '🏆', unlocked: false, reward: 100 },
    { id: 'quests_5', name: 'Quest Champion', desc: 'Complete 5 quests', icon: '⚔️', unlocked: false, reward: 150 },
    { id: 'streak_30', name: 'Monthly Legend', desc: '30-day streak on any habit', icon: '👑', unlocked: false, reward: 300 },
    { id: 'level_10', name: 'Veteran', desc: 'Reach Level 10', icon: '🎖️', unlocked: false, reward: 250 },
    { id: 'character_created', name: 'New Beginning', desc: 'Create your character', icon: '🎭', unlocked: false, reward: 25 },
    { id: 'journey_complete', name: 'Self-Discovery', desc: 'Complete the 37-question journey', icon: '🧭', unlocked: false, reward: 100 },
    { id: 'all_domains_50', name: 'Well Rounded', desc: 'All domains at 50+', icon: '🌈', unlocked: false, reward: 500 },
    { id: 'ai_coach_first', name: 'Seeking Wisdom', desc: 'Chat with AI Coach for the first time', icon: '🤖', unlocked: false, reward: 50 },
    { id: 'ai_quests_5', name: 'AI Collaborator', desc: 'Generate 5 quests with AI', icon: '✨', unlocked: false, reward: 100 }
];

// Difficulty multipliers
const DIFFICULTY = {
    easy: { label: 'Easy', multiplier: 0.5, color: 'green' },
    medium: { label: 'Medium', multiplier: 1, color: 'yellow' },
    hard: { label: 'Hard', multiplier: 2, color: 'orange' },
    epic: { label: 'Epic', multiplier: 3, color: 'red' }
};

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

function likertToScore(likertValue, positiveFraming = true) {
    const score = (likertValue - 1) * 25;
    return positiveFraming ? score : (100 - score);
}

function calculateDomainScores(responses) {
    const domainScores = {};

    for (const domainId of DOMAIN_ORDER) {
        const domainQuestions = QUESTION_BANK[domainId];
        const domainResponses = responses.filter(r => {
            const q = domainQuestions.find(q => q.id === r.questionId);
            return q !== undefined;
        });

        if (domainResponses.length === 0) {
            domainScores[domainId] = 50;
            continue;
        }

        let weightedSum = 0;
        let totalWeight = 0;

        for (const response of domainResponses) {
            const question = domainQuestions.find(q => q.id === response.questionId);
            if (!question) continue;

            const score = likertToScore(response.value, question.positiveFraming);
            weightedSum += score * question.weight;
            totalWeight += question.weight;
        }

        domainScores[domainId] = Math.round(weightedSum / totalWeight);
    }

    return domainScores;
}

function calculateLevelFromScores(domainScores) {
    const values = Object.values(domainScores);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.max(1, Math.min(11, Math.floor(avg / 10) + 1));
}

function getCharacterTitle(level) {
    // HUMAN 3.0 Tier (Level 201+)
    if (level >= 300) return '✨ TRANSCENDENT';
    if (level >= 275) return '🌌 COSMIC ARCHITECT';
    if (level >= 250) return '🔮 REALITY WEAVER';
    if (level >= 225) return '⚡ SYSTEM CREATOR';
    if (level >= 201) return '🌟 AWAKENED CREATOR';

    // HUMAN 2.0 Tier (Level 101-200)
    if (level >= 180) return '👑 GRANDMASTER';
    if (level >= 160) return '🏆 CHAMPION';
    if (level >= 140) return '⚔️ LEGEND';
    if (level >= 120) return '🛡️ ELITE';
    if (level >= 101) return '🎮 PLAYER AWAKENED';

    // HUMAN 1.0 Tier (Level 1-100)
    if (level >= 80) return '💎 MASTER';
    if (level >= 60) return '🗡️ HERO';
    if (level >= 40) return '⚔️ WARRIOR';
    if (level >= 20) return '🎒 ADVENTURER';
    if (level >= 5) return '🌿 NOVICE';
    return '🌱 BEGINNER';
}

// ============================================================================
// HUMAN 3.0 FRAMEWORK FUNCTIONS
// ============================================================================

// Calculate quadrant scores from domain scores
function calculateQuadrantScores(domains) {
    const quadrantScores = {};

    for (const quadrant of QUADRANTS) {
        const relatedDomains = Object.entries(DOMAIN_TO_QUADRANT)
            .filter(([_, q]) => q === quadrant.id)
            .map(([domainId, _]) => domainId);

        const scores = domains
            .filter(d => relatedDomains.includes(d.id))
            .map(d => d.score);

        if (scores.length > 0) {
            quadrantScores[quadrant.id] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        } else {
            quadrantScores[quadrant.id] = 50;
        }
    }

    return quadrantScores;
}

// Determine development level based on character level
// Level 1-100: HUMAN 1.0 (NPC) - Journey to Self-Awareness
// Level 101-200: HUMAN 2.0 (Player) - Journey to Mastery
// Level 201-300+: HUMAN 3.0 (Creator) - Journey to Transcendence
function getDevelopmentLevel(characterLevel) {
    if (characterLevel >= 201) return '3.0';
    if (characterLevel >= 101) return '2.0';
    return '1.0';
}

// Get progress within current HUMAN tier (0-100%)
function getTierProgress(characterLevel) {
    if (characterLevel >= 201) {
        // HUMAN 3.0: Level 201-300 (and beyond)
        return Math.min(100, characterLevel - 200);
    } else if (characterLevel >= 101) {
        // HUMAN 2.0: Level 101-200
        return characterLevel - 100;
    } else {
        // HUMAN 1.0: Level 1-100
        return characterLevel;
    }
}

// Get levels remaining to next HUMAN tier
function getLevelsToNextTier(characterLevel) {
    if (characterLevel >= 201) {
        return 0; // Already at max tier
    } else if (characterLevel >= 101) {
        return 201 - characterLevel; // To HUMAN 3.0
    } else {
        return 101 - characterLevel; // To HUMAN 2.0
    }
}

// Get next tier info
function getNextTierInfo(characterLevel) {
    if (characterLevel >= 201) {
        return null; // Already at max
    } else if (characterLevel >= 101) {
        return DEVELOPMENT_LEVELS['3.0'];
    } else {
        return DEVELOPMENT_LEVELS['2.0'];
    }
}

// Get current phase based on recent activity and entropy
function determinePhase(settings) {
    const entropy = settings.psychicEntropy || 0;
    const recentActivity = settings.recentActivityScore || 50;

    // High entropy + low activity = Dissonance (ready for change)
    if (entropy > 60 && recentActivity < 40) return 'dissonance';

    // Medium entropy + high activity = Uncertainty (taking risks)
    if (entropy > 30 && recentActivity > 60) return 'uncertainty';

    // Low entropy + high activity = Discovery (in flow)
    if (entropy < 30 && recentActivity > 70) return 'discovery';

    // Default to dissonance if unclear
    return 'dissonance';
}

// Calculate XP with phase multiplier
function calculateXPWithPhase(baseXP, phase) {
    const multiplier = PHASES[phase]?.xpMultiplier || 1.0;
    return Math.round(baseXP * multiplier);
}

// Get random wisdom quote (optionally filtered by category)
function getRandomWisdom(category = null) {
    const filtered = category
        ? WISDOM_QUOTES.filter(q => q.category === category)
        : WISDOM_QUOTES;
    return filtered[Math.floor(Math.random() * filtered.length)];
}

// Get wisdom based on player state
function getContextualWisdom(settings) {
    const phase = settings.currentPhase || 'dissonance';
    const devLevel = settings.developmentLevel || '1.0';

    // Priority categories based on state
    if (phase === 'dissonance') return getRandomWisdom('dissonance') || getRandomWisdom('motivation');
    if (devLevel === '1.0') return getRandomWisdom('levels') || getRandomWisdom('growth');
    if (phase === 'discovery') return getRandomWisdom('flow') || getRandomWisdom('challenge');

    return getRandomWisdom();
}

// Calculate psychic entropy (chaos accumulation)
function calculateEntropy(settings) {
    let entropy = settings.psychicEntropy || 0;

    // Incomplete habits add entropy
    const incompleteHabits = settings.habits.filter(h => !h.completed).length;
    entropy += incompleteHabits * 2;

    // Overdue quests add more entropy
    const now = new Date();
    const overdueQuests = settings.quests.filter(q => {
        if (q.completed) return false;
        if (!q.deadline) return false;
        return new Date(q.deadline) < now;
    }).length;
    entropy += overdueQuests * 5;

    // Cap entropy at 100
    return Math.min(100, Math.max(0, entropy));
}

// Reduce entropy (daily cleanup)
function reduceEntropy(settings, amount = 10) {
    settings.psychicEntropy = Math.max(0, (settings.psychicEntropy || 0) - amount);
    return settings.psychicEntropy;
}

// Check if in flow state (challenge-skill match)
function checkFlowState(questDifficulty, playerLevel) {
    const difficultyMap = { easy: 1, medium: 2, hard: 3, epic: 4 };
    const questLevel = difficultyMap[questDifficulty] || 2;
    const playerSkill = Math.ceil(playerLevel / 3); // 1-3 = 1, 4-6 = 2, etc.

    // Flow when challenge matches skill (within 1 level)
    return Math.abs(questLevel - playerSkill) <= 1;
}

// ============================================================================
// AI SERVICE CLASS
// ============================================================================

class AIService {
    constructor(plugin) {
        this.plugin = plugin;
    }

    // Get current provider configuration
    getProviderConfig() {
        const providerId = this.plugin.settings.ai?.provider || 'openrouter';
        return AI_PROVIDERS[providerId] || AI_PROVIDERS.openrouter;
    }

    // Get API key for current provider
    getApiKey() {
        const providerId = this.plugin.settings.ai?.provider || 'openrouter';
        // Check new structure first, then legacy
        return this.plugin.settings.ai?.apiKeys?.[providerId] ||
               this.plugin.settings.ai?.openRouterApiKey || '';
    }

    // Get current model for chat
    getChatModel() {
        const providerId = this.plugin.settings.ai?.provider || 'openrouter';
        return this.plugin.settings.ai?.selectedModels?.[providerId] ||
               this.plugin.settings.ai?.selectedModel || 'gpt-4o-mini';
    }

    // Build request for OpenRouter/OpenAI (same format)
    buildOpenAIRequest(messages, model, temperature, maxTokens) {
        return {
            model: model,
            messages: messages,
            temperature: temperature,
            max_tokens: maxTokens
        };
    }

    // Build request for Anthropic
    buildAnthropicRequest(messages, model, temperature, maxTokens) {
        // Extract system message
        const systemMessage = messages.find(m => m.role === 'system')?.content || '';
        const otherMessages = messages.filter(m => m.role !== 'system');

        return {
            model: model,
            max_tokens: maxTokens,
            temperature: temperature,
            system: systemMessage,
            messages: otherMessages.map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content
            }))
        };
    }

    // Build request for Google AI
    buildGoogleRequest(messages, temperature, maxTokens) {
        // Convert to Google format
        const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
        const otherMessages = messages.filter(m => m.role !== 'system');

        return {
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: otherMessages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            })),
            generationConfig: {
                temperature: temperature,
                maxOutputTokens: maxTokens
            }
        };
    }

    // Make API call based on provider
    async callProvider(messages, provider, apiKey, model, temperature, maxTokens) {
        const config = AI_PROVIDERS[provider];

        if (provider === 'google') {
            // Google uses different URL structure with API key in query
            const url = config.chatEndpoint.replace('{model}', model) + `?key=${apiKey}`;
            const body = this.buildGoogleRequest(messages, temperature, maxTokens);

            const response = await requestUrl({
                url: url,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.status !== 200) {
                throw new Error(`Google AI Error: ${response.status} - ${response.text}`);
            }

            const data = response.json;
            return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';

        } else if (provider === 'anthropic') {
            const body = this.buildAnthropicRequest(messages, model, temperature, maxTokens);
            const headers = {
                'Content-Type': 'application/json',
                [config.authHeader]: config.authPrefix + apiKey,
                ...config.extraHeaders
            };

            const response = await requestUrl({
                url: config.chatEndpoint,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            if (response.status !== 200) {
                throw new Error(`Anthropic Error: ${response.status} - ${response.text}`);
            }

            const data = response.json;
            return data.content?.[0]?.text || 'No response received.';

        } else {
            // OpenRouter and OpenAI use same format
            const body = this.buildOpenAIRequest(messages, model, temperature, maxTokens);
            const headers = {
                'Content-Type': 'application/json',
                [config.authHeader]: config.authPrefix + apiKey,
                ...config.extraHeaders
            };

            const response = await requestUrl({
                url: config.chatEndpoint,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            if (response.status !== 200) {
                throw new Error(`${config.name} Error: ${response.status} - ${response.text}`);
            }

            const data = response.json;
            return data.choices?.[0]?.message?.content || 'No response received.';
        }
    }

    async chat(userMessage, includeContext = true, saveToHistory = true) {
        const apiKey = this.getApiKey();
        const provider = this.plugin.settings.ai?.provider || 'openrouter';

        if (!apiKey) {
            const providerName = AI_PROVIDERS[provider]?.name || 'AI';
            throw new Error(`${providerName} API key not configured. Go to Settings → Life RPG to add your API key.`);
        }

        const model = this.getChatModel();
        const temperature = this.plugin.settings.ai?.temperature || 0.7;
        const maxTokens = this.plugin.settings.ai?.maxTokens || 1000;

        // Build context from character data as natural narrative
        let contextMessage = '';
        if (includeContext && this.plugin.settings.characterProfile?.assessmentComplete) {
            const s = this.plugin.settings;
            const sortedDomains = [...s.domains].sort((a, b) => b.score - a.score);
            const strengths = sortedDomains.slice(0, 3);
            const weaknesses = sortedDomains.slice(-3).reverse();

            // HUMAN 3.0 Framework data
            const quadrantScores = calculateQuadrantScores(s.domains);
            const devLevel = getDevelopmentLevel(s.level);
            const currentPhase = determinePhase(s);
            const devInfo = DEVELOPMENT_LEVELS[devLevel];

            // Find weakest/strongest quadrant
            const quadrantEntries = Object.entries(quadrantScores);
            const weakestQuadrant = quadrantEntries.reduce((a, b) => a[1] < b[1] ? a : b);
            const strongestQuadrant = quadrantEntries.reduce((a, b) => a[1] > b[1] ? a : b);

            const tierProgress = getTierProgress(s.level);
            const levelsToNext = getLevelsToNextTier(s.level);

            // Quadrant names in natural language
            const quadrantNames = { mind: 'Mind', body: 'Body', spirit: 'Spirit', vocation: 'Vocation' };

            // Health status description
            const hpPercent = Math.round((s.hp / s.maxHp) * 100);
            let healthDesc = '';
            if (hpPercent >= 80) healthDesc = 'in excellent health, full of vitality';
            else if (hpPercent >= 50) healthDesc = 'in fair condition, though somewhat weary';
            else if (hpPercent >= 25) healthDesc = 'wounded and struggling, in need of rest';
            else healthDesc = 'critically weakened, barely holding on';

            // Phase description
            let phaseDesc = '';
            if (currentPhase === 'dissonance') phaseDesc = 'feeling the stirrings of change, sensing that something must shift';
            else if (currentPhase === 'uncertainty') phaseDesc = 'walking through the mist of uncertainty, exploring new paths';
            else phaseDesc = 'in a state of flow and discovery, learning rapidly';

            // Build natural narrative
            contextMessage = `
The traveler before you is ${s.characterProfile?.name || 'a wandering soul'}, currently at Level ${s.level} on their journey. They are ${healthDesc}, carrying ${s.gold} gold coins from their adventures.

In the great tapestry of human development, this hero walks the path of ${devInfo.journey}. As a ${devInfo.name}, they are ${devLevel === '1.0' ? 'still awakening to their own potential, learning to see beyond the scripts they were given' : devLevel === '2.0' ? 'actively shaping their reality, setting their own goals and taking ownership of their story' : 'transcending ordinary limits, creating systems and leaving a legacy for others'}.

They have progressed ${tierProgress}% through this stage of evolution${levelsToNext > 0 ? `, with ${levelsToNext} levels remaining before ascending to the next tier` : ', standing at the pinnacle of human development'}.

Currently, this seeker is ${phaseDesc}.

Looking at the four aspects of their being:
- Their ${quadrantNames[strongestQuadrant[0]]} burns brightest at ${Math.round(strongestQuadrant[1])}%, showing where their power lies
- Their ${quadrantNames[weakestQuadrant[0]]} needs nurturing at ${Math.round(weakestQuadrant[1])}%, revealing where growth awaits

Their greatest strengths shine in ${strengths.map(d => d.name).join(', ')} - these are the gifts they bring to the world.
Yet growth calls from ${weaknesses.map(d => d.name).join(', ')} - here lie the lessons still to be learned.

On their daily path, they tend to ${s.habits.filter(h => !h.completed).length} sacred rituals and pursue ${s.quests.filter(q => !q.completed).length} active quests. Today, they have honored ${s.habits.filter(h => h.completed).length} of their commitments.

`;
        }

        // Build dynamic system prompt with customizations
        const systemPrompt = buildElderSystemPrompt(this.plugin.settings);

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(this.plugin.settings.ai?.chatHistory || []).slice(-10),
            { role: 'user', content: contextMessage + userMessage }
        ];

        try {
            const assistantMessage = await this.callProvider(messages, provider, apiKey, model, temperature, maxTokens);

            // Save to chat history only if requested
            if (saveToHistory) {
                if (!this.plugin.settings.ai.chatHistory) {
                    this.plugin.settings.ai.chatHistory = [];
                }
                this.plugin.settings.ai.chatHistory.push(
                    { role: 'user', content: userMessage },
                    { role: 'assistant', content: assistantMessage }
                );
                // Keep only last 50 messages
                if (this.plugin.settings.ai.chatHistory.length > 50) {
                    this.plugin.settings.ai.chatHistory = this.plugin.settings.ai.chatHistory.slice(-50);
                }
                await this.plugin.saveSettings();
            }

            return assistantMessage;
        } catch (error) {
            console.error('AI Service Error:', error);
            throw error;
        }
    }

    async generateQuests(count = 3) {
        const s = this.plugin.settings;
        const sortedDomains = [...s.domains].sort((a, b) => a.score - b.score);
        const weakestDomains = sortedDomains.slice(0, 3);

        const prompt = `Based on my lowest-scoring life domains, generate ${count} specific, actionable quests I can complete this week.

My weakest domains are:
${weakestDomains.map(d => `- ${d.icon} ${d.name}: ${d.score}%`).join('\n')}

For each quest, provide:
1. A clear, specific name (5-10 words)
2. The target domain
3. Difficulty (easy/medium/hard)
4. Suggested XP reward (10-100)
5. Suggested Gold reward (5-50)

Format your response as JSON array:
[
  {"name": "Quest name", "domain": "domainId", "difficulty": "medium", "xp": 30, "gold": 15},
  ...
]

Only return the JSON array, no other text.`;

        // Don't save quest generation to chat history (it's a system operation)
        const response = await this.chat(prompt, true, false);

        // Parse JSON from response
        try {
            let jsonStr = response;
            if (response.includes('```')) {
                const match = response.match(/```(?:json)?\s*([\s\S]*?)```/);
                if (match) jsonStr = match[1];
            }
            return JSON.parse(jsonStr.trim());
        } catch (e) {
            console.error('Failed to parse AI quest response:', e);
            throw new Error('AI returned invalid quest format. Please try again.');
        }
    }

    async getCoachingAdvice(topic = 'general') {
        const prompts = {
            general: "Based on my current domain scores, what's the single most impactful thing I could focus on this week to improve my overall well-being?",
            motivation: "I'm feeling unmotivated today. Based on my character profile, give me a personalized pep talk and one small action I can take right now.",
            habits: "Look at my current habits and domain scores. Suggest one new habit I should add and one I should consider removing or modifying.",
            progress: "Analyze my domain scores. Which area has the most potential for quick improvement, and what specific actions would help?"
        };

        return await this.chat(prompts[topic] || prompts.general, true);
    }
}

// ============================================================================
// EMBEDDING SERVICE CLASS - Multi-Provider Semantic Search & Memory
// ============================================================================

class EmbeddingService {
    constructor(plugin) {
        this.plugin = plugin;
    }

    // Get embedding provider and API key
    getEmbeddingConfig() {
        const ai = this.plugin.settings.ai || {};
        // Embedding can use a different provider than chat
        const provider = ai.embeddingProvider || ai.provider || 'openrouter';
        const apiKey = ai.apiKeys?.[provider] || ai.openRouterApiKey || '';
        const model = ai.selectedEmbeddingModels?.[provider] || ai.embeddingModel || 'text-embedding-3-small';

        return { provider, apiKey, model };
    }

    // Create embedding using OpenRouter or OpenAI (same API format)
    async createEmbeddingOpenAI(text, apiKey, model, endpoint, extraHeaders = {}) {
        const response = await requestUrl({
            url: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                ...extraHeaders
            },
            body: JSON.stringify({
                model: model,
                input: text.substring(0, 8000)
            })
        });

        if (response.status !== 200) {
            throw new Error(`Embedding API Error: ${response.status}`);
        }

        const data = response.json;
        return data.data[0].embedding;
    }

    // Create embedding using Google AI
    async createEmbeddingGoogle(text, apiKey, model) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;

        const response = await requestUrl({
            url: url,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: `models/${model}`,
                content: { parts: [{ text: text.substring(0, 8000) }] }
            })
        });

        if (response.status !== 200) {
            throw new Error(`Google Embedding Error: ${response.status}`);
        }

        const data = response.json;
        return data.embedding.values;
    }

    // Create embedding for text - routes to correct provider
    async createEmbedding(text) {
        const { provider, apiKey, model } = this.getEmbeddingConfig();

        if (!apiKey) {
            const providerName = AI_PROVIDERS[provider]?.name || 'AI';
            throw new Error(`${providerName} API key not configured for embeddings`);
        }

        // Check if provider supports embeddings
        if (provider === 'anthropic') {
            throw new Error('Anthropic does not support embeddings. Please use OpenRouter, OpenAI, or Google for embeddings.');
        }

        try {
            if (provider === 'google') {
                return await this.createEmbeddingGoogle(text, apiKey, model);
            } else if (provider === 'openai') {
                return await this.createEmbeddingOpenAI(
                    text,
                    apiKey,
                    model,
                    'https://api.openai.com/v1/embeddings'
                );
            } else {
                // OpenRouter (default)
                return await this.createEmbeddingOpenAI(
                    text,
                    apiKey,
                    model,
                    'https://openrouter.ai/api/v1/embeddings',
                    { 'HTTP-Referer': 'https://obsidian.md', 'X-Title': 'Life RPG Plugin' }
                );
            }
        } catch (error) {
            console.error('Embedding Service Error:', error);
            throw error;
        }
    }

    // Calculate cosine similarity between two embeddings
    cosineSimilarity(a, b) {
        if (!a || !b || a.length !== b.length) return 0;

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);

        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (normA * normB);
    }

    // Find most similar entries to a query
    async findSimilarEntries(query, topK = 5) {
        const embeddings = this.plugin.settings.journalSettings?.embeddings || [];
        if (embeddings.length === 0) return [];

        // Create embedding for query
        const queryEmbedding = await this.createEmbedding(query);

        // Calculate similarities
        const similarities = embeddings.map(entry => ({
            ...entry,
            similarity: this.cosineSimilarity(queryEmbedding, entry.embedding)
        }));

        // Sort by similarity and return top K
        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);
    }

    // Find relevant entries for Elder context
    async getRelevantMemories(query, count = 3) {
        try {
            const similar = await this.findSimilarEntries(query, count);
            return similar
                .filter(e => e.similarity > 0.3) // Only include if similarity > 30%
                .map(e => ({
                    fileName: e.fileName,
                    date: e.date,
                    summary: e.summary,
                    similarity: Math.round(e.similarity * 100)
                }));
        } catch (error) {
            console.error('Error getting memories:', error);
            return [];
        }
    }

    // Create summary for embedding (shorter than full content)
    createSummary(content, maxLength = 500) {
        // Remove markdown formatting
        let text = content
            .replace(/#{1,6}\s/g, '')
            .replace(/\*\*|__/g, '')
            .replace(/\*|_/g, '')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`[^`]*`/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
            .trim();

        // Return first maxLength characters
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Embed a journal entry and store it
    async embedJournalEntry(filePath, fileName, content, date) {
        const summary = this.createSummary(content);
        const embedding = await this.createEmbedding(summary);

        return {
            filePath,
            fileName,
            date,
            summary,
            embedding
        };
    }
}

// ============================================================================
// SKILL SERVICE CLASS - Skill Discovery & Leveling
// ============================================================================

class JournalAnalyzer {
    constructor(plugin) {
        this.plugin = plugin;
    }

    // Get all journal notes based on settings
    async getJournalNotes() {
        const s = this.plugin.settings.journalSettings;
        const allFiles = this.plugin.app.vault.getMarkdownFiles();

        if (s.scanMode === 'folder') {
            const folderPath = s.journalFolder.endsWith('/') ? s.journalFolder : s.journalFolder + '/';
            return allFiles.filter(f => f.path.startsWith(folderPath) || f.path.startsWith(s.journalFolder + '/'));
        } else {
            // Tag-based: need to read each file's content
            const taggedNotes = [];
            for (const file of allFiles) {
                try {
                    const content = await this.plugin.app.vault.read(file);
                    if (content.includes(s.journalTag)) {
                        taggedNotes.push(file);
                    }
                } catch (e) {
                    console.error(`Error reading file ${file.path}:`, e);
                }
            }
            return taggedNotes;
        }
    }

    // Get notes modified since last sync
    async getNewNotes() {
        const allJournals = await this.getJournalNotes();
        const lastSync = this.plugin.settings.journalSettings.lastSyncDate;

        if (!lastSync) return allJournals; // First sync - analyze all

        const lastSyncTime = new Date(lastSync).getTime();
        return allJournals.filter(f => f.stat.mtime > lastSyncTime);
    }

    // Offline keyword-based analysis
    analyzeContentOffline(content) {
        const s = this.plugin.settings.journalSettings;
        const contentLower = content.toLowerCase();

        // Domain detection
        const domainScores = {};
        for (const [domain, keywords] of Object.entries(s.domainKeywords)) {
            const matches = keywords.filter(k => contentLower.includes(k.toLowerCase()));
            domainScores[domain] = {
                matches: matches,
                count: matches.length,
                intensity: matches.length / keywords.length
            };
        }

        // Sentiment analysis
        const positiveMatches = s.sentimentKeywords.positive.filter(k => contentLower.includes(k.toLowerCase()));
        const negativeMatches = s.sentimentKeywords.negative.filter(k => contentLower.includes(k.toLowerCase()));

        const sentiment = {
            positive: positiveMatches.length,
            negative: negativeMatches.length,
            score: positiveMatches.length - negativeMatches.length,
            positiveWords: positiveMatches,
            negativeWords: negativeMatches
        };

        return { domainScores, sentiment };
    }

    // AI-powered analysis (when API key available)
    async analyzeContentWithAI(content, fileName) {
        const apiKey = this.plugin.settings.ai?.openRouterApiKey;
        if (!apiKey) return null;

        const prompt = `Analyze this journal entry and return ONLY valid JSON (no markdown, no explanation):
{
    "domains": {
        "health": 0,
        "psychologicalWellbeing": 0,
        "education": 0,
        "timeUse": 0,
        "communityVitality": 0,
        "livingStandards": 0,
        "culturalResilience": 0,
        "goodGovernance": 0,
        "ecologicalAwareness": 0
    },
    "sentiment": 0,
    "achievements": [],
    "challenges": [],
    "suggestedXP": 0,
    "suggestedHPChange": 0
}

Scoring guide:
- domains: 0-10 score based on how much the entry focuses on each life area
- sentiment: -10 (very negative) to +10 (very positive)
- achievements: list of accomplishments mentioned (strings)
- challenges: list of difficulties mentioned (strings)
- suggestedXP: 0-50 based on accomplishments and effort
- suggestedHPChange: -20 to +10 (negative for stress/challenges, positive for self-care)

Journal entry from "${fileName}":
${content.substring(0, 2000)}`;

        try {
            // Use chat with saveToHistory=false to avoid polluting the Elder conversation
            const response = await this.plugin.aiService.chat(prompt, false, false);
            // Try to extract JSON from response
            let jsonStr = response;
            if (response.includes('```')) {
                const match = response.match(/```(?:json)?\s*([\s\S]*?)```/);
                if (match) jsonStr = match[1];
            }
            return JSON.parse(jsonStr.trim());
        } catch (e) {
            console.error('AI analysis failed:', e);
            return null;
        }
    }

    // Combined analysis
    async analyzeNote(file) {
        const content = await this.plugin.app.vault.read(file);
        const offlineAnalysis = this.analyzeContentOffline(content);

        let aiAnalysis = null;
        if (this.plugin.settings.ai?.openRouterApiKey) {
            aiAnalysis = await this.analyzeContentWithAI(content, file.basename);
        }

        return {
            file: file.path,
            fileName: file.basename,
            modifiedDate: new Date(file.stat.mtime).toISOString(),
            wordCount: content.split(/\s+/).filter(w => w.length > 0).length,
            offline: offlineAnalysis,
            ai: aiAnalysis
        };
    }
}

// ============================================================================
// CHARACTER CREATION MODAL
// ============================================================================

class CharacterCreationModal extends Modal {
    constructor(app, plugin, onComplete) {
        super(app);
        this.plugin = plugin;
        this.onComplete = onComplete;
        this.currentStep = 'welcome';
        this.characterName = '';
        this.currentDomainIndex = 0;
        this.currentQuestionIndex = 0;
        this.responses = [];
        this.allQuestions = this.buildQuestionList();
        this.totalQuestions = this.allQuestions.length;
    }

    buildQuestionList() {
        const questions = [];
        for (const domainId of DOMAIN_ORDER) {
            const domainQuestions = QUESTION_BANK[domainId];
            for (const q of domainQuestions) {
                questions.push({ ...q, domain: domainId });
            }
        }
        return questions;
    }

    getCurrentQuestion() {
        let idx = 0;
        for (let d = 0; d < this.currentDomainIndex; d++) {
            idx += QUESTION_BANK[DOMAIN_ORDER[d]].length;
        }
        idx += this.currentQuestionIndex;
        return this.allQuestions[idx];
    }

    getOverallProgress() {
        let answered = 0;
        for (let d = 0; d < this.currentDomainIndex; d++) {
            answered += QUESTION_BANK[DOMAIN_ORDER[d]].length;
        }
        answered += this.currentQuestionIndex;
        return Math.round((answered / this.totalQuestions) * 100);
    }

    onOpen() {
        this.render();
    }

    onClose() {
        this.contentEl.empty();
    }

    render() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('rpg-assessment-modal');

        switch (this.currentStep) {
            case 'welcome':
                this.renderWelcome();
                break;
            case 'domain_intro':
                this.renderDomainIntro();
                break;
            case 'question':
                this.renderQuestion();
                break;
            case 'complete':
                this.renderComplete();
                break;
        }
    }

    renderWelcome() {
        const { contentEl } = this;

        contentEl.createEl('h2', { text: '🎭 Create Your Character' });

        const nameSection = contentEl.createDiv({ cls: 'rpg-name-section' });
        nameSection.createEl('label', { text: 'What should we call you?' });

        const nameInput = nameSection.createEl('input', {
            type: 'text',
            placeholder: 'Enter your name...',
            cls: 'rpg-name-input'
        });
        nameInput.value = this.characterName;
        nameInput.addEventListener('input', (e) => {
            this.characterName = e.target.value;
        });

        contentEl.createEl('h3', { text: 'Choose Your Path', cls: 'rpg-path-title' });

        const pathsContainer = contentEl.createDiv({ cls: 'rpg-paths-container' });

        // Quick Start Path
        const quickPath = pathsContainer.createDiv({ cls: 'rpg-path-card' });
        quickPath.createDiv({ cls: 'rpg-path-icon', text: '⚡' });
        quickPath.createEl('h4', { text: 'Quick Start' });
        quickPath.createEl('p', {
            text: 'Jump right in! Start with balanced stats and discover yourself through gameplay.',
            cls: 'rpg-path-desc'
        });
        quickPath.createDiv({ cls: 'rpg-path-reward', text: 'Start at Level 1' });
        const quickBtn = quickPath.createEl('button', {
            text: 'Start Adventure →',
            cls: 'rpg-primary-btn'
        });
        quickBtn.onclick = () => {
            if (!this.characterName.trim()) {
                this.characterName = 'Hero';
            }
            this.quickStart();
        };

        // Discovery Journey Path
        const journeyPath = pathsContainer.createDiv({ cls: 'rpg-path-card journey' });
        journeyPath.createDiv({ cls: 'rpg-path-icon', text: '🧭' });
        journeyPath.createEl('h4', { text: 'Discovery Journey' });
        journeyPath.createEl('p', {
            text: 'Answer 37 questions to discover your true strengths. Earn XP for each answer!',
            cls: 'rpg-path-desc'
        });
        journeyPath.createDiv({ cls: 'rpg-path-reward', text: '+5 XP per question • +50 bonus XP' });
        const journeyBtn = journeyPath.createEl('button', {
            text: 'Begin Journey →',
            cls: 'rpg-secondary-btn'
        });
        journeyBtn.onclick = () => {
            if (!this.characterName.trim()) {
                this.characterName = 'Hero';
            }
            this.currentStep = 'domain_intro';
            this.render();
        };

        contentEl.createEl('p', {
            text: "💡 Tip: You can always take the Discovery Journey later from your Character tab!",
            cls: 'rpg-modal-tip'
        });
    }

    async quickStart() {
        const s = this.plugin.settings;

        // Set default domain scores (all at 50%)
        s.domains = DEFAULT_DOMAINS.map(d => ({
            ...d,
            score: 50,
            level: 1,
            xp: 0
        }));

        s.characterProfile = {
            name: this.characterName,
            createdAt: new Date().toISOString(),
            assessmentComplete: false,  // Journey not completed
            assessmentResponses: [],
            questionsAnswered: 0
        };

        s.level = 1;
        s.maxHp = 110;
        s.hp = s.maxHp;
        s.xp = 0;

        await this.plugin.saveSettings();

        // Award character_created achievement
        const ach = s.achievements.find(a => a.id === 'character_created');
        if (ach && !ach.unlocked) {
            ach.unlocked = true;
            s.gold += ach.reward;
            s.totalGoldEarned = (s.totalGoldEarned || 0) + ach.reward;
            await this.plugin.saveSettings();
            new Notice(`🏆 Achievement: ${ach.name}! +${ach.reward}g`);
        }

        new Notice(`⚡ Character "${this.characterName}" created! Level 1`);

        this.close();
        if (this.onComplete) this.onComplete();
    }

    renderDomainIntro() {
        const { contentEl } = this;
        const domainId = DOMAIN_ORDER[this.currentDomainIndex];
        const domain = DEFAULT_DOMAINS.find(d => d.id === domainId);

        const progress = this.getOverallProgress();
        const progressBar = contentEl.createDiv({ cls: 'rpg-progress-container' });
        progressBar.createDiv({ cls: 'rpg-progress-label', text: `Progress: ${progress}%` });
        const bar = progressBar.createDiv({ cls: 'rpg-progress-bar' });
        bar.createDiv({ cls: 'rpg-progress-fill', attr: { style: `width: ${progress}%` } });

        contentEl.createEl('h2', { text: `${domain.icon} ${domain.name}` });
        contentEl.createEl('p', {
            text: DOMAIN_INTROS[domainId],
            cls: 'rpg-domain-intro-text'
        });
        contentEl.createEl('p', {
            text: `(${QUESTION_BANK[domainId].length} questions in this section)`,
            cls: 'rpg-question-count'
        });

        const btnContainer = contentEl.createDiv({ cls: 'rpg-modal-buttons' });
        const continueBtn = btnContainer.createEl('button', {
            text: 'Continue →',
            cls: 'rpg-primary-btn'
        });
        continueBtn.onclick = () => {
            this.currentStep = 'question';
            this.currentQuestionIndex = 0;
            this.render();
        };
    }

    renderQuestion() {
        const { contentEl } = this;
        const domainId = DOMAIN_ORDER[this.currentDomainIndex];
        const domainQuestions = QUESTION_BANK[domainId];
        const question = domainQuestions[this.currentQuestionIndex];
        const domain = DEFAULT_DOMAINS.find(d => d.id === domainId);

        const progress = this.getOverallProgress();
        const progressBar = contentEl.createDiv({ cls: 'rpg-progress-container' });
        progressBar.createDiv({ cls: 'rpg-progress-label', text: `Progress: ${progress}%` });
        const bar = progressBar.createDiv({ cls: 'rpg-progress-bar' });
        bar.createDiv({ cls: 'rpg-progress-fill', attr: { style: `width: ${progress}%` } });

        contentEl.createDiv({ cls: 'rpg-domain-badge', text: `${domain.icon} ${domain.name}` });

        const questionNum = this.currentQuestionIndex + 1;
        const totalInDomain = domainQuestions.length;
        contentEl.createDiv({ cls: 'rpg-question-number', text: `Question ${questionNum} of ${totalInDomain}` });

        contentEl.createEl('h3', { text: question.text, cls: 'rpg-question-text' });

        if (question.hint) {
            contentEl.createDiv({ cls: 'rpg-question-hint', text: `💡 ${question.hint}` });
        }

        const likertContainer = contentEl.createDiv({ cls: 'rpg-likert-container' });
        const labels = [
            { value: 1, label: 'Strongly Disagree', emoji: '😟' },
            { value: 2, label: 'Disagree', emoji: '😕' },
            { value: 3, label: 'Neutral', emoji: '😐' },
            { value: 4, label: 'Agree', emoji: '🙂' },
            { value: 5, label: 'Strongly Agree', emoji: '😊' }
        ];

        labels.forEach(opt => {
            const btn = likertContainer.createEl('button', { cls: 'rpg-likert-btn' });
            btn.createDiv({ cls: 'rpg-likert-emoji', text: opt.emoji });
            btn.createDiv({ cls: 'rpg-likert-value', text: opt.value.toString() });
            btn.createDiv({ cls: 'rpg-likert-label', text: opt.label });

            btn.onclick = () => this.submitResponse(question.id, opt.value);
        });

        const navContainer = contentEl.createDiv({ cls: 'rpg-nav-container' });
        if (this.currentQuestionIndex > 0 || this.currentDomainIndex > 0) {
            const backBtn = navContainer.createEl('button', { text: '← Back', cls: 'rpg-secondary-btn' });
            backBtn.onclick = () => this.goBack();
        }
    }

    async submitResponse(questionId, value) {
        const existingIdx = this.responses.findIndex(r => r.questionId === questionId);
        const isNewAnswer = existingIdx < 0;

        if (existingIdx >= 0) {
            this.responses[existingIdx].value = value;
        } else {
            this.responses.push({ questionId, value });
        }

        // Award XP for new answers
        if (isNewAnswer) {
            const xpReward = 5;
            this.plugin.settings.xp += xpReward;
            await this.plugin.saveSettings();
            new Notice(`+${xpReward} XP for answering!`);
        }

        const domainId = DOMAIN_ORDER[this.currentDomainIndex];
        const domainQuestions = QUESTION_BANK[domainId];

        if (this.currentQuestionIndex < domainQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.render();
        } else {
            if (this.currentDomainIndex < DOMAIN_ORDER.length - 1) {
                this.currentDomainIndex++;
                this.currentStep = 'domain_intro';
                this.render();
            } else {
                this.currentStep = 'complete';
                this.render();
            }
        }
    }

    goBack() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        } else if (this.currentDomainIndex > 0) {
            this.currentDomainIndex--;
            const prevDomainQuestions = QUESTION_BANK[DOMAIN_ORDER[this.currentDomainIndex]];
            this.currentQuestionIndex = prevDomainQuestions.length - 1;
        }
        this.render();
    }

    renderComplete() {
        const { contentEl } = this;

        const domainScores = calculateDomainScores(this.responses);
        const level = calculateLevelFromScores(domainScores);
        const title = getCharacterTitle(level);

        contentEl.createEl('h2', { text: '🎉 Journey Complete!' });

        // Show rewards earned
        const rewardsBox = contentEl.createDiv({ cls: 'rpg-rewards-box' });
        rewardsBox.createEl('h4', { text: '🎁 Rewards Earned' });
        const totalXP = (this.responses.length * 5) + 50; // 5 per question + 50 bonus
        rewardsBox.createDiv({ cls: 'rpg-reward-item', text: `✨ ${this.responses.length * 5} XP from questions` });
        rewardsBox.createDiv({ cls: 'rpg-reward-item bonus', text: `🌟 +50 XP completion bonus!` });
        rewardsBox.createDiv({ cls: 'rpg-reward-total', text: `Total: ${totalXP} XP` });

        const card = contentEl.createDiv({ cls: 'rpg-character-card' });
        card.createDiv({ cls: 'rpg-card-title', text: title });
        card.createEl('h3', { text: this.characterName });
        card.createDiv({ cls: 'rpg-card-level', text: `Level ${level}` });

        const scoresSection = contentEl.createDiv({ cls: 'rpg-scores-section' });
        scoresSection.createEl('h4', { text: 'Your Domain Scores' });

        const sortedDomains = DOMAIN_ORDER.map(id => ({
            id,
            score: domainScores[id],
            ...DEFAULT_DOMAINS.find(d => d.id === id)
        })).sort((a, b) => b.score - a.score);

        scoresSection.createDiv({ cls: 'rpg-section-label', text: '💪 Top Strengths' });
        sortedDomains.slice(0, 3).forEach((d, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            scoresSection.createDiv({
                cls: 'rpg-score-row strength',
                text: `${medals[i]} ${d.icon} ${d.name}: ${d.score}%`
            });
        });

        scoresSection.createDiv({ cls: 'rpg-section-label', text: '🌱 Growth Areas' });
        sortedDomains.slice(-3).reverse().forEach(d => {
            scoresSection.createDiv({
                cls: 'rpg-score-row growth',
                text: `🎯 ${d.icon} ${d.name}: ${d.score}%`
            });
        });

        const chartSection = contentEl.createDiv({ cls: 'rpg-chart-section' });
        chartSection.createEl('h4', { text: 'All Domains' });

        DOMAIN_ORDER.forEach(domainId => {
            const domain = DEFAULT_DOMAINS.find(d => d.id === domainId);
            const score = domainScores[domainId];

            const row = chartSection.createDiv({ cls: 'rpg-domain-bar-row' });
            row.createDiv({ cls: 'rpg-domain-bar-label', text: `${domain.icon} ${domain.name}` });
            const barContainer = row.createDiv({ cls: 'rpg-domain-bar-container' });
            barContainer.createDiv({
                cls: 'rpg-domain-bar-fill',
                attr: { style: `width: ${score}%; background-color: ${domain.color}` }
            });
            row.createDiv({ cls: 'rpg-domain-bar-value', text: `${score}%` });
        });

        const btnContainer = contentEl.createDiv({ cls: 'rpg-modal-buttons' });
        const confirmBtn = btnContainer.createEl('button', {
            text: '✨ Apply Results',
            cls: 'rpg-primary-btn'
        });
        confirmBtn.onclick = () => {
            this.finalizeCharacter(domainScores, level);
        };
    }

    async finalizeCharacter(domainScores, level) {
        const s = this.plugin.settings;
        const isNewCharacter = !s.characterProfile?.name;

        s.domains = DEFAULT_DOMAINS.map(d => ({
            ...d,
            score: domainScores[d.id],
            level: Math.floor(domainScores[d.id] / 10) + 1,
            xp: 0
        }));

        // Give completion bonus XP
        const bonusXP = 50;
        s.xp += bonusXP;

        s.characterProfile = {
            name: this.characterName || s.characterProfile?.name || 'Hero',
            createdAt: s.characterProfile?.createdAt || new Date().toISOString(),
            assessmentComplete: true,
            assessmentResponses: this.responses,
            questionsAnswered: this.responses.length
        };

        s.level = level;
        s.maxHp = 100 + (level * 10);
        s.hp = s.maxHp;

        await this.plugin.saveSettings();

        // Check for journey completion achievement
        const journeyAch = s.achievements.find(a => a.id === 'journey_complete');
        if (journeyAch && !journeyAch.unlocked) {
            journeyAch.unlocked = true;
            s.gold += journeyAch.reward;
            s.totalGoldEarned += journeyAch.reward;
            await this.plugin.saveSettings();
            new Notice(`🏆 Achievement Unlocked: ${journeyAch.name}! +${journeyAch.reward}g`);
        }

        // Also check character_created if new
        if (isNewCharacter) {
            const ach = s.achievements.find(a => a.id === 'character_created');
            if (ach && !ach.unlocked) {
                ach.unlocked = true;
                s.gold += ach.reward;
                s.totalGoldEarned += ach.reward;
                await this.plugin.saveSettings();
                new Notice(`🏆 Achievement Unlocked: ${ach.name}! +${ach.reward}g`);
            }
        }

        new Notice(`🎉 Journey complete! +${bonusXP} bonus XP! Now Level ${level}!`);

        this.close();
        if (this.onComplete) this.onComplete();
    }
}

// ============================================================================
// ELDER SETTINGS MODAL - Customize AI Persona
// ============================================================================

class ElderSettingsModal extends Modal {
    constructor(app, plugin, onComplete) {
        super(app);
        this.plugin = plugin;
        this.onComplete = onComplete;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('rpg-elder-settings-modal');

        const s = this.plugin.settings;
        if (!s.ai) s.ai = { ...DEFAULT_AI_SETTINGS };
        if (!s.ai.elderPersona) s.ai.elderPersona = { ...DEFAULT_AI_SETTINGS.elderPersona };
        if (!s.ai.elderPrompts) s.ai.elderPrompts = { ...DEFAULT_AI_SETTINGS.elderPrompts };

        contentEl.createEl('h2', { text: '🧙 Customize Your Elder' });
        contentEl.createEl('p', {
            text: 'Shape the personality and wisdom of your guide.',
            cls: 'rpg-modal-subtitle'
        });

        // === PERSONA SECTION ===
        const personaSection = contentEl.createDiv({ cls: 'rpg-settings-section' });
        personaSection.createEl('h3', { text: '👤 Elder Identity' });

        // Name
        const nameRow = personaSection.createDiv({ cls: 'rpg-setting-row' });
        nameRow.createEl('label', { text: 'Name' });
        const nameInput = nameRow.createEl('input', { type: 'text' });
        nameInput.value = s.ai.elderPersona.name;
        nameInput.placeholder = 'The Elder';
        nameInput.onchange = (e) => s.ai.elderPersona.name = e.target.value;

        // Title
        const titleRow = personaSection.createDiv({ cls: 'rpg-setting-row' });
        titleRow.createEl('label', { text: 'Title' });
        const titleInput = titleRow.createEl('input', { type: 'text' });
        titleInput.value = s.ai.elderPersona.title;
        titleInput.placeholder = 'Keeper of Wisdom';
        titleInput.onchange = (e) => s.ai.elderPersona.title = e.target.value;

        // Greeting
        const greetingRow = personaSection.createDiv({ cls: 'rpg-setting-row vertical' });
        greetingRow.createEl('label', { text: 'Greeting Message' });
        const greetingInput = greetingRow.createEl('textarea');
        greetingInput.value = s.ai.elderPersona.greeting;
        greetingInput.placeholder = 'Greetings, traveler...';
        greetingInput.rows = 2;
        greetingInput.onchange = (e) => s.ai.elderPersona.greeting = e.target.value;

        // Personality Preset
        const personalityRow = personaSection.createDiv({ cls: 'rpg-setting-row' });
        personalityRow.createEl('label', { text: 'Personality' });
        const personalitySelect = personalityRow.createEl('select');

        Object.entries(ELDER_PERSONALITIES).forEach(([id, preset]) => {
            const option = personalitySelect.createEl('option', { value: id, text: preset.name });
            if (id === s.ai.elderPersona.personality) option.selected = true;
        });
        personalitySelect.onchange = (e) => s.ai.elderPersona.personality = e.target.value;

        // Preview personality
        const previewBox = personaSection.createDiv({ cls: 'rpg-personality-preview' });
        const updatePreview = () => {
            const preset = ELDER_PERSONALITIES[personalitySelect.value];
            previewBox.innerHTML = `
                <div class="rpg-preview-title">${preset.name}</div>
                <div class="rpg-preview-style">${preset.style}</div>
                <div class="rpg-preview-tone"><em>${preset.tone}</em></div>
            `;
        };
        updatePreview();
        personalitySelect.onchange = (e) => {
            s.ai.elderPersona.personality = e.target.value;
            updatePreview();
        };

        // === CUSTOM KNOWLEDGE ===
        const knowledgeSection = contentEl.createDiv({ cls: 'rpg-settings-section' });
        knowledgeSection.createEl('h3', { text: '📚 Personal Knowledge' });
        knowledgeSection.createEl('p', {
            text: 'Add context about yourself that the Elder should know (goals, background, preferences).',
            cls: 'rpg-setting-desc'
        });

        const knowledgeInput = knowledgeSection.createEl('textarea', { cls: 'rpg-large-textarea' });
        knowledgeInput.value = s.ai.customKnowledge || '';
        knowledgeInput.placeholder = 'Example:\n- I am a photographer transitioning careers\n- My main goal is to find my first client by end of month\n- I prefer actionable advice over philosophical musings\n- I struggle with procrastination';
        knowledgeInput.rows = 5;
        knowledgeInput.onchange = (e) => s.ai.customKnowledge = e.target.value;

        // === CUSTOM INSTRUCTIONS ===
        const instructionsSection = contentEl.createDiv({ cls: 'rpg-settings-section' });
        instructionsSection.createEl('h3', { text: '📜 Custom Instructions' });
        instructionsSection.createEl('p', {
            text: 'Additional instructions for how the Elder should behave or respond.',
            cls: 'rpg-setting-desc'
        });

        const instructionsInput = instructionsSection.createEl('textarea', { cls: 'rpg-large-textarea' });
        instructionsInput.value = s.ai.customSystemPrompt || '';
        instructionsInput.placeholder = 'Example:\n- Always end with an actionable next step\n- Reference Vietnamese culture when relevant\n- Keep responses under 200 words\n- Focus on practical advice, not theory';
        instructionsInput.rows = 4;
        instructionsInput.onchange = (e) => s.ai.customSystemPrompt = e.target.value;

        // === QUICK PROMPTS ===
        const promptsSection = contentEl.createDiv({ cls: 'rpg-settings-section' });
        promptsSection.createEl('h3', { text: '⚡ Quick Wisdom Prompts' });
        promptsSection.createEl('p', {
            text: 'Customize what happens when you click the quick wisdom buttons.',
            cls: 'rpg-setting-desc'
        });

        const prompts = [
            { id: 'guidance', label: '🔮 Guidance', default: DEFAULT_AI_SETTINGS.elderPrompts.guidance },
            { id: 'challenge', label: '⚔️ Challenge', default: DEFAULT_AI_SETTINGS.elderPrompts.challenge },
            { id: 'reflection', label: '🪞 Reflection', default: DEFAULT_AI_SETTINGS.elderPrompts.reflection },
            { id: 'motivation', label: '🔥 Motivation', default: DEFAULT_AI_SETTINGS.elderPrompts.motivation }
        ];

        prompts.forEach(prompt => {
            const promptRow = promptsSection.createDiv({ cls: 'rpg-setting-row vertical' });
            promptRow.createEl('label', { text: prompt.label });
            const promptInput = promptRow.createEl('textarea');
            promptInput.value = s.ai.elderPrompts[prompt.id] || prompt.default;
            promptInput.placeholder = prompt.default;
            promptInput.rows = 2;
            promptInput.onchange = (e) => s.ai.elderPrompts[prompt.id] = e.target.value;
        });

        // === BUTTONS ===
        const buttonRow = contentEl.createDiv({ cls: 'rpg-modal-buttons' });

        const resetBtn = buttonRow.createEl('button', {
            text: '🔄 Reset to Defaults',
            cls: 'rpg-btn secondary'
        });
        resetBtn.onclick = async () => {
            s.ai.elderPersona = { ...DEFAULT_AI_SETTINGS.elderPersona };
            s.ai.elderPrompts = { ...DEFAULT_AI_SETTINGS.elderPrompts };
            s.ai.customKnowledge = '';
            s.ai.customSystemPrompt = '';
            await this.plugin.saveSettings();
            this.onOpen(); // Re-render
        };

        const saveBtn = buttonRow.createEl('button', {
            text: '💾 Save Changes',
            cls: 'rpg-btn primary'
        });
        saveBtn.onclick = async () => {
            await this.plugin.saveSettings();
            new Notice('Elder settings saved!');
            this.close();
            if (this.onComplete) this.onComplete();
        };
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ============================================================================
// AI QUEST GENERATOR MODAL
// ============================================================================

class AIQuestGeneratorModal extends Modal {
    constructor(app, plugin, onComplete) {
        super(app);
        this.plugin = plugin;
        this.onComplete = onComplete;
        this.generatedQuests = [];
        this.isLoading = false;
    }

    onOpen() {
        this.render();
    }

    onClose() {
        this.contentEl.empty();
    }

    render() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('rpg-ai-modal');

        const hasApiKey = !!this.plugin.settings.ai?.openRouterApiKey;

        contentEl.createEl('h2', { text: '✨ Quest Generator' });

        // Show weakest domains
        const s = this.plugin.settings;
        const sortedDomains = [...s.domains].sort((a, b) => a.score - b.score);
        const weakestDomains = sortedDomains.slice(0, 3);

        const infoSection = contentEl.createDiv({ cls: 'rpg-ai-info' });
        infoSection.createEl('p', { text: 'Generate quests to improve your weakest domains:' });
        weakestDomains.forEach(d => {
            infoSection.createDiv({ cls: 'rpg-domain-tag', text: `${d.icon} ${d.name} (${d.score}%)` });
        });

        if (this.isLoading) {
            contentEl.createDiv({ cls: 'rpg-loading', text: '🎲 Generating quests...' });
            return;
        }

        if (this.generatedQuests.length > 0) {
            this.renderGeneratedQuests(contentEl);
            return;
        }

        // Generate buttons
        const btnContainer = contentEl.createDiv({ cls: 'rpg-modal-buttons' });

        // Smart generate (always available)
        const smartBtn = btnContainer.createEl('button', {
            text: '📚 Smart Generate (3 Quests)',
            cls: 'rpg-primary-btn'
        });
        smartBtn.onclick = () => this.generateSmartQuests();

        // AI generate (only with API key)
        if (hasApiKey) {
            const aiBtn = btnContainer.createEl('button', {
                text: '🤖 AI Generate (Enhanced)',
                cls: 'rpg-secondary-btn'
            });
            aiBtn.onclick = () => this.generateAIQuests();
        } else {
            contentEl.createDiv({
                cls: 'rpg-info-note',
                text: '💡 Add an API key in Settings to unlock AI-enhanced quest generation with personalized suggestions.'
            });
        }
    }

    // Smart quest generation - works offline
    generateSmartQuests() {
        const s = this.plugin.settings;
        const sortedDomains = [...s.domains].sort((a, b) => a.score - b.score);
        const weakestDomains = sortedDomains.slice(0, 3);

        this.generatedQuests = weakestDomains.map(domain => {
            const tips = COACHING_TIPS[domain.id] || COACHING_TIPS.psychologicalWellbeing;
            const randomTip = tips[Math.floor(Math.random() * tips.length)];

            return {
                name: randomTip.tip,
                xp: 15 + Math.floor(Math.random() * 15),
                gold: 5 + Math.floor(Math.random() * 10),
                domain: domain.id,
                difficulty: 'medium',
                source: 'smart'
            };
        });

        this.render();
    }

    // AI quest generation - requires API key
    async generateAIQuests() {
        this.isLoading = true;
        this.render();

        try {
            const aiService = new AIService(this.plugin);
            this.generatedQuests = await aiService.generateQuests(3);
            this.generatedQuests = this.generatedQuests.map(q => ({ ...q, source: 'ai' }));
            this.isLoading = false;
            this.render();
        } catch (error) {
            this.isLoading = false;
            new Notice(`❌ ${error.message}`);
            // Fallback to smart generation
            this.generateSmartQuests();
        }
    }

    renderGeneratedQuests(contentEl) {
        contentEl.createEl('h3', { text: 'Generated Quests' });

        this.generatedQuests.forEach((quest, index) => {
            const questEl = contentEl.createDiv({ cls: 'rpg-generated-quest' });

            const domain = this.plugin.settings.domains.find(d => d.id === quest.domain);
            const domainIcon = domain ? domain.icon : '📌';

            questEl.createDiv({ cls: 'rpg-quest-name', text: quest.name });
            questEl.createDiv({
                cls: 'rpg-quest-meta',
                text: `${domainIcon} ${quest.domain} | ${quest.difficulty} | +${quest.xp}xp +${quest.gold}g`
            });

            const addBtn = questEl.createEl('button', { text: 'Add Quest', cls: 'rpg-add-btn' });
            addBtn.onclick = async () => {
                this.plugin.settings.quests.push({
                    name: quest.name,
                    domain: quest.domain,
                    difficulty: quest.difficulty,
                    xp: quest.xp,
                    gold: quest.gold,
                    completed: false,
                    completedDate: null,
                    aiGenerated: true
                });

                // Track AI quest generation
                if (!this.plugin.settings.aiQuestsGenerated) {
                    this.plugin.settings.aiQuestsGenerated = 0;
                }
                this.plugin.settings.aiQuestsGenerated++;

                await this.plugin.saveSettings();
                this.plugin.checkAchievements();

                addBtn.disabled = true;
                addBtn.setText('✓ Added');
                new Notice(`⚔️ Quest added: ${quest.name}`);
            };
        });

        const btnContainer = contentEl.createDiv({ cls: 'rpg-modal-buttons' });

        const regenerateBtn = btnContainer.createEl('button', {
            text: '🔄 Generate More',
            cls: 'rpg-secondary-btn'
        });
        regenerateBtn.onclick = () => {
            this.generatedQuests = [];
            this.generateQuests();
        };

        const closeBtn = btnContainer.createEl('button', {
            text: 'Done',
            cls: 'rpg-primary-btn'
        });
        closeBtn.onclick = () => {
            this.close();
            if (this.onComplete) this.onComplete();
        };
    }
}

// ============================================================================
// HERO DASHBOARD VIEW
// ============================================================================

class NewHabitModal extends Modal {
    constructor(app, plugin, onSubmit, habitIndex = null) {
        super(app);
        this.plugin = plugin;
        this.onSubmit = onSubmit;
        this.habitIndex = habitIndex;
        this.isEdit = habitIndex !== null && habitIndex !== undefined;
    }

    onOpen() {
        const { contentEl } = this;
        const existing = this.isEdit ? this.plugin.settings.habits[this.habitIndex] : null;
        contentEl.createEl("h2", { text: this.isEdit ? "Edit Habit" : "Create New Habit" });

        let name = existing?.name || "";
        let xp = existing?.xp ?? 10;
        let gold = existing?.gold ?? 5;
        let domain = existing?.domain || 'health';
        let difficulty = existing?.difficulty || 'medium';
        let skillXp = existing?.skillXp ?? 10;
        let bossDamage = existing?.bossDamage ?? 10;
        const linkedSkillIds = new Set(existing?.linkedSkillIds || []);
        const linkedBossIds = new Set(existing?.linkedBossIds || []);

        new Setting(contentEl).setName("Habit Name").addText(text => {
            text.setValue(name);
            text.onChange(value => name = value);
        });

        new Setting(contentEl).setName("Life Domain").addDropdown(dd => {
            this.plugin.settings.domains.forEach(d => dd.addOption(d.id, `${d.icon} ${d.name}`));
            dd.setValue(domain);
            dd.onChange(value => domain = value);
        });

        new Setting(contentEl).setName("Difficulty").addDropdown(dd => {
            Object.keys(DIFFICULTY).forEach(d => dd.addOption(d, DIFFICULTY[d].label));
            dd.setValue(difficulty);
            dd.onChange(value => difficulty = value);
        });

        new Setting(contentEl).setName("Base XP").addText(text => {
            text.setValue(String(xp));
            text.onChange(value => xp = Number(value));
        });

        new Setting(contentEl).setName("Base Gold").addText(text => {
            text.setValue(String(gold));
            text.onChange(value => gold = Number(value));
        });

        new Setting(contentEl).setName("Spell XP").setDesc("XP granted to each linked spell when this habit is completed.").addText(text => {
            text.setValue(String(skillXp));
            text.onChange(value => skillXp = Number(value));
        });

        new Setting(contentEl).setName("Boss damage").setDesc("Daño aplicado a cada boss vinculado cuando se complete el hábito.").addText(text => {
            text.setValue(String(bossDamage));
            text.onChange(value => bossDamage = Number(value));
        });

        const availableSkills = new SkillService(this.plugin).getSkills();
        contentEl.createEl("h3", { text: "Linked Spells" });
        if (availableSkills.length === 0) {
            contentEl.createEl("p", { text: "Create spells in the Skills tab before linking them to habits." });
        } else {
            availableSkills.forEach(skill => {
                new Setting(contentEl)
                    .setName(skill.name)
                    .setDesc(`${skill.spellSchool || skill.category} • Lv. ${skill.level}`)
                    .addToggle(toggle => {
                        toggle.setValue(linkedSkillIds.has(skill.id));
                        toggle.onChange(value => {
                            if (value) linkedSkillIds.add(skill.id);
                            else linkedSkillIds.delete(skill.id);
                        });
                    });
            });
        }

        const activeBosses = (this.plugin.settings.bossFights || []).filter(boss => !boss.defeated);
        contentEl.createEl("h3", { text: "Bosses vinculados" });
        if (activeBosses.length === 0) {
            contentEl.createEl("p", { text: "No hay bosses activos. El hábito puede guardarse sin boss vinculado.", cls: "rpg-subtitle" });
        } else {
            activeBosses.forEach(boss => {
                new Setting(contentEl)
                    .setName(boss.name)
                    .setDesc(`${boss.currentHp}/${boss.maxHp} HP`)
                    .addToggle(toggle => {
                        toggle.setValue(linkedBossIds.has(boss.id));
                        toggle.onChange(value => {
                            if (value) linkedBossIds.add(boss.id);
                            else linkedBossIds.delete(boss.id);
                        });
                    });
            });
        }

        new Setting(contentEl).addButton(btn => btn
            .setButtonText(this.isEdit ? "Save" : "Create")
            .setCta()
            .onClick(async () => {
                if (!name.trim()) {
                    new Notice("El hábito necesita un nombre.");
                    return;
                }

                const payload = {
                    name: name.trim(),
                    xp,
                    gold,
                    domain,
                    difficulty,
                    linkedSkillIds: Array.from(linkedSkillIds),
                    linkedBossIds: Array.from(linkedBossIds),
                    bossDamage: Number(bossDamage) || 10,
                    skillXp: Number(skillXp) || 10
                };

                if (this.isEdit && existing) {
                    const oldNorm = this.plugin.normalizeName(existing.name);
                    const newNorm = this.plugin.normalizeName(payload.name);
                    if (oldNorm !== newNorm) {
                        this.plugin.dismissNativeHabitName(existing.name);
                    }
                    Object.assign(existing, payload);
                    if (!existing.id) {
                        existing.id = `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    }
                } else {
                    this.plugin.settings.habits.push({
                        id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        ...payload,
                        completed: false,
                        streak: 0,
                        bestStreak: 0,
                        lastCompletedDate: null
                    });
                }

                await this.plugin.saveSettings();
                this.plugin.checkAchievements();
                this.onSubmit();
                this.close();
            }));
    }
    onClose() { this.contentEl.empty(); }
}

class ConfirmDeleteHabitModal extends Modal {
    constructor(app, plugin, habitIndex, onConfirm) {
        super(app);
        this.plugin = plugin;
        this.habitIndex = habitIndex;
        this.onConfirm = onConfirm;
    }

    onOpen() {
        const { contentEl } = this;
        const habit = this.plugin.settings.habits[this.habitIndex];
        const name = habit?.name || 'este hábito';
        contentEl.createEl("h2", { text: "Eliminar hábito" });
        contentEl.createEl("p", {
            text: `¿Eliminar «${name}» de Daily Rituals? No se volverá a auto-crear.`
        });
        contentEl.createEl("p", {
            cls: "rpg-subtitle",
            text: "Esto no quita líneas [habito::] de la plantilla o nota semanal."
        });

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText("Cancelar")
                .onClick(() => this.close()))
            .addButton(btn => btn
                .setButtonText("Eliminar")
                .setWarning()
                .onClick(async () => {
                    await this.plugin.removeHabit(this.habitIndex);
                    this.onConfirm();
                    this.close();
                }));
    }

    onClose() { this.contentEl.empty(); }
}

class ConfirmClearActivityLogModal extends Modal {
    constructor(app, plugin, onDone) {
        super(app);
        this.plugin = plugin;
        this.onDone = onDone;
        this.clearArchives = false;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl("h2", { text: "Clear Activity Log" });
        contentEl.createEl("p", { text: "¿Borrar el log vivo de actividad?" });

        new Setting(contentEl)
            .setName("También borrar archivos mensuales")
            .setDesc("Si está activo, se eliminan activityLogArchives.")
            .addToggle(toggle => toggle
                .setValue(false)
                .onChange(value => this.clearArchives = value));

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText("Cancelar")
                .onClick(() => this.close()))
            .addButton(btn => btn
                .setButtonText("Clear Log")
                .setWarning()
                .onClick(async () => {
                    this.plugin.settings.activityLog = [];
                    if (this.clearArchives) {
                        this.plugin.settings.activityLogArchives = {};
                    }
                    await this.plugin.saveSettings();
                    new Notice(this.clearArchives
                        ? "Activity log y archivos borrados."
                        : "Activity log borrado (archivos conservados).");
                    this.onDone();
                    this.close();
                }));
    }

    onClose() { this.contentEl.empty(); }
}

class TomeKnowledgeModal extends Modal {
    constructor(app, plugin, lootId, kind = 'tome') {
        super(app);
        this.plugin = plugin;
        this.lootId = lootId;
        this.kind = kind === 'flower' ? 'flower' : 'tome';
    }

    getLootItem() {
        return this.kind === 'flower'
            ? this.plugin.getFlowerById(this.lootId)
            : this.plugin.getTomeById(this.lootId);
    }

    renderLootPreview(parentEl, loot, unlocked) {
        const wrap = parentEl.createDiv({
            cls: `rpg-tome-modal-preview ${unlocked ? 'unlocked' : 'locked'}${this.kind === 'flower' ? ' flower' : ''}`
        });
        if (unlocked) {
            const outer = wrap.createDiv({ cls: 'rpg-tome-art-outer' });
            const inner = outer.createDiv({ cls: 'rpg-tome-art-inner' });
            this.renderLootImage(inner, loot.flatPath, loot.name);
        } else {
            const slot = wrap.createDiv({ cls: 'rpg-tome-locked-frame' });
            this.renderLootImage(slot, loot.flatPath, loot.name, true);
        }
        return wrap;
    }

    renderLootImage(parentEl, flatPath, alt, locked = false) {
        const trimmed = (flatPath || '').trim();
        const placeholder = this.kind === 'flower' ? '🌸' : '📖';
        if (trimmed) {
            const file = this.app.vault.getAbstractFileByPath(trimmed);
            if (file) {
                const img = parentEl.createEl('img', {
                    cls: `rpg-tome-flat-img${locked ? ' locked' : ''}`
                });
                img.src = this.app.vault.adapter.getResourcePath(file.path);
                img.alt = alt || '';
                return;
            }
        }
        parentEl.createDiv({ cls: 'rpg-vault-image-placeholder', text: placeholder });
    }

    onOpen() {
        const { contentEl } = this;
        const loot = this.getLootItem();
        const noun = this.kind === 'flower' ? 'Flor' : 'Tomo';
        if (!loot) {
            contentEl.createEl('p', { text: `${noun} no encontrada.` });
            return;
        }

        const boss = (this.plugin.settings.bossFights || [])
            .find(b => String(b.id) === String(loot.bossId));
        const unlocked = !!loot.unlocked;

        contentEl.createEl('h2', { text: loot.name || noun });
        this.renderLootPreview(contentEl, loot, unlocked);

        if (unlocked && boss) {
            contentEl.createEl('p', { cls: 'rpg-tome-boss-label', text: `Boss: ${boss.name}` });
        } else if (!loot.bossId) {
            contentEl.createEl('p', { cls: 'rpg-subtitle', text: 'Sin boss asignado.' });
        } else {
            contentEl.createEl('p', {
                cls: 'rpg-subtitle',
                text: `Bloqueado — derrota al boss para revelar est${this.kind === 'flower' ? 'a flor' : 'e tomo'}.`
            });
        }

        contentEl.createEl('h3', {
            text: this.kind === 'flower' ? 'Esta flor representa' : 'Este tomo representa'
        });
        const represents = (boss?.description || loot.description || '').trim() || 'Sin descripción';
        contentEl.createEl('p', { cls: 'rpg-tome-represents', text: represents });

        const report = loot.damageReport || (loot.bossId
            ? this.plugin.getTomeDamageBreakdown(loot.bossId)
            : { questTotal: 0, habitTotal: 0, quests: [], habits: [] });

        contentEl.createEl('h3', { text: 'Quest realizados' });
        contentEl.createEl('p', { text: `${report.questTotal || 0} daño` });
        if ((report.quests || []).length > 0) {
            const questList = contentEl.createEl('ul', { cls: 'rpg-tome-damage-list' });
            report.quests.forEach(row => {
                questList.createEl('li', { text: `${row.name} ${row.damage} daño` });
            });
        }

        contentEl.createEl('h3', { text: 'Rituales diarios' });
        if ((report.habits || []).length === 0) {
            contentEl.createEl('p', { cls: 'rpg-subtitle', text: 'Sin daño de rituales registrado.' });
        } else {
            const habitList = contentEl.createEl('ul', { cls: 'rpg-tome-damage-list' });
            report.habits.forEach(row => {
                habitList.createEl('li', { text: `${row.name} ${row.damage} daño` });
            });
        }
    }

    onClose() { this.contentEl.empty(); }
}

class NewQuestModal extends Modal {
    constructor(app, plugin, onSubmit) {
        super(app);
        this.plugin = plugin;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl("h2", { text: "Create New Quest" });

        let name = "";
        let xp = 50;
        let gold = 25;
        let domain = 'education';
        let difficulty = 'medium';
        let deadline = "";

        new Setting(contentEl).setName("Quest Name").addText(text => text.onChange(value => name = value));

        new Setting(contentEl).setName("Life Domain").addDropdown(dd => {
            this.plugin.settings.domains.forEach(d => dd.addOption(d.id, `${d.icon} ${d.name}`));
            dd.setValue(domain);
            dd.onChange(value => domain = value);
        });

        new Setting(contentEl).setName("Difficulty").addDropdown(dd => {
            Object.keys(DIFFICULTY).forEach(d => dd.addOption(d, DIFFICULTY[d].label));
            dd.setValue(difficulty);
            dd.onChange(value => difficulty = value);
        });

        new Setting(contentEl).setName("Deadline (optional)").addText(text => {
            text.inputEl.type = 'date';
            text.onChange(value => deadline = value);
        });

        new Setting(contentEl).setName("XP Reward").addText(text => {
            text.setValue("50");
            text.onChange(value => xp = Number(value));
        });

        new Setting(contentEl).setName("Gold Reward").addText(text => {
            text.setValue("25");
            text.onChange(value => gold = Number(value));
        });

        new Setting(contentEl).addButton(btn => btn
            .setButtonText("Create Quest")
            .setCta()
            .onClick(async () => {
                if (name) {
                    this.plugin.settings.quests.push({
                        name, xp, gold, domain, difficulty, deadline,
                        completed: false,
                        completedDate: null
                    });
                    await this.plugin.saveSettings();
                    this.onSubmit();
                    this.close();
                }
            }));
    }
    onClose() { this.contentEl.empty(); }
}

class NewBadHabitModal extends Modal {
    constructor(app, plugin, onSubmit) {
        super(app);
        this.plugin = plugin;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl("h2", { text: "Track Bad Habit" });

        let name = "";
        let hpCost = 10;
        let goldPenalty = 5;

        new Setting(contentEl).setName("Bad Habit Name").addText(text => text.onChange(value => name = value));
        new Setting(contentEl).setName("HP Cost").addText(text => {
            text.setValue("10");
            text.onChange(value => hpCost = Number(value));
        });
        new Setting(contentEl).setName("Gold Penalty").addText(text => {
            text.setValue("5");
            text.onChange(value => goldPenalty = Number(value));
        });

        new Setting(contentEl).addButton(btn => btn
            .setButtonText("Track")
            .setCta()
            .onClick(async () => {
                if (name) {
                    this.plugin.settings.badHabits.push({
                        name, hpCost, goldPenalty, triggerCount: 0
                    });
                    await this.plugin.saveSettings();
                    this.onSubmit();
                    this.close();
                }
            }));
    }
    onClose() { this.contentEl.empty(); }
}

class NewRewardModal extends Modal {
    constructor(app, plugin, onSubmit) {
        super(app);
        this.plugin = plugin;
        this.onSubmit = onSubmit;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.createEl("h2", { text: "Create Shop Reward" });
        let name = "";
        let cost = 50;

        new Setting(contentEl).setName("Reward Name").addText(text => text.onChange(value => name = value));
        new Setting(contentEl).setName("Gold Cost").addText(text => {
            text.setValue("50");
            text.onChange(value => cost = Number(value));
        });

        new Setting(contentEl).addButton(btn => btn.setButtonText("Create").setCta().onClick(async () => {
            if (name) {
                this.plugin.settings.rewards.push({ name, cost });
                await this.plugin.saveSettings();
                this.onSubmit();
                this.close();
            }
        }));
    }
    onClose() { this.contentEl.empty(); }
}

// ============================================================================
// VOW EDITOR MODAL (create / edit)
// ============================================================================
class VowEditorModal extends Modal {
    constructor(app, plugin, onSubmit, vowId = null) {
        super(app);
        this.plugin = plugin;
        this.onSubmit = onSubmit;
        this.vowId = vowId;
        this.isEdit = !!vowId;
    }

    onOpen() {
        const { contentEl } = this;
        const service = new VowService(this.plugin);
        const existing = this.isEdit ? service.getVow(this.vowId) : null;

        if (this.isEdit && !existing) {
            contentEl.createEl('p', { text: 'Vow no encontrado.' });
            return;
        }

        contentEl.createEl('h2', { text: this.isEdit ? 'Editar vow' : 'Nuevo vow' });
        contentEl.createEl('p', {
            cls: 'rpg-modal-subtitle',
            text: 'El estandarte aplica ×1.20 a quests de esas escuelas cuando la grilla está 50/50. Cambiar toggles en un vow ya completo vale para la próxima quest (no recalcula las viejas).'
        });

        let title = existing?.title || '';
        let inscription = existing?.inscription || '';
        let imagePath = existing?.imagePath || '';
        let cols = existing?.cols || 5;
        let rows = existing?.rows || 10;
        const selectedSchools = new Set(Array.isArray(existing?.schools) ? existing.schools : []);

        const banner = contentEl.createDiv({ cls: 'rpg-vow-banner rpg-vow-banner-modal' });
        const imagePreview = contentEl.createDiv({ cls: 'rpg-boss-image-preview' });

        const refreshBanner = () => {
            banner.empty();
            banner.createDiv({ cls: 'rpg-vow-banner-title', text: title.trim() || 'Título del vow' });
            banner.createDiv({
                cls: 'rpg-vow-banner-inscription',
                text: inscription.trim() || 'Creencia / inscripción…'
            });

            imagePreview.empty();
            if (!imagePath) {
                imagePreview.createEl('p', { cls: 'rpg-subtitle', text: 'Sin imagen seleccionada' });
                return;
            }
            const wrap = imagePreview.createDiv({ cls: 'rpg-vow-modal-art' });
            const file = this.app.vault.getAbstractFileByPath(imagePath);
            if (file) {
                const img = wrap.createEl('img', { cls: 'rpg-vault-image' });
                img.src = this.app.vault.adapter.getResourcePath(file.path);
                img.alt = file.name;
            } else {
                wrap.createDiv({ cls: 'rpg-vault-image-placeholder', text: '?' });
            }
            imagePreview.createDiv({
                cls: 'rpg-tome-preview-name',
                text: imagePath.replace(/\\/g, '/').split('/').pop()
            });
        };

        new Setting(contentEl)
            .setName('Título')
            .setDesc('Nombre corto del vow (aparece en el banner)')
            .addText(text => text
                .setPlaceholder('Autocompasión')
                .setValue(title)
                .onChange(value => {
                    title = value;
                    refreshBanner();
                }));

        new Setting(contentEl)
            .setName('Creencia / inscripción')
            .setDesc('La frase de identidad que iluminás con evidencias')
            .addTextArea(text => {
                text.setPlaceholder('Soy una persona…');
                text.setValue(inscription);
                text.inputEl.rows = 3;
                text.onChange(value => {
                    inscription = value;
                    refreshBanner();
                });
            });

        const vowImages = service.listVowImages(this.app);
        new Setting(contentEl)
            .setName('Imagen')
            .setDesc(`Elegí un archivo de ${VOWS_IMAGES_FOLDER}`)
            .addDropdown(dd => {
                dd.addOption('', '— Sin imagen —');
                vowImages.forEach(file => dd.addOption(file.path, file.name));
                if (imagePath && !vowImages.some(f => f.path === imagePath || f.path.replace(/\\/g, '/') === imagePath.replace(/\\/g, '/'))) {
                    const label = imagePath.replace(/\\/g, '/').split('/').pop();
                    dd.addOption(imagePath, `${label} (actual)`);
                }
                dd.setValue(imagePath || '');
                dd.onChange(value => {
                    imagePath = value;
                    refreshBanner();
                });
            });

        new Setting(contentEl)
            .setName('Columnas')
            .addText(text => text
                .setValue(String(cols))
                .onChange(value => {
                    const n = parseInt(value, 10);
                    if (!Number.isNaN(n) && n > 0) cols = n;
                }));

        new Setting(contentEl)
            .setName('Filas')
            .addText(text => text
                .setValue(String(rows))
                .onChange(value => {
                    const n = parseInt(value, 10);
                    if (!Number.isNaN(n) && n > 0) rows = n;
                }));

        contentEl.createEl('h3', { text: 'Estandarte / escuelas' });
        contentEl.createEl('p', {
            cls: 'rpg-subtitle',
            text: 'Al completar la grilla, ×1.20 acumulativo en quests futuras de las escuelas marcadas. Cero escuelas = no multiplica nada.'
        });
        SKILL_TREE_SCHOOLS.forEach(school => {
            new Setting(contentEl)
                .setName(school.name)
                .setDesc(`Quests de ${school.name} reciben el estandarte`)
                .addToggle(toggle => {
                    toggle.setValue(selectedSchools.has(school.id));
                    toggle.onChange(value => {
                        if (value) selectedSchools.add(school.id);
                        else selectedSchools.delete(school.id);
                    });
                });
        });

        refreshBanner();

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Cancelar')
                .onClick(() => this.close()))
            .addButton(btn => btn
                .setButtonText(this.isEdit ? 'Guardar' : 'Crear')
                .setCta()
                .onClick(async () => {
                    if (!title.trim()) {
                        new Notice('El vow necesita un título.');
                        return;
                    }
                    const schools = Array.from(selectedSchools);
                    if (this.isEdit) {
                        service.updateVow(this.vowId, { title, inscription, imagePath, cols, rows, schools });
                    } else {
                        service.createVow({ title, inscription, imagePath, cols, rows, schools });
                    }
                    await this.plugin.saveSettings();
                    new Notice(this.isEdit ? 'Vow actualizado' : 'Vow creado');
                    if (this.onSubmit) this.onSubmit();
                    this.close();
                }));
    }

    onClose() { this.contentEl.empty(); }
}

// ============================================================================
// LINK HITO → VOW MODAL
// ============================================================================
class LinkHitoToVowModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    getActiveDailyMeta() {
        const file = this.app.workspace.getActiveFile();
        if (!file) return { file: null, cache: null, date: new Date().toISOString().slice(0, 10) };
        const cache = this.app.metadataCache.getFileCache(file);
        const base = file.basename || '';
        const dateMatch = base.match(/^(\d{4}-\d{2}-\d{2})/);
        return {
            file,
            cache,
            date: dateMatch ? dateMatch[1] : new Date().toISOString().slice(0, 10)
        };
    }

    onOpen() {
        const { contentEl } = this;
        const service = new VowService(this.plugin);
        const vows = service.listVows();
        const { file, cache, date } = this.getActiveDailyMeta();
        const fm = cache?.frontmatter || {};

        contentEl.createEl('h2', { text: 'Vincular hito a vow' });
        contentEl.createEl('p', {
            cls: 'rpg-modal-subtitle',
            text: file
                ? `Nota: ${file.basename} · fecha ${date}`
                : 'Abrí una nota diaria primero (o elegí hito vacío y pegá texto luego).'
        });

        let hitoIndex = 1;
        let vowId = vows[0]?.id || '';
        const preview = contentEl.createDiv({ cls: 'rpg-vow-hito-preview' });

        const readHitoText = (idx) => {
            const raw = fm[`hito${idx}`];
            return raw != null ? String(raw).trim() : '';
        };

        const refreshPreview = () => {
            preview.empty();
            const text = readHitoText(hitoIndex);
            preview.createEl('strong', { text: `Hito ${hitoIndex}:` });
            preview.createEl('p', {
                text: text || '(vacío — escribí el hito en el diario antes de vincular)'
            });
        };

        new Setting(contentEl)
            .setName('Hito')
            .addDropdown(dd => {
                [1, 2, 3].forEach(n => {
                    const t = readHitoText(n);
                    const label = t ? `Hito ${n}: ${t.slice(0, 40)}${t.length > 40 ? '…' : ''}` : `Hito ${n} (vacío)`;
                    dd.addOption(String(n), label);
                });
                dd.setValue('1');
                dd.onChange(value => {
                    hitoIndex = parseInt(value, 10) || 1;
                    refreshPreview();
                });
            });

        new Setting(contentEl)
            .setName('Vow')
            .setDesc('Lista dinámica desde Hero → Vows')
            .addDropdown(dd => {
                if (vows.length === 0) {
                    dd.addOption('', '— No hay vows —');
                } else {
                    vows.forEach(v => {
                        const n = service.revealedCount(v);
                        const target = service.targetCells(v);
                        dd.addOption(v.id, `${v.title} (${n}/${target})`);
                    });
                }
                dd.setValue(vowId);
                dd.onChange(value => { vowId = value; });
            });

        refreshPreview();

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Cancelar')
                .onClick(() => this.close()))
            .addButton(btn => btn
                .setButtonText('Vincular')
                .setCta()
                .onClick(async () => {
                    if (!vowId) {
                        new Notice('Creá un vow primero en Hero → Vows.');
                        return;
                    }
                    const experience = readHitoText(hitoIndex);
                    try {
                        service.addGrain(vowId, { date, experience });
                        await this.plugin.saveSettings();
                        if (file) {
                            await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
                                frontmatter[`vowId${hitoIndex}`] = vowId;
                            });
                        }
                        this.plugin.refreshViews?.();
                        new Notice(`Grano agregado a vow (${hitoIndex})`);
                        this.close();
                    } catch (err) {
                        new Notice(err.message || String(err));
                    }
                }));
    }

    onClose() { this.contentEl.empty(); }
}

// ============================================================================
// BOSS FIGHT MODAL
// ============================================================================
class NewBossFightModal extends Modal {
    constructor(app, plugin, onSubmit, bossId = null) {
        super(app);
        this.plugin = plugin;
        this.onSubmit = onSubmit;
        this.bossId = bossId;
        this.isEdit = !!bossId;
    }

    onOpen() {
        const { contentEl } = this;
        this.plugin.ensureTomesCatalog();
        this.plugin.ensureFlowersCatalog();
        const existing = this.isEdit
            ? (this.plugin.settings.bossFights || []).find(b => String(b.id) === String(this.bossId))
            : null;

        if (this.isEdit && !existing) {
            contentEl.createEl('p', { text: 'Boss no encontrado.' });
            return;
        }

        contentEl.createEl("h2", { text: this.isEdit ? "🐉 Edit Boss Fight" : "🐉 Create Boss Fight" });
        contentEl.createEl("p", {
            cls: 'rpg-modal-subtitle',
            text: this.isEdit
                ? 'Actualiza el boss y su loot de Knowledge (tomo o flor).'
                : 'Turn your big goal into an epic battle!'
        });

        let name = existing?.name || "";
        let description = existing?.description || "";
        let icon = existing?.icon || "🐉";
        let imagePath = existing?.imagePath || "";
        let tier = existing?.tier || 'standard';
        let maxHp = existing?.maxHp || BOSS_TIERS.standard.maxHp;
        let domain = existing?.domain || 'psychologicalWellbeing';
        let tomeId = existing?.tomeId || "";
        let flowerId = existing?.flowerId || "";
        let refreshKnowledgeUI = () => {};

        new Setting(contentEl)
            .setName("Boss Name")
            .setDesc("Give your boss a memorable name")
            .addText(text => text
                .setPlaceholder("The Lazy Dragon")
                .setValue(name)
                .onChange(value => name = value));

        new Setting(contentEl)
            .setName("Description")
            .setDesc("Lo que representa vencer al boss / lo que el tomo revela al desbloquearse")
            .addTextArea(text => {
                text.setPlaceholder("Significa vencer el miedo al rechazo…");
                text.setValue(description);
                text.inputEl.rows = 6;
                text.onChange(value => description = value);
            });

        new Setting(contentEl)
            .setName("Boss Icon")
            .setDesc("Emoji de respaldo si no hay imagen")
            .addText(text => text
                .setValue(icon)
                .onChange(value => icon = value));

        const BOSS_IMAGES_FOLDER = 'RpgImages/bosses';
        const bossImages = this.app.vault.getFiles()
            .filter(file => {
                const p = file.path.replace(/\\/g, '/');
                return p.startsWith(`${BOSS_IMAGES_FOLDER}/`) &&
                    /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name);
            })
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        const imagePreview = contentEl.createDiv({ cls: 'rpg-boss-image-preview' });
        const refreshImagePreview = () => {
            imagePreview.empty();
            if (!imagePath) {
                imagePreview.createEl('p', { cls: 'rpg-subtitle', text: 'Sin imagen — se usa el emoji' });
                return;
            }
            const wrap = imagePreview.createDiv({ cls: 'rpg-boss-icon' });
            const file = this.app.vault.getAbstractFileByPath(imagePath);
            if (file) {
                const img = wrap.createEl('img', { cls: 'rpg-vault-image' });
                img.src = this.app.vault.adapter.getResourcePath(file.path);
                img.alt = file.name;
            } else {
                wrap.createDiv({ cls: 'rpg-vault-image-placeholder', text: icon || '🐉' });
            }
            imagePreview.createDiv({
                cls: 'rpg-tome-preview-name',
                text: imagePath.replace(/\\/g, '/').split('/').pop()
            });
        };

        new Setting(contentEl)
            .setName("Imagen del boss")
            .setDesc(`Elegí un icono de ${BOSS_IMAGES_FOLDER}`)
            .addDropdown(dd => {
                dd.addOption('', '— Sin imagen (emoji) —');
                bossImages.forEach(file => dd.addOption(file.path, file.name));
                if (imagePath && !bossImages.some(f => f.path === imagePath || f.path.replace(/\\/g, '/') === imagePath.replace(/\\/g, '/'))) {
                    const label = imagePath.replace(/\\/g, '/').split('/').pop();
                    dd.addOption(imagePath, `${label} (actual)`);
                }
                dd.setValue(imagePath || '');
                dd.onChange(value => {
                    imagePath = value;
                    refreshImagePreview();
                });
            });
        refreshImagePreview();

        new Setting(contentEl)
            .setName("Dificultad / HP")
            .setDesc("Soberano = 10000 HP con tomo (encima de Primordial). Primordial = 2000 HP con tomo. Los demás usan flor.")
            .addDropdown(dd => {
                Object.entries(BOSS_TIERS).forEach(([id, info]) => dd.addOption(id, info.label));
                dd.setValue(tier);
                dd.onChange(value => {
                    tier = value;
                    maxHp = BOSS_TIERS[value]?.maxHp || 100;
                    refreshKnowledgeUI();
                });
            });

        new Setting(contentEl)
            .setName("Linked Domain")
            .setDesc("Completing tasks in this domain damages the boss")
            .addDropdown(dd => {
                DEFAULT_DOMAINS.forEach(d => dd.addOption(d.id, `${d.icon} ${d.name}`));
                dd.setValue(domain);
                dd.onChange(value => domain = value);
            });

        // Knowledge picker: tomo (primordial/soberano) o flor (resto)
        const knowledgeCard = contentEl.createDiv({ cls: 'rpg-boss-knowledge' });
        const knowledgeTitle = knowledgeCard.createEl('h3');
        const knowledgeDesc = knowledgeCard.createEl('p', { cls: 'rpg-subtitle' });
        const lootPreview = knowledgeCard.createDiv({ cls: 'rpg-boss-tome-preview' });
        const lootPickerHost = knowledgeCard.createDiv();

        const refreshLootPreview = (kind) => {
            lootPreview.empty();
            const loot = kind === 'flower'
                ? this.plugin.getFlowerById(flowerId)
                : this.plugin.getTomeById(tomeId);
            if (!loot) {
                lootPreview.createEl('p', {
                    cls: 'rpg-subtitle',
                    text: kind === 'flower' ? 'Ninguna flor seleccionada' : 'Ningún tomo seleccionado'
                });
                return;
            }
            const outer = lootPreview.createDiv({ cls: 'rpg-tome-art-outer' });
            const inner = outer.createDiv({ cls: 'rpg-tome-art-inner' });
            const file = this.app.vault.getAbstractFileByPath(loot.flatPath);
            if (file) {
                const img = inner.createEl('img', { cls: 'rpg-tome-flat-img' });
                img.src = this.app.vault.adapter.getResourcePath(file.path);
                img.alt = loot.name;
            } else {
                inner.createDiv({
                    cls: 'rpg-vault-image-placeholder',
                    text: kind === 'flower' ? '🌸' : '📖'
                });
            }
            lootPreview.createDiv({ cls: 'rpg-tome-preview-name', text: loot.name });
        };

        refreshKnowledgeUI = () => {
            const usesTome = bossUsesTome(tier);
            knowledgeTitle.setText(usesTome ? '📖 Knowledge' : '🌸 Knowledge');
            knowledgeDesc.setText(usesTome
                ? 'Bosses primordiales y soberanos llevan tomo. Se desbloquea al derrotarlo. La Description es “Este tomo representa…”.'
                : 'Bosses sin tomo llevan una flor. Se desbloquea al derrotarlo. La Description es “Esta flor representa…”.');
            lootPickerHost.empty();

            if (usesTome) {
                const availableTomes = this.plugin.getAvailableTomesForBoss(existing?.id || null);
                new Setting(lootPickerHost)
                    .setName('Tomo')
                    .setDesc('Flats en RpgImages/Loot/Tomes/Flats')
                    .addDropdown(dd => {
                        dd.addOption('', '— Sin tomo —');
                        availableTomes.forEach(tome => dd.addOption(tome.id, tome.name));
                        dd.setValue(tomeId || '');
                        dd.onChange(value => {
                            tomeId = value;
                            refreshLootPreview('tome');
                        });
                    });
                refreshLootPreview('tome');
            } else {
                const availableFlowers = this.plugin.getAvailableFlowersForBoss(existing?.id || null);
                new Setting(lootPickerHost)
                    .setName('Flor')
                    .setDesc('Sprites en RpgImages/Loot/Flowers')
                    .addDropdown(dd => {
                        dd.addOption('', '— Sin flor —');
                        availableFlowers.forEach(flower => dd.addOption(flower.id, flower.name));
                        dd.setValue(flowerId || '');
                        dd.onChange(value => {
                            flowerId = value;
                            refreshLootPreview('flower');
                        });
                    });
                refreshLootPreview('flower');
            }
        };

        refreshKnowledgeUI();

        if (!this.isEdit) {
            // Boss templates (create only)
            contentEl.createEl('h4', { text: '📋 Or choose a template:' });
            const templateGrid = contentEl.createDiv({ cls: 'rpg-boss-template-grid' });

            BOSS_TEMPLATES.forEach(template => {
                const templateBtn = templateGrid.createDiv({ cls: 'rpg-boss-template' });
                templateBtn.createDiv({ text: template.name });
                templateBtn.createDiv({ text: template.desc, cls: 'rpg-boss-template-desc' });

                templateBtn.onclick = () => {
                    name = template.name;
                    description = template.desc;
                    maxHp = template.baseHp;
                    domain = template.domain;
                    tier = Object.entries(BOSS_TIERS).find(([, info]) => info.maxHp === template.baseHp)?.[0] || 'standard';

                    contentEl.querySelectorAll('input').forEach((input, idx) => {
                        if (idx === 0) input.value = name;
                        if (idx === 1) input.value = description;
                    });
                };
            });
        }

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText(this.isEdit ? "💾 Save Boss" : "⚔️ Start Boss Fight!")
                .setCta()
                .onClick(async () => {
                    if (!name) {
                        new Notice("Boss needs a name!");
                        return;
                    }

                    if (!this.plugin.settings.bossFights) {
                        this.plugin.settings.bossFights = [];
                    }

                    let boss = existing;
                    if (this.isEdit) {
                        const hpRatio = existing.maxHp > 0 ? existing.currentHp / existing.maxHp : 1;
                        existing.name = name;
                        existing.description = description;
                        existing.icon = icon;
                        existing.imagePath = imagePath;
                        existing.tier = tier;
                        existing.domain = domain;
                        existing.maxHp = maxHp;
                        if (!existing.defeated) {
                            existing.currentHp = Math.max(1, Math.round(maxHp * hpRatio));
                        }
                        boss = existing;
                    } else {
                        boss = {
                            id: Date.now().toString(),
                            name,
                            description,
                            icon,
                            imagePath,
                            tier,
                            maxHp,
                            currentHp: maxHp,
                            domain,
                            defeated: false,
                            tomeId: null,
                            flowerId: null,
                            createdAt: new Date().toISOString()
                        };
                        this.plugin.settings.bossFights.push(boss);
                    }

                    // Primordial/soberano → tomo; resto → flor (mutuamente excluyentes)
                    if (bossUsesTome(tier)) {
                        this.plugin.assignTomeToBoss(boss.id, tomeId || null, description);
                        this.plugin.assignFlowerToBoss(boss.id, null);
                    } else {
                        this.plugin.assignFlowerToBoss(boss.id, flowerId || null, description);
                        this.plugin.assignTomeToBoss(boss.id, null);
                    }
                    await this.plugin.saveSettings();

                    new Notice(this.isEdit
                        ? `🐉 Boss "${name}" actualizado.`
                        : `🐉 Boss "${name}" has appeared! Defeat it by completing ${domain} tasks!`);
                    this.onSubmit();
                    this.close();
                }));
    }

    onClose() { this.contentEl.empty(); }
}

// ============================================================================
// ADD SKILL MODAL
// ============================================================================
class AddSkillModal extends Modal {
    constructor(app, plugin, onSubmit) {
        super(app);
        this.plugin = plugin;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.addClass('rpg-add-skill-modal');

        contentEl.createEl('h2', { text: '🎯 Add New Spell' });

        let name = '';
        let category = 'vocation';
        let description = '';

        new Setting(contentEl)
            .setName('Spell Name')
            .setDesc('What spell are you developing?')
            .addText(text => text
                .setPlaceholder('e.g., Meditación')
                .onChange(value => name = value));

        new Setting(contentEl)
            .setName('Category')
            .setDesc('Which quadrant does this spell belong to?')
            .addDropdown(dd => {
                Object.entries(SKILL_CATEGORIES).forEach(([id, info]) => {
                    dd.addOption(id, `${info.icon} ${info.name}`);
                });
                dd.setValue('vocation');
                dd.onChange(value => category = value);
            });

        new Setting(contentEl)
            .setName('Description')
            .setDesc('Optional description of this spell')
            .addTextArea(text => text
                .setPlaceholder('What does this spell do?')
                .onChange(value => description = value));

        // Examples section
        const examplesDiv = contentEl.createDiv({ cls: 'rpg-skill-examples-section' });
        examplesDiv.createEl('h4', { text: '💡 Example Spells by Category' });

        Object.entries(SKILL_CATEGORIES).forEach(([id, info]) => {
            const catDiv = examplesDiv.createDiv({ cls: 'rpg-skill-example-cat' });
            catDiv.innerHTML = `<strong>${info.icon} ${info.name}:</strong> ${info.examples.join(', ')}`;
        });

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Cancel')
                .onClick(() => this.close()))
            .addButton(btn => btn
                .setButtonText('Add Spell')
                .setCta()
                .onClick(async () => {
                    if (!name.trim()) {
                        new Notice('Please enter a spell name');
                        return;
                    }

                    const skillService = new SkillService(this.plugin);
                    const skill = skillService.createSkill(name.trim(), category, 'manual', description.trim());

                    this.plugin.logActivity('skill_added', `Added spell: ${skill.name}`, { category });

                    await this.plugin.saveSettings();
                    new Notice(`🎯 Spell added: ${skill.name}`);
                    this.onSubmit();
                    this.close();
                }));
    }

    onClose() { this.contentEl.empty(); }
}

// ============================================================================
// NPC DIALOG MODAL
// ============================================================================
class NPCDialogModal extends Modal {
    constructor(app, plugin, npc, questSuggestion, onSubmit) {
        super(app);
        this.plugin = plugin;
        this.npc = npc;
        this.questSuggestion = questSuggestion;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.addClass('rpg-npc-dialog-modal');

        // NPC Header
        const header = contentEl.createDiv({ cls: 'rpg-npc-dialog-header' });
        header.createDiv({ cls: 'rpg-npc-dialog-icon', text: this.npc.icon });
        const headerInfo = header.createDiv({ cls: 'rpg-npc-dialog-info' });
        headerInfo.createEl('h2', { text: this.npc.name });
        headerInfo.createDiv({ cls: 'rpg-npc-dialog-role', text: this.npc.role });

        // Dialogue
        const dialogueBox = contentEl.createDiv({ cls: 'rpg-npc-dialogue-box' });
        dialogueBox.createEl('p', { text: `"${this.npc.dialogue}"` });

        // Quest Suggestion
        if (this.questSuggestion) {
            const questSection = contentEl.createDiv({ cls: 'rpg-npc-quest-section' });
            questSection.createEl('h3', { text: '📜 Quest Suggestion' });

            const questCard = questSection.createDiv({ cls: 'rpg-npc-quest-card' });
            questCard.createDiv({ cls: 'rpg-npc-quest-domain', text: `${this.questSuggestion.domain.icon} ${this.questSuggestion.domain.name}` });
            questCard.createDiv({ cls: 'rpg-npc-quest-name', text: this.questSuggestion.questName });

            const rewards = questCard.createDiv({ cls: 'rpg-npc-quest-rewards' });
            rewards.createSpan({ text: `⭐ ${this.questSuggestion.xp} XP` });
            rewards.createSpan({ text: `💰 ${this.questSuggestion.gold}g` });

            const acceptBtn = questSection.createEl('button', {
                text: '✅ Accept Quest',
                cls: 'rpg-full-width-btn primary'
            });
            acceptBtn.onclick = async () => {
                const newQuest = {
                    name: this.questSuggestion.questName,
                    xp: this.questSuggestion.xp,
                    gold: this.questSuggestion.gold,
                    domain: this.questSuggestion.domain.id,
                    difficulty: 'medium',
                    completed: false,
                    npcGiver: this.npc.id
                };
                this.plugin.settings.quests.push(newQuest);

                // Log activity
                this.plugin.logActivity('quest_complete', `Accepted quest from ${this.npc.name}`, {
                    questName: this.questSuggestion.questName
                });

                await this.plugin.saveSettings();
                new Notice(`📜 Quest accepted: ${this.questSuggestion.questName}`);
                this.onSubmit();
                this.close();
            };
        } else {
            contentEl.createDiv({ cls: 'rpg-npc-no-quest', text: 'No quest available right now. Check back later!' });
        }

        // Close button
        const closeBtn = contentEl.createEl('button', {
            text: 'Farewell',
            cls: 'rpg-full-width-btn secondary'
        });
        closeBtn.onclick = () => this.close();
    }

    onClose() { this.contentEl.empty(); }
}

// ============================================================================
// SETTINGS TAB
// ============================================================================

class LifeRPGSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Life RPG Settings' });

        // AI Settings Section
        containerEl.createEl('h3', { text: '🤖 AI Configuration' });

        const ai = this.plugin.settings.ai || {};
        const currentProvider = ai.provider || 'openrouter';

        // Provider Selection
        new Setting(containerEl)
            .setName('AI Provider')
            .setDesc('Choose your AI service provider for chat and coaching.')
            .addDropdown(dd => {
                Object.entries(AI_PROVIDERS).forEach(([id, provider]) => {
                    dd.addOption(id, `${provider.name} - ${provider.description}`);
                });
                dd.setValue(currentProvider);
                dd.onChange(async (value) => {
                    if (!this.plugin.settings.ai) {
                        this.plugin.settings.ai = JSON.parse(JSON.stringify(DEFAULT_AI_SETTINGS));
                    }
                    this.plugin.settings.ai.provider = value;
                    await this.plugin.saveSettings();
                    this.display(); // Refresh to show provider-specific options
                });
            });

        // API Key for current provider
        const providerConfig = AI_PROVIDERS[currentProvider];
        const apiKeyPlaceholders = {
            openrouter: 'sk-or-v1-...',
            openai: 'sk-...',
            anthropic: 'sk-ant-...',
            google: 'AIza...'
        };

        new Setting(containerEl)
            .setName(`${providerConfig.name} API Key`)
            .setDesc(`Enter your ${providerConfig.name} API key`)
            .addText(text => text
                .setPlaceholder(apiKeyPlaceholders[currentProvider] || 'Enter API key...')
                .setValue(ai.apiKeys?.[currentProvider] || ai.openRouterApiKey || '')
                .onChange(async (value) => {
                    if (!this.plugin.settings.ai) {
                        this.plugin.settings.ai = JSON.parse(JSON.stringify(DEFAULT_AI_SETTINGS));
                    }
                    if (!this.plugin.settings.ai.apiKeys) {
                        this.plugin.settings.ai.apiKeys = {};
                    }
                    this.plugin.settings.ai.apiKeys[currentProvider] = value;
                    // Also update legacy field for backwards compatibility
                    if (currentProvider === 'openrouter') {
                        this.plugin.settings.ai.openRouterApiKey = value;
                    }
                    await this.plugin.saveSettings();
                }));

        // Model Selection for current provider
        const chatModels = getChatModels(currentProvider);
        if (chatModels.length > 0) {
            new Setting(containerEl)
                .setName('Chat Model')
                .setDesc(`Choose which ${providerConfig.name} model to use for the Elder and coaching.`)
                .addDropdown(dd => {
                    chatModels.forEach(model => {
                        dd.addOption(model.id, model.name);
                    });
                    dd.setValue(ai.selectedModels?.[currentProvider] || chatModels[0].id);
                    dd.onChange(async (value) => {
                        if (!this.plugin.settings.ai) {
                            this.plugin.settings.ai = JSON.parse(JSON.stringify(DEFAULT_AI_SETTINGS));
                        }
                        if (!this.plugin.settings.ai.selectedModels) {
                            this.plugin.settings.ai.selectedModels = {};
                        }
                        this.plugin.settings.ai.selectedModels[currentProvider] = value;
                        await this.plugin.saveSettings();
                    });
                });
        }

        new Setting(containerEl)
            .setName('Temperature')
            .setDesc('Controls randomness. Lower = more focused, Higher = more creative (0.0 - 1.0)')
            .addSlider(slider => slider
                .setLimits(0, 1, 0.1)
                .setValue(ai.temperature || 0.7)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    if (!this.plugin.settings.ai) {
                        this.plugin.settings.ai = JSON.parse(JSON.stringify(DEFAULT_AI_SETTINGS));
                    }
                    this.plugin.settings.ai.temperature = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Max Tokens')
            .setDesc('Maximum length of AI responses (100 - 4000)')
            .addText(text => text
                .setValue(String(ai.maxTokens || 1000))
                .onChange(async (value) => {
                    const num = parseInt(value);
                    if (!isNaN(num) && num >= 100 && num <= 4000) {
                        if (!this.plugin.settings.ai) {
                            this.plugin.settings.ai = JSON.parse(JSON.stringify(DEFAULT_AI_SETTINGS));
                        }
                        this.plugin.settings.ai.maxTokens = num;
                        await this.plugin.saveSettings();
                    }
                }));

        // Provider-specific info
        const infoEl = containerEl.createDiv({ cls: 'rpg-settings-info' });
        const providerInstructions = {
            openrouter: {
                title: '📖 OpenRouter Setup',
                steps: [
                    'Go to openrouter.ai and create an account',
                    'Navigate to Keys section',
                    'Create a new API key',
                    'Copy and paste it above'
                ],
                note: 'OpenRouter provides access to 100+ AI models with one API key. Pay only for what you use.'
            },
            openai: {
                title: '📖 OpenAI Setup',
                steps: [
                    'Go to platform.openai.com',
                    'Sign in or create an account',
                    'Go to API Keys section',
                    'Create a new secret key'
                ],
                note: 'OpenAI provides GPT models directly. Requires a paid account with credits.'
            },
            anthropic: {
                title: '📖 Anthropic Setup',
                steps: [
                    'Go to console.anthropic.com',
                    'Sign in or create an account',
                    'Go to API Keys section',
                    'Create a new key'
                ],
                note: 'Anthropic provides Claude models directly. Note: Anthropic does not support embeddings.'
            },
            google: {
                title: '📖 Google AI Setup',
                steps: [
                    'Go to makersuite.google.com',
                    'Sign in with your Google account',
                    'Click "Get API key"',
                    'Create a key for a new or existing project'
                ],
                note: 'Google AI Studio provides Gemini models. Free tier available with rate limits.'
            }
        };

        const info = providerInstructions[currentProvider];
        infoEl.createEl('h4', { text: info.title });
        infoEl.createEl('ol', {}, ol => {
            info.steps.forEach(step => {
                ol.createEl('li', { text: step });
            });
        });
        infoEl.createEl('p', { text: info.note, cls: 'rpg-settings-note' });

        // Show configured providers status
        const configuredProviders = Object.entries(AI_PROVIDERS)
            .filter(([id]) => ai.apiKeys?.[id] || (id === 'openrouter' && ai.openRouterApiKey))
            .map(([id, config]) => config.name);

        if (configuredProviders.length > 0) {
            const statusEl = containerEl.createDiv({ cls: 'rpg-settings-status' });
            statusEl.innerHTML = `<strong>✅ Configured providers:</strong> ${configuredProviders.join(', ')}`;
        }

        // Journal Intelligence Section
        containerEl.createEl('h3', { text: '📓 Journal Intelligence' });

        new Setting(containerEl)
            .setName('Enable Journal Analysis')
            .setDesc('Analyze your journal entries to affect character stats')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.journalSettings?.enabled ?? true)
                .onChange(async (value) => {
                    if (!this.plugin.settings.journalSettings) {
                        this.plugin.settings.journalSettings = JSON.parse(JSON.stringify(DEFAULT_JOURNAL_SETTINGS));
                    }
                    this.plugin.settings.journalSettings.enabled = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Scan Mode')
            .setDesc('How to identify journal entries')
            .addDropdown(dropdown => dropdown
                .addOption('folder', 'By Folder')
                .addOption('tag', 'By Tag')
                .setValue(this.plugin.settings.journalSettings?.scanMode || 'folder')
                .onChange(async (value) => {
                    if (!this.plugin.settings.journalSettings) {
                        this.plugin.settings.journalSettings = JSON.parse(JSON.stringify(DEFAULT_JOURNAL_SETTINGS));
                    }
                    this.plugin.settings.journalSettings.scanMode = value;
                    await this.plugin.saveSettings();
                    this.display(); // Refresh to show relevant option
                }));

        if (this.plugin.settings.journalSettings?.scanMode === 'folder' || !this.plugin.settings.journalSettings?.scanMode) {
            new Setting(containerEl)
                .setName('Journal Folder')
                .setDesc('Folder containing your journal entries (without leading slash)')
                .addText(text => text
                    .setPlaceholder('Journal')
                    .setValue(this.plugin.settings.journalSettings?.journalFolder || 'Journal')
                    .onChange(async (value) => {
                        if (!this.plugin.settings.journalSettings) {
                            this.plugin.settings.journalSettings = JSON.parse(JSON.stringify(DEFAULT_JOURNAL_SETTINGS));
                        }
                        this.plugin.settings.journalSettings.journalFolder = value;
                        await this.plugin.saveSettings();
                    }));
        } else {
            new Setting(containerEl)
                .setName('Journal Tag')
                .setDesc('Tag to identify journal entries')
                .addText(text => text
                    .setPlaceholder('#journal')
                    .setValue(this.plugin.settings.journalSettings?.journalTag || '#journal')
                    .onChange(async (value) => {
                        if (!this.plugin.settings.journalSettings) {
                            this.plugin.settings.journalSettings = JSON.parse(JSON.stringify(DEFAULT_JOURNAL_SETTINGS));
                        }
                        this.plugin.settings.journalSettings.journalTag = value;
                        await this.plugin.saveSettings();
                    }));
        }

        // Info about Journal Intelligence
        const journalInfoEl = containerEl.createDiv({ cls: 'rpg-settings-info' });
        journalInfoEl.innerHTML = `
            <p><strong>How Journal Intelligence Works:</strong></p>
            <ul>
                <li>Scans journal entries for keywords related to life domains</li>
                <li>Analyzes sentiment (positive/negative) to adjust HP and XP</li>
                <li>Longer entries earn Gold (1g per 100 words)</li>
                <li>With AI enabled, provides deeper analysis and personalized suggestions</li>
            </ul>
        `;

        // Embedding & Semantic Search Section
        containerEl.createEl('h3', { text: '🔍 Semantic Search & Elder Memory' });

        new Setting(containerEl)
            .setName('Enable Embeddings')
            .setDesc('Create embeddings for journal entries to enable semantic search and Elder memory.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.ai?.embeddingEnabled ?? true)
                .onChange(async (value) => {
                    if (!this.plugin.settings.ai) {
                        this.plugin.settings.ai = JSON.parse(JSON.stringify(DEFAULT_AI_SETTINGS));
                    }
                    this.plugin.settings.ai.embeddingEnabled = value;
                    await this.plugin.saveSettings();
                }));

        // Embedding Provider Selection (only providers that support embeddings)
        const embeddingProviders = Object.entries(AI_PROVIDERS)
            .filter(([id, config]) => config.supportsEmbeddings);

        const currentEmbeddingProvider = this.plugin.settings.ai?.embeddingProvider ||
                                         this.plugin.settings.ai?.provider || 'openrouter';

        new Setting(containerEl)
            .setName('Embedding Provider')
            .setDesc('Choose which provider to use for embeddings (can be different from chat).')
            .addDropdown(dd => {
                embeddingProviders.forEach(([id, config]) => {
                    dd.addOption(id, config.name);
                });
                dd.setValue(currentEmbeddingProvider);
                dd.onChange(async (value) => {
                    if (!this.plugin.settings.ai) {
                        this.plugin.settings.ai = JSON.parse(JSON.stringify(DEFAULT_AI_SETTINGS));
                    }
                    this.plugin.settings.ai.embeddingProvider = value;
                    await this.plugin.saveSettings();
                    this.display(); // Refresh to show provider-specific models
                });
            });

        // Embedding Model Selection for current embedding provider
        const embeddingModels = getEmbeddingModels(currentEmbeddingProvider);
        if (embeddingModels.length > 0) {
            new Setting(containerEl)
                .setName('Embedding Model')
                .setDesc(`Choose which ${AI_PROVIDERS[currentEmbeddingProvider].name} model to use for embeddings.`)
                .addDropdown(dd => {
                    embeddingModels.forEach(model => {
                        dd.addOption(model.id, `${model.name} (${model.dimensions}d)`);
                    });
                    const currentModel = this.plugin.settings.ai?.selectedEmbeddingModels?.[currentEmbeddingProvider] ||
                                        embeddingModels[0].id;
                    dd.setValue(currentModel);
                    dd.onChange(async (value) => {
                        if (!this.plugin.settings.ai) {
                            this.plugin.settings.ai = JSON.parse(JSON.stringify(DEFAULT_AI_SETTINGS));
                        }
                        if (!this.plugin.settings.ai.selectedEmbeddingModels) {
                            this.plugin.settings.ai.selectedEmbeddingModels = {};
                        }
                        this.plugin.settings.ai.selectedEmbeddingModels[currentEmbeddingProvider] = value;
                        await this.plugin.saveSettings();
                    });
                });
        } else {
            const noEmbedMsg = containerEl.createDiv({ cls: 'rpg-settings-warning' });
            noEmbedMsg.textContent = `⚠️ ${AI_PROVIDERS[currentEmbeddingProvider]?.name || 'This provider'} does not support embeddings. Please choose a different embedding provider.`;
        }

        // Check if embedding provider has API key configured
        const embeddingApiKey = this.plugin.settings.ai?.apiKeys?.[currentEmbeddingProvider] ||
                               (currentEmbeddingProvider === 'openrouter' ? this.plugin.settings.ai?.openRouterApiKey : '');
        if (!embeddingApiKey && embeddingModels.length > 0) {
            const warningEl = containerEl.createDiv({ cls: 'rpg-settings-warning' });
            warningEl.textContent = `⚠️ No API key configured for ${AI_PROVIDERS[currentEmbeddingProvider].name}. Please add your API key above.`;
        }

        new Setting(containerEl)
            .setName('Elder Memory')
            .setDesc('Allow the Elder to recall relevant past journal entries when chatting.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.ai?.elderMemoryEnabled ?? true)
                .onChange(async (value) => {
                    if (!this.plugin.settings.ai) {
                        this.plugin.settings.ai = JSON.parse(JSON.stringify(DEFAULT_AI_SETTINGS));
                    }
                    this.plugin.settings.ai.elderMemoryEnabled = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Memory Count')
            .setDesc('Number of relevant past entries to include in Elder conversations (1-5)')
            .addSlider(slider => slider
                .setLimits(1, 5, 1)
                .setValue(this.plugin.settings.ai?.elderMemoryCount || 3)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    if (!this.plugin.settings.ai) {
                        this.plugin.settings.ai = JSON.parse(JSON.stringify(DEFAULT_AI_SETTINGS));
                    }
                    this.plugin.settings.ai.elderMemoryCount = value;
                    await this.plugin.saveSettings();
                }));

        // Embedding stats
        const embeddingsCount = this.plugin.settings.journalSettings?.embeddings?.length || 0;
        const embeddingInfoEl = containerEl.createDiv({ cls: 'rpg-settings-info' });
        embeddingInfoEl.innerHTML = `
            <p><strong>Embedding Statistics:</strong></p>
            <ul>
                <li>Journal entries indexed: ${embeddingsCount}</li>
                <li>Embedding provider: ${AI_PROVIDERS[currentEmbeddingProvider]?.name || currentEmbeddingProvider}</li>
                <li>Semantic search: ${embeddingsCount > 0 ? '✅ Available' : '❌ Sync journals first'}</li>
                <li>Elder memory: ${this.plugin.settings.ai?.elderMemoryEnabled && embeddingsCount > 0 ? '✅ Active' : '❌ Needs embeddings'}</li>
            </ul>
        `;

        // Clear embeddings button
        if (embeddingsCount > 0) {
            new Setting(containerEl)
                .setName('Clear Embeddings')
                .setDesc('Remove all stored embeddings. You will need to sync journals again to recreate them.')
                .addButton(btn => btn
                    .setButtonText('Clear All Embeddings')
                    .setWarning()
                    .onClick(async () => {
                        if (!this.plugin.settings.journalSettings) {
                            this.plugin.settings.journalSettings = JSON.parse(JSON.stringify(DEFAULT_JOURNAL_SETTINGS));
                        }
                        this.plugin.settings.journalSettings.embeddings = [];
                        await this.plugin.saveSettings();
                        new Notice('🗑️ All embeddings cleared');
                        this.display();
                    }));
        }

        // Game Actions Section
        containerEl.createEl('h3', { text: '🎮 Game Actions' });

        new Setting(containerEl)
            .setName('Heal HP')
            .setDesc('Manually restore health points')
            .addButton(btn => btn
                .setButtonText('Heal 10 HP')
                .onClick(async () => {
                    this.plugin.heal(10);
                    new Notice('💚 Healed 10 HP!');
                }))
            .addButton(btn => btn
                .setButtonText('Full Heal')
                .onClick(async () => {
                    this.plugin.settings.hp = this.plugin.settings.maxHp;
                    await this.plugin.saveSettings();
                    new Notice('💚 Fully healed!');
                }));

        new Setting(containerEl)
            .setName('Take Damage')
            .setDesc('Manually reduce health points (for testing)')
            .addButton(btn => btn
                .setButtonText('Take 10 Damage')
                .onClick(async () => {
                    this.plugin.takeDamage(10);
                    new Notice('💔 Took 10 damage!');
                }));

        new Setting(containerEl)
            .setName('Add Gold')
            .setDesc('Manually add gold (for testing)')
            .addButton(btn => btn
                .setButtonText('+50 Gold')
                .onClick(async () => {
                    this.plugin.settings.gold += 50;
                    await this.plugin.saveSettings();
                    new Notice('🪙 Added 50 gold!');
                }));

        // Toggl Track — campana AM
        containerEl.createEl('h3', { text: '🔔 Toggl Track (campana AM)' });

        new Setting(containerEl)
            .setName('Habit timer chain')
            .setDesc('Al completar un hábito AM: stop timer actual + start del siguiente (API Track).')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.habitTimerChainEnabled !== false)
                .onChange(async (value) => {
                    this.plugin.settings.habitTimerChainEnabled = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Toggl API token')
            .setDesc('Profile → Profile settings → API token. Se guarda solo en data.json local.')
            .addText(text => text
                .setPlaceholder('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
                .setValue(this.plugin.settings.togglApiToken || '')
                .onChange(async (value) => {
                    this.plugin.settings.togglApiToken = value.trim();
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Toggl workspace ID')
            .setDesc('Workspace id (wid). Default 5221214.')
            .addText(text => text
                .setPlaceholder(DEFAULT_TOGGL_WORKSPACE_ID)
                .setValue(String(this.plugin.settings.togglWorkspaceId || DEFAULT_TOGGL_WORKSPACE_ID))
                .onChange(async (value) => {
                    this.plugin.settings.togglWorkspaceId = value.trim() || DEFAULT_TOGGL_WORKSPACE_ID;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Test Toggl auth')
            .setDesc('GET /api/v9/me — verifica token + workspace.')
            .addButton(btn => btn
                .setButtonText('Ping Toggl')
                .onClick(async () => {
                    try {
                        const me = await this.plugin.togglRequest('GET', '/api/v9/me');
                        new Notice(`Toggl OK: ${me?.fullname || me?.email || 'authed'}`);
                    } catch (e) {
                        new Notice(`Toggl fail: ${e.message}`);
                    }
                }));

        // Danger Zone
        containerEl.createEl('h3', { text: '⚠️ Danger Zone' });

        new Setting(containerEl)
            .setName('Clear Chat History')
            .setDesc('Delete all AI conversation history')
            .addButton(btn => btn
                .setButtonText('Clear Chat')
                .setWarning()
                .onClick(async () => {
                    if (confirm('Clear all AI chat history?')) {
                        if (this.plugin.settings.ai) {
                            this.plugin.settings.ai.chatHistory = [];
                        }
                        await this.plugin.saveSettings();
                        new Notice('🗑️ Chat history cleared!');
                    }
                }));

        new Setting(containerEl)
            .setName('Reset All Data')
            .setDesc('⚠️ This will delete ALL progress including character, habits, quests, and achievements!')
            .addButton(btn => btn
                .setButtonText('Reset Everything')
                .setWarning()
                .onClick(async () => {
                    if (confirm('⚠️ Are you SURE? This will reset ALL your progress and cannot be undone!')) {
                        await this.plugin.resetAllData();
                        new Notice('🔄 All data has been reset!');
                        this.display(); // Refresh settings view
                    }
                }));
    }
}

// ============================================================================
// MAIN PLUGIN CLASS
// ============================================================================

module.exports = class LifeRPG extends Plugin {
    async onload() {
        console.log('Loading Life RPG Plugin v3.0 - AI Coach Edition');
        await this.loadSettings();
        const initializedNativeHabits = this.initializeNativeHabitSpells();
        const tomesCatalogChanged = this.ensureTomesCatalog();
        const flowersCatalogChanged = this.ensureFlowersCatalog();
        this.skillTreeService = new SkillTreeService(this);
        const skillTreeCleaned = this.skillTreeService.cleanLegacySeed();
        this.checkDailyReset();
        this.habitSkillSyncService = new HabitSkillSyncService(this);

        this.registerView(VIEW_TYPE_HERO, (leaf) => new HeroView(leaf, this));
        this.addRibbonIcon('swords', 'Open Hero Sheet', () => this.activateView());
        this.addCommand({ id: 'open-hero-sheet', name: 'Open Hero Sheet', callback: () => this.activateView() });
        this.addCommand({ id: 'link-hito-to-vow', name: 'Vincular hito del diario a un vow', callback: () => {
            new LinkHitoToVowModal(this.app, this).open();
        }});
        this.addCommand({ id: 'sync-habit-skills', name: 'Sync Habit Checklists to Skills', callback: () => this.syncHabitSkills(true) });
        this.addCommand({ id: 'create-character', name: 'Create/Retake Character Assessment', callback: () => {
            new CharacterCreationModal(this.app, this, () => this.refreshViews()).open();
        }});
        this.addCommand({ id: 'ai-generate-quests', name: 'AI: Generate Quests', callback: () => {
            if (!this.settings.ai?.openRouterApiKey) {
                new Notice('⚠️ Configure OpenRouter API key in Settings → Life RPG');
                return;
            }
            new AIQuestGeneratorModal(this.app, this, () => this.refreshViews()).open();
        }});
        this.addCommand({ id: 'import-sommelier-bank', name: 'Importar banco Sommelier', callback: async () => {
            const result = this.skillTreeService.importSommelierBank();
            if (!result.ok) {
                new Notice(`❌ ${result.error}`);
                return;
            }
            if (result.alreadyImported) {
                new Notice(`Banco Sommelier ya importado (${result.total} quests).`);
                return;
            }
            await this.saveSettings();
            this.refreshViews();
            new Notice(`✅ ${result.created} quests Sommelier importadas y vinculadas a Phobos Aliénos.`);
        }});
        this.addCommand({ id: 'import-benevolencia-bank', name: 'Importar banco Benevolencia', callback: async () => {
            const result = this.skillTreeService.importBenevolenciaBank();
            if (!result.ok) {
                new Notice(`❌ ${result.error}`);
                return;
            }
            if (result.alreadyImported) {
                new Notice(`Banco Benevolencia ya importado (${result.total} quests).`);
                return;
            }
            await this.saveSettings();
            this.refreshViews();
            new Notice(`✅ ${result.created} quests Benevolencia importadas y vinculadas a Kryos.`);
        }});
        this.addCommand({ id: 'import-empatia-bank', name: 'Importar banco Empatía', callback: async () => {
            const result = this.skillTreeService.importEmpatiaBank();
            if (!result.ok) {
                new Notice(`❌ ${result.error}`);
                return;
            }
            if (result.alreadyImported) {
                new Notice(`Banco Empatía ya importado (${result.total} quests).`);
                return;
            }
            await this.saveSettings();
            this.refreshViews();
            new Notice(`✅ ${result.created} quests Empatía importadas y vinculadas a Kryos + Phobos.`);
        }});

        // Add settings tab
        this.addSettingTab(new LifeRPGSettingTab(this.app, this));

        this.statusBarItem = this.addStatusBarItem();
        this.updateStatusBar();
        if (initializedNativeHabits || skillTreeCleaned || tomesCatalogChanged || flowersCatalogChanged) {
            await this.saveSettings();
        }

        this.registerEvent(this.app.workspace.on('editor-change', (editor, info) => this.handleQuestCompletion(editor)));
    }

    async onunload() {
        this.app.workspace.detachLeavesOfType(VIEW_TYPE_HERO);
    }

    async loadSettings() {
        const saved = await this.loadData() || {};

        const skillsSettings = {
            ...JSON.parse(JSON.stringify(DEFAULT_SKILLS_SETTINGS)),
            ...(saved.skillsSettings || {}),
            skills: saved.skillsSettings?.skills || []
        };

        const habitSkillSync = {
            ...JSON.parse(JSON.stringify(DEFAULT_HABIT_SKILL_SYNC)),
            ...(saved.habitSkillSync || {}),
            processedTasks: saved.habitSkillSync?.processedTasks || {},
            mappings: {
                ...DEFAULT_HABIT_SKILL_SYNC.mappings,
                ...(saved.habitSkillSync?.mappings || {})
            },
            skillCategories: {
                ...DEFAULT_HABIT_SKILL_SYNC.skillCategories,
                ...(saved.habitSkillSync?.skillCategories || {})
            }
        };

        const skillTree = {
            ...JSON.parse(JSON.stringify(DEFAULT_SKILL_TREE)),
            ...(saved.skillTree || {}),
            schools: saved.skillTree?.schools || DEFAULT_SKILL_TREE.schools,
            nodes: saved.skillTree?.nodes || [],
            seedCleaned: saved.skillTree?.seedCleaned || false
        };

        // Migrate from old skills to domains
        let domains;
        if (saved.domains) {
            domains = saved.domains;
        } else if (saved.skills) {
            const skillToDomain = {
                'health': 'health',
                'work': 'livingStandards',
                'creativity': 'culturalResilience',
                'social': 'communityVitality',
                'learning': 'education'
            };
            domains = DEFAULT_DOMAINS.map(d => {
                const oldSkill = saved.skills.find(s => skillToDomain[s.id] === d.id);
                return oldSkill ? { ...d, level: oldSkill.level, xp: oldSkill.xp } : d;
            });
        } else {
            domains = JSON.parse(JSON.stringify(DEFAULT_DOMAINS));
        }

        // Migrate habits
        const migratedHabits = (saved.habits || []).map((h, i) => {
            const skillToDomain = {
                'health': 'health',
                'work': 'livingStandards',
                'creativity': 'culturalResilience',
                'social': 'communityVitality',
                'learning': 'education'
            };
            return {
                ...h,
                id: h.id || `habit_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 6)}`,
                domain: h.domain || skillToDomain[h.skill] || 'health',
                difficulty: h.difficulty || 'medium',
                linkedSkillIds: h.linkedSkillIds || [],
                linkedBossIds: Array.isArray(h.linkedBossIds) ? h.linkedBossIds : [],
                bossDamage: h.bossDamage != null ? Number(h.bossDamage) : 10,
                skillXp: h.skillXp || 10,
                streak: h.streak || 0,
                bestStreak: h.bestStreak || 0,
                lastCompletedDate: h.lastCompletedDate || null
            };
        });

        // Migrate quests
        const migratedQuests = (saved.quests || []).map(q => {
            const skillToDomain = {
                'health': 'health',
                'work': 'livingStandards',
                'creativity': 'culturalResilience',
                'social': 'communityVitality',
                'learning': 'education'
            };
            return {
                ...q,
                domain: q.domain || skillToDomain[q.skill] || 'education',
                id: q.id || `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                linkedBossIds: Array.isArray(q.linkedBossIds) ? q.linkedBossIds : [],
                bossDamage: q.bossDamage || 10
            };
        });

        // Merge achievements
        const mergedAchievements = DEFAULT_ACHIEVEMENTS.map(defaultAch => {
            const savedAch = (saved.achievements || []).find(a => a.id === defaultAch.id);
            return savedAch ? { ...defaultAch, unlocked: savedAch.unlocked } : defaultAch;
        });

        const migratedBossFights = (saved.bossFights || []).map(boss => ({
            ...boss,
            tier: boss.tier || 'standard',
            imagePath: boss.imagePath || '',
            icon: boss.icon || '🐉',
            tomeId: boss.tomeId || null,
            flowerId: boss.flowerId || null
        }));

        const migratedTomes = Array.isArray(saved.tomes)
            ? saved.tomes.map(tome => ({
                id: tome.id,
                name: tome.name || tome.id,
                flatPath: tome.flatPath || '',
                description: tome.description || '',
                bossId: tome.bossId || null,
                unlocked: !!tome.unlocked,
                unlockedAt: tome.unlockedAt || null,
                damageReport: tome.damageReport || null
            }))
            : [];

        const migratedFlowers = Array.isArray(saved.flowers)
            ? saved.flowers.map(flower => ({
                id: flower.id,
                name: flower.name || flower.id,
                flatPath: flower.flatPath || '',
                description: flower.description || '',
                bossId: flower.bossId || null,
                unlocked: !!flower.unlocked,
                unlockedAt: flower.unlockedAt || null,
                damageReport: flower.damageReport || null
            }))
            : [];

        let migratedVows;
        if (!Array.isArray(saved.vows)) {
            migratedVows = JSON.parse(JSON.stringify(DEFAULT_SEED_VOWS));
        } else {
            const vowService = new VowService(this);
            migratedVows = saved.vows.map(raw => vowService.normalizeVow(raw));
            const hasAutocompasion = migratedVows.some(v => String(v.id) === 'autocompasion');
            if (!hasAutocompasion) {
                migratedVows.unshift(JSON.parse(JSON.stringify(DEFAULT_SEED_VOWS[0])));
            }
        }

        const characterProfile = saved.characterProfile
            ? {
                ...saved.characterProfile,
                imagePath: saved.characterProfile.imagePath || ''
            }
            : null;

        this.settings = {
            level: saved.level || 1,
            xp: saved.xp || 0,
            hp: saved.hp || 100,
            maxHp: saved.maxHp || 100,
            gold: saved.gold || 0,
            totalGoldEarned: saved.totalGoldEarned || 0,
            totalHabitsCompleted: saved.totalHabitsCompleted || 0,
            totalQuestsCompleted: saved.totalQuestsCompleted || 0,
            lastPlayedDate: saved.lastPlayedDate || new Date().toDateString(),
            domains: domains,
            habits: migratedHabits,
            badHabits: saved.badHabits || [],
            quests: migratedQuests,
            rewards: saved.rewards || [],
            achievements: mergedAchievements,
            characterProfile: characterProfile,
            ai: saved.ai || { ...DEFAULT_AI_SETTINGS },
            aiQuestsGenerated: saved.aiQuestsGenerated || 0,
            // HUMAN 3.0 Framework
            currentPhase: saved.currentPhase || 'dissonance',
            psychicEntropy: saved.psychicEntropy || 0,
            lastWisdomDate: saved.lastWisdomDate || null,
            dailyWisdom: saved.dailyWisdom || null,
            // Activity Log & NPC System
            activityLog: saved.activityLog || [],
            activityLogArchives: saved.activityLogArchives || {},
            dismissedNativeHabits: Array.isArray(saved.dismissedNativeHabits) ? saved.dismissedNativeHabits : [],
            npcs: saved.npcs || JSON.parse(JSON.stringify(DEFAULT_NPCS)),
            lastPenaltyCheck: saved.lastPenaltyCheck || null,
            penaltyEnabled: saved.penaltyEnabled !== undefined ? saved.penaltyEnabled : true,
            // Boss Fight System
            bossFights: migratedBossFights,
            totalBossesDefeated: saved.totalBossesDefeated || 0,
            // Knowledge Tomes & Flowers
            tomes: migratedTomes,
            flowers: migratedFlowers,
            vows: migratedVows,
            // Dungeon System (Focus Sessions)
            activeDungeon: saved.activeDungeon || null,
            totalDungeonsCleared: saved.totalDungeonsCleared || 0,
            totalFocusMinutes: saved.totalFocusMinutes || 0,
            // Energy Station
            energy: saved.energy || 100,
            maxEnergy: saved.maxEnergy || 100,
            moodLog: saved.moodLog || [],
            lastMoodCheck: saved.lastMoodCheck || null,
            sleepLog: saved.sleepLog || [],
            // Difficulty
            gameDifficulty: saved.gameDifficulty || 'normal',
            // Daily Summary
            dailyStats: saved.dailyStats || {},
            // Journal Intelligence
            journalSettings: saved.journalSettings || JSON.parse(JSON.stringify(DEFAULT_JOURNAL_SETTINGS)),
            // Skills
            skillsSettings: skillsSettings,
            habitSkillSync: habitSkillSync,
            // Skill Tree
            skillTree: skillTree,
            // Toggl AM campana (API Track)
            habitTimerChainEnabled: saved.habitTimerChainEnabled !== undefined
                ? saved.habitTimerChainEnabled
                : true,
            togglApiToken: saved.togglApiToken || '',
            togglWorkspaceId: saved.togglWorkspaceId || DEFAULT_TOGGL_WORKSPACE_ID,
            habitTimerChain: {
                ...JSON.parse(JSON.stringify(DEFAULT_HABIT_TIMER_CHAIN)),
                ...(saved.habitTimerChain || {})
            }
        };

        if (!Array.isArray(saved.vows) || !saved.vows.some(v => String(v.id) === 'autocompasion')) {
            await this.saveSettings();
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.updateStatusBar();
    }

    async resetAllData() {
        this.settings = {
            level: 1, xp: 0, hp: 100, maxHp: 100, gold: 0,
            totalGoldEarned: 0, totalHabitsCompleted: 0, totalQuestsCompleted: 0,
            lastPlayedDate: new Date().toDateString(),
            domains: JSON.parse(JSON.stringify(DEFAULT_DOMAINS)),
            habits: [], badHabits: [], quests: [], rewards: [],
            achievements: JSON.parse(JSON.stringify(DEFAULT_ACHIEVEMENTS)),
            characterProfile: null,
            ai: { ...DEFAULT_AI_SETTINGS },
            aiQuestsGenerated: 0,
            // HUMAN 3.0 Framework
            currentPhase: 'dissonance',
            psychicEntropy: 0,
            lastWisdomDate: null,
            dailyWisdom: null,
            // Activity Log & NPC System
            activityLog: [],
            activityLogArchives: {},
            dismissedNativeHabits: [],
            npcs: JSON.parse(JSON.stringify(DEFAULT_NPCS)),
            lastPenaltyCheck: null,
            penaltyEnabled: true,
            // Boss Fight System
            bossFights: [],
            totalBossesDefeated: 0,
            // Knowledge Tomes & Flowers
            tomes: [],
            flowers: [],
            vows: JSON.parse(JSON.stringify(DEFAULT_SEED_VOWS)),
            // Dungeon System
            activeDungeon: null,
            totalDungeonsCleared: 0,
            totalFocusMinutes: 0,
            // Energy Station
            energy: 100,
            maxEnergy: 100,
            moodLog: [],
            lastMoodCheck: null,
            sleepLog: [],
            // Difficulty & Daily
            gameDifficulty: 'normal',
            dailyStats: {},
            // Journal Intelligence
            journalSettings: JSON.parse(JSON.stringify(DEFAULT_JOURNAL_SETTINGS)),
            // Skills
            skillsSettings: JSON.parse(JSON.stringify(DEFAULT_SKILLS_SETTINGS)),
            habitSkillSync: JSON.parse(JSON.stringify(DEFAULT_HABIT_SKILL_SYNC)),
            // Skill Tree
            skillTree: JSON.parse(JSON.stringify(DEFAULT_SKILL_TREE)),
            // Toggl AM campana
            habitTimerChainEnabled: true,
            togglApiToken: '',
            togglWorkspaceId: DEFAULT_TOGGL_WORKSPACE_ID,
            habitTimerChain: JSON.parse(JSON.stringify(DEFAULT_HABIT_TIMER_CHAIN))
        };
        await this.saveSettings();
        new Notice("🔄 All data has been reset!");
    }

    checkDailyReset() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (this.settings.lastPlayedDate !== today) {
            console.log("Life RPG: New Day Detected!");

            this.settings.habits.forEach(h => {
                if (h.completed && h.lastCompletedDate === yesterday) {
                    h.streak = (h.streak || 0) + 1;
                    h.bestStreak = Math.max(h.bestStreak || 0, h.streak);
                } else if (!h.completed) {
                    h.streak = 0;
                }
                h.completed = false;
            });

            // Increase entropy for incomplete tasks (HUMAN 3.0)
            const incompleteTasks = this.settings.quests.filter(q => !q.completed).length;
            if (incompleteTasks > 0) {
                this.settings.psychicEntropy = Math.min(100, (this.settings.psychicEntropy || 0) + incompleteTasks * 2);
            }

            this.settings.lastPlayedDate = today;
            this.maybeArchivePreviousMonths();
            this.saveSettings();
            this.checkAchievements();
            this.checkWeeklyPenalty(); // Check for debt penalty
            new Notice("☀️ New day! Habits reset. Keep your streaks going!");
        } else {
            // Still roll up completed months if plugin stayed open across month boundary
            if (this.maybeArchivePreviousMonths()) {
                this.saveSettings();
            }
        }
    }

    getMonthKey(dateInput = new Date()) {
        const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (Number.isNaN(d.getTime())) return null;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    summarizeActivityEvents(events) {
        const habitMap = {};
        const questMap = {};

        const bump = (map, name, details = {}) => {
            if (!map[name]) {
                map[name] = { name, completions: 0, bossDamageByBossId: {} };
            }
            map[name].completions += 1;
            const bossIds = Array.isArray(details.linkedBossIds) ? details.linkedBossIds : [];
            const damage = Number(details.bossDamage) || 0;
            if (damage > 0) {
                bossIds.forEach(bossId => {
                    map[name].bossDamageByBossId[bossId] = (map[name].bossDamageByBossId[bossId] || 0) + damage;
                });
            }
        };

        events.forEach(ev => {
            if (ev.category === 'habit_complete') bump(habitMap, ev.description, ev.details || {});
            else if (ev.category === 'quest_complete') bump(questMap, ev.description, ev.details || {});
        });

        return {
            habitSummaries: Object.values(habitMap),
            questSummaries: Object.values(questMap)
        };
    }

    mergeArchiveSummaries(existing = [], incoming = []) {
        const map = {};
        [...existing, ...incoming].forEach(item => {
            if (!item?.name) return;
            if (!map[item.name]) {
                map[item.name] = {
                    name: item.name,
                    completions: 0,
                    bossDamageByBossId: {}
                };
            }
            map[item.name].completions += Number(item.completions) || 0;
            Object.entries(item.bossDamageByBossId || {}).forEach(([bossId, dmg]) => {
                map[item.name].bossDamageByBossId[bossId] =
                    (map[item.name].bossDamageByBossId[bossId] || 0) + (Number(dmg) || 0);
            });
        });
        return Object.values(map);
    }

    archiveMonth(monthKey, { showNotice = false } = {}) {
        const s = this.settings;
        if (!monthKey) {
            if (showNotice) new Notice('Mes inválido para archivar.');
            return false;
        }

        if (!s.activityLogArchives) s.activityLogArchives = {};

        const remaining = [];
        const toArchive = [];
        (s.activityLog || []).forEach(ev => {
            const key = this.getMonthKey(ev.timestamp);
            if (key === monthKey) toArchive.push(ev);
            else remaining.push(ev);
        });

        if (toArchive.length === 0) {
            if (showNotice) new Notice(`No hay eventos del mes ${monthKey} en el log vivo.`);
            return false;
        }

        const summary = this.summarizeActivityEvents(toArchive);
        const prev = s.activityLogArchives[monthKey];
        s.activityLogArchives[monthKey] = {
            month: monthKey,
            archivedAt: new Date().toISOString(),
            habitSummaries: this.mergeArchiveSummaries(prev?.habitSummaries, summary.habitSummaries),
            questSummaries: this.mergeArchiveSummaries(prev?.questSummaries, summary.questSummaries),
            rawEventsArchived: (prev?.rawEventsArchived || 0) + toArchive.length
        };
        s.activityLog = remaining;

        if (showNotice) {
            new Notice(`📦 Mes ${monthKey} archivado (${toArchive.length} eventos).`);
        }
        return true;
    }

    maybeArchivePreviousMonths() {
        const currentMonth = this.getMonthKey(new Date());
        const months = new Set();
        (this.settings.activityLog || []).forEach(ev => {
            const key = this.getMonthKey(ev.timestamp);
            if (key && key < currentMonth) months.add(key);
        });

        let changed = false;
        [...months].sort().forEach(monthKey => {
            if (this.archiveMonth(monthKey)) changed = true;
        });
        return changed;
    }

    async handleQuestCompletion(editor) {
        const lineCount = editor.lineCount();
        let changesMade = false;

        for (let i = 0; i < lineCount; i++) {
            const line = editor.getLine(i);
            const questRegex = /^\s*-\s*\[x\]\s*(.*?)#quest(?!\S)/;
            const match = line.match(questRegex);

            if (match) {
                this.gainXp(20, 10, 'education');
                const newLine = line.replace("#quest", "#quest-done");
                editor.setLine(i, newLine);
                changesMade = true;
            }
        }

        if (changesMade) this.refreshViews();
    }

    queueHabitSkillSync(file) {
        clearTimeout(this.habitSkillSyncTimer);
        this.habitSkillSyncTimer = setTimeout(() => {
            this.syncHabitSkills(false, file);
        }, 750);
    }

    async syncHabitSkills(showNotice = false, file = null) {
        if (!this.habitSkillSyncService) {
            this.habitSkillSyncService = new HabitSkillSyncService(this);
        }

        try {
            return file
                ? await this.habitSkillSyncService.syncFile(file, showNotice)
                : await this.habitSkillSyncService.syncAll(showNotice);
        } catch (error) {
            console.error('Habit skill sync failed:', error);
            if (showNotice) {
                new Notice(`Habit skill sync failed: ${error.message}`);
            }
            return { awarded: [], skipped: 0, error };
        }
    }

    initializeNativeHabitSpells() {
        const s = this.settings;
        let changed = false;

        if (!s.skillsSettings) {
            s.skillsSettings = JSON.parse(JSON.stringify(DEFAULT_SKILLS_SETTINGS));
            changed = true;
        }
        if (!Array.isArray(s.skillsSettings.skills)) {
            s.skillsSettings.skills = [];
            changed = true;
        }
        if (!Array.isArray(s.habits)) {
            s.habits = [];
            changed = true;
        }
        if (!Array.isArray(s.dismissedNativeHabits)) {
            s.dismissedNativeHabits = [];
            changed = true;
        }

        const skillService = new SkillService(this);

        s.skillsSettings.skills.forEach(skill => {
            if (this.applySpellMetadata(skill)) {
                changed = true;
            }
        });

        DEFAULT_NATIVE_HABITS.forEach(template => {
            const normalizedName = this.normalizeName(template.name);
            if (s.dismissedNativeHabits.includes(normalizedName)) {
                return;
            }

            const linkedSkillIds = template.skillNames
                .map(skillName => this.getOrCreateSpellSkill(skillService, skillName))
                .filter(Boolean)
                .map(skill => skill.id);

            const existingHabit = s.habits.find(h => this.normalizeName(h.name) === normalizedName);
            if (existingHabit) {
                if (!existingHabit.id) {
                    existingHabit.id = `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    changed = true;
                }
                if (!Array.isArray(existingHabit.linkedSkillIds) || existingHabit.linkedSkillIds.length === 0) {
                    existingHabit.linkedSkillIds = linkedSkillIds;
                    changed = true;
                }
                if (!Array.isArray(existingHabit.linkedBossIds)) {
                    existingHabit.linkedBossIds = [];
                    changed = true;
                }
                if (existingHabit.bossDamage == null) {
                    existingHabit.bossDamage = 10;
                    changed = true;
                }
                if (!existingHabit.skillXp) {
                    existingHabit.skillXp = template.skillXp || 10;
                    changed = true;
                }
                if (!existingHabit.domain) {
                    existingHabit.domain = template.domain;
                    changed = true;
                }
                if (!existingHabit.difficulty) {
                    existingHabit.difficulty = template.difficulty || 'medium';
                    changed = true;
                }
                return;
            }

            s.habits.push({
                id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: template.name,
                xp: template.xp || 10,
                gold: template.gold || 5,
                domain: template.domain || 'health',
                difficulty: template.difficulty || 'medium',
                linkedSkillIds,
                linkedBossIds: [],
                bossDamage: 10,
                skillXp: template.skillXp || 10,
                completed: false,
                streak: 0,
                bestStreak: 0,
                lastCompletedDate: null
            });
            changed = true;
        });

        s.skillsSettings.totalSkillsDiscovered = s.skillsSettings.skills.length;
        return changed;
    }

    dismissNativeHabitName(name) {
        const normalized = this.normalizeName(name);
        if (!normalized) return;
        if (!Array.isArray(this.settings.dismissedNativeHabits)) {
            this.settings.dismissedNativeHabits = [];
        }
        const isNative = DEFAULT_NATIVE_HABITS.some(
            t => this.normalizeName(t.name) === normalized
        );
        if (isNative && !this.settings.dismissedNativeHabits.includes(normalized)) {
            this.settings.dismissedNativeHabits.push(normalized);
        }
    }

    getOrCreateSpellSkill(skillService, skillName) {
        const existingSkill = skillService.getSkills().find(skill =>
            this.normalizeName(skill.name) === this.normalizeName(skillName)
        );

        if (existingSkill) {
            this.applySpellMetadata(existingSkill);
            return existingSkill;
        }

        const spellDefaults = DEFAULT_SPELL_LIBRARY[skillName] || {};
        const skill = skillService.createSkill(
            skillName,
            spellDefaults.category || 'mind',
            'native-habit',
            spellDefaults.description || ''
        );
        this.applySpellMetadata(skill);
        return skill;
    }

    applySpellMetadata(skill) {
        if (!skill) return false;
        const defaults = DEFAULT_SPELL_LIBRARY[skill.name] || {};
        let changed = false;

        const mergedDefaults = {
            ...JSON.parse(JSON.stringify(DEFAULT_SKILL)),
            ...JSON.parse(JSON.stringify(defaults))
        };

        ['kind', 'spellSchool', 'effects', 'statesApplied', 'synergyTags', 'spellPowerBonus'].forEach(key => {
            const value = mergedDefaults[key];
            const isMissingArray = Array.isArray(value) && (!Array.isArray(skill[key]) || skill[key].length === 0);
            const isMissingValue = !Array.isArray(value) && (skill[key] === undefined || skill[key] === null || skill[key] === '');
            if (isMissingArray || isMissingValue) {
                skill[key] = Array.isArray(value) ? [...value] : value;
                changed = true;
            }
        });

        if ((!skill.description || skill.description.trim() === '') && defaults.description) {
            skill.description = defaults.description;
            changed = true;
        }
        if (defaults.category && skill.category !== defaults.category) {
            skill.category = defaults.category;
            changed = true;
        }

        return changed;
    }

    normalizeName(value) {
        return String(value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    // --- GAME LOGIC ---

    gainXp(xpAmount, goldAmount, domainId = null) {
        const s = this.settings;

        // Apply phase XP multiplier (HUMAN 3.0)
        const currentPhase = determinePhase(s);
        const adjustedXP = calculateXPWithPhase(xpAmount, currentPhase);
        const phaseInfo = PHASES[currentPhase];

        s.xp += adjustedXP;
        s.gold += goldAmount;
        s.totalGoldEarned += goldAmount;

        // Reduce psychic entropy when completing tasks
        reduceEntropy(s, 5);

        if (domainId) {
            const domain = s.domains.find(d => d.id === domainId);
            if (domain) {
                domain.xp += adjustedXP;
                const domainXpNeeded = domain.level * 50;
                if (domain.xp >= domainXpNeeded) {
                    domain.level++;
                    domain.xp = 0;
                    domain.score = Math.min(100, domain.score + 2);
                    new Notice(`📈 ${domain.icon} ${domain.name} leveled up to ${domain.level}!`);
                }

                // Damage bosses linked to this domain
                this.damageBossesForDomain(domainId, 10);
            }
        }

        const xpToNextLevel = s.level * 100;
        if (s.xp >= xpToNextLevel) {
            this.levelUp();
        } else {
            // Show XP with phase multiplier info
            const multiplierText = phaseInfo.xpMultiplier > 1 ? ` (×${phaseInfo.xpMultiplier} ${phaseInfo.name})` : '';
            new Notice(`+${adjustedXP} XP${multiplierText} | +${goldAmount} Gold`);
        }

        this.saveSettings();
        this.checkAchievements();
    }

    levelUp() {
        const s = this.settings;
        const oldLevel = s.level;
        s.level++;
        s.xp = 0;
        s.maxHp += 10;
        s.hp = s.maxHp;

        // Grant skill points on level up
        if (!s.skillsSettings) {
            s.skillsSettings = JSON.parse(JSON.stringify(DEFAULT_SKILLS_SETTINGS));
        }
        const skillPointsGained = s.skillsSettings.skillPointsPerLevel || 1;
        s.skillsSettings.availableSkillPoints = (s.skillsSettings.availableSkillPoints || 0) + skillPointsGained;

        // Check for HUMAN tier advancement
        const oldDevLevel = getDevelopmentLevel(oldLevel);
        const newDevLevel = getDevelopmentLevel(s.level);

        // Log activity
        this.logActivity('level_up', `Reached Level ${s.level}!`, { newLevel: s.level, devLevel: newDevLevel, skillPointsGained });

        if (oldDevLevel !== newDevLevel) {
            // HUMAN tier advancement!
            const devInfo = DEVELOPMENT_LEVELS[newDevLevel];
            new Notice(`🌟 HUMAN ${newDevLevel} UNLOCKED! 🌟\n${devInfo.icon} ${devInfo.name} - ${devInfo.journey}\n+${skillPointsGained} Skill Point!`, 10000);
            this.logActivity('tier_up', `Advanced to HUMAN ${newDevLevel} - ${devInfo.name}!`, { tier: newDevLevel });
        } else {
            new Notice(`🎉 LEVEL UP! You are now Level ${s.level}!\n+${skillPointsGained} Skill Point`);
        }

        this.checkAchievements();
    }

    takeDamage(amount) {
        const s = this.settings;
        s.hp -= amount;
        if (s.hp <= 0) {
            s.hp = 0;
            new Notice(`💀 YOU FAINTED. Lost some XP.`);
            s.xp = Math.max(0, s.xp - 50);
            s.hp = Math.floor(s.maxHp / 2);
        } else {
            new Notice(`-${amount} HP`);
        }
        this.saveSettings();
    }

    heal(amount) {
        this.settings.hp = Math.min(this.settings.maxHp, this.settings.hp + amount);
        this.saveSettings();
    }

    async completeHabit(index) {
        const s = this.settings;
        const habit = s.habits[index];
        if (habit && !habit.completed) {
            habit.completed = true;
            habit.lastCompletedDate = new Date().toDateString();
            s.totalHabitsCompleted++;

            const diff = DIFFICULTY[habit.difficulty || 'medium'];
            const streakBonus = Math.min((habit.streak || 0) * 0.1, 1);
            const finalXp = Math.round(habit.xp * diff.multiplier * (1 + streakBonus));
            const finalGold = Math.round(habit.gold * diff.multiplier * (1 + streakBonus));

            // Log activity
            this.logActivity('habit_complete', habit.name, {
                xp: finalXp,
                gold: finalGold,
                streak: habit.streak || 0,
                linkedSkillIds: habit.linkedSkillIds || [],
                linkedBossIds: habit.linkedBossIds || [],
                bossDamage: habit.bossDamage || 10
            });

            const skillRewards = [];
            if (Array.isArray(habit.linkedSkillIds) && habit.linkedSkillIds.length > 0) {
                const skillService = new SkillService(this);
                const skillXp = habit.skillXp || 10;

                habit.linkedSkillIds.forEach(skillId => {
                    const result = skillService.addSkillXp(skillId, skillXp);
                    if (!result?.skill) return;

                    skillRewards.push({
                        name: result.skill.name,
                        xp: skillXp,
                        levelsGained: result.levelsGained || 0,
                        level: result.skill.level
                    });
                });
            }

            if (skillRewards.length > 0) {
                const rewardText = skillRewards.map(reward =>
                    `${reward.name} +${reward.xp} XP${reward.levelsGained > 0 ? ` (Lv. ${reward.level})` : ''}`
                ).join(', ');
                new Notice(`Spell XP: ${rewardText}`);
            }

            if (Array.isArray(habit.linkedBossIds) && habit.linkedBossIds.length > 0) {
                const damage = Number(habit.bossDamage) || 10;
                for (const bossId of habit.linkedBossIds) {
                    const bossIndex = (s.bossFights || []).findIndex(boss => boss.id === bossId && !boss.defeated);
                    if (bossIndex >= 0) {
                        await this.damageBoss(bossIndex, damage);
                    }
                }
            }

            this.gainXp(finalXp, finalGold, habit.domain);
            await this.chainTogglAfterHabit(habit);
        }
    }

    getTogglAuthHeader() {
        const token = (this.settings.togglApiToken || '').trim();
        if (!token) return null;
        return `Basic ${btoa(`${token}:api_token`)}`;
    }

    async togglRequest(method, path, body = null) {
        const auth = this.getTogglAuthHeader();
        if (!auth) throw new Error('Missing togglApiToken');
        const options = {
            url: `https://api.track.toggl.com${path}`,
            method,
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            }
        };
        if (body != null) {
            options.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

        let response;
        try {
            response = await requestUrl(options);
        } catch (e) {
            const status = e?.status || e?.statusCode || '';
            const detail = (e?.message || String(e)).slice(0, 180);
            throw new Error(`Toggl ${method} ${path} → ${status || 'error'}: ${detail}`);
        }

        if (response.status >= 400) {
            const detail = (response.text || '').slice(0, 180);
            throw new Error(
                `Toggl ${method} ${path} → ${response.status}${detail ? `: ${detail}` : ''}`
            );
        }
        return response.json;
    }

    async resolveTogglProjectId(projectName, workspaceId) {
        if (!projectName) return null;
        const projects = await this.togglRequest(
            'GET',
            `/api/v9/workspaces/${workspaceId}/projects`
        );
        const list = Array.isArray(projects) ? projects : [];
        const hit = list.find(p => (p.name || '').toLowerCase() === projectName.toLowerCase());
        return hit ? hit.id : null;
    }

    async stopCurrentTogglTimer(workspaceId) {
        let current = null;
        try {
            current = await this.togglRequest('GET', '/api/v9/me/time_entries/current');
        } catch (e) {
            return null;
        }
        if (!current || !current.id) return null;
        const wid = workspaceId || current.workspace_id;
        return await this.togglRequest(
            'PATCH',
            `/api/v9/workspaces/${wid}/time_entries/${current.id}/stop`
        );
    }

    async startTogglTimer({ workspaceId, projectId, description }) {
        const payload = {
            created_with: 'soulhy',
            description: description || '',
            duration: -1,
            start: new Date().toISOString(),
            workspace_id: Number(workspaceId),
            billable: false
        };
        if (projectId) payload.project_id = Number(projectId);
        return await this.togglRequest(
            'POST',
            `/api/v9/workspaces/${workspaceId}/time_entries`,
            payload
        );
    }

    async chainTogglAfterHabit(habit) {
        if (!this.settings.habitTimerChainEnabled) return;
        if (!this.settings.togglApiToken) return;

        const chain = {
            ...DEFAULT_HABIT_TIMER_CHAIN,
            ...(this.settings.habitTimerChain || {})
        };
        const step = chain[habit.name];
        if (!step) return;

        // Fin de cadena AM (ej. 15min Perply)
        if (!step.projectId && !step.projectName && !step.description && !step.nextHabitName) {
            try {
                const workspaceId = this.settings.togglWorkspaceId || DEFAULT_TOGGL_WORKSPACE_ID;
                await this.stopCurrentTogglTimer(workspaceId);
                new Notice('🔔 Cadena AM completa — plan 3 / deep work manual');
            } catch (e) {
                console.error('Toggl stop (end chain) failed', e);
                new Notice(`Toggl: no pude frenar timer (${e.message})`);
            }
            return;
        }

        const nextName = step.nextHabitName;
        if (nextName) {
            const nextHabit = (this.settings.habits || []).find(h => h.name === nextName);
            if (nextHabit?.completed) {
                new Notice(`🔔 ${nextName} ya estaba hecho — sin timer`);
                return;
            }
        }

        const workspaceId = this.settings.togglWorkspaceId || DEFAULT_TOGGL_WORKSPACE_ID;
        try {
            await this.stopCurrentTogglTimer(workspaceId);

            let projectId = step.projectId || null;
            if (!projectId && step.projectName) {
                projectId = await this.resolveTogglProjectId(step.projectName, workspaceId);
            }
            if (!projectId && step.projectName) {
                new Notice(`Toggl: no encontré proyecto "${step.projectName}"`);
                return;
            }

            await this.startTogglTimer({
                workspaceId,
                projectId,
                description: step.description || ''
            });

            const label = step.description
                ? `${step.projectName || 'Toggl'} / ${step.description}`
                : (step.projectName || 'siguiente');
            new Notice(`🔔 Siguiente: ${label}`);
        } catch (e) {
            console.error('Toggl chain failed', e);
            new Notice(`Toggl campana falló: ${e.message}`);
        }
    }

    async removeHabit(index) {
        const habit = this.settings.habits[index];
        if (!habit) return;
        this.dismissNativeHabitName(habit.name);
        this.settings.habits.splice(index, 1);
        await this.saveSettings();
    }

    async completeQuest(index) {
        const s = this.settings;
        const quest = s.quests[index];
        if (quest && !quest.completed) {
            if (quest.kind === 'skill-challenge' && quest.skillNodeId) {
                if (!this.skillTreeService) {
                    this.skillTreeService = new SkillTreeService(this);
                }
                const node = this.skillTreeService.getNode(quest.skillNodeId);
                if (node && !this.skillTreeService.isNodeUnlocked(node)) {
                    new Notice('Completa los prerequisitos del nodo antes de este reto.');
                    return;
                }
            }

            quest.completed = true;
            quest.completedDate = new Date().toISOString();
            s.totalQuestsCompleted++;

            const diff = DIFFICULTY[quest.difficulty || 'medium'];
            let finalXp = Math.round(quest.xp * diff.multiplier);
            let finalGold = Math.round(quest.gold * diff.multiplier);

            const vowService = new VowService(this);
            const vowMultiplier = vowService.getVowQuestMultiplier(quest.school);
            finalXp = Math.round(finalXp * vowMultiplier);

            // Check for Flow State bonus (HUMAN 3.0)
            const flowState = checkFlowState(quest.difficulty || 'medium', s.level);
            if (flowState.inFlow) {
                finalXp = Math.round(finalXp * 1.25); // 25% bonus for flow state
                new Notice(`🌊 ${flowState.message}`);
            }

            const baseBossDamage = Number(quest.bossDamage) || 10;
            const bossDamage = Math.round(baseBossDamage * vowMultiplier);

            // Log activity
            this.logActivity('quest_complete', quest.name, {
                xp: finalXp,
                gold: finalGold,
                difficulty: quest.difficulty || 'medium',
                inFlow: flowState.inFlow,
                kind: quest.kind || 'standard',
                skillNodeId: quest.skillNodeId || null,
                school: quest.school || null,
                linkedBossIds: quest.linkedBossIds || [],
                bossDamage,
                vowMultiplier
            });

            if (!this.skillTreeService) {
                this.skillTreeService = new SkillTreeService(this);
            }

            const treeResult = this.skillTreeService.applyQuestCompletion(quest);
            if (treeResult?.leveledUp) {
                new Notice(`Skill Tree: ${treeResult.node.name} reached ${treeResult.node.currentLevel}/${treeResult.node.maxLevel}`);
            }
            if (treeResult?.acquired) {
                new Notice(`Skill acquired: ${treeResult.node.name}`);
            }

            if (Array.isArray(quest.linkedBossIds) && quest.linkedBossIds.length > 0) {
                for (const bossId of quest.linkedBossIds) {
                    const bossIndex = (s.bossFights || []).findIndex(boss => boss.id === bossId && !boss.defeated);
                    if (bossIndex >= 0) {
                        await this.damageBoss(bossIndex, bossDamage);
                    }
                }
            }

            this.gainXp(finalXp, finalGold, quest.domain);
            new Notice(`⚔️ Quest Complete: ${quest.name}!`);
            if (vowMultiplier !== 1) {
                new Notice(`Estandarte: ${vowService.formatVowMultiplier(vowMultiplier)} XP y daño`);
            }
        }
    }

    async removeQuest(index) {
        this.settings.quests.splice(index, 1);
        await this.saveSettings();
    }

    async triggerBadHabit(index) {
        const s = this.settings;
        const habit = s.badHabits[index];
        if (habit) {
            habit.triggerCount++;
            s.gold = Math.max(0, s.gold - habit.goldPenalty);
            this.takeDamage(habit.hpCost);

            // Increase psychic entropy (HUMAN 3.0)
            s.psychicEntropy = Math.min(100, (s.psychicEntropy || 0) + 10);

            // Log activity
            this.logActivity('bad_habit', habit.name, {
                hpLost: habit.hpCost,
                goldLost: habit.goldPenalty,
                triggerCount: habit.triggerCount
            });

            new Notice(`😔 -${habit.hpCost} HP | -${habit.goldPenalty}g | +10 Entropy`);
            await this.saveSettings();
        }
    }

    async removeBadHabit(index) {
        this.settings.badHabits.splice(index, 1);
        await this.saveSettings();
    }

    // ============================================================================
    // ACTIVITY LOG SYSTEM
    // ============================================================================
    logActivity(category, description, details = {}) {
        const s = this.settings;
        const activity = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            category: category,
            description: description,
            details: details
        };

        // No artificial cap — monthly rollup moves older months into activityLogArchives
        s.activityLog = [activity, ...(s.activityLog || [])];
    }

    // ============================================================================
    // INN/HOTEL RECOVERY SYSTEM
    // ============================================================================
    async restAtInn(tierId) {
        const s = this.settings;
        const inn = INN_TIERS.find(i => i.id === tierId);

        if (!inn) {
            new Notice('❌ Invalid inn tier!');
            return false;
        }

        if (s.gold < inn.cost) {
            new Notice(`❌ Not enough gold! Need ${inn.cost}g`);
            return false;
        }

        if (s.hp >= s.maxHp) {
            new Notice('❤️ You are already at full health!');
            return false;
        }

        s.gold -= inn.cost;
        const oldHp = s.hp;
        s.hp = Math.min(s.maxHp, s.hp + inn.hpRecover);
        const actualRecovery = s.hp - oldHp;

        // Log activity
        this.logActivity('inn_rest', `Rested at ${inn.name}`, {
            hpRecovered: actualRecovery,
            goldSpent: inn.cost
        });

        // Reduce entropy (rest reduces chaos)
        s.psychicEntropy = Math.max(0, (s.psychicEntropy || 0) - 15);

        await this.saveSettings();
        new Notice(`${inn.name}: +${actualRecovery} HP | -${inn.cost}g | -15 Entropy`);
        return true;
    }

    // ============================================================================
    // KNOWLEDGE TOMES
    // ============================================================================
    slugifyTomeId(name) {
        return String(name || '')
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
            .replace(/[^a-zA-Z0-9]+/g, '-')
            .toLowerCase()
            .replace(/^-+|-+$/g, '');
    }

    humanizeTomeName(name) {
        return String(name || '')
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
            .replace(/[_-]+/g, ' ')
            .trim();
    }

    ensureTomesCatalog() {
        const folder = 'RpgImages/Loot/Tomes/Flats';
        if (!Array.isArray(this.settings.tomes)) this.settings.tomes = [];

        const byId = new Map(this.settings.tomes.filter(t => t?.id).map(t => [t.id, t]));
        const files = this.app.vault.getFiles().filter(file =>
            file.path.replace(/\\/g, '/').startsWith(`${folder}/`) &&
            /_Flat_16x16\.png$/i.test(file.name)
        );

        let changed = false;
        files.sort((a, b) => a.name.localeCompare(b.name)).forEach(file => {
            const base = file.basename.replace(/_Flat_16x16$/i, '');
            const id = this.slugifyTomeId(base);
            if (!id) return;

            const existing = byId.get(id);
            if (existing) {
                if (existing.flatPath !== file.path) {
                    existing.flatPath = file.path;
                    changed = true;
                }
                if (!existing.name) {
                    existing.name = this.humanizeTomeName(base);
                    changed = true;
                }
            } else {
                const tome = {
                    id,
                    name: this.humanizeTomeName(base),
                    flatPath: file.path,
                    description: '',
                    bossId: null,
                    unlocked: false,
                    unlockedAt: null,
                    damageReport: null
                };
                this.settings.tomes.push(tome);
                byId.set(id, tome);
                changed = true;
            }
        });

        this.settings.tomes.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        return changed;
    }

    getTomeById(tomeId) {
        if (!tomeId) return null;
        return (this.settings.tomes || []).find(t => t.id === tomeId) || null;
    }

    getAvailableTomesForBoss(bossId) {
        const bossKey = bossId != null ? String(bossId) : null;
        return (this.settings.tomes || []).filter(tome =>
            !tome.bossId || (bossKey && String(tome.bossId) === bossKey)
        );
    }

    assignTomeToBoss(bossId, tomeId, description) {
        const boss = (this.settings.bossFights || []).find(b => String(b.id) === String(bossId));
        if (!boss) return false;

        if (boss.tomeId && boss.tomeId !== tomeId) {
            const previous = this.getTomeById(boss.tomeId);
            if (previous && String(previous.bossId) === String(bossId)) {
                previous.bossId = null;
            }
        }

        if (!tomeId) {
            boss.tomeId = null;
            return true;
        }

        const tome = this.getTomeById(tomeId);
        if (!tome) return false;

        if (tome.bossId && String(tome.bossId) !== String(bossId)) {
            const otherBoss = (this.settings.bossFights || []).find(b => String(b.id) === String(tome.bossId));
            if (otherBoss) otherBoss.tomeId = null;
        }

        tome.bossId = bossId;
        boss.tomeId = tomeId;
        if (description !== undefined) {
            tome.description = description;
        }
        return true;
    }

    getTomeDamageBreakdown(bossId) {
        const bossKey = String(bossId);
        const quests = {};
        const habits = {};

        const add = (map, name, damage) => {
            if (!name || !damage) return;
            map[name] = (map[name] || 0) + Number(damage);
        };

        (this.settings.activityLog || []).forEach(ev => {
            const ids = (ev.details?.linkedBossIds || []).map(String);
            if (!ids.includes(bossKey)) return;
            const dmg = Number(ev.details?.bossDamage) || 0;
            if (ev.category === 'quest_complete') add(quests, ev.description, dmg);
            else if (ev.category === 'habit_complete') add(habits, ev.description, dmg);
        });

        Object.values(this.settings.activityLogArchives || {}).forEach(archive => {
            (archive.habitSummaries || []).forEach(item => {
                const dmg = item.bossDamageByBossId?.[bossKey] ?? item.bossDamageByBossId?.[bossId];
                add(habits, item.name, dmg);
            });
            (archive.questSummaries || []).forEach(item => {
                const dmg = item.bossDamageByBossId?.[bossKey] ?? item.bossDamageByBossId?.[bossId];
                add(quests, item.name, dmg);
            });
        });

        const questEntries = Object.entries(quests).map(([name, damage]) => ({ name, damage }));
        const habitEntries = Object.entries(habits).map(([name, damage]) => ({ name, damage }));
        return {
            questTotal: questEntries.reduce((sum, row) => sum + row.damage, 0),
            habitTotal: habitEntries.reduce((sum, row) => sum + row.damage, 0),
            quests: questEntries,
            habits: habitEntries
        };
    }

    unlockTomeForBoss(boss) {
        if (!boss?.tomeId || !bossUsesTome(boss.tier)) return null;
        const tome = this.getTomeById(boss.tomeId);
        if (!tome) return null;

        tome.unlocked = true;
        tome.unlockedAt = new Date().toISOString();
        tome.bossId = boss.id;
        tome.damageReport = this.getTomeDamageBreakdown(boss.id);
        return tome;
    }

    ensureFlowersCatalog() {
        const folder = 'RpgImages/Loot/Flowers';
        if (!Array.isArray(this.settings.flowers)) this.settings.flowers = [];

        const byId = new Map(this.settings.flowers.filter(f => f?.id).map(f => [f.id, f]));
        const files = this.app.vault.getFiles().filter(file => {
            const p = file.path.replace(/\\/g, '/');
            return p.startsWith(`${folder}/`) && /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name);
        });

        let changed = false;
        files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })).forEach(file => {
            const id = this.slugifyTomeId(file.basename);
            if (!id) return;

            const existing = byId.get(id);
            if (existing) {
                if (existing.flatPath !== file.path) {
                    existing.flatPath = file.path;
                    changed = true;
                }
                if (!existing.name) {
                    existing.name = this.humanizeTomeName(file.basename);
                    changed = true;
                }
            } else {
                const flower = {
                    id,
                    name: this.humanizeTomeName(file.basename.replace(/([a-zA-Z])(\d+)/g, '$1 $2')),
                    flatPath: file.path,
                    description: '',
                    bossId: null,
                    unlocked: false,
                    unlockedAt: null,
                    damageReport: null
                };
                this.settings.flowers.push(flower);
                byId.set(id, flower);
                changed = true;
            }
        });

        this.settings.flowers.sort((a, b) =>
            (a.name || '').localeCompare(b.name || '', undefined, { numeric: true })
        );
        return changed;
    }

    getFlowerById(flowerId) {
        if (!flowerId) return null;
        return (this.settings.flowers || []).find(f => f.id === flowerId) || null;
    }

    getAvailableFlowersForBoss(bossId) {
        const bossKey = bossId != null ? String(bossId) : null;
        return (this.settings.flowers || []).filter(flower =>
            !flower.bossId || (bossKey && String(flower.bossId) === bossKey)
        );
    }

    assignFlowerToBoss(bossId, flowerId, description) {
        const boss = (this.settings.bossFights || []).find(b => String(b.id) === String(bossId));
        if (!boss) return false;

        if (boss.flowerId && boss.flowerId !== flowerId) {
            const previous = this.getFlowerById(boss.flowerId);
            if (previous && String(previous.bossId) === String(bossId)) {
                previous.bossId = null;
            }
        }

        if (!flowerId) {
            boss.flowerId = null;
            return true;
        }

        const flower = this.getFlowerById(flowerId);
        if (!flower) return false;

        if (flower.bossId && String(flower.bossId) !== String(bossId)) {
            const otherBoss = (this.settings.bossFights || []).find(b => String(b.id) === String(flower.bossId));
            if (otherBoss) otherBoss.flowerId = null;
        }

        flower.bossId = bossId;
        boss.flowerId = flowerId;
        if (description !== undefined) {
            flower.description = description;
        }
        return true;
    }

    unlockFlowerForBoss(boss) {
        if (!boss?.flowerId || bossUsesTome(boss.tier)) return null;
        const flower = this.getFlowerById(boss.flowerId);
        if (!flower) return null;

        flower.unlocked = true;
        flower.unlockedAt = new Date().toISOString();
        flower.bossId = boss.id;
        flower.damageReport = this.getTomeDamageBreakdown(boss.id);
        return flower;
    }

    // ============================================================================
    // BOSS FIGHT SYSTEM
    // ============================================================================
    async damageBoss(bossIndex, damage) {
        const s = this.settings;
        const boss = s.bossFights[bossIndex];

        if (!boss || boss.defeated) return;

        boss.currentHp = Math.max(0, boss.currentHp - damage);

        // Log activity
        this.logActivity('boss_damage', `Dealt ${damage} damage to ${boss.name}`, {
            damage,
            remaining: boss.currentHp
        });

        // Check if boss is defeated
        if (boss.currentHp <= 0) {
            boss.defeated = true;
            boss.defeatedAt = new Date().toISOString();
            s.totalBossesDefeated = (s.totalBossesDefeated || 0) + 1;

            // Rewards for defeating boss
            const xpReward = boss.maxHp * 2;
            const goldReward = boss.maxHp;

            s.xp += xpReward;
            s.gold += goldReward;

            const unlockedTome = this.unlockTomeForBoss(boss);
            const unlockedFlower = this.unlockFlowerForBoss(boss);
            const unlockedLoot = unlockedTome || unlockedFlower;

            this.logActivity('boss_defeated', `Defeated ${boss.name}!`, {
                xp: xpReward,
                gold: goldReward,
                tomeId: unlockedTome?.id || null,
                flowerId: unlockedFlower?.id || null
            });

            let lootLine = '';
            if (unlockedTome) lootLine = `\n📖 Tomo desbloqueado: ${unlockedTome.name}`;
            else if (unlockedFlower) lootLine = `\n🌸 Flor desbloqueada: ${unlockedFlower.name}`;

            new Notice(
                unlockedLoot
                    ? `🎉 BOSS DEFEATED: ${boss.name}!\n+${xpReward} XP | +${goldReward}g${lootLine}`
                    : `🎉 BOSS DEFEATED: ${boss.name}!\n+${xpReward} XP | +${goldReward}g`
            );
            this.checkAchievements();
        } else {
            new Notice(`⚔️ ${boss.name} takes ${damage} damage! (${boss.currentHp}/${boss.maxHp} HP remaining)`);
        }

        await this.saveSettings();
    }

    // Damage bosses when completing domain tasks
    damageBossesForDomain(domainId, baseDamage = 10) {
        const s = this.settings;
        const activeBosses = (s.bossFights || []).filter(b => !b.defeated && b.domain === domainId);

        activeBosses.forEach((boss, idx) => {
            const bossIndex = s.bossFights.indexOf(boss);
            this.damageBoss(bossIndex, baseDamage);
        });
    }

    // ============================================================================
    // PENALTY SYSTEM (Weekly check for negative gold)
    // ============================================================================
    checkWeeklyPenalty() {
        const s = this.settings;
        if (!s.penaltyEnabled) return;

        const now = new Date();
        const lastCheck = s.lastPenaltyCheck ? new Date(s.lastPenaltyCheck) : null;

        // Check if a week has passed
        if (lastCheck) {
            const weekInMs = 7 * 24 * 60 * 60 * 1000;
            if (now - lastCheck < weekInMs) return;
        }

        // Apply penalty if gold is negative
        if (s.gold < 0) {
            const penalty = Math.min(Math.abs(s.gold), 20); // Max 20 HP penalty
            this.takeDamage(penalty);
            this.logActivity('damage', `Weekly debt penalty`, { hpLost: penalty, debt: s.gold });
            new Notice(`💀 Weekly Penalty: -${penalty} HP for ${s.gold}g debt!`);
        }

        s.lastPenaltyCheck = now.toISOString();
        this.saveSettings();
    }

    // ============================================================================
    // NPC INTERACTION
    // ============================================================================
    getNPCDialogue(npcId) {
        const npc = this.settings.npcs.find(n => n.id === npcId) || DEFAULT_NPCS.find(n => n.id === npcId);
        return npc ? npc.dialogue : "...";
    }

    getNPCQuestSuggestion(npcId) {
        const s = this.settings;
        const npc = DEFAULT_NPCS.find(n => n.id === npcId);
        if (!npc) return null;

        // Find lowest scoring domain that this NPC covers
        const relevantDomains = s.domains.filter(d => npc.questTypes.includes(d.id));
        if (relevantDomains.length === 0) return null;

        const lowestDomain = relevantDomains.reduce((a, b) => a.score < b.score ? a : b);

        // Generate quest suggestion based on domain
        const suggestions = {
            health: ['Go for a 30-minute walk', 'Drink 8 glasses of water today', 'Do 20 push-ups', 'Sleep before 11 PM'],
            education: ['Read for 30 minutes', 'Complete an online lesson', 'Learn 10 new vocabulary words', 'Watch an educational video'],
            psychologicalWellbeing: ['Meditate for 10 minutes', 'Write 3 things you are grateful for', 'Call a friend', 'Take a digital detox hour'],
            timeUse: ['Plan tomorrow with time blocks', 'Complete your MIT (Most Important Task)', 'Declutter one area', 'Review weekly goals'],
            communityVitality: ['Help someone today', 'Send an appreciation message', 'Attend a community event', 'Volunteer for an hour'],
            livingStandards: ['Review your budget', 'Save $10 today', 'Learn about investing', 'Track all expenses today'],
            ecologicalAwareness: ['Use reusable bags', 'Plant something', 'Reduce water usage', 'Walk instead of driving'],
            culturalResilience: ['Practice a traditional skill', 'Cook a cultural dish', 'Share a story from your heritage', 'Learn about your ancestry'],
            goodGovernance: ['Set clear boundaries', 'Make a decision you have been avoiding', 'Organize your workspace', 'Create a personal policy']
        };

        const domainSuggestions = suggestions[lowestDomain.id] || ['Complete a meaningful task'];
        const randomSuggestion = domainSuggestions[Math.floor(Math.random() * domainSuggestions.length)];

        return {
            npc: npc,
            domain: lowestDomain,
            questName: randomSuggestion,
            xp: 15 + Math.floor(Math.random() * 10),
            gold: 5 + Math.floor(Math.random() * 5)
        };
    }

    async buyReward(index) {
        const s = this.settings;
        const reward = s.rewards[index];
        if (s.gold >= reward.cost) {
            s.gold -= reward.cost;

            // Log activity
            this.logActivity('shop_purchase', reward.name, { cost: reward.cost });

            new Notice(`🎁 Purchased: ${reward.name}!`);
            await this.saveSettings();
        } else {
            new Notice(`Not enough gold!`);
        }
    }

    async removeReward(index) {
        this.settings.rewards.splice(index, 1);
        await this.saveSettings();
    }

    // ============================================================================
    // JOURNAL INTELLIGENCE SYSTEM
    // ============================================================================

    async syncJournals() {
        const js = this.settings.journalSettings;
        if (!js.enabled) {
            new Notice('📓 Journal Intelligence is disabled. Enable it in settings.');
            return;
        }

        // Initialize aiService if API key exists
        const aiService = this.settings.ai?.openRouterApiKey ? new AIService(this) : null;

        const analyzer = new JournalAnalyzer(this);
        // Set aiService on the plugin temporarily for the analyzer to use
        this.aiService = aiService;

        const newNotes = await analyzer.getNewNotes();

        if (newNotes.length === 0) {
            new Notice('📓 No new journal entries to sync');
            return;
        }

        new Notice(`📓 Analyzing ${newNotes.length} journal entries...`);

        let totalXP = 0;
        let totalGold = 0;
        let totalHPChange = 0;
        const domainImpacts = {};
        const recentAnalysis = [];

        for (const note of newNotes) {
            try {
                const analysis = await analyzer.analyzeNote(note);

                // Calculate rewards from analysis
                if (analysis.ai) {
                    // AI analysis available - use its suggestions
                    totalXP += analysis.ai.suggestedXP || 0;
                    totalHPChange += analysis.ai.suggestedHPChange || 0;

                    // Apply domain impacts
                    for (const [domain, score] of Object.entries(analysis.ai.domains || {})) {
                        if (score > 0) {
                            domainImpacts[domain] = (domainImpacts[domain] || 0) + score;
                        }
                    }

                    // Store for recent analysis display
                    recentAnalysis.push({
                        fileName: analysis.fileName,
                        sentiment: analysis.ai.sentiment || 0,
                        achievements: analysis.ai.achievements || [],
                        challenges: analysis.ai.challenges || [],
                        xp: analysis.ai.suggestedXP || 0,
                        date: analysis.modifiedDate
                    });
                } else {
                    // Offline analysis only
                    const sentiment = analysis.offline.sentiment;

                    // XP from positive sentiment
                    totalXP += Math.max(0, sentiment.score * 5);

                    // HP change from sentiment
                    if (sentiment.score < -2) {
                        totalHPChange -= Math.min(20, Math.abs(sentiment.score) * 2);
                    } else if (sentiment.score > 2) {
                        totalHPChange += Math.min(10, sentiment.score);
                    }

                    // Domain impacts from keyword matches
                    for (const [domain, data] of Object.entries(analysis.offline.domainScores)) {
                        if (data.count > 0) {
                            domainImpacts[domain] = (domainImpacts[domain] || 0) + data.count * 2;
                        }
                    }

                    // Store for recent analysis display
                    recentAnalysis.push({
                        fileName: analysis.fileName,
                        sentiment: sentiment.score,
                        positiveWords: sentiment.positiveWords,
                        negativeWords: sentiment.negativeWords,
                        xp: Math.max(0, sentiment.score * 5),
                        date: analysis.modifiedDate
                    });
                }

                // Gold from word count (journaling effort)
                totalGold += Math.floor(analysis.wordCount / 100);

                // Log to activity
                this.logActivity('journal_sync', `Analyzed: ${analysis.fileName}`, {
                    wordCount: analysis.wordCount,
                    sentiment: analysis.offline?.sentiment?.score || (analysis.ai?.sentiment || 0),
                    hasAI: !!analysis.ai
                });

                // Create embedding for semantic search (if enabled and API key available)
                if (this.settings.ai?.embeddingEnabled && this.settings.ai?.openRouterApiKey) {
                    try {
                        const embeddingService = new EmbeddingService(this);
                        const content = await this.app.vault.read(note);
                        const embeddingData = await embeddingService.embedJournalEntry(
                            note.path,
                            note.basename,
                            content,
                            analysis.modifiedDate
                        );

                        // Store or update embedding
                        const existingIdx = js.embeddings.findIndex(e => e.filePath === note.path);
                        if (existingIdx >= 0) {
                            js.embeddings[existingIdx] = embeddingData;
                        } else {
                            js.embeddings.push(embeddingData);
                        }
                    } catch (embErr) {
                        console.log(`Embedding skipped for ${note.basename}:`, embErr.message);
                    }
                }

            } catch (e) {
                console.error(`Error analyzing note ${note.path}:`, e);
            }
        }

        const s = this.settings;

        // Apply XP and Gold
        if (totalXP > 0 || totalGold > 0) {
            this.gainXp(totalXP, totalGold);
        }

        // Apply HP changes
        if (totalHPChange < 0) {
            this.takeDamage(Math.abs(totalHPChange));
        } else if (totalHPChange > 0) {
            s.hp = Math.min(s.maxHp, s.hp + totalHPChange);
        }

        // Apply domain score changes (gradual, capped at ±5 per sync)
        for (const [domainId, impact] of Object.entries(domainImpacts)) {
            const domain = s.domains.find(d => d.id === domainId);
            if (domain) {
                const change = Math.min(5, Math.max(-5, impact / newNotes.length));
                domain.score = Math.min(100, Math.max(0, domain.score + Math.round(change)));
            }
        }

        // Skill Discovery from journals (if enabled and API key available)
        let skillsDiscovered = 0;
        let skillsLeveledUp = 0;
        const apiKey = getActiveApiKey(this.settings);

        // Ensure skillsSettings exists with defaults
        if (!this.settings.skillsSettings) {
            this.settings.skillsSettings = { ...DEFAULT_SKILLS_SETTINGS };
        }

        const autoDiscovery = this.settings.skillsSettings.autoDiscovery !== false; // Default true
        console.log('Skill Discovery Check:', { autoDiscovery, hasApiKey: !!apiKey, notesCount: newNotes.length });

        if (autoDiscovery && apiKey) {
            new Notice('🎯 Discovering skills from journals...');
            const skillService = new SkillService(this);

            for (const note of newNotes) {
                try {
                    const content = await this.app.vault.read(note);
                    console.log(`Analyzing skills in: ${note.basename} (${content.length} chars)`);

                    const discovered = await skillService.discoverSkillsFromJournal(content, note.basename);
                    console.log(`Found ${discovered.length} skills in ${note.basename}:`, discovered);

                    if (discovered.length > 0) {
                        const results = await skillService.processDiscoveredSkills(discovered);

                        for (const result of results) {
                            if (result.action === 'discovered') {
                                skillsDiscovered++;
                                this.logActivity('skill_discovered', `Discovered skill: ${result.skill.name}`, {
                                    category: result.skill.category
                                });
                                new Notice(`🎯 New skill discovered: ${result.skill.name}`);
                            } else if (result.levelsGained > 0) {
                                skillsLeveledUp += result.levelsGained;
                                this.logActivity('skill_levelup', `${result.skill.name} leveled up!`, {
                                    newLevel: result.skill.level
                                });
                            }
                        }
                    }
                } catch (skillErr) {
                    console.error(`Skill discovery error for ${note.basename}:`, skillErr);
                }
            }
        } else {
            console.log('Skill discovery skipped:', { autoDiscovery, hasApiKey: !!apiKey });
        }

        // Update journal settings
        js.lastSyncDate = new Date().toISOString();
        js.recentAnalysis = recentAnalysis.slice(0, 10); // Keep last 10

        await this.saveSettings();
        this.refreshViews();

        // Show summary with skills info
        const hpText = totalHPChange >= 0 ? `+${totalHPChange}` : totalHPChange;
        let summary = `📓 Journal Sync Complete!\n+${totalXP} XP, +${totalGold} Gold\nHP: ${hpText}`;
        if (skillsDiscovered > 0 || skillsLeveledUp > 0) {
            summary += `\n🎯 Skills: ${skillsDiscovered > 0 ? `+${skillsDiscovered} new` : ''}${skillsDiscovered > 0 && skillsLeveledUp > 0 ? ', ' : ''}${skillsLeveledUp > 0 ? `${skillsLeveledUp} level ups` : ''}`;
        }
        new Notice(summary);
    }

    checkAchievements() {
        const s = this.settings;
        let unlocked = false;

        s.achievements.forEach(ach => {
            if (ach.unlocked) return;

            let shouldUnlock = false;

            switch (ach.id) {
                case 'first_habit':
                    shouldUnlock = s.totalHabitsCompleted >= 1;
                    break;
                case 'level_5':
                    shouldUnlock = s.level >= 5;
                    break;
                case 'level_10':
                    shouldUnlock = s.level >= 10;
                    break;
                case 'streak_7':
                    shouldUnlock = s.habits.some(h => h.streak >= 7 || h.bestStreak >= 7);
                    break;
                case 'streak_30':
                    shouldUnlock = s.habits.some(h => h.streak >= 30 || h.bestStreak >= 30);
                    break;
                case 'gold_500':
                    shouldUnlock = s.totalGoldEarned >= 500;
                    break;
                case 'habits_10':
                    shouldUnlock = s.habits.length >= 10;
                    break;
                case 'quests_5':
                    shouldUnlock = s.totalQuestsCompleted >= 5;
                    break;
                case 'character_created':
                    shouldUnlock = s.characterProfile?.assessmentComplete === true;
                    break;
                case 'all_domains_50':
                    shouldUnlock = s.domains.every(d => d.score >= 50);
                    break;
                case 'ai_coach_first':
                    shouldUnlock = (s.ai?.chatHistory?.length || 0) > 0;
                    break;
                case 'ai_quests_5':
                    shouldUnlock = (s.aiQuestsGenerated || 0) >= 5;
                    break;
            }

            if (shouldUnlock) {
                ach.unlocked = true;
                s.gold += ach.reward;
                s.totalGoldEarned += ach.reward;
                new Notice(`🏆 Achievement Unlocked: ${ach.name}! +${ach.reward}g`);
                unlocked = true;
            }
        });

        if (unlocked) {
            this.saveSettings();
            this.refreshViews();
        }
    }

    updateStatusBar() {
        const s = this.settings;
        if (this.statusBarItem) {
            const name = s.characterProfile?.name ? `${s.characterProfile.name} ` : '';
            this.statusBarItem.setText(`${name}Lv${s.level} | ❤️${s.hp} | 💰${s.gold}`);
        }
    }

    refreshViews() {
        this.app.workspace.getLeavesOfType(VIEW_TYPE_HERO).forEach((leaf) => {
            if (leaf.view instanceof HeroView) leaf.view.render();
        });
    }

    async activateView() {
        const { workspace } = this.app;
        let leaf = workspace.getLeavesOfType(VIEW_TYPE_HERO)[0];
        if (!leaf) {
            leaf = workspace.getRightLeaf(false) || workspace.getLeaf('tab');
            if (leaf) {
                await leaf.setViewState({ type: VIEW_TYPE_HERO, active: true });
            }
        }
        if (leaf) workspace.revealLeaf(leaf);
    }
};
