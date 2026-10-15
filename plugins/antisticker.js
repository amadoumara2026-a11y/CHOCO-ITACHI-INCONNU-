export default {
    command: 'antisticker',
    aliases: [],
    category: 'protection',
    description: 'Bloque l\'envoi de stickers',
    usage: '.antisticker on|off',
    async handler(sock, message, args) {
        const chatId = message.key.remoteJid;
        await sock.sendMessage(chatId, { text: `🖼️ AntiSticker: commande en cours d\'implémentation (${args && args[0] ? args[0] : 'usage: on|off'})` });
    }
};
