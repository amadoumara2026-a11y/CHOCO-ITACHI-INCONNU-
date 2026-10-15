export default {
    command: 'antileave',
    aliases: [],
    category: 'protection',
    description: 'Empêche les départs automatiques',
    usage: '.antileave on|off',
    async handler(sock, message, args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: `🚪 AntiLeave: commande en cours d\'implémentation (${args && args[0] ? args[0] : 'usage: on|off'})` });
    }
};
