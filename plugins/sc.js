export default {
    command: 'sc',
    aliases: [],
    category: 'general',
    description: 'Source / script',
    usage: '.sc',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '🔎 Source: utilisez .source ou .repo pour voir le dépôt.' });
    }
};
