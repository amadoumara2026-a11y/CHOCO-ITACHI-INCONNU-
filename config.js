import 'dotenv/config';
const _prefixes = process.env.PREFIXES? process.env.PREFIXES.split(',') : ['.'];
const config = {
    botName: process.env.BOT_NAME || 'CHOCO-ITACHI-INCONNU',
    botOwner: process.env.BOT_OWNER || 'Boss Alin',
    ownerNumber: process.env.OWNER_NUMBER || '224629447488',
    author: process.env.AUTHOR || 'Boss Alin',
    packname: process.env.PACKNAME || 'CHOCO-ITACHI',
    description: 'CHOCO ITACHI INCONNU - Le Uchiha Choco par Boss Alin',
    version: '7.0.0',
    prefixes: _prefixes,
    prefix: _prefixes[0],
    commandMode: process.env.COMMAND_MODE || 'public',
    timeZone: process.env.TIMEZONE || 'Africa/Conakry',

    // 👇 METS TON LIEN ICI APRÈS AVOIR CRÉÉ TA CHAÎNE
    channelLink: process.env.CHANNEL_LINK || 'https://whatsapp.com/channel/TON-LIEN-CHOCO-ICI',
    updateZipUrl: process.env.UPDATE_URL || 'https://github.com/AlinBoss/CHOCO-ITACHI-MD/archive/refs/heads/main.zip',
    ytChannel: process.env.YT_CHANNEL || 'Boss Alin Choco',

    sessionId: process.env.SESSION_ID || '',
    pairingNumber: process.env.PAIRING_NUMBER || '224629447488',
    port: Number(process.env.PORT) || 5000,
    maxStoreMessages: Number(process.env.MAX_STORE_MESSAGES) || 20,
    tempCleanupInterval: Number(process.env.CLEANUP_INTERVAL) || 1 * 60 * 60 * 1000,
    storeWriteInterval: Number(process.env.STORE_WRITE_INTERVAL) || 10000,
    giphyApiKey: process.env.GIPHY_API_KEY || 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
    removeBgKey: process.env.REMOVEBG_KEY || '',
    warnCount: 3,
    APIs: {
        xteam: 'https://api.xteam.xyz',
        dzx: 'https://api.dhamzxploit.my.id',
        lol: 'https://api.lolhuman.xyz',
        violetics: 'https://violetics.pw',
        neoxr: 'https://api.neoxr.my.id',
        zenzapis: 'https://zenzapis.xyz',
        akuari: 'https://api.akuari.my.id',
        akuari2: 'https://apimu.my.id',
        nrtm: 'https://fg-nrtm.ddns.net',
        fgmods: 'https://api-fgmods.ddns.net'
    },
    APIKeys: {
        'https://api.xteam.xyz': 'd90a9e986e18778b',
        'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
        'https://api.neoxr.my.id': process.env.NEOXR_KEY || 'yourkey',
        'https://violetics.pw': 'beta',
        'https://zenzapis.xyz': process.env.ZENZAPIS_KEY || 'yourkey',
        'https://api-fgmods.ddns.net': 'fg-dylux'
    }
};
export default config;
