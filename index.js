import 'dotenv/config';
import fs, { existsSync, mkdirSync, rmSync } from 'fs';
import path, { dirname } from 'path';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { parsePhoneNumber as PhoneNumber } from 'awesome-phonenumber';
import readline from 'readline';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers, jidDecode, jidNormalizedUser, makeCacheableSignalKeyStore, delay } from '@whiskeysockets/baileys';
import NodeCache from 'node-cache';
import pino from 'pino';
import config from './config.js';
import store from './lib/lightweight_store.js';
import SaveCreds from './lib/session.js';
import { server, PORT } from './lib/server.js';
import { printLog } from './lib/print.js';
import { writeErrorLog } from './lib/logger.js';
import { handleMessages, handleGroupParticipantUpdate, handleStatus, handleCall } from './lib/messageHandler.js';
import commandHandler from './lib/commandHandler.js';

store.readFromFile();
setInterval(() => store.writeToFile(), config.storeWriteInterval || 10000);
setInterval(() => {
    if (global.gc) {
        global.gc();
        console.log('🧹 Choco GC nettoyé');
    }
}, 60000);
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024;
    if (used > 400) {
        printLog('warning', 'RAM trop haute (>400MB), redémarrage Choco...');
        process.exit(1);
    }
}, 30000);

// CHOCO ITACHI NUMÉRO PAR DÉFAUT 🇬🇳
const phoneNumber = config.pairingNumber || config.ownerNumber || "224629447488";

const DATA_DEFAULTS = {
    'owner.json': ["224629447488"],
    'banned.json': [],
    'premium.json': ["224629447488"],
    'warnings.json': {},
    'notes.json': {},
    'autoAi.json': {},
    'messageCount.json': { isPublic: true, messageCount: {} },
    'userGroupData.json': { users: [], groups: [], antilink: {}, antibadword: {}, warnings: {}, sudo: ["224629447488"], welcome: {}, goodbye: {}, chatbot: {}, autoReaction: true },
    'autoStatus.json': { enabled: true },
    'autoread.json': { enabled: true },
    'autotyping.json': { enabled: true },
    'pmblocker.json': { enabled: false },
    'anticall.json': { enabled: true },
    'stealthMode.json': { enabled: true },
    'autoBio.json': { enabled: true, customBio: "🍫 CHOCO ITACHI INCONNU 👁️ | By Boss Alin" },
    'autoReaction.json': { enabled: true },
    'antidelete.json': { enabled: true },
    'antilink.json': {},
    'antibadword.json': {},
    'choco.json': { mode: "inconnu", owner: "Boss Alin", theme: "🍫👁️" },
};

fs.mkdirSync('./data', { recursive: true });
for (const [file, def] of Object.entries(DATA_DEFAULTS)) {
    const fp = `./data/${file}`;
    if (!fs.existsSync(fp))
        fs.writeFileSync(fp, JSON.stringify(def, null, 2));
}

let owner = [];
try {
    owner = JSON.parse(fs.readFileSync('./data/owner.json', 'utf-8'));
}
catch {
    owner = ["224629447488"];
}

// CHOCO ITACHI BRANDING 🍫👁️
global.botname = config.botName || "CHOCO-ITACHI-INCONNU";
global.themeemoji = "🍫";

const pairingCode =!process.argv.includes("--qr-code");
const useMobile = process.argv.includes("--mobile");
let rl = null;
let rlClosed = false;
if (process.stdin.isTTY &&!config.pairingNumber) {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('close', () => { rlClosed = true; });
}
const question = (text) => {
    if (rl &&!rlClosed) {
        return new Promise((resolve) => rl.question(text, resolve));
    }
    else {
        return Promise.resolve(config.ownerNumber || phoneNumber);
    }
};
process.on('exit', () => {
    if (rl &&!rlClosed)
        rl.close();
});
process.on('SIGINT', () => {
    if (rl &&!rlClosed)
        rl.close();
    process.exit(0);
});
function ensureSessionDirectory() {
    const sessionPath = path.join(__dirname, 'session');
    if (!existsSync(sessionPath)) {
        mkdirSync(sessionPath, { recursive: true });
    }
    return sessionPath;
}
function hasValidSession() {
    try {
        const credsPath = path.join(__dirname, 'session', 'creds.json');
        if (!existsSync(credsPath))
            return false;
        const fileContent = fs.readFileSync(credsPath, 'utf8');
        if (!fileContent || fileContent.trim().length === 0) {
            printLog('warning', 'creds.json vide');
            return false;
        }
        try {
            const creds = JSON.parse(fileContent);
            if (!creds.noiseKey ||!creds.signedIdentityKey ||!creds.signedPreKey) {
                printLog('warning', 'creds.json incomplet');
                return false;
            }
            if (creds.registered === false) {
                printLog('warning', 'Session non enregistrée. Nettoyage...');
                try {
                    rmSync(path.join(__dirname, 'session'), { recursive: true, force: true });
                }
                catch (_e) { /* ignore */ }
                return false;
            }
            printLog('success', 'Session Choco valide trouvée 🍫');
            return true;
        }
        catch (_parseError) {
            printLog('warning', 'creds.json invalide');
            return false;
        }
    }
    catch (error) {
        printLog('error', `Erreur session: ${error.message}`);
        return false;
    }
}
async function initializeSession() {
    ensureSessionDirectory();
    const txt = config.sessionId;
    if (!txt) {
        if (hasValidSession()) {
            printLog('success', 'Session existante Choco utilisée');
            return true;
        }
        return false;
    }
    if (hasValidSession())
        return true;
    try {
        await SaveCreds(txt);
        await delay(2000);
        if (hasValidSession()) {
            printLog('success', 'Session Choco vérifiée');
            await delay(1000);
            return true;
        }
        else {
            printLog('error', 'Session invalide après téléchargement');
            return false;
        }
    }
    catch (error) {
        printLog('error', `Erreur téléchargement session: ${error.message}`);
        return false;
    }
}
server.listen(PORT, () => {
    printLog('success', `CHOCO ITACHI Serveur sur port ${PORT} 🍫`);
});
async function startChocoItachi() {
    try {
        const { version } = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(1000);
        const { state, saveCreds } = await useMultiFileAuthState(`./session`);
        const _saveCreds = async () => {
            ensureSessionDirectory();
            await saveCreds();
        };
        const msgRetryCounterCache = new NodeCache();
        const ghostMode = await store.getSetting('global', 'stealthMode');
        const isGhostActive = ghostMode && ghostMode.enabled;
        const ChocoItachi = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            browser: Browsers.macOS('Chrome'),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect:!isGhostActive,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            getMessage: async (key) => {
                const jid = jidNormalizedUser(key.remoteJid);
                const msg = await store.loadMessage(jid, key.id);
                return msg?.message || "";
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        });
        ChocoItachi.store = store;
        const originalSendPresenceUpdate = ChocoItachi.sendPresenceUpdate;
        const originalReadMessages = ChocoItachi.readMessages;
        const originalSendReceipt = ChocoItachi.sendReceipt;
        ChocoItachi.sendPresenceUpdate = async function (...args) {
            const ghostMode = await store.getSetting('global', 'stealthMode');
            if (ghostMode && ghostMode.enabled) {
                printLog('info', '👻 Présence bloquée (Mode Inconnu)');
                return;
            }
            return originalSendPresenceUpdate.apply(this, args);
        };
        ChocoItachi.readMessages = async function (...args) {
            const ghostMode = await store.getSetting('global', 'stealthMode');
            if (ghostMode && ghostMode.enabled)
                return;
            return originalReadMessages.apply(this, args);
        };
        if (originalSendReceipt) {
            ChocoItachi.sendReceipt = async function (...args) {
                const ghostMode = await store.getSetting('global', 'stealthMode');
                if (ghostMode && ghostMode.enabled)
                    return;
                return originalSendReceipt.apply(this, args);
            };
        }
        const originalQuery = ChocoItachi.query;
        ChocoItachi.query = async function (node,...args) {
            const ghostMode = await store.getSetting('global', 'stealthMode');
            if (ghostMode && ghostMode.enabled) {
                if (node && node.tag === 'receipt')
                    return;
                if (node && node.attrs && (node.attrs.type === 'read' || node.attrs.type === 'read-self'))
                    return;
            }
            return originalQuery.apply(this, [node,...args]);
        };
        ChocoItachi.isGhostMode = async () => {
            const ghostMode = await store.getSetting('global', 'stealthMode');
            return ghostMode && ghostMode.enabled;
        };
        ChocoItachi.ev.on('creds.update', _saveCreds);
        store.bind(ChocoItachi.ev);
        ChocoItachi.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                if (!mek.message)
                    return;
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage')
                   ? mek.message.ephemeralMessage.message
                    : mek.message;
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    await handleStatus(ChocoItachi, chatUpdate);
                    return;
                }
                if (!ChocoItachi.public &&!mek.key.fromMe && chatUpdate.type === 'notify') {
                    const isGroup = mek.key?.remoteJid?.endsWith('@g.us');
                    if (!isGroup)
                        return;
                }
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16)
                    return;
                if (ChocoItachi?.msgRetryCounterCache) {
                    ChocoItachi.msgRetryCounterCache.clear();
                }
                try {
                    await handleMessages(ChocoItachi, chatUpdate);
                }
                catch (err) {
                    printLog('error', `Erreur handleMessages: ${err.message}`);
                    if (mek.key && mek.key.remoteJid) {
                        await ChocoItachi.sendMessage(mek.key.remoteJid, {
                            text: '❌ Erreur Choco Itachi, réessaie Boss!',
                        }).catch(console.error);
                    }
                }
            }
            catch (err) {
                printLog('error', `Erreur messages.upsert: ${err.message}`);
            }
        });
        ChocoItachi.decodeJid = (jid) => {
            if (!jid)
                return jid;
            if (/:\d+@/gi.test(jid)) {
                const decode = jidDecode(jid) || {};
                return decode.user && decode.server && `${decode.user }@${ decode.server}` || jid;
            }
            else
                return jid;
        };
        ChocoItachi.ev.on('contacts.update', (update) => {
            for (const contact of update) {
                const id = ChocoItachi.decodeJid(contact.id);
                if (store && store.contacts)
                    store.contacts[id] = { id, name: contact.notify };
            }
        });
        ChocoItachi.getName = (jid, withoutContact = false) => {
            const id = ChocoItachi.decodeJid(jid);
            withoutContact = ChocoItachi.withoutContact || withoutContact;
            let v;
            if (id.endsWith("@g.us"))
                return new Promise(async (resolve) => {
                    v = store.contacts[id] || {};
                    if (!(v.name || v.subject))
                        v = ChocoItachi.groupMetadata(id) || {};
                    resolve(v.name || v.subject || PhoneNumber(`+${ id.replace('@s.whatsapp.net', '')}`).number?.international);
                });
            else
                v = id === '0@s.whatsapp.net'? {
                    id,
                    name: 'WhatsApp'
                } : id === ChocoItachi.decodeJid(ChocoItachi.user.id)?
                    ChocoItachi.user :
                    (store.contacts[id] || {});
            return (withoutContact? '' : v.name) || v.subject || v.verifiedName || PhoneNumber(`+${ jid.replace('@s.whatsapp.net', '')}`).number?.international;
        };
        ChocoItachi.public = true;
        ChocoItachi.serializeM = (m) => smsg(ChocoItachi, m, store);
        const isRegistered = state.creds?.registered === true;
        if (pairingCode &&!isRegistered) {
            if (useMobile)
                throw new Error('Cannot use pairing code with mobile api');
            let phoneNumberInput;
            if (config.pairingNumber) {
                phoneNumberInput = config.pairingNumber;
            }
            else if (process.env.PAIRING_NUMBER) {
                phoneNumberInput = process.env.PAIRING_NUMBER;
            }
            else if (rl &&!rlClosed) {
                phoneNumberInput = await question(chalk.bgBlack(chalk.greenBright(`Mets ton numéro Choco 👁️\nFormat: 224629447488 : `)));
            }
            else {
                phoneNumberInput = phoneNumber;
                printLog('info', `Numéro Choco par défaut: ${phoneNumberInput}`);
            }
            phoneNumberInput = phoneNumberInput.replace(/[^0-9]/g, '');
            const pn = PhoneNumber(`+${ phoneNumberInput}`);
            if (!pn.valid) {
                printLog('error', 'Numéro invalide Boss');
                if (rl &&!rlClosed)
                    rl.close();
                process.exit(1);
            }
            const doPairing = async (num, attempt = 1) => {
                try {
                    let code = await ChocoItachi.requestPairingCode(num);
                    code = code?.match(/.{1,4}/g)?.join("-") || code;
                    console.log(chalk.black(chalk.bgGreen(`CODE PAIRING CHOCO ITACHI 👁️ : `)), chalk.black(chalk.white(code)));
                    printLog('success', `Code Choco généré: ${code}`);
                    if (rl &&!rlClosed) {
                        rl.close();
                        rl = null;
                    }
                }
                catch (error) {
                    if (attempt < 3) {
                        try {
                            rmSync('./session', { recursive: true, force: true });
                        }
                        catch (_e) { /* ignore */ }
                        await delay(3000);
                        startChocoItachi();
                    }
                    else {
                        printLog('error', '3 tentatives échouées. Relance Boss!');
                    }
                }
            };
            setTimeout(() => doPairing(phoneNumberInput), 3000);
        }
        else if (isRegistered) {
            if (rl &&!rlClosed) {
                rl.close();
                rl = null;
            }
        }
        else {
            printLog('warning', 'Attente connexion Choco...');
            if (rl &&!rlClosed) {
                rl.close();
                rl = null;
            }
        }
        ChocoItachi.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect, qr } = s;
            if (qr) {
                if (!pairingCode) {
                    try {
                        console.log(await QRCode.toString(qr, { type: 'terminal', small: true }));
                    }
                    catch (_e) {
                        console.log('QR:', qr);
                    }
                }
            }
            if (connection === "open") {
                printLog('success', 'CHOCO ITACHI CONNECTÉ! 🍫👁️');
                try {
                    const setbioModule = await import('./plugins/setbio.js');
                    const startAutoBio = setbioModule.startAutoBio || setbioModule.default?.startAutoBio;
                    if (typeof startAutoBio === 'function')
                        startAutoBio(ChocoItachi);
                }
                catch (e) {
                    printLog('error', `Bio auto échoué: ${e.message}`);
                }
                const ghostMode = await store.getSetting('global', 'stealthMode');
                if (ghostMode && ghostMode.enabled) {
                    printLog('info', '👻 MODE INCONNU ACTIF - Boss Alin invisible!');
                }
                printLog('success', `Connecté => ${ JSON.stringify(ChocoItachi.user, null, 2)}`);
                try {
                    const botNumber = `${ChocoItachi.user.id.split(':')[0] }@s.whatsapp.net`;
                    const ghostStatus = (ghostMode && ghostMode.enabled)? '\n👻 Mode Inconnu: ACTIF' : '';
                    await ChocoItachi.sendMessage(botNumber, {
                        text: `🍫 CHOCO ITACHI INCONNU CONNECTÉ! 👁️\n\n👑 Boss: Alin\n📱 Num: 224629447488\n⏰ Heure: ${new Date().toLocaleString()}\n✅ Statut: En ligne!${ghostStatus}\n\n🔥 Merci d'utiliser CHOCO ITACHI MD`,
                    });
                }
                catch (error) {
                    printLog('error', `Échec message connexion: ${error.message}`);
                }
                await delay(1999);
                try {
                    owner = JSON.parse(fs.readFileSync('./data/owner.json', 'utf-8'));
                }
                catch (_e) { }
                printLog('info', `[ ${config.botName || 'CHOCO-ITACHI-INCONNU'} ]`);
                printLog('info', `WA NUMBER : ${owner[0] || config.ownerNumber || '224629447488'}`);
                printLog('success', `CHOCO ITACHI CONNECTÉ!`);
                printLog('info', `Plugins : ${commandHandler.commands.size}`);
                printLog('info', `Prefixes : ${config.prefixes.join(', ')}`);
                printLog('store', `Backend : ${store.getStats().backend}`);
                console.log(chalk.hex('#8B4513').bold(`\n🍫 CHOCO ITACHI INCONNU EST PRÊT! By Boss Alin 👁️\n`));
            }
            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = statusCode!== DisconnectReason.loggedOut && statusCode!== 401;
                if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                    try {
                        rmSync('./session', { recursive: true, force: true });
                    }
                    catch (_e) { /* ignore */ }
                    await delay(3000);
                    startChocoItachi();
                    return;
                }
                if (shouldReconnect) {
                    printLog('connection', 'Reconnexion Choco dans 5s...');
                    await delay(5000);
                    startChocoItachi();
                }
            }
        });
        ChocoItachi.ev.on('call', async (calls) => {
            await handleCall(ChocoItachi, calls);
        });
        ChocoItachi.ev.on('group-participants.update', async (update) => {
            await handleGroupParticipantUpdate(ChocoItachi, update);
        });
        ChocoItachi.ev.on('status.update', async (status) => {
            await handleStatus(ChocoItachi, status);
        });
        ChocoItachi.ev.on('messages.reaction', async (reaction) => {
            await handleStatus(ChocoItachi, reaction);
        });
        return ChocoItachi;
    }
    catch (error) {
        printLog('error', `Erreur Choco: ${error.message}`);
        if (rl &&!rlClosed) {
            rl.close();
            rl = null;
        }
        await delay(5000);
        startChocoItachi();
    }
}
async function main() {
    await compileAll();
    await commandHandler.loadCommands();
    printLog('info', 'Démarrage CHOCO ITACHI INCONNU... 🍫👁️');
    await initializeSession();
    await delay(3000);
    startChocoItachi().catch((error) => {
        printLog('error', `Erreur fatale: ${error.message}`);
        if (rl &&!rlClosed)
            rl.close();
        process.exit(1);
    });
}
main();
const sessionDir = path.join(process.cwd(), 'session');
setInterval(() => {
    if (!fs.existsSync(sessionDir))
        return;
    fs.readdir(sessionDir, (err, files) => {
        if (err)
            return;
        for (const file of files) {
            if (file === 'creds.json')
                continue;
            if (file.startsWith('app-state-sync-key-'))
                continue;
            fs.unlink(path.join(sessionDir, file), () => { });
        }
    });
}, 3 * 60 * 1000);
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp))
    fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err)
            return;
        for (const file of files) {
            const filePath = path.join(customTemp, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
                    fs.unlink(filePath, () => { });
                }
            });
        }
    });
}, 1 * 60 * 60 * 1000);
const folders = [
    path.join(__dirname, './lib'),
    path.join(__dirname, './plugins')
];
folders.forEach(folder => {
    if (!fs.existsSync(folder))
        return;
    fs.readdirSync(folder)
       .filter(file => file.endsWith('.js'))
       .forEach(file => {
        const filePath = path.join(folder, file);
        try {
            const code = fs.readFileSync(filePath, 'utf-8');
            const err = syntaxerror(code, file, {
                sourceType: 'module',
                allowAwaitOutsideFunction: true
            });
            if (err) {
                console.error(chalk.red(`❌ Erreur syntaxe ${filePath}:\n${err}`));
            }
        }
        catch (e) {
            console.error(chalk.yellow(`⚠️ Lecture impossible ${filePath}:\n${e}`));
        }
    });
});
process.on('uncaughtException', (err) => {
    printLog('error', `Exception: ${err.message}`);
    console.error(err.stack);
    writeErrorLog({
        type: 'uncaughtException',
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
});
process.on('unhandledRejection', (err) => {
    printLog('error', `Rejection: ${err.message}`);
    console.error(err.stack);
    writeErrorLog({
        type: 'unhandledRejection',
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
});
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        printLog('error', `Port localhost:${PORT} occupé`);
        writeErrorLog({
            type: 'serverError',
            error: `Port localhost:${PORT} occupé`,
            timestamp: new Date().toISOString()
        });
        server.close();
    }
    else {
        printLog('error', `Erreur serveur: ${error.message}`);
        writeErrorLog({
            type: 'serverError',
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }
});