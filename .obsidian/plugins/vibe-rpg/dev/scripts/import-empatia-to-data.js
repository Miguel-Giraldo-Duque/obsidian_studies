#!/usr/bin/env node
/**
 * One-shot: apply Empatia bank import directly to data.json
 */
const fs = require('fs');
const path = require('path');

const pluginDir = path.join(__dirname, '..', '..');
const dataPath = path.join(pluginDir, 'data.json');

const { EMPATIA_CHALLENGES } = require(path.join(__dirname, '..', 'data', 'empatia-challenges.js'));

const EMPATIA_NODE_ID = 'node_1783925025123_9qj0tnoxs';
const KRYOS_BOSS_ID = '1783927787622';
const PHOBOS_BOSS_ID = '1783917794860';

function createId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
if (!data.quests) data.quests = [];
if (!data.skillTree?.nodes) {
    console.error('skillTree.nodes missing');
    process.exit(1);
}

const node = data.skillTree.nodes.find(n => n.id === EMPATIA_NODE_ID);
if (!node) {
    console.error('Empatia node not found');
    process.exit(1);
}

const bossFights = data.bossFights || [];
const kryos = bossFights.find(b => b.id === KRYOS_BOSS_ID);
const phobos = bossFights.find(b => b.id === PHOBOS_BOSS_ID);
if (!kryos || !phobos) {
    console.error('Kryos or Phobos boss not found');
    process.exit(1);
}

const existing = data.quests.filter(q => q.source === 'empatia-bank' && q.skillNodeId === EMPATIA_NODE_ID);
if (existing.length > 0) {
    console.log(`Already imported: ${existing.length} quests`);
    process.exit(0);
}

node.maxLevel = 3;

const difficultyBySkill = { 1: 'easy', 2: 'medium', 3: 'hard' };
let created = 0;

EMPATIA_CHALLENGES.forEach(challenge => {
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
        skillNodeId: EMPATIA_NODE_ID,
        skillLevel: challenge.skillLevel,
        school: 'Calidez',
        linkedBossIds: [KRYOS_BOSS_ID, PHOBOS_BOSS_ID],
        bossDamage: 10,
        source: 'empatia-bank'
    });
    created++;
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Imported ${created} empatia quests into data.json (bosses: ${kryos.name}, ${phobos.name})`);
