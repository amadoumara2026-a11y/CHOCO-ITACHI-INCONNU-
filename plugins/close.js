export default {
    command: 'close',
    aliases: [],
    category: 'admin',
    description: 'Ferme le groupe (restreint les messages)',
    usage: '.close',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '🔒 Le groupe a été fermé (stub).' });
    }
};
