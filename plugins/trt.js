import translateCommand from './translate.js';

export default {
    ...translateCommand,
    command: 'trt',
    aliases: ['translate', 'tr'],
    category: 'tools',
    description: 'Traduction rapide du texte',
    usage: '.trt <texte> <langue> ou réponse à un message avec .trt <langue>',
    async handler(sock, message, args, context) {
        return translateCommand.handler(sock, message, args, context);
    }
};
