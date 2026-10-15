export default {
    command: 'gjid',
    aliases: [],
    category: 'general',
    description: 'Récupère l\'ID du groupe (gjid)',
    usage: '.gjid',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: `🔢 Group JID: ${chatId}` });
    }
};
