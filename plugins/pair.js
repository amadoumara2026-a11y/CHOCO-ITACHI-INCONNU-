import axios from 'axios';
export default {
    command: 'pair',
    aliases: ['paircode', 'choco', 'code'],
    category: 'general',
    description: 'Get CHOCO-ITACHI pairing code',
    usage: '.pair 224629447488',
    async handler(sock, message, args, context) {
        const { chatId } = context;
        const query = args.join('').trim();
        if (!query) {
            return await sock.sendMessage(chatId, {
                text: "❌ *Numéro manquant*\nExemple: .pair 224629447488"
            }, { quoted: message });
        }
        const number = query.replace(/[^0-9]/g, '');
        
        await sock.sendMessage(chatId, {
            text: "⚡ *CHOCO-ITACHI génère le code...*"
        }, { quoted: message });

        try {
            // CHANGE ICI BOSS - Mets TON URL Render!
            const response = await axios.get(`https://choco-itachi-inconnu-1.onrender.com/pair?number=${number}`, {
                timeout: 60000
            });
            
            if (response.data?.code) {
                const code = response.data.code;
                await sock.sendMessage(chatId, {
                    text: `✅ *CHOCO ITACHI 👁️ PAIRING CODE*\n\nCode: *${code}*\n\n1. WhatsApp > Paramètres\n2. Appareils liés\n3. Lier un appareil\n4. Lier avec numéro de téléphone\n5. Entre: ${code}`
                }, { quoted: message });
            }
        } catch (error) {
            console.error('Pairing Error:', error.message);
            await sock.sendMessage(chatId, {
                text: `❌ *Erreur: ${error.response?.data?.error || "Serveur occupé, attends 2 min"}*\n\nTape: rm -rf auth_info_baileys dans le Shell Render puis réessaye.`
            }, { quoted: message });
        }
    }
}