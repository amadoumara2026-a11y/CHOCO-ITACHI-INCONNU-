export default {
    command: 'trt',
    aliases: ['tr'],
    category: 'general',
    description: 'Raccourci pour la traduction',
    usage: '.trt <texte>',
    async handler(sock, message, args) {
        const chatId = message.key.remoteJid;
        if (!args || args.length === 0) {
            await sock.sendMessage(chatId, { text: 'Usage: .trt <texte>' });
            return;
        }
        await sock.sendMessage(chatId, { text: '🌐 Traduction: commande en cours d\'implémentation. Utilisez .translate.' });
    }
};
