export default {
    command: 'repo',
    aliases: ['github', 'githubrepo', 'source'],
    category: 'general',
    description: 'Lien du dépôt GitHub',
    usage: '.repo',
    async handler(sock, message, _args, context) {
        const chatId = context?.chatId || message.key.remoteJid;
        const url = 'https://github.com/amadoumara2026-a11y/CHOCO-ITACHI-INCONNU';
        await sock.sendMessage(chatId, { text: `📦 *Dépôt GitHub*\n${url}` }, { quoted: message });
    }
};
