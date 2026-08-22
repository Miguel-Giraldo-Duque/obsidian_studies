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
module.exports = {
    AI_PROVIDERS,
    MODELS_BY_PROVIDER,
    SKILL_CATEGORIES,
    DEFAULT_SKILL,
    DEFAULT_SPELL_LIBRARY,
    DEFAULT_NATIVE_HABITS,
    DEFAULT_SKILLS_SETTINGS,
    DEFAULT_HABIT_SKILL_SYNC,
    DEFAULT_HABIT_TIMER_CHAIN,
    DEFAULT_TOGGL_WORKSPACE_ID,
    SKILL_TREE_SCHOOLS,
    SKILL_TREE_ORNATE_BORDER_SCHOOLS,
    SKILL_TREE_BORDER_ROOT,
    SKILL_ICONS_FOLDER,
    VOWS_IMAGES_FOLDER,
    DEFAULT_SEED_VOWS,
    getSkillTreeBorderPath,
    getSkillTreeBorderTier,
    resolveSkillTreeSchoolId,
    BOSS_FRAME_ROOT,
    BOSS_FRAME_STANDARD,
    BOSS_FRAME_PRIMORDIAL,
    NIVELES_FRAME_ROOT,
    MAX_BOSS_PHASES,
    DEFAULT_BOSS_HP_BAR_COLOR,
    DEFAULT_BOSS_CARD_BG_COLOR,
    bossUsesTome,
    getBossFramePath,
    createDefaultBossPhase,
    defaultBossPhaseColors,
    normalizeBossPhases,
    getBossPhaseIndex,
    getActivePhaseConfig,
    resolveBossFramePath,
    resolveBossImagePath,
    getActiveBossPhaseVisual,
    listNivelesFramePaths,
    nivelesFrameLabel,
    SKILL_TREE_NODE_ROLES,
    DEFAULT_SKILL_TREE,
    DEFAULT_SKILL_TREE_QUEST,
    LEGACY_SOMMELIER_NODE_ID,
    SOMMELIER_NODE_ID,
    PHOBOS_BOSS_ID,
    BENEVOLENCIA_NODE_ID,
    EMPATIA_NODE_ID,
    KRYOS_BOSS_ID,
    GUILTMAL_BOSS_ID,
    SOMMELIER_DESCRIPTION,
    getChatModels,
    getEmbeddingModels,
    getActiveApiKey,
    getActiveChatModel,
    getActiveEmbeddingModel
};
