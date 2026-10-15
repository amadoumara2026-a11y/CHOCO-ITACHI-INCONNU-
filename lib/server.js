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

// ... garde ton app.get('/') pareil que maintenant (il est parfait)...

// API PAIRING CORRIGÉE - VERSION CHOCO 7.0.0 FIXE
app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.json({ error: 'Mets ton numéro!' });
    num = num.replace(/[^0-9]/g, '');
    
    console.log(`🍫 Demande code pour ${num}`);
    
    try {
        const { version } = await fetchLatestBaileysVersion();
        
        // IMPORTANT: Dossier temp UNIQUE à chaque demande
        const tempDir = `./temp_pair_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        fs.mkdirSync(tempDir, { recursive: true });
        
        const { state, saveCreds } = await useMultiFileAuthState(tempDir);
        
        const sock = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: Browsers.macOS('Desktop'), // <- Change en Desktop, pas Chrome
            auth: state,
        });

        await delay(3000);
        
        // Si déjà enregistré, on ne peut pas re-pair
        if (state.creds.registered) {
            try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
            return res.json({ error: 'Ce numéro est déjà appairé, supprime session sur Render!' });
        }

        let code = await sock.requestPairingCode(num);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        
        console.log(`✅ CODE CHOCO pour ${num}: ${code}`);
        await saveCreds();
        
        // Fermer proprement
        try { sock.ws.close(); } catch {}
        try { sock.end(); } catch {}

        // Supprimer temp après 60 sec (le temps d'entrer le code)
        setTimeout(() => {
            try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
        }, 60000);

        return res.json({ code });

    } catch (err) {
        console.error('Erreur pairing:', err.message);
        return res.json({ error: 'WhatsApp a refusé. Réessaie dans 2 min. ' + err.message });
    }
});

export const server = app;