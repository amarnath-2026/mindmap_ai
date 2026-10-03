import React from "react";
import { Sparkles, Brain } from "lucide-react";

export const DemoPreview: React.FC = () => {
  return (
    <div className="relative w-full aspect-[16/10] max-w-xl mx-auto bg-[#161922] border border-slate-800 rounded-2xl p-5 shadow-2xl overflow-hidden group">
      {/* Soft Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="text-[10px] font-mono text-slate-400 ml-2">Interactive NotebookLM+ Knowledge Map</span>
        </div>
        <div className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">
          Interactive AI
        </div>
      </div>

      {/* Perfectly Spaced Mind Map Layout matching Image 2 without overflow */}
      <div className="relative z-10 flex items-center justify-between py-2 px-1">
        {/* Column 1: Root Node */}
        <div className="bg-[#373955] border border-[#4d5075] text-white text-[11px] font-bold px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 shrink-0">
          <span>Prompt Engineering</span>
          <span className="w-3.5 h-3.5 rounded-full bg-[#4d5075] text-slate-200 text-[8px] flex items-center justify-center font-bold">
            &lt;
          </span>
        </div>

        {/* Fanning Curves 1 */}
        <svg className="w-8 h-36 text-[#7b8cb8] stroke-current fill-none shrink-0" viewBox="0 0 30 140">
          <path d="M 0 70 C 15 70, 15 15, 30 15" strokeWidth="1.5" />
          <path d="M 0 70 C 15 70, 15 70, 30 70" strokeWidth="1.5" />
          <path d="M 0 70 C 15 70, 15 125, 30 125" strokeWidth="1.5" />
        </svg>

        {/* Column 2: Major Topics */}
        <div className="flex flex-col justify-between h-40 space-y-2 shrink-0">
          <div className="bg-[#282d3c] border border-[#3a4156] text-slate-100 text-[10px] font-semibold px-2.5 py-1.5 rounded-xl shadow-md flex items-center gap-1">
            <span>Introduction</span>
            <span className="w-3 h-3 rounded-full bg-[#3a4156] text-slate-300 text-[7px] flex items-center justify-center font-bold">
              &lt;
            </span>
          </div>

          <div className="bg-[#282d3c] border border-[#3a4156] text-slate-200 text-[10px] font-medium px-2.5 py-1.5 rounded-xl flex items-center gap-1 opacity-80">
            <span>LLM Output Config</span>
            <span className="text-[8px] text-slate-400 font-bold">&gt;</span>
          </div>

          <div className="bg-[#282d3c] border border-[#3a4156] text-slate-200 text-[10px] font-medium px-2.5 py-1.5 rounded-xl flex items-center gap-1 opacity-80">
            <span>Prompting Techniques</span>
            <span className="text-[8px] text-slate-400 font-bold">&gt;</span>
          </div>
        </div>

        {/* Fanning Curves 2 */}
        <svg className="w-6 h-28 text-[#6c7ba8] stroke-current fill-none shrink-0" viewBox="0 0 25 100">
          <path d="M 0 15 C 12 15, 12 10, 25 10" strokeWidth="1.5" />
          <path d="M 0 15 C 12 15, 12 50, 25 50" strokeWidth="1.5" />
          <path d="M 0 15 C 12 15, 12 90, 25 90" strokeWidth="1.5" />
        </svg>

        {/* Column 3: Concept Nodes (Properly sized and contained!) */}
        <div className="flex flex-col justify-between h-36 space-y-1.5 shrink-0 max-w-[150px]">
          <div className="bg-[#152720] border border-[#244237] text-emerald-100 text-[9px] font-medium px-2.5 py-1 rounded-lg shadow-sm truncate">
            LLM prediction engine
          </div>
          <div className="bg-[#152720] border border-[#244237] text-emerald-100 text-[9px] font-medium px-2.5 py-1 rounded-lg shadow-sm truncate">
            Prompt input guidance
          </div>
          <div className="bg-[#152720] border border-[#244237] text-emerald-100 text-[9px] font-medium px-2.5 py-1 rounded-lg shadow-sm truncate">
            Iterative prompt crafting
          </div>
        </div>
      </div>
    </div>
  );
};
