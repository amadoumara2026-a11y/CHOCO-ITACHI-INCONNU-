import config from '../config.js';

export default {
    command: 'botinfo',
    aliases: ['about'],
    category: 'general',
    description: 'Informations détaillées du bot',
    usage: '.botinfo',
    async handler(sock, message, _args, context) {
        const chatId = context?.chatId || message.key.remoteJid;
        const text = [
            `🤖 *${config.botName}*`,
            `📦 Version: ${config.version}`,
            `👑 Owner: ${config.botOwner}`,
            `📞 Number: ${config.ownerNumber}`,
            `🌐 Prefixes: ${config.prefixes.join(', ')}`,
            `🕒 Timezone: ${config.timeZone}`,
            `📄 Description: ${config.description}`
        ].join('\n');
        await sock.sendMessage(chatId, { text }, { quoted: message });
    }
};
