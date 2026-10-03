import React, { useState } from "react";
import { AIProviderConfig } from "@/types";
import { getStoredAIConfig, saveAIConfig } from "@/lib/ai/provider";
import { X, Settings, Key, ShieldCheck, Check, Sparkles } from "lucide-react";

interface SettingsModalProps {
  onClose: () => void;
  onSave?: (config: AIProviderConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSave }) => {
  const [config, setConfig] = useState<AIProviderConfig>(getStoredAIConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    saveAIConfig(config);
    setSavedSuccess(true);
    onSave?.(config);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">AI Provider Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Provider Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
              AI Provider Engine
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "demo", title: "Demo Mode", desc: "No API key needed (Instant)" },
                { id: "gemini", title: "Google Gemini", desc: "Gemini 1.5 / 2.0 API" },
                { id: "openai", title: "OpenAI", desc: "GPT-4o / GPT-4o-mini" },
                { id: "anthropic", title: "Anthropic", desc: "Claude 3.5 Sonnet" }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setConfig({ ...config, provider: p.id as any })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    config.provider === p.id
                      ? "bg-blue-950/80 border-blue-500 text-blue-200"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="font-semibold text-xs text-white">{p.title}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* API Key Input if not Demo */}
          {config.provider !== "demo" && (
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-400" />
                  <span>{config.provider.toUpperCase()} API Key</span>
                </label>
                <span className="text-[10px] text-slate-500">Stored locally in browser</span>
              </div>
              <input
                type="password"
                value={config.apiKey || ""}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder={`Paste your ${config.provider} API key here...`}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          )}

          {/* Source Grounding Mode Toggle */}
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Source-Grounded Mode</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Restricts AI generations strictly to uploaded document context.
              </p>
            </div>
            <input
              type="checkbox"
              checked={config.groundedMode}
              onChange={(e) => setConfig({ ...config, groundedMode: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Footer Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-all shadow-lg"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
              <span>{savedSuccess ? "Saved!" : "Save Configuration"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
