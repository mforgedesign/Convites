/**
 * Supabase API Adapter for Auto Builder v4
 * ==========================================
 * Intercepts Flask API calls and redirects to Supabase Edge Functions
 */

(function () {
    'use strict';

    // Supabase Configuration
    const SUPABASE_URL = 'https://ymttaaebrqcfrgipqwvy.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltdHRhYWVicnFjZnJnaXBxd3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMjM0MzAsImV4cCI6MjA4MjY5OTQzMH0.il4DFa2WDfwnqgsj5i5Ny0SklMZz1sta_eZisctuLYs';

    // Initialize Supabase Client
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Global State (mimics Flask session)
    window.builderState = {
        currentInvitationId: null,
        formData: {},
        assets: {},
        conversationHistory: []
    };

    // ==================== API INTERCEPTOR ====================

    /**
     * Intercept fetch calls to /api/* and redirect to Supabase
     */
    const originalFetch = window.fetch;
    window.fetch = async function (url, options = {}) {
        // Only intercept local API calls
        if (typeof url === 'string' && url.startsWith('/api/')) {
            console.log('[API Adapter] Intercepting:', url);
            return await handleAPICall(url, options);
        }

        // Pass through other requests
        return originalFetch.apply(this, arguments);
    };

    /**
     * Routes API calls to appropriate Supabase handlers
     */
    async function handleAPICall(url, options) {
        const method = options.method || 'GET';
        const body = options.body ? JSON.parse(options.body) : null;

        try {
            // Route mapping
            if (url.startsWith('/api/chat')) {
                return await handleChatAPI(body);
            }
            else if (url.startsWith('/api/upload/')) {
                const context = url.split('/api/upload/')[1];
                return await handleUploadAPI(context, options);
            }
            else if (url === '/api/state') {
                return await handleStateAPI('GET');
            }
            else if (url === '/api/update_state') {
                return await handleStateAPI('POST', body);
            }
            else if (url.startsWith('/api/generate/')) {
                const type = url.split('/api/generate/')[1];
                return await handleGenerateAPI(type, body);
            }
            else if (url === '/api/build') {
                return await handleBuildAPI();
            }
            else if (url === '/api/publish') {
                return await handlePublishAPI(body);
            }
            else if (url === '/api/history') {
                return await handleHistoryAPI();
            }
            else if (url === '/api/samples') {
                return await handleSamplesAPI();
            }
            else {
                console.warn('[API Adapter] Unknown endpoint:', url);
                return createResponse({ error: 'Endpoint not implemented' }, 501);
            }
        } catch (error) {
            console.error('[API Adapter] Error:', error);
            return createResponse({ error: error.message }, 500);
        }
    }

    // ==================== HANDLERS ====================

    /**
     * /api/chat - Chatbot interactions
     */
    async function handleChatAPI(body) {
        const { data, error } = await supabase.functions.invoke('chatbot-intent', {
            body: {
                message: body.message,
                context: window.builderState,
                conversation_history: window.builderState.conversationHistory
            }
        });

        if (error) throw error;
        return createResponse(data);
    }

    /**
     * /api/upload/<context> - File uploads
     */
    async function handleUploadAPI(context, options) {
        const formData = options.body; // FormData object
        const file = formData.get('file');

        if (!file) {
            return createResponse({ error: 'No file provided' }, 400);
        }

        // Upload to Supabase Storage
        const fileName = `${context}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('invitation-assets')
            .upload(fileName, file);

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('invitation-assets')
            .getPublicUrl(fileName);

        // Store in state
        window.builderState.assets[context] = urlData.publicUrl;

        return createResponse({
            success: true,
            data: {
                url: urlData.publicUrl,
                context: context,
                file_url: urlData.publicUrl // Compatibility with windows.js expectations
            }
        });
    }

    /**
     * /api/state - Get/Update state
     */
    async function handleStateAPI(method, body = null) {
        if (method === 'GET') {
            return createResponse(window.builderState);
        } else if (method === 'POST') {
            // Merge updates
            Object.assign(window.builderState.formData, body);

            // Save to Supabase
            if (window.builderState.currentInvitationId) {
                await supabase.from('invitations').update({
                    ...body,
                    updated_at: new Date().toISOString()
                }).eq('id', window.builderState.currentInvitationId);
            }

            return createResponse({ success: true, state: window.builderState });
        }
    }

    /**
     * /api/generate/<type> - AI Generation (image/video)
     */
    async function handleGenerateAPI(type, body) {
        if (type === 'image') {
            const { data, error } = await supabase.functions.invoke('generate-image', {
                body: {
                    mode: body.reference_image ? 'image-to-image' : 'text-to-image',
                    prompt: body.prompt,
                    reference_image: body.reference_image,
                    model: body.model || 'seedream-v4',
                    target_window: body.target_window || 'cover'
                }
            });

            if (error) throw error;
            return createResponse(data);
        }
        else if (type === 'video' || type === 'video_transition') {
            const { data, error } = await supabase.functions.invoke('generate-video', {
                body: {
                    source_image_url: body.image_url,
                    prompt: body.prompt,
                    model: body.model || 'hailuo-02',
                    type: body.type || 'opening'
                }
            });

            if (error) throw error;
            return createResponse(data);
        }

        return createResponse({ error: 'Unknown generation type' }, 400);
    }

    /**
     * /api/build - Build project
     */
    async function handleBuildAPI() {
        // TODO: Implement build logic
        return createResponse({
            success: true,
            message: 'Build system in development',
            download_url: '#'
        });
    }

    /**
     * /api/publish - Publish to GitHub
     */
    async function handlePublishAPI(body) {
        const { data, error } = await supabase.functions.invoke('deploy-github', {
            body: {
                slug: body.slug,
                files: body.files || {},
                commit_message: `Deploy ${body.slug} via AutoBuilder v4`
            }
        });

        if (error) throw error;
        return createResponse(data);
    }

    /**
     * /api/history - Get published invitations
     */
    async function handleHistoryAPI() {
        const { data, error } = await supabase
            .from('invitations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;
        return createResponse({ invitations: data });
    }

    /**
     * /api/samples - Get music samples
     */
    async function handleSamplesAPI() {
        // TODO: Implement samples logic or use hardcoded list
        return createResponse({
            samples: [
                { name: 'Sample 1', url: '#' },
                { name: 'Sample 2', url: '#' },
                { name: 'Sample 3', url: '#' },
                { name: 'Sample 4', url: '#' }
            ]
        });
    }

    // ==================== UTILITIES ====================

    /**
     * Create a Response object mimicking fetch API
     */
    function createResponse(data, status = 200) {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

        return Promise.resolve(new Response(blob, {
            status: status,
            statusText: status === 200 ? 'OK' : 'Error',
            headers: { 'Content-Type': 'application/json' }
        }));
    }

    console.log('[Supabase Adapter] Initialized - Intercepting /api/* calls');

    // Expose for debugging
    window.SupabaseAdapter = {
        supabase,
        builderState: window.builderState
    };

})();
