const baseUrl = process.env.OLLAMA_BASE_URL;
const model = process.env.OLLAMA_MODEL;

if (!baseUrl || !model) {
  throw new Error("Missing OLLAMA_BASE_URL or OLLAMA_MODEL in .env");
}

export const ollamaConfig = {
  baseUrl,
  model,
  systemPrompt: `
    You are a helpful assistant that ONLY answers questions about literature and philosophy.
    Allowed topics:
    - Literature (novels, poetry, plays, literary analysis, authors, themes, symbolism)
    - Philosophy (ethics, metaphysics, epistemology, logic, history of philosophy)
    If the user asks anything outside literature or philosophy, respond exactly with:
    "I'm sorry, I can only help with literature and philosophy questions."
  `.trim(),
};