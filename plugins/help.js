import listCommand from './list.js';

export default {
    ...listCommand,
    command: 'help',
    aliases: ['aide', 'menu'],
    category: 'general',
    description: 'Aide du bot et liste des commandes',
    usage: '.help [commande]',
    async handler(sock, message, args, context) {
        return listCommand.handler(sock, message, args, context);
    }
};
