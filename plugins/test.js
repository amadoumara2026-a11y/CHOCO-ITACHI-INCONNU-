export default {
    command: 'test',
    aliases: [],
    category: 'general',
    description: 'Commande de test',
    usage: '.test',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '✅ Test: bot opérationnel.' });
    }
};
