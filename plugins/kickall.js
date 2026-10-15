export default {
    command: 'kickall',
    aliases: [],
    category: 'admin',
    description: 'Expulse tous les membres (danger)',
    usage: '.kickall',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '⚠️ kickall: commande sensible — stub activé.' });
    }
};
