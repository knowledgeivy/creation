import OpenAI from 'openai';

let _client = null;

function getClient() {
    if (!_client) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set in .env');
        }
        _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return _client;
}

/**
 * Call the OpenAI chat completions API.
 * @param {string} systemPrompt  - The agent's system-level instructions.
 * @param {string} userContent   - The selected text to operate on.
 * @param {object} [options]
 * @param {string} [options.model='gpt-4o-mini']
 * @param {number} [options.maxTokens=512]
 * @returns {Promise<string>} The assistant's reply text.
 */
export async function callAgent(systemPrompt, userContent, options = {}) {
    const client = getClient();
    const { model = 'gpt-4o-mini', maxTokens = 512 } = options;

    const response = await client.chat.completions.create({
        model,
        max_tokens: maxTokens,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userContent }
        ]
    });

    return response.choices[0].message.content.trim();
}
