// State Management
const state = {
    currentDoc: {
        title: 'Untitled Document',
        content: '',
        sections: ['intro', 'body', 'conclusion']
    },
    currentView: 'edit',
    currentAgent: 'orchestrator',
    currentLevel: 'paragraph',
    collaborators: [{ id: 1, name: 'You', avatar: 'JD', online: true }],
    chatHistory: [],
    suggestions: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    updateStats();
    simulateAIPresence();
}

function setupEventListeners() {
    // Editor
    const editor = document.getElementById('editor');
    editor.addEventListener('input', handleEditorInput);
    editor.addEventListener('keydown', handleEditorKeydown);

    // View Toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            switchView(view);
        });
    });

    // Formatting Buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const format = e.target.closest('.tool-btn').dataset.format;
            applyFormatting(format);
        });
    });

    // AI Agent Selector
    document.getElementById('agentSelect').addEventListener('change', (e) => {
        state.currentAgent = e.target.value;
        updateAIAgentInfo();
    });

    // AI Level Buttons
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            state.currentLevel = e.currentTarget.dataset.level;
            showLevelNotification();
        });
    });

    // Quick Actions
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            handleQuickAction(action);
        });
    });

    // Chat
    document.getElementById('sendChatBtn').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });

    // Suggestion Buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const suggestion = e.target.textContent;
            handleSuggestionClick(suggestion);
        });
    });

    // Export Modal
    document.getElementById('exportBtn').addEventListener('click', () => {
        document.getElementById('exportModal').classList.add('active');
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        });
    });

    document.querySelectorAll('.export-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const format = e.currentTarget.querySelector('.export-name').textContent;
            handleExport(format);
        });
    });

    // Outline Navigation
    document.querySelectorAll('.outline-item').forEach(item => {
        item.addEventListener('click', (e) => {
            document.querySelectorAll('.outline-item').forEach(i => i.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const section = e.currentTarget.dataset.section;
            scrollToSection(section);
        });
    });

    // Undo/Redo
    document.getElementById('undoBtn').addEventListener('click', () => {
        document.execCommand('undo');
    });

    document.getElementById('redoBtn').addEventListener('click', () => {
        document.execCommand('redo');
    });
}

// Editor Functions
function handleEditorInput(e) {
    state.currentDoc.content = e.target.value;
    updateStats();
    updatePreview();
    simulateAutoSave();

    // Simulate real-time AI suggestions for sentence level
    if (state.currentLevel === 'sentence') {
        debounce(showRealtimeSuggestions, 500)();
    }
}

function handleEditorKeydown(e) {
    // Tab key for indentation
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = e.target.value.substring(0, start) + '    ' + e.target.value.substring(end);
        e.target.selectionStart = e.target.selectionEnd = start + 4;
    }
}

function switchView(view) {
    state.currentView = view;

    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });

    // Update view visibility
    if (view === 'edit') {
        document.getElementById('editView').classList.add('active');
        document.getElementById('previewView').classList.remove('active');
    } else if (view === 'preview') {
        document.getElementById('editView').classList.remove('active');
        document.getElementById('previewView').classList.add('active');
        updatePreview();
    } else if (view === 'split') {
        // TODO: Implement split view
        alert('Split view coming soon!');
    }
}

function updatePreview() {
    const content = document.getElementById('editor').value;
    const html = marked.parse(content);
    document.getElementById('previewContent').innerHTML = html;
}

function applyFormatting(format) {
    const editor = document.getElementById('editor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);

    let formattedText = '';

    switch (format) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'underline':
            formattedText = `<u>${selectedText}</u>`;
            break;
        case 'h1':
            formattedText = `# ${selectedText}`;
            break;
        case 'h2':
            formattedText = `## ${selectedText}`;
            break;
        case 'h3':
            formattedText = `### ${selectedText}`;
            break;
        case 'ul':
            formattedText = `- ${selectedText}`;
            break;
        case 'ol':
            formattedText = `1. ${selectedText}`;
            break;
        case 'link':
            const url = prompt('Enter URL:');
            formattedText = `[${selectedText}](${url || '#'})`;
            break;
        case 'image':
            const imgUrl = prompt('Enter image URL:');
            formattedText = `![${selectedText || 'Image'}](${imgUrl || ''})`;
            break;
        default:
            formattedText = selectedText;
    }

    editor.value = editor.value.substring(0, start) + formattedText + editor.value.substring(end);
    editor.focus();
    editor.selectionStart = editor.selectionEnd = start + formattedText.length;

    handleEditorInput({ target: editor });
}

// Statistics
function updateStats() {
    const content = document.getElementById('editor').value;
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = content.length;
    const readTime = Math.ceil(words / 200); // Average reading speed

    document.getElementById('wordCount').textContent = words;
    document.getElementById('charCount').textContent = chars;
    document.getElementById('readTime').textContent = `${readTime} min`;
}

// AI Functions
function handleQuickAction(action) {
    const editor = document.getElementById('editor');
    const selectedText = editor.value.substring(editor.selectionStart, editor.selectionEnd);

    // Show loading state
    addChatMessage('ai', `Processing ${action} request...`, true);

    // Simulate AI processing
    setTimeout(() => {
        let response = '';

        switch (action) {
            case 'generate':
                response = simulateGenerate();
                break;
            case 'improve':
                response = simulateImprove(selectedText);
                break;
            case 'summarize':
                response = simulateSummarize(selectedText);
                break;
            case 'expand':
                response = simulateExpand(selectedText);
                break;
            case 'grammar':
                response = simulateGrammarCheck(selectedText);
                break;
            case 'research':
                response = simulateResearch();
                break;
        }

        // Remove loading message
        const messages = document.getElementById('chatMessages');
        messages.removeChild(messages.lastChild);

        // Add AI response
        addChatMessage('ai', response);
    }, 1500);
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addChatMessage('user', message);
    input.value = '';

    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addChatMessage('ai', response);
    }, 1000);
}

function addChatMessage(type, content, isLoading = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'ai' ? '🤖' : 'JD';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (isLoading) {
        contentDiv.innerHTML = '<p>⏳ ' + content + '</p>';
    } else {
        contentDiv.innerHTML = `<p>${content}</p>`;
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleSuggestionClick(suggestion) {
    document.getElementById('chatInput').value = suggestion;
    sendChatMessage();
}

// AI Simulation Functions
function simulateGenerate() {
    return `I can help you generate content! Based on your current document, here's a suggestion:\n\n"${state.currentAgent === 'creative' ? 'In the realm of possibilities, where ideas dance like fireflies in the twilight...' : 'This section explores the fundamental concepts and provides a comprehensive overview of the topic...'}"\n\nWould you like me to continue or adjust the tone?`;
}

function simulateImprove(text) {
    if (!text) return 'Please select some text first, and I\'ll help improve it!';
    return `Here's an improved version:\n\n"${text.substring(0, 50)}..." → "${text.substring(0, 50).replace(/\b\w/g, l => l.toUpperCase())}..."\n\nI've enhanced clarity, flow, and word choice. Apply this change?`;
}

function simulateSummarize(text) {
    if (!text) return 'Please select text to summarize!';
    return `Summary: The selected text discusses key concepts and provides important context. Main points include foundational ideas and practical applications.\n\nWould you like a more detailed summary?`;
}

function simulateExpand(text) {
    if (!text) return 'Please select text to expand!';
    return `I can expand on "${text.substring(0, 30)}..." by:\n\n1. Adding supporting details\n2. Including relevant examples\n3. Providing deeper context\n4. Connecting to related concepts\n\nWhich approach would you prefer?`;
}

function simulateGrammarCheck(text) {
    if (!text) return 'Please select text to check!';
    return `✅ Grammar check complete!\n\nFound 2 suggestions:\n1. Consider "you're" instead of "your" (line 5)\n2. Add comma after introductory phrase (line 8)\n\nOverall score: 95/100`;
}

function simulateResearch() {
    return `🔍 Research Assistant activated!\n\nI can help you:\n• Find relevant sources\n• Verify facts\n• Generate citations\n• Summarize research papers\n\nWhat topic would you like to research?`;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('outline')) {
        return `Great! I'll help you create an outline. Based on your topic, here's a suggested structure:\n\n1. Introduction\n2. Background & Context\n3. Main Arguments\n4. Analysis\n5. Conclusion\n\nWould you like me to expand any section?`;
    } else if (lowerMessage.includes('improve') || lowerMessage.includes('better')) {
        return `I can help improve your writing! I'll focus on:\n• Clarity and conciseness\n• Flow and transitions\n• Word choice and variety\n• Grammar and style\n\nSelect the text you'd like me to improve.`;
    } else if (lowerMessage.includes('source') || lowerMessage.includes('research')) {
        return `I'll help you find sources! What specific topic or question would you like me to research? I can:\n• Find academic papers\n• Locate credible sources\n• Generate citations\n• Summarize findings`;
    } else {
        return `I understand you're asking about "${message}". As your ${state.currentAgent.replace('-', ' ')}, I'm here to help! Could you provide more details about what you'd like me to do?`;
    }
}

function showRealtimeSuggestions() {
    // Simulate real-time AI suggestions
    const suggestions = [
        { type: 'Grammar', text: 'Consider using "their" instead of "there"' },
        { type: 'Style', text: 'This sentence could be more concise' },
        { type: 'Clarity', text: 'Consider rephrasing for better clarity' }
    ];

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    updateSuggestionsList([randomSuggestion]);
}

function updateSuggestionsList(suggestions) {
    const list = document.getElementById('suggestionsList');
    list.innerHTML = '';

    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `
            <div class="suggestion-header">
                <span class="suggestion-type">${suggestion.type}</span>
                <button class="btn-apply" onclick="applySuggestion('${suggestion.text}')">Apply</button>
            </div>
            <div class="suggestion-text">${suggestion.text}</div>
        `;
        list.appendChild(item);
    });
}

function applySuggestion(suggestion) {
    addChatMessage('ai', `Applied suggestion: ${suggestion}`);
    // In a real app, this would apply the actual change
}

function updateAIAgentInfo() {
    const agentDescriptions = {
        'orchestrator': 'Coordinates all AI agents for comprehensive assistance',
        'research': 'Finds sources, verifies facts, and manages citations',
        'editorial': 'Improves structure, flow, and organization',
        'creative': 'Enhances imagery, metaphors, and emotional impact',
        'academic': 'Ensures scholarly rigor and proper citations',
        'proofreader': 'Checks grammar, spelling, and style'
    };

    const description = agentDescriptions[state.currentAgent];
    addChatMessage('ai', `Switched to ${state.currentAgent.replace('-', ' ')} agent. ${description}`);
}

function showLevelNotification() {
    const levelDescriptions = {
        'sentence': 'Real-time suggestions as you type',
        'paragraph': 'On-demand paragraph analysis',
        'section': 'Comprehensive section review',
        'document': 'Full document analysis'
    };

    const description = levelDescriptions[state.currentLevel];
    addChatMessage('ai', `Assistance level set to ${state.currentLevel}. ${description}`);
}

// Utility Functions
function simulateAutoSave() {
    const saveStatus = document.querySelector('.save-status');
    saveStatus.textContent = '💾 Saving...';

    setTimeout(() => {
        saveStatus.textContent = '💾 Saved';
    }, 1000);
}

function simulateAIPresence() {
    // Simulate AI being active
    setInterval(() => {
        const statusText = document.querySelector('.status-left .status-item:nth-child(2) span:last-child');
        const seconds = Math.floor(Math.random() * 10) + 1;
        statusText.textContent = `Synced ${seconds} seconds ago`;
    }, 5000);
}

function scrollToSection(section) {
    // In a real app, this would scroll to the section in the editor
    console.log('Scrolling to section:', section);
}

function handleExport(format) {
    addChatMessage('ai', `Exporting document as ${format}... This feature will be available in the full version!`);
    document.getElementById('exportModal').classList.remove('active');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S for save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        simulateAutoSave();
    }

    // Ctrl/Cmd + B for bold
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        applyFormatting('bold');
    }

    // Ctrl/Cmd + I for italic
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        applyFormatting('italic');
    }
});

// Initialize preview on load
window.addEventListener('load', () => {
    updatePreview();
});

// Made with Bob
