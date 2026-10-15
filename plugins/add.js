export default {
    command: 'add',
    aliases: [],
    category: 'admin',
    description: 'Ajoute un membre au groupe',
    usage: '.add <numéro>',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '➕ Ajout: commande en cours d\'implémentation.' });
    }
};
