import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';
import config from '../../config.js';

export default {
    command: 'script',
    aliases: ['repo', 'sc', 'choco'],
    category: 'info',
    description: 'Info repo CHOCO ITACHI INCONNU',
    usage: '.script',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        try {
            // TON REPO CHOCO
            const res = await fetch('https://api.github.com/repos/AlinBoss/CHOCO-ITACHI-MD');
            if (!res.ok) throw new Error('Error fetching');
            const json = await res.json();
            
            let txt = `*🍫 CHOCO ITACHI INCONNU 👁️*\n\n`;
            txt += `✩ *Nom* : ${json.name || 'CHOCO-ITACHI-MD'}\n`;
            txt += `✩ *Owner* : Boss Alin\n`;
            txt += `✩ *Views* : ${json.watchers_count || 100}+\n`;
            txt += `✩ *Taille* : ${(json.size / 1024).toFixed(2)} MB\n`;
            txt += `✩ *Update* : ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
            txt += `✩ *URL* : ${json.html_url || 'https://github.com/AlinBoss/CHOCO-ITACHI-MD'}\n`;
            txt += `✩ *Forks* : ${json.forks_count || 0}\n`;
            txt += `✩ *Stars* : ${json.stargazers_count || 0}\n\n`;
            txt += `🍫 *CHOCO ITACHI INCONNU*\n`;
            txt += `👻 Mode Inconnu Actif\n`;
            txt += `👑 By Boss Alin - 224629447488\n`;
            txt += `🔗 ${config.channelLink || ''}`;

            // Essaie d'envoyer avec thumb ou image Itachi
            try {
                const imgPath = path.join(process.cwd(), 'assets/thumb.png');
                if (fs.existsSync(imgPath)) {
                    const imgBuffer = fs.readFileSync(imgPath);
                    await sock.sendMessage(chatId, { image: imgBuffer, caption: txt }, { quoted: message });
                } else {
                    throw new Error('no thumb');
                }
            } catch {
                // Fallback image Itachi depuis URL
                await sock.sendMessage(chatId, { 
                    image: { url: 'https://i.imgur.com/4NZ6uLY.jpeg' },
                    caption: txt 
                }, { quoted: message });
            }

        } catch (error) {
            console.error('Error script:', error);
            // Même si API fail, envoie info Choco
            const fallback = `*🍫 CHOCO ITACHI INCONNU 👁️*\n\n✩ *Nom* : CHOCO-ITACHI-MD\n✩ *Owner* : Boss Alin\n✩ *Num* : 224629447488\n✩ *Version* : 7.0.0\n✩ *Mode* : INCONNU 👻\n\n🍫 *CHOCO ITACHI INCONNU*\nBy Boss Alin`;
            await sock.sendMessage(chatId, { text: fallback }, { quoted: message });
        }
    }
};