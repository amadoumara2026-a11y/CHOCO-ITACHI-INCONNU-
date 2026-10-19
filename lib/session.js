import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from 'fs';
import axios from 'axios';
const GITHUB_USERNAME = 'stormfiber';
/**
 * Save credentials from GitHub Gist to session/creds.json
 * @param {string} txt - Gist ID with optional prefix
 */
async function SaveCreds(txt) {
    const __dirname = path.dirname(__filename);
    if (!txt || typeof txt !== 'string' || txt.trim().length === 0) {
        throw new Error('SESSION_ID invalide ou vide. Pour utiliser la récupération automatique, définis SESSION_ID à l’identifiant Gist correct dans .env, sinon laisse vide.');
    }
    const gistId = txt.replace('GlobalTechInfo/MEGA-MD_', '').trim();
    if (!gistId) throw new Error('Identifiant Gist invalide pour SaveCreds.');
    const gistUrl = `https://gist.githubusercontent.com/${GITHUB_USERNAME}/${gistId}/raw/creds.json`;
    try {
        const response = await axios.get(gistUrl, { timeout: 15000 });
        const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        const sessionDir = path.join(process.cwd(), 'session');
        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true });
        }
        const credsPath = path.join(sessionDir, 'creds.json');
        fs.writeFileSync(credsPath, data);
        console.log(`Credentials téléchargés depuis le Gist ${gistId} vers ${credsPath}`);
    }
    catch (error) {
        console.error('❌ Error downloading or saving credentials:', error.message || error);
        if (error.response) {
            console.error('❌ Status:', error.response.status);
            console.error('❌ Response:', error.response.data);
        }
        throw error;
    }
}
export default SaveCreds;
