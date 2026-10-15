export default {
    command: 'open',
    aliases: [],
    category: 'admin',
    description: 'Ouvre le groupe (autorise les messages)',
    usage: '.open',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '🔓 Le groupe a été ouvert (stub).' });
    }
};
