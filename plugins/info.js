export default {
    command: 'info',
    aliases: ['botinfo'],
    category: 'general',
    description: 'Informations sur le bot',
    usage: '.info',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: 'ℹ️ Info: commande en cours d\'implémentation. Utilisez .sysinfo pour plus de détails.' });
    }
};
