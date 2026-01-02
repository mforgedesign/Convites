const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_TOKEN = 'process.env.GITHUB_TOKEN';
const OWNER = 'mforgedesign';
const REPO = 'Convites';
const BASE_PATH = 'builder-v4';

// Map: { localFileName: remoteFileName }
const SAMPLE_FILES = [
    { local: 'Música filme Enrolados _I See the Light_ instrumental - para Entrada das Floristas [LAA3_ZFZYLY].mp3', remote: 'sample_enrolados.mp3' },
    { local: 'PERFECT - Ed Sheeran - Violin Cover by Andre Soueid [b9v96HD_3_U].mp3', remote: 'sample_perfect.mp3' },
    { local: 'sample_vivalavida.mp3', remote: 'sample_vivalavida.mp3' },
    { local: 'sample_enchanted.mp3', remote: 'sample_enchanted.mp3' }
];

async function getFileSHA(filePath) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath).replace(/%2F/g, '/')}`,
            method: 'GET',
            headers: {
                'User-Agent': 'AutoBuilder-Deploy',
                'Authorization': `Bearer ${GITHUB_TOKEN}`
            }
        };

        https.get(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const fileData = JSON.parse(data);
                        resolve(fileData.sha);
                    } catch (e) {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

async function deployFile(localPath, remotePath) {
    console.log(`📤 ${remotePath}`);

    if (!fs.existsSync(localPath)) {
        console.log(`   ❌ Not found: ${localPath}`);
        return false;
    }

    const content = fs.readFileSync(localPath);
    const base64Content = content.toString('base64');
    const fullPath = `${BASE_PATH}/${remotePath}`;
    const fileSha = await getFileSHA(fullPath);

    const payload = JSON.stringify({
        message: `Upload sample music: ${remotePath}`,
        content: base64Content,
        ...(fileSha && { sha: fileSha })
    });

    return new Promise((resolve) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(fullPath).replace(/%2F/g, '/')}`,
            method: 'PUT',
            headers: {
                'User-Agent': 'AutoBuilder-Deploy',
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    console.log(`   ✅ Success`);
                    resolve(true);
                } else {
                    console.log(`   ❌ Failed (${res.statusCode})`);
                    try {
                        const errData = JSON.parse(data);
                        console.log(`      ${errData.message || ''}`);
                    } catch (e) { }
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`   ❌ Error: ${error.message}`);
            resolve(false);
        });

        req.write(payload);
        req.end();
    });
}

async function deploySamples() {
    console.log('🎵 Deploying Music Samples\n');

    for (const file of SAMPLE_FILES) {
        const localPath = path.join('música base', file.local);
        const remotePath = `musica-base/${file.remote}`;
        await deployFile(localPath, remotePath);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Rate limit
    }

    console.log('\n✅ Sample deployment complete!');
    console.log('📂 Deployed to: builder-v4/musica-base/');
}

deploySamples();
