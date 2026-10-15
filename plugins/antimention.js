export default {
    command: 'antimention',
    aliases: [],
    category: 'protection',
    description: 'Empêche les mentions excessives',
    usage: '.antimention on|off',
    async handler(sock, message, args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: `@mentions: commande en cours d\'implémentation (${args && args[0] ? args[0] : 'usage: on|off'})` });
    }
};
