import express from 'express';
import fs from 'fs';
import pino from 'pino';
import { fetchLatestBaileysVersion, makeWASocket, useMultiFileAuthState, Browsers, delay } from '@whiskeysockets/baileys';

const app = express();
export const PORT = process.env.PORT || 10000;
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>CHOCO ITACHI INCONNU</title><style>*{margin:0;padding:0;box-sizing:border-box;font-family:monospace}body{background:#0a0a0a;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}.container{width:100%;max-width:450px;background:#141414;border:1px solid #222;border-radius:16px;padding:28px}.badge{display:inline-flex;align-items:center;gap:8px;background:#1a2e1a;color:#4ade80;border:1px solid #2a5a2a;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:bold;margin-bottom:20px}.badge span{width:8px;height:8px;background:#4ade80;border-radius:50%}h1{text-align:center;font-size:28px;letter-spacing:2px;margin-bottom:6px}h1 span{color:#ff3b3b}.subtitle{text-align:center;color:#888;font-size:13px;margin-bottom:8px}.version{text-align:center;color:#555;font-size:12px;margin-bottom:24px}.input-box{position:relative;margin-bottom:16px}.input-box input{width:100%;background:#1f1f1f;border:1px solid #333;color:#fff;padding:16px 16px 16px 50px;border-radius:12px;font-size:16px;outline:none}.btn{width:100%;background:linear-gradient(90deg,#ff1a1a,#ff3b3b);border:none;color:#fff;padding:16px;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer}.code-box{margin-top:20px;background:#0f1f0f;border:1px dashed #2a5a2a;border-radius:12px;padding:20px;text-align:center;display:none}.code-box.show{display:block}.code{font-size:32px;font-weight:bold;letter-spacing:6px;color:#fff;margin:10px 0}.error{margin-top:16px;background:#2a1a1a;border:1px solid #5a2a2a;color:#ff6b6b;padding:12px;border-radius:8px;font-size:13px;display:none;text-align:center}.footer{text-align:center;margin-top:24px;color:#444;font-size:11px}</style></head><body><div class="container"><div style="text-align:center"><div class="badge"><span></span> SYSTEM ONLINE</div></div><h1>CHOCO <span>ITACHI</span></h1><div class="subtitle">INCONNU 👁️</div><div class="subtitle">Mode Inconnu - Par Boss Alin</div><div class="version">VERSION 7.0.0 | AUTHOR Boss Alin</div><div style="color:#aaa;font-size:13px;margin-bottom:10px;font-weight:bold">📱 PAIR TON NUMÉRO</div><div class="input-box"><input id="number" type="text" placeholder="224629447488" value="224629447488"></div><button class="btn" id="btn" onclick="getCode()">⚡ OBTENIR CODE PAIRING 👁️</button><div class="error" id="error"></div><div class="code-box" id="codeBox"><div style="color:#4ade80;font-size:12px">✅ CODE CHOCO ITACHI:</div><div class="code" id="codeText">---- ----</div><div style="color:#666;font-size:11px;margin-top:10px">Entre ce code dans WhatsApp en 20 sec!<br>WhatsApp > Appareils liés > Lier avec numéro</div></div><div class="footer">CHOCO ITACHI MD © 2026 - By Boss Alin 🇬🇳🍫</div></div><script>async function getCode(){const num=document.getElementById('number').value.trim();const btn=document.getElementById('btn');const box=document.getElementById('codeBox');const codeText=document.getElementById('codeText');const err=document.getElementById('error');if(!num||num.length<10){err.style.display='block';err.innerText='Entre ton numéro complet!';return}btn.disabled=true;btn.innerText='⏳ GÉNÉRATION...';err.style.display='none';box.classList.remove('show');try{const res=await fetch('/code?number='+encodeURIComponent(num));const data=await res.json();if(data.code){codeText.innerText=data.code;box.classList.add('show');btn.innerText='✅ CODE GÉNÉRÉ!';setTimeout(()=>{btn.disabled=false;btn.innerText='⚡ OBTENIR CODE PAIRING 👁️'},20000)}else{err.style.display='block';err.innerText=data.error||'Erreur';btn.disabled=false;btn.innerText='⚡ OBTENIR CODE PAIRING 👁️'}}catch(e){err.style.display='block';err.innerText='Erreur serveur: '+e.message;btn.disabled=false;btn.innerText='⚡ OBTENIR CODE PAIRING 👁️'}}</script></body></html>`);
});

app.get('/code', async (req, res) => {
  let num = req.query.number?.replace(/[^0-9]/g, '');
  if (!num) return res.json({ error: 'Numéro invalide!' });
  try {
    const { version } = await fetchLatestBaileysVersion();
    const tempDir = `./temp_${Date.now()}`;
    fs.mkdirSync(tempDir, { recursive: true });
    const { state, saveCreds } = await useMultiFileAuthState(tempDir);
    const sock = makeWASocket({
      version, logger: pino({ level: 'silent' }), browser: Browsers.macOS('Desktop'),
      auth: state, printQRInTerminal: false,
    });
    await delay(2500);
    if (state.creds.registered) {
      try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
      return res.json({ error: 'Numéro déjà connecté!' });
    }
    let code = await sock.requestPairingCode(num);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    res.json({ code });
    try { sock.ws.close(); } catch {}
    setTimeout(() => { try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {} }, 30000);
  } catch (e) {
    res.json({ error: 'WhatsApp a refusé. Attends 2 min! ' + e.message });
  }
});

export const server = app;