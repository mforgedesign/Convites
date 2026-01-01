/**
 * AutoBuilder v4.0 - Preview Controller
 * ======================================
 * Updates the device preview in real-time based on form state.
 * Buttons only appear when their respective links are configured.
 */

(function () {
    'use strict';

    // ========================================
    // Native Button Definitions (conditional)
    // ========================================

    // Native buttons only appear if their respective links are filled
    // Native buttons only appear if their respective links/media are filled
    const NATIVE_BUTTON_MAP = {
        link_google_maps: { id: 'local', label: 'Local', icon: 'fa-solid fa-location-dot' },
        numero_whatsapp: { id: 'confirmar', label: 'Confirmar', icon: 'fa-brands fa-whatsapp' },
        link_presentes: { id: 'presentes', label: 'Presentes', icon: 'fa-solid fa-gift' },
        manual: { id: 'manual', label: 'Manual', icon: 'fa-solid fa-book-open' }
    };

    // Default gradient when no media is available
    const DEFAULT_GRADIENT = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';

    // Current state
    let currentState = {
        cor_botoes: '#4f46e5',
        posicao_botoes: 50,
        timer_contagem: false,
        links_extras: [],
        // Native link fields
        link_google_maps: '',
        numero_whatsapp: '',
        link_presentes: '',
        manual_content: '',
        // Media fields - Priority: folha_animada/folha_preenchida > folha_vazia > gradient
        media_folha_animada: null,
        media_folha_preenchida: null,
        media_folha_vazia: null,
        media_presentes: null,
        media_manual: null
    };

    // ========================================
    // Core Render Functions
    // ========================================

    /**
     * Creates a button element for the preview.
     * @param {object} btn - Button config object
     * @param {string} color - Background color
     * @returns {HTMLElement}
     */
    function createButtonElement(btn, color) {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex flex-col items-center gap-1 cursor-pointer preview-btn';
        wrapper.dataset.type = btn.type || 'native';

        const circle = document.createElement('div');
        circle.className = 'w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300';
        circle.style.backgroundColor = color;

        const icon = document.createElement('i');
        icon.className = btn.icon || 'fa-solid fa-link';
        circle.appendChild(icon);

        const label = document.createElement('span');
        label.className = 'text-[9px] uppercase font-bold text-white drop-shadow-md tracking-wider';
        label.textContent = btn.label || 'Link';

        wrapper.appendChild(circle);
        wrapper.appendChild(label);

        return wrapper;
    }

    /**
     * Renders all buttons (native + extras) in the preview.
     */
    function renderButtons() {
        const container = document.querySelector('#mobile-preview-buttons > div');
        if (!container) {
            console.warn('[Preview] Button container not found');
            return;
        }

        const color = currentState.cor_botoes || '#4f46e5';

        // Clear existing buttons
        container.innerHTML = '';

        let buttonCount = 0;

        // Helper to check if a button should show
        const shouldShow = (key) => {
            if (key === 'link_google_maps') return !!currentState.link_google_maps;
            if (key === 'numero_whatsapp') return !!currentState.numero_whatsapp;

            // Presentes: Show if link exists OR image exists
            if (key === 'link_presentes') {
                return !!currentState.link_presentes || (currentState.media_presentes && currentState.media_presentes.url);
            }

            // Manual: Show if manual image exists OR content text exists
            if (key === 'manual') {
                const show = (currentState.media_manual && currentState.media_manual.url) ||
                    (currentState.manual_content && currentState.manual_content.length > 5);
                console.log(`[Preview] Manual logic: manual_content="${currentState.manual_content}" show=${show}`);
                return show;
            }

            return false;
        };

        // Add native buttons
        for (const [key, config] of Object.entries(NATIVE_BUTTON_MAP)) {
            if (shouldShow(key)) {
                container.appendChild(createButtonElement({
                    ...config,
                    type: 'native'
                }, color));
                buttonCount++;
            }
        }

        // Add extra links
        (currentState.links_extras || []).forEach(link => {
            if (link.label && link.label.trim()) {
                container.appendChild(createButtonElement({
                    id: 'extra-' + (link.id || Math.random()),
                    label: link.label,
                    icon: link.icon || 'fa-solid fa-link',
                    type: 'extra'
                }, color));
                buttonCount++;
            }
        });

        // Hide/show the entire button container based on content
        const buttonsWrapper = document.getElementById('mobile-preview-buttons');
        if (buttonsWrapper) {
            buttonsWrapper.style.display = buttonCount > 0 ? 'flex' : 'none';
        }
    }

    /**
     * Updates button colors without re-rendering.
     * @param {string} color - New hex color
     */
    function updateButtonColors(color) {
        const buttons = document.querySelectorAll('#mobile-preview-buttons .rounded-full');
        buttons.forEach(btn => {
            btn.style.backgroundColor = color;
        });
        currentState.cor_botoes = color;
    }

    /**
     * Updates the shadow gradient color.
     * @param {string} color - New hex color
     */
    function updateShadow(color) {
        const shadow = document.getElementById('preview-shadow');
        if (shadow) {
            shadow.style.background = `linear-gradient(to top, ${color}, transparent)`;
        }
        currentState.sombra_gradiente = color;
    }

    /**
     * Updates button position (bottom offset).
     * @param {number} value - Offset in pixels
     */
    function updateButtonPosition(value) {
        const container = document.getElementById('mobile-preview-buttons');
        if (container) {
            container.style.bottom = value + 'px';
        }
        currentState.posicao_botoes = value;
    }

    /**
     * Toggles timer visibility.
     * @param {boolean} visible
     */
    function updateTimerVisibility(visible) {
        const timer = document.getElementById('preview-timer');
        const mobileTimer = document.getElementById('mobile-preview-timer');

        if (timer) {
            timer.style.display = visible ? 'flex' : 'none';
        }
        if (mobileTimer) {
            mobileTimer.style.display = visible ? 'flex' : 'none';
        }

        currentState.timer_contagem = visible;
    }

    /**
     * Updates the preview background based on priority:
     * 1. Folha Animada (video) or Folha Preenchida (image)
     * 2. Folha Vazia (blank sheet image)
     * 3. Default gradient
     */
    function updateBackground() {
        const previewContent = document.getElementById('mobile-preview-content');
        if (!previewContent) {
            console.warn('[Preview] Preview content element not found');
            return;
        }

        // Remove any existing video element
        const existingVideo = previewContent.querySelector('video.preview-bg-video');
        if (existingVideo) {
            existingVideo.remove();
        }

        // Priority 1: Folha Animada (video)
        if (currentState.media_folha_animada && currentState.media_folha_animada.url) {
            const video = document.createElement('video');
            video.className = 'preview-bg-video absolute inset-0 w-full h-full object-cover z-0';
            video.src = currentState.media_folha_animada.url;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            previewContent.insertBefore(video, previewContent.firstChild);
            previewContent.style.backgroundImage = 'none';
            console.log('[Preview] Background set to: folha_animada (video)');
            return;
        }

        // Priority 1 (alt): Folha Preenchida (image)
        if (currentState.media_folha_preenchida && currentState.media_folha_preenchida.url) {
            previewContent.style.backgroundImage = `url('${currentState.media_folha_preenchida.url}')`;
            console.log('[Preview] Background set to: folha_preenchida (image)');
            return;
        }

        // Priority 2: Folha Vazia
        if (currentState.media_folha_vazia && currentState.media_folha_vazia.url) {
            previewContent.style.backgroundImage = `url('${currentState.media_folha_vazia.url}')`;
            console.log('[Preview] Background set to: folha_vazia (image)');
            return;
        }

        // Priority 3: Default gradient
        previewContent.style.backgroundImage = DEFAULT_GRADIENT;
        console.log('[Preview] Background set to: default gradient');
    }

    // ========================================
    // Event Listeners
    // ========================================

    function setupEventListeners() {
        // Listen for state updates from form.js
        document.addEventListener('stateUpdated', (e) => {
            // Handle bulk update from persistence
            if (e.detail.source === 'persistence') {
                console.log('[Preview] Restoring state from persistence');
                if (e.detail.data && e.detail.data.formData) {
                    Object.assign(currentState, e.detail.data.formData);

                    // Force re-renders
                    updateBackground();
                    renderButtons();
                    updateShadow(currentState.sombra_gradiente);
                    updateButtonColors(currentState.cor_botoes);
                    updateButtonPosition(currentState.posicao_botoes);
                    updateTimerVisibility(currentState.timer_contagem);
                }
                return;
            }

            const { field, value } = e.detail;

            // Update internal state
            currentState[field] = value;

            switch (field) {
                case 'cor_botoes':
                    updateButtonColors(value);
                    break;
                case 'sombra_gradiente':
                    updateShadow(value);
                    break;
                case 'posicao_botoes':
                    updateButtonPosition(value);
                    break;
                case 'timer_contagem':
                    updateTimerVisibility(value);
                    break;
                // Re-render buttons when native link fields change
                case 'link_google_maps':
                case 'numero_whatsapp':
                case 'link_presentes':
                    renderButtons();
                    break;
            }
        });

        // Listen for links extras updates
        document.addEventListener('linksExtrasUpdated', (e) => {
            currentState.links_extras = e.detail.links || [];
            renderButtons();
        });

        // Listen for media updates (from upload windows)
        document.addEventListener('mediaUpdated', (e) => {
            const { type, data } = e.detail;

            switch (type) {
                case 'folha_animada':
                    currentState.media_folha_animada = data;
                    updateBackground();
                    break;
                case 'folha_preenchida':
                    currentState.media_folha_preenchida = data;
                    updateBackground();
                    break;
                case 'folha_vazia':
                    currentState.media_folha_vazia = data;
                    updateBackground();
                    break;
            }
        });

        console.log('[Preview] Event listeners configured');
    }

    // ========================================
    // Initialization
    // ========================================

    function initPreview() {
        setupEventListeners();

        // Load initial state from backend
        fetch('/api/state')
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    const state = data.data;

                    // Update current state with all relevant fields
                    Object.assign(currentState, {
                        cor_botoes: state.cor_botoes || '#4f46e5',
                        sombra_gradiente: state.sombra_gradiente || '#000000',
                        posicao_botoes: state.posicao_botoes || 50,
                        timer_contagem: !!state.timer_contagem,
                        links_extras: state.links_extras || [],
                        link_google_maps: state.link_google_maps || '',
                        numero_whatsapp: state.numero_whatsapp || '',
                        link_presentes: state.link_presentes || '',
                        manual_content: state.manual_content || '',
                        // Media fields
                        media_folha_animada: state.media_folha_animada || null,
                        media_folha_preenchida: state.media_folha_preenchida || null,
                        media_folha_vazia: state.media_folha_vazia || null
                    });

                    // Apply to preview
                    renderButtons();
                    updateShadow(currentState.sombra_gradiente);
                    updateButtonPosition(currentState.posicao_botoes);
                    updateTimerVisibility(currentState.timer_contagem);
                    updateBackground();

                    console.log('[Preview] Loaded initial state');
                }
            })
            .catch(err => console.warn('[Preview] Could not load initial state:', err));

        // Apply default gradient on first load (before state is fetched)
        updateBackground();

        console.log('[Preview] Initialized');
    }

    // ========================================
    // Initialize on DOM Ready
    // ========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPreview);
    } else {
        initPreview();
    }

    // ========================================
    // Expose to Global Scope
    // ========================================
    window.AutoBuilderPreview = {
        renderButtons,
        updateButtonColors,
        updateShadow,
        updateButtonPosition,
        updateTimerVisibility,
        updateBackground,
        getState: () => currentState
    };

})();
