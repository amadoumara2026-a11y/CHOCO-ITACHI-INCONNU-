export default {
    command: 'botinfo',
    aliases: [],
    category: 'general',
    description: 'Informations détaillées du bot',
    usage: '.botinfo',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '🤖 BotInfo: commande en cours d\'implémentation.' });
    }
};
