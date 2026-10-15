export default {
    command: 'help',
    aliases: ['aide'],
    category: 'general',
    description: 'Aide pour les commandes',
    usage: '.help',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '❓ Help: commande en cours d\'implémentation. Essayez .menu.' });
    }
};
