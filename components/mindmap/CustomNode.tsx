import React from "react";
import { Handle, Position } from "@xyflow/react";
import { MindMapNode, ThemeMode } from "@/types";
import { Sparkles, BookOpen } from "lucide-react";

interface CustomNodeProps {
  data: {
    node: MindMapNode;
    theme: ThemeMode;
    isSelected: boolean;
    isHighlighted: boolean;
    onToggleCollapse?: (nodeId: string) => void;
    onSelectNode?: (node: MindMapNode) => void;
  };
}

export const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  const { node, theme, isSelected, isHighlighted, onToggleCollapse, onSelectNode } = data;
  const isRoot = node.type === "root";
  const isTopic = node.type === "topic";
  const isSubtopic = node.type === "subtopic";
  const isConcept = node.type === "concept";

  const hasChildren = node.children && node.children.length > 0;
  const childCount = node.children ? node.children.length : 0;

  // Modern Light & Dark Mode Node Themes
  const getNodeColorClasses = () => {
    if (theme === "light_academic") {
      if (isRoot) {
        return "bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300/50";
      }
      if (isTopic) {
        return "bg-white text-slate-900 border-slate-300 shadow-sm hover:border-indigo-400 font-semibold";
      }
      if (isConcept || isSubtopic) {
        return "bg-emerald-50 text-emerald-950 border-emerald-300/80 shadow-sm hover:border-emerald-500 font-medium";
      }
      return "bg-slate-100 text-slate-800 border-slate-300";
    }

    if (theme === "midnight_ai") {
      if (isRoot) return "bg-black text-cyan-300 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
      if (isTopic) return "bg-gray-950 text-slate-100 border-indigo-500/60";
      if (isConcept) return "bg-emerald-950 text-emerald-200 border-emerald-500/60";
      return "bg-gray-900 text-slate-300 border-slate-800";
    }

    // Default: NotebookLM Dark Professional (Image 2 style)
    if (isRoot) {
      return "bg-[#373955] text-white border-[#4d5075] shadow-lg ring-1 ring-indigo-400/20";
    }
    if (isTopic) {
      return "bg-[#282d3c] text-slate-100 border-[#3a4156] hover:border-indigo-400/60 shadow-md";
    }
    if (isConcept || isSubtopic) {
      return "bg-[#152720] text-emerald-100 border-[#244237] hover:border-emerald-400 shadow-sm";
    }
    return "bg-[#18202e] text-slate-200 border-slate-700";
  };

  const sourceRef = node.sourceReferences && node.sourceReferences[0];
  const sourceLabel = sourceRef?.page
    ? `Page ${sourceRef.page}`
    : sourceRef?.slide
    ? `Slide ${sourceRef.slide}`
    : null;

  return (
    <div
      onClick={() => onSelectNode?.(node)}
      className={`relative group rounded-2xl transition-all duration-200 cursor-pointer select-none border flex items-center gap-2.5 ${
        isRoot
          ? "px-5 py-3 min-w-[200px]"
          : isTopic
          ? "px-4 py-2.5 min-w-[170px]"
          : "px-4 py-2.5 min-w-[160px] max-w-[320px]"
      } ${getNodeColorClasses()} ${
        isSelected ? "ring-2 ring-emerald-400 border-emerald-400 scale-[1.02]" : ""
      } ${
        isHighlighted ? "ring-2 ring-yellow-400 border-yellow-400 animate-pulse" : ""
      }`}
    >
      {/* Target Handle */}
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Left}
          className={`!w-2 !h-2 !border-0 !left-[-4px] ${
            theme === "light_academic" ? "!bg-indigo-500" : "!bg-indigo-400"
          }`}
        />
      )}

      {/* Main Label */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isRoot && <Sparkles className="w-4 h-4 text-indigo-300 shrink-0" />}
          <span
            className={`font-medium tracking-wide leading-snug break-words ${
              isRoot ? "text-sm text-white font-semibold" : isTopic ? "text-xs font-semibold" : "text-xs"
            }`}
          >
            {node.label}
          </span>
        </div>

        {node.description && !isRoot && (
          <p className={`text-[10px] line-clamp-1 mt-0.5 font-normal ${
            theme === "light_academic" ? "text-slate-600" : "text-slate-400/90"
          }`}>
            {node.description}
          </p>
        )}

        {sourceLabel && (
          <div className="mt-1 flex items-center gap-1 text-[9px] opacity-80">
            <BookOpen className="w-2.5 h-2.5 text-emerald-500" />
            <span>{sourceLabel}</span>
          </div>
        )}
      </div>

      {/* Branch Collapse Toggle Button */}
      {hasChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse?.(node.id);
          }}
          className={`w-5 h-5 rounded-full border transition-colors shrink-0 flex items-center justify-center text-[11px] font-bold ${
            theme === "light_academic"
              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
              : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-600/60"
          }`}
          title={node.collapsed ? `Expand ${childCount} branches` : "Collapse branch"}
        >
          {node.collapsed ? (
            <span className="text-emerald-500 text-[9px] font-mono">&gt;</span>
          ) : (
            <span className="text-[9px] font-mono">&lt;</span>
          )}
        </button>
      )}

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className={`!w-2 !h-2 !border-0 !right-[-4px] ${
          theme === "light_academic" ? "!bg-emerald-600" : "!bg-emerald-400"
        }`}
      />
    </div>
  );
};
