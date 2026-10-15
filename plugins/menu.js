import listCommand from './list.js';

export default {
    ...listCommand,
    command: 'menu',
    aliases: ['helpmenu', 'commands', 'h', 'list'],
    category: 'general',
    description: 'Affiche le menu des commandes',
    usage: '.menu [commande]',
    async handler(sock, message, args, context) {
        return listCommand.handler(sock, message, args, context);
    }
};
