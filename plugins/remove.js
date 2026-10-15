export default {
    command: 'remove',
    aliases: [],
    category: 'admin',
    description: 'Supprime un membre du groupe',
    usage: '.remove <numéro>',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '➖ Suppression: commande en cours d\'implémentation.' });
    }
};
