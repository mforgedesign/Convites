class ChatbotAssistant {
    constructor() {
        this.floatBtn = document.getElementById('chatbot-float-btn');
        this.popup = document.getElementById('chatbot-popup');
        this.closeBtn = document.getElementById('chatbot-close-btn');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send-btn');

        // State
        this.isDragging = false;
        this.isOpen = false;
        this.dragStartTime = 0;
        this.isProcessing = false;

        // Context for OpenAI
        this.conversationHistory = [
            { role: "system", content: "You are the AutoBuilder 3.1 AI Assistant. You help the user fill out the invitation form. You can read the screen and control the form. When asking you to fill something, look at the DOM structure provided. Use the available tools to interacting with the page. Be helpful, concise, and friendly. Answer in Portuguese primarily, unless spoken to in English." }
        ];

        this.init();
    }

    init() {
        this.setupDragAndDrop();
        this.setupPopupEvents();
        this.setupChatEvents();

        // Initial welcome message
        this.addMessage("bot", "Olá! Sou seu assistente IA. Posso preencher o formulário para você, ler seus dados ou navegar pelas abas. Como posso ajudar?");
    }

    setupDragAndDrop() {
        const btn = this.floatBtn;
        let startX, startY, initialLeft, initialTop;

        const onMouseDown = (e) => {
            if (this.isOpen) return; // Lock if open

            this.isDragging = false;
            this.dragStartTime = new Date().getTime();

            // Get current position (or default)
            const rect = btn.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            // Handle touch or mouse
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;

            startX = clientX - initialLeft;
            startY = clientY - initialTop;

            // Remove transition for instant drag response
            btn.classList.remove('snap-transition');

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('touchmove', onMouseMove, { passive: false });
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('touchend', onMouseUp);
        };

        const onMouseMove = (e) => {
            if (this.isOpen) return;

            // Prevent default to stop scrolling on touch
            if (e.cancelable) e.preventDefault();

            this.isDragging = true;

            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;

            let newLeft = clientX - startX;
            let newTop = clientY - startY;

            // Constrain to window
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;
            const btnSize = 60; // Button size

            newLeft = Math.max(0, Math.min(newLeft, winWidth - btnSize));
            newTop = Math.max(0, Math.min(newTop, winHeight - btnSize));

            btn.style.left = `${newLeft}px`;
            btn.style.top = `${newTop}px`;
            btn.style.right = 'auto'; // Reset right since we are setting left
        };

        const onMouseUp = (e) => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchmove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchend', onMouseUp);

            const dragDuration = new Date().getTime() - this.dragStartTime;

            // If it was a short click without much movement, treat as click
            if (dragDuration < 200 && !this.isDragging) {
                this.togglePopup();
                return;
            }

            if (!this.isOpen) {
                this.snapToEdge();
            }
        };

        btn.addEventListener('mousedown', onMouseDown);
        btn.addEventListener('touchstart', onMouseDown, { passive: false });
    }

    snapToEdge() {
        const btn = this.floatBtn;
        const rect = btn.getBoundingClientRect();
        const winWidth = window.innerWidth;
        const btnCenter = rect.left + rect.width / 2;

        // Add class for smooth animation
        btn.classList.add('snap-transition');

        // Snap to left or right
        if (btnCenter < winWidth / 2) {
            btn.style.left = '20px';
            btn.style.right = 'auto';
        } else {
            btn.style.left = 'auto';
            btn.style.right = '20px';
        }
    }

    setupPopupEvents() {
        this.closeBtn.addEventListener('click', () => this.togglePopup());

        // Click outside to close
        document.addEventListener('mousedown', (e) => {
            if (this.isOpen &&
                !this.popup.contains(e.target) &&
                !this.floatBtn.contains(e.target)) {
                this.togglePopup();
            }
        });
    }

    togglePopup() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.popup.classList.add('active');
            // If button is clicked, it stays where it is, but dragging is disabled logic-wise
        } else {
            this.popup.classList.remove('active');
        }
    }

    setupChatEvents() {
        this.sendBtn.addEventListener('click', () => this.handleUserMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserMessage();
        });
    }

    async handleUserMessage() {
        const text = this.input.value.trim();
        if (!text || this.isProcessing) return;

        this.input.value = '';
        this.addMessage("user", text);
        this.conversationHistory.push({ role: "user", content: text });

        this.isProcessing = true;
        this.sendBtn.disabled = true;

        const loadingId = this.addTypingIndicator();

        try {
            await this.processConversation();
        } catch (error) {
            console.error("Chat Error:", error);
            this.removeMessage(loadingId);
            this.addMessage("system", "Ocorreu um erro ao processar sua solicitação.");
        } finally {
            if (document.getElementById(loadingId)) this.removeMessage(loadingId);
            this.isProcessing = false;
            this.sendBtn.disabled = false;
            this.input.focus(); // Refocus input
        }
    }

    async processConversation() {
        // Collect DOM State
        const domContext = this.getDomContext();

        // Prepare Payload
        const payload = {
            messages: this.conversationHistory,
            dom_context: domContext
        };

        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // Handle Response
        let actionSummary = [];

        if (data.tool_calls) {
            // Execute tools
            for (const tool of data.tool_calls) {
                await this.executeTool(tool);
                actionSummary.push(tool.name);
            }
        }

        if (data.response_text) {
            this.addMessage("bot", data.response_text);
            this.conversationHistory.push({ role: "assistant", content: data.response_text });
        } else if (actionSummary.length > 0) {
            // If tools were executed but no text response, verify to history so model knows it happened
            // We simulate an assistant acknowledgment to keep history coherent
            const summary = `(System: Actions completed: ${actionSummary.join(', ')})`;
            this.conversationHistory.push({ role: "assistant", content: summary });
        }
    }

    getDomContext() {
        // Scrape visible/active form fields and buttons
        const context = {
            activeTab: document.querySelector('.tab-content.active')?.id,
            inputs: {},
            buttons: []
        };

        document.querySelectorAll('input, textarea, select').forEach(el => {
            if (el.offsetParent !== null) { // Check if visible
                context.inputs[el.id || el.name] = {
                    id: el.id,
                    type: el.type,
                    value: el.value,
                    placeholder: el.placeholder,
                    label: el.previousElementSibling?.innerText || ''
                };
            }
        });

        const tabName = context.activeTab || 'generic';
        // Add specific buttons visible in current tab
        document.querySelectorAll(`#${tabName} button, .tab-btn`).forEach(btn => {
            if (btn.offsetParent !== null) {
                context.buttons.push({
                    id: btn.id,
                    text: btn.innerText.trim(),
                    class: btn.className,
                    disabled: btn.disabled
                });
            }
        });

        // Collect Timestamps for dependency tracking
        context.timestamps = {
            form: parseInt(localStorage.getItem('lastFormUpdate') || '0'),
            prompts: parseInt(localStorage.getItem('lastPromptGen') || '0'),
            cover: parseInt(localStorage.getItem('lastCoverGen') || '0'),
            leafFill: parseInt(localStorage.getItem('lastLeafFillGen') || '0'),
            animCover: parseInt(localStorage.getItem('lastAnimCoverGen') || '0'),
            animLeaf: parseInt(localStorage.getItem('lastAnimLeafGen') || '0')
        };

        return context;
    }

    async executeTool(tool) {
        const args = tool.args;
        console.log(`Executing tool: ${tool.name}`, args);

        switch (tool.name) {
            case 'fill_form_field':
                const el = document.getElementById(args.selector) || document.querySelector(args.selector);
                if (el) {
                    el.value = args.value;
                    // Trigger input event to save to localStorage via existing app.js logic
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    this.addMessage("system", `Preencheu campo: ${args.selector}`);
                } else {
                    this.addMessage("system", `Erro: Campo não encontrado (${args.selector})`);
                }
                break;

            case 'click_element':
                let btn = document.getElementById(args.selector);
                if (!btn) {
                    // Try to find by text if selector fails or is generic
                    // Or try querySelector
                    btn = document.querySelector(args.selector);
                }

                // Fallback: search buttons by text if 'selector' looks like text
                if (!btn) {
                    const allBtns = Array.from(document.querySelectorAll('button'));
                    btn = allBtns.find(b => b.innerText.includes(args.selector) || b.textContent.includes(args.selector));
                }

                if (btn) {
                    btn.click();
                    this.addMessage("system", `Clicou em: ${args.selector}`);

                    // Wait logic
                    if (args.wait_for_completion) {
                        this.addMessage("system", `(Aguardando processo...)`);
                        await this.waitForButtonEnabled(btn);
                        this.addMessage("system", `(Pronto!)`);
                    }
                } else {
                    this.addMessage("system", `Erro: Elemento não encontrado (${args.selector})`);
                }
                break;

            case 'switch_tab':
                // Special helper for tabs
                const tabBtn = document.querySelector(`button[data-tab="${args.tab_id}"]`);
                if (tabBtn) {
                    tabBtn.click();
                    this.addMessage("system", `Mudei para a aba: ${args.tab_id}`);
                }
                break;
        }

        // Small delay to allow UI to update
        await new Promise(r => setTimeout(r, 500));
    }

    addMessage(role, text) {
        const div = document.createElement('div');
        div.className = `message ${role}`;
        // Basic Markdown-ish parsing for bold?
        div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        this.messagesContainer.appendChild(div);
        this.scrollToBottom();
        return div.id = 'msg-' + new Date().getTime();
    }

    removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    addTypingIndicator() {
        const id = 'typing-' + new Date().getTime();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'typing-indicator';
        div.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        this.messagesContainer.appendChild(div);
        this.scrollToBottom();
        return id;
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async waitForButtonEnabled(btn) {
        // Poll every 500ms
        const maxWaitTime = 120000; // 2 minutes max
        const interval = 500;
        let elapsed = 0;

        while (elapsed < maxWaitTime) {
            if (!btn.disabled && !btn.innerText.toLowerCase().includes('spin') && !btn.innerText.toLowerCase().includes('...')) {
                return true;
            }
            await new Promise(r => setTimeout(r, interval));
            elapsed += interval;
        }
        return false; // Timeout
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new ChatbotAssistant();
});
