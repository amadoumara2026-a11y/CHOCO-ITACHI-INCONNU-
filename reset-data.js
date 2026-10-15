import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

const defaults = {
    'autoStatus.json': { enabled: true }, // Choco voit les statuts 👀
    'autoread.json': { enabled: true },
    'autotyping.json': { enabled: true }, // Effet typing choco
    'pmblocker.json': { enabled: false },
    'anticall.json': { enabled: true }, // Anti-appel pour Inconnu
    'stealthMode.json': { enabled: true }, // Mode Inconnu activé 👻
    'autoBio.json': { enabled: true, customBio: "🍫 CHOCO ITACHI INCONNU 👁️ | By Boss Alin | 224629447488" },
    'autoReaction.json': { enabled: true },
    'messageCount.json': { isPublic: true, messageCount: {} },
    'userGroupData.json': {
        users: [], groups: [], antilink: {}, antibadword: {},
        warnings: {}, sudo: ["224629447488"], // Toi en SUDO direct!
        welcome: {}, goodbye: {},
        chatbot: {}, autoReaction: true
    },
    'banned.json': [],
    'warnings.json': {},
    'notes.json': {},
    'owner.json': ["224629447488"], // Owner = Toi
    'premium.json': ["224629447488"],
    'autoAi.json': {},
    'antidelete.json': { enabled: true }, // Choco voit les messages supprimés
    'antilink.json': {},
    'antibadword.json': {},
    'antispam.json': { groups: {} },
    'autoreplies.json': { enabled: true, replies: [] },
    'schedules.json': [],
    'polls.json': { polls: [] },
    'baileys_store.json': {},
    // Fichiers Choco Itachi custom
    'choco.json': { mode: "inconnu", owner: "Boss Alin", theme: "🍫👁️" }
};

if (!fs.existsSync(DATA_DIR))
    fs.mkdirSync(DATA_DIR, { recursive: true });

console.log(`\n🍫 CHOCO ITACHI INCONNU - Reset en cours... 👁️\n`);

for (const [file, value] of Object.entries(defaults)) {
    const filePath = path.join(DATA_DIR, file);
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
    console.log(`✅ Choco Reset: ${file}`);
}

console.log(`\n🔥 CHOCO ITACHI INCONNU PRÊT! By Boss Alin - 224629447488 🍫`);
console.log(`👻 Mode Inconnu: ACTIVÉ | AutoBio: ACTIVÉ | SUDO: Toi\n`);