export default {
    command: 'repo',
    aliases: ['githubrepo'],
    category: 'general',
    description: 'Lien du dépôt GitHub',
    usage: '.repo',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '📦 Dépôt: https://github.com/amadoumara2026-a11y/CHOCO-ITACHI-INCONNU' });
    }
};
