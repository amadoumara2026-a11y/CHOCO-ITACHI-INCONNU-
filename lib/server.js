import express from 'express';
import fs, { existsSync } from 'fs';
import pino from 'pino';
import QRCode from 'qrcode';
import { fetchLatestBaileysVersion, makeWASocket, useMultiFileAuthState, Browsers, delay } from '@whiskeysockets/baileys';

const app = express();
export const PORT = process.env.PORT || 10000;
let lastQR = null;
let isConnected = false;

app.get('/', async (req, res) => {
  let qrImage = '';
  if (lastQR && !isConnected) { try { qrImage = await QRCode.toDataURL(lastQR); } catch {} }
  res.send(`<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>CHOCO ITACHI</title><style>body{background:#0a0a0a;color:#fff;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:monospace;padding:20px}.box{width:100%;max-width:420px;background:#141414;border:1px solid #222;border-radius:16px;padding:24px;text-align:center}h1{font-size:26px}h1 span{color:#ff3b3b}.qr{background:#fff;padding:12px;border-radius:12px;margin:16px auto;display:${qrImage?'block':'none'}}.qr img{width:100%}</style><script>${qrImage?'setTimeout(()=>location.reload(),25000)':''}</script></head><body><div class="box"><h1>CHOCO <span>ITACHI</span> 👁️</h1><p style="color:#888;font-size:11px">${isConnected?'✅ CONNECTÉ':'V8 QR MODE'}</p>${isConnected?`<div style="background:#0f2a0f;border:1px solid #4ade80;padding:20px;border-radius:12px;margin:20px 0"><h2 style="color:#4ade80">BOT CONNECTÉ! 🍫</h2><p>Ton bot est en ligne!</p></div>`:qrImage?`<div class="qr"><img src="${qrImage}"></div><p style="color:#4ade80">Scanne maintenant! 25s</p><p style="color:#aaa;font-size:11px">WhatsApp > Appareils liés > Lier un appareil</p><p style="color:#ffaa00;font-size:10px;margin-top:10px">Ne ferme pas cette page!</p>`: `<p style="color:#ffaa00;margin:20px 0">⏳ Génération QR... Attends 15s et actualise</p>`}</div></body></html>`);
});

async function startBot(){
  try{
    const {version} = await fetchLatestBaileysVersion();
    if(!existsSync('./session')) fs.mkdirSync('./session',{recursive:true});
    const {state, saveCreds} = await useMultiFileAuthState('./session');
    const sock = makeWASocket({version, logger:pino({level:'silent'}), browser:Browsers.macOS('Desktop'), auth:state, printQRInTerminal:false, connectTimeoutMs: 60000});
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async (u)=>{
      if(u.qr){ lastQR=u.qr; isConnected=false; console.log('[QR] Nouveau QR généré'); }
      if(u.connection==='open'){ lastQR=null; isConnected=true; console.log('[CHOCO] ✅ CONNECTÉ! Session sauvegardée!'); }
      if(u.connection==='close'){ 
        const shouldReconnect = u.lastDisconnect?.error?.output?.statusCode !== 401;
        console.log('[CHOCO] Connexion fermée, reconnexion:', shouldReconnect);
        if(shouldReconnect){ setTimeout(startBot, 3000); } else { lastQR=null; isConnected=false; }
      }
    });
  }catch(e){ console.log('Erreur:', e.message); setTimeout(startBot, 5000); }
}
startBot();
export const server=app;