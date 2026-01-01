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

        // Add Click Handler for Interactivity
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            handleButtonClick(btn);
        });

        return wrapper;
    }

    /**
     * Handles preview button clicks.
     * @param {object} btn - Button config
     */
    function handleButtonClick(btn) {
        console.log('[Preview] Button clicked:', btn);

        // 1. Native Links & WhatsApp -> Open New Tab
        if (btn.id === 'local' && currentState.link_google_maps) {
            window.open(currentState.link_google_maps, '_blank');
            return;
        }

        // RSVP: Prioritize External Link over WhatsApp
        if (btn.id === 'confirmar') {
            if (currentState.link_confirmacao) {
                window.open(currentState.link_confirmacao, '_blank');
            } else if (currentState.numero_whatsapp) {
                const num = currentState.numero_whatsapp.replace(/\D/g, '');
                const url = `https://wa.me/${num}`;
                window.open(url, '_blank');
            }
            return;
        }

        // 2. Presentes: Link (Priority) vs Image (Popup)
        if (btn.id === 'presentes') {
            if (currentState.link_presentes) {
                window.open(currentState.link_presentes, '_blank');
            } else if (currentState.media_presentes && currentState.media_presentes.url) {
                // Show Image Popup Simulation
                showPreviewModal('Lista de Presentes', `<img src="${currentState.media_presentes.url}" class="max-w-full rounded mx-auto">`);
            }
            return;
        }

        // 3. Manual: Text (Priority according to Doc State A?) vs Image
        // Doc says: "SE Instruções do Manual contiver texto: Habilita Modo Texto... Desabilita modo imagem."
        // So Text > Image is the Doc's priority.
        if (btn.id === 'manual') {
            if (currentState.manual_content && currentState.manual_content.length > 0) {
                showPreviewModal('Manual dos Padrinhos', `<div class="text-left prose prose-sm max-w-none text-gray-800">${currentState.manual_content}</div>`);
            } else if (currentState.media_manual && currentState.media_manual.url) {
                showPreviewModal('Manual dos Padrinhos', `<img src="${currentState.media_manual.url}" class="max-w-full rounded mx-auto">`);
            }
            return;
        }

        // 4. Extra Links
        if (btn.type === 'extra' && btn.url) { // Assuming createButtonElement passes url if available, otherwise needed to find it
            // Actually, createButtonElement receives { id, label, icon, ... }. For native, we rely on currentState lookup.
            // For extra, we iterate currentState.links_extras. We should pass the URL to createButtonElement or look it up here.
            // Let's modify renderButtons to pass URL for extras, or find it here.
            // Simpler: pass it in createButtonElement.
            // But wait, createButtonElement signature is (btn, color). btn object comes from loop.
        }
    }

    // Helper for Extra Links (since my handleButtonClick above needs URL)
    // I need to ensure renderButtons passes the 'url' property in the btn object.

    /**
     * Shows a simulated modal in the preview.
     */
    function showPreviewModal(title, contentHTML) {
        // Target active preview (Mobile Logic only for now as it's easier to append to body or preview container)
        // Ideally, we append to document.body and center it fixed.
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in';
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative p-6">
                <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition" onclick="this.closest('.fixed').remove()">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
                <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">${title}</h3>
                <div class="space-y-4">
                    ${contentHTML}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    /**
     * Renders all buttons (native + extras) in the preview.
     */
    function renderButtons() {
        // Target both desktop and mobile containers
        const desktopContainer = document.querySelector('#preview-buttons > div');
        const mobileContainer = document.querySelector('#mobile-preview-buttons > div');

        const containers = [desktopContainer, mobileContainer].filter(c => !!c);

        if (containers.length === 0) {
            console.warn('[Preview] No button containers found');
            return;
        }

        const color = currentState.cor_botoes || '#4f46e5';
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
                return (currentState.media_manual && currentState.media_manual.url) ||
                    (currentState.manual_content && currentState.manual_content.length > 5);
            }

            return false;
        };

        // Render for each container
        containers.forEach(container => {
            container.innerHTML = ''; // Clear existing

            // Add native buttons
            for (const [key, config] of Object.entries(NATIVE_BUTTON_MAP)) {
                if (shouldShow(key)) {
                    container.appendChild(createButtonElement({
                        ...config,
                        type: 'native'
                    }, color));
                    // Only count once per render cycle logic, but here we just need to know if any exist
                }
            }

            // Add extra links
            (currentState.links_extras || []).forEach(link => {
                if (link.label && link.label.trim()) {
                    container.appendChild(createButtonElement({
                        id: 'extra-' + (link.id || Math.random()),
                        label: link.label,
                        icon: link.icon || 'fa-solid fa-link',
                        type: 'extra',
                        url: link.url
                    }, color));
                }
            });
        });

        // Recalculate count just for display logic (based on native + extra)
        buttonCount = Object.keys(NATIVE_BUTTON_MAP).filter(shouldShow).length + (currentState.links_extras || []).length;

        // Hide/show the entire button container based on content
        ['preview-buttons', 'mobile-preview-buttons'].forEach(id => {
            const wrapper = document.getElementById(id);
            if (wrapper) {
                wrapper.style.display = buttonCount > 0 ? 'flex' : 'none';
            }
        });
    }

    /**
     * Updates button colors without re-rendering.
     * @param {string} color - New hex color
     */
    function updateButtonColors(color) {
        ['#preview-buttons', '#mobile-preview-buttons'].forEach(selector => {
            const buttons = document.querySelectorAll(`${selector} .rounded-full`);
            buttons.forEach(btn => {
                btn.style.backgroundColor = color;
            });
        });
        currentState.cor_botoes = color;
    }

    /**
     * Updates the shadow gradient color.
     * @param {string} color - New hex color
     */
    function updateShadow(color) {
        ['preview-shadow', 'mobile-preview-shadow'].forEach(id => {
            const shadow = document.getElementById(id); // Note: mobile-preview-shadow needs to be added to HTML if missing, or we find its equivalent
            // Looking at HTML, mobile uses inline style div at line 1618. It doesn't have an ID... 
            // Stick to desktop ID and maybe try to find mobile equivalent if possible.
            // HTML Line 1617: <div class="absolute ... " style="..."> (no ID).
            // We might need to add ID to mobile shadow in HTML or query strictly.
            // For now, let's target desktop and handle mobile purely if ID exists.
            if (shadow) {
                shadow.style.background = `linear-gradient(to top, ${color}, transparent)`;
            }
        });

        // Special selector for mobile shadow (no ID in HTML)
        const mobileShadow = document.querySelector('#mobile-preview-content > div.pointer-events-none');
        if (mobileShadow) {
            mobileShadow.style.background = `linear-gradient(to top, ${color}, transparent)`;
        }

        currentState.sombra_gradiente = color;
    }

    /**
     * Updates button position (bottom offset).
     * @param {number} value - Offset in pixels
     */
    function updateButtonPosition(value) {
        ['preview-buttons', 'mobile-preview-buttons'].forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.style.bottom = value + 'px';
            }
        });
        currentState.posicao_botoes = value;
    }

    /**
     * Toggles timer visibility.
     * @param {boolean} visible
     */
    function updateTimerVisibility(visible) {
        ['preview-timer', 'mobile-preview-timer'].forEach(id => {
            const timer = document.getElementById(id);
            if (timer) {
                timer.style.display = visible ? 'flex' : 'none';
            }
        });
        currentState.timer_contagem = visible;
    }

    /**
     * Updates the preview background based on priority:
     * 1. Folha Animada (video) or Folha Preenchida (image)
     * 2. Folha Vazia (blank sheet image)
     * 3. Default gradient
     */
    function updateBackground() {
        const desktopContent = document.getElementById('preview-content');
        const mobileContent = document.getElementById('mobile-preview-content');

        const contentElements = [desktopContent, mobileContent].filter(el => !!el);

        if (contentElements.length === 0) {
            console.warn('[Preview] No preview content elements found');
            return;
        }

        contentElements.forEach(previewContent => {
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
                return; // Continue to next element? No, invalidates "return" for loop. 
                // Should use continue or if/else.
                // But wait, we are inside forEach. "return" acts like continue.
            }

            // Priority 1 (alt): Folha Preenchida (image)
            if (currentState.media_folha_preenchida && currentState.media_folha_preenchida.url) {
                previewContent.style.backgroundImage = `url('${currentState.media_folha_preenchida.url}')`;
                return;
            }

            // Priority 2: Folha Vazia
            if (currentState.media_folha_vazia && currentState.media_folha_vazia.url) {
                previewContent.style.backgroundImage = `url('${currentState.media_folha_vazia.url}')`;
                return;
            }

            // Priority 3: Default gradient
            previewContent.style.backgroundImage = DEFAULT_GRADIENT;
        });

        console.log('[Preview] Background updated');
    }
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

}) ();
