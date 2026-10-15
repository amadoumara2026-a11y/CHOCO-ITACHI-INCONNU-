export default {
    command: 'contact',
    aliases: ['ownercontact'],
    category: 'general',
    description: 'Contact du propriétaire',
    usage: '.contact',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '📞 Contact: commande en cours d\'implémentation. Voir .owner' });
    }
};
