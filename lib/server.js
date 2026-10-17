import express from 'express';
import fs, { existsSync } from 'fs';
import pino from 'pino';
import { fetchLatestBaileysVersion, makeWASocket, useMultiFileAuthState, Browsers, delay } from '@whiskeysockets/baileys';

const app = express();
export const PORT = process.env.PORT || 10000;
let currentSock = null;
let lastCode = null;
let lastCodeTime = 0;

app.get('/', (req, res) => {
  const codeDisplay = lastCode && (Date.now() - lastCodeTime < 120000) ? lastCode : '';
  res.send(`
  <html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>CHOCO ITACHI CODE</title>
  <style>body{background:#0a0a0a;color:#fff;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:monospace;padding:20px}
  .box{width:100%;max-width:420px;background:#141414;border:1px solid #222;border-radius:16px;padding:24px;text-align:center}
  h1{font-size:26px}h1 span{color:#ff3b3b}button{width:100%;background:#ff1a1a;color:#fff;border:none;padding:14px;border-radius:10px;font-weight:bold;cursor:pointer;margin:10px 0}
  input{width:100%;background:#1f1f1f;border:1px solid #333;color:#fff;padding:12px;border-radius:10px;margin:10px 0}
  .codebox{border:2px solid #4ade80;padding:16px;border-radius:12px;margin:16px 0;background:#0f1f0f}
  .codetext{font-size:32px;font-weight:bold;letter-spacing:6px;color:#4ade80}</style></head>
  <body><div class="box">
  <h1>CHOCO <span>ITACHI</span> 👁️</h1><p style="color:#888;font-size:11px">V9 CODE MODE - 224</p>
  ${codeDisplay ? `<div class="codebox"><div class="codetext">${codeDisplay}</div><p style="color:#4ade80;font-size:12px;margin-top:8px">Code valide 2 minutes!</p><p style="color:#aaa;font-size:11px">WhatsApp > Appareils liés > Lier avec numéro de téléphone</p></div>` : `<p style="color:#ffaa00;margin:20px 0">Pas de code actif</p>`}
  <input id="num" value="224629447488" placeholder="224..."><button onclick="getCode()">⚡ OBTENIR CODE</button>
  <div id="err" style="display:none;background:#2a1a1a;color:#ff6b6b;padding:10px;border-radius:8px;margin-top:10px;font-size:12px"></div>
  <p style="color:#666;font-size:10px;margin-top:20px">1. Clique OBTENIR CODE<br>2. Va sur WhatsApp > Appareils liés > Lier un appareil > Lier avec numéro de téléphone<br>3. Entre le code en 60s</p>
  </div>
  <script>
  async function getCode(){
    const btn=document.querySelector('button'); btn.innerText='⏳ GÉNÉRATION...'; btn.disabled=true;
    const n=document.getElementById('num').value.trim(); const e=document.getElementById('err');
    try{ const r=await fetch('/code?number='+encodeURIComponent(n)); const d=await r.json();
      if(d.code){ location.reload(); } else { e.style.display='block'; e.innerText=d.error||'Erreur'; btn.innerText='⚡ OBTENIR CODE'; btn.disabled=false; }
    }catch(err){ e.style.display='block'; e.innerText=err.message; btn.innerText='⚡ OBTENIR CODE'; btn.disabled=false; }
  }
  </script></body></html>`);
});

app.get('/code', async (req, res) => {
  let num = req.query.number?.replace(/[^0-9]/g,'');
  if(!num) return res.json({error:'Numéro vide'});
  try{
    if(currentSock){ try{ currentSock.ws.close(); }catch{} }
    if(!existsSync('./session')) fs.mkdirSync('./session',{recursive:true});
    const {version} = await fetchLatestBaileysVersion();
    const {state, saveCreds} = await useMultiFileAuthState('./session');
    const sock = makeWASocket({version, logger:pino({level:'silent'}), browser:Browsers.ubuntu('Chrome'), auth:state, printQRInTerminal:false, connectTimeoutMs: 60000});
    currentSock = sock;
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (u)=>{
      if(u.connection==='open'){ console.log('[CHOCO] ✅ CONNECTÉ AVEC CODE!'); lastCode=null; currentSock=null; }
      if(u.connection==='close'){ console.log('[CHOCO] Fermé'); currentSock=null; }
    });
    await delay(4000);
    let code = await sock.requestPairingCode(num);
    code = code?.match(/.{1,4}/g)?.join('-') || code;
    lastCode = code; lastCodeTime = Date.now();
    console.log('[CODE]', code, 'pour', num);
    res.json({code});
    setTimeout(()=>{ if(currentSock===sock){ try{sock.ws.close()}catch{}; currentSock=null; console.log('[CODE] Expiré'); } }, 120000);
  }catch(err){ console.error(err); res.json({error: 'Erreur: '+err.message+' - Attends 2 min et réessaye'}); }
});

export const server = app;