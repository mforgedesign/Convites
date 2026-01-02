import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Hardcoded Token (Workaround for MCP Secrets Limitation)
const GITHUB_TOKEN = 'process.env.GITHUB_TOKEN';
const GITHUB_OWNER = 'mforgedesign';
const GITHUB_REPO = 'Convites';

interface DeployRequest {
    slug: string;
    files: Record<string, string>;
    commit_message?: string;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            },
        });
    }

    try {
        const body: DeployRequest = await req.json();

        if (!body.slug || !body.files) {
            return new Response(
                JSON.stringify({ error: 'Missing slug or files' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const commitMessage = body.commit_message || `Deploy ${body.slug} via AutoBuilder v4`;
        const results: any[] = [];

        // Process files
        for (const [path, content] of Object.entries(body.files)) {
            // Ensure path doesn't start with /
            const cleanPath = path.startsWith('/') ? path.substring(1) : path;
            const fullPath = `${body.slug}/${cleanPath}`;

            // Check if file exists to get SHA (for update)
            let fileSha = null;
            try {
                const fileResponse = await fetch(
                    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${fullPath}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${GITHUB_TOKEN}`,
                            'Accept': 'application/vnd.github.v3+json',
                        },
                    }
                );
                if (fileResponse.ok) {
                    const fileData = await fileResponse.json();
                    fileSha = fileData.sha;
                }
            } catch (e) {
                // ignore
            }

            const createUpdateResponse = await fetch(
                `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${fullPath}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: commitMessage,
                        content: content, // Content is already base64 from client
                        ...(fileSha && { sha: fileSha }),
                    }),
                }
            );

            if (!createUpdateResponse.ok) {
                const errorText = await createUpdateResponse.text();
                throw new Error(`GitHub API error for ${fullPath}: ${errorText}`);
            }

            const result = await createUpdateResponse.json();
            results.push({
                path: fullPath,
                sha: result.content.sha,
                url: result.content.html_url,
            });
        }

        return new Response(
            JSON.stringify({
                success: true,
                slug: body.slug,
                published_url: `https://mforgedesign.github.io/${GITHUB_REPO}/${body.slug}`,
                results: results,
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error: any) {
        console.error('Error in deploy-github function:', error);
        return new Response(
            JSON.stringify({ error: error.message || 'Unknown error' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
});
