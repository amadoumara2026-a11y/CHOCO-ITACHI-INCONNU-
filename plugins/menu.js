export default {
    command: 'menu',
    aliases: ['helpmenu'],
    category: 'general',
    description: 'Affiche le menu des commandes',
    usage: '.menu',
    async handler(sock, message, _args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: '📜 Menu: commande en cours d\'implémentation. Utilisez .list ou .smartmenu en attendant.' });
    }
};
