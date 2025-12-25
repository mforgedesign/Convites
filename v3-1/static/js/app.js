// ===== SUPABASE EDGE FUNCTIONS CONFIGURATION =====\r\n// Esta é a versão WEB do AutoBuilder 3.1\r\n// Todas as chamadas de API são feitas para Supabase Edge Functions\r\n\r\nconst SUPABASE_URL = 'https://pvfzyheznsoyxsufyqzu.supabase.co';\r\nconst SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2Znp5aGV6bnNveXhzdWZ5cXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NjY3OTMsImV4cCI6MjA4MjI0Mjc5M30.IZK9MQOKe8jimDgal-czPR3umsGfSBLCK9uvuQAZ4QA';\r\n\r\n// Mapeamento de endpoints Flask -> Edge Functions\r\nconst API_ENDPOINTS = {\r\n    '/api/generate-prompts': `${SUPABASE_URL}/functions/v1/generate-prompts`,\r\n    '/api/generate-image': `${SUPABASE_URL}/functions/v1/generate-image`,\r\n    '/api/generate-video': `${SUPABASE_URL}/functions/v1/generate-video`,\r\n    '/api/fill-leaf': `${SUPABASE_URL}/functions/v1/fill-leaf`,\r\n    '/api/generate-manual': `${SUPABASE_URL}/functions/v1/generate-manual`,\r\n    '/api/suggest-icon': `${SUPABASE_URL}/functions/v1/suggest-icon`,\r\n    '/api/generate-whatsapp-link': `${SUPABASE_URL}/functions/v1/generate-whatsapp-link`,\r\n    '/api/check-slug-existence': `${SUPABASE_URL}/functions/v1/check-slug`,\r\n    '/api/deploy-github': `${SUPABASE_URL}/functions/v1/deploy-github`,\r\n    '/api/chatbot': `${SUPABASE_URL}/functions/v1/chatbot`,\r\n};\r\n\r\n// Funcionalidades desabilitadas na versão web\r\nconst DISABLED_ENDPOINTS = [\r\n    '/api/download-music',\r\n    '/api/audio-duration',\r\n    '/api/trim-audio',\r\n    '/api/restore-audio',\r\n    '/api/run-dashboard',\r\n    '/api/save-state',\r\n    '/api/load-state',\r\n    '/api/clear-cache',\r\n    '/api/custom-index',\r\n];\r\n\r\n// Wrapper para chamadas fetch que redireciona para Supabase Edge Functions\r\nconst originalFetch = window.fetch;\r\nwindow.fetch = async function(url, options = {}) {\r\n    // Verifica se é uma chamada para API local\r\n    if (typeof url === 'string' && url.startsWith('/api/')) {\r\n        // Verifica se o endpoint está desabilitado\r\n        const isDisabled = DISABLED_ENDPOINTS.some(e => url.startsWith(e));\r\n        if (isDisabled) {\r\n            console.warn(`[Web Version] Endpoint desabilitado: ${url}`);\r\n            return new Response(JSON.stringify({ \r\n                error: 'Esta funcionalidade não está disponível na versão web.',\r\n                disabled: true \r\n            }), { \r\n                status: 503,\r\n                headers: { 'Content-Type': 'application/json' }\r\n            });\r\n        }\r\n        \r\n        // Redireciona para Supabase Edge Functions\r\n        const edgeUrl = API_ENDPOINTS[url];\r\n        if (edgeUrl) {\r\n            console.log(`[Web Version] Redirecionando ${url} -> ${edgeUrl}`);\r\n            return originalFetch(edgeUrl, {\r\n                ...options,\r\n                headers: {\r\n                    ...options.headers,\r\n                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,\r\n                    'apikey': SUPABASE_ANON_KEY,\r\n                }\r\n            });\r\n        }\r\n    }\r\n    \r\n    // Chamada original para URLs não mapeadas\r\n    return originalFetch(url, options);\r\n};\r\n\r\n// ===== CUSTOM NOTIFICATION SYSTEM =====

/**
 * Show a toast notification (non-blocking, auto-dismiss)
 * @param {string} message - The message to display
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {number} duration - Duration in ms (default 5000)
 */
function showToast(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${icons[type]} toast-icon"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close"><i class="fa-solid fa-times"></i></button>
    `;

    container.appendChild(toast);

    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    const removeToast = () => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    };

    closeBtn.addEventListener('click', removeToast);

    // Error messages get longer duration but still auto-dismiss
    const actualDuration = type === 'error' ? 10000 : duration;
    setTimeout(removeToast, actualDuration);
}

// Flag to prevent auto-download during import
let isImporting = false;

// ===== DYNAMIC EXTRA LINKS SYSTEM =====
let extraLinksCount = 0;

function addExtraLink(linkData = null) {
    const container = document.getElementById('extra-links-container');
    if (!container) return;

    extraLinksCount++;
    const id = extraLinksCount;

    const row = document.createElement('div');
    row.className = 'extra-link-row grid grid-cols-6 gap-2 items-end bg-gray-800/50 p-2 rounded-lg';
    row.dataset.linkId = id;

    row.innerHTML = `
        <div class="form-group col-span-2 mb-0">
            <label class="text-xs text-gray-400">URL</label>
            <input type="url" class="extra-link-url" placeholder="https://..." value="${linkData?.link || ''}">
        </div>
        <div class="form-group col-span-2 mb-0">
            <label class="text-xs text-gray-400">Nome</label>
            <input type="text" class="extra-link-name" placeholder="Ex: Instagram" value="${linkData?.name || ''}">
        </div>
        <div class="form-group col-span-1 mb-0">
            <label class="text-xs text-gray-400">Ícone</label>
            <input type="text" class="extra-link-icon" placeholder="fa-solid fa-star" value="${linkData?.icon || ''}">
        </div>
        <div class="col-span-1 flex justify-end">
            <button type="button" class="btn-remove-extra-link bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 px-3 rounded transition-colors" title="Remover">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;

    // Remove button handler
    row.querySelector('.btn-remove-extra-link').addEventListener('click', () => {
        row.remove();
        if (typeof saveMediaUrls === 'function') saveMediaUrls();
    });

    // Auto-save on input change
    row.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
            if (typeof saveMediaUrls === 'function') saveMediaUrls();
        });
    });

    container.appendChild(row);
    return row;
}

function getExtraLinks() {
    const container = document.getElementById('extra-links-container');
    if (!container) return [];

    const links = [];
    container.querySelectorAll('.extra-link-row').forEach(row => {
        const url = row.querySelector('.extra-link-url')?.value?.trim();
        const name = row.querySelector('.extra-link-name')?.value?.trim() || 'Link Extra';
        const icon = row.querySelector('.extra-link-icon')?.value?.trim() || 'fa-solid fa-star';

        if (url) {
            links.push({ link: url, name: name, icon: icon });
        }
    });

    return links;
}

function clearExtraLinks() {
    const container = document.getElementById('extra-links-container');
    if (container) container.innerHTML = '';
    extraLinksCount = 0;
}

function restoreExtraLinks(linksArray) {
    clearExtraLinks();
    if (Array.isArray(linksArray)) {
        linksArray.forEach(link => addExtraLink(link));
    }
}

/**
 * Show a confirmation modal (blocking, requires user choice)
 * @param {string} message - The message to display
 * @param {object} options - Configuration options
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
 */
function showConfirm(message, options = {}) {
    return new Promise((resolve) => {
        const {
            title = 'Confirmação',
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            confirmClass = 'modal-btn-primary',
            icon = 'fa-question-circle'
        } = options;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-title">
                    <i class="fa-solid ${icon}"></i>
                    ${title}
                </div>
                <div class="modal-message">${message}</div>
                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-secondary" data-action="cancel">${cancelText}</button>
                    <button class="modal-btn ${confirmClass}" data-action="confirm">${confirmText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Focus the confirm button
        overlay.querySelector('[data-action="confirm"]').focus();

        const handleClick = (e) => {
            const action = e.target.dataset.action;
            if (action) {
                overlay.remove();
                resolve(action === 'confirm');
            }
        };

        // ESC key to cancel
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                resolve(false);
                document.removeEventListener('keydown', handleKeydown);
            }
        };

        overlay.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleKeydown);
    });
}

document.addEventListener('DOMContentLoaded', () => {

    // --- Tab Switching Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // WhatsApp Link Generation Trigger
    let generatedWhatsAppLink = localStorage.getItem('generatedWhatsAppLink') || '';

    // Manual Thread ID for GPT context persistence
    let manualThreadId = localStorage.getItem('manualThreadId') || null;

    // === GIFT LINK/IMAGE TOGGLE LOGIC ===
    let giftMode = localStorage.getItem('giftMode') || 'none'; // 'none', 'link', 'image'

    // === MANUAL TEXT/IMAGE TOGGLE LOGIC ===
    let manualMode = localStorage.getItem('manualMode') || 'text'; // 'text' or 'image'

    function updateManualModeDisplay() {
        const display = document.getElementById('manual-mode-display');
        const text = document.getElementById('manual-mode-text');
        const textSection = document.getElementById('manual-text-section');

        if (!display || !text) return;

        if (manualMode === 'image') {
            display.classList.remove('border-green-500', 'border-gray-700');
            display.classList.add('border-blue-500');
            text.innerHTML = '<i class="fa-solid fa-image text-blue-400"></i> Modo: Imagem (abre popup com imagem)';
            text.className = 'text-sm font-semibold text-blue-400';
            if (textSection) textSection.classList.add('opacity-50');
        } else {
            display.classList.remove('border-blue-500', 'border-gray-700');
            display.classList.add('border-green-500');
            text.innerHTML = '<i class="fa-solid fa-wand-magic text-green-400"></i> Modo: Texto IA (abre popup com texto)';
            text.className = 'text-sm font-semibold text-green-400';
            if (textSection) textSection.classList.remove('opacity-50');
        }
    }

    async function deleteManualImage() {
        const preview = document.getElementById('preview-manual-image');
        const removeBtn = document.getElementById('btn-remove-manual-image');

        if (preview) { preview.src = ''; preview.classList.add('hidden'); }
        if (removeBtn) removeBtn.classList.add('hidden');

        localStorage.removeItem('manualImageUrl');
    }

    function initManualMode() {
        try {
            const savedMode = localStorage.getItem('manualMode');
            const savedImageUrl = localStorage.getItem('manualImageUrl');

            if (savedMode === 'image' && savedImageUrl) {
                manualMode = 'image';
                const preview = document.getElementById('preview-manual-image');
                const removeBtn = document.getElementById('btn-remove-manual-image');

                if (preview) { preview.src = savedImageUrl + '?t=' + Date.now(); preview.classList.remove('hidden'); }
                if (removeBtn) removeBtn.classList.remove('hidden');
            } else {
                manualMode = 'text';
            }
            updateManualModeDisplay();
        } catch (e) { console.error("Error init manual mode:", e); }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Check if we are leaving the form tab (id='tab-form')
            const targetTab = btn.getAttribute('data-tab');
            const currentActiveBtn = document.querySelector('.tab-btn.active');

            // If we are currently on tab-form and switching to another tab
            // if (currentActiveBtn && currentActiveBtn.getAttribute('data-tab') === 'tab-form' && targetTab !== 'tab-form') {
            //    // Call without await so it runs in background
            //    generateWhatsAppLink();
            // }

            // Auto-download music check when switching tabs
            // We check if we are leaving a tab where music might have been entered (form or music tab)
            const currentTabContent = document.querySelector('.tab-content.active');
            if (currentTabContent && (currentTabContent.id === 'tab-music' || currentTabContent.id === 'tab-form')) {
                const musicVal = document.getElementById('input-music').value;
                const audioEl = document.getElementById('preview-audio');
                const audioHasSource = audioEl && audioEl.src && audioEl.src.includes('musica.mp3');

                // Skip if importing or music already exists
                if (musicVal && !musicDownloadTriggered && !isImporting && !audioHasSource) {
                    musicDownloadTriggered = true;
                    // Run in background
                    downloadMusicAutomatically(musicVal);
                }
            }

            // Standard Tab Switching
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => {
                c.classList.remove('active');
                c.classList.add('hidden');
            });
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            targetContent.classList.remove('hidden');
            targetContent.classList.add('active');
        });
    });

    // AI WhatsApp Link Generation Removed to save tokens
    // async function generateWhatsAppLink() { ... }

    // --- Data Persistence ---
    const formInputs = document.querySelectorAll('#tab-form input, #tab-form textarea');

    // --- Media URL Persistence ---
    // --- Media URL Persistence (Server-Side) ---
    async function saveMediaUrls() {
        const mediaElements = {
            'media-preview-cover': 'preview-cover',
            'media-preview-leaf-empty': 'preview-leaf-empty',
            'media-preview-leaf-filled': 'preview-leaf-filled',
            'media-preview-anim-cover': 'preview-anim-cover',
            'media-preview-anim-leaf': 'preview-anim-leaf',
            'media-preview-audio': 'preview-audio',
            'media-preview-gifts': 'preview-gifts-image' // FIX: Add Gifts Image
        };

        const stateData = {};

        for (const [key, elementId] of Object.entries(mediaElements)) {
            const element = document.getElementById(elementId);
            if (element && element.src && !element.src.endsWith('/') && !element.src.endsWith(window.location.pathname)) {
                // Remove ?t= timestamp
                const cleanUrl = element.src.split('?t=')[0];
                if (cleanUrl.includes('/output/') || cleanUrl.startsWith('data:')) {
                    stateData[key] = cleanUrl;
                }
            }
        }

        // Also save other critical state
        if (processedManualText) stateData['processedManualText'] = processedManualText;
        if (manualThreadId) stateData['manualThreadId'] = manualThreadId;
        if (giftMode) stateData['giftMode'] = giftMode; // FIX: Save Gift Mode

        // New: Save Shadow Color
        const shadowColor = document.getElementById('input-shadow-color')?.value;
        if (shadowColor) stateData['shadowColor'] = shadowColor;

        // Save Timer State
        const showTimer = document.getElementById('check-show-timer')?.checked;
        if (showTimer !== undefined) stateData['showTimer'] = showTimer;

        // Save Extra Links
        const extraLinks = getExtraLinks();
        if (extraLinks.length > 0) stateData['extraLinks'] = extraLinks;

        try {
            await fetch('/api/save-state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stateData)
            });
            console.log('State saved to server.');
        } catch (e) {
            console.error('Error saving state:', e);
        }
    }

    async function loadMediaUrls() {
        const mediaElements = {
            'media-preview-cover': { id: 'preview-cover', downloadId: 'download-cover', isVideo: false, isAudio: false },
            'media-preview-leaf-empty': { id: 'preview-leaf-empty', downloadId: null, isVideo: false, isAudio: false },
            'media-preview-leaf-filled': { id: 'preview-leaf-filled', downloadId: 'download-leaf-filled', isVideo: false, isAudio: false },
            'media-preview-anim-cover': { id: 'preview-anim-cover', downloadId: 'download-anim-cover', isVideo: true, isAudio: false },
            'media-preview-anim-leaf': { id: 'preview-anim-leaf', downloadId: 'download-anim-leaf', isVideo: true, isAudio: false },
            'media-preview-audio': { id: 'preview-audio', downloadId: null, isVideo: false, isAudio: true },
            'media-preview-gifts': { id: 'preview-gifts-image', downloadId: 'download-gifts-image', isVideo: false, isAudio: false } // FIX: Load Gifts Image
        };

        try {
            const response = await fetch('/api/load-state');
            const stateData = await response.json();

            if (stateData.processedManualText) {
                processedManualText = stateData.processedManualText;
                processedManualText = stateData.processedManualText;
                localStorage.setItem('processedManualText', processedManualText);
                const finalInput = document.getElementById('input-manual-final');
                if (finalInput) finalInput.value = processedManualText;
            }
            if (stateData.manualThreadId) {
                manualThreadId = stateData.manualThreadId;
                localStorage.setItem('manualThreadId', manualThreadId);
            }
            if (stateData.giftMode) {
                giftMode = stateData.giftMode;
                localStorage.setItem('giftMode', giftMode);
                updateGiftModeDisplay(); // Ensure UI updates
            }

            // New: Restore Shadow Color
            if (stateData.shadowColor) {
                const shadowInput = document.getElementById('input-shadow-color');
                if (shadowInput) shadowInput.value = stateData.shadowColor;
            }

            // Restore Timer State
            if (stateData.showTimer !== undefined) {
                const timerCheck = document.getElementById('check-show-timer');
                if (timerCheck) timerCheck.checked = stateData.showTimer;
            }

            // Restore Extra Links
            if (stateData.extraLinks && Array.isArray(stateData.extraLinks)) {
                restoreExtraLinks(stateData.extraLinks);
            }

            // Sync Manual Input Mirror
            const manualInput = document.getElementById('input-manual');
            const manualInputSync = document.getElementById('input-manual-sync');
            if (manualInput && manualInput.value && manualInputSync) {
                manualInputSync.value = manualInput.value;
            }

            let loadedCount = 0;
            for (const [storageKey, config] of Object.entries(mediaElements)) {
                // Read from stateData instead of localStorage
                const url = stateData[storageKey];

                if (url) {
                    const element = document.getElementById(config.id);
                    if (element) {
                        // Add timestamp to force reload
                        const urlWithTs = url + '?t=' + Date.now();
                        element.src = urlWithTs;
                        element.classList.remove('hidden');
                        if (config.isAudio) element.load();

                        // Also show download button if exists
                        if (config.downloadId) {
                            const downloadBtn = document.getElementById(config.downloadId);
                            if (downloadBtn) {
                                downloadBtn.href = url;
                                downloadBtn.classList.remove('hidden');
                            }
                        }

                        // Show music status if audio loaded successfully
                        if (config.isAudio) {
                            const musicStatus = document.getElementById('music-status');
                            const audioEl = element;

                            // Only show music status after we verify audio can load
                            audioEl.addEventListener('loadedmetadata', () => {
                                if (audioEl.duration > 0 && musicStatus) {
                                    musicStatus.classList.remove('hidden');
                                }
                            }, { once: true });

                            // Hide status if audio fails to load
                            audioEl.addEventListener('error', () => {
                                if (musicStatus) musicStatus.classList.add('hidden');
                                audioEl.src = '';
                                console.log('Music file not found or invalid');
                            }, { once: true });
                        }

                        loadedCount++;
                    }
                }
            }
            if (loadedCount > 0) {
                console.log(`Loaded ${loadedCount} media URLs from server state`);
            }
        } catch (e) {
            console.error('Error loading state from server:', e);
        }
    }

    function loadData() {
        formInputs.forEach(input => {
            const savedValue = localStorage.getItem(input.id);
            if (savedValue) input.value = savedValue;
        });
        // Load prompts
        ['prompt-cover', 'prompt-leaf', 'prompt-anim-cover', 'prompt-anim-leaf'].forEach(id => {
            const val = localStorage.getItem(id);
            if (val) document.getElementById(id).value = val;
        });
        updateGiftLinkDisplay();
    }
    loadData();
    loadMediaUrls(); // Restore media previews from localStorage

    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            localStorage.setItem(input.id, input.value);
            localStorage.setItem('lastFormUpdate', Date.now()); // Track form update time
            updateGiftLinkDisplay();
        });
    });

    // --- Field Synchronization ---
    const syncFields = {
        'input-names': 'prompt-names-sync',
        'input-phrase': 'prompt-phrase-sync',
        'input-date': 'prompt-date-sync',
        'input-time': 'prompt-time-sync',
        'input-location': 'prompt-location-sync',
        'prompt-cover': 'prompt-cover-sync',
        'prompt-leaf': 'prompt-leaf-sync',
        'prompt-fill-leaf': 'prompt-fill-leaf-sync',
        'input-gift-suggestions': 'gift-suggestions-sync'
    };

    Object.entries(syncFields).forEach(([mainId, syncId]) => {
        const mainEl = document.getElementById(mainId);
        const syncEl = document.getElementById(syncId);

        if (mainEl && syncEl) {
            // Main -> Sync
            mainEl.addEventListener('input', () => {
                syncEl.value = mainEl.value;
                localStorage.setItem(syncEl.id, syncEl.value);
            });

            // Sync -> Main
            syncEl.addEventListener('input', () => {
                mainEl.value = syncEl.value;
                localStorage.setItem(mainEl.id, mainEl.value);
                mainEl.dispatchEvent(new Event('change'));
            });
        }
    });

    document.querySelectorAll('#tab-prompts textarea').forEach(area => {
        area.addEventListener('input', () => localStorage.setItem(area.id, area.value));
    });

    // --- Clear Cache Button ---
    const btnClearCache = document.getElementById('btn-clear-cache');
    if (btnClearCache) {
        btnClearCache.addEventListener('click', async () => {
            const confirmed = await showConfirm(
                'Tem certeza que deseja limpar todos os dados e criar um novo convite?<br><br>Isso irá apagar:<br>• Todos os campos do formulário<br>• Imagens e vídeos gerados<br>• Arquivos temporários',
                { title: 'Limpar Cache', confirmText: 'Limpar Tudo', confirmClass: 'modal-btn-danger', icon: 'fa-trash' }
            );
            if (!confirmed) return;

            btnClearCache.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Limpando...';
            btnClearCache.disabled = true;

            try {
                // Clear backend cache
                await fetch('/api/clear-cache', { method: 'POST' });

                // Clear localStorage
                localStorage.clear();

                // Reload page
                location.reload();
            } catch (error) {
                console.error('Error clearing cache:', error);
                showToast('Erro ao limpar cache: ' + error.message, "error");
                btnClearCache.innerHTML = '<i class="fa-solid fa-trash"></i> Novo Convite';
                btnClearCache.disabled = false;
            }
        });
    }

    // --- Dynamic Extra Links Button ---
    // (Event listener moved to the EXTRA LINKS LOGIC section below to prevent duplicate registration)

    // --- Button Customization Logic ---
    const inputButtonSize = document.getElementById('input-button-size');
    const sizeDisplay = document.getElementById('size-display');

    if (inputButtonSize && sizeDisplay) {
        function updateSizeDisplay() {
            sizeDisplay.textContent = parseFloat(inputButtonSize.value).toFixed(1) + 'x';
        }
        inputButtonSize.addEventListener('input', updateSizeDisplay);
        // Initial update in case of reload
        setTimeout(updateSizeDisplay, 100);
    }

    // --- Custom Index Upload Logic ---
    const btnUploadCustomIndex = document.getElementById('btn-upload-custom-index');
    const inputCustomIndex = document.getElementById('input-custom-index');
    const customIndexStatus = document.getElementById('custom-index-status');
    const btnRemoveCustomIndex = document.getElementById('btn-remove-custom-index');
    const customIndexUploadArea = document.getElementById('custom-index-upload-area');

    async function updateCustomIndexUI() {
        try {
            const response = await fetch('/api/custom-index');
            const data = await response.json();
            if (data.exists) {
                customIndexStatus.classList.remove('hidden');
                customIndexUploadArea.classList.add('hidden');
            } else {
                customIndexStatus.classList.add('hidden');
                customIndexUploadArea.classList.remove('hidden');
            }
        } catch (e) {
            console.error('Error checking custom index status:', e);
        }
    }

    if (btnUploadCustomIndex && inputCustomIndex) {
        // Trigger file input on button click
        btnUploadCustomIndex.addEventListener('click', () => inputCustomIndex.click());

        // Handle file selection
        inputCustomIndex.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
                btnUploadCustomIndex.disabled = true;
                btnUploadCustomIndex.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

                const response = await fetch('/api/custom-index', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    showToast('Template personalizado carregado!', 'success');
                    updateCustomIndexUI();
                } else {
                    showToast(data.error || 'Erro ao carregar template', 'error');
                }
            } catch (err) {
                showToast('Erro ao enviar arquivo', 'error');
            } finally {
                btnUploadCustomIndex.disabled = false;
                btnUploadCustomIndex.innerHTML = '<i class="fa-solid fa-code"></i> Usar index.html Personalizado';
                inputCustomIndex.value = ''; // Reset input
            }
        });
    }

    if (btnRemoveCustomIndex) {
        btnRemoveCustomIndex.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/custom-index', { method: 'DELETE' });
                const data = await response.json();
                if (data.success) {
                    showToast('Template personalizado removido', 'info');
                    updateCustomIndexUI();
                }
            } catch (err) {
                showToast('Erro ao remover template', 'error');
            }
        });
    }

    // Check custom index status on page load
    setTimeout(updateCustomIndexUI, 500);

    // --- Button Preview Modal ---
    const btnPreviewButtons = document.getElementById('btn-preview-buttons');
    const previewModal = document.getElementById('preview-buttons-modal');
    const closePreviewModal = document.getElementById('close-preview-modal');
    const previewModalGrid = document.getElementById('preview-modal-grid');
    const previewModalVideo = document.getElementById('preview-modal-video');
    const previewContainer = document.getElementById('preview-modal-buttons-container');

    if (btnPreviewButtons && previewModal) {
        btnPreviewButtons.addEventListener('click', () => {
            previewModal.classList.remove('hidden');

            // 1. Setup Background
            const animLeafPreview = document.getElementById('preview-anim-leaf');
            // Check if we have a generated video URL available
            if (animLeafPreview && !animLeafPreview.classList.contains('hidden') && animLeafPreview.src && animLeafPreview.src.length > 50) {
                // Length check is a weak check for placeholder vs real URL, but app.js handles hidden class well
                previewModalVideo.src = animLeafPreview.src;
                previewModalVideo.classList.remove('hidden');
                previewModalVideo.play().catch(e => console.log('Autoplay blocked', e));
            } else {
                previewModalVideo.classList.add('hidden');
                previewModalVideo.pause();
            }

            // 2. Generate Buttons
            const color = document.getElementById('input-button-color').value;
            const size = parseFloat(document.getElementById('input-button-size').value) || 1.0;
            const offset = document.getElementById('input-buttons-offset').value || 0;

            // Apply offset to container
            if (previewContainer) previewContainer.style.bottom = offset + 'px';

            const buttons = [];

            // Helper to add if valid
            const addIfValid = (id, icon, label, isManual = false) => {
                const el = document.getElementById('input-' + id);
                if (el && el.value.trim()) {
                    buttons.push({
                        icon,
                        label,
                        link: el.value.trim(),
                        isManual
                    });
                }
            };

            addIfValid('maps', 'fa-solid fa-location-dot', 'Local');

            // Fix: Add Gifts button if Link OR Image mode
            const giftsInput = document.getElementById('input-gifts');
            if ((giftsInput && giftsInput.value.trim()) || giftMode === 'image') {
                buttons.push({
                    icon: 'fa-solid fa-gift',
                    label: 'Presentes',
                    link: (giftMode === 'image') ? '#' : giftsInput.value.trim(),
                    isManual: false,
                    isGiftImage: (giftMode === 'image')
                });
            }

            // WhatsApp (Special Logic)
            const waLinkInput = document.getElementById('input-confirm-link');
            const waNumInput = document.getElementById('input-whatsapp');
            let waUrl = '';

            if (waLinkInput && waLinkInput.value.trim()) {
                waUrl = waLinkInput.value.trim();
            } else if (waNumInput && waNumInput.value.trim()) {
                // Remove non-digits
                const num = waNumInput.value.replace(/\D/g, '');
                waUrl = `https://wa.me/${num}`;
            }

            if (waUrl) {
                buttons.push({
                    icon: 'fa-brands fa-whatsapp',
                    label: 'Confirmar',
                    link: waUrl,
                    isManual: false
                });
            }

            // Extra Links (Dynamic)
            const extraLinks = getExtraLinks();
            extraLinks.forEach(extra => {
                buttons.push({ icon: extra.icon, label: extra.name, link: extra.link, isManual: false });
            });

            // Manual
            const manualName = document.getElementById('input-manual-name')?.value?.trim() || 'Manual';
            const manualText = document.getElementById('input-manual').value.trim();
            if (manualText || manualMode === 'image') {
                buttons.push({
                    icon: 'fa-solid fa-book',
                    label: manualName,
                    link: '#',
                    isManual: true,
                    manualText: manualText
                });
            }

            // Render
            previewModalGrid.innerHTML = '';

            // Manual Popup Refs
            const previewManualOverlay = document.getElementById('preview-manual-overlay');
            const previewManualText = document.getElementById('preview-manual-text');
            const closePreviewManual = document.getElementById('close-preview-manual');

            if (closePreviewManual) {
                closePreviewManual.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    previewManualOverlay.classList.add('hidden');
                };
            }

            // Gift Popup Refs
            const previewGiftOverlay = document.getElementById('preview-modal-popup-gift');
            const previewGiftImage = document.getElementById('preview-modal-gift-image');
            const closePreviewGift = document.getElementById('close-preview-popup-gift');

            if (closePreviewGift) {
                closePreviewGift.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    previewGiftOverlay.classList.add('hidden');
                };
            }
            // Close on background click
            if (previewGiftOverlay) {
                previewGiftOverlay.onclick = (e) => {
                    if (e.target === previewGiftOverlay) {
                        previewGiftOverlay.classList.add('hidden');
                    }
                };
            }

            // Expose show func globally or locally
            window.showGiftPreviewPopup = () => {
                if (previewGiftOverlay && previewGiftImage) {
                    // Use the current gift image URL status
                    const currentImg = document.getElementById('preview-gifts-image')?.src;
                    // If not found, check localStorage
                    const savedImg = localStorage.getItem('giftImageUrl');

                    const url = currentImg || savedImg;
                    if (url) {
                        previewGiftImage.src = url;
                        previewGiftOverlay.classList.remove('hidden');
                    } else {
                        showToast('Imagem de presentes não encontrada para prévia.', "success");
                    }
                }
            };

            buttons.forEach(btn => {
                const baseSize = 48; // 48px base w-12 h-12
                const scaledSize = baseSize * size;
                const iconSize = 1.125 * size; // 1.125rem base text-lg

                // Logic for interaction
                let href = btn.link;
                let target = 'target="_blank"';
                let onclick = '';

                if (btn.isManual) {
                    href = '#';
                    target = '';
                    onclick = 'onclick="event.preventDefault(); showManualPreviewPopup();"';
                } else if (btn.isGiftImage) {
                    href = '#';
                    target = '';
                    onclick = 'onclick="event.preventDefault(); showGiftPreviewPopup();"';
                }

                const html = `
                <a href="${href}" ${target} ${onclick} class="group flex flex-col items-center gap-1 min-w-[50px] max-w-[80px] cursor-pointer">
                    <div class="rounded-full border border-stone-300 p-[2px] transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                        <div class="rounded-full flex items-center justify-center shadow-lg text-white group-hover:bg-opacity-80 transition-opacity"
                             style="background-color: ${color}; width: ${scaledSize}px; height: ${scaledSize}px;">
                            <i class="${btn.icon}" style="font-size: ${iconSize}rem;"></i>
                        </div>
                    </div>
                    <span class="text-[10px] uppercase font-bold text-white tracking-wide text-center leading-tight drop-shadow-md">
                        ${btn.label}
                    </span>
                </a>`;
                previewModalGrid.innerHTML += html;
            });
        });

        // Close logic
        const close = () => {
            previewModal.classList.add('hidden');
            previewModalVideo.pause();
        };
        closePreviewModal.addEventListener('click', close);
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) close();
        });
    }

    // --- GPT Icon Suggestion for Extra Link ---
    const inputExtraName = document.getElementById('input-extra-name');
    const inputExtraIcon = document.getElementById('input-extra-icon');

    async function suggestIconForExtraLink() {
        const name = inputExtraName.value.trim();
        const currentIcon = inputExtraIcon.value.trim();

        // Only suggest if name exists and icon is empty
        if (!name || currentIcon) return;

        console.log('Suggesting icon for:', name);

        try {
            const response = await fetch('/api/suggest-icon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name })
            });
            const result = await response.json();

            if (result.icon && !inputExtraIcon.value.trim()) {
                inputExtraIcon.value = result.icon;
                inputExtraIcon.style.borderColor = '#22c55e'; // Green flash
                setTimeout(() => { inputExtraIcon.style.borderColor = ''; }, 2000);
                localStorage.setItem('input-extra-icon', result.icon);
                console.log('Icon suggested:', result.icon);
            }
        } catch (error) {
            console.error('Error suggesting icon:', error);
        }
    }

    // Trigger suggestion when leaving name field or when icon field becomes empty
    if (inputExtraName) {
        inputExtraName.addEventListener('blur', suggestIconForExtraLink);
    }
    if (inputExtraIcon) {
        inputExtraIcon.addEventListener('blur', () => {
            if (!inputExtraIcon.value.trim()) {
                suggestIconForExtraLink();
            }
        });
    }

    const btnNewInvite = document.getElementById('btn-new-invite');
    if (btnNewInvite) {
        btnNewInvite.addEventListener('click', async () => {
            const confirmed = await showConfirm('Tem certeza? Isso apagará todos os dados atuais.', { title: 'Novo Convite', confirmText: 'Confirmar', confirmClass: 'modal-btn-danger', icon: 'fa-exclamation-triangle' });
            if (confirmed) {
                localStorage.clear();
                location.reload();
            }
        });
    }

    // === GIFT LINK/IMAGE TOGGLE LOGIC ===
    // giftMode declared at top


    function updateGiftModeDisplay() {
        const display = document.getElementById('gift-mode-display');
        const text = document.getElementById('gift-mode-text');

        if (!display || !text) return;

        if (giftMode === 'link') {
            display.classList.remove('border-green-500', 'border-gray-700');
            display.classList.add('border-blue-500');
            text.innerHTML = '<i class="fa-solid fa-link text-blue-400"></i> Modo: Link (redireciona para URL)';
            text.className = 'text-sm font-semibold text-blue-400';
        } else if (giftMode === 'image') {
            display.classList.remove('border-blue-500', 'border-gray-700');
            display.classList.add('border-green-500');
            text.innerHTML = '<i class="fa-solid fa-image text-green-400"></i> Modo: Imagem (abre popup)';
            text.className = 'text-sm font-semibold text-green-400';
        } else {
            display.classList.remove('border-blue-500', 'border-green-500');
            display.classList.add('border-gray-700');
            text.innerHTML = '<i class="fa-solid fa-circle-question text-gray-400"></i> Nenhum modo configurado';
            text.className = 'text-sm font-semibold text-gray-400';
        }
    }

    async function deleteGiftImage() {
        const preview = document.getElementById('preview-gifts-image');
        const container = document.getElementById('preview-gifts-container');
        const removeBtn = document.getElementById('btn-remove-gifts-image');
        const downloadBtn = document.getElementById('download-gifts-image');
        const placeholder = document.getElementById('gifts-placeholder-text');

        if (preview) { preview.src = ''; preview.classList.add('hidden'); }
        // Container stays visible for drag-drop functionality
        if (placeholder) placeholder.classList.remove('hidden'); // Show placeholder again
        if (removeBtn) removeBtn.classList.add('hidden');
        if (downloadBtn) downloadBtn.classList.add('hidden');

        localStorage.removeItem('giftImageUrl');
    }

    function handleGiftLinkChange(value) {
        if (value && value.trim() !== '') {
            giftMode = 'link';
            localStorage.setItem('giftMode', 'link');
            deleteGiftImage();
            updateGiftModeDisplay();
        } else if (giftMode === 'link') {
            giftMode = 'none';
            localStorage.setItem('giftMode', 'none');
            updateGiftModeDisplay();
        }
    }

    // Initial Setup for Gift Tab
    const inputGiftsForm = document.getElementById('input-gifts');
    const inputGiftsTab = document.getElementById('input-gifts-tab');
    const uploadGiftsImage = document.getElementById('upload-gifts-image');
    const btnRemoveGiftsImage = document.getElementById('btn-remove-gifts-image');

    if (inputGiftsForm && inputGiftsTab) {
        inputGiftsTab.value = inputGiftsForm.value;
        inputGiftsForm.addEventListener('input', () => {
            inputGiftsTab.value = inputGiftsForm.value;
            handleGiftLinkChange(inputGiftsForm.value);
        });
        inputGiftsTab.addEventListener('input', () => {
            inputGiftsForm.value = inputGiftsTab.value;
            localStorage.setItem('input-gifts', inputGiftsTab.value);
            handleGiftLinkChange(inputGiftsTab.value);
        });
    }

    if (uploadGiftsImage) {
        uploadGiftsImage.addEventListener('change', async () => {
            const file = uploadGiftsImage.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', 'presentes.jpg');

            try {
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                const result = await response.json();
                if (result.error) throw new Error(result.error);

                const urlWithTs = result.url + '?t=' + Date.now();
                const preview = document.getElementById('preview-gifts-image');
                const container = document.getElementById('preview-gifts-container');
                const downloadBtn = document.getElementById('download-gifts-image');
                const placeholder = document.getElementById('gifts-placeholder-text');

                if (preview) { preview.src = urlWithTs; preview.classList.remove('hidden'); }
                if (placeholder) placeholder.classList.add('hidden'); // Hide placeholder when image is shown
                if (container) container.classList.remove('hidden');
                if (btnRemoveGiftsImage) btnRemoveGiftsImage.classList.remove('hidden');
                if (downloadBtn) { downloadBtn.href = result.url; downloadBtn.classList.remove('hidden'); }

                giftMode = 'image';
                localStorage.setItem('giftMode', 'image');
                localStorage.setItem('giftImageUrl', result.url);

                if (inputGiftsForm) inputGiftsForm.value = '';
                if (inputGiftsTab) inputGiftsTab.value = '';
                localStorage.setItem('input-gifts', '');

                updateGiftModeDisplay();
                if (typeof saveMediaUrls === 'function') saveMediaUrls();
                showToast('Imagem de presentes enviada com sucesso!', "success");
            } catch (e) {
                showToast('Erro no upload: ' + e.message, "error");
            } finally {
                uploadGiftsImage.value = '';
            }
        });
    }

    if (btnRemoveGiftsImage) {
        btnRemoveGiftsImage.addEventListener('click', () => {
            giftMode = 'none';
            localStorage.setItem('giftMode', 'none');
            deleteGiftImage();
            updateGiftModeDisplay();
        });
    }

    // --- Music Download Logic ---
    const btnDownloadMusic = document.getElementById('btn-download-music');
    const musicQueryInput = document.getElementById('music-query');
    const formMusicInput = document.getElementById('input-music');
    const uploadMusicInput = document.getElementById('upload-music');
    const musicStatus = document.getElementById('music-status');
    const musicFilename = document.getElementById('music-filename');
    const previewAudio = document.getElementById('preview-audio');
    const btnRemoveMusic = document.getElementById('btn-remove-music');

    async function downloadMusic(query) {
        if (!query || query.trim() === '') return;

        showToast('Baixando música...', 'info');

        try {
            const response = await fetch('/api/download-music', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query.trim() })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao baixar música');
            }

            if (result.success) {
                const urlWithTs = result.url + '?t=' + Date.now();
                if (previewAudio) previewAudio.src = urlWithTs;
                if (musicFilename) musicFilename.textContent = result.filename || 'musica.mp3';
                if (musicStatus) musicStatus.classList.remove('hidden');

                showToast('Música baixada com sucesso!', 'success');
                if (typeof saveMediaUrls === 'function') saveMediaUrls();
            }
        } catch (e) {
            showToast('Erro ao baixar música: ' + e.message, 'error');
        }
    }

    // Button download handler (Tab Music)
    if (btnDownloadMusic && musicQueryInput) {
        btnDownloadMusic.addEventListener('click', async () => {
            const query = musicQueryInput.value.trim();
            if (!query) {
                showToast('Digite o nome da música ou cole um link', 'warning');
                return;
            }

            btnDownloadMusic.disabled = true;
            btnDownloadMusic.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Baixando...';

            await downloadMusic(query);

            btnDownloadMusic.disabled = false;
            btnDownloadMusic.innerHTML = '<i class="fa-brands fa-youtube"></i> Baixar';
        });
    }

    // Auto-download on form field with debounce
    let musicDebounceTimer = null;
    if (formMusicInput) {
        formMusicInput.addEventListener('input', () => {
            clearTimeout(musicDebounceTimer);

            // Skip auto-download during import (music file already exists)
            if (isImporting) return;

            const query = formMusicInput.value.trim();
            if (query.length < 3) return; // Minimum query length

            // Skip if music already loaded (check audio source)
            const audioSrc = previewAudio ? previewAudio.src : '';
            if (audioSrc && audioSrc.includes('musica.mp3')) return;

            musicDebounceTimer = setTimeout(() => {
                // Sync to tab input
                if (musicQueryInput) musicQueryInput.value = query;
                downloadMusic(query);
            }, 1500); // Wait 1.5s after user stops typing
        });
    }

    // Upload local MP3
    if (uploadMusicInput) {
        uploadMusicInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', 'musica.mp3'); // Explicit filename for backend

            try {
                showToast('Enviando música...', 'info');

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.error) throw new Error(result.error);

                const urlWithTs = result.url + '?t=' + Date.now();
                if (previewAudio) previewAudio.src = urlWithTs;
                if (musicFilename) musicFilename.textContent = file.name;
                if (musicStatus) musicStatus.classList.remove('hidden');

                showToast('Música enviada com sucesso!', 'success');
                if (typeof saveMediaUrls === 'function') saveMediaUrls();
            } catch (e) {
                showToast('Erro no upload: ' + e.message, 'error');
            } finally {
                uploadMusicInput.value = '';
            }
        });
    }

    // Remove music handler
    if (btnRemoveMusic) {
        btnRemoveMusic.addEventListener('click', async () => {
            if (previewAudio) previewAudio.src = '';
            if (musicStatus) musicStatus.classList.add('hidden');
            if (musicFilename) musicFilename.textContent = '';

            // Delete file on server
            try {
                await fetch('/api/upload', {
                    method: 'POST',
                    body: (() => {
                        const fd = new FormData();
                        const emptyBlob = new Blob([''], { type: 'audio/mpeg' });
                        // Actually just hide the preview - the file will be ignored if empty
                        return fd;
                    })()
                });
            } catch (e) { /* ignore */ }

            showToast('Música removida', 'info');
            if (typeof saveMediaUrls === 'function') saveMediaUrls();
        });
    }

    // --- Audio Trimmer Logic ---
    const audioTrimmer = document.getElementById('audio-trimmer');
    const audioTimeline = document.getElementById('audio-timeline');
    const trimHandleLeft = document.getElementById('trim-handle-left');
    const trimHandleRight = document.getElementById('trim-handle-right');
    const trimRegion = document.getElementById('trim-region');
    const playCursor = document.getElementById('play-cursor');
    const trimStartInput = document.getElementById('trim-start-input');
    const trimEndInput = document.getElementById('trim-end-input');
    const fadeInSlider = document.getElementById('fade-in-slider');
    const fadeOutSlider = document.getElementById('fade-out-slider');
    const fadeInValue = document.getElementById('fade-in-value');
    const fadeOutValue = document.getElementById('fade-out-value');
    const timeStartLabel = document.getElementById('time-start-label');
    const timeEndLabel = document.getElementById('time-end-label');
    const btnPreviewTrim = document.getElementById('btn-preview-trim');
    const btnApplyTrim = document.getElementById('btn-apply-trim');
    const btnResetTrim = document.getElementById('btn-reset-trim');

    let audioDuration = 0;
    let trimStart = 0;
    let trimEnd = 0;
    let isDragging = null; // 'left', 'right', or null
    let previewContext = null;
    let previewSource = null;
    let previewGainNode = null;

    // Format seconds to MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Update UI positions based on trimStart/trimEnd
    function updateTrimUI() {
        if (audioDuration <= 0) return;

        const leftPercent = (trimStart / audioDuration) * 100;
        const rightPercent = ((audioDuration - trimEnd) / audioDuration) * 100;
        const widthPercent = ((trimEnd - trimStart) / audioDuration) * 100;

        if (trimHandleLeft) trimHandleLeft.style.left = `calc(${leftPercent}% - 6px)`;
        if (trimHandleRight) trimHandleRight.style.right = `calc(${rightPercent}% - 6px)`;
        if (trimRegion) {
            trimRegion.style.left = `${leftPercent}%`;
            trimRegion.style.width = `${widthPercent}%`;
        }
        if (timeStartLabel) timeStartLabel.textContent = formatTime(trimStart);
        if (timeEndLabel) timeEndLabel.textContent = formatTime(trimEnd);
        if (trimStartInput) trimStartInput.value = trimStart.toFixed(1);
        if (trimEndInput) trimEndInput.value = trimEnd.toFixed(1);
    }

    // Initialize trimmer when audio loads
    async function initTrimmer() {
        if (!previewAudio || !previewAudio.src) return;

        try {
            const response = await fetch('/api/audio-duration');
            if (!response.ok) {
                if (audioTrimmer) audioTrimmer.classList.add('hidden');
                return;
            }

            const data = await response.json();
            audioDuration = data.duration;
            trimStart = 0;
            trimEnd = audioDuration;

            if (trimEndInput) trimEndInput.max = audioDuration.toFixed(1);
            if (trimStartInput) trimStartInput.max = audioDuration.toFixed(1);

            updateTrimUI();
            if (audioTrimmer) audioTrimmer.classList.remove('hidden');
        } catch (e) {
            console.error('Error initializing trimmer:', e);
            if (audioTrimmer) audioTrimmer.classList.add('hidden');
        }
    }

    // Watch for audio source changes
    if (previewAudio) {
        const audioObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    if (previewAudio.src && previewAudio.src.includes('musica.mp3')) {
                        setTimeout(initTrimmer, 500);
                    } else {
                        if (audioTrimmer) audioTrimmer.classList.add('hidden');
                    }
                }
            }
        });
        audioObserver.observe(previewAudio, { attributes: true });

        // Also init if already has source
        if (previewAudio.src && previewAudio.src.includes('musica.mp3')) {
            setTimeout(initTrimmer, 500);
        }

        // Update cursor position during playback
        previewAudio.addEventListener('timeupdate', () => {
            if (playCursor && audioDuration > 0) {
                const percent = (previewAudio.currentTime / audioDuration) * 100;
                playCursor.style.left = `${percent}%`;
            }
        });
    }

    // Handle dragging
    function handleMouseDown(e, handle) {
        e.preventDefault();
        isDragging = handle;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(e) {
        if (!isDragging || !audioTimeline) return;

        const rect = audioTimeline.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));

        const newTime = percent * audioDuration;

        if (isDragging === 'left') {
            trimStart = Math.min(newTime, trimEnd - 1);
            trimStart = Math.max(0, trimStart);
        } else if (isDragging === 'right') {
            trimEnd = Math.max(newTime, trimStart + 1);
            trimEnd = Math.min(audioDuration, trimEnd);
        }

        updateTrimUI();
    }

    function handleMouseUp() {
        isDragging = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    if (trimHandleLeft) {
        trimHandleLeft.addEventListener('mousedown', (e) => handleMouseDown(e, 'left'));
    }
    if (trimHandleRight) {
        trimHandleRight.addEventListener('mousedown', (e) => handleMouseDown(e, 'right'));
    }

    // Input handlers
    if (trimStartInput) {
        trimStartInput.addEventListener('change', () => {
            trimStart = parseFloat(trimStartInput.value) || 0;
            trimStart = Math.max(0, Math.min(trimStart, trimEnd - 1));
            updateTrimUI();
        });
    }
    if (trimEndInput) {
        trimEndInput.addEventListener('change', () => {
            trimEnd = parseFloat(trimEndInput.value) || audioDuration;
            trimEnd = Math.max(trimStart + 1, Math.min(trimEnd, audioDuration));
            updateTrimUI();
        });
    }

    // Fade slider handlers
    if (fadeInSlider) {
        fadeInSlider.addEventListener('input', () => {
            if (fadeInValue) fadeInValue.textContent = `${fadeInSlider.value}s`;
        });
    }
    if (fadeOutSlider) {
        fadeOutSlider.addEventListener('input', () => {
            if (fadeOutValue) fadeOutValue.textContent = `${fadeOutSlider.value}s`;
        });
    }

    // Preview Selection button
    if (btnPreviewTrim && previewAudio) {
        btnPreviewTrim.addEventListener('click', () => {
            previewAudio.currentTime = trimStart;
            previewAudio.play();

            // Stop at trimEnd
            const checkEnd = () => {
                if (previewAudio.currentTime >= trimEnd) {
                    previewAudio.pause();
                    previewAudio.removeEventListener('timeupdate', checkEnd);
                }
            };
            previewAudio.addEventListener('timeupdate', checkEnd);
        });
    }

    // Apply Trim button
    if (btnApplyTrim) {
        btnApplyTrim.addEventListener('click', async () => {
            const fadeIn = parseFloat(fadeInSlider?.value) || 0;
            const fadeOut = parseFloat(fadeOutSlider?.value) || 0;

            btnApplyTrim.disabled = true;
            btnApplyTrim.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';

            try {
                const response = await fetch('/api/trim-audio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        start: trimStart,
                        end: trimEnd,
                        fadeIn: fadeIn,
                        fadeOut: fadeOut
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Erro ao processar áudio');
                }

                if (result.success) {
                    // Reload audio
                    if (previewAudio) previewAudio.src = result.url;
                    showToast('Áudio cortado com sucesso!', 'success');

                    // Re-initialize trimmer with new duration
                    setTimeout(initTrimmer, 500);
                }
            } catch (e) {
                showToast('Erro: ' + e.message, 'error');
            } finally {
                btnApplyTrim.disabled = false;
                btnApplyTrim.innerHTML = '<i class="fa-solid fa-check"></i> Aplicar Corte';
            }
        });
    }

    // Reset/Restore button
    if (btnResetTrim) {
        btnResetTrim.addEventListener('click', async () => {
            btnResetTrim.disabled = true;
            btnResetTrim.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Restaurando...';

            try {
                const response = await fetch('/api/restore-audio', {
                    method: 'POST'
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Nenhum backup encontrado');
                }

                if (result.success) {
                    if (previewAudio) previewAudio.src = result.url;
                    showToast('Áudio original restaurado!', 'success');
                    setTimeout(initTrimmer, 500);
                }
            } catch (e) {
                showToast('Erro: ' + e.message, 'error');
            } finally {
                btnResetTrim.disabled = false;
                btnResetTrim.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Restaurar Original';
            }
        });
    }

    function initGiftMode() {
        try {
            const savedMode = localStorage.getItem('giftMode');
            const savedImageUrl = localStorage.getItem('giftImageUrl');
            const giftLink = document.getElementById('input-gifts')?.value;

            if (savedMode === 'image' && savedImageUrl) {
                giftMode = 'image';
                const preview = document.getElementById('preview-gifts-image');
                const container = document.getElementById('preview-gifts-container');
                const downloadBtn = document.getElementById('download-gifts-image');

                if (preview) { preview.src = savedImageUrl + '?t=' + Date.now(); preview.classList.remove('hidden'); }
                if (container) container.classList.remove('hidden');
                if (btnRemoveGiftsImage) btnRemoveGiftsImage.classList.remove('hidden');
                if (downloadBtn) { downloadBtn.href = savedImageUrl; downloadBtn.classList.remove('hidden'); }
            } else if (giftLink && giftLink.trim() !== '') {
                giftMode = 'link';
            } else {
                giftMode = 'none';
            }
            updateGiftModeDisplay();
        } catch (e) { console.error("Error init gift mode:", e); }
    }
    setTimeout(initGiftMode, 100);

    function updateGiftLinkDisplay() {
        const giftLink = document.getElementById('input-gifts')?.value;
        const display = document.getElementById('display-gift-link');

        if (display) {
            if (giftLink) {
                display.textContent = giftLink;
                display.classList.remove('italic', 'text-gray-500');
                display.classList.add('text-blue-400', 'underline');
            } else {
                display.textContent = 'Nenhum';
                display.classList.add('italic', 'text-gray-500');
                display.classList.remove('text-blue-400', 'underline');
            }
        }

        if (giftLink && giftLink.trim() !== '' && giftMode !== 'image') {
            giftMode = 'link';
            localStorage.setItem('giftMode', 'link');
        }
        updateGiftModeDisplay();
    }

    // --- Cache for processed manual text ---
    let processedManualText = localStorage.getItem('processedManualText') || '';

    // === MANUAL IMAGE UPLOAD LOGIC ===
    setTimeout(initManualMode, 100);

    const uploadManualImage = document.getElementById('upload-manual-image');
    const btnRemoveManualImage = document.getElementById('btn-remove-manual-image');

    if (uploadManualImage) {
        uploadManualImage.addEventListener('change', async () => {
            const file = uploadManualImage.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', 'manual.jpg');

            try {
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                const result = await response.json();
                if (result.error) throw new Error(result.error);

                const urlWithTs = result.url + '?t=' + Date.now();
                const preview = document.getElementById('preview-manual-image');

                if (preview) { preview.src = urlWithTs; preview.classList.remove('hidden'); }
                if (btnRemoveManualImage) btnRemoveManualImage.classList.remove('hidden');

                // Switch to image mode
                manualMode = 'image';
                localStorage.setItem('manualMode', 'image');
                localStorage.setItem('manualImageUrl', result.url);

                // Clear text mode data
                processedManualText = '';
                localStorage.removeItem('processedManualText');
                const manualFinal = document.getElementById('input-manual-final');
                if (manualFinal) manualFinal.value = '';

                updateManualModeDisplay();
                if (typeof saveMediaUrls === 'function') saveMediaUrls();
                showToast('Imagem do manual enviada! O popup exibirá a imagem em vez do texto.', "success");
            } catch (error) {
                showToast('Erro ao enviar imagem do manual: ' + error.message, "error");
            }
        });
    }

    if (btnRemoveManualImage) {
        btnRemoveManualImage.addEventListener('click', async () => {
            await deleteManualImage();
            manualMode = 'text';
            localStorage.setItem('manualMode', 'text');
            updateManualModeDisplay();
            if (typeof saveMediaUrls === 'function') saveMediaUrls();
            showToast('Imagem do manual removida. Volte a usar o texto gerado pela IA.', "success");
        });
    }

    // Enable preview button if manual already generated
    if (processedManualText) {
        document.getElementById('btn-preview-manual').disabled = false;
        const statusEl = document.getElementById('manual-status');
        statusEl.textContent = '✓ Manual gerado com sucesso!';
        statusEl.classList.remove('hidden');
        statusEl.classList.add('text-green-400');
    }

    // --- API Interactions ---

    // 1. Generate Prompts
    document.getElementById('btn-regenerate-prompts').addEventListener('click', async () => {
        const btn = document.getElementById('btn-regenerate-prompts');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gerando...';
        btn.disabled = true;

        // Collect ALL form data for prompt generation
        const data = {
            names: document.getElementById('input-names').value,
            theme: document.getElementById('input-theme').value,
            event_type: document.getElementById('input-event-type').value,
            colors: document.getElementById('input-colors').value,
            age: document.getElementById('input-age').value,
            phrase: document.getElementById('input-phrase').value,
            date: document.getElementById('input-date').value,
            time: document.getElementById('input-time').value,
            location: document.getElementById('input-location')?.value || ''
        };

        try {
            const response = await fetch('/api/generate-prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (result.error) throw new Error(result.error);

            // Update main prompt fields
            document.getElementById('prompt-cover').value = result.cover;
            document.getElementById('prompt-leaf').value = result.leaf;
            document.getElementById('prompt-anim-cover').value = result.anim_cover;
            document.getElementById('prompt-anim-leaf').value = result.anim_leaf;

            // NEW: fill_leaf prompt
            const fillLeafField = document.getElementById('prompt-fill-leaf');
            if (fillLeafField && result.fill_leaf) {
                fillLeafField.value = result.fill_leaf;
                localStorage.setItem('prompt-fill-leaf', result.fill_leaf);
            }

            // Sync to duplicate fields in other tabs
            const coverSync = document.getElementById('prompt-cover-sync');
            const leafSync = document.getElementById('prompt-leaf-sync');
            const fillLeafSync = document.getElementById('prompt-fill-leaf-sync');
            if (coverSync) coverSync.value = result.cover;
            if (leafSync) leafSync.value = result.leaf;
            if (fillLeafSync && result.fill_leaf) fillLeafSync.value = result.fill_leaf;

            // Save to localStorage
            localStorage.setItem('prompt-cover', result.cover);
            localStorage.setItem('prompt-leaf', result.leaf);
            localStorage.setItem('prompt-anim-cover', result.anim_cover);
            localStorage.setItem('prompt-anim-leaf', result.anim_leaf);
            localStorage.setItem('lastPromptGen', Date.now()); // Track prompt gen time

            showToast('Prompts gerados com sucesso!', 'success');
        } catch (error) {
            showToast('Erro ao gerar prompts: ' + error.message, 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });

    // == PROMPT SYNC LOGIC (bidirectional) ==
    function setupPromptSync(mainId, syncId) {
        const main = document.getElementById(mainId);
        const sync = document.getElementById(syncId);
        if (!main || !sync) return;

        main.addEventListener('input', () => {
            sync.value = main.value;
            localStorage.setItem(mainId, main.value);
        });
        sync.addEventListener('input', () => {
            main.value = sync.value;
            localStorage.setItem(mainId, sync.value);
        });
    }

    setupPromptSync('prompt-cover', 'prompt-cover-sync');
    setupPromptSync('prompt-leaf', 'prompt-leaf-sync');
    setupPromptSync('prompt-fill-leaf', 'prompt-fill-leaf-sync');
    setupPromptSync('input-manual', 'input-manual-sync'); // NEW: Sync Manual Inputs

    // == GIFT SUGGESTIONS SYNC (form ↔ gifts tab) ==
    const giftSuggestionsMain = document.getElementById('input-gift-suggestions');
    const giftSuggestionsSync = document.getElementById('input-gift-suggestions-sync');
    const inputGiftsLink = document.getElementById('input-gifts');
    const inputGiftsTabLink = document.getElementById('input-gifts-tab');

    if (giftSuggestionsMain && giftSuggestionsSync) {
        // Bidirectional sync
        giftSuggestionsMain.addEventListener('input', () => {
            giftSuggestionsSync.value = giftSuggestionsMain.value;
            localStorage.setItem('input-gift-suggestions', giftSuggestionsMain.value);
        });
        giftSuggestionsSync.addEventListener('input', () => {
            giftSuggestionsMain.value = giftSuggestionsSync.value;
            localStorage.setItem('input-gift-suggestions', giftSuggestionsSync.value);
        });
    }

    // == COPY LEAF TO GIFTS BUTTON ==
    const btnCopyLeafToGifts = document.getElementById('btn-copy-leaf-to-gifts');
    if (btnCopyLeafToGifts) {
        btnCopyLeafToGifts.addEventListener('click', async () => {
            const leafEmptySrc = document.getElementById('preview-leaf-empty')?.src;
            if (!leafEmptySrc || leafEmptySrc === '' || leafEmptySrc === window.location.href) {
                showToast('Nenhuma folha vazia gerada. Crie uma folha primeiro na aba "Folha".', "success");
                return;
            }

            btnCopyLeafToGifts.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Copiando...';
            btnCopyLeafToGifts.disabled = true;

            try {
                // Copy the leaf image to gifts
                const response = await fetch('/api/copy-file', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        source: 'folha_vazia.jpg',
                        destination: 'presentes.jpg'
                    })
                });
                const result = await response.json();
                if (result.error) throw new Error(result.error);

                // Update preview
                const timestamp = new Date().getTime();
                const previewGiftsImage = document.getElementById('preview-gifts-image');
                const previewGiftsContainer = document.getElementById('preview-gifts-container');

                if (previewGiftsImage) {
                    previewGiftsImage.src = result.url + '?t=' + timestamp;
                    previewGiftsImage.classList.remove('hidden');
                }
                if (previewGiftsContainer) {
                    previewGiftsContainer.classList.remove('hidden');
                }

                // Show remove button
                const btnRemove = document.getElementById('btn-remove-gifts-image');
                if (btnRemove) btnRemove.classList.remove('hidden');

                showToast('Folha copiada! Agora você pode clicar em "Preencher Presentes".', "success");
            } catch (error) {
                showToast('Erro ao copiar folha: ' + error.message, "error");
            } finally {
                btnCopyLeafToGifts.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar Folha';
                btnCopyLeafToGifts.disabled = false;
            }
        });
    }

    // == FILL GIFTS BUTTON ==
    const btnFillGifts = document.getElementById('btn-fill-gifts');
    if (btnFillGifts) {
        btnFillGifts.addEventListener('click', async () => {
            const suggestions = giftSuggestionsMain?.value || giftSuggestionsSync?.value || '';
            if (!suggestions.trim()) {
                showToast('Preencha o campo "Sugestões de Presentes" no formulário ou na aba de presentes.', "success");
                return;
            }

            const previewGiftsImage = document.getElementById('preview-gifts-image');
            if (!previewGiftsImage || !previewGiftsImage.src || previewGiftsImage.src === window.location.href) {
                showToast('Faça upload de uma imagem ou copie a folha primeiro.', "success");
                return;
            }

            btnFillGifts.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gerando...';
            btnFillGifts.disabled = true;

            try {
                const theme = document.getElementById('input-theme')?.value || '';
                const colors = document.getElementById('input-colors')?.value || '';

                const prompt = `Remova essa folha em branco. Preencha a imagem com uma folha de pergaminho contendo as sugestões de presentes listadas. Use criatividade com elementos do tema e imagens fotorealistas dos itens.

Tema: ${theme}, ${colors}

Composição: Highly detailed 3D render, centered, dramatic lighting, volumetric light, soft focus.
Style: Photorealistic, hyperdetailed, cinematic, elegant.
Technical: 8K resolution, 9:16, Octane Render, Unreal Engine 5, Macro lens f/2.8.

Sugestões de presentes:
${suggestions}`;

                const response = await fetch('/api/fill-leaf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image_path: 'presentes.jpg',
                        prompt: prompt,
                        filename: 'presentes.jpg'
                    })
                });
                const result = await response.json();
                if (result.error) throw new Error(result.error);

                // Update preview
                const timestamp = new Date().getTime();
                previewGiftsImage.src = result.url + '?t=' + timestamp;
                previewGiftsImage.classList.remove('hidden');

                showToast('Imagem de presentes gerada com sucesso!', "success");
            } catch (error) {
                showToast('Erro ao preencher presentes: ' + error.message, "error");
            } finally {
                btnFillGifts.innerHTML = '<i class="fa-solid fa-pen-nib"></i> Preencher Presentes';
                btnFillGifts.disabled = false;
            }
        });
    }

    // 2. Create Cover (Fal.ai)
    document.getElementById('btn-create-cover').addEventListener('click', async () => {
        const btn = document.getElementById('btn-create-cover');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Criando...';
        btn.disabled = true;

        const prompt = document.getElementById('prompt-cover').value;

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt, filename: 'capa.jpg' })
            });
            const result = await response.json();
            if (result.error) throw new Error(result.error);

            const timestamp = new Date().getTime();
            localStorage.setItem('lastCoverGen', timestamp); // Track cover gen time

            document.getElementById('preview-cover').src = result.url + '?t=' + timestamp;

            document.getElementById('preview-cover').classList.remove('hidden');
            document.getElementById('download-cover').href = result.url;
            document.getElementById('download-cover').classList.remove('hidden');
            saveMediaUrls(); // Persist media URLs
        } catch (e) {
            showToast('Erro: ' + e.message, "error");
        } finally {
            btn.innerHTML = '<i class="fa-solid fa-wand-magic"></i> Criar Capa (Fal.ai)';
            btn.disabled = false;
        }
    });

    // 3. Create Leaf (Fal.ai)
    document.getElementById('btn-create-leaf').addEventListener('click', async () => {
        const btn = document.getElementById('btn-create-leaf');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Criando...';
        btn.disabled = true;

        const prompt = document.getElementById('prompt-leaf').value;

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt, filename: 'folha_vazia.jpg' })
            });
            const result = await response.json();
            if (result.error) throw new Error(result.error);

            const timestamp = new Date().getTime();
            document.getElementById('preview-leaf-empty').src = result.url + '?t=' + timestamp;
            document.getElementById('preview-leaf-empty').classList.remove('hidden');
            saveMediaUrls(); // Persist media URLs
        } catch (e) {
            showToast('Erro: ' + e.message, "error");
        } finally {
            btn.innerHTML = '<i class="fa-solid fa-leaf"></i> Criar Folha';
            btn.disabled = false;
        }
    });

    // 4. Fill Leaf (NanoBanana)
    document.getElementById('btn-fill-leaf').addEventListener('click', async () => {
        const btn = document.getElementById('btn-fill-leaf');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preenchendo...';
        btn.disabled = true;

        const names = document.getElementById('input-names').value;
        const date = document.getElementById('input-date').value;
        const time = document.getElementById('input-time').value;
        const address = document.getElementById('input-maps').value;
        const phrase = document.getElementById('input-phrase').value;
        const age = document.getElementById('input-age').value;

        // Construct the prompt as requested
        let promptText = `Preencha essa folha com os dados para convite de forma criativa e elegante: ${names}, ${date}, ${time}`;
        if (age) promptText += `, ${age}`;

        promptText += `. Coloque elementos de design de convite, separadores, linhas e elementos conforme sua criatividade.
Aspect Ratio 9:16
Qualidade 2K.`;

        if (phrase) {
            promptText += `\nFrase pro convite: ${phrase}`;
        }

        const data = {
            names: names,
            date: date,
            time: time,
            address: address,
            phrase: phrase,
            prompt: promptText // Send the constructed prompt
        };

        try {
            const response = await fetch('/api/fill-leaf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.error) throw new Error(result.error);

            const timestamp = new Date().getTime();
            localStorage.setItem('lastLeafFillGen', timestamp); // Track leaf fill gen time

            document.getElementById('preview-leaf-filled').src = result.url + '?t=' + timestamp;

            document.getElementById('preview-leaf-filled').classList.remove('hidden');
            document.getElementById('download-leaf-filled').href = result.url;
            document.getElementById('download-leaf-filled').classList.remove('hidden');
            saveMediaUrls(); // Persist media URLs
        } catch (e) {
            showToast('Erro: ' + e.message, "error");
        } finally {
            btn.innerHTML = '<i class="fa-solid fa-pen-nib"></i> Preencher Folha (NanoBanana)';
            btn.disabled = false;
        }
    });

    // 5. Animate Cover (Veo)
    document.getElementById('btn-create-anim-cover').addEventListener('click', async () => {
        const btn = document.getElementById('btn-create-anim-cover');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Animando...';
        btn.disabled = true;

        const prompt = document.getElementById('prompt-anim-cover').value;

        try {
            // 10 minute timeout for video generation
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 600000);

            const response = await fetch('/api/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    filename: 'abertura.mp4',
                    first_frame_path: 'capa.jpg',
                    last_frame_path: 'blank.jpg',
                    duration: '4s'
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const result = await response.json();
            if (result.error) throw new Error(result.error);

            const timestamp = new Date().getTime();
            localStorage.setItem('lastAnimCoverGen', timestamp); // Track anim cover gen time

            document.getElementById('preview-anim-cover').src = result.url + '?t=' + timestamp;

            document.getElementById('preview-anim-cover').classList.remove('hidden');
            document.getElementById('download-anim-cover').href = result.url;
            document.getElementById('download-anim-cover').classList.remove('hidden');
            saveMediaUrls(); // Persist media URLs
        } catch (e) {
            showToast('Erro: ' + e.message, "error");
        } finally {
            btn.innerHTML = '<i class="fa-solid fa-video"></i> Animar Abertura (Hailuo)';
            btn.disabled = false;
        }
    });

    // 6. Animate Leaf (Veo Loop)
    document.getElementById('btn-create-anim-leaf').addEventListener('click', async () => {
        const btn = document.getElementById('btn-create-anim-leaf');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Criando Loop...';
        btn.disabled = true;

        const prompt = document.getElementById('prompt-anim-leaf').value;

        try {
            // 10 minute timeout for video generation
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 600000);

            const response = await fetch('/api/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    filename: 'loop.mp4',
                    first_frame_path: 'folha_preenchida.jpg',
                    last_frame_path: 'folha_preenchida.jpg',
                    duration: '6s',
                    is_loop: true
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const result = await response.json();
            if (result.error) throw new Error(result.error);

            const timestamp = new Date().getTime();
            localStorage.setItem('lastAnimLeafGen', timestamp); // Track anim leaf gen time

            document.getElementById('preview-anim-leaf').src = result.url + '?t=' + timestamp;

            document.getElementById('preview-anim-leaf').classList.remove('hidden');
            document.getElementById('download-anim-leaf').href = result.url;
            document.getElementById('download-anim-leaf').classList.remove('hidden');
            saveMediaUrls(); // Persist media URLs
        } catch (e) {
            showToast('Erro: ' + e.message, "error");
        } finally {
            btn.innerHTML = '<i class="fa-solid fa-video"></i> Criar Loop (Hailuo)';
            btn.disabled = false;
        }
    });

    // 7. Generate Manual (GPT-4o)
    async function generateManualAutomatically() {
        const manualInput = document.getElementById('input-manual');
        const manualInputSync = document.getElementById('input-manual-sync');
        // Use logic: prefer sync field (in manual tab) if visible/active, or main input
        const manualText = manualInputSync?.value || manualInput?.value;
        const statusEl = document.getElementById('manual-status');
        const btnPreview = document.getElementById('btn-preview-manual');

        if (!manualText || !manualText.trim()) return;

        // === Switch to text mode and clear any manual image ===
        await deleteManualImage();
        manualMode = 'text';
        localStorage.setItem('manualMode', 'text');
        localStorage.removeItem('manualImageUrl');
        updateManualModeDisplay();
        // ============================================

        statusEl.textContent = '⏳ Gerando manual (Contexto Novo)...';
        statusEl.classList.remove('hidden', 'text-green-400', 'text-red-400');
        statusEl.classList.add('text-yellow-400');

        // FORCE FRESH CONTEXT: Reset threadId
        manualThreadId = null;

        try {
            const response = await fetch('/api/generate-manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    manualText: manualText,
                    threadId: null // FIX: Always null to force fresh context
                })
            });
            const result = await response.json();

            if (result.error) throw new Error(result.error);

            // We ignore result.threadId since we don't want to persist context

            processedManualText = result.html;
            localStorage.setItem('processedManualText', processedManualText);

            // Populate editable textarea
            const finalInput = document.getElementById('input-manual-final');
            if (finalInput) finalInput.value = processedManualText;

            saveMediaUrls(); // FIX: Persist to backend immediately

            statusEl.textContent = '✓ Manual atualizado com sucesso!';
            statusEl.classList.remove('text-yellow-400');
            statusEl.classList.add('text-green-400');
            btnPreview.disabled = false;

        } catch (error) {
            console.error("Erro ao gerar manual:", error);
            statusEl.textContent = '❌ Erro ao gerar manual.';
            statusEl.classList.remove('text-yellow-400');
            statusEl.classList.add('text-red-400');
        }
    }

    // Debounce for manual generation (ONLY triggers if input changes, but user requested explicit button too)
    // We will keep debounce for "Auto-Draft" feel but reset context every time
    let manualTimeout;
    const handleManualInput = () => {
        const statusEl = document.getElementById('manual-status');
        statusEl.textContent = '✍️ Digitando (Aguardando para gerar)...';
        statusEl.classList.remove('hidden', 'text-green-400', 'text-red-400');
        statusEl.classList.add('text-gray-400');

        clearTimeout(manualTimeout);
        manualTimeout = setTimeout(generateManualAutomatically, 3000); // Increased to 3s
    };

    document.getElementById('input-manual').addEventListener('input', handleManualInput);
    if (document.getElementById('input-manual-sync')) {
        document.getElementById('input-manual-sync').addEventListener('input', handleManualInput);
    }

    // NEW: Listen for edits on Final Manual Text
    const inputManualFinal = document.getElementById('input-manual-final');
    if (inputManualFinal) {
        inputManualFinal.addEventListener('input', () => {
            processedManualText = inputManualFinal.value;
            localStorage.setItem('processedManualText', processedManualText);

            // FIX: If field is emptied, reset context for fresh generation next time
            if (!inputManualFinal.value.trim()) {
                manualThreadId = null;
                localStorage.removeItem('manualThreadId');
                console.log('Manual field cleared - context reset for fresh generation');
            }

            saveMediaUrls();
        });
    }

    // Manual Button Click (Force Generation)
    document.getElementById('btn-generate-manual').addEventListener('click', generateManualAutomatically);

    // Shared Manual Preview Logic
    window.showManualPreviewPopup = function () {
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm'; // Increased z-index to 80 to sit above preview modal (z-70)

        // Determine Background Image Source
        const previewLeafEmpty = document.getElementById('preview-leaf-empty');
        let bgSrc = '/output/folha_vazia.jpg'; // Default fallback
        if (previewLeafEmpty && previewLeafEmpty.src && !previewLeafEmpty.classList.contains('hidden') && previewLeafEmpty.src.length > 50) {
            bgSrc = previewLeafEmpty.src;
        }

        // Determine Content
        // Use processedManualText if available, or fallback to raw input if valid, else placeholder
        let content = processedManualText;
        if (!content && document.getElementById('input-manual').value.trim()) {
            // Fallback to raw text if no AI generation yet (simulated simple format)
            content = document.getElementById('input-manual').value.trim().replace(/\n/g, '<br>');
        }

        popup.innerHTML = `
            <div class="relative w-full max-w-[400px] h-[80%] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-white/20">
                <!-- Background Image -->
                <div class="absolute inset-0 z-0">
                    <img src="${bgSrc}" class="w-full h-full object-cover opacity-90 blur-[2px]">
                    <div class="absolute inset-0 bg-black/60"></div>
                </div>

                <!-- Header -->
                <div class="relative z-10 flex justify-between items-center p-4 border-b border-white/10">
                    <h2 class="text-xl font-bold text-white shadow-black drop-shadow-md">Manual do Convidado</h2>
                    <button id="close-global-preview-manual" class="text-white hover:text-gray-300 transition-colors drop-shadow-md">
                        <i class="fa-solid fa-xmark text-2xl"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="relative z-10 p-6 overflow-y-auto custom-scrollbar text-white text-center space-y-6 shadow-black drop-shadow-sm">
                    <div class="space-y-2">
                        <i class="fa-solid fa-circle-info text-3xl text-yellow-400 mb-2 drop-shadow-md"></i>
                        <h3 class="font-bold text-lg drop-shadow-md">Siga essas instruções e divirta-se</h3>
                    </div>

                    <div class="text-sm leading-relaxed text-left drop-shadow-md">
                        ${content || '<p class="text-center text-gray-400">Nenhum conteúdo gerado.</p>'}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        const closeBtn = document.getElementById('close-global-preview-manual');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => popup.remove());
        }
        popup.addEventListener('click', (e) => {
            if (e.target === popup) popup.remove();
        });
    }

    // Preview Manual (Tab Button)
    document.getElementById('btn-preview-manual').addEventListener('click', showManualPreviewPopup);

    // 8. Music Download
    document.getElementById('btn-download-music').addEventListener('click', async () => {
        const btn = document.getElementById('btn-download-music');
        const query = document.getElementById('music-query').value;

        if (!query) return showToast('Digite o nome ou link da música!', "success");

        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Baixando...';
        btn.disabled = true;

        try {
            const response = await fetch('/api/download-music', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query })
            });

            // Debug: Check if server returned HTML instead of JSON
            const responseText = await response.text();
            console.log('Music API response status:', response.status);
            console.log('Music API response:', responseText.substring(0, 200));

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} - ${responseText.substring(0, 100)}`);
            }

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error('Servidor retornou resposta inválida (não é JSON)');
            }

            if (result.error) throw new Error(result.error);

            document.getElementById('music-status').classList.remove('hidden');
            const timestamp = new Date().getTime();
            document.getElementById('preview-audio').src = result.url + '?t=' + timestamp;
            document.getElementById('preview-audio').load(); // Reload audio element
            document.getElementById('input-music').value = query; // Update form
            document.getElementById('music-filename').textContent = query; // Show search query
            localStorage.setItem('input-music', query);
            saveMediaUrls(); // Persist media URLs
        } catch (e) {
            showToast('Erro ao baixar música: ' + e.message, "error");
        } finally {
            btn.innerHTML = '<i class="fa-brands fa-youtube"></i> Baixar';
            btn.disabled = false;
        }
    });

    // ======================================
    // EXTRA LINKS BUTTON INITIALIZATION
    // ======================================
    // Note: The addExtraLink, getExtraLinks, restoreExtraLinks, and clearExtraLinks 
    // functions are defined globally at the top of the file (lines ~50-127).
    // Persistence is handled via saveMediaUrls() which saves to server state.

    const btnAddExtra = document.getElementById('btn-add-extra-link');
    if (btnAddExtra) {
        // Use onclick (not addEventListener) to ensure only ONE handler exists
        btnAddExtra.onclick = () => addExtraLink();
    }



    // 9. Finalize & ZIP
    // --- ZIP Generation Helper ---
    async function generateZipPackage(download = true, buildOnly = false) {
        // Build menuConfig
        const menuConfig = [];
        // Add manual (Text or Image mode)
        const manualName = document.getElementById('input-manual-name')?.value?.trim() || 'Manual do Convidado';
        if (manualMode === 'image') {
            menuConfig.push({ id: 'manual', titulo: manualName, icone: "fa-solid fa-book", link: "#", isManualImage: true });
        } else if (processedManualText) {
            menuConfig.push({ id: 'manual', titulo: manualName, icone: "fa-solid fa-book", link: "#", manualText: processedManualText });
        }

        // Maps
        const mapsLink = document.getElementById('input-maps').value;
        if (mapsLink) menuConfig.push({ titulo: "Como Chegar", icone: "fa-solid fa-location-dot", link: mapsLink });

        // Gifts
        if (giftMode === 'image') {
            menuConfig.push({ titulo: "Lista de Presentes", icone: "fa-solid fa-gift", link: "#", isGiftImage: true });
        } else {
            const giftsLink = document.getElementById('input-gifts').value;
            if (giftsLink) menuConfig.push({ titulo: "Lista de Presentes", icone: "fa-solid fa-gift", link: giftsLink });
        }

        // WhatsApp/Confirm
        const confirmLink = document.getElementById('input-confirm-link').value;
        const whatsappNum = document.getElementById('input-whatsapp').value;
        if (confirmLink && confirmLink.trim() !== "") {
            menuConfig.push({ titulo: "Confirmar Presença", icone: "fa-regular fa-circle-check", link: confirmLink });
        } else if (whatsappNum && whatsappNum.trim() !== "") {
            menuConfig.push({ titulo: "Confirmar Presença", icone: "fa-regular fa-circle-check", link: whatsappNum.replace(/\D/g, '') });
        }

        // Extra Links (Dinâmicos)
        const extraLinks = getExtraLinks();
        extraLinks.forEach(extra => {
            menuConfig.push({ titulo: extra.name, icone: extra.icon, link: extra.link });
        });

        const buttonColor = document.getElementById('input-button-color').value;
        const shadowColor = document.getElementById('input-shadow-color').value || '#000000'; // New
        const buttonsOffset = parseInt(document.getElementById('input-buttons-offset').value) || 0;
        const buttonSize = parseFloat(document.getElementById('input-button-size').value) || 1.0;
        const showInteractHint = document.getElementById('check-interact-hint').checked;
        const allowCompanion = document.getElementById('check-allow-companion').checked;
        const showTimer = document.getElementById('check-show-timer')?.checked || false;

        // Form Data - Include ALL fields for complete restoration
        const formData = {
            names: document.getElementById('input-names').value,
            date: document.getElementById('input-date').value,
            time: document.getElementById('input-time').value,
            eventType: document.getElementById('input-event-type').value,
            theme: document.getElementById('input-theme').value,
            age: document.getElementById('input-age').value,
            colors: document.getElementById('input-colors').value,
            buttonColor: buttonColor,
            buttonsOffset: buttonsOffset,
            buttonSize: buttonSize,
            phrase: document.getElementById('input-phrase').value,
            music: document.getElementById('input-music').value,
            location: document.getElementById('input-location')?.value || '',
            mapsLink: document.getElementById('input-maps').value,
            giftsLink: document.getElementById('input-gifts').value,
            giftSuggestions: document.getElementById('input-gift-suggestions')?.value || '',
            giftMode: giftMode,
            giftImageUrl: localStorage.getItem('giftImageUrl'),
            extraLinks: extraLinks,
            manual: document.getElementById('input-manual').value,
            manualName: document.getElementById('input-manual-name')?.value || 'Manual do Convidado',
            whatsapp: whatsappNum,
            confirmLink: confirmLink,
            processedManualText: processedManualText,
            manualMode: manualMode,
            manualImageUrl: localStorage.getItem('manualImageUrl'),
            shadowColor: shadowColor,
            slug: document.getElementById('input-slug') ? document.getElementById('input-slug').value : '',
            showTimer: showTimer,
            allowCompanion: allowCompanion,
            interactHint: showInteractHint
        };

        const response = await fetch('/api/generate-zip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                menuConfig: menuConfig,
                buttonColor: buttonColor,
                shadowColor: shadowColor, // Payload
                buttonsOffset: buttonsOffset,
                buttonSize: buttonSize,
                showInteractHint: showInteractHint,
                allowCompanion: allowCompanion,
                showTimer: showTimer,
                formData: formData,
                slug: document.getElementById('input-slug') ? document.getElementById('input-slug').value : '',
                buildOnly: buildOnly
            })
        });

        const text = await response.text();
        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error("Non-JSON response:", text);
            throw new Error(`Server returned non-JSON response (likely an error): ${text.substring(0, 100)}...`);
        }

        if (!response.ok) {
            throw new Error(result.error || result.message || `Server Error ${response.status}`);
        }

        if (result.error) throw new Error(result.error);

        if (download && result.zip_url) {
            // ... Download Logic ...
            const sanitize = (str) => {
                if (!str) return '';
                return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').replace(/ +/g, '_').trim();
            };
            const name = sanitize(formData.names);
            const age = formData.age ? '_' + formData.age : '';
            const eventType = sanitize(formData.eventType);
            let customFilename = 'convite_digital.zip';
            if (name) customFilename = name + age + (eventType ? '_' + eventType : '') + '.zip';

            const zipResponse = await fetch(result.zip_url);
            const blob = await zipResponse.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = customFilename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);
        }
        return result;
    }

    // Expose to global scope for initGitHubDeploy
    window.generateZipPackage = generateZipPackage;

    // 9. Finalize & ZIP
    document.getElementById('btn-download-zip').addEventListener('click', async () => {
        const btn = document.getElementById('btn-download-zip');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gerando ZIP...';
        btn.disabled = true;

        try {
            await generateZipPackage(true);
        } catch (error) {
            showToast('Erro ao gerar ZIP: ' + error.message, "error");
        } finally {
            btn.innerHTML = '<i class="fa-solid fa-file-zipper"></i> Baixar ZIP';
            btn.disabled = false;
        }
    });

    // Save Only (No download, no deploy - just build and save to history)
    document.getElementById('btn-save-only')?.addEventListener('click', async () => {
        const btn = document.getElementById('btn-save-only');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
        btn.disabled = true;

        try {
            await generateZipPackage(false);
            showToast('✓ Convite salvo no histórico!', "success");
        } catch (error) {
            showToast('Erro ao salvar: ' + error.message, "error");
        } finally {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    });

    // Music field synchronization and auto-download
    let musicDownloadTriggered = false;
    const musicInput = document.getElementById('input-music');
    const musicQuery = document.getElementById('music-query');

    // Sync music-query with input-music
    musicInput.addEventListener('input', () => {
        musicQuery.value = musicInput.value;
        musicDownloadTriggered = false; // Reset flag when user changes
    });

    musicQuery.addEventListener('input', () => {
        musicInput.value = musicQuery.value;
        localStorage.setItem('input-music', musicQuery.value);
        musicDownloadTriggered = false; // Reset flag when user changes
    });

    // Auto-download music when leaving music tab after field update
    // Note: This logic is also handled in the tab switching listener at the top.
    // We keep this here just in case, or we can remove it if it's redundant.
    // The top listener handles it more broadly.
    // But we need the downloadMusicAutomatically function.

    async function downloadMusicAutomatically(query) {
        // Skip if importing or music already exists
        const audioEl = document.getElementById('preview-audio');
        if (isImporting || (audioEl && audioEl.src && audioEl.src.includes('musica.mp3'))) {
            console.log('Auto-download skipped: music already exists or importing');
            return;
        }

        // FIX: Show loading indicator
        const statusDiv = document.getElementById('music-status');
        const filenameEl = document.getElementById('music-filename');
        statusDiv.classList.remove('hidden');
        filenameEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Baixando música automaticamente...';

        try {
            const response = await fetch('/api/download-music', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query })
            });
            const result = await response.json();

            if (!result.error) {
                document.getElementById('preview-audio').src = result.url + '?t=' + new Date().getTime();
                // Show the search query (e.g. "Ed Sheeran - Perfect") NOT "musica.mp3"
                filenameEl.textContent = query;
                console.log('Música baixada automaticamente:', query);
            } else {
                filenameEl.textContent = 'Erro ao baixar música';
            }
        } catch (error) {
            console.error('Erro ao baixar música automaticamente:', error);
            filenameEl.textContent = 'Erro ao baixar música';
        }
    }

    // Remove music button
    document.getElementById('btn-remove-music').addEventListener('click', async () => {
        const confirmed = await showConfirm('Remover a música?', { title: 'Remover Música', confirmText: 'Remover', confirmClass: 'modal-btn-danger', icon: 'fa-music' });
        if (confirmed) {
            document.getElementById('music-status').classList.add('hidden');
            document.getElementById('preview-audio').src = '';
            document.getElementById('input-music').value = '';
            document.getElementById('music-query').value = '';
            localStorage.setItem('input-music', '');
            musicDownloadTriggered = false;
        }
    });

    // Preview Final HTML
    document.getElementById('btn-preview-final').addEventListener('click', async () => {
        const btn = document.getElementById('btn-preview-final');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gerando...';
        btn.disabled = true;

        try {
            // Build menuConfig
            const menuConfig = [];

            // Add manual (Text or Image mode)
            const manualName = document.getElementById('input-manual-name')?.value?.trim() || 'Manual do Convidado';
            if (manualMode === 'image') {
                menuConfig.push({
                    id: 'manual',
                    titulo: manualName,
                    icone: "fa-solid fa-book",
                    link: "#",
                    isManualImage: true
                });
            } else if (processedManualText) {
                menuConfig.push({
                    id: 'manual',
                    titulo: manualName,
                    icone: "fa-solid fa-book",
                    link: "#",
                    manualText: processedManualText
                });
            }

            // Add other standard items
            // Add Map
            const mapsLink = document.getElementById('input-maps').value;
            if (mapsLink) {
                menuConfig.push({
                    titulo: "Como Chegar",
                    icone: "fa-solid fa-location-dot",
                    link: mapsLink
                });
            }

            // Add Gifts (Link or Image)
            if (giftMode === 'image') {
                menuConfig.push({
                    titulo: "Lista de Presentes",
                    icone: "fa-solid fa-gift",
                    link: "#",
                    isGiftImage: true
                });
            } else {
                const giftsLink = document.getElementById('input-gifts').value;
                if (giftsLink) {
                    menuConfig.push({
                        titulo: "Lista de Presentes",
                        icone: "fa-solid fa-gift",
                        link: giftsLink
                    });
                }
            }

            // Add Confirm Presence button
            // Priority: 1. Manual Link, 2. WhatsApp Number (triggers Modal)
            const confirmLinkPreview = document.getElementById('input-confirm-link').value;
            const whatsappNum = document.getElementById('input-whatsapp').value;

            if (confirmLinkPreview && confirmLinkPreview.trim() !== "") {
                menuConfig.push({
                    titulo: "Confirmar Presença",
                    icone: "fa-regular fa-circle-check",
                    link: confirmLinkPreview
                });
            } else if (whatsappNum && whatsappNum.trim() !== "") {
                // Should trigger RSVP Modal in final_template
                menuConfig.push({
                    titulo: "Confirmar Presença",
                    icone: "fa-regular fa-circle-check",
                    link: whatsappNum.replace(/\D/g, '') // Clean number
                });
            }

            // Extra Links (Dinâmicos)
            const extraLinks = getExtraLinks();
            extraLinks.forEach(extra => {
                menuConfig.push({
                    titulo: extra.name,
                    icone: extra.icon,
                    link: extra.link
                });
            });

            const buttonColor = document.getElementById('input-button-color').value;
            const buttonsOffset = parseInt(document.getElementById('input-buttons-offset').value) || 0;
            const showInteractHint = document.getElementById('check-interact-hint').checked;

            const response = await fetch('/api/generate-zip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    menuConfig: menuConfig,
                    buttonColor: buttonColor,
                    buttonsOffset: buttonsOffset,
                    buttonSize: parseFloat(document.getElementById('input-button-size').value) || 1.0,
                    showInteractHint: showInteractHint
                })
            });
            const result = await response.json();

            if (result.error) throw new Error(result.error);

            // Open the generated preview HTML in new tab
            window.open('/temp/build/index.html', '_blank');
        } catch (error) {
            showToast('Erro ao gerar prévia: ' + error.message, "error");
        } finally {
            btn.innerHTML = '<i class="fa-solid fa-eye"></i> Ver Prévia';
            btn.disabled = false;
        }
    });

    // Generic Upload Handler
    async function handleUpload(inputId, filename, previewId, downloadId, isVideo = false, isAudio = false) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('change', async () => {
            const file = input.files[0];
            if (!file) return;

            // Store original filename before upload (for music display)
            const originalFileName = file.name;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', filename);

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.error) throw new Error(result.error);

                const timestamp = new Date().getTime();
                const urlWithTs = result.url + '?t=' + timestamp;

                if (previewId) {
                    const preview = document.getElementById(previewId);
                    preview.src = urlWithTs;
                    preview.classList.remove('hidden');
                    if (isAudio) preview.load();
                }

                if (downloadId) {
                    const download = document.getElementById(downloadId);
                    download.href = result.url;
                    download.classList.remove('hidden');
                }

                // Special case for music: use original filename for display, not target filename
                if (inputId === 'upload-music') {
                    // Store a descriptive name (original file name without extension)
                    const displayName = originalFileName.replace(/\.[^/.]+$/, "") || 'Arquivo de Áudio';
                    document.getElementById('input-music').value = displayName;
                    document.getElementById('music-query').value = displayName;
                    localStorage.setItem('input-music', displayName);
                    document.getElementById('music-status').classList.remove('hidden');
                    document.getElementById('music-filename').textContent = originalFileName;
                }

                saveMediaUrls(); // Persist media URLs
                showToast('Upload concluído com sucesso!', "success");

            } catch (e) {
                showToast('Erro no upload: ' + e.message, "error");
            } finally {
                // Restore button state if needed
                input.value = ''; // Reset input to allow re-uploading same file
            }
        });
    }

    // Initialize Upload Listeners
    handleUpload('upload-cover', 'capa.jpg', 'preview-cover', 'download-cover');
    handleUpload('upload-leaf', 'folha_vazia.jpg', 'preview-leaf-empty', null); // Empty leaf
    handleUpload('upload-leaf-filled', 'folha_preenchida.jpg', 'preview-leaf-filled', 'download-leaf-filled'); // Filled leaf
    handleUpload('upload-anim-cover', 'abertura.mp4', 'preview-anim-cover', 'download-anim-cover', true);
    handleUpload('upload-anim-leaf', 'loop.mp4', 'preview-anim-leaf', 'download-anim-leaf', true);
    handleUpload('upload-music', 'musica.mp3', 'preview-audio', null, false, true);

    // ======================================
    // DRAG-AND-DROP UPLOAD FUNCTIONALITY
    // ======================================

    /**
     * Sets up drag-and-drop file upload on a container element
     * @param {string} containerId - The container element ID
     * @param {string} inputId - The file input ID to trigger
     * @param {string} acceptType - MIME type prefix to validate (e.g., 'image/', 'video/', 'audio/')
     */
    function setupDragAndDrop(containerId, inputId, acceptType) {
        const container = document.getElementById(containerId);
        const input = document.getElementById(inputId);

        if (!container || !input) {
            console.warn(`Drag-drop: Container ${containerId} or input ${inputId} not found`);
            return;
        }

        // Add drop indicator styling
        container.style.cursor = 'pointer';
        container.title = 'Arraste um arquivo aqui ou clique para fazer upload';

        // Make container clickable to trigger file input
        container.addEventListener('click', (e) => {
            // Prevent triggering if clicking on video controls or existing elements
            if (e.target.tagName === 'VIDEO' || e.target.tagName === 'AUDIO') return;
            input.click();
        });

        // Drag over - visual feedback
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-75');
            container.style.transform = 'scale(1.02)';
        });

        // Drag enter
        container.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-75');
        });

        // Drag leave - remove visual feedback
        container.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-75');
            container.style.transform = '';
        });

        // Drop - handle file
        container.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-75');
            container.style.transform = '';

            const files = e.dataTransfer.files;
            if (files.length === 0) return;

            const file = files[0];

            // Validate file type
            if (acceptType && !file.type.startsWith(acceptType)) {
                showToast(`Tipo de arquivo inválido!\nEsperado: ${acceptType}*\nRecebido: ${file.type}`, "error");
                return;
            }

            // Create a DataTransfer object to set files on the input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;

            // Trigger the change event to use existing upload logic
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    // Initialize drag-and-drop for all media containers
    setupDragAndDrop('preview-cover-container', 'upload-cover', 'image/');
    setupDragAndDrop('preview-anim-cover-container', 'upload-anim-cover', 'video/');
    setupDragAndDrop('preview-leaf-empty-container', 'upload-leaf', 'image/');
    setupDragAndDrop('preview-leaf-filled-container', 'upload-leaf-filled', 'image/');
    setupDragAndDrop('preview-anim-leaf-container', 'upload-anim-leaf', 'video/');
    setupDragAndDrop('music-status', 'upload-music', 'audio/');
    setupDragAndDrop('preview-gifts-container', 'upload-gifts-image', 'image/'); // Gifts/Presentes window

    // Also add to the entire music tab for convenience
    const musicTabContent = document.querySelector('#tab-music .w-full');
    if (musicTabContent) {
        musicTabContent.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        musicTabContent.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('audio/')) {
                const input = document.getElementById('upload-music');
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                input.files = dataTransfer.files;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    console.log("AutoBuilder 3.1 Frontend Initialized");

    // === ZIP IMPORT HANDLER ===
    const importZipInput = document.getElementById('import-zip');
    if (importZipInput) {
        importZipInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const confirmed = await showConfirm('Importar este ZIP substituirá todos os dados atuais. Continuar?', { title: 'Importar ZIP', confirmText: 'Importar', icon: 'fa-file-zipper' });
            if (!confirmed) {
                e.target.value = '';
                return;
            }

            // Show loading state
            const label = importZipInput.parentElement;
            const originalHTML = label.innerHTML;
            label.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span class="text-sm font-semibold">Importando...</span><input type="file" id="import-zip" class="hidden" accept=".zip">';

            const formData = new FormData();
            formData.append('file', file);

            try {
                // Reset builder before importing (clear temp files and state)
                await fetch('/api/clear-cache', { method: 'POST' });
                localStorage.clear();

                const response = await fetch('/api/import-zip', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.error) throw new Error(result.error);

                const data = result.data;

                applyImportedData(data, 'Convite ZIP');

            } catch (error) {
                console.error('Error importing ZIP:', error);
                showToast('Erro ao importar ZIP: ' + error.message, "error");
            } finally {
                // Restore button
                label.innerHTML = originalHTML;
                e.target.value = ''; // Reset file input
            }
        });
    }

    // === FOLDER IMPORT HANDLER ===
    const importFolderInput = document.getElementById('import-folder');
    if (importFolderInput) {
        importFolderInput.addEventListener('change', async (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            const confirmed = await showConfirm('Importar esta pasta substituirá todos os dados atuais. Continuar?', { title: 'Importar Pasta', confirmText: 'Importar', icon: 'fa-folder-open' });
            if (!confirmed) {
                e.target.value = '';
                return;
            }

            // Show loading state
            const label = importFolderInput.parentElement;
            const originalHTML = label.innerHTML;
            label.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span class="text-sm font-semibold">Importando...</span><input type="file" id="import-folder" class="hidden" webkitdirectory directory multiple>';

            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i], files[i].webkitRelativePath);
            }

            try {
                // Reset builder before importing (clear temp files and state)
                await fetch('/api/clear-cache', { method: 'POST' });
                localStorage.clear();

                const response = await fetch('/api/import-folder', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.error) throw new Error(result.error);

                const data = result.data;

                // Same processing as ZIP import - populate ALL form fields
                applyImportedData(data, 'Convite Pasta');

            } catch (error) {
                console.error('Error importing folder:', error);
                showToast('Erro ao importar pasta: ' + error.message, "error");
            } finally {
                label.innerHTML = originalHTML;
                e.target.value = '';
            }
        });
    }

    // --- History Functions ---

    async function loadHistory() {
        const listContainer = document.getElementById('history-list');
        const loadingEl = document.getElementById('history-loading');
        const emptyEl = document.getElementById('history-empty');

        if (!listContainer) return;

        listContainer.innerHTML = '';
        loadingEl.classList.remove('hidden');
        emptyEl.classList.add('hidden');

        try {
            const response = await fetch('/api/history/list');
            const result = await response.json();

            loadingEl.classList.add('hidden');

            if (!result.convites || result.convites.length === 0) {
                emptyEl.classList.remove('hidden');
                return;
            }

            result.convites.forEach(convite => {
                const card = renderHistoryCard(convite);
                listContainer.appendChild(card);
            });

        } catch (error) {
            console.error('Error loading history:', error);
            loadingEl.classList.add('hidden');
            emptyEl.classList.remove('hidden');
        }
    }

    function renderHistoryCard(convite) {
        const card = document.createElement('div');
        card.className = 'bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-purple-500 transition-all group relative';

        // Get latest version for display
        const latestVersion = convite.versions && convite.versions[0];
        const versionCount = convite.versions ? convite.versions.length : 0;

        // Format date from latest version
        let dateStr = '';
        if (latestVersion && latestVersion.createdAt) {
            const date = new Date(latestVersion.createdAt);
            dateStr = date.toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        }

        // Thumbnail or placeholder
        const thumbHtml = convite.thumbnailUrl
            ? `<img src="${convite.thumbnailUrl}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Capa">`
            : `<div class="w-full h-full flex items-center justify-center text-gray-600"><i class="fa-solid fa-image text-xl"></i></div>`;

        // Version count badge
        const versionsBadge = versionCount > 1
            ? `<span class="absolute top-1 left-1 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">${versionCount}v</span>`
            : '';

        // Live URL button
        const liveUrlBtn = convite.liveUrl
            ? `<a href="${convite.liveUrl}" target="_blank" class="access-btn absolute bottom-12 left-1/2 -translate-x-1/2 bg-green-600 hover:bg-green-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10" onclick="event.stopPropagation()"><i class="fa-solid fa-external-link"></i> Acessar</a>`
            : '';

        card.innerHTML = `
            <div class="aspect-[9/16] bg-gray-900 overflow-hidden relative cursor-pointer">
                ${thumbHtml}
                ${versionsBadge}
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span class="text-white text-sm font-semibold"><i class="fa-solid fa-file-import"></i> Importar</span>
                </div>
                ${liveUrlBtn}
            </div>
            <div class="p-2">
                <h4 class="font-semibold text-white truncate text-sm" title="${convite.displayName}">${convite.displayName}</h4>
                ${convite.eventType ? `<p class="text-xs text-purple-400">${convite.eventType}</p>` : ''}
                <p class="text-xs text-gray-500 mt-1">${dateStr}</p>
                ${versionCount > 1 ? `<button class="versions-btn text-xs text-blue-400 hover:text-blue-300 mt-1"><i class="fa-solid fa-code-branch"></i> ${versionCount} versões</button>` : ''}
            </div>
            <div class="versions-dropdown hidden bg-gray-900 border-t border-gray-700 max-h-32 overflow-y-auto">
                ${convite.versions ? convite.versions.map((v, i) => {
            const vDate = v.createdAt ? new Date(v.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
            return `<div class="version-item px-2 py-1 hover:bg-gray-700 cursor-pointer text-xs text-gray-300 flex justify-between items-center gap-2" data-filename="${v.filename}">
                        <span class="version-import flex-1">v${versionCount - i} - ${vDate}</span>
                        <button class="version-delete-btn text-red-400 hover:text-red-300 opacity-50 hover:opacity-100" data-filename="${v.filename}" title="Excluir versão"><i class="fa-solid fa-trash text-[10px]"></i></button>
                    </div>`;
        }).join('') : ''}
            </div>
            <button class="delete-history-btn absolute top-1 right-1 bg-red-600/80 hover:bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" title="Excluir">
                <i class="fa-solid fa-trash text-xs"></i>
            </button>
            <button class="duplicate-history-btn absolute top-1 right-8 bg-blue-600/80 hover:bg-blue-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" title="Duplicar">
                <i class="fa-solid fa-copy text-xs"></i>
            </button>
            ${convite.liveUrl ? `<button class="github-import-btn absolute top-1 right-[60px] bg-green-600/80 hover:bg-green-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" title="Importar do GitHub (versão online)" data-url="${convite.liveUrl}">
                <i class="fa-brands fa-github text-xs"></i>
            </button>` : ''}
        `;

        // Click thumbnail to import latest version
        card.querySelector('.aspect-\\[9\\/16\\]').addEventListener('click', (e) => {
            if (e.target.closest('.access-btn')) return;
            if (latestVersion) importFromHistory(latestVersion.filename);
        });

        // Toggle versions dropdown
        const versionsBtn = card.querySelector('.versions-btn');
        const versionsDropdown = card.querySelector('.versions-dropdown');
        if (versionsBtn && versionsDropdown) {
            versionsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                versionsDropdown.classList.toggle('hidden');
            });
        }

        // Click on version item to import that version (or delete if delete btn clicked)
        card.querySelectorAll('.version-item').forEach(item => {
            // Import on text click
            item.querySelector('.version-import')?.addEventListener('click', (e) => {
                e.stopPropagation();
                const filename = item.dataset.filename;
                if (filename) importFromHistory(filename);
            });

            // Delete button
            item.querySelector('.version-delete-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                const filename = e.currentTarget.dataset.filename;
                if (filename) showDeleteConfirmation(filename, convite.displayName);
            });
        });

        // Delete button - delete ALL versions
        card.querySelector('.delete-history-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const filenames = convite.versions ? convite.versions.map(v => v.filename) : (latestVersion ? [latestVersion.filename] : []);
            if (filenames.length > 0) showDeleteConfirmation(filenames, convite.displayName);
        });

        // Duplicate button
        card.querySelector('.duplicate-history-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (latestVersion) showDuplicateDialog(latestVersion.filename, convite.displayName);
        });

        // GitHub import button (only exists for published invites)
        const githubBtn = card.querySelector('.github-import-btn');
        if (githubBtn) {
            githubBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const liveUrl = githubBtn.dataset.url;
                if (liveUrl) importFromGitHub(liveUrl, convite.displayName);
            });
        }

        return card;
    }

    async function showDuplicateDialog(sourceFilename, originalName) {
        // Show input popup for new name
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm';
        popup.innerHTML = `
            <div class="bg-gray-800 p-6 rounded-xl w-96 max-w-[90vw]">
                <h3 class="text-lg font-bold text-white mb-4">
                    <i class="fa-solid fa-copy mr-2 text-blue-400"></i> Duplicar Convite
                </h3>
                <p class="text-gray-400 text-sm mb-4">
                    Digite um novo nome para a cópia. Use um nome diferente para criar um novo card no histórico.
                </p>
                <input type="text" id="duplicate-name-input" class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4" 
                       value="${originalName} (cópia)" placeholder="Nome do novo convite">
                <div class="flex gap-2">
                    <button id="cancel-duplicate-btn" class="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button id="confirm-duplicate-btn" class="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                        <i class="fa-solid fa-copy mr-1"></i> Duplicar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        const input = popup.querySelector('#duplicate-name-input');
        input.focus();
        input.select();

        popup.querySelector('#cancel-duplicate-btn').addEventListener('click', () => popup.remove());
        popup.addEventListener('click', (e) => { if (e.target === popup) popup.remove(); });

        popup.querySelector('#confirm-duplicate-btn').addEventListener('click', async () => {
            const newName = input.value.trim();
            if (!newName) {
                showToast('Por favor, digite um nome para o convite.', 'error');
                return;
            }

            popup.querySelector('#confirm-duplicate-btn').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            popup.querySelector('#confirm-duplicate-btn').disabled = true;

            try {
                const response = await fetch('/api/history/duplicate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sourceFilename, newName })
                });

                const result = await response.json();

                if (result.error) {
                    throw new Error(result.error);
                }

                showToast(`Convite duplicado como "${newName}"!`, 'success');
                popup.remove();
                loadHistory(); // Refresh history
            } catch (error) {
                showToast('Erro ao duplicar: ' + error.message, 'error');
                popup.querySelector('#confirm-duplicate-btn').innerHTML = '<i class="fa-solid fa-copy mr-1"></i> Duplicar';
                popup.querySelector('#confirm-duplicate-btn').disabled = false;
            }
        });

        // Enter key to confirm
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') popup.querySelector('#confirm-duplicate-btn').click();
            if (e.key === 'Escape') popup.remove();
        });
    }

    async function importFromHistory(filename) {
        try {
            // Show loading
            const loadingPopup = document.createElement('div');
            loadingPopup.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm';
            loadingPopup.innerHTML = `
                <div class="bg-gray-800 p-8 rounded-xl text-center">
                    <i class="fa-solid fa-spinner fa-spin text-4xl text-purple-500 mb-4"></i>
                    <p class="text-white">Importando convite...</p>
                </div>
            `;
            document.body.appendChild(loadingPopup);

            // Fetch the ZIP from history
            const zipResponse = await fetch(`/history/${filename}`);
            const zipBlob = await zipResponse.blob();

            // Reset builder before importing (clear temp files and state)
            await fetch('/api/clear-cache', { method: 'POST' });
            localStorage.clear();

            // Create FormData with the ZIP
            const formData = new FormData();
            formData.append('file', zipBlob, filename);

            // Use existing import endpoint
            const response = await fetch('/api/import-zip', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            loadingPopup.remove();

            if (result.error) {
                throw new Error(result.error);
            }

            const data = result.data;
            applyImportedData(data, 'Convite Histórico');

            // Switch to form tab
            document.querySelector('.tab-btn[data-tab="tab-form"]').click();

        } catch (error) {
            console.error('Error importing from history:', error);
            showToast('Erro ao importar: ' + error.message, "error");
        }
    }

    async function importFromGitHub(liveUrl, displayName) {
        try {
            // Show loading
            const loadingPopup = document.createElement('div');
            loadingPopup.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm';
            loadingPopup.innerHTML = `
                <div class="bg-gray-800 p-8 rounded-xl text-center">
                    <i class="fa-brands fa-github fa-spin text-4xl text-green-500 mb-4"></i>
                    <p class="text-white">Importando do GitHub...</p>
                    <p class="text-gray-400 text-sm mt-2">${displayName || liveUrl}</p>
                </div>
            `;
            document.body.appendChild(loadingPopup);

            // Reset builder before importing
            await fetch('/api/clear-cache', { method: 'POST' });
            localStorage.clear();

            // Call the new GitHub import endpoint
            const response = await fetch('/api/import-from-github', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ liveUrl })
            });

            const result = await response.json();
            loadingPopup.remove();

            if (result.error) {
                throw new Error(result.error);
            }

            const data = result.data;
            applyImportedData(data, 'GitHub Pages');

            // Switch to form tab
            document.querySelector('.tab-btn[data-tab="tab-form"]').click();

            showToast('✓ Convite importado do GitHub com sucesso!', 'success');

        } catch (error) {
            console.error('Error importing from GitHub:', error);
            showToast('Erro ao importar do GitHub: ' + error.message, "error");
            // Remove loading popup if still present
            document.querySelector('.fixed.inset-0.z-50')?.remove();
        }
    }

    function showDeleteConfirmation(filenamesOrString, displayName) {
        const isBulk = Array.isArray(filenamesOrString);
        const filenames = isBulk ? filenamesOrString : [filenamesOrString];
        const count = filenames.length;

        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in';
        popup.innerHTML = `
            <div class="bg-gray-800 rounded-xl p-6 max-w-sm mx-4 border border-gray-700 shadow-2xl">
                <div class="text-center mb-4">
                    <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fa-solid fa-triangle-exclamation text-red-400 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">Excluir Convite?</h3>
                    <p class="text-gray-400">
                        Tem certeza que deseja excluir <strong class="text-white">"${displayName}"</strong>?
                        ${isBulk && count > 1 ? `<br><span class="text-xs text-red-400 font-semibold">Isso apagará todas as ${count} versões!</span>` : ''}
                    </p>
                    <p class="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
                </div>
                <div class="flex gap-3">
                    <button id="cancel-delete" class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button id="confirm-delete" class="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg transition-colors">
                        <i class="fa-solid fa-trash"></i> Excluir ${isBulk && count > 1 ? 'Tudo' : ''}
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        popup.querySelector('#cancel-delete').addEventListener('click', () => popup.remove());
        popup.addEventListener('click', (e) => {
            if (e.target === popup) popup.remove();
        });

        popup.querySelector('#confirm-delete').addEventListener('click', async () => {
            const btn = popup.querySelector('#confirm-delete');
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;

            try {
                const response = await fetch('/api/history/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filenames: filenames })
                });

                const result = await response.json();

                if (result.error) {
                    throw new Error(result.error);
                }

                popup.remove();
                loadHistory(); // Refresh list

            } catch (error) {
                console.error('Error deleting:', error);
                showToast('Erro ao excluir: ' + error.message, "error");
                popup.remove();
            }
        });
    }

    // Load history when switching to history tab
    document.querySelector('.tab-btn[data-tab="tab-history"]')?.addEventListener('click', loadHistory);

    // Refresh button
    document.getElementById('btn-refresh-history')?.addEventListener('click', loadHistory);
    // --- Shared Import Helper ---
    function applyImportedData(data, sourceLabel) {
        // Prevent auto-download from triggering during import
        isImporting = true;

        // Reset extra links and manual context
        clearExtraLinks();
        manualThreadId = null;
        localStorage.removeItem('manualThreadId');
        // 1. Populate FORM
        const fieldMappings = {
            'names': 'input-names',
            'date': 'input-date',
            'time': 'input-time',
            'eventType': 'input-event-type',
            'theme': 'input-theme',
            'age': 'input-age',
            'colors': 'input-colors',
            'phrase': 'input-phrase',
            'music': 'input-music',
            'location': 'input-location',
            'mapsLink': 'input-maps',
            'giftsLink': 'input-gifts',
            'giftSuggestions': 'input-gift-suggestions',
            'whatsapp': 'input-whatsapp',
            'confirmLink': 'input-confirm-link',
            'extraLink': 'input-extra',
            'extraName': 'input-extra-name',
            'extraIcon': 'input-extra-icon',
            'buttonColor': 'input-button-color',
            'buttonsOffset': 'input-buttons-offset',
            'manual': 'input-manual',
            'manualName': 'input-manual-name',
            'buttonSize': 'input-button-size',
            'shadowColor': 'input-shadow-color',
            'slug': 'input-slug'
        };

        // FIRST: Clear ALL text/input fields
        for (const [dataKey, inputId] of Object.entries(fieldMappings)) {
            const el = document.getElementById(inputId);
            if (el) {
                // Reset to default value for color/range inputs 
                if (el.type === 'color') {
                    el.value = el.id === 'input-button-color' ? '#292524' : '#000000';
                } else if (el.type === 'range') {
                    el.value = '1.0';
                } else if (el.type === 'number' && el.id === 'input-buttons-offset') {
                    el.value = '0';
                } else {
                    el.value = '';
                }
                localStorage.removeItem(inputId);
            }
        }

        // Clear synced textareas (these are mirrors of other fields)
        const syncFields = ['input-manual-sync', 'input-manual-final', 'input-gift-suggestions-sync', 'input-gifts-tab'];
        syncFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        // Reset checkboxes to default state
        const checkAllowCompanion = document.getElementById('check-allow-companion');
        if (checkAllowCompanion) checkAllowCompanion.checked = true; // Default: checked

        const checkShowTimer = document.getElementById('check-show-timer');
        if (checkShowTimer) checkShowTimer.checked = false; // Default: unchecked

        const checkInteractHint = document.getElementById('check-interact-hint');
        if (checkInteractHint) checkInteractHint.checked = true; // Default: checked

        // THEN: Apply only the fields that exist in the imported data
        for (const [dataKey, inputId] of Object.entries(fieldMappings)) {
            if (data.formData && data.formData[dataKey] !== undefined) {
                const el = document.getElementById(inputId);
                if (el) {
                    el.value = data.formData[dataKey];
                    localStorage.setItem(inputId, data.formData[dataKey]);
                    el.dispatchEvent(new Event('input'));
                }
            }
        }

        if (data.formData && data.formData.music) {
            const musicQuery = document.getElementById('music-query');
            if (musicQuery) musicQuery.value = data.formData.music;
        } else {
            const musicQuery = document.getElementById('music-query');
            if (musicQuery) musicQuery.value = '';
        }

        // Restore checkboxes from imported data if present
        if (data.formData) {
            if (data.formData.allowCompanion !== undefined) {
                const el = document.getElementById('check-allow-companion');
                if (el) el.checked = data.formData.allowCompanion;
            }
            if (data.formData.showTimer !== undefined) {
                const el = document.getElementById('check-show-timer');
                if (el) el.checked = data.formData.showTimer;
            }
            if (data.formData.interactHint !== undefined) {
                const el = document.getElementById('check-interact-hint');
                if (el) el.checked = data.formData.interactHint;
            }
        }

        // 2. Previews
        const timestamp = Date.now();

        const previewMap = {
            'capa.jpg': { img: 'preview-cover', dl: 'download-cover' },
            'abertura.mp4': { img: 'preview-anim-cover', dl: 'download-anim-cover' },
            'loop.mp4': { img: 'preview-anim-leaf', dl: 'download-anim-leaf' },
            'folha_vazia.jpg': { img: 'preview-leaf-empty', dl: null },
            'folha_preenchida.jpg': { img: 'preview-leaf-filled', dl: 'download-leaf-filled' }
        };

        // FIRST: Clear ALL previews
        for (const [filename, conf] of Object.entries(previewMap)) {
            const el = document.getElementById(conf.img);
            if (el) {
                el.src = '';
                el.classList.add('hidden');
            }
            if (conf.dl) {
                const dlBtn = document.getElementById(conf.dl);
                if (dlBtn) {
                    dlBtn.href = '#';
                    dlBtn.classList.add('hidden');
                }
            }
        }
        // Clear audio
        const audioPreview = document.getElementById('preview-audio');
        if (audioPreview) audioPreview.src = '';
        document.getElementById('music-status')?.classList.add('hidden');

        // Clear gifts
        const giftsImage = document.getElementById('preview-gifts-image');
        if (giftsImage) giftsImage.src = '';
        document.getElementById('preview-gifts-container')?.classList.add('hidden');

        // THEN: Apply only media that exists in imported data

        for (const [filename, conf] of Object.entries(previewMap)) {
            if (data.files[filename]) {
                const el = document.getElementById(conf.img);
                if (el) {
                    el.src = data.files[filename] + '?t=' + timestamp;
                    el.classList.remove('hidden');
                }
                if (conf.dl) {
                    const dlBtn = document.getElementById(conf.dl);
                    if (dlBtn) {
                        dlBtn.href = data.files[filename];
                        dlBtn.classList.remove('hidden');
                    }
                }
            }
        }

        if (data.files['musica.mp3']) {
            document.getElementById('preview-audio').src = data.files['musica.mp3'] + '?t=' + timestamp;
            document.getElementById('music-status').classList.remove('hidden');
        }

        // 3. SPECIAL: Gifts Logic (Fixes State Issue)
        // Reset first
        giftMode = 'none';

        // Check for Image
        if (data.files['presentes.jpg']) {
            const previewGifts = document.getElementById('preview-gifts-image');
            const containerGifts = document.getElementById('preview-gifts-container');
            const downloadGifts = document.getElementById('download-gifts-image');
            const url = data.files['presentes.jpg'];

            if (previewGifts) {
                previewGifts.src = url + '?t=' + timestamp;
                previewGifts.classList.remove('hidden');
            }
            if (containerGifts) containerGifts.classList.remove('hidden');
            if (downloadGifts) {
                downloadGifts.href = url;
                downloadGifts.classList.remove('hidden');
            }
            if (btnRemoveGiftsImage) btnRemoveGiftsImage.classList.remove('hidden');

            giftMode = 'image';
            localStorage.setItem('giftMode', 'image');
            localStorage.setItem('giftImageUrl', url);

            // Clear link inputs to avoid confusion
            const giftsInput = document.getElementById('input-gifts');
            if (giftsInput) { giftsInput.value = ''; localStorage.setItem('input-gifts', ''); }

        } else if (data.formData.giftsLink && data.formData.giftsLink.trim() !== '') {
            giftMode = 'link';
            localStorage.setItem('giftMode', 'link');
            deleteGiftImage(); // Clear any stale image state
        } else {
            localStorage.setItem('giftMode', 'none');
            deleteGiftImage();
        }

        updateGiftModeDisplay();

        // Restore Timer State
        if (data.formData.showTimer !== undefined) {
            const timerCheck = document.getElementById('check-show-timer');
            if (timerCheck) timerCheck.checked = data.formData.showTimer;
        }

        // Restore Extra Links
        if (data.formData.extraLinks && Array.isArray(data.formData.extraLinks)) {
            restoreExtraLinks(data.formData.extraLinks);
        }


        // 4. Manual Text
        // FIX: Check both keys (modern and legacy/fallback)
        const importedManual = data.formData.processedManualText || data.formData.manualText;

        if (importedManual) {
            processedManualText = importedManual;
            localStorage.setItem('processedManualText', processedManualText);

            const finalInput = document.getElementById('input-manual-final');
            if (finalInput) finalInput.value = processedManualText;

            document.getElementById('btn-preview-manual').disabled = false;
            const statusEl = document.getElementById('manual-status');
            if (statusEl) {
                statusEl.textContent = '✓ Manual importado com sucesso!';
                statusEl.classList.remove('hidden');
                statusEl.classList.remove('text-gray-400');
                statusEl.classList.add('text-green-400');
            }
        } else {
            // FIX: Explicitly CLEAR manual if not present in imported data
            // This prevents "leaking" manual from previous session!
            processedManualText = "";
            localStorage.removeItem('processedManualText');

            const finalInput = document.getElementById('input-manual-final');
            if (finalInput) finalInput.value = "";

            // Also clear requests to avoid ghost text if no manual exists
            const manualSync = document.getElementById('input-manual-sync');
            // We do not clear input-manual (form) because it might be part of form import, 
            // but if manualText key assumes manual input, we should ensure it matches.
            // Actually, applyImportedData handles formInputs separately.
            if (manualSync) {
                const manualIn = document.getElementById('input-manual');
                if (manualIn) manualSync.value = manualIn.value; // Sync with whatever was imported into form
            }

            document.getElementById('btn-preview-manual').disabled = true;
            const statusEl = document.getElementById('manual-status');
            if (statusEl) {
                statusEl.textContent = 'Nenhum manual neste convite';
                statusEl.classList.remove('hidden');
                statusEl.classList.remove('text-green-400');
                statusEl.classList.add('text-gray-400');
            }
        }

        // 5. Clear manual thread ID
        manualThreadId = null;
        localStorage.removeItem('manualThreadId');

        // 6. Restore Manual Mode (Text or Image)
        if (data.formData.manualMode === 'image' && data.files && data.files['manual.jpg']) {
            manualMode = 'image';
            localStorage.setItem('manualMode', 'image');
            localStorage.setItem('manualImageUrl', data.files['manual.jpg']);

            const preview = document.getElementById('preview-manual-image');
            const removeBtn = document.getElementById('btn-remove-manual-image');
            if (preview) { preview.src = data.files['manual.jpg'] + '?t=' + Date.now(); preview.classList.remove('hidden'); }
            if (removeBtn) removeBtn.classList.remove('hidden');
        } else {
            manualMode = 'text';
            localStorage.setItem('manualMode', 'text');
            deleteManualImage();
        }
        updateManualModeDisplay();

        updateGiftLinkDisplay();
        saveMediaUrls(); // Persist imported media URLs
        updateCustomIndexUI(); // Refresh custom index status after import

        // Re-enable auto-download after import is complete
        isImporting = false;

        showToast('✓ ' + sourceLabel + ' importado com sucesso!', "success");
    }

    // --- Link Temporário logic removed (Ngrok Cleanup) ---

}

);

// --- GitHub Actions Status Polling ---
// Polls the GitHub Actions workflow status after deploy to show real-time progress

async function pollGitHubActionsStatus(username, token, repo = 'convites') {
    const statusDiv = document.getElementById('github-actions-status');
    if (!statusDiv) return;

    const MAX_ATTEMPTS = 60; // 5 minutes max (60 * 5s)
    const POLL_INTERVAL = 5000; // 5 seconds
    let attempts = 0;

    const updateStatusUI = (status, message, isComplete = false, isError = false) => {
        let bgClass, borderClass, textClass, icon;

        if (isError) {
            bgClass = 'bg-red-900/30';
            borderClass = 'border-red-600';
            textClass = 'text-red-300';
            icon = 'fa-circle-xmark';
        } else if (isComplete) {
            bgClass = 'bg-green-900/30';
            borderClass = 'border-green-600';
            textClass = 'text-green-300';
            icon = 'fa-check-circle';
        } else if (status === 'in_progress') {
            bgClass = 'bg-blue-900/30';
            borderClass = 'border-blue-600';
            textClass = 'text-blue-300';
            icon = 'fa-spinner fa-spin';
        } else {
            bgClass = 'bg-yellow-900/30';
            borderClass = 'border-yellow-600';
            textClass = 'text-yellow-300';
            icon = 'fa-clock';
        }

        statusDiv.className = `mt-2 p-3 rounded-lg border ${bgClass} ${borderClass} ${textClass}`;
        statusDiv.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fa-solid ${icon}"></i>
                <span>${message}</span>
            </div>
        `;
    };

    const checkStatus = async () => {
        try {
            const response = await fetch('/api/github-actions-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, token, repo })
            });

            if (!response.ok) {
                throw new Error('Falha ao verificar status');
            }

            const data = await response.json();

            if (data.error) {
                console.warn('GitHub Actions Status Error:', data.error);
                updateStatusUI('unknown', 'Não foi possível verificar status', false, false);
                return true; // Stop polling on error
            }

            const { status, conclusion, jobs } = data;

            // Determine current step based on jobs
            let currentStep = 'Aguardando...';
            if (jobs) {
                if (jobs.build?.status === 'in_progress') {
                    currentStep = 'Build em andamento...';
                } else if (jobs.deploy?.status === 'in_progress') {
                    currentStep = 'Deploy em andamento...';
                } else if (jobs['report-build-status']?.status === 'in_progress') {
                    currentStep = 'Reportando status...';
                }
            }

            if (status === 'completed') {
                if (conclusion === 'success') {
                    updateStatusUI('completed', '✅ Página atualizada com sucesso!', true, false);
                } else {
                    updateStatusUI('completed', `❌ Falha no deploy: ${conclusion}`, false, true);
                }
                return true; // Stop polling
            } else if (status === 'in_progress') {
                updateStatusUI('in_progress', currentStep, false, false);
            } else if (status === 'queued' || status === 'waiting') {
                updateStatusUI('queued', 'Aguardando início do workflow...', false, false);
            } else {
                updateStatusUI('unknown', `Status: ${status}`, false, false);
            }

            return false; // Continue polling

        } catch (error) {
            console.error('Error polling GitHub Actions:', error);
            updateStatusUI('error', 'Erro ao verificar status', false, true);
            return true; // Stop polling on error
        }
    };

    // Wait initial 3 seconds for workflow to be triggered
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Polling loop
    while (attempts < MAX_ATTEMPTS) {
        const shouldStop = await checkStatus();
        if (shouldStop) break;

        attempts++;
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    }

    if (attempts >= MAX_ATTEMPTS) {
        updateStatusUI('timeout', 'Tempo limite excedido. Verifique manualmente.', false, true);
    }
}

const initGitHubDeploy = () => {
    const btnDeployGithub = document.getElementById('btn-deploy-github');
    const inputGithubUser = document.getElementById('input-github-user');
    const inputGithubToken = document.getElementById('input-github-token');
    const inputSlug = document.getElementById('input-slug');
    const deployResult = document.getElementById('deploy-result');

    if (btnDeployGithub) {
        // --- Server-Side Persistence ---
        // 1. Load Data on Init
        fetch('/api/load-project-data')
            .then(r => r.json())
            .then(data => {
                const d = data.data || {};
                if (d.github_user) inputGithubUser.value = d.github_user;
                if (d.github_token) inputGithubToken.value = d.github_token;
                if (d.github_slug) inputSlug.value = d.github_slug;
            })
            .catch(err => console.error("Error loading project data:", err));

        // 2. Save Data on Input
        const saveProjectData = (key, value) => {
            fetch('/api/save-project-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [key]: value })
            }).catch(err => console.error("Error saving project data:", err));
        };

        // Debounce helper
        let timeout;
        const debouncedSave = (key, value) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => saveProjectData(key, value), 500);
        };

        inputGithubUser.addEventListener('input', (e) => debouncedSave('github_user', e.target.value));
        inputGithubToken.addEventListener('input', (e) => debouncedSave('github_token', e.target.value));
        inputSlug.addEventListener('input', (e) => debouncedSave('github_slug', e.target.value));

        btnDeployGithub.addEventListener('click', async () => {
            const user = inputGithubUser.value.trim();
            const token = inputGithubToken.value.trim();
            const slug = inputSlug.value.trim();

            if (!user || !token || !slug) {
                showToast('Por favor, preencha Usuário, Token e Slug.', "success");
                return;
            }
            // (LocalStorage removed as user requested server persistence)

            const btn = btnDeployGithub;
            const originalHTML = btn.innerHTML;

            deployResult.classList.add('hidden');

            try {
                // 1. Check Existence
                btn.innerHTML = '<i class="fa-solid fa-search fa-spin"></i> Verificando...';
                btn.disabled = true;

                const checkResp = await fetch('/api/check-slug-existence', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, token: token, slug: slug })
                });

                // Robust verify check
                const checkText = await checkResp.text();
                let checkResult;
                try {
                    checkResult = JSON.parse(checkText);
                } catch (e) {
                    throw new Error(`Server Check Error (Non-JSON): ${checkText.substring(0, 100)}...`);
                }

                if (!checkResp.ok && !checkResult.error) {
                    throw new Error(`Server Check Failed: ${checkResp.status} ${checkResp.statusText}`);
                }

                if (checkResult.exists) {
                    const confirmUpdate = await showConfirm(
                        `O link "${slug}" já existe no repositório.<br>Deseja atualizar (sobrescrever) o convite existente?`,
                        { title: 'Slug Existente', confirmText: 'Sobrescrever', confirmClass: 'modal-btn-danger', icon: 'fa-exclamation-triangle' }
                    );
                    if (!confirmUpdate) {
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                        return;
                    }
                }

                // 2. Refresh Build & Save History (BEFORE Deploy)
                btn.innerHTML = '<i class="fa-solid fa-save fa-spin"></i> Preparando...';
                deployResult.innerHTML = '<i class="fa-solid fa-gear fa-spin"></i> Gerando build...';
                deployResult.classList.remove('hidden', 'bg-red-900/30', 'border-red-700', 'text-red-300', 'bg-green-900/30', 'border-green-700', 'text-green-300');
                deployResult.classList.add('bg-blue-900/30', 'border-blue-700', 'text-blue-300');

                // Use buildOnly=true to prevent server restart caused by history/zip generation
                await generateZipPackage(false, true);

                // 3. Deploy with SSE Progress
                btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up fa-spin"></i> Publicando...';

                // Use fetch + ReadableStream for SSE-like handling with POST
                const response = await fetch('/api/deploy-github-stream', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: user,
                        token: token,
                        slug: slug
                    })
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Server Error: ${response.status} - ${errText}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let finalResult = null;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.substring(6));

                                if (data.stage === 'error') {
                                    throw new Error(data.message);
                                } else if (data.stage === 'done') {
                                    finalResult = data;
                                } else {
                                    // Update progress display
                                    const icon = data.stage === 'analyzing' ? 'fa-magnifying-glass' :
                                        data.stage === 'cleanup' ? 'fa-broom' :
                                            data.stage === 'uploading' ? 'fa-cloud-arrow-up' :
                                                data.stage === 'complete' ? 'fa-check' : 'fa-spinner fa-spin';
                                    deployResult.innerHTML = `
                                        <div class="flex items-center gap-3">
                                            <i class="fa-solid ${icon} ${data.stage !== 'complete' ? 'fa-spin' : ''}"></i>
                                            <div class="flex-1">
                                                <div class="text-sm">${data.message}</div>
                                                <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                    <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: ${data.percent}%"></div>
                                                </div>
                                            </div>
                                            <span class="text-xs font-mono">${data.percent}%</span>
                                        </div>
                                    `;
                                }
                            } catch (e) {
                                if (e.message !== 'Unexpected end of JSON input') {
                                    throw e;
                                }
                            }
                        }
                    }
                }

                if (!finalResult) {
                    throw new Error('Deploy stream ended without final result');
                }

                // 4. Success UI with GitHub Actions Status
                deployResult.innerHTML = `
                    <div class="flex flex-col gap-2">
                        <div class="text-green-300 font-bold flex items-center gap-2">
                            <i class="fa-solid fa-check-circle"></i> Arquivos enviados!
                        </div>
                        <a href="${finalResult.live_url}" target="_blank" class="bg-green-600/20 border border-green-500/50 p-3 rounded-lg text-green-300 hover:bg-green-600/30 transition-colors flex items-center justify-between group">
                            <span class="font-mono text-sm truncate">${finalResult.live_url}</span>
                            <i class="fa-solid fa-external-link-alt group-hover:scale-110 transition-transform"></i>
                        </a>
                        <a href="${finalResult.repo_url}" target="_blank" class="bg-gray-700/50 border border-gray-600 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-2 text-xs">
                            <i class="fa-brands fa-github text-lg"></i>
                            <span>Abrir Pasta do Convite (Arquivos)</span>
                        </a>
                        <div id="github-actions-status" class="mt-2 p-3 rounded-lg border bg-yellow-900/30 border-yellow-600 text-yellow-300">
                            <div class="flex items-center gap-2">
                                <i class="fa-solid fa-spinner fa-spin"></i>
                                <span>Aguardando GitHub Pages...</span>
                            </div>
                        </div>
                    </div>
                `;
                deployResult.classList.remove('hidden', 'bg-red-900/30', 'border-red-700', 'text-red-300', 'bg-blue-900/30', 'border-blue-700', 'text-blue-300');
                deployResult.classList.add('bg-green-900/30', 'border-green-700', 'text-green-300');

                // 5. Start polling GitHub Actions status
                pollGitHubActionsStatus(user, token, 'convites');


            } catch (error) {
                console.error(error);
                deployResult.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Erro: ${error.message}`;
                deployResult.classList.remove('hidden', 'bg-green-900/30', 'border-green-700', 'text-green-300');
                deployResult.classList.add('bg-red-900/30', 'border-red-700', 'text-red-300');
            } finally {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        });
    }
};

// Initiate
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGitHubDeploy);
} else {
    initGitHubDeploy();
}

// Dashboard CMS Button Handler
document.getElementById('btn-run-dashboard')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-run-dashboard');
    const originalHTML = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Abrindo...';

    try {
        const response = await fetch('/api/run-dashboard', { method: 'POST' });
        const result = await response.json();

        if (result.error) {
            showToast('Erro: ' + result.error, 'error');
        } else {
            showToast('Dashboard CMS aberto com sucesso!', 'success');
        }
    } catch (error) {
        showToast('Erro ao abrir dashboard: ' + error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
});

// Custom ZIP Direct Deploy Handler
(function initCustomZipDeploy() {
    const dropzone = document.getElementById('custom-zip-dropzone');
    const fileInput = document.getElementById('input-custom-zip-deploy');
    const statusDiv = document.getElementById('custom-zip-deploy-status');

    if (!dropzone || !fileInput) return;

    // Click to select file
    dropzone.addEventListener('click', () => fileInput.click());

    // Drag and drop events
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-purple-500', 'bg-purple-900/20');
    });

    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-purple-500', 'bg-purple-900/20');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-purple-500', 'bg-purple-900/20');

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].name.endsWith('.zip')) {
            handleCustomZipDeploy(files[0]);
        } else {
            showToast('Por favor, solte um arquivo .zip', 'error');
        }
    });

    // File input change
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleCustomZipDeploy(fileInput.files[0]);
            fileInput.value = ''; // Reset for next upload
        }
    });

    async function handleCustomZipDeploy(file) {
        const slug = document.getElementById('input-slug')?.value?.trim();
        const githubUser = document.getElementById('input-github-user')?.value?.trim();
        const githubToken = document.getElementById('input-github-token')?.value?.trim();

        if (!slug) {
            showToast('Por favor, preencha o campo Slug antes de publicar.', 'error');
            return;
        }

        if (!githubUser || !githubToken) {
            showToast('Por favor, preencha as credenciais do GitHub.', 'error');
            return;
        }

        // Show status
        statusDiv.classList.remove('hidden', 'text-green-400', 'text-red-400');
        statusDiv.classList.add('text-blue-400');
        statusDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Publicando ' + file.name + '...';
        dropzone.style.pointerEvents = 'none';
        dropzone.style.opacity = '0.5';

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('slug', slug);
            formData.append('githubUser', githubUser);
            formData.append('githubToken', githubToken);

            const response = await fetch('/api/deploy-custom-zip', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            statusDiv.classList.remove('text-blue-400');
            statusDiv.classList.add('text-green-400');
            statusDiv.innerHTML = `
                <i class="fa-solid fa-circle-check mr-2"></i> Publicado com sucesso!<br>
                <a href="${result.url}" target="_blank" class="underline">${result.url}</a>
            `;

            showToast('ZIP publicado com sucesso!', 'success');

        } catch (error) {
            statusDiv.classList.remove('text-blue-400');
            statusDiv.classList.add('text-red-400');
            statusDiv.innerHTML = '<i class="fa-solid fa-circle-exclamation mr-2"></i> Erro: ' + error.message;
            showToast('Erro ao publicar: ' + error.message, 'error');
        } finally {
            dropzone.style.pointerEvents = '';
            dropzone.style.opacity = '';
        }
    }
})();
