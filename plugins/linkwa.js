export default {
    command: 'linkwa',
    aliases: ['grouplink'],
    category: 'general',
    description: 'Récupère le lien d\'invitation du groupe',
    usage: '.linkwa',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '🔗 LinkWA: utilisez .invitelink si disponible.' });
    }
};
