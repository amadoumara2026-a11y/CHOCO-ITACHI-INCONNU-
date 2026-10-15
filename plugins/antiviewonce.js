export default {
    command: 'antiviewonce',
    aliases: [],
    category: 'protection',
    description: 'Gère les messages view-once',
    usage: '.antiviewonce on|off',
    async handler(sock, message, args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: `👁️ AntiViewOnce: commande en cours d\'implémentation (${args && args[0] ? args[0] : 'usage: on|off'})` });
    }
};
