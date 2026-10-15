import config from '../config.js';

export default {
    command: 'contact',
    aliases: ['ownercontact'],
    category: 'general',
    description: 'Contact du propriétaire',
    usage: '.contact',
    async handler(sock, message, _args, context) {
        const chatId = context?.chatId || message.key.remoteJid;
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${config.botOwner}\nTEL;waid=${config.ownerNumber}:${config.ownerNumber}\nEND:VCARD`;
        await sock.sendMessage(chatId, {
            contacts: { displayName: config.botOwner, contacts: [{ vcard }] }
        }, { quoted: message });
    }
};
