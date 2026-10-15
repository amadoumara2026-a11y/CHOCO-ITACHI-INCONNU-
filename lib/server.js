import express from 'express';
import path from 'path';
import config from '../config.js';

const app = express();
export const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>CHOCO ITACHI INCONNU</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { background:#0a0a0f; color:white; font-family:monospace; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; }
            .card { background:rgba(255,255,255,0.05); backdrop-filter:blur(10px); border:1px solid rgba(139,69,19,0.3); border-radius:20px; padding:30px; width:90%; max-width:400px; text-align:center; }
            .online { background:rgba(0,255,100,0.15); color:#00ff64; padding:5px 15px; border-radius:20px; font-size:12px; }
            .row { background:rgba(0,0,0,0.4); display:flex; justify-content:space-between; padding:12px 15px; border-radius:12px; margin:10px 0; }
            .label { color:#888; } .value { font-weight:bold; }
            .footer { color:#666; margin-top:20px; font-size:11px; letter-spacing:2px; }
            .sharingan { position:absolute; width:300px; height:300px; background:radial-gradient(circle, rgba(255,0,0,0.15) 0%, transparent 70%); filter:blur(20px); z-index:-1; }
        </style>
    </head>
    <body>
        <div class="sharingan"></div>
        <div class="card">
            <span class="online">● SYSTEM ONLINE</span>
            <h1 style="margin:20px 0 5px;">CHOCO ITACHI INCONNU</h1>
            <p style="color:#aaa; font-size:13px;">Mode Inconnu - Par Boss Alin</p>
            <div class="row"><span class="label">VERSION</span><span class="value">7.0.0</span></div>
            <div class="row"><span class="label">AUTHOR</span><span class="value">Boss Alin</span></div>
            <div class="row"><span class="label">UPTIME</span><span class="value">${h}h ${m}m ${s}s</span></div>
            <div class="footer">POWERED BY <span style="color:#8B4513;">CHOCO ITACHI</span></div>
            <br>
            <a href="/pair" style="background:#8B4513; color:white; padding:10px 20px; border-radius:10px; text-decoration:none;">PAIR SITE 🍫</a>
        </div>
    </body>
    </html>
    `);
});

app.get('/pair', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'pair.html'));
});

export const server = app;