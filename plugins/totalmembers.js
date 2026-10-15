export default {
    command: 'totalmembers',
    aliases: ['memberscount'],
    category: 'admin',
    description: 'Compte le nombre de membres',
    usage: '.totalmembers',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '👥 Total members: commande en cours d\'implémentation.' });
    }
};
