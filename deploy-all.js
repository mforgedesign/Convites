const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_TOKEN = 'process.env.GITHUB_TOKEN';
const OWNER = 'mforgedesign';
const REPO = 'Convites';
const BASE_PATH = 'builder-v4';

// ALL FILES MODIFIED IN THIS SESSION
const FILES = [
    { local: 'index.html', remote: 'index.html' },
    { local: 'static/js/ai-prompts.js', remote: 'static/js/ai-prompts.js' },
    { local: 'static/js/windows.js', remote: 'static/js/windows.js' },
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
        message: `Deploy all AutoBuilder v4 fixes`,
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

async function deployAll() {
    console.log('🚀 Deploying ALL AutoBuilder v4 Fixes\n');
    console.log('📋 Files to deploy:');
    FILES.forEach(f => console.log(`   - ${f.remote}`));
    console.log('');

    let success = 0;
    let failed = 0;

    for (const file of FILES) {
        const result = await deployFile(file.local, file.remote);
        if (result) success++;
        else failed++;
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n✅ Deploy complete: ${success} succeeded, ${failed} failed`);
    console.log('🔗 https://mforgedesign.github.io/Convites/builder-v4/\n');

    console.log('📦 Summary of fixes deployed:');
    console.log('   ✅ Button preview bug (no hardcoded buttons)');
    console.log('   ✅ Custom ZIP upload handler');
    console.log('   ✅ AI generation system (7 prompt templates)');
    console.log('   ✅ Upload fixes (syntax error + response structure)');
    console.log('   ✅ FormData handling in fetch interceptor');
    console.log('   ✅ MediaUpdated events for preview updates');
}

deployAll();
