/**
 * AutoBuilder v4 - Build System
 * Complete implementation for generating publishable invitations
 */

(function () {
    'use strict';

    // Load JSZip from CDN
    if (!window.JSZip) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        document.head.appendChild(script);
    }

    /**
     * Main build function - generates complete invitation package
     */
    async function executeBuild() {
        console.log('[Build] Starting build process...');

        // 1. Validate required assets
        const validation = validateAssets();
        if (!validation.valid) {
            alert(`❌ Build failed: ${validation.error}`);
            return null;
        }

        // 2. Generate cache-bust ID
        const cacheBustId = `_v${Date.now()}`;

        // 3. Load template
        const template = await loadTemplate();

        // 4. Collect and rename assets
        const assets = await collectAssets(cacheBustId);

        // 5. Generate data.json
        const dataJSON = generateDataJSON();

        // 6. Generate menuConfig
        const menuConfig = generateMenuConfig();

        // 7. Substitute variables in template
        const finalHTML = substituteVariables(template, assets, menuConfig, cacheBustId);

        // 8. Create VFS (Virtual File System)
        const vfs = {
            'index.html': finalHTML,
            'data.json': JSON.stringify(dataJSON, null, 2),
            ...assets
        };

        console.log('[Build] Build complete:', Object.keys(vfs).length, 'files');
        return vfs;
    }

    /**
     * Validate that all required assets are present
     */
    function validateAssets() {
        const state = window.builderState || {};
        const formData = state.formData || {};

        // Minimum requirements
        if (!formData.event_name) {
            return { valid: false, error: 'Nome do evento é obrigatório' };
        }

        if (!state.assets || !state.assets.cover) {
            return { valid: false, error: 'Capa é obrigatória' };
        }

        return { valid: true };
    }

    /**
     * Load the final template HTML
     */
    async function loadTemplate() {
        try {
            const response = await fetch('final_template.html');
            if (!response.ok) {
                // Fallback to minimal template
                return getMinimalTemplate();
            }
            return await response.text();
        } catch (error) {
            console.warn('[Build] Could not load template, using minimal version');
            return getMinimalTemplate();
        }
    }

    /**
     * Collect all assets and rename them with cache-bust IDs
     */
    async function collectAssets(cacheBustId) {
        const state = window.builderState || {};
        const assets = {};

        // Asset mapping: state key → folder/filename
        const assetMap = {
            cover: 'capa/capa',
            sheet: 'folha/folha',
            sheetFilled: 'folha/folha_preenchida',
            opening: 'abertura/abertura',
            loop: 'loop/loop',
            music: 'musica/musica',
            manual: 'manual/manual',
            gifts: 'presentes/presentes'
        };

        for (const [key, basePath] of Object.entries(assetMap)) {
            const asset = state.assets?.[key];
            if (!asset) continue;

            // Determine file extension
            const ext = getFileExtension(asset);
            const filename = `${basePath}${cacheBustId}.${ext}`;

            // Convert to blob if needed
            const blob = await assetToBlob(asset);
            if (blob) {
                assets[filename] = blob;
            }
        }

        return assets;
    }

    /**
     * Get file extension from various asset formats
     */
    function getFileExtension(asset) {
        if (typeof asset === 'string') {
            // URL or data URI
            if (asset.startsWith('data:image/png')) return 'png';
            if (asset.startsWith('data:image/jpeg') || asset.startsWith('data:image/jpg')) return 'jpg';
            if (asset.startsWith('data:image/webp')) return 'webp';
            if (asset.startsWith('data:video/mp4')) return 'mp4';
            if (asset.startsWith('data:audio/mpeg')) return 'mp3';

            // Extract from URL
            const match = asset.match(/\.([a-z0-9]+)(?:[?#]|$)/i);
            return match ? match[1] : 'jpg';
        } else if (asset instanceof File || asset instanceof Blob) {
            const type = asset.type;
            if (type.includes('png')) return 'png';
            if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
            if (type.includes('webp')) return 'webp';
            if (type.includes('mp4')) return 'mp4';
            if (type.includes('mp3') || type.includes('mpeg')) return 'mp3';
        }

        return 'jpg'; // Default
    }

    /**
     * Convert asset to Blob
     */
    async function assetToBlob(asset) {
        if (asset instanceof Blob) {
            return asset;
        }

        if (typeof asset === 'string') {
            if (asset.startsWith('data:')) {
                // Data URI
                const response = await fetch(asset);
                return await response.blob();
            } else {
                // URL
                try {
                    const response = await fetch(asset);
                    return await response.blob();
                } catch (e) {
                    console.warn('[Build] Could not fetch asset:', asset);
                    return null;
                }
            }
        }

        return null;
    }

    /**
     * Generate data.json with complete state
     */
    function generateDataJSON() {
        const state = window.builderState || {};
        return {
            ...state.formData,
            buildDate: new Date().toISOString(),
            version: '4.0'
        };
    }

    /**
     * Generate menuConfig for interactive buttons
     */
    function generateMenuConfig() {
        const state = window.builderState || {};
        const formData = state.formData || {};

        const config = {
            buttons: []
        };

        // Google Maps
        if (formData.google_maps_link) {
            config.buttons.push({
                name: 'Como Chegar',
                icon: 'fa-map-marker-alt',
                action: 'link',
                url: formData.google_maps_link
            });
        }

        // Gifts
        if (formData.gifts_link) {
            config.buttons.push({
                name: 'Lista de Presentes',
                icon: 'fa-gift',
                action: 'link',
                url: formData.gifts_link
            });
        } else if (state.assets?.gifts) {
            config.buttons.push({
                name: 'Sugestões de Presentes',
                icon: 'fa-gift',
                action: 'popup-image',
                target: 'gifts'
            });
        }

        // Manual
        if (formData.manual_text) {
            config.buttons.push({
                name: 'Manual do Convidado',
                icon: 'fa-book-open',
                action: 'popup-html',
                content: formData.manual_html || formData.manual_text
            });
        } else if (state.assets?.manual) {
            config.buttons.push({
                name: 'Manual do Convidado',
                icon: 'fa-book-open',
                action: 'popup-image',
                target: 'manual'
            });
        }

        // RSVP
        if (formData.whatsapp_number) {
            config.buttons.push({
                name: 'Confirmar Presença',
                icon: 'fa-check',
                action: 'popup-whatsapp',
                number: formData.whatsapp_number,
                allowCompanion: formData.allow_companion || false
            });
        } else if (formData.confirmation_link) {
            config.buttons.push({
                name: 'Confirmar Presença',
                icon: 'fa-check',
                action: 'link',
                url: formData.confirmation_link
            });
        }

        // Extra Links
        if (state.extraLinks && state.extraLinks.length > 0) {
            state.extraLinks.forEach(link => {
                config.buttons.push({
                    name: link.button_name,
                    icon: link.icon_code || 'fa-link',
                    action: 'link',
                    url: link.url
                });
            });
        }

        return config;
    }

    /**
     * Substitute all [[VARIABLES]] in template
     */
    function substituteVariables(template, assets, menuConfig, cacheBustId) {
        const state = window.builderState || {};
        const formData = state.formData || {};

        let html = template;

        // Asset paths
        const assetPaths = {};
        for (const [path, blob] of Object.entries(assets)) {
            const key = path.split('/')[0]; // capa, folha, etc.
            assetPaths[key] = path;
        }

        // Replace variables
        html = html.replace(/\[\[TITLE\]\]/g, formData.event_name || 'Convite Digital');
        html = html.replace(/\[\[EVENT_NAME\]\]/g, formData.event_name || '');
        html = html.replace(/\[\[EVENT_DATE\]\]/g, formData.event_date || '');
        html = html.replace(/\[\[EVENT_TIME\]\]/g, formData.event_time || '');
        html = html.replace(/\[\[EVENT_LOCATION\]\]/g, formData.event_location || '');
        html = html.replace(/\[\[EVENT_THEME\]\]/g, formData.event_theme || '');

        // Assets
        html = html.replace(/\[\[COVER_SRC\]\]/g, assetPaths.capa || '');
        html = html.replace(/\[\[SHEET_SRC\]\]/g, assetPaths.folha || '');
        html = html.replace(/\[\[OPENING_SRC\]\]/g, assetPaths.abertura || '');
        html = html.replace(/\[\[LOOP_SRC\]\]/g, assetPaths.loop || '');
        html = html.replace(/\[\[MUSIC_SRC\]\]/g, assetPaths.musica || '');

        // Menu Config
        html = html.replace(/\[\[MENU_CONFIG\]\]/g, JSON.stringify(menuConfig));

        // Watermark
        const watermarkClass = state.buildConfig?.watermarkEnabled !== false ? 'visivel' : 'oculto';
        html = html.replace(/\[\[WATERMARK_CLASS\]\]/g, watermarkClass);

        // Button styling
        html = html.replace(/\[\[BUTTON_COLOR\]\]/g, formData.button_color || '#6366f1');
        html = html.replace(/\[\[BUTTON_SIZE\]\]/g, formData.button_size || 'medium');
        html = html.replace(/\[\[BUTTON_POSITION\]\]/g, formData.button_position || '20');
        html = html.replace(/\[\[SHADOW_COLOR\]\]/g, formData.shadow_gradient_color || 'rgba(0,0,0,0.7)');

        // Countdown timer
        if (formData.countdown_timer && formData.event_date) {
            html = html.replace(/\[\[COUNTDOWN_ENABLED\]\]/g, 'true');
            html = html.replace(/\[\[COUNTDOWN_TARGET\]\]/g, `${formData.event_date}T${formData.event_time || '00:00'}:00`);
        } else {
            html = html.replace(/\[\[COUNTDOWN_ENABLED\]\]/g, 'false');
            html = html.replace(/\[\[COUNTDOWN_TARGET\]\]/g, '');
        }

        return html;
    }

    /**
     * Minimal template fallback
     */
    function getMinimalTemplate() {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[[TITLE]]</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            color: white;
            padding: 2rem;
        }
        img {
            max-width: 90%;
            height: auto;
            border-radius: 12px;
            margin: 2rem 0;
        }
        .buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        button {
            padding: 1rem 2rem;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>[[EVENT_NAME]]</h1>
        <p>[[EVENT_DATE]] às [[EVENT_TIME]]</p>
        <img src="[[COVER_SRC]]" alt="Capa do Convite">
        <div class="buttons" id="menu"></div>
    </div>
    <script>
        const menuConfig = [[MENU_CONFIG]];
        const menuEl = document.getElementById('menu');
        menuConfig.buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.name;
            button.onclick = () => {
                if (btn.action === 'link') {
                    window.open(btn.url, '_blank');
                }
            };
            menuEl.appendChild(button);
        });
    </script>
</body>
</html>`;
    }

    /**
     * Generate ZIP from VFS
     */
    async function generateZIP(vfs) {
        if (!window.JSZip) {
            alert('JSZip not loaded yet, please try again in a moment');
            return null;
        }

        const zip = new JSZip();

        for (const [path, content] of Object.entries(vfs)) {
            if (content instanceof Blob) {
                zip.file(path, content);
            } else if (typeof content === 'string') {
                zip.file(path, content);
            }
        }

        return await zip.generateAsync({ type: 'blob' });
    }

    /**
     * Download ZIP file
     */
    function downloadZIP(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'convite.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * PUBLIC API: Build and Download
     */
    async function buildAndDownload() {
        const state = window.builderState || {};
        const slug = state.formData?.slug || state.formData?.event_name?.toLowerCase().replace(/\s+/g, '-') || 'convite';

        try {
            const vfs = await executeBuild();
            if (!vfs) return;

            const zipBlob = await generateZIP(vfs);
            if (!zipBlob) return;

            downloadZIP(zipBlob, `${slug}.zip`);

            return { success: true, vfs, zipBlob };
        } catch (error) {
            console.error('[Build] Error:', error);
            alert(`Erro ao gerar ZIP: ${error.message}`);
            return null;
        }
    }

    /**
     * PUBLIC API: Build and Publish
     */
    async function buildAndPublish(slug) {
        try {
            const vfs = await executeBuild();
            if (!vfs) return null;

            // Convert VFS to format expected by deploy-github Edge Function
            const files = {};
            for (const [path, content] of Object.entries(vfs)) {
                if (content instanceof Blob) {
                    // Convert blob to base64
                    const reader = new FileReader();
                    const base64 = await new Promise((resolve) => {
                        reader.onloadend = () => resolve(reader.result.split(',')[1]);
                        reader.readAsDataURL(content);
                    });
                    files[path] = base64;
                } else {
                    files[path] = content;
                }
            }

            // Call Supabase deploy-github function
            const { data, error } = await window.supabase.functions.invoke('deploy-github', {
                body: { slug, files }
            });

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('[Build] Publish error:', error);
            throw error;
        }
    }

    // Expose to global scope
    window.AutoBuilderBuild = {
        executeBuild,
        generateZIP,
        downloadZIP,
        buildAndDownload,
        buildAndPublish
    };

    console.log('[Build System] Loaded');

})();
