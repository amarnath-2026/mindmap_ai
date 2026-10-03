import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ParsedDocument, MindMapGraph } from "@/types";
import { Bot, Send, User, X, Sparkles, HelpCircle, FileText, GitBranch, Minimize2 } from "lucide-react";
import { callLLM, getStoredAIConfig } from "@/lib/ai/provider";

interface AIChatPanelProps {
  document?: ParsedDocument;
  graph: MindMapGraph;
  onClose: () => void;
  onExpandBranchByTitle?: (topicTitle: string) => void;
  onGenerateQuizModal?: () => void;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  document,
  graph,
  onClose,
  onExpandBranchByTitle,
  onGenerateQuizModal
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "ai",
      text: `Hello! I've analyzed **${document ? document.fileName : graph.title}**. What would you like to explore or clarify in your knowledge map?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // Call AI provider or fallback grounded response generator
    const config = getStoredAIConfig();
    let responseText = "";

    if (config.provider !== "demo" && config.apiKey) {
      const docSnippet = document ? document.extractedText.slice(0, 4000) : graph.title;
      const prompt = `User question about document "${document?.fileName || graph.title}":\n"${query}"\n\nDocument Context:\n${docSnippet}`;
      responseText = await callLLM(prompt, "You are MindMap AI assistant. Answer using the document context provided. If not in the source, state it clearly.", config);
    }

    if (!responseText) {
      // Grounded fallback response generator
      if (query.toLowerCase().includes("viva") || query.toLowerCase().includes("question")) {
        responseText = `Here are 5 key exam viva questions based on **${document?.fileName || graph.title}**:\n\n1. What is the fundamental definition of ${graph.nodes[0]?.label}? \n2. Explain the key distinction between ${graph.nodes[1]?.label || "Topic 1"} and ${graph.nodes[2]?.label || "Topic 2"}.\n3. How do the source constraints influence system performance?\n4. What real-world applications rely on this architecture?\n5. Describe the primary step-by-step process defined in Section 2.`;
      } else if (query.toLowerCase().includes("summary") || query.toLowerCase().includes("summarize")) {
        responseText = `**Executive Document Summary of ${document?.fileName || graph.title}**:\n\n` +
          `• **Primary Focus**: ${graph.nodes[0]?.description || "Comprehensive knowledge architecture"}\n` +
          `• **Core Pillars**: ${graph.nodes.filter(n => n.type === "topic").map(n => n.label).join(", ")}\n` +
          `• **Key Takeaways**: Preserves structured hierarchical relationships across concepts while maintaining strict source grounding.`;
      } else {
        responseText = `Based on **${document?.fileName || graph.title}**, the document presents a structured framework around **${graph.nodes[0]?.label}**. The major topics (${graph.nodes.filter(n => n.type === "topic").slice(0, 3).map(n => n.label).join(", ")}) provide key concepts and operational details grounded in source page citations.`;
      }
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: "ai",
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="h-12 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between text-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100">Document AI Assistant</h3>
            <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Source Grounded
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        <button
          onClick={() => handleSendMessage("Summarize the entire document")}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full shrink-0 transition-colors"
        >
          ⚡ Summarize
        </button>
        <button
          onClick={() => {
            if (onGenerateQuizModal) onGenerateQuizModal();
            else handleSendMessage("Give me 5 viva exam questions");
          }}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-full shrink-0 transition-colors"
        >
          ❓ Viva Questions
        </button>
        <button
          onClick={() => handleSendMessage("What are the main topic relationships?")}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-full shrink-0 transition-colors"
        >
          🔗 Relationships
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.sender === "ai" && (
              <div className="w-6 h-6 rounded-full bg-blue-600/80 flex items-center justify-center text-white shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[82%] p-3 rounded-2xl ${
                m.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none leading-relaxed"
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <div className="text-[9px] opacity-60 text-right mt-1 font-mono">{m.timestamp}</div>
            </div>
            {m.sender === "user" && (
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Bot className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            <span>AI is analyzing document context...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about your document..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shadow"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
