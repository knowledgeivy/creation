// AI-Powered Writing Platform - Enhanced Version with Granular Selection + AI Team Dashboard

// ── State ────────────────────────────────────────────────────────────────────
const state = {
    currentView: 'edit',
    selectionMode: 'sentence',
    selectedText: '',
    selectedRange: null,
    aiMenuVisible: false,
    activeAgent: 'orchestrator',

    // Dashboard state
    dashboardVisible: true,
    automationLevel: 'manual',     // manual | assisted | automatic
    interactionMode: 'collaborative', // silent | collaborative | educational | expert

    // Metrics
    metrics: {
        requests: 0,
        responseTimes: [],
        accepted: 0
    },

    documentStats: { words: 0, characters: 0, paragraphs: 0, readingTime: 0 }
};

// ── Agent definitions ─────────────────────────────────────────────────────────
const aiAgents = {
    orchestrator: { name: 'Orchestrator',   icon: '🎯', description: 'Coordinates all agents and routes requests' },
    research:     { name: 'Research Agent', icon: '🔍', description: 'Finds sources, verifies facts, manages citations' },
    editorial:    { name: 'Editorial Agent',icon: '✏️', description: 'Improves structure, flow, and organization' },
    creative:     { name: 'Creative Agent', icon: '🎨', description: 'Enhances imagery, metaphors, emotional impact' },
    academic:     { name: 'Academic Agent', icon: '🎓', description: 'Ensures scholarly rigor and proper citations' },
    technical:    { name: 'Technical Agent',icon: '⚙️', description: 'Handles technical accuracy and clarity' },
    narrative:    { name: 'Narrative Agent',icon: '📖', description: 'Develops story structure and flow' },
    factChecker:  { name: 'Fact-Checker',   icon: '✓',  description: 'Verifies facts and detects bias' },
    accessibility:{ name: 'Accessibility',  icon: '♿', description: 'Ensures inclusive and accessible writing' },
    proofreader:  { name: 'Proofreader',    icon: '🔎', description: 'Catches grammar and spelling errors' },
    business:     { name: 'Business Agent', icon: '💼', description: 'Optimizes for business communication' }
};

// Agent status per roster entry: idle | queued | working | done
const agentStatuses = Object.fromEntries(Object.keys(aiAgents).map(k => [k, 'idle']));

// ── AI actions per granularity ────────────────────────────────────────────────
const aiActions = {
    word: [
        { id: 'synonym',   icon: '🔄', label: 'Find Synonyms', desc: 'Suggest alternative words',      agent: 'editorial',    support: [] },
        { id: 'define',    icon: '📖', label: 'Define Word',   desc: 'Show definition and usage',      agent: 'research',     support: [] },
        { id: 'translate', icon: '🌐', label: 'Translate',     desc: 'Translate to other languages',   agent: 'research',     support: [] }
    ],
    sentence: [
        { id: 'rephrase',  icon: '✏️', label: 'Rephrase',      desc: 'Rewrite for clarity',            agent: 'editorial',    support: ['proofreader'] },
        { id: 'simplify',  icon: '📝', label: 'Simplify',      desc: 'Make easier to understand',      agent: 'editorial',    support: ['accessibility'] },
        { id: 'expand',    icon: '➕', label: 'Expand',        desc: 'Add more detail',                agent: 'creative',     support: ['editorial'] },
        { id: 'grammar',   icon: '✓',  label: 'Check Grammar', desc: 'Fix grammar issues',             agent: 'proofreader',  support: [] }
    ],
    paragraph: [
        { id: 'improve',     icon: '⬆️', label: 'Improve Flow',  desc: 'Enhance coherence and transitions', agent: 'editorial',   support: ['narrative'] },
        { id: 'restructure', icon: '🔄', label: 'Restructure',   desc: 'Reorganize for better impact',      agent: 'narrative',   support: ['editorial'] },
        { id: 'tone',        icon: '🎭', label: 'Adjust Tone',   desc: 'Change formality or style',         agent: 'creative',    support: ['editorial'] },
        { id: 'fact-check',  icon: '✓',  label: 'Fact Check',   desc: 'Verify claims and data',            agent: 'factChecker', support: ['research'] }
    ],
    section: [
        { id: 'summarize', icon: '📋', label: 'Summarize',          desc: 'Create concise summary',       agent: 'editorial',     support: ['orchestrator'] },
        { id: 'outline',   icon: '📑', label: 'Generate Outline',   desc: 'Extract key points',           agent: 'orchestrator',  support: ['editorial', 'narrative'] },
        { id: 'enhance',   icon: '✨', label: 'Enhance Section',    desc: 'Improve overall quality',      agent: 'orchestrator',  support: ['creative', 'editorial'] },
        { id: 'citations', icon: '📚', label: 'Add Citations',      desc: 'Suggest relevant sources',     agent: 'academic',      support: ['research', 'factChecker'] }
    ],
    document: [
        { id: 'analyze',       icon: '📊', label: 'Analyze Document',   desc: 'Comprehensive analysis',        agent: 'orchestrator',  support: ['editorial', 'accessibility', 'proofreader'] },
        { id: 'consistency',   icon: '🔍', label: 'Check Consistency',  desc: 'Ensure uniform style',          agent: 'editorial',     support: ['proofreader'] },
        { id: 'accessibility', icon: '♿', label: 'Accessibility Check', desc: 'Improve accessibility',        agent: 'accessibility', support: ['editorial'] },
        { id: 'export',        icon: '📤', label: 'Export Options',      desc: 'Export in various formats',    agent: 'orchestrator',  support: [] }
    ]
};

// Educational explanations shown in log when interactionMode === 'educational'
const educationalNotes = {
    synonym:      'Vocabulary enhancement improves reader engagement and avoids repetition.',
    define:       'Clear terminology reduces ambiguity, especially for diverse audiences.',
    rephrase:     'Clarity rewrites preserve meaning while improving readability scores.',
    simplify:     'Plain language principles make content accessible to a wider audience.',
    expand:       'Adding supporting detail strengthens arguments and reader confidence.',
    grammar:      'Grammatical correctness builds credibility and trust with readers.',
    improve:      'Strong transitions are the "glue" that holds paragraphs together.',
    restructure:  'Logical flow helps readers follow complex ideas without getting lost.',
    tone:         'Tone consistency signals professionalism and keeps readers engaged.',
    'fact-check': 'Verified claims are the foundation of authoritative writing.',
    summarize:    'Concise summaries reinforce key ideas and aid retention.',
    outline:      'A clear structure helps both writer and reader navigate the argument.',
    enhance:      'Holistic enhancement balances clarity, style, and completeness.',
    citations:    'Proper citations lend credibility and allow readers to verify claims.',
    analyze:      'Document-level analysis catches issues invisible at sentence level.',
    consistency:  'Consistent style prevents reader distraction and signals polish.',
    accessibility:'Accessible writing includes everyone — WCAG 2.1 AA is the standard.',
    export:       'Multi-format export ensures your content reaches every platform.'
};

// ── Initialization ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initializeEditor();
    initializeEventListeners();
    initializeDashboard();
    updateStats();
});

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

function initializeEventListeners() {
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Granularity selector
    document.getElementById('granularitySelect').addEventListener('change', (e) => {
        state.selectionMode = e.target.value;
        updateSelectionModeInfo();
        document.getElementById('statusMode').textContent =
            e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) + ' Mode';
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

    // Dashboard toggle in nav
    document.getElementById('aiDashboardToggle').addEventListener('click', toggleDashboard);
    document.getElementById('closeDashboard').addEventListener('click', () => {
        state.dashboardVisible = false;
        document.getElementById('aiDashboard').classList.add('hidden');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function initializeDashboard() {
    renderAgentRoster();
    bindAutomationToggle();
    bindInteractionToggle();
}

function toggleDashboard() {
    state.dashboardVisible = !state.dashboardVisible;
    document.getElementById('aiDashboard').classList.toggle('hidden', !state.dashboardVisible);
}

function bindAutomationToggle() {
    document.querySelectorAll('#automationToggle .mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#automationToggle .mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.automationLevel = btn.dataset.level;
            const hints = {
                manual:    'You trigger all AI actions.',
                assisted:  'AI proactively offers suggestions.',
                automatic: 'AI processes changes automatically.'
            };
            document.getElementById('automationHint').textContent = hints[state.automationLevel];
        });
    });
}

function bindInteractionToggle() {
    document.querySelectorAll('#interactionToggle .mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#interactionToggle .mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.interactionMode = btn.dataset.mode;
            const hints = {
                silent:        'Results only — no agent activity shown.',
                collaborative: 'All agents visible, full activity shown.',
                educational:   'Agents explain their reasoning as they work.',
                expert:        'Minimal intervention, brief log.'
            };
            document.getElementById('interactionHint').textContent = hints[state.interactionMode];
        });
    });
}

function renderAgentRoster() {
    const roster = document.getElementById('agentRoster');
    roster.innerHTML = Object.entries(aiAgents).map(([key, agent]) => `
        <div class="roster-agent" id="roster-${key}" data-agent="${key}">
            <span class="agent-status-dot idle" id="dot-${key}"></span>
            <span class="roster-agent-icon">${agent.icon}</span>
            <div class="roster-agent-info">
                <div class="roster-agent-name">${agent.name}</div>
                <div class="roster-agent-status" id="status-${key}">Idle</div>
            </div>
        </div>
    `).join('');
}

function setAgentStatus(agentKey, status, message) {
    const row = document.getElementById(`roster-${agentKey}`);
    const dot = document.getElementById(`dot-${agentKey}`);
    const statusEl = document.getElementById(`status-${agentKey}`);
    if (!row) return;

    row.className = `roster-agent ${status !== 'idle' ? status : ''}`;
    dot.className = `agent-status-dot ${status}`;
    statusEl.textContent = message || status.charAt(0).toUpperCase() + status.slice(1);
}

function addLogEntry(agentKey, message, isEducational = false) {
    if (state.interactionMode === 'silent') return;

    const log = document.getElementById('activityLog');
    const empty = log.querySelector('.log-empty');
    if (empty) empty.remove();

    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    const agent = aiAgents[agentKey];

    const entry = document.createElement('div');
    entry.className = `log-entry${isEducational ? ' educational' : ''}`;
    entry.innerHTML = `
        <span class="log-time">${time}</span>
        <div class="log-body">
            <span class="log-agent">${agent.icon} ${agent.name}</span>
            <div class="log-message">${message}</div>
        </div>
    `;
    log.insertBefore(entry, log.firstChild);

    // Keep log to 10 entries
    while (log.children.length > 10) log.removeChild(log.lastChild);
}

function updateMetrics(responseTimeMs) {
    state.metrics.requests++;
    state.metrics.responseTimes.push(responseTimeMs);
    document.getElementById('metricRequests').textContent = state.metrics.requests;

    const avg = state.metrics.responseTimes.reduce((a, b) => a + b, 0) / state.metrics.responseTimes.length;
    document.getElementById('metricResponseTime').textContent = (avg / 1000).toFixed(1) + 's';
}

function recordAccepted() {
    state.metrics.accepted++;
    const pct = Math.round((state.metrics.accepted / state.metrics.requests) * 100);
    document.getElementById('metricAccepted').textContent = `${state.metrics.accepted} (${pct}%)`;
}

// Animate agents working for a given action
function animateAgents(actionId, primaryAgentKey, supportingAgentKeys) {
    const startTime = Date.now();
    const showFull = state.interactionMode !== 'silent' && state.interactionMode !== 'expert';

    // Step 1: Orchestrator routes the request
    setAgentStatus('orchestrator', 'working', 'Routing request…');
    addLogEntry('orchestrator', `Analysing request: <em>${actionId}</em>`);

    // Step 2: Primary agent starts working
    setTimeout(() => {
        setAgentStatus('orchestrator', 'done', 'Routed');
        setAgentStatus(primaryAgentKey, 'working', 'Processing…');
        addLogEntry(primaryAgentKey, 'Processing your selection…');

        if (state.interactionMode === 'educational') {
            const note = educationalNotes[actionId];
            if (note) setTimeout(() => addLogEntry(primaryAgentKey, note, true), 300);
        }

        // Step 3: Supporting agents (only in collaborative / educational)
        if (showFull && supportingAgentKeys.length) {
            supportingAgentKeys.forEach((key, i) => {
                setTimeout(() => {
                    setAgentStatus(key, 'queued', 'Queued');
                    setTimeout(() => {
                        setAgentStatus(key, 'working', 'Supporting…');
                        addLogEntry(key, 'Providing supporting analysis…');
                    }, 300);
                }, i * 200);
            });
        }

        // Step 4: All done
        const finishDelay = showFull && supportingAgentKeys.length
            ? 1200 + supportingAgentKeys.length * 200
            : 800;

        setTimeout(() => {
            setAgentStatus(primaryAgentKey, 'done', 'Done');
            supportingAgentKeys.forEach(k => setAgentStatus(k, 'done', 'Done'));

            const elapsed = Date.now() - startTime;
            updateMetrics(elapsed);
            addLogEntry(primaryAgentKey, 'Suggestion ready.');

            // Reset all to idle after a beat
            setTimeout(() => {
                ['orchestrator', primaryAgentKey, ...supportingAgentKeys].forEach(k => {
                    setAgentStatus(k, 'idle', 'Idle');
                });
            }, 1500);
        }, finishDelay);
    }, 500);
}

// ── Editor event handlers ─────────────────────────────────────────────────────
function handleEditorInput() {
    updateStats();
    updateSaveStatus();
}

function handleTextSelection(e) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
        state.selectedText = selectedText;
        state.selectedRange = selection.getRangeAt(0);
        updateSelectionInfo();

        setTimeout(() => {
            if (state.selectedText === selectedText) showAIMenu(e.clientX, e.clientY);
        }, 300);
    } else {
        hideAIMenu();
        updateSelectionInfo();
    }
}

function handleContextMenu(e) {
    const selection = window.getSelection();
    if (selection.toString().trim().length > 0) {
        e.preventDefault();
        showAIMenu(e.clientX, e.clientY);
    }
}

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

// ── AI Menu ───────────────────────────────────────────────────────────────────
function showAIMenu(x, y) {
    hideAIMenu();

    const menu = document.createElement('div');
    menu.className = 'ai-menu';
    menu.id = 'ai-menu';
    menu.style.left = `${x}px`;
    menu.style.top  = `${y + 10}px`;

    const actions = aiActions[state.selectionMode] || [];
    const agent   = aiAgents[state.activeAgent];

    menu.innerHTML = `
        <div class="ai-menu-header">
            <div class="ai-menu-title">AI Assistance</div>
            <div class="ai-menu-agent">${agent.icon} ${agent.name}</div>
        </div>
        <div class="ai-menu-content">
            ${actions.map(action => `
                <button class="ai-menu-item"
                        data-action="${action.id}"
                        data-agent="${action.agent}"
                        data-support="${action.support.join(',')}">
                    <div class="ai-menu-icon">${action.icon}</div>
                    <div class="ai-menu-text">
                        <div class="ai-menu-label">${action.label}</div>
                        <div class="ai-menu-desc">${action.desc}</div>
                    </div>
                </button>
            `).join('')}
            <div class="ai-menu-divider"></div>
            <button class="ai-menu-item" data-action="custom" data-agent="orchestrator" data-support="">
                <div class="ai-menu-icon">💬</div>
                <div class="ai-menu-text">
                    <div class="ai-menu-label">Custom Request</div>
                    <div class="ai-menu-desc">Ask AI anything about this text</div>
                </div>
            </button>
        </div>
    `;

    document.body.appendChild(menu);

    // Keep within viewport
    const rect = menu.getBoundingClientRect();
    if (rect.right  > window.innerWidth)  menu.style.left = `${window.innerWidth  - rect.width  - 20}px`;
    if (rect.bottom > window.innerHeight) menu.style.top  = `${y - rect.height - 10}px`;

    menu.querySelectorAll('.ai-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const support = item.dataset.support ? item.dataset.support.split(',').filter(Boolean) : [];
            handleAIAction(item.dataset.action, item.dataset.agent, support);
        });
    });

    state.aiMenuVisible = true;
}

function hideAIMenu() {
    const menu = document.getElementById('ai-menu');
    if (menu) { menu.remove(); state.aiMenuVisible = false; }
}

function handleAIAction(action, agentKey, supportingKeys = []) {
    hideAIMenu();

    const agentInfo = aiAgents[agentKey] || aiAgents.orchestrator;
    showNotification(`${agentInfo.icon} ${agentInfo.name} is working…`);

    // Animate the dashboard
    animateAgents(action, agentKey, supportingKeys);

    // Simulate AI response
    setTimeout(() => {
        const responses = {
            synonym:      'Synonyms found: alternative, substitute, equivalent.',
            define:       'Definition retrieved and added to the side panel.',
            rephrase:     'Rephrased for clarity: ' + (state.selectedText || '').substring(0, 60) + '…',
            simplify:     'Simplified version ready.',
            expand:       'Expanded with supporting detail.',
            grammar:      'Grammar check complete — 2 suggestions found.',
            improve:      'Flow improved with stronger transitions.',
            restructure:  'Restructured for better impact.',
            tone:         'Tone adjusted to match your style profile.',
            'fact-check': 'Fact check complete — all claims verified.',
            summarize:    'Summary: ' + (state.selectedText || '').substring(0, 80) + '…',
            outline:      'Outline generated: 3 sections, 8 key points.',
            enhance:      'Section enhanced for clarity and engagement.',
            citations:    '3 relevant citations suggested.',
            analyze:      'Document analysis complete. Quality: Good. Issues: 4.',
            consistency:  'Style consistency check complete.',
            accessibility:'Accessibility score: 82/100. 3 improvements suggested.',
            export:       'Export options ready: PDF, DOCX, Markdown.',
            custom:       'AI is ready to assist with your custom request.'
        };

        const msg = responses[action] || 'AI suggestion applied.';
        showNotification(`✓ ${msg}`, 'success');
        recordAccepted();
    }, state.interactionMode === 'silent' ? 800 : 1600);

    // Update status bar
    document.getElementById('statusAgent').textContent = agentInfo.name;
}

// ── View / Stats / UI helpers ─────────────────────────────────────────────────
function switchView(view) {
    state.currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    document.querySelectorAll('.edit-view, .preview-view').forEach(el => {
        el.classList.toggle('active', el.classList.contains(`${view}-view`));
    });
    if (view === 'preview') updatePreview();
}

function updatePreview() {
    const editor  = document.getElementById('editor');
    const preview = document.getElementById('previewContent');
    preview.innerHTML = editor.innerHTML;
}

function updateStats() {
    const editor = document.getElementById('editor');
    const text   = editor.textContent;

    const words      = text.trim() ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
    const characters = text.length;
    const paragraphs = editor.querySelectorAll('p').length || text.split('\n\n').filter(p => p.trim()).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    state.documentStats = { words, characters, paragraphs, readingTime };

    document.getElementById('wordCount').textContent    = words;
    document.getElementById('charCount').textContent    = characters;
    document.getElementById('readTime').textContent     = `${readingTime} min`;
    document.getElementById('selectedCount').textContent = '0 words';
}

function updateSelectionInfo() {
    const info = document.getElementById('selectionInfo');
    if (state.selectedText) {
        const wc = state.selectedText.split(/\s+/).filter(w => w.length > 0).length;
        info.textContent = `Selected: ${wc} word${wc !== 1 ? 's' : ''}`;
        document.getElementById('selectedCount').textContent = `${wc} word${wc !== 1 ? 's' : ''}`;
    } else {
        info.textContent = `Mode: ${state.selectionMode}`;
        document.getElementById('selectedCount').textContent = '0 words';
    }
}

function updateSelectionModeInfo() {
    const modeDescriptions = {
        word:      { desc: 'Double-click a word for synonyms, definitions, and translations.' },
        sentence:  { desc: 'Click to select a sentence for rephrasing and grammar checks.' },
        paragraph: { desc: 'Select a paragraph to improve flow, restructure, or adjust tone.' },
        section:   { desc: 'Select multiple paragraphs for summaries, outlines, and enhancements.' },
        document:  { desc: 'Work with the entire document for analysis and consistency checks.' }
    };
    const el = document.getElementById('modeDescription');
    if (el) el.textContent = modeDescriptions[state.selectionMode]?.desc || '';
}

function updateSaveStatus() {
    const status = document.querySelector('.save-status');
    if (!status) return;
    status.textContent = '⏳ Saving…';
    setTimeout(() => { status.textContent = '💾 Saved'; }, 1000);
}

function handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); updateSaveStatus(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') { e.preventDefault(); switchView('preview'); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') { e.preventDefault(); switchView('edit'); }
    if (e.key === 'Escape') hideAIMenu();
}

// ── Notification ──────────────────────────────────────────────────────────────
function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.style.cssText = `
        position: fixed; top: 80px; right: 20px;
        background: ${type === 'success' ? '#10b981' : '#2563eb'};
        color: white; padding: 1rem 1.5rem; border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        z-index: 2000; animation: slideIn 0.3s ease-out; max-width: 400px;
        font-size: 0.875rem;
    `;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => {
        n.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => n.remove(), 300);
    }, 3000);
}

// Animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn  { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
`;
document.head.appendChild(style);

// Made with Bob
