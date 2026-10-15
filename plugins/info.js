import config from '../config.js';

export default {
    command: 'info',
    aliases: ['botinfo', 'about'],
    category: 'general',
    description: 'Informations sur le bot',
    usage: '.info',
    async handler(sock, message, _args, context) {
        const chatId = context?.chatId || message.key.remoteJid;
        const text = [
            `🤖 *${config.botName}*`,
            `📦 Version: ${config.version}`,
            `👑 Owner: ${config.botOwner}`,
            `📞 Number: ${config.ownerNumber}`,
            `🌐 Prefixes: ${config.prefixes.join(', ')}`,
            `🕒 Timezone: ${config.timeZone}`
        ].join('\n');
        await sock.sendMessage(chatId, { text }, { quoted: message });
    }
};
