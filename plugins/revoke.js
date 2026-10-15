export default {
    command: 'revoke',
    aliases: [],
    category: 'admin',
    description: 'Révoque un lien ou permission',
    usage: '.revoke',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '🔁 Revoke: commande en cours d\'implémentation.' });
    }
};
