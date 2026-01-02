const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const GITHUB_TOKEN = 'process.env.GITHUB_TOKEN';
const REPO_OWNER = 'mforgedesign';
const REPO_NAME = 'Convites';
const BRANCH = 'main';
const BUILDER_PATH = 'builder-v4';

// Files to deploy
const FILES_TO_DEPLOY = [
    'static/js/preview.js'
];

// Helper: Upload file to GitHub
function uploadFile(filePath) {
    return new Promise((resolve, reject) => {
        const localPath = path.join(__dirname, filePath);
        const repoPath = `${BUILDER_PATH}/${filePath.replace(/\\/g, '/')}`;

        if (!fs.existsSync(localPath)) {
            console.error(`❌ File not found: ${localPath}`);
            return resolve(false);
        }

        const content = fs.readFileSync(localPath, { encoding: 'base64' });

        // First, get the current SHA if the file exists
        const getOptions = {
            hostname: 'api.github.com',
            path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${repoPath}?ref=${BRANCH}`,
            method: 'GET',
            headers: {
                'User-Agent': 'NodeJS-Deploy-Script',
                'Authorization': `token ${GITHUB_TOKEN}`,
            }
        };

        const getReq = https.request(getOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                let sha = null;
                if (res.statusCode === 200) {
                    sha = JSON.parse(data).sha;
                }

                // Now upload
                const putData = JSON.stringify({
                    message: `Fix preview timer initialization`,
                    content: content,
                    branch: BRANCH,
                    sha: sha
                });

                const putOptions = {
                    hostname: 'api.github.com',
                    path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${repoPath}`,
                    method: 'PUT',
                    headers: {
                        'User-Agent': 'NodeJS-Deploy-Script',
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(putData)
                    }
                };

                const putReq = https.request(putOptions, (putRes) => {
                    let putResData = '';
                    putRes.on('data', (chunk) => putResData += chunk);
                    putRes.on('end', () => {
                        if (putRes.statusCode === 200 || putRes.statusCode === 201) {
                            console.log(`   ✅ Success: ${filePath}`);
                            resolve(true);
                        } else {
                            console.error(`   ❌ Failed: ${filePath} (${putRes.statusCode})`);
                            console.error(putResData);
                            resolve(false);
                        }
                    });
                });

                putReq.on('error', (e) => {
                    console.error(`   ❌ Request error: ${e.message}`);
                    resolve(false);
                });

                putReq.write(putData);
                putReq.end();
            });
        });

        getReq.on('error', (e) => {
            console.error(`   ❌ Get SHA error: ${e.message}`);
            resolve(false);
        });

        getReq.end();
    });
}

// Main execution
async function deploy() {
    console.log(`🔧 Deploying Preview Logic Fix...`);
    console.log('-----------------------------------');

    for (const file of FILES_TO_DEPLOY) {
        console.log(`📤 ${file}`);
        await uploadFile(file);
    }

    console.log('\n✅ Preview fix deployed!');
    console.log('🔗 https://mforgedesign.github.io/Convites/builder-v4/');
}

deploy();
