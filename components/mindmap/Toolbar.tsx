import React, { useState } from "react";
import {
  MindMapGraph,
  LayoutDirection,
  ThemeMode,
  GenerationDepth,
  RegenerationMode,
  ParsedDocument
} from "@/types";
import {
  Brain,
  Search,
  Download,
  LayoutGrid,
  Palette,
  ArrowLeft,
  RotateCcw,
  Bot,
  Check,
  Maximize2
} from "lucide-react";

interface ToolbarProps {
  graph: MindMapGraph;
  currentDoc?: ParsedDocument;
  layoutDirection: LayoutDirection;
  theme: ThemeMode;
  depth: GenerationDepth;
  mode: RegenerationMode;
  onBack: () => void;
  onSearch: (query: string) => void;
  onLayoutChange: (layout: LayoutDirection) => void;
  onThemeChange: (theme: ThemeMode) => void;
  onDepthChange: (depth: GenerationDepth) => void;
  onRegenerate: (mode: RegenerationMode) => void;
  onOpenExportModal: () => void;
  onToggleAIChat: () => void;
  onFitView: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  graph,
  currentDoc,
  layoutDirection,
  theme,
  depth,
  mode,
  onBack,
  onSearch,
  onLayoutChange,
  onThemeChange,
  onDepthChange,
  onRegenerate,
  onOpenExportModal,
  onToggleAIChat,
  onFitView
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegenMenu, setShowRegenMenu] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    onSearch(q);
  };

  const isLight = theme === "light_academic";

  return (
    <header className={`h-14 px-4 flex items-center justify-between gap-3 backdrop-blur-md z-30 shrink-0 border-b transition-colors ${
      isLight
        ? "bg-white border-slate-200 text-slate-900 shadow-sm"
        : "bg-[#161922] border-slate-800 text-slate-200"
    }`}>
      {/* Left Branding & Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className={`p-1.5 rounded-lg transition-colors ${
            isLight
              ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className={`flex items-center gap-2 pr-3 border-r ${isLight ? "border-slate-200" : "border-slate-800"}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-md">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent leading-none">
              MindMap AI
            </h1>
            <span className={`text-[10px] font-mono truncate max-w-[130px] block ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {currentDoc ? currentDoc.fileName : graph.title}
            </span>
          </div>
        </div>

        {/* Generation Depth Selector */}
        <div className={`hidden lg:flex items-center gap-1 p-1 rounded-lg border text-xs ${
          isLight ? "bg-slate-100 border-slate-200" : "bg-slate-950 border-slate-800"
        }`}>
          <span className={`text-[10px] font-medium px-1.5 uppercase ${isLight ? "text-slate-500" : "text-slate-400"}`}>Depth:</span>
          {(["quick", "detailed", "deep"] as GenerationDepth[]).map((d) => (
            <button
              key={d}
              onClick={() => onDepthChange(d)}
              className={`px-2 py-0.5 rounded text-[11px] capitalize transition-colors ${
                depth === d
                  ? "bg-blue-600 text-white font-semibold shadow"
                  : isLight
                  ? "text-slate-700 hover:bg-slate-200"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-sm relative">
        <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? "text-slate-400" : "text-slate-400"}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search nodes or concepts..."
          className={`w-full border rounded-lg pl-8 pr-3 py-1.5 text-xs transition-colors focus:outline-none focus:border-blue-500 ${
            isLight
              ? "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
              : "bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500"
          }`}
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Layout Selector */}
        <div className="relative group">
          <select
            value={layoutDirection}
            onChange={(e) => onLayoutChange(e.target.value as LayoutDirection)}
            className={`border text-xs rounded-lg px-2.5 py-1.5 appearance-none pr-7 focus:outline-none focus:border-blue-500 cursor-pointer ${
              isLight
                ? "bg-slate-50 border-slate-300 text-slate-900"
                : "bg-slate-950 border-slate-800 text-slate-300"
            }`}
          >
            <option value="horizontal">Horizontal (LR)</option>
            <option value="vertical">Vertical (TB)</option>
            <option value="radial">Radial Circle</option>
            <option value="tree">Tree Hierarchy</option>
          </select>
          <LayoutGrid className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Theme Selector */}
        <div className="relative group">
          <select
            value={theme}
            onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
            className={`border text-xs rounded-lg px-2.5 py-1.5 appearance-none pr-7 focus:outline-none focus:border-blue-500 cursor-pointer ${
              isLight
                ? "bg-slate-50 border-slate-300 text-slate-900"
                : "bg-slate-950 border-slate-800 text-slate-300"
            }`}
          >
            <option value="dark_professional">Dark Professional</option>
            <option value="light_academic">Light Academic</option>
            <option value="midnight_ai">Midnight AI</option>
          </select>
          <Palette className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Regenerate Special Modes Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRegenMenu(!showRegenMenu)}
            className={`flex items-center gap-1.5 border text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
              isLight
                ? "bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100"
                : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden md:inline">Mode</span>
          </button>

          {showRegenMenu && (
            <div className={`absolute right-0 top-full mt-1.5 w-48 border rounded-xl shadow-2xl py-1 z-50 text-xs ${
              isLight ? "bg-white border-slate-200 text-slate-800" : "bg-slate-900 border-slate-800 text-slate-300"
            }`}>
              <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-semibold">
                Regenerate Map Mode
              </div>
              {[
                { id: "balanced", label: "Balanced Knowledge" },
                { id: "exam_revision", label: "Exam Revision Map" },
                { id: "presentation", label: "Presentation Mode" },
                { id: "research", label: "Deep Research Mode" }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onRegenerate(m.id as RegenerationMode);
                    setShowRegenMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center justify-between ${
                    mode === m.id ? "text-emerald-600 font-semibold" : ""
                  }`}
                >
                  {m.label}
                  {mode === m.id && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fit View Button */}
        <button
          onClick={onFitView}
          className={`p-1.5 border rounded-lg transition-colors ${
            isLight
              ? "bg-slate-50 border-slate-300 text-slate-600 hover:text-slate-900"
              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
          }`}
          title="Fit Canvas to Viewport"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Ask AI Assistant Floating Chat Toggle */}
        <button
          onClick={onToggleAIChat}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-md transition-all font-semibold"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-md transition-all font-semibold"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
