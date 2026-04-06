import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { callAgent } from './agents/openai.js';
import { getPrompt } from './agents/prompts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Serve frontend (demo/) ──────────────────────────────────────────────────────
app.use(express.static(join(__dirname, '../demo')));

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', key: process.env.OPENAI_API_KEY ? 'set' : 'missing' });
});

// ── Main agent endpoint ────────────────────────────────────────────────────────
// POST /api/agent
// Body: { action: string, text: string, instruction?: string, tone?: string }
// Returns: { result: string }
app.post('/api/agent', async (req, res) => {
    const { action, text, instruction, tone } = req.body;

    if (!action || !text) {
        return res.status(400).json({ error: 'action and text are required' });
    }

    const systemPrompt = getPrompt(action);

    // Some actions accept extra context appended after a delimiter
    let userContent = text;
    if (action === 'tone' && tone) {
        userContent = `${text} || ${tone}`;
    } else if (action === 'custom' && instruction) {
        userContent = `${text} || ${instruction}`;
    }

    try {
        const result = await callAgent(systemPrompt, userContent);
        res.json({ result });
    } catch (err) {
        console.error(`[agent:${action}]`, err.message);
        const status = err.status ?? 500;
        res.status(status).json({ error: err.message });
    }
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n✓ AI Writing Platform Server`);
    console.log(`  Frontend: http://localhost:${PORT}`);
    console.log(`  API: http://localhost:${PORT}/api/agent`);
    console.log(`  OpenAI key: ${process.env.OPENAI_API_KEY ? '✓ detected' : '✗ MISSING — set OPENAI_API_KEY in .env'}\n`);
});
