/**
 * AutoBuilder v4 - History Module
 * =================================
 * Manages GitHub repository history and invitation imports
 */

(function () {
    'use strict';

    // GitHub Configuration
    const GITHUB_OWNER = 'mforgedesign';
    const GITHUB_REPO = 'Convites';
    const GITHUB_BASE_PATH = ''; // Root of repo (invitations are in root)
    const GITHUB_PAGES_BASE = `https://mforgedesign.github.io/Convites/`;
    const GITHUB_REPO_BASE = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/tree/main/`;

    // DOM Elements
    let loadingEl, emptyEl, errorEl, cardsEl, gridEl, errorMessageEl;

    // State
    let invitations = [];
    let isLoading = false;

    /**
     * Initialize history module
     */
    function init() {
        console.log('[History] Initializing...');

        // Get DOM elements
        loadingEl = document.getElementById('history-loading');
        emptyEl = document.getElementById('history-empty');
        errorEl = document.getElementById('history-error');
        cardsEl = document.getElementById('history-cards');
        gridEl = document.getElementById('history-grid');
        errorMessageEl = document.getElementById('history-error-message');

        // Setup refresh button
        const refreshBtn = document.getElementById('btn-refresh-history');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                // Clear existing cards
                gridEl.innerHTML = '';
                invitations = [];
                loadInvitations();
            });
        }

        // Load when window becomes visible
        document.addEventListener('windowChanged', (e) => {
            if (e.detail?.windowId === 'history' && invitations.length === 0) {
                loadInvitations();
            }
        });

        console.log('[History] Initialized');
    }

    /**
     * Load invitations from GitHub - OPTIMIZED (Single Request)
     */
    async function loadInvitations() {
        if (isLoading) return;
        isLoading = true;

        // Show loading state
        showState('loading');

        try {
            console.log('[History] Fetching invitations tree from GitHub...');

            // Fetch entire repository tree in ONE request (recursive=2)
            // This avoids N+1 requests that hit API rate limits (403 error)
            const response = await fetch(
                `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/main?recursive=2`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                // Handle rate limit specifically
                if (response.status === 403) {
                    throw new Error('Limite de acesso ao GitHub atingido. Tente novamente em alguns minutos.');
                }
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const data = await response.json();
            const tree = data.tree;

            // Process tree to find invitations
            // directory structure: slug/file.ext
            const invitationsMap = new Map();

            tree.forEach(item => {
                // Skip root files, hidden folders, and 'builder' folder
                if (!item.path.includes('/') || item.path.startsWith('.') || item.path.startsWith('builder/')) {
                    // Check if it's a root folder (potential invitation)
                    if (item.type === 'tree' && !item.path.includes('/') &&
                        !item.path.startsWith('.') && item.path !== 'builder') {
                        // Initialize group
                        if (!invitationsMap.has(item.path)) {
                            invitationsMap.set(item.path, {
                                slug: item.path,
                                coverUrl: null,
                                files: []
                            });
                        }
                    }
                    return;
                }

                const [slug, filename] = item.path.split('/');

                // If we haven't seen this folder yet (maybe it wasn't listed as tree first)
                if (!invitationsMap.has(slug) && !slug.startsWith('.') && slug !== 'builder') {
                    invitationsMap.set(slug, {
                        slug: slug,
                        coverUrl: null,
                        files: []
                    });
                }

                if (invitationsMap.has(slug)) {
                    const inv = invitationsMap.get(slug);
                    inv.files.push(item);

                    // Check for cover image
                    const lowerName = filename.toLowerCase();
                    if ((lowerName.includes('capa') || lowerName.includes('cover')) &&
                        (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') ||
                            lowerName.endsWith('.png') || lowerName.endsWith('.webp'))) {
                        // Construct raw URL directly
                        inv.coverUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${item.path}`;
                    }
                }
            });

            // Convert to array and sort
            invitations = Array.from(invitationsMap.values())
                .filter(inv => inv.slug !== '404.html' && inv.slug !== 'assets' && inv.slug !== 'static')
                .map(inv => ({
                    slug: inv.slug,
                    coverUrl: inv.coverUrl,
                    liveUrl: `${GITHUB_PAGES_BASE}${inv.slug}/`,
                    repoUrl: `${GITHUB_REPO_BASE}${inv.slug}`,
                    timestamp: Date.now() // We don't get individual timestamps in tree view, using now
                }));

            // Sort alphabetical for now (tree doesn't give dates)
            invitations.sort((a, b) => a.slug.localeCompare(b.slug));

            if (invitations.length === 0) {
                showState('empty');
                isLoading = false;
                return;
            }

            console.log(`[History] Found ${invitations.length} invitations via Tree API`);

            // Show cards container
            showState('cards');

            // Render all
            invitations.forEach(invitation => {
                renderCard(invitation);
            });

            isLoading = false;

        } catch (error) {
            console.error('[History] Error loading invitations:', error);
            showError(error.message);
            isLoading = false;
        }
    }

    /**
     * Load details for a single invitation - DEPRECATED (Merged into loadInvitations)
     */
    async function loadInvitationDetails(folder) {
        // No longer needed with Tree API
    }

    /**
     * Render invitation card with animation
     */
    function renderCard(invitation) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg border border-saas-border shadow-sm overflow-hidden hover:shadow-md transition opacity-0';

        card.innerHTML = `
            <!-- Cover Thumbnail -->
            <div class="aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                ${invitation.coverUrl
                ? `<img src="${invitation.coverUrl}" alt="${invitation.slug}" class="w-full h-full object-cover">`
                : `<i class="fa-solid fa-image text-5xl text-gray-300"></i>`
            }
            </div>

            <!-- Card Body -->
            <div class="p-4">
                <!-- Slug -->
                <h3 class="font-semibold text-gray-800 truncate mb-3" title="${invitation.slug}">
                    ${invitation.slug}
                </h3>

                <!-- Action Buttons -->
                <div class="space-y-2">
                    <!-- View on GitHub -->
                    <a href="${invitation.repoUrl}" target="_blank"
                        class="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                        <i class="fa-brands fa-github"></i>
                        Ver no GitHub
                    </a>

                    <!-- View Online -->
                    <a href="${invitation.liveUrl}" target="_blank"
                        class="w-full flex items-center justify-center gap-2 px-3 py-2 border border-brand-200 bg-brand-50 rounded-md text-sm font-medium text-brand-600 hover:bg-brand-100 transition">
                        <i class="fa-solid fa-external-link-alt"></i>
                        Ver Online
                    </a>

                    <!-- Import to Builder -->
                    <button onclick="window.History.importInvitation('${invitation.slug}')"
                        class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-md text-sm font-medium hover:shadow-md transition">
                        <i class="fa-solid fa-download"></i>
                        Importar para Builder
                    </button>
                </div>
            </div>
        `;

        gridEl.appendChild(card);

        // Fade in animation
        requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s ease-in-out';
            card.style.opacity = '1';
        });
    }

    /**
     * Import invitation to builder - FULL IMPLEMENTATION
     */
    async function importInvitation(slug) {
        try {
            const message = `Importar o convite "${slug}" para o builder?\n\n` +
                `⚠️ ATENÇÃO: Isso irá substituir todos os dados atuais!\n\n` +
                `O que será importado:\n` +
                `✓ Todos os campos do formulário\n` +
                `✓ Imagens (capa, folha, etc)\n` +
                `✓ Vídeos (abertura, loop)\n` +
                `✓ Áudio (música)\n` +
                `✓ Links extras\n` +
                `✓ Configurações visuais`;

            if (!confirm(message)) {
                return;
            }

            // Show loading indicator
            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
            loadingMsg.innerHTML = `
                <div class="bg-white rounded-lg p-6 max-w-md">
                    <div class="flex items-center gap-4">
                        <i class="fa-solid fa-spinner fa-spin text-3xl text-brand-500"></i>
                        <div>
                            <h3 class="font-semibold text-lg">Importando convite...</h3>
                            <p class="text-sm text-gray-500" id="import-status">Baixando arquivos do GitHub...</p>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(loadingMsg);

            const updateStatus = (msg) => {
                const statusEl = document.getElementById('import-status');
                if (statusEl) statusEl.textContent = msg;
            };

            console.log(`[History] Starting import of ${slug}...`);

            // Step 1: Fetch files list from GitHub
            updateStatus('Listando arquivos...');
            const filesResponse = await fetch(
                `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${slug}`,
                { headers: { 'Accept': 'application/vnd.github.v3+json' } }
            );

            if (!filesResponse.ok) {
                throw new Error('Não foi possível acessar os arquivos do convite');
            }

            const files = await filesResponse.json();

            // Step 2: Find and download data.json
            updateStatus('Baixando configurações...');
            const dataFile = files.find(f => f.name === 'data.json' || f.name === 'data');

            let importedData = {};
            if (dataFile) {
                const dataResponse = await fetch(dataFile.download_url);
                if (dataResponse.ok) {
                    importedData = await dataResponse.json();
                    console.log('[History] Loaded data.json:', importedData);
                }
            }

            // Step 3: Reset environment
            updateStatus('Limpando ambiente atual...');
            console.log('[History] Resetting environment...');

            // Reset form if available
            if (window.FormManager && typeof window.FormManager.reset === 'function') {
                window.FormManager.reset();
            }

            // Clear builder state
            if (window.builderState) {
                window.builderState = {
                    assets: {},
                    formData: {},
                    linksExtras: [],
                    conversationHistory: []
                };
            }

            // Step 4: Download and set assets
            updateStatus('Importando imagens e vídeos...');
            const assetTypes = {
                'capa': ['capa'],
                'folha_vazia': ['folha', 'sheet'],
                'folha_preenchida': ['preenchida', 'filled'],
                'folha_animada': ['animada', 'animated'],
                'abertura': ['abertura', 'intro', 'opening'],
                'loop': ['loop', 'background'],
                'musica': ['musica', 'music', 'audio'],
                'presentes': ['presentes', 'gifts'],
                'manual': ['manual']
            };

            for (const [context, patterns] of Object.entries(assetTypes)) {
                const assetFile = files.find(f => {
                    const lowerName = f.name.toLowerCase();
                    return patterns.some(pattern => lowerName.includes(pattern));
                });

                if (assetFile) {
                    console.log(`[History] Found ${context}:`, assetFile.name);

                    // Set the URL in state
                    if (window.builderState) {
                        window.builderState.assets[context] = assetFile.download_url;
                    }

                    // Update dropzone preview if element exists
                    const dropzoneId = {
                        'capa': 'cover-dropzone',
                        'folha_vazia': 'leaf-dropzone',
                        'folha_preenchida': 'fill-image-dropzone',
                        'folha_animada': 'fill-video-dropzone',
                        'abertura': 'intro-video-dropzone',
                        'loop': 'loop-video-dropzone',
                        'musica': 'music-dropzone',
                        'presentes': 'gifts-image-dropzone',
                        'manual': 'manual-image-dropzone'
                    }[context];

                    if (dropzoneId) {
                        const dropzone = document.getElementById(dropzoneId);
                        if (dropzone && window.updateDropzonePreview) {
                            const type = assetFile.name.match(/\.(mp4|webm)$/i) ? 'video' :
                                assetFile.name.match(/\.(mp3|m4a|wav)$/i) ? 'audio' : 'image';
                            window.updateDropzonePreview(dropzone, assetFile.download_url, type);
                        }
                    }
                }
            }

            // Step 5: Hydrate form data
            if (importedData && Object.keys(importedData).length > 0) {
                updateStatus('Preenchendo formulário...');
                console.log('[History] Hydrating form data...');

                // Fill form fields
                for (const [key, value] of Object.entries(importedData)) {
                    const input = document.querySelector(`[data-field="${key}"], [name="${key}"], #form-${key}`);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = !!value;
                        } else if (input.type === 'color') {
                            input.value = value || '#000000';
                        } else {
                            input.value = value || '';
                        }

                        // Trigger change event
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

                // Restore links extras if available
                if (importedData.linksExtras && Array.isArray(importedData.linksExtras)) {
                    if (window.LinksExtras && typeof window.LinksExtras.restore === 'function') {
                        window.LinksExtras.restore(importedData.linksExtras);
                    }
                }

                // Update state
                if (window.builderState) {
                    window.builderState.formData = { ...importedData };

                    // Add media assets to form data (so previews can sync)
                    if (window.builderState.assets) {
                        if (window.builderState.assets.presentes) importedData.media_presentes = { url: window.builderState.assets.presentes, type: 'image' };
                        if (window.builderState.assets.manual) importedData.media_manual = { url: window.builderState.assets.manual, type: 'image' };
                    }
                }
            }

            // Step 6: Navigate to form and trigger preview update
            updateStatus('Finalizando...');

            // Trigger state update event
            document.dispatchEvent(new CustomEvent('stateUpdated', {
                detail: { source: 'import', data: importedData }
            }));

            // Remove loading
            document.body.removeChild(loadingMsg);

            // Show success and navigate
            alert(`✅ Convite "${slug}" importado com sucesso!\n\nVocê pode agora editar e republicar.`);

            if (window.AutoBuilderNav && typeof window.AutoBuilderNav.showWindow === 'function') {
                window.AutoBuilderNav.showWindow('form');
            }

            console.log('[History] Import completed successfully');

        } catch (error) {
            console.error('[History] Import error:', error);

            // Remove loading if exists
            const loadingMsg = document.querySelector('.fixed.inset-0.bg-black\\/50');
            if (loadingMsg) document.body.removeChild(loadingMsg);

            alert(`❌ Erro ao importar convite:\n\n${error.message}\n\nVerifique o console para mais detalhes.`);
        }
    }

    /**
     * Show specific state
     */
    function showState(state) {
        loadingEl.classList.add('hidden');
        emptyEl.classList.add('hidden');
        errorEl.classList.add('hidden');
        cardsEl.classList.add('hidden');

        switch (state) {
            case 'loading':
                loadingEl.classList.remove('hidden');
                break;
            case 'empty':
                emptyEl.classList.remove('hidden');
                break;
            case 'error':
                errorEl.classList.remove('hidden');
                break;
            case 'cards':
                cardsEl.classList.remove('hidden');
                break;
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        errorMessageEl.textContent = message;
        showState('error');
    }

    // ==================== PUBLIC API ====================

    window.History = {
        init,
        loadInvitations,
        importInvitation
    };

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[History] Module loaded');

})();
