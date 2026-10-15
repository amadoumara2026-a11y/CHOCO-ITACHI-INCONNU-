export default {
    command: 'test',
    aliases: ['pingtest'],
    category: 'general',
    description: 'Vérifie si le bot répond',
    usage: '.test',
    async handler(sock, message, _args, context) {
        const chatId = context?.chatId || message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '✅ Test OK — le bot répond.' }, { quoted: message });
    }
};
