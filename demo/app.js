// Configuration
const DOCS_PATH = '../docs/design/';
const DOCS = [
    '00-design-summary',
    '01-system-overview',
    '02-architecture-diagram',
    '03-user-management',
    '04-collaborative-editing',
    '05-ai-integration',
    '05a-ai-writing-lifecycle',
    '05b-multi-agent-ai-system',
    '05c-ai-integration-guide',
    '06-multimedia-system',
    '07-document-system',
    'POLISH-PLAN'
];

// State
let currentDoc = '00-design-summary';
let darkMode = localStorage.getItem('darkMode') === 'true';
let tocVisible = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Apply dark mode
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }

    // Initialize Mermaid
    mermaid.initialize({
        startOnLoad: true,
        theme: darkMode ? 'dark' : 'default'
    });

    // Setup event listeners
    setupEventListeners();

    // Load initial document
    loadDocument(currentDoc);

    // Show quick info modal on first visit
    if (!localStorage.getItem('visitedBefore')) {
        showQuickInfoModal();
        localStorage.setItem('visitedBefore', 'true');
    }
}

function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const docName = link.dataset.doc;
            loadDocument(docName);

            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // TOC toggle
    document.getElementById('tocToggle').addEventListener('click', toggleTOC);
    document.getElementById('tocClose').addEventListener('click', toggleTOC);

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Navigation buttons
    document.getElementById('prevDoc').addEventListener('click', navigatePrev);
    document.getElementById('nextDoc').addEventListener('click', navigateNext);

    // Print button
    document.getElementById('printBtn').addEventListener('click', () => window.print());

    // Share button
    document.getElementById('shareBtn').addEventListener('click', handleShare);

    // Modal
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close modal on outside click
    document.getElementById('quickInfoModal').addEventListener('click', (e) => {
        if (e.target.id === 'quickInfoModal') {
            closeModal();
        }
    });
}

async function loadDocument(docName) {
    currentDoc = docName;
    const contentDiv = document.getElementById('documentContent');

    // Show loading
    contentDiv.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading documentation...</p>
        </div>
    `;

    try {
        // Fetch markdown file
        const response = await fetch(`${DOCS_PATH}${docName}.md`);
        if (!response.ok) throw new Error('Document not found');

        const markdown = await response.text();

        // Convert markdown to HTML
        const html = marked.parse(markdown);
        contentDiv.innerHTML = html;

        // Render Mermaid diagrams
        await renderMermaidDiagrams();

        // Generate TOC
        generateTOC();

        // Update breadcrumb
        updateBreadcrumb(docName);

        // Update navigation buttons
        updateNavigationButtons();

        // Scroll to top
        contentDiv.scrollTop = 0;

        // Update URL
        window.history.pushState({ doc: docName }, '', `#${docName}`);

    } catch (error) {
        contentDiv.innerHTML = `
            <div class="error">
                <h2>⚠️ Error Loading Document</h2>
                <p>Could not load ${docName}.md</p>
                <p>Error: ${error.message}</p>
                <button onclick="loadDocument('00-design-summary')" class="btn-primary">
                    Return to Home
                </button>
            </div>
        `;
    }
}

async function renderMermaidDiagrams() {
    const codeBlocks = document.querySelectorAll('pre code.language-mermaid');

    for (const block of codeBlocks) {
        const code = block.textContent;
        const pre = block.parentElement;

        try {
            const { svg } = await mermaid.render(`mermaid-${Date.now()}`, code);
            const div = document.createElement('div');
            div.className = 'mermaid';
            div.innerHTML = svg;
            pre.replaceWith(div);
        } catch (error) {
            console.error('Mermaid rendering error:', error);
        }
    }
}

function generateTOC() {
    const contentDiv = document.getElementById('documentContent');
    const headings = contentDiv.querySelectorAll('h1, h2, h3');
    const tocContent = document.getElementById('tocContent');

    if (headings.length === 0) {
        tocContent.innerHTML = '<p style="padding: 1rem; color: var(--text-secondary);">No headings found</p>';
        return;
    }

    let tocHTML = '<ul>';
    headings.forEach((heading, index) => {
        const level = heading.tagName.toLowerCase();
        const text = heading.textContent;
        const id = `heading-${index}`;
        heading.id = id;

        const indent = level === 'h1' ? 0 : level === 'h2' ? 1 : 2;
        tocHTML += `
            <li style="margin-left: ${indent * 1}rem;">
                <a href="#${id}" onclick="scrollToHeading('${id}'); return false;">
                    ${text}
                </a>
            </li>
        `;
    });
    tocHTML += '</ul>';

    tocContent.innerHTML = tocHTML;
}

function scrollToHeading(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateBreadcrumb(docName) {
    const breadcrumb = document.getElementById('breadcrumb');
    const docTitle = docName.replace(/-/g, ' ').replace(/^\d+[a-z]?-/, '');
    breadcrumb.innerHTML = `
        <span>Home</span>
        <span>›</span>
        <span>${docTitle}</span>
    `;
}

function updateNavigationButtons() {
    const currentIndex = DOCS.indexOf(currentDoc);
    const prevBtn = document.getElementById('prevDoc');
    const nextBtn = document.getElementById('nextDoc');

    // Previous button
    if (currentIndex > 0) {
        prevBtn.disabled = false;
        const prevDoc = DOCS[currentIndex - 1];
        prevBtn.querySelector('span').textContent = `← ${getDocTitle(prevDoc)}`;
    } else {
        prevBtn.disabled = true;
    }

    // Next button
    if (currentIndex < DOCS.length - 1) {
        nextBtn.disabled = false;
        const nextDoc = DOCS[currentIndex + 1];
        nextBtn.querySelector('span').textContent = `${getDocTitle(nextDoc)} →`;
    } else {
        nextBtn.disabled = true;
    }
}

function getDocTitle(docName) {
    return docName.replace(/-/g, ' ').replace(/^\d+[a-z]?-/, '');
}

function navigatePrev() {
    const currentIndex = DOCS.indexOf(currentDoc);
    if (currentIndex > 0) {
        const prevDoc = DOCS[currentIndex - 1];
        loadDocument(prevDoc);
        updateActiveNavLink(prevDoc);
    }
}

function navigateNext() {
    const currentIndex = DOCS.indexOf(currentDoc);
    if (currentIndex < DOCS.length - 1) {
        const nextDoc = DOCS[currentIndex + 1];
        loadDocument(nextDoc);
        updateActiveNavLink(nextDoc);
    }
}

function updateActiveNavLink(docName) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.doc === docName) {
            link.classList.add('active');
        }
    });
}

function toggleTheme() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkMode);

    // Update theme toggle icon
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.textContent = darkMode ? '☀️' : '🌙';

    // Reinitialize Mermaid with new theme
    mermaid.initialize({
        startOnLoad: true,
        theme: darkMode ? 'dark' : 'default'
    });

    // Re-render current document to update Mermaid diagrams
    loadDocument(currentDoc);
}

function toggleTOC() {
    tocVisible = !tocVisible;
    const tocSidebar = document.getElementById('tocSidebar');
    tocSidebar.classList.toggle('active');
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const docName = link.dataset.doc.toLowerCase();

        if (text.includes(query) || docName.includes(query)) {
            link.style.display = 'flex';
        } else {
            link.style.display = 'none';
        }
    });

    // Show all sections if search is empty
    if (query === '') {
        navLinks.forEach(link => link.style.display = 'flex');
    }
}

function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: 'AI-Powered Writing Platform Documentation',
            text: `Check out this documentation: ${currentDoc}`,
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text:', err);
        });
    }
}

function showQuickInfoModal() {
    const modal = document.getElementById('quickInfoModal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('quickInfoModal');
    modal.classList.remove('active');
}

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.doc) {
        loadDocument(e.state.doc);
        updateActiveNavLink(e.state.doc);
    }
});

// Handle initial hash
window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash && DOCS.includes(hash)) {
        loadDocument(hash);
        updateActiveNavLink(hash);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }

    // Ctrl/Cmd + T for TOC
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toggleTOC();
    }

    // Arrow keys for navigation
    if (e.altKey) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigatePrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateNext();
        }
    }
});

// Print styles
window.addEventListener('beforeprint', () => {
    document.querySelector('.sidebar').style.display = 'none';
    document.querySelector('.toc-sidebar').style.display = 'none';
    document.querySelector('.header').style.display = 'none';
    document.querySelector('.content-header').style.display = 'none';
    document.querySelector('.content-footer').style.display = 'none';
});

window.addEventListener('afterprint', () => {
    document.querySelector('.sidebar').style.display = 'flex';
    document.querySelector('.header').style.display = 'flex';
    document.querySelector('.content-header').style.display = 'flex';
    document.querySelector('.content-footer').style.display = 'flex';
});

// Made with Bob
