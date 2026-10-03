import React, { useState } from "react";
import { ParsedDocument, DocumentSection, MindMapGraph } from "@/types";
import { FileText, ChevronRight, ChevronDown, BookOpen, Layers, Hash, PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface DocumentOutlineProps {
  document?: ParsedDocument;
  graph: MindMapGraph;
  onSelectSection: (sectionHeading: string) => void;
}

export const DocumentOutline: React.FC<DocumentOutlineProps> = ({
  document,
  graph,
  onSelectSection
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!document) {
    return null;
  }

  return (
    <aside
      className={`bg-slate-900/95 border-r border-slate-800/80 transition-all duration-300 flex flex-col z-20 shrink-0 ${
        isCollapsed ? "w-12" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="h-12 border-b border-slate-800 px-3 flex items-center justify-between text-slate-300">
        {!isCollapsed && (
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Document Outline
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mx-auto"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
          {/* Document Summary Badge */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
            <div className="text-xs font-medium text-slate-200 truncate">{document.fileName}</div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
              <span>{document.fileType.toUpperCase()}</span>
              <span>•</span>
              <span>{document.metadata.wordCount} words</span>
              {document.metadata.totalPages && (
                <>
                  <span>•</span>
                  <span>{document.metadata.totalPages} pages</span>
                </>
              )}
            </div>
          </div>

          {/* Outline Sections List */}
          <div className="space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2 px-1">
              Sections & Headings
            </div>

            {document.sections.map((sec, idx) => (
              <button
                key={sec.id || idx}
                onClick={() => onSelectSection(sec.heading)}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 text-slate-300 hover:text-emerald-400 transition-all flex items-start gap-2 group border border-transparent hover:border-slate-700/60"
              >
                <Hash className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs truncate leading-snug">
                    {sec.heading.replace(/^\d+[\.\s-]*/, "")}
                  </div>
                  {sec.pageOrSlide && (
                    <span className="text-[10px] text-slate-400">
                      {document.fileType.includes("ppt") ? `Slide ${sec.pageOrSlide}` : `Page ${sec.pageOrSlide}`}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
