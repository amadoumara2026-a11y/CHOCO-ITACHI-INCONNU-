export default {
    command: 'gjid',
    aliases: ['groupjid', 'jid'],
    category: 'general',
    description: 'Affiche l\'ID du groupe / du chat',
    usage: '.gjid',
    async handler(sock, message, _args, context) {
        const chatId = context?.chatId || message.key.remoteJid;
        await sock.sendMessage(chatId, { text: `🆔 *JID*: ${chatId}` }, { quoted: message });
    }
};
