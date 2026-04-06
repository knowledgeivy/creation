// AI-Powered Writing Platform — Section-based document editor

// ── Document type templates ───────────────────────────────────────────────────
const DOC_TEMPLATES = {
    blog: {
        label: 'Blog / Article',
        sections: [
            { title: 'Introduction', level: 'chapter', placeholder: 'Hook the reader. What is this about and why does it matter?', content: '' },
            { title: 'Body', level: 'chapter', placeholder: 'Develop your main argument or narrative here.', content: '' },
            { title: 'Conclusion', level: 'chapter', placeholder: 'Wrap up your key points and leave the reader with a takeaway.', content: '' }
        ]
    },
    academic: {
        label: 'Academic Paper',
        sections: [
            { title: 'Abstract', level: 'chapter', placeholder: 'Summarise the research question, method, results, and conclusion in 150–250 words.', content: '' },
            { title: 'Introduction', level: 'chapter', placeholder: 'State the problem, review relevant literature, and present your thesis.', content: '' },
            { title: 'Methods', level: 'chapter', placeholder: 'Describe your research design, data collection, and analysis approach.', content: '' },
            { title: 'Results', level: 'chapter', placeholder: 'Present your findings objectively, supported by data and figures.', content: '' },
            { title: 'Discussion', level: 'chapter', placeholder: 'Interpret your results, discuss limitations, and compare with existing literature.', content: '' },
            { title: 'References', level: 'chapter', placeholder: 'List all cited sources in your chosen citation style (APA, MLA, Chicago…).', content: '' }
        ]
    },
    report: {
        label: 'Report',
        sections: [
            { title: 'Executive Summary', level: 'chapter', placeholder: 'Key findings and recommendations — written last, read first.', content: '' },
            { title: 'Introduction', level: 'chapter', placeholder: 'Background, scope, and objectives of this report.', content: '' },
            { title: 'Findings', level: 'chapter', placeholder: 'Present your data, analysis, and observations.', content: '' },
            { title: 'Recommendations', level: 'chapter', placeholder: 'Actionable recommendations based on your findings.', content: '' },
            { title: 'Conclusion', level: 'chapter', placeholder: 'Summarise the report and next steps.', content: '' },
            { title: 'Appendix', level: 'chapter', placeholder: 'Supporting data, charts, and supplementary material.', content: '' }
        ]
    },
    novel: {
        label: 'Novel',
        sections: [
            { title: 'Part I — The Beginning', level: 'part', placeholder: '', content: '' },
            { title: 'Chapter 1', level: 'chapter', placeholder: 'Open your story. Introduce the world and your protagonist.', content: '' },
            { title: 'Chapter 2', level: 'chapter', placeholder: 'Deepen the world and raise the central conflict.', content: '' },
            { title: 'Part II — Rising Action', level: 'part', placeholder: '', content: '' },
            { title: 'Chapter 3', level: 'chapter', placeholder: 'Escalate the stakes and complicate the protagonist\'s journey.', content: '' },
            { title: 'Part III — Climax & Resolution', level: 'part', placeholder: '', content: '' },
            { title: 'Chapter 4', level: 'chapter', placeholder: 'The decisive moment — all threads converge.', content: '' },
            { title: 'Chapter 5', level: 'chapter', placeholder: 'Resolve the conflict and show the new world.', content: '' }
        ]
    },
    short_story: {
        label: 'Short Story',
        sections: [
            { title: 'Opening', level: 'chapter', placeholder: 'Drop the reader straight into the story.', content: '' },
            { title: 'Rising Action', level: 'chapter', placeholder: 'Build tension. What does the character want, and what stands in the way?', content: '' },
            { title: 'Climax', level: 'chapter', placeholder: 'The moment of highest tension or revelation.', content: '' },
            { title: 'Resolution', level: 'chapter', placeholder: 'Show the aftermath. How has the character or situation changed?', content: '' }
        ]
    },
    blank: {
        label: 'Blank',
        sections: [
            { title: 'Section 1', level: 'chapter', placeholder: 'Start writing…', content: '' }
        ]
    }
};

// ── State ─────────────────────────────────────────────────────────────────────
const state = {
    docType: 'blog',
    sections: [],
    activeSectionId: null,
    selectionMode: 'sentence',
    selectedText: '',
    currentView: 'edit',
    activeAgent: 'orchestrator',
    dashboardVisible: true,
    automationLevel: 'manual',
    interactionMode: 'collaborative',
    metrics: { requests: 0, responseTimes: [], accepted: 0 }
};

// ── Agents ────────────────────────────────────────────────────────────────────
const aiAgents = {
    orchestrator: { name: 'Orchestrator',    icon: '🎯', description: 'Coordinates all agents and routes requests' },
    research:     { name: 'Research Agent',  icon: '🔍', description: 'Finds sources, verifies facts, manages citations' },
    editorial:    { name: 'Editorial Agent', icon: '✏️', description: 'Improves structure, flow, and organization' },
    creative:     { name: 'Creative Agent',  icon: '🎨', description: 'Enhances imagery, metaphors, emotional impact' },
    academic:     { name: 'Academic Agent',  icon: '🎓', description: 'Ensures scholarly rigor and proper citations' },
    technical:    { name: 'Technical Agent', icon: '⚙️', description: 'Handles technical accuracy and clarity' },
    narrative:    { name: 'Narrative Agent', icon: '📖', description: 'Develops story structure and flow' },
    factChecker:  { name: 'Fact-Checker',    icon: '✓',  description: 'Verifies facts and detects bias' },
    accessibility:{ name: 'Accessibility',   icon: '♿', description: 'Ensures inclusive and accessible writing' },
    proofreader:  { name: 'Proofreader',     icon: '🔎', description: 'Catches grammar and spelling errors' },
    business:     { name: 'Business Agent',  icon: '💼', description: 'Optimizes for business communication' }
};

const aiActions = {
    word: [
        { id: 'synonym',   icon: '🔄', label: 'Find Synonyms', desc: 'Suggest alternative words',    agent: 'editorial',   support: [] },
        { id: 'define',    icon: '📖', label: 'Define Word',   desc: 'Show definition and usage',    agent: 'research',    support: [] },
        { id: 'translate', icon: '🌐', label: 'Translate',     desc: 'Translate to other languages', agent: 'research',    support: [] }
    ],
    sentence: [
        { id: 'rephrase',  icon: '✏️', label: 'Rephrase',      desc: 'Rewrite for clarity',          agent: 'editorial',   support: ['proofreader'] },
        { id: 'simplify',  icon: '📝', label: 'Simplify',      desc: 'Make easier to understand',    agent: 'editorial',   support: ['accessibility'] },
        { id: 'expand',    icon: '➕', label: 'Expand',        desc: 'Add more detail',              agent: 'creative',    support: ['editorial'] },
        { id: 'grammar',   icon: '✓',  label: 'Check Grammar', desc: 'Fix grammar issues',           agent: 'proofreader', support: [] }
    ],
    paragraph: [
        { id: 'improve',     icon: '⬆️', label: 'Improve Flow',  desc: 'Enhance coherence',         agent: 'editorial',   support: ['narrative'] },
        { id: 'restructure', icon: '🔄', label: 'Restructure',   desc: 'Reorganize for impact',     agent: 'narrative',   support: ['editorial'] },
        { id: 'tone',        icon: '🎭', label: 'Adjust Tone',   desc: 'Change formality or style', agent: 'creative',    support: ['editorial'] },
        { id: 'fact-check',  icon: '✓',  label: 'Fact Check',   desc: 'Verify claims and data',    agent: 'factChecker', support: ['research'] }
    ],
    section: [
        { id: 'summarize', icon: '📋', label: 'Summarize Section', desc: 'Create concise summary',    agent: 'editorial',    support: ['orchestrator'] },
        { id: 'outline',   icon: '📑', label: 'Generate Outline',  desc: 'Extract key points',        agent: 'orchestrator', support: ['editorial', 'narrative'] },
        { id: 'enhance',   icon: '✨', label: 'Enhance Section',   desc: 'Improve overall quality',   agent: 'orchestrator', support: ['creative', 'editorial'] },
        { id: 'citations', icon: '📚', label: 'Add Citations',     desc: 'Suggest relevant sources',  agent: 'academic',     support: ['research', 'factChecker'] }
    ],
    document: [
        { id: 'analyze',       icon: '📊', label: 'Analyze Document',   desc: 'Comprehensive analysis',   agent: 'orchestrator',  support: ['editorial', 'accessibility', 'proofreader'] },
        { id: 'consistency',   icon: '🔍', label: 'Check Consistency',  desc: 'Ensure uniform style',     agent: 'editorial',     support: ['proofreader'] },
        { id: 'accessibility', icon: '♿', label: 'Accessibility Check', desc: 'Improve accessibility',   agent: 'accessibility', support: ['editorial'] },
        { id: 'export',        icon: '📤', label: 'Export Options',      desc: 'Export in various formats',agent: 'orchestrator',  support: [] }
    ]
};

const educationalNotes = {
    synonym:    'Vocabulary variety improves reader engagement and avoids repetition.',
    rephrase:   'Clarity rewrites preserve meaning while improving readability.',
    simplify:   'Plain language makes content accessible to a wider audience.',
    improve:    'Strong transitions are the glue that holds paragraphs together.',
    summarize:  'Concise summaries reinforce key ideas and aid retention.',
    outline:    'A clear structure helps both writer and reader navigate the argument.',
    citations:  'Proper citations lend credibility and allow readers to verify claims.',
    analyze:    'Document-level analysis catches issues invisible at sentence level.'
};

// ── Utilities ─────────────────────────────────────────────────────────────────
function uid() {
    return 'sec-' + Math.random().toString(36).slice(2, 9);
}

function wordCount(text) {
    return text.trim() ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    initDashboard();
});

function initEventListeners() {
    // Doc type modal
    document.querySelectorAll('.doctype-card').forEach(card => {
        card.addEventListener('click', () => {
            loadDocType(card.dataset.type);
            document.getElementById('docTypeModal').classList.remove('active');
        });
    });

    document.getElementById('changeDocTypeBtn').addEventListener('click', () => {
        document.getElementById('docTypeModal').classList.add('active');
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById(btn.dataset.modal).classList.remove('active');
        });
    });

    // Add section
    document.getElementById('addSectionBtn').addEventListener('click', () => {
        document.getElementById('newSectionTitle').value = '';
        document.getElementById('addSectionModal').classList.add('active');
    });

    document.getElementById('confirmAddSection').addEventListener('click', () => {
        const title = document.getElementById('newSectionTitle').value.trim() || 'New Section';
        const level = document.getElementById('newSectionLevel').value;
        addSection({ id: uid(), title, level, content: '', collapsed: false });
        document.getElementById('addSectionModal').classList.remove('active');
    });

    // Collapse / expand all
    document.getElementById('collapseAllBtn').addEventListener('click', () => setAllCollapsed(true));
    document.getElementById('expandAllBtn').addEventListener('click', () => setAllCollapsed(false));

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Granularity
    document.getElementById('granularitySelect').addEventListener('change', e => {
        state.selectionMode = e.target.value;
        updateModeDescription();
        document.getElementById('statusMode').textContent =
            e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) + ' Mode';
    });

    // AI Dashboard
    document.getElementById('aiDashboardToggle').addEventListener('click', toggleDashboard);
    document.getElementById('closeDashboard').addEventListener('click', () => {
        state.dashboardVisible = false;
        document.getElementById('aiDashboard').classList.add('hidden');
    });

    // Global selection tracking
    document.addEventListener('mouseup', handleGlobalSelection);
    document.addEventListener('click', e => {
        if (!e.target.closest('.ai-menu') && !e.target.closest('.section-editor')) hideAIMenu();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') hideAIMenu();
        if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); triggerSave(); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') { e.preventDefault(); switchView('preview'); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') { e.preventDefault(); switchView('edit'); }
    });
}

// ── Document type loading ─────────────────────────────────────────────────────
function loadDocType(type) {
    state.docType = type;
    const template = DOC_TEMPLATES[type];
    state.sections = template.sections.map(s => ({ ...s, id: uid(), collapsed: false }));
    document.getElementById('docTypeBadge').textContent = template.label;
    renderAllSections();
    updateOutline();
    updateDocStats();
}

// ── Section rendering ─────────────────────────────────────────────────────────
function renderAllSections() {
    const container = document.getElementById('sectionsContainer');
    container.innerHTML = '';
    state.sections.forEach(sec => container.appendChild(buildSectionEl(sec)));
}

function buildSectionEl(sec) {
    const el = document.createElement('div');
    el.className = `doc-section level-${sec.level}${sec.collapsed ? ' collapsed' : ''}`;
    el.dataset.id = sec.id;

    el.innerHTML = `
        <div class="section-header">
            <button class="section-collapse-btn" title="Collapse / expand">
                <span class="collapse-arrow">${sec.collapsed ? '▶' : '▼'}</span>
            </button>
            <span class="section-title" contenteditable="true" spellcheck="false">${escHtml(sec.title)}</span>
            <span class="section-wordcount" id="wc-${sec.id}">0 words</span>
            <div class="section-actions">
                <button class="section-action-btn" data-action="move-up"   title="Move up">↑</button>
                <button class="section-action-btn" data-action="move-down" title="Move down">↓</button>
                <button class="section-action-btn" data-action="ai"        title="AI assist">🤖</button>
                <button class="section-action-btn danger" data-action="delete" title="Delete section">×</button>
            </div>
        </div>
        <div class="section-body">
            <div class="section-editor"
                 contenteditable="true"
                 data-id="${sec.id}"
                 data-placeholder="${escHtml(sec.placeholder || 'Write here…')}"
            >${sec.content}</div>
        </div>
    `;

    // Collapse toggle
    el.querySelector('.section-collapse-btn').addEventListener('click', () => toggleSection(sec.id));

    // Title edit
    const titleEl = el.querySelector('.section-title');
    titleEl.addEventListener('input', () => {
        const s = state.sections.find(s => s.id === sec.id);
        if (s) { s.title = titleEl.textContent.trim(); updateOutline(); }
    });

    // Editor input
    const editor = el.querySelector('.section-editor');
    editor.addEventListener('input', () => {
        const s = state.sections.find(s => s.id === sec.id);
        if (s) {
            s.content = editor.innerHTML;
            updateSectionWordCount(sec.id);
            updateDocStats();
            triggerSave();
        }
    });
    editor.addEventListener('focus', () => {
        state.activeSectionId = sec.id;
        document.querySelectorAll('.doc-section').forEach(e => e.classList.remove('active-section'));
        el.classList.add('active-section');
        document.getElementById('activeSection').textContent = sec.title;
        updateOutlineActive(sec.id);
    });
    editor.addEventListener('mouseup', e => handleSectionSelection(e, sec.id));
    editor.addEventListener('contextmenu', e => {
        if (window.getSelection().toString().trim()) {
            e.preventDefault();
            showAIMenu(e.clientX, e.clientY);
        }
    });

    // Section action buttons
    el.querySelectorAll('.section-action-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            handleSectionAction(btn.dataset.action, sec.id, el);
        });
    });

    updateSectionWordCount(sec.id);
    return el;
}

// ── Section operations ────────────────────────────────────────────────────────
function addSection(sec) {
    sec.collapsed = false;
    state.sections.push(sec);
    document.getElementById('sectionsContainer').appendChild(buildSectionEl(sec));
    updateOutline();
    updateDocStats();
    // Scroll to new section
    const el = document.querySelector(`.doc-section[data-id="${sec.id}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleSection(id) {
    const sec = state.sections.find(s => s.id === id);
    if (!sec) return;
    sec.collapsed = !sec.collapsed;
    const el = document.querySelector(`.doc-section[data-id="${id}"]`);
    el.classList.toggle('collapsed', sec.collapsed);
    el.querySelector('.collapse-arrow').textContent = sec.collapsed ? '▶' : '▼';
}

function setAllCollapsed(collapsed) {
    state.sections.forEach(s => {
        s.collapsed = collapsed;
        const el = document.querySelector(`.doc-section[data-id="${s.id}"]`);
        if (el) {
            el.classList.toggle('collapsed', collapsed);
            el.querySelector('.collapse-arrow').textContent = collapsed ? '▶' : '▼';
        }
    });
}

function handleSectionAction(action, id, el) {
    const idx = state.sections.findIndex(s => s.id === id);
    if (idx === -1) return;

    if (action === 'delete') {
        if (state.sections.length === 1) { showNotification('Cannot delete the only section.'); return; }
        if (!confirm(`Delete "${state.sections[idx].title}"?`)) return;
        state.sections.splice(idx, 1);
        el.remove();
        updateOutline();
        updateDocStats();
    } else if (action === 'move-up' && idx > 0) {
        [state.sections[idx - 1], state.sections[idx]] = [state.sections[idx], state.sections[idx - 1]];
        renderAllSections();
        updateOutline();
    } else if (action === 'move-down' && idx < state.sections.length - 1) {
        [state.sections[idx], state.sections[idx + 1]] = [state.sections[idx + 1], state.sections[idx]];
        renderAllSections();
        updateOutline();
    } else if (action === 'ai') {
        state.activeSectionId = id;
        const rect = el.getBoundingClientRect();
        state.selectedText = el.querySelector('.section-editor').textContent.substring(0, 100);
        showAIMenu(rect.right - 220, rect.top + 44, 'section');
    }
}

// ── Outline ───────────────────────────────────────────────────────────────────
function updateOutline() {
    const outline = document.getElementById('documentOutline');
    outline.innerHTML = state.sections.map(sec => `
        <div class="outline-item level-${sec.level}" data-id="${sec.id}">
            <span class="outline-level-icon">${sec.level === 'part' ? '📂' : sec.level === 'scene' ? '🔹' : '📄'}</span>
            <span class="outline-text">${escHtml(sec.title)}</span>
            <span class="outline-wc" id="owc-${sec.id}"></span>
        </div>
    `).join('');

    outline.querySelectorAll('.outline-item').forEach(item => {
        item.addEventListener('click', () => {
            const sec = state.sections.find(s => s.id === item.dataset.id);
            if (sec && sec.collapsed) toggleSection(sec.id);
            const el = document.querySelector(`.doc-section[data-id="${item.dataset.id}"]`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                el.querySelector('.section-editor').focus();
            }
        });
    });

    updateOutlineActive(state.activeSectionId);
    document.getElementById('sectionCount').textContent = state.sections.length;
}

function updateOutlineActive(id) {
    document.querySelectorAll('.outline-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === id);
    });
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function updateSectionWordCount(id) {
    const el = document.querySelector(`.section-editor[data-id="${id}"]`);
    const wc = el ? wordCount(el.textContent) : 0;
    const wcEl = document.getElementById(`wc-${id}`);
    if (wcEl) wcEl.textContent = `${wc} word${wc !== 1 ? 's' : ''}`;
    const owcEl = document.getElementById(`owc-${id}`);
    if (owcEl) owcEl.textContent = wc > 0 ? `${wc}w` : '';
}

function updateDocStats() {
    let total = 0;
    state.sections.forEach(sec => {
        const el = document.querySelector(`.section-editor[data-id="${sec.id}"]`);
        total += el ? wordCount(el.textContent) : 0;
    });
    document.getElementById('wordCount').textContent = total;
    document.getElementById('readTime').textContent = Math.max(1, Math.ceil(total / 200)) + ' min';
}

// ── Selection & AI menu ───────────────────────────────────────────────────────
function handleGlobalSelection() {
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : '';
    if (text) {
        state.selectedText = text;
        const wc = wordCount(text);
        document.getElementById('selectedCount').textContent = `${wc} word${wc !== 1 ? 's' : ''}`;
        document.getElementById('selectionInfo').textContent = `Selected: ${wc} word${wc !== 1 ? 's' : ''}`;
    } else {
        document.getElementById('selectedCount').textContent = '0 words';
        document.getElementById('selectionInfo').textContent = 'No selection';
    }
}

function handleSectionSelection(e, sectionId) {
    state.activeSectionId = sectionId;
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : '';
    if (text.length > 0) {
        state.selectedText = text;
        setTimeout(() => {
            if (window.getSelection().toString().trim() === text) showAIMenu(e.clientX, e.clientY);
        }, 280);
    }
}

function showAIMenu(x, y, forcedMode) {
    hideAIMenu();
    const mode = forcedMode || state.selectionMode;
    const actions = aiActions[mode] || aiActions.sentence;
    const agent = aiAgents[state.activeAgent];

    const menu = document.createElement('div');
    menu.className = 'ai-menu';
    menu.id = 'ai-menu';
    menu.style.left = `${x}px`;
    menu.style.top  = `${y + 8}px`;

    menu.innerHTML = `
        <div class="ai-menu-header">
            <div class="ai-menu-title">AI Assistance</div>
            <div class="ai-menu-agent">${agent.icon} ${agent.name}</div>
        </div>
        <div class="ai-menu-content">
            ${actions.map(a => `
                <button class="ai-menu-item" data-action="${a.id}" data-agent="${a.agent}" data-support="${a.support.join(',')}">
                    <div class="ai-menu-icon">${a.icon}</div>
                    <div class="ai-menu-text">
                        <div class="ai-menu-label">${a.label}</div>
                        <div class="ai-menu-desc">${a.desc}</div>
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

    const rect = menu.getBoundingClientRect();
    if (rect.right  > window.innerWidth)  menu.style.left = `${window.innerWidth  - rect.width  - 16}px`;
    if (rect.bottom > window.innerHeight) menu.style.top  = `${y - rect.height - 8}px`;

    menu.querySelectorAll('.ai-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const support = item.dataset.support ? item.dataset.support.split(',').filter(Boolean) : [];
            handleAIAction(item.dataset.action, item.dataset.agent, support);
        });
    });
}

function hideAIMenu() {
    const m = document.getElementById('ai-menu');
    if (m) m.remove();
}

// ── AI Server ─────────────────────────────────────────────────────────────────
const AI_SERVER = 'http://localhost:3001';

async function callAgentAPI(action, text, extras = {}) {
    const res = await fetch(`${AI_SERVER}/api/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, text, ...extras })
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
    }
    const { result } = await res.json();
    return result;
}

async function handleAIAction(action, agentKey, supportingKeys = []) {
    hideAIMenu();
    const agentInfo = aiAgents[agentKey] || aiAgents.orchestrator;
    showNotification(`${agentInfo.icon} ${agentInfo.name} is working…`);
    animateAgents(action, agentKey, supportingKeys);
    document.getElementById('statusAgent').textContent = agentInfo.name;

    // export is handled client-side only
    if (action === 'export') {
        showNotification('✓ Export options: PDF, DOCX, Markdown.', 'success');
        recordAccepted();
        return;
    }

    try {
        const result = await callAgentAPI(action, state.selectedText || '');
        showNotification(`✓ ${agentInfo.name}: Done`, 'success');
        recordAccepted();
        showResultPanel(action, agentInfo, result);
    } catch (err) {
        console.error(`[AI:${action}]`, err);
        showNotification(`⚠ ${err.message}`, 'error');
    }
}

function showResultPanel(action, agentInfo, result) {
    const existing = document.getElementById('ai-result-panel');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.id = 'ai-result-panel';
    panel.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; width: 380px; max-height: 320px;
        background: #1e293b; color: #e2e8f0; border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4); z-index: 3000;
        display: flex; flex-direction: column; overflow: hidden;
        font-size: 0.875rem; font-family: inherit;
    `;

    panel.innerHTML = `
        <div style="padding: 12px 16px; background: #334155; display: flex; justify-content: space-between; align-items: center;">
            <span>${agentInfo.icon} <strong>${agentInfo.name}</strong> — ${action}</span>
            <button id="closeResultPanel" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:1.1rem;">✕</button>
        </div>
        <div style="padding: 16px; overflow-y: auto; white-space: pre-wrap; line-height: 1.6;">${escHtml(result)}</div>
        <div style="padding: 10px 16px; background: #334155; display: flex; gap: 8px; justify-content: flex-end;">
            <button id="copyResult" style="padding: 6px 14px; border-radius: 6px; border: none; background: #2563eb; color: white; cursor: pointer; font-size: 0.8rem;">Copy</button>
            <button id="applyResult" style="padding: 6px 14px; border-radius: 6px; border: none; background: #059669; color: white; cursor: pointer; font-size: 0.8rem;">Apply to selection</button>
        </div>
    `;

    document.body.appendChild(panel);

    document.getElementById('closeResultPanel').addEventListener('click', () => panel.remove());
    document.getElementById('copyResult').addEventListener('click', () => {
        navigator.clipboard.writeText(result);
        showNotification('Copied to clipboard', 'success');
    });
    document.getElementById('applyResult').addEventListener('click', () => {
        if (state.selectedRange) {
            state.selectedRange.deleteContents();
            state.selectedRange.insertNode(document.createTextNode(result));
        }
        panel.remove();
        showNotification('Applied to selection', 'success');
    });
}

// ── View ──────────────────────────────────────────────────────────────────────
function switchView(view) {
    state.currentView = view;
    document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    document.getElementById('editView').classList.toggle('active', view === 'edit');
    document.getElementById('previewView').classList.toggle('active', view === 'preview');
    if (view === 'preview') renderPreview();
}

function renderPreview() {
    const html = state.sections.map(sec => {
        const el = document.querySelector(`.section-editor[data-id="${sec.id}"]`);
        const content = el ? el.innerHTML : sec.content;
        const tag = sec.level === 'part' ? 'h1' : sec.level === 'scene' ? 'h3' : 'h2';
        return `<section class="preview-section level-${sec.level}">
            <${tag} class="preview-section-title">${escHtml(sec.title)}</${tag}>
            <div class="preview-section-body">${content}</div>
        </section>`;
    }).join('');
    document.getElementById('previewContent').innerHTML = html;
}

// ── Save ──────────────────────────────────────────────────────────────────────
let saveTimer;
function triggerSave() {
    const el = document.querySelector('.save-status');
    if (el) el.textContent = '⏳ Saving…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { if (el) el.textContent = '💾 Saved'; }, 900);
}

// ── Mode description ──────────────────────────────────────────────────────────
function updateModeDescription() {
    const d = {
        word:      'Double-click a word for synonyms, definitions, and translations.',
        sentence:  'Select a sentence for rephrasing and grammar checks.',
        paragraph: 'Select a paragraph to improve flow, restructure, or adjust tone.',
        section:   'Use the 🤖 button on a section header for section-level AI.',
        document:  'Use AI for full document analysis and consistency checks.'
    };
    document.getElementById('modeDescription').textContent = d[state.selectionMode] || '';
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function initDashboard() {
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
            const hints = { manual: 'You trigger all AI actions.', assisted: 'AI proactively offers suggestions.', automatic: 'AI processes changes automatically.' };
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
            const hints = { silent: 'Results only — no agent activity shown.', collaborative: 'All agents visible, full activity shown.', educational: 'Agents explain their reasoning.', expert: 'Minimal intervention, brief log.' };
            document.getElementById('interactionHint').textContent = hints[state.interactionMode];
        });
    });
}

function renderAgentRoster() {
    document.getElementById('agentRoster').innerHTML = Object.entries(aiAgents).map(([key, a]) => `
        <div class="roster-agent" id="roster-${key}">
            <span class="agent-status-dot idle" id="dot-${key}"></span>
            <span class="roster-agent-icon">${a.icon}</span>
            <div class="roster-agent-info">
                <div class="roster-agent-name">${a.name}</div>
                <div class="roster-agent-status" id="status-${key}">Idle</div>
            </div>
        </div>
    `).join('');
}

function setAgentStatus(key, status, msg) {
    const row = document.getElementById(`roster-${key}`);
    const dot = document.getElementById(`dot-${key}`);
    const st  = document.getElementById(`status-${key}`);
    if (!row) return;
    row.className = `roster-agent ${status !== 'idle' ? status : ''}`;
    dot.className = `agent-status-dot ${status}`;
    st.textContent = msg || status.charAt(0).toUpperCase() + status.slice(1);
}

function addLogEntry(agentKey, message, isEdu = false) {
    if (state.interactionMode === 'silent') return;
    const log = document.getElementById('activityLog');
    const empty = log.querySelector('.log-empty');
    if (empty) empty.remove();
    const now = new Date().toTimeString().slice(0, 5);
    const a = aiAgents[agentKey];
    const entry = document.createElement('div');
    entry.className = `log-entry${isEdu ? ' educational' : ''}`;
    entry.innerHTML = `<span class="log-time">${now}</span><div class="log-body"><span class="log-agent">${a.icon} ${a.name}</span><div class="log-message">${message}</div></div>`;
    log.insertBefore(entry, log.firstChild);
    while (log.children.length > 10) log.removeChild(log.lastChild);
}

function animateAgents(action, primaryKey, supportKeys) {
    const start = Date.now();
    const showFull = state.interactionMode !== 'silent' && state.interactionMode !== 'expert';
    setAgentStatus('orchestrator', 'working', 'Routing…');
    addLogEntry('orchestrator', `Routing: <em>${action}</em>`);
    setTimeout(() => {
        setAgentStatus('orchestrator', 'done', 'Routed');
        setAgentStatus(primaryKey, 'working', 'Processing…');
        addLogEntry(primaryKey, 'Processing your selection…');
        if (state.interactionMode === 'educational' && educationalNotes[action]) {
            setTimeout(() => addLogEntry(primaryKey, educationalNotes[action], true), 300);
        }
        if (showFull && supportKeys.length) {
            supportKeys.forEach((k, i) => setTimeout(() => {
                setAgentStatus(k, 'queued', 'Queued');
                setTimeout(() => { setAgentStatus(k, 'working', 'Supporting…'); addLogEntry(k, 'Providing supporting analysis…'); }, 300);
            }, i * 200));
        }
        const fin = showFull && supportKeys.length ? 1200 + supportKeys.length * 200 : 800;
        setTimeout(() => {
            setAgentStatus(primaryKey, 'done', 'Done');
            supportKeys.forEach(k => setAgentStatus(k, 'done', 'Done'));
            updateMetrics(Date.now() - start);
            addLogEntry(primaryKey, 'Suggestion ready.');
            setTimeout(() => {
                ['orchestrator', primaryKey, ...supportKeys].forEach(k => setAgentStatus(k, 'idle', 'Idle'));
            }, 1500);
        }, fin);
    }, 500);
}

function updateMetrics(ms) {
    state.metrics.requests++;
    state.metrics.responseTimes.push(ms);
    document.getElementById('metricRequests').textContent = state.metrics.requests;
    const avg = state.metrics.responseTimes.reduce((a, b) => a + b, 0) / state.metrics.responseTimes.length;
    document.getElementById('metricResponseTime').textContent = (avg / 1000).toFixed(1) + 's';
}

function recordAccepted() {
    state.metrics.accepted++;
    const pct = Math.round((state.metrics.accepted / state.metrics.requests) * 100);
    document.getElementById('metricAccepted').textContent = `${state.metrics.accepted} (${pct}%)`;
}

// ── Notification ──────────────────────────────────────────────────────────────
function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.style.cssText = `position:fixed;top:80px;right:20px;background:${type==='success'?'#10b981':'#2563eb'};color:white;padding:.875rem 1.25rem;border-radius:.5rem;box-shadow:0 10px 15px -3px rgba(0,0,0,.1);z-index:2000;animation:slideIn .3s ease-out;max-width:380px;font-size:.875rem;`;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => { n.style.animation = 'slideOut .3s ease-out'; setTimeout(() => n.remove(), 300); }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn  { from { transform:translateX(400px);opacity:0; } to { transform:translateX(0);opacity:1; } }
    @keyframes slideOut { from { transform:translateX(0);opacity:1; } to { transform:translateX(400px);opacity:0; } }
`;
document.head.appendChild(style);
