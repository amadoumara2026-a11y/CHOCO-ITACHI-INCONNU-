import express from 'express';
import fs, { existsSync } from 'fs';
import pino from 'pino';
import QRCode from 'qrcode';
import { fetchLatestBaileysVersion, makeWASocket, useMultiFileAuthState, Browsers, delay } from '@whiskeysockets/baileys';

const app = express();
export const PORT = process.env.PORT || 10000;
let lastQR = null;

app.get('/', async (req, res) => {
  let qrImage = '';
  if (lastQR) { try { qrImage = await QRCode.toDataURL(lastQR); } catch {} }
  res.send(`<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>CHOCO ITACHI</title><style>body{background:#0a0a0a;color:#fff;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:monospace;padding:20px}.box{width:100%;max-width:420px;background:#141414;border:1px solid #222;border-radius:16px;padding:24px;text-align:center}h1{font-size:26px}h1 span{color:#ff3b3b}.qr{background:#fff;padding:12px;border-radius:12px;margin:16px auto;display:${qrImage?'block':'none'}}.qr img{width:100%}button{width:100%;background:#ff1a1a;color:#fff;border:none;padding:14px;border-radius:10px;font-weight:bold;cursor:pointer;margin-top:10px}input{width:100%;background:#1f1f1f;border:1px solid #333;color:#fff;padding:12px;border-radius:10px;margin:8px 0}</style><script>setTimeout(()=>location.reload(),20000)</script></head><body><div class="box"><h1>CHOCO <span>ITACHI</span> 👁️</h1><p style="color:#888;font-size:11px">V7 QR MODE</p>${qrImage?`<div class="qr"><img src="${qrImage}"></div><p style="color:#4ade80">Scanne vite! 30s</p><p style="color:#aaa;font-size:11px">WhatsApp > Appareils liés > Lier un appareil</p>`:`<p style="color:#ffaa00;margin:20px 0">⏳ Génération QR... Actualise dans 15s</p>`}<hr style="margin:20px 0;border-color:#222"><p style="font-size:12px">Code par numéro (si QR fail):</p><input id="num" value="224629447488"><button onclick="getCode()">OBTENIR CODE</button><div id="cbox" style="display:none;border:2px solid #4ade80;padding:10px;border-radius:8px;margin-top:10px"><div id="ctext" style="font-size:24px;font-weight:bold"></div></div><div id="err" style="display:none;background:#2a1a1a;color:#ff6b6b;padding:8px;border-radius:6px;margin-top:10px;font-size:12px"></div></div><script>async function getCode(){const n=document.getElementById('num').value.trim();const e=document.getElementById('err');const box=document.getElementById('cbox');const ct=document.getElementById('ctext');try{const r=await fetch('/code?number='+encodeURIComponent(n));const d=await r.json();if(d.code){ct.innerText=d.code;box.style.display='block'}else{e.style.display='block';e.innerText=d.error}}catch(err){e.style.display='block';e.innerText=err.message}}</script></body></html>`);
});

app.get('/code', async (req,res)=>{
  let num=req.query.number?.replace(/[^0-9]/g,''); if(!num) return res.json({error:'Num vide'});
  try{const {version}=await fetchLatestBaileysVersion(); if(!existsSync('./session')) fs.mkdirSync('./session',{recursive:true}); const {state,saveCreds}=await useMultiFileAuthState('./session'); const sock=makeWASocket({version,logger:pino({level:'silent'}),browser:Browsers.ubuntu('Chrome'),auth:state}); sock.ev.on('creds.update',saveCreds); await delay(3000); let code=await sock.requestPairingCode(num); code=code?.match(/.{1,4}/g)?.join('-')||code; res.json({code}); setTimeout(()=>{try{sock.ws.close()}catch{}},90000);}catch(err){res.json({error:err.message})}
});

async function genQR(){
  try{const {version}=await fetchLatestBaileysVersion(); if(!existsSync('./session')) fs.mkdirSync('./session',{recursive:true}); const {state,saveCreds}=await useMultiFileAuthState('./session'); const sock=makeWASocket({version,logger:pino({level:'silent'}),browser:Browsers.macOS('Desktop'),auth:state}); sock.ev.on('creds.update',saveCreds); sock.ev.on('connection.update',u=>{ if(u.qr){ lastQR=u.qr; console.log('[CHOCO QR] Nouveau QR'); } if(u.connection==='open'){ lastQR=null; console.log('[CHOCO CONNECTE] 🍫'); } });}catch(e){console.log(e.message)}
}
genQR(); setInterval(genQR,45000);
export const server=app;