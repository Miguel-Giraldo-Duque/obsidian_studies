#!/usr/bin/env node
/**
 * One-shot: apply Sommelier bank import directly to data.json
 */
const fs = require('fs');
const path = require('path');

const pluginDir = path.join(__dirname, '..', '..');
const dataPath = path.join(pluginDir, 'data.json');

const { SOMMELIER_CHALLENGES } = require(path.join(__dirname, '..', 'data', 'sommelier-challenges.js'));

const SOMMELIER_NODE_ID = 'node_1783916853576_snysp17go';
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

function createId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
if (!data.quests) data.quests = [];
if (!data.skillTree?.nodes) {
    console.error('skillTree.nodes missing');
    process.exit(1);
}

const node = data.skillTree.nodes.find(n => n.id === SOMMELIER_NODE_ID);
if (!node) {
    console.error('Sommelier node not found');
    process.exit(1);
}

const existing = data.quests.filter(q => q.source === 'sommelier-bank' && q.skillNodeId === SOMMELIER_NODE_ID);
if (existing.length > 0) {
    console.log(`Already imported: ${existing.length} quests`);
    process.exit(0);
}

node.description = SOMMELIER_DESCRIPTION;
node.maxLevel = 3;

const difficultyBySkill = { 1: 'easy', 2: 'medium', 3: 'hard' };
let created = 0;

SOMMELIER_CHALLENGES.forEach(challenge => {
    data.quests.push({
        id: createId('quest'),
        name: `Reto ${challenge.bankLevel}.${challenge.number}`,
        description: challenge.text,
        xp: 10,
        gold: 5,
        domain: 'psychologicalWellbeing',
        difficulty: difficultyBySkill[challenge.skillLevel] || 'medium',
        completed: false,
        completedDate: null,
        kind: 'skill-challenge',
        skillNodeId: SOMMELIER_NODE_ID,
        skillLevel: challenge.skillLevel,
        school: 'Autoridad',
        linkedBossIds: [GUILTMAL_BOSS_ID],
        bossDamage: 10,
        source: 'sommelier-bank'
    });
    created++;
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Imported ${created} quests into data.json`);
