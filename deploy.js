const fs = require('fs');
const https = require('https');

// Read index.html
const indexHTML = fs.readFileSync('index.html', 'utf8');

// GitHub API config
const GITHUB_TOKEN = 'process.env.GITHUB_TOKEN';
const OWNER = 'mforgedesign';
const REPO = 'Convites';
const PATH = 'builder-v4/index.html';

// Encode to base64
const content = Buffer.from(indexHTML).toString('base64');

// Check if file exists and get SHA
const checkOptions = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/contents/${PATH}`,
    method: 'GET',
    headers: {
        'User-Agent': 'AutoBuilder-Deploy',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
    }
};

https.get(checkOptions, (checkRes) => {
    let checkData = '';
    checkRes.on('data', (chunk) => checkData += chunk);
    checkRes.on('end', () => {
        let fileSha = null;

        if (checkRes.statusCode === 200) {
            try {
                const fileData = JSON.parse(checkData);
                fileSha = fileData.sha;
                console.log('File exists, SHA:', fileSha);
            } catch (e) {
                console.error('Error parsing response:', e);
            }
        }

        // Prepare payload with SHA if file exists
        const payload = JSON.stringify({
            message: 'Deploy AutoBuilder v4 frontend',
            content: content,
            ...(fileSha && { sha: fileSha })
        });

        // Make PUT request
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${OWNER}/${REPO}/contents/${PATH}`,
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
                console.log('Status:', res.statusCode);
                console.log('Response:', data);

                if (res.statusCode === 201 || res.statusCode === 200) {
                    console.log('\n✅ Deploy successful!');
                    console.log('🔗 URL: https://mforgedesign.github.io/Convites/builder-v4/');
                } else {
                    console.error('\n❌ Deploy failed');
                }
            });
        });

        req.on('error', (error) => console.error('Error:', error));
        req.write(payload);
        req.end();
    });
}).on('error', (e) => console.error('Check error:', e));
