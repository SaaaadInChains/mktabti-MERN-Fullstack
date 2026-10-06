import { Ollama } from "ollama";
import { type Request, type Response } from "express";
import { ollamaConfig } from "../config/ollamaConfig.js";

const ollama = new Ollama({
  host: ollamaConfig.baseUrl,
});

export const ollamaController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ message: "Please provide a prompt" });
      return;
    }

    const messages = [
      { role: "system", content: ollamaConfig.systemPrompt },
      { role: "user", content: prompt },
    ];

    const response = await ollama.chat({
      model: ollamaConfig.model,
      messages,
      stream: false,
    });

    const reply = response.message?.content ?? "";

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Error in chatbot:", error);

    if (error?.cause?.code === "ECONNREFUSED") {
      res.status(503).json({ message: "Ollama server is not running" });
      return;
    }
    if (error?.status_code === 404) {
      res.status(404).json({ message: "Model not found on Ollama server" });
      return;
    }

    res.status(500).json({ message: "Server error while processing chat" });
  }
};