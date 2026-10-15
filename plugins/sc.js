export default {
    command: 'sc',
    aliases: ['sourcecode', 'script'],
    category: 'general',
    description: 'Code source du bot',
    usage: '.sc',
    async handler(sock, message, _args, context) {
        const chatId = context?.chatId || message.key.remoteJid;
        const url = 'https://github.com/amadoumara2026-a11y/CHOCO-ITACHI-INCONNU';
        await sock.sendMessage(chatId, { text: `🔎 *Source Code*\n${url}` }, { quoted: message });
    }
};
