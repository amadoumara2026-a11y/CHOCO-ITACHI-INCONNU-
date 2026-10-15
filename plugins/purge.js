export default {
    command: 'purge',
    aliases: [],
    category: 'admin',
    description: 'Purge les messages',
    usage: '.purge',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '🧹 Purge: commande en cours d\'implémentation.' });
    }
};
