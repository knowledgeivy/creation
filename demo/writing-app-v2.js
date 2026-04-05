// AI-Powered Writing Platform - Enhanced Version with Granular Selection
// This demo simulates AI assistance with granular text selection capabilities

// State Management
const state = {
    currentView: 'edit',
    selectionMode: 'sentence', // word, sentence, paragraph, section, document
    selectedText: '',
    selectedRange: null,
    aiMenuVisible: false,
    activeAgent: 'orchestrator',
    documentStats: {
        words: 0,
        characters: 0,
        paragraphs: 0,
        readingTime: 0
    }
};

// AI Agents Configuration
const aiAgents = {
    orchestrator: {
        name: 'Orchestrator',
        icon: '🎯',
        description: 'Coordinates all AI agents and manages workflow'
    },
    research: {
        name: 'Research Agent',
        icon: '🔍',
        description: 'Finds and verifies information'
    },
    editorial: {
        name: 'Editorial Agent',
        icon: '✏️',
        description: 'Improves clarity and structure'
    },
    creative: {
        name: 'Creative Agent',
        icon: '🎨',
        description: 'Enhances creativity and style'
    },
    academic: {
        name: 'Academic Agent',
        icon: '🎓',
        description: 'Ensures academic rigor'
    },
    technical: {
        name: 'Technical Agent',
        icon: '⚙️',
        description: 'Handles technical accuracy'
    },
    narrative: {
        name: 'Narrative Agent',
        icon: '📖',
        description: 'Develops story and flow'
    },
    factChecker: {
        name: 'Fact-Checker',
        icon: '✓',
        description: 'Verifies facts and citations'
    },
    accessibility: {
        name: 'Accessibility Agent',
        icon: '♿',
        description: 'Ensures content accessibility'
    },
    proofreader: {
        name: 'Proofreader',
        icon: '🔎',
        description: 'Catches grammar and spelling errors'
    },
    business: {
        name: 'Business Agent',
        icon: '💼',
        description: 'Optimizes for business communication'
    }
};

// AI Actions based on selection granularity
const aiActions = {
    word: [
        { id: 'synonym', icon: '🔄', label: 'Find Synonyms', desc: 'Suggest alternative words', agent: 'editorial' },
        { id: 'define', icon: '📖', label: 'Define Word', desc: 'Show definition and usage', agent: 'research' },
        { id: 'translate', icon: '🌐', label: 'Translate', desc: 'Translate to other languages', agent: 'research' }
    ],
    sentence: [
        { id: 'rephrase', icon: '✏️', label: 'Rephrase', desc: 'Rewrite for clarity', agent: 'editorial' },
        { id: 'simplify', icon: '📝', label: 'Simplify', desc: 'Make easier to understand', agent: 'editorial' },
        { id: 'expand', icon: '➕', label: 'Expand', desc: 'Add more detail', agent: 'creative' },
        { id: 'grammar', icon: '✓', label: 'Check Grammar', desc: 'Fix grammar issues', agent: 'proofreader' }
    ],
    paragraph: [
        { id: 'improve', icon: '⬆️', label: 'Improve Flow', desc: 'Enhance coherence and transitions', agent: 'editorial' },
        { id: 'restructure', icon: '🔄', label: 'Restructure', desc: 'Reorganize for better impact', agent: 'narrative' },
        { id: 'tone', icon: '🎭', label: 'Adjust Tone', desc: 'Change formality or style', agent: 'creative' },
        { id: 'fact-check', icon: '✓', label: 'Fact Check', desc: 'Verify claims and data', agent: 'factChecker' }
    ],
    section: [
        { id: 'summarize', icon: '📋', label: 'Summarize', desc: 'Create concise summary', agent: 'editorial' },
        { id: 'outline', icon: '📑', label: 'Generate Outline', desc: 'Extract key points', agent: 'orchestrator' },
        { id: 'enhance', icon: '✨', label: 'Enhance Section', desc: 'Improve overall quality', agent: 'orchestrator' },
        { id: 'citations', icon: '📚', label: 'Add Citations', desc: 'Suggest relevant sources', agent: 'academic' }
    ],
    document: [
        { id: 'analyze', icon: '📊', label: 'Analyze Document', desc: 'Comprehensive analysis', agent: 'orchestrator' },
        { id: 'consistency', icon: '🔍', label: 'Check Consistency', desc: 'Ensure uniform style', agent: 'editorial' },
        { id: 'accessibility', icon: '♿', label: 'Accessibility Check', desc: 'Improve accessibility', agent: 'accessibility' },
        { id: 'export', icon: '📤', label: 'Export Options', desc: 'Export in various formats', agent: 'orchestrator' }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeEditor();
    initializeEventListeners();
    updateStats();
});

// Initialize editor with sample content
function initializeEditor() {
    const editor = document.getElementById('editor');
    if (!editor.textContent.trim()) {
        editor.innerHTML = `
            <h1>Welcome to AI-Powered Writing Platform</h1>
            <p>This is an enhanced demo showcasing granular text selection and AI assistance. Try selecting text at different levels:</p>
            <ul>
                <li><strong>Word:</strong> Double-click any word</li>
                <li><strong>Sentence:</strong> Click once to select a sentence</li>
                <li><strong>Paragraph:</strong> Select an entire paragraph</li>
                <li><strong>Section:</strong> Select multiple paragraphs</li>
                <li><strong>Document:</strong> Select all content</li>
            </ul>
            <h2>AI Assistance Features</h2>
            <p>After selecting text, right-click or use the AI menu to access context-aware suggestions. The AI will provide different options based on your selection granularity.</p>
            <p>For example, selecting a single word offers synonyms and definitions, while selecting a paragraph provides options to improve flow, restructure, or adjust tone.</p>
            <h2>Multi-Agent System</h2>
            <p>Our platform uses 11 specialized AI agents working together to provide comprehensive writing assistance. Each agent has specific expertise, from research and fact-checking to creative enhancement and accessibility improvements.</p>
        `;
    }
}

// Initialize all event listeners
function initializeEventListeners() {
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Granularity selector
    const granularitySelect = document.getElementById('granularity-select');
    granularitySelect.addEventListener('change', (e) => {
        state.selectionMode = e.target.value;
        updateSelectionModeInfo();
    });

    // Editor events
    const editor = document.getElementById('editor');
    editor.addEventListener('input', handleEditorInput);
    editor.addEventListener('mouseup', handleTextSelection);
    editor.addEventListener('contextmenu', handleContextMenu);
    editor.addEventListener('dblclick', handleDoubleClick);

    // Close AI menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.ai-menu') && !e.target.closest('.editor-area')) {
            hideAIMenu();
        }
    });

    // Agent modal
    const agentModal = document.getElementById('agent-modal');
    const agentBtn = document.getElementById('agent-btn');
    const closeModal = document.querySelector('.modal-close');

    agentBtn.addEventListener('click', () => {
        agentModal.classList.add('active');
        renderAgentGrid();
    });

    closeModal.addEventListener('click', () => {
        agentModal.classList.remove('active');
    });

    agentModal.addEventListener('click', (e) => {
        if (e.target === agentModal) {
            agentModal.classList.remove('active');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle editor input
function handleEditorInput() {
    updateStats();
    updateSaveStatus();
}

// Handle text selection
function handleTextSelection(e) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
        state.selectedText = selectedText;
        state.selectedRange = selection.getRangeAt(0);
        updateSelectionInfo();

        // Show AI menu after a short delay
        setTimeout(() => {
            if (state.selectedText === selectedText) {
                showAIMenu(e.clientX, e.clientY);
            }
        }, 300);
    } else {
        hideAIMenu();
        updateSelectionInfo();
    }
}

// Handle context menu (right-click)
function handleContextMenu(e) {
    const selection = window.getSelection();
    if (selection.toString().trim().length > 0) {
        e.preventDefault();
        showAIMenu(e.clientX, e.clientY);
    }
}

// Handle double-click for word selection
function handleDoubleClick(e) {
    if (state.selectionMode === 'word') {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        if (selectedText) {
            state.selectedText = selectedText;
            state.selectedRange = selection.getRangeAt(0);
            showAIMenu(e.clientX, e.clientY);
        }
    }
}

// Show AI menu
function showAIMenu(x, y) {
    hideAIMenu(); // Hide any existing menu

    const menu = document.createElement('div');
    menu.className = 'ai-menu';
    menu.id = 'ai-menu';

    // Position menu
    menu.style.left = `${x}px`;
    menu.style.top = `${y + 10}px`;

    // Get actions for current selection mode
    const actions = aiActions[state.selectionMode] || [];
    const agent = aiAgents[state.activeAgent];

    // Build menu content
    menu.innerHTML = `
        <div class="ai-menu-header">
            <div class="ai-menu-title">AI Assistance</div>
            <div class="ai-menu-agent">${agent.icon} ${agent.name}</div>
        </div>
        <div class="ai-menu-content">
            ${actions.map(action => `
                <button class="ai-menu-item" data-action="${action.id}" data-agent="${action.agent}">
                    <div class="ai-menu-icon">${action.icon}</div>
                    <div class="ai-menu-text">
                        <div class="ai-menu-label">${action.label}</div>
                        <div class="ai-menu-desc">${action.desc}</div>
                    </div>
                </button>
            `).join('')}
            <div class="ai-menu-divider"></div>
            <button class="ai-menu-item" data-action="custom">
                <div class="ai-menu-icon">💬</div>
                <div class="ai-menu-text">
                    <div class="ai-menu-label">Custom Request</div>
                    <div class="ai-menu-desc">Ask AI anything about this text</div>
                </div>
            </button>
        </div>
    `;

    document.body.appendChild(menu);

    // Adjust position if menu goes off screen
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
        menu.style.left = `${window.innerWidth - rect.width - 20}px`;
    }
    if (rect.bottom > window.innerHeight) {
        menu.style.top = `${y - rect.height - 10}px`;
    }

    // Add click handlers to menu items
    menu.querySelectorAll('.ai-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            const agent = item.dataset.agent;
            handleAIAction(action, agent);
        });
    });

    state.aiMenuVisible = true;
}

// Hide AI menu
function hideAIMenu() {
    const menu = document.getElementById('ai-menu');
    if (menu) {
        menu.remove();
        state.aiMenuVisible = false;
    }
}

// Handle AI action
function handleAIAction(action, agent) {
    hideAIMenu();

    // Simulate AI processing
    const agentInfo = aiAgents[agent] || aiAgents.orchestrator;
    showNotification(`${agentInfo.icon} ${agentInfo.name} is processing your request...`);

    setTimeout(() => {
        // Simulate AI response
        const responses = {
            synonym: ['alternative', 'substitute', 'replacement', 'equivalent'],
            define: 'Definition: A word or phrase that means exactly or nearly the same as another word.',
            rephrase: 'Here\'s a clearer version: ' + state.selectedText,
            simplify: 'Simplified: ' + state.selectedText.substring(0, 50) + '...',
            improve: 'Improved flow with better transitions and coherence.',
            summarize: 'Summary: ' + state.selectedText.substring(0, 100) + '...',
            analyze: 'Document analysis complete. Overall quality: Good. Suggestions: 5',
            custom: 'AI is ready to help with your custom request.'
        };

        const response = responses[action] || 'AI suggestion applied successfully!';
        showNotification(`✓ ${response}`, 'success');
    }, 1500);
}

// Switch view
function switchView(view) {
    state.currentView = view;

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    document.querySelectorAll('.edit-view, .preview-view').forEach(el => {
        el.classList.toggle('active', el.classList.contains(`${view}-view`));
    });

    if (view === 'preview') {
        updatePreview();
    }
}

// Update preview
function updatePreview() {
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    preview.innerHTML = editor.innerHTML;
}

// Update document statistics
function updateStats() {
    const editor = document.getElementById('editor');
    const text = editor.textContent;

    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const characters = text.length;
    const paragraphs = editor.querySelectorAll('p').length || text.split('\n\n').filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words/min

    state.documentStats = { words, characters, paragraphs, readingTime };

    // Update UI
    document.getElementById('word-count').textContent = words;
    document.getElementById('char-count').textContent = characters;
    document.getElementById('para-count').textContent = paragraphs;
    document.getElementById('reading-time').textContent = `${readingTime} min`;
}

// Update selection info
function updateSelectionInfo() {
    const info = document.getElementById('selection-info');
    if (state.selectedText) {
        const wordCount = state.selectedText.split(/\s+/).filter(w => w.length > 0).length;
        info.textContent = `Selected: ${wordCount} words`;
    } else {
        info.textContent = `Selection mode: ${state.selectionMode}`;
    }
}

// Update selection mode info
function updateSelectionModeInfo() {
    const modeDescriptions = {
        word: {
            desc: 'Select individual words for synonyms, definitions, and translations.',
            tips: ['Double-click to select a word', 'Right-click for AI suggestions', 'Great for vocabulary enhancement']
        },
        sentence: {
            desc: 'Select sentences for rephrasing, simplification, and grammar checks.',
            tips: ['Click to select a sentence', 'AI can rephrase or expand', 'Perfect for clarity improvements']
        },
        paragraph: {
            desc: 'Select paragraphs to improve flow, restructure, or adjust tone.',
            tips: ['Select entire paragraph', 'AI analyzes coherence', 'Ideal for structural changes']
        },
        section: {
            desc: 'Select sections for summaries, outlines, and comprehensive enhancements.',
            tips: ['Select multiple paragraphs', 'AI provides section-level insights', 'Best for major revisions']
        },
        document: {
            desc: 'Analyze entire document for consistency, accessibility, and overall quality.',
            tips: ['Select all content (Ctrl/Cmd+A)', 'Comprehensive AI analysis', 'Full document optimization']
        }
    };

    const info = modeDescriptions[state.selectionMode];
    const container = document.querySelector('.mode-description');
    const tipsList = document.querySelector('.mode-tips ul');

    if (container && info) {
        container.textContent = info.desc;
        tipsList.innerHTML = info.tips.map(tip => `<li>${tip}</li>`).join('');
    }
}

// Update save status
function updateSaveStatus() {
    const status = document.getElementById('save-status');
    status.textContent = 'Saving...';

    setTimeout(() => {
        status.textContent = 'All changes saved';
    }, 1000);
}

// Render agent grid in modal
function renderAgentGrid() {
    const grid = document.getElementById('agent-grid');
    grid.innerHTML = Object.entries(aiAgents).map(([key, agent]) => `
        <div class="agent-card ${key === state.activeAgent ? 'active' : ''}" data-agent="${key}">
            <div class="agent-icon">${agent.icon}</div>
            <div class="agent-name">${agent.name}</div>
            <div class="agent-desc">${agent.description}</div>
        </div>
    `).join('');

    // Add click handlers
    grid.querySelectorAll('.agent-card').forEach(card => {
        card.addEventListener('click', () => {
            state.activeAgent = card.dataset.agent;
            renderAgentGrid();
            showNotification(`Switched to ${aiAgents[state.activeAgent].name}`);
        });
    });
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + S: Save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        updateSaveStatus();
    }

    // Ctrl/Cmd + P: Preview
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        switchView('preview');
    }

    // Ctrl/Cmd + E: Edit
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        switchView('edit');
    }

    // Escape: Hide AI menu
    if (e.key === 'Escape') {
        hideAIMenu();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#2563eb'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Made with Bob
