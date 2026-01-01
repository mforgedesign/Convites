/**
 * AutoBuilder v4.0 - Windows Controller
 * =====================================
 * Handles interactive elements for builder windows:
 * - Mode toggles (Manual, Gifts, Fill Leaf)
 * - Animation tabs
 * - Music player
 * - Dropzones
 */

(function () {
    'use strict';

    // ========================================
    // Mode Toggle Handlers
    // ========================================

    /**
     * Sets up toggle buttons for switching between modes.
     * @param {string} prefix - Component prefix (e.g., 'manual', 'gifts', 'fill')
     * @param {string[]} modes - Array of mode names
     */
    function setupModeToggle(prefix, modes) {
        modes.forEach(mode => {
            const btn = document.getElementById(`${prefix}-mode-${mode}`);
            const content = document.getElementById(`${prefix}-${mode}-mode`);

            if (!btn || !content) return;

            btn.addEventListener('click', () => {
                // Deactivate all buttons
                modes.forEach(m => {
                    const otherBtn = document.getElementById(`${prefix}-mode-${m}`);
                    const otherContent = document.getElementById(`${prefix}-${m}-mode`);

                    if (otherBtn) {
                        otherBtn.classList.remove('bg-white', 'shadow-sm', 'text-brand-600');
                        otherBtn.classList.add('text-gray-500');
                    }
                    if (otherContent) {
                        otherContent.classList.add('hidden');
                    }
                });

                // Activate clicked button
                btn.classList.remove('text-gray-500');
                btn.classList.add('bg-white', 'shadow-sm', 'text-brand-600');
                content.classList.remove('hidden');
            });
        });
    }

    // ========================================
    // Animation Tabs
    // ========================================

    function setupAnimationTabs() {
        const tabs = document.querySelectorAll('.anim-tab');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;

                // Deactivate all tabs
                tabs.forEach(t => {
                    t.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600');
                    t.classList.add('text-gray-500');
                });

                // Hide all content
                document.getElementById('anim-intro-content')?.classList.add('hidden');
                document.getElementById('anim-loop-content')?.classList.add('hidden');

                // Activate clicked tab
                tab.classList.remove('text-gray-500');
                tab.classList.add('text-brand-600', 'border-b-2', 'border-brand-600');

                // Show target content
                const content = document.getElementById(`anim-${targetTab}-content`);
                content?.classList.remove('hidden');
            });
        });
    }

    // ========================================
    // Music Player
    // ========================================

    function setupMusicPlayer() {
        const audioPlayer = document.getElementById('music-audio-player');
        const playBtn = document.getElementById('music-play-btn');
        const progressBar = document.getElementById('music-progress');
        const timeCurrent = document.getElementById('music-time-current');
        const timeTotal = document.getElementById('music-time-total');
        const trackName = document.getElementById('music-track-name');
        const removeBtn = document.getElementById('music-remove-btn');
        const fileInput = document.getElementById('music-file-input');

        if (!audioPlayer || !playBtn) return;

        let isPlaying = false;

        // Format time as M:SS
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Play/Pause toggle
        playBtn.addEventListener('click', () => {
            if (!audioPlayer.src) return;

            if (isPlaying) {
                audioPlayer.pause();
                playBtn.innerHTML = '<i class="fa-solid fa-play ml-1"></i>';
            } else {
                audioPlayer.play();
                playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            }
            isPlaying = !isPlaying;
        });

        // Update progress
        audioPlayer.addEventListener('timeupdate', () => {
            if (audioPlayer.duration) {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                if (progressBar) progressBar.style.width = `${progress}%`;
                if (timeCurrent) timeCurrent.textContent = formatTime(audioPlayer.currentTime);
            }
        });

        // Set total time when loaded
        audioPlayer.addEventListener('loadedmetadata', () => {
            if (timeTotal) timeTotal.textContent = formatTime(audioPlayer.duration);
            playBtn.disabled = false;
            if (removeBtn) removeBtn.classList.remove('hidden');
        });

        // Handle audio end
        audioPlayer.addEventListener('ended', () => {
            isPlaying = false;
            playBtn.innerHTML = '<i class="fa-solid fa-play ml-1"></i>';
            if (progressBar) progressBar.style.width = '0%';
        });

        // File input handler
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const url = URL.createObjectURL(file);
                    audioPlayer.src = url;
                    if (trackName) trackName.textContent = file.name;
                    audioPlayer.load();
                }
            });
        }

        // Remove button
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                audioPlayer.pause();
                audioPlayer.src = '';
                isPlaying = false;
                playBtn.innerHTML = '<i class="fa-solid fa-play ml-1"></i>';
                playBtn.disabled = true;
                if (progressBar) progressBar.style.width = '0%';
                if (timeCurrent) timeCurrent.textContent = '0:00';
                if (timeTotal) timeTotal.textContent = '0:00';
                if (trackName) trackName.textContent = 'Nenhuma música';
                removeBtn.classList.add('hidden');
            });
        }

        // Sample selection
        document.querySelectorAll('.sample-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = btn.closest('.sample-item');
                const sampleName = item?.dataset.name;
                const sampleFile = item?.dataset.sample;

                if (sampleName && trackName) {
                    trackName.textContent = sampleName;
                    // In real implementation, would load actual sample file
                    // For now, just update the UI
                    playBtn.disabled = false;
                    if (removeBtn) removeBtn.classList.remove('hidden');
                }
            });
        });

        // Sample preview
        document.querySelectorAll('.sample-preview-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // In real implementation, would play sample preview
                console.log('Preview sample:', btn.closest('.sample-item')?.dataset.sample);
            });
        });
    }

    // ========================================
    // Dropzone Upload Handling (with API)
    // ========================================

    // Map dropzone IDs to API upload contexts
    const DROPZONE_CONTEXTS = {
        'cover-dropzone': 'capa',
        'leaf-dropzone': 'folha_vazia',
        'intro-video-dropzone': 'abertura',
        'loop-video-dropzone': 'loop',
        'fill-image-dropzone': 'folha_preenchida',
        'fill-video-dropzone': 'folha_animada',
        'gifts-image-dropzone': 'presentes',
        'manual-image-dropzone': 'manual',
        'music-dropzone': 'musica'
    };

    /**
     * Uploads a file to the server.
     * @param {File} file - The file to upload
     * @param {string} context - The upload context (capa, musica, etc.)
     * @returns {Promise<object>} The server response
     */
    async function uploadFile(file, context) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/upload/${context}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
        }

        return response.json();
    }

    /**
     * Updates a dropzone with a preview.
     * @param {HTMLElement} dropzone - The dropzone element
     * @param {string} url - The URL of the uploaded file
     * @param {string} type - The file type (image/video/audio)
     */
    function updateDropzonePreview(dropzone, url, type) {
        if (type === 'image') {
            dropzone.style.backgroundImage = `url(${url})`;
            dropzone.style.backgroundSize = 'cover';
            dropzone.style.backgroundPosition = 'center';
            dropzone.querySelectorAll('i, span').forEach(el => el.classList.add('hidden'));
        } else if (type === 'video') {
            const existingVideo = dropzone.querySelector('video');
            if (existingVideo) existingVideo.remove();

            const video = document.createElement('video');
            video.src = url;
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            video.classList.add('absolute', 'inset-0', 'w-full', 'h-full', 'object-cover');
            dropzone.appendChild(video);
            dropzone.querySelectorAll('i, span').forEach(el => el.classList.add('hidden'));
        }
    }

    function setupDropzones() {
        const dropzones = [
            { id: 'cover-dropzone', type: 'image' },
            { id: 'leaf-dropzone', type: 'image' },
            { id: 'intro-video-dropzone', type: 'video' },
            { id: 'loop-video-dropzone', type: 'video' },
            { id: 'fill-image-dropzone', type: 'image' },
            { id: 'fill-video-dropzone', type: 'video' },
            { id: 'gifts-image-dropzone', type: 'image' },
            { id: 'manual-image-dropzone', type: 'image' },
            { id: 'music-dropzone', type: 'audio' }
        ];

        dropzones.forEach(({ id, type }) => {
            const dropzone = document.getElementById(id);
            if (!dropzone) return;

            const input = dropzone.querySelector('input[type="file"]');
            if (!input) return;

            const context = DROPZONE_CONTEXTS[id];

            input.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                // Show immediate preview with local blob
                const localUrl = URL.createObjectURL(file);
                updateDropzonePreview(dropzone, localUrl, type);

                // Upload to server
                if (context) {
                    try {
                        // Show loading indicator
                        dropzone.classList.add('opacity-75');

                        const result = await uploadFile(file, context);
                        console.log(`✅ Uploaded ${context}:`, result.data?.url);

                        // Update preview with server URL
                        if (result.data?.url) {
                            updateDropzonePreview(dropzone, result.data.url, type);
                        }
                    } catch (err) {
                        console.error(`❌ Upload error (${context}):`, err);
                        alert(`Erro no upload: ${err.message}`);
                    } finally {
                        dropzone.classList.remove('opacity-75');
                    }
                }
            });

            // Drag and drop visual feedback
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('border-brand-500', 'bg-brand-50');
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('border-brand-500', 'bg-brand-50');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('border-brand-500', 'bg-brand-50');

                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    input.files = files;
                    input.dispatchEvent(new Event('change'));
                }
            });
        });
    }

    // ========================================
    // Toggle Switches (Animate Background, etc)
    // ========================================

    function setupToggleSwitches() {
        // Animate Background Toggle
        const animateToggle = document.getElementById('animate-background-toggle');
        const leafLayers = document.getElementById('leaf-layers');

        if (animateToggle && leafLayers) {
            animateToggle.addEventListener('change', () => {
                if (animateToggle.checked) {
                    leafLayers.classList.remove('hidden');
                } else {
                    leafLayers.classList.add('hidden');
                }
            });
        }

        // Watermark Toggle
        const watermarkToggle = document.getElementById('watermark-toggle');
        if (watermarkToggle) {
            watermarkToggle.addEventListener('change', () => {
                // Update state when implemented
                console.log('Watermark:', watermarkToggle.checked);
            });
        }
    }

    // ========================================
    // Finalize Window Buttons
    // ========================================

    function setupFinalizeButtons() {
        // Preview Local
        const previewBtn = document.getElementById('btn-preview-local');
        if (previewBtn) {
            previewBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch('/api/build', { method: 'POST' });
                    const data = await response.json();
                    if (data.success && data.preview_url) {
                        window.open(data.preview_url, '_blank');
                    }
                } catch (err) {
                    console.error('Preview error:', err);
                }
            });
        }

        // Download ZIP
        const downloadBtn = document.getElementById('btn-download-zip');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', async () => {
                try {
                    const slug = document.getElementById('slug-input')?.value || 'convite';
                    const response = await fetch('/api/build', { method: 'POST' });
                    const blob = await response.blob();

                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${slug}.zip`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (err) {
                    console.error('Download error:', err);
                }
            });
        }

        // Publish
        const publishBtn = document.getElementById('btn-publish');
        if (publishBtn) {
            publishBtn.addEventListener('click', async () => {
                const slug = document.getElementById('slug-input')?.value;
                if (!slug) {
                    alert('Por favor, preencha o slug do convite.');
                    return;
                }

                const deployStatus = document.getElementById('deploy-status');
                const publishResult = document.getElementById('publish-result');
                const publishUrl = document.getElementById('publish-url');

                // Show status
                if (deployStatus) deployStatus.classList.remove('hidden');

                try {
                    // Step 1: Build
                    updateDeployStep('step-build', 'loading');
                    await new Promise(r => setTimeout(r, 500)); // Visual feedback
                    updateDeployStep('step-build', 'done');

                    // Step 2: Upload
                    updateDeployStep('step-upload', 'loading');
                    const response = await fetch('/api/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ slug })
                    });

                    const data = await response.json();

                    if (data.success) {
                        updateDeployStep('step-upload', 'done');
                        updateDeployStep('step-live', 'done');

                        // Show result
                        if (publishResult) publishResult.classList.remove('hidden');
                        if (publishUrl) {
                            publishUrl.href = data.url;
                            publishUrl.textContent = data.url;
                        }
                    } else {
                        throw new Error(data.error || 'Publish failed');
                    }
                } catch (err) {
                    console.error('Publish error:', err);
                    alert('Erro ao publicar: ' + err.message);
                }
            });
        }

        // ✅ Custom ZIP Upload
        const zipDropzone = document.getElementById('custom-zip-dropzone');
        if (zipDropzone) {
            const zipInput = zipDropzone.querySelector('input[type="file"]');

            if (zipInput) {
                // File input change handler
                zipInput.addEventListener('change', handleZipUpload);

                // Drag and drop handlers
                zipDropzone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    zipDropzone.classList.add('border-brand-500', 'bg-brand-100');
                });

                zipDropzone.addEventListener('dragleave', () => {
                    zipDropzone.classList.remove('border-brand-500', 'bg-brand-100');
                });

                zipDropzone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    zipDropzone.classList.remove('border-brand-500', 'bg-brand-100');

                    const files = e.dataTransfer.files;
                    if (files.length > 0 && files[0].name.endsWith('.zip')) {
                        zipInput.files = files;
                        handleZipUpload({ target: zipInput });
                    } else {
                        alert('Por favor, arraste apenas arquivos .zip');
                    }
                });
            }

            async function handleZipUpload(e) {
                const file = e.target.files[0];
                if (!file) return;

                if (!file.name.endsWith('.zip')) {
                    alert('Por favor, selecione um arquivo .zip');
                    return;
                }

                const slugInput = document.getElementById('slug-input');
                const slug = slugInput?.value;

                if (!slug) {
                    alert('Por favor, preencha o slug do convite antes de fazer upload.');
                    return;
                }

                // Confirm action
                if (!confirm(`Publicar ZIP personalizado para "${slug}"?\n\nIsso irá substituir qualquer convite existente neste slug.`)) {
                    return;
                }

                const deployStatus = document.getElementById('deploy-status');
                const publishResult = document.getElementById('publish-result');
                const publishUrl = document.getElementById('publish-url');

                // Show status
                if (deployStatus) deployStatus.classList.remove('hidden');

                try {
                    // Step 1: Preparing
                    updateDeployStep('step-build', 'loading');
                    zipDropzone.classList.add('opacity-50', 'pointer-events-none');

                    // Step 2: Upload ZIP
                    updateDeployStep('step-upload', 'loading');

                    const formData = new FormData();
                    formData.append('zip', file);
                    formData.append('slug', slug);

                    const response = await fetch('/api/deploy-custom-zip', {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();

                    if (data.success) {
                        updateDeployStep('step-build', 'done');
                        updateDeployStep('step-upload', 'done');
                        updateDeployStep('step-live', 'done');

                        // Show result
                        if (publishResult) publishResult.classList.remove('hidden');
                        if (publishUrl) {
                            const url = data.url || `https://convites.mforge.com.br/${slug}`;
                            publishUrl.href = url;
                            publishUrl.textContent = url;
                        }

                        console.log('✅ Custom ZIP deployed:', data.url);
                    } else {
                        throw new Error(data.error || 'Deploy failed');
                    }
                } catch (err) {
                    console.error('ZIP upload error:', err);
                    alert('Erro ao fazer upload do ZIP: ' + err.message);

                    // Reset status indicators
                    updateDeployStep('step-build', 'reset');
                    updateDeployStep('step-upload', 'reset');
                    updateDeployStep('step-live', 'reset');
                } finally {
                    zipDropzone.classList.remove('opacity-50', 'pointer-events-none');
                    zipInput.value = ''; // Reset input
                }
            }
        }
    }

    function updateDeployStep(stepId, status) {
        const step = document.getElementById(stepId);
        if (!step) return;

        step.classList.remove('bg-gray-200', 'bg-green-500', 'bg-brand-500', 'text-gray-400', 'text-white');

        if (status === 'done') {
            step.classList.add('bg-green-500', 'text-white');
            step.innerHTML = '<i class="fa-solid fa-check text-xs"></i>';
        } else if (status === 'loading') {
            step.classList.add('bg-brand-500', 'text-white');
            step.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i>';
        } else if (status === 'reset') {
            step.classList.add('bg-gray-200', 'text-gray-400');
            const stepNum = stepId.replace('step-', '');
            const nums = { 'build': '1', 'upload': '2', 'live': '3' };
            step.textContent = nums[stepNum] || '';
        }
    }

    // ========================================
    // AI Generation Buttons
    // ========================================

    // Map AI button types to dropzone IDs
    const AI_TYPE_TO_DROPZONE = {
        'cover': 'cover-dropzone',
        'leaf': 'leaf-dropzone',
        'intro': 'intro-video-dropzone',
        'loop': 'loop-video-dropzone',
        'fill': 'fill-image-dropzone',
        'manual': 'manual-image-dropzone',
        'gifts': 'gifts-image-dropzone'
    };

    function setupAIButtons() {
        const aiButtons = [
            { id: 'btn-generate-cover', type: 'cover', promptId: 'cover-prompt', mediaType: 'image' },
            { id: 'btn-generate-leaf', type: 'leaf', promptId: 'leaf-prompt', mediaType: 'image' },
            { id: 'btn-generate-intro', type: 'intro', promptId: 'intro-motion-prompt', mediaType: 'video' },
            { id: 'btn-generate-loop', type: 'loop', promptId: 'loop-motion-prompt', mediaType: 'video' },
            { id: 'btn-generate-fill', type: 'fill', promptId: 'fill-prompt', mediaType: 'image' },
            { id: 'manual-generate-image-btn', type: 'manual', promptId: 'manual-image-prompt', mediaType: 'image' },
            { id: 'gifts-generate-image-btn', type: 'gifts', promptId: 'gifts-image-prompt', mediaType: 'image' }
        ];

        aiButtons.forEach(({ id, type, promptId, mediaType }) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            btn.addEventListener('click', async () => {
                const promptEl = document.getElementById(promptId);
                const prompt = promptEl?.value;

                if (!prompt) {
                    alert('Por favor, preencha o prompt.');
                    return;
                }

                // Show loading state
                const originalText = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Gerando...';

                try {
                    const isVideo = mediaType === 'video';
                    const endpoint = isVideo ? '/api/generate/video' : '/api/generate/image';

                    // For video, we need an image_url (from cover or leaf)
                    let requestBody = { prompt };

                    if (isVideo) {
                        // Try to get image URL from state or indicate we need one
                        const stateResponse = await fetch('/api/state');
                        const stateData = await stateResponse.json();

                        const imageUrl = type === 'intro'
                            ? stateData.builder_state?.capa_imagem?.url
                            : stateData.builder_state?.folha_imagem?.url;

                        if (!imageUrl) {
                            throw new Error(`Faça upload da ${type === 'intro' ? 'Capa' : 'Folha Vazia'} primeiro.`);
                        }

                        requestBody.image_url = imageUrl;
                    }

                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestBody)
                    });

                    const data = await response.json();

                    if (data.status === 'ok') {
                        // Extract URL from response
                        let generatedUrl;
                        if (isVideo) {
                            generatedUrl = data.data?.video?.url;
                        } else {
                            generatedUrl = data.data?.images?.[0]?.url;
                        }

                        if (generatedUrl) {
                            console.log(`✅ Generated ${type}:`, generatedUrl);

                            // Update corresponding dropzone
                            const dropzoneId = AI_TYPE_TO_DROPZONE[type];
                            const dropzone = document.getElementById(dropzoneId);
                            if (dropzone) {
                                updateDropzonePreview(dropzone, generatedUrl, mediaType);
                            }

                            // Show success feedback
                            btn.innerHTML = '<i class="fa-solid fa-check mr-2"></i>Gerado!';
                            setTimeout(() => {
                                btn.innerHTML = originalText;
                            }, 2000);
                        } else {
                            throw new Error('URL não retornada pela API');
                        }
                    } else {
                        throw new Error(data.message || 'Falha na geração');
                    }
                } catch (err) {
                    console.error('AI generation error:', err);
                    alert('Erro ao gerar: ' + err.message);
                    btn.innerHTML = originalText;
                } finally {
                    btn.disabled = false;
                }
            });
        });
    }

    // ========================================
    // Manual HTML Editor
    // ========================================

    function setupManualEditor() {
        const htmlEditor = document.getElementById('manual-html-editor');
        const preview = document.getElementById('manual-preview');

        if (htmlEditor && preview) {
            htmlEditor.addEventListener('input', () => {
                preview.innerHTML = htmlEditor.value || `
                    <div class="text-center text-gray-400">
                        <i class="fa-solid fa-eye-slash text-3xl mb-2"></i>
                        <p class="text-sm">Digite o texto e clique em "Otimizar" para ver a prévia</p>
                    </div>
                `;
            });
        }

        // Optimize button
        const optimizeBtn = document.getElementById('manual-optimize-btn');
        const rawText = document.getElementById('manual-raw-text');

        if (optimizeBtn && rawText && htmlEditor && preview) {
            optimizeBtn.addEventListener('click', async () => {
                const text = rawText.value;
                if (!text) return;

                // Simple transformation (real implementation would use AI)
                const lines = text.split('\n').filter(l => l.trim());
                const icons = {
                    'traje': 'fa-shirt',
                    'dress': 'fa-shirt',
                    'hora': 'fa-clock',
                    'estacionamento': 'fa-car',
                    'parking': 'fa-car',
                    'crianças': 'fa-child',
                    'kids': 'fa-child',
                    'presente': 'fa-gift',
                    'gift': 'fa-gift'
                };

                const html = lines.map(line => {
                    let icon = 'fa-circle-info';
                    for (const [keyword, iconClass] of Object.entries(icons)) {
                        if (line.toLowerCase().includes(keyword)) {
                            icon = iconClass;
                            break;
                        }
                    }
                    return `<p class="mb-2"><i class="fa-solid ${icon} text-brand-400 mr-2"></i>${line}</p>`;
                }).join('\n');

                htmlEditor.value = html;
                preview.innerHTML = html;
            });
        }
    }

    // ========================================
    // Initialization
    // ========================================

    function initWindows() {
        // Mode toggles
        setupModeToggle('manual', ['text', 'image']);
        setupModeToggle('gifts', ['link', 'image']);
        setupModeToggle('fill', ['overlay', 'flat']);

        // Animation tabs
        setupAnimationTabs();

        // Music player
        setupMusicPlayer();

        // Dropzones
        setupDropzones();

        // Toggle switches
        setupToggleSwitches();

        // Finalize buttons
        setupFinalizeButtons();

        // AI generation buttons
        setupAIButtons();

        // Manual editor
        setupManualEditor();

        console.log('✅ Windows controller initialized');
    }

    // ========================================
    // Initialize on DOM Ready
    // ========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWindows);
    } else {
        initWindows();
    }

    // ========================================
    // Expose to Global Scope
    // ========================================
    window.AutoBuilderWindows = {
        setupModeToggle,
        setupAnimationTabs,
        setupMusicPlayer
    };

})();
