# AI-Powered Writing Platform - Demos

This directory contains interactive demos and prototypes for the AI-Powered Writing Platform.

## 📁 Demo Files

### Interactive Demos

#### 1. **writing-app-v2.html** (Enhanced Version) ✨ NEW
The latest and most advanced demo featuring:
- **Granular Text Selection**: Select text at 5 different levels
  - Word level: Double-click for synonyms, definitions, translations
  - Sentence level: Click for rephrasing, simplification, grammar checks
  - Paragraph level: Select for flow improvements, restructuring, tone adjustments
  - Section level: Multi-paragraph selection for summaries and outlines
  - Document level: Full document analysis and optimization
- **Contextual AI Menu**: Right-click or select text to see relevant AI suggestions
- **11 Specialized AI Agents**: Each with specific expertise
- **Real-time Collaboration**: Simulated multi-user editing
- **Document Analytics**: Word count, reading time, and statistics
- **Modern UI**: Clean, professional interface inspired by Overleaf

**Files**: `writing-app-v2.html`, `writing-app-v2.css`, `writing-app-v2.js`

#### 2. **writing-app.html** (Original Version)
The original prototype demonstrating core features:
- Rich text editing
- Basic AI assistance
- Document management
- Export capabilities
- Collaborative features

**Files**: `writing-app.html`, `writing-app.css`, `writing-app.js`

### Documentation

#### 3. **docs-viewer.html**
Interactive documentation browser for exploring design documents:
- System architecture
- Technical specifications
- AI integration details
- Implementation guides

**Files**: `docs-viewer.html`, `docs-viewer.css`, `docs-viewer.js`

#### 4. **index.html**
Main hub page for accessing all demos and documentation.

## 🚀 Getting Started

### Quick Start
1. Open `index.html` in your web browser
2. Choose a demo to explore
3. For the enhanced writing app, try different selection modes

### Using the Enhanced Writing App (V2)

#### Selection Modes
Use the dropdown in the top navigation to switch between selection granularities:

1. **Word Mode**
   - Double-click any word
   - Get synonyms, definitions, translations
   - Perfect for vocabulary enhancement

2. **Sentence Mode** (Default)
   - Click to select a sentence
   - Rephrase, simplify, or expand
   - Check grammar and clarity

3. **Paragraph Mode**
   - Select entire paragraphs
   - Improve flow and coherence
   - Restructure or adjust tone

4. **Section Mode**
   - Select multiple paragraphs
   - Generate summaries and outlines
   - Add citations and references

5. **Document Mode**
   - Select all content (Ctrl/Cmd+A)
   - Comprehensive analysis
   - Consistency and accessibility checks

#### AI Assistance Menu
- **Automatic**: Appears after text selection
- **Manual**: Right-click on selected text
- **Context-Aware**: Shows relevant options based on selection granularity
- **Agent-Specific**: Each action is handled by a specialized AI agent

#### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Save document
- `Ctrl/Cmd + E`: Switch to edit view
- `Ctrl/Cmd + P`: Switch to preview view
- `Escape`: Close AI menu
- `Ctrl/Cmd + A`: Select all (document mode)

## 🎯 Key Features Demonstrated

### Multi-Agent AI System
The platform uses 11 specialized AI agents:

1. **🎯 Orchestrator**: Coordinates all agents and manages workflow
2. **🔍 Research Agent**: Finds and verifies information
3. **✏️ Editorial Agent**: Improves clarity and structure
4. **🎨 Creative Agent**: Enhances creativity and style
5. **🎓 Academic Agent**: Ensures academic rigor
6. **⚙️ Technical Agent**: Handles technical accuracy
7. **📖 Narrative Agent**: Develops story and flow
8. **✓ Fact-Checker**: Verifies facts and citations
9. **♿ Accessibility Agent**: Ensures content accessibility
10. **🔎 Proofreader**: Catches grammar and spelling errors
11. **💼 Business Agent**: Optimizes for business communication

### Collaborative Features
- Real-time editing simulation
- User presence indicators
- Document statistics
- Auto-save functionality

### Document Management
- Word count and character count
- Paragraph count
- Reading time estimation
- Export options (simulated)

## 🏗️ Architecture

### Technology Stack (Simulated)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Real Implementation Would Use**:
  - React/Vue.js for UI
  - Yjs for CRDT-based collaboration
  - WebSocket for real-time sync
  - Monaco Editor or similar for advanced editing

### File Structure
```
demo/
├── index.html              # Main hub page
├── README.md              # This file
│
├── writing-app-v2.html    # Enhanced writing app (NEW)
├── writing-app-v2.css     # Styles for enhanced app
├── writing-app-v2.js      # Logic for enhanced app
│
├── writing-app.html       # Original writing app
├── writing-app.css        # Styles for original app
├── writing-app.js         # Logic for original app
│
├── docs-viewer.html       # Documentation browser
├── docs-viewer.css        # Styles for docs viewer
└── docs-viewer.js         # Logic for docs viewer
```

## 🎨 Design Principles

### User Experience
- **Intuitive**: Natural text selection and interaction
- **Contextual**: AI suggestions based on selection type
- **Non-intrusive**: AI menu appears only when needed
- **Responsive**: Works on desktop and tablet devices

### Visual Design
- **Clean**: Minimal, distraction-free interface
- **Professional**: Inspired by Overleaf and modern editors
- **Accessible**: High contrast, clear typography
- **Consistent**: Unified color scheme and spacing

## 🔄 Comparison: V1 vs V2

| Feature | Original (V1) | Enhanced (V2) |
|---------|--------------|---------------|
| Text Selection | Basic | 5 granularity levels |
| AI Menu | Fixed buttons | Contextual pulldown |
| AI Agents | Single | 11 specialized agents |
| Selection Info | None | Real-time display |
| Mode Switching | No | Yes (word/sentence/paragraph/section/document) |
| Visual Feedback | Basic | Enhanced with mode-specific highlighting |
| Documentation | Integrated | Separate viewer |

## 📝 Notes

### Limitations
These are **frontend-only demos** that simulate AI functionality. A production implementation would require:
- Backend API for AI processing
- Real-time collaboration server
- Database for document storage
- Authentication system
- Cloud infrastructure

### Future Enhancements
- Multimedia integration demo
- Template gallery
- Real-time collaboration with multiple users
- Advanced export options
- Version history visualization

## 🤝 Contributing

This is a demonstration project. For the full design documentation, see the `docs/design/` directory.

## 📚 Related Documentation

- [System Overview](../docs/design/01-system-overview.md)
- [Architecture Diagram](../docs/design/02-architecture-diagram.md)
- [AI Integration](../docs/design/05-ai-integration.md)
- [Multi-Agent System](../docs/design/05b-multi-agent-ai-system.md)
- [Collaborative Editing](../docs/design/04-collaborative-editing.md)

## 🎓 Learning Resources

### Understanding the Technology
- **CRDT**: Conflict-free Replicated Data Types for real-time collaboration
- **WebSocket**: Bidirectional communication for live updates
- **AI Agents**: Specialized models for different writing tasks
- **Microservices**: Scalable architecture for production systems

### Best Practices Demonstrated
- Separation of concerns (HTML/CSS/JS)
- Event-driven architecture
- State management
- User feedback and notifications
- Keyboard shortcuts for power users

## 🐛 Known Issues

- Text selection highlighting may vary across browsers
- AI menu positioning needs adjustment on small screens
- Preview mode doesn't preserve all formatting
- No actual AI processing (simulated responses)

## 📞 Support

For questions or feedback about the design and demos, please refer to the main project documentation.

---

**Last Updated**: 2026-04-05  
**Version**: 2.0 (Enhanced with granular selection)