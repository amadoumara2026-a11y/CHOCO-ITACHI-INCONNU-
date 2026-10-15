import express from 'express';
import path from 'path';
import fs from 'fs';
import pino from 'pino';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import makeWASocket, { useMultiFileAuthState, Browsers, delay, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
export const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// PAGE D'ACCUEIL CHOCO
app.get('/', (req, res) => {
    const up = process.uptime();
    const h = Math.floor(up / 3600);
    const m = Math.floor((up % 3600) / 60);
    const s = Math.floor(up % 60);
    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>CHOCO ITACHI INCONNU - PAIR SITE</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#07070b;color:white;font-family:Arial;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px}
.card{background:rgba(255,255,255,0.05);backdrop-filter:blur(15px);border:1px solid rgba(139,69,19,0.4);border-radius:24px;padding:30px;width:100%;max-width:400px;text-align:center;box-shadow:0 0 40px rgba(139,69,19,0.2)}
.online{background:rgba(0,255,100,0.15);color:#00ff64;padding:6px 16px;border-radius:20px;font-size:12px;font-weight:bold}
h1{margin:20px 0 5px;font-size:26px;letter-spacing:1px}
.sub{color:#aaa;font-size:13px;margin-bottom:20px}
.inputBox{background:#0f0f14;border:1px solid #222;border-radius:12px;padding:14px;width:100%;color:white;font-size:16px;text-align:center;margin:10px 0;outline:none}
.inputBox:focus{border-color:#8B4513}
.btn{background:linear-gradient(135deg,#8B4513,#CD853F);color:white;padding:14px;border:none;border-radius:12px;font-weight:bold;cursor:pointer;width:100%;font-size:16px;margin-top:10px}
.btn:hover{opacity:0.9}
.codeBox{background:#000;padding:20px;border-radius:12px;margin-top:20px;font-size:28px;letter-spacing:5px;font-weight:bold;color:#00ff64;border:1px dashed #00ff64;display:none}
.row{background:rgba(0,0,0,0.4);display:flex;justify-content:space-between;padding:12px 15px;border-radius:12px;margin:8px 0;font-size:13px}
.label{color:#888} .value{font-weight:bold}
.footer{color:#555;margin-top:25px;font-size:10px;letter-spacing:2px}
.sharingan{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:500px;background:radial-gradient(circle, rgba(255,0,0,0.12) 0%, transparent 70%);filter:blur(30px);z-index:-1;pointer-events:none}
</style>
</head>
<body>
<div class="sharingan"></div>
<div class="card">
<span class="online">● SYSTEM ONLINE</span>
<h1>CHOCO ITACHI</h1>
<p class="sub">Mode Inconnu - Par Boss Alin</p>

<div class="row"><span class="label">VERSION</span><span class="value">7.0.0</span></div>
<div class="row"><span class="label">AUTHOR</span><span class="value">Boss Alin</span></div>
<div class="row"><span class="label">UPTIME</span><span class="value">${h}h ${m}m ${s}s</span></div>

<h3 style="margin-top:25px;margin-bottom:10px">🔗 PAIR TON NUMÉRO</h3>
<input id="number" class="inputBox" placeholder="224629447488" type="number">
<button class="btn" onclick="getCode()">OBTENIR CODE PAIRING 👁️</button>

<div id="codeBox" class="codeBox"></div>
<p id="msg" style="margin-top:15px;color:#aaa;font-size:13px"></p>

<div class="footer">POWERED BY <span style="color:#8B4513">CHOCO ITACHI</span> 🍫</div>
</div>

<script>
async function getCode(){
 const num = document.getElementById('number').value;
 const codeBox = document.getElementById('codeBox');
 const msg = document.getElementById('msg');
 if(!num){ alert('Mets ton numéro Boss! Ex: 224629447488'); return; }
 msg.innerText = 'Génération du code Choco... 🍫⏳';
 codeBox.style.display='none';
 try{
   const res = await fetch('/code?number='+num);
   const data = await res.json();
   if(data.code){
     codeBox.innerText = data.code;
     codeBox.style.display='block';
     msg.innerHTML = '✅ Va dans WhatsApp > <b>Appareils liés</b> > <b>Lier un appareil</b> > <b>Lier avec numéro</b> et entre ce code!<br><br>⏳ Expire dans 60 secondes!';
   } else {
     msg.innerText = '❌ Erreur: ' + (data.error || 'Réessaie');
   }
 } catch(e){
   msg.innerText = '❌ Erreur serveur, réessaie Boss!';
 }
}
</script>
</body>
</html>
    `);
});

// API POUR GENERER LE CODE PAIRING
app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.json({ error: 'Mets ton numéro!' });
    num = num.replace(/[^0-9]/g, '');
    
    try {
        const { version } = await fetchLatestBaileysVersion();
        const sessionDir = path.join(__dirname, '../session');
        if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
        
        // Session temporaire pour le pairing
        const tempId = 'temp_' + Date.now();
        const { state, saveCreds } = await useMultiFileAuthState(`./session/${tempId}`);
        
        const sock = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: Browsers.macOS('Chrome'),
            auth: state,
        });

        // Demander le code pairing
        await delay(2000);
        let code = await sock.requestPairingCode(num);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        
        console.log(`🍫 CODE PAIRING CHOCO pour ${num}: ${code}`);
        
        // Sauvegarder creds et fermer
        await saveCreds();
        try { sock.end(); } catch {}
        
        // Nettoyer session temp après 2 min
        setTimeout(() => {
            try { fs.rmSync(`./session/${tempId}`, { recursive: true, force: true }); } catch {}
        }, 120000);

        return res.json({ code });

    } catch (err) {
        console.error('Erreur code:', err.message);
        return res.json({ error: err.message });
    }
});

export const server = app;