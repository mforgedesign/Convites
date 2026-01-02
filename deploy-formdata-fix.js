const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_TOKEN = 'process.env.GITHUB_TOKEN';
const OWNER = 'mforgedesign';
const REPO = 'Convites';
const BASE_PATH = 'builder-v4';

const FILES = [
    { local: 'static/js/supabase-adapter.js', remote: 'static/js/supabase-adapter.js' }
];

async function getFileSHA(filePath) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${OWNER}/${REPO}/contents/${filePath}`,
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
        console.log(`   ❌ Not found`);
        return false;
    }

    const content = fs.readFileSync(localPath, 'utf8');
    const base64Content = Buffer.from(content).toString('base64');
    const fullPath = `${BASE_PATH}/${remotePath}`;
    const fileSHA = await getFileSHA(fullPath);

    const payload = JSON.stringify({
        message: `Fix FormData handling in fetch interceptor`,
        content: base64Content,
        ...(fileSHA && { sha: fileSHA })
    });

    return new Promise((resolve) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${OWNER}/${REPO}/contents/${fullPath}`,
            method: 'PUT',
            headers: {
                'User-Agent': 'AutoBuilder-Deploy',
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': payload.length
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

async function deployFormDataFix() {
    console.log('🔧 Deploying FormData Fix\n');

    for (const file of FILES) {
        await deployFile(file.local, file.remote);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ FormData fix deployed!');
    console.log('🐛 Fixed: JSON.parse() error on FormData uploads');
    console.log('🔗 https://mforgedesign.github.io/Convites/builder-v4/\n');
}

deployFormDataFix();
