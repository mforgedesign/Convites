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
     * Load invitations from GitHub - SEQUENTIAL LAZY LOADING
     */
    async function loadInvitations() {
        if (isLoading) return;
        isLoading = true;

        // Show loading state
        showState('loading');

        try {
            console.log('[History] Fetching invitations from GitHub...');

            // Get list of folders in root directory
            const response = await fetch(
                `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const contents = await response.json();

            // Filter for directories (potential invitations)
            const folders = contents.filter(item =>
                item.type === 'dir' &&
                !item.name.startsWith('.') &&
                !item.name.startsWith('builder') &&
                item.name !== '404.html' &&
                item.name !== 'README.md'
            );

            if (folders.length === 0) {
                showState('empty');
                isLoading = false;
                return;
            }

            // Sort folders by name (newest first)
            folders.sort((a, b) => b.name.localeCompare(a.name));

            // Show cards container BEFORE loading starts
            showState('cards');
            invitations = [];

            // SEQUENTIAL LAZY LOADING: Load and render ONE AT A TIME
            console.log(`[History] Starting sequential load of ${folders.length} invitations...`);

            for (let i = 0; i < folders.length; i++) {
                // Load this invitation
                await loadInvitationDetails(folders[i]);

                // Small delay between requests (rate limiting + smoother UX)
                if (i < folders.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }

            console.log(`[History] Completed loading ${invitations.length} invitations`);
            isLoading = false;

        } catch (error) {
            console.error('[History] Error loading invitations:', error);
            showError(error.message);
            isLoading = false;
        }
    }

    /**
     * Load details for a single invitation and render immediately
     */
    async function loadInvitationDetails(folder) {
        try {
            const slug = folder.name;

            console.log(`[History] Loading ${slug}...`);

            // Try to find cover image
            const filesResponse = await fetch(
                `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${slug}`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!filesResponse.ok) {
                console.warn(`[History] Could not load files for ${slug}`);
                return;
            }

            const files = await filesResponse.json();

            // Find capa image (may have cache-busted filename)
            const capaFile = files.find(f =>
                f.name.toLowerCase().startsWith('capa') &&
                (f.name.endsWith('.jpg') || f.name.endsWith('.png') || f.name.endsWith('.webp'))
            );

            const invitation = {
                slug,
                coverUrl: capaFile ? capaFile.download_url : null,
                liveUrl: `${GITHUB_PAGES_BASE}${slug}/`,
                repoUrl: `${GITHUB_REPO_BASE}${slug}`,
                timestamp: folder.sha
            };

            invitations.push(invitation);

            // RENDER IMMEDIATELY (this is the key!)
            renderCard(invitation);

            console.log(`[History] ✓ Rendered ${slug}`);

        } catch (error) {
            console.error(`[History] Error loading ${folder.name}:`, error);
        }
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

            if (window.AutoBuilderNav && typeof window.AutoBuilderNav.navigateTo === 'function') {
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
