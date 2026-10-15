export default {
    command: 'approve',
    aliases: [],
    category: 'admin',
    description: 'Approuve une requête',
    usage: '.approve',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '✅ Approve: commande en cours d\'implémentation.' });
    }
};
