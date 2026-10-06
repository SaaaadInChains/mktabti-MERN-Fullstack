import { useState, useRef, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { Send, Loader2, Bot, User } from "lucide-react";

import UserNavbar from "../../components/users/UserNavbar";
import api from "../../services/api";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function ChattingRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Add user message
    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/chatbot", { prompt: trimmed });
      const reply = response.data.reply || "No response from assistant.";

      const assistantMessage: Message = {
        role: "assistant",
        content: reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Chatbot error:", err);
      const errorMsg =
        err?.response?.data?.message ||
        "Failed to get a response. Please try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--gruvbox-background)]">
      <UserNavbar />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto px-3 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="py-16 text-center">
                <Bot size={48} className="mx-auto text-[var(--gruvbox-gray)]" />
                <h2 className="mt-4 text-xl font-bold text-[var(--gruvbox-cream)]">
                  Ask me about literature & philosophy
                </h2>
                <p className="mt-2 text-sm text-[var(--gruvbox-gray)]">
                  Example: "What is existentialism?" or "Tell me about Albert Camus"
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[var(--gruvbox-yellow)] text-[var(--gruvbox-background)] rounded-br-md"
                      : "bg-[var(--gruvbox-paper)] text-[var(--gruvbox-cream)] border border-[var(--gruvbox-surface)] rounded-bl-md"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {msg.role === "user" ? (
                      <User size={16} className="mt-0.5 shrink-0" />
                    ) : (
                      <Bot size={16} className="mt-0.5 shrink-0 text-[var(--gruvbox-aqua)]" />
                    )}
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-[var(--gruvbox-paper)] border border-[var(--gruvbox-surface)] px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-[var(--gruvbox-aqua)]" />
                </div>
              </div>
            )}

            {error && (
              <div className="mx-auto max-w-3xl rounded-xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 px-4 py-3 text-sm text-[var(--gruvbox-red)]">
                {error}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input form */}
        <div className="border-t border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background)] p-3 sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-3xl items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] px-4 py-2.5 text-sm text-[var(--gruvbox-cream)] outline-none placeholder:text-[var(--gruvbox-gray)] transition-all duration-200 focus:border-[var(--gruvbox-yellow)] focus:ring-2 focus:ring-[var(--gruvbox-yellow)]/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gruvbox-yellow)] text-[var(--gruvbox-background)] transition-all duration-200 hover:bg-[var(--gruvbox-orange)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ChattingRoom;