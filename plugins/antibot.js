export default {
    command: 'antibot',
    aliases: [],
    category: 'protection',
    description: 'Protection contre les bots',
    usage: '.antibot on|off',
    async handler(sock, message, args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: `🤖 AntiBot: commande en cours d\'implémentation (${args && args[0] ? args[0] : 'usage: on|off'})` });
    }
};
