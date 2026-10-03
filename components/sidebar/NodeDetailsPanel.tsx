import React, { useState } from "react";
import { MindMapNode, ParsedDocument } from "@/types";
import {
  X,
  Sparkles,
  GitBranch,
  HelpCircle,
  BookOpen,
  Edit3,
  Trash2,
  Check,
  Zap,
  FileText,
  Lightbulb,
  CreditCard,
  Share2
} from "lucide-react";

interface NodeDetailsPanelProps {
  node: MindMapNode;
  document?: ParsedDocument;
  onClose: () => void;
  onExpandBranch: (node: MindMapNode) => void;
  onExplainNode: (node: MindMapNode) => void;
  onSimplifyNode: (node: MindMapNode) => void;
  onGenerateQuestions: (node: MindMapNode) => void;
  onGenerateFlashcards: (node: MindMapNode) => void;
  onUpdateNode: (nodeId: string, newLabel: string, newDesc: string) => void;
  onDeleteNode: (nodeId: string) => void;
}

export const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
  node,
  document,
  onClose,
  onExpandBranch,
  onExplainNode,
  onSimplifyNode,
  onGenerateQuestions,
  onGenerateFlashcards,
  onUpdateNode,
  onDeleteNode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(node.label);
  const [editDesc, setEditDesc] = useState(node.description || "");

  const handleSaveEdit = () => {
    onUpdateNode(node.id, editLabel, editDesc);
    setIsEditing(false);
  };

  const source = node.sourceReferences && node.sourceReferences[0];

  return (
    <aside className="w-80 bg-slate-900/95 border-l border-slate-800/80 shadow-2xl flex flex-col z-20 shrink-0 text-slate-200 backdrop-blur-md">
      {/* Panel Header */}
      <div className="h-12 border-b border-slate-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Node Details
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-blue-950 text-blue-400 border border-blue-800/60">
            {node.type}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Title & Description or Edit Form */}
        {isEditing ? (
          <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Label</label>
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Description</label>
              <textarea
                value={editDesc}
                rows={3}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 mt-1 resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 rounded text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-xs shadow"
              >
                <Check className="w-3 h-3" /> Save
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
            <h2 className="text-sm font-bold text-slate-100 leading-snug">{node.label}</h2>
            {node.description ? (
              <p className="text-slate-300 text-xs leading-relaxed">{node.description}</p>
            ) : (
              <p className="text-slate-500 italic text-xs">No description provided for this concept.</p>
            )}
          </div>
        )}

        {/* Source Grounding Reference */}
        {source && (
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Source Grounding</span>
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="font-semibold text-slate-200">{source.file}</span>
              {source.page && <span className="text-slate-400"> • Page {source.page}</span>}
              {source.slide && <span className="text-slate-400"> • Slide {source.slide}</span>}
            </div>
            {source.section && (
              <div className="text-[10px] text-slate-400 italic">
                Section: "{source.section}"
              </div>
            )}
          </div>
        )}

        {/* AI Actions */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>AI Node Intelligence</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onExpandBranch(node)}
              className="flex items-center gap-2 p-2.5 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/50 rounded-xl text-blue-300 hover:text-white transition-all text-left group"
            >
              <GitBranch className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
              <div>
                <div className="font-semibold text-xs">Expand</div>
                <div className="text-[9px] text-slate-400">Add sub-branches</div>
              </div>
            </button>

            <button
              onClick={() => onExplainNode(node)}
              className="flex items-center gap-2 p-2.5 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/50 rounded-xl text-indigo-300 hover:text-white transition-all text-left group"
            >
              <Lightbulb className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
              <div>
                <div className="font-semibold text-xs">Explain</div>
                <div className="text-[9px] text-slate-400">In-depth AI breakdown</div>
              </div>
            </button>

            <button
              onClick={() => onSimplifyNode(node)}
              className="flex items-center gap-2 p-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 rounded-xl text-emerald-300 hover:text-white transition-all text-left group"
            >
              <Zap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              <div>
                <div className="font-semibold text-xs">Simplify</div>
                <div className="text-[9px] text-slate-400">ELI5 explanation</div>
              </div>
            </button>

            <button
              onClick={() => onGenerateQuestions(node)}
              className="flex items-center gap-2 p-2.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 rounded-xl text-amber-300 hover:text-white transition-all text-left group"
            >
              <HelpCircle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
              <div>
                <div className="font-semibold text-xs">Quiz Me</div>
                <div className="text-[9px] text-slate-400">Generate questions</div>
              </div>
            </button>
          </div>

          <button
            onClick={() => onGenerateFlashcards(node)}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-all"
          >
            <CreditCard className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-medium text-xs">Generate Flashcard for this Node</span>
          </button>
        </div>

        {/* Manual Actions (Edit & Delete) */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors text-xs font-medium"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-400" /> Edit Node
            </button>
          )}

          {node.type !== "root" && (
            <button
              onClick={() => onDeleteNode(node.id)}
              className="p-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 rounded-lg text-rose-400 hover:text-rose-200 transition-colors"
              title="Delete Node"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
