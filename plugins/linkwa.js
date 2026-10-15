import config from '../config.js';

export default {
    command: 'linkwa',
    aliases: ['grouplink', 'wa', 'groupinvite'],
    category: 'general',
    description: 'Lien du groupe / canal',
    usage: '.linkwa',
    async handler(sock, message, _args, context) {
        const chatId = context?.chatId || message.key.remoteJid;
        const url = config.channelLink || 'https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07';
        await sock.sendMessage(chatId, { text: `🔗 *Lien*: ${url}` }, { quoted: message });
    }
};
