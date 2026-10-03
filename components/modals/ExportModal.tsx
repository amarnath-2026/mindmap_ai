import React, { useState } from "react";
import { MindMapGraph } from "@/types";
import { exportToMermaid, exportToMarkdown, downloadFile } from "@/lib/mindmap/export";
import { X, Code, FileText, Download, Copy, Check, Image as ImageIcon } from "lucide-react";
import { toPng, toSvg } from "html-to-image";
import jsPDF from "jspdf";

interface ExportModalProps {
  graph: MindMapGraph;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ graph, onClose }) => {
  const [copiedMermaid, setCopiedMermaid] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const mermaidCode = exportToMermaid(graph);
  const markdownText = exportToMarkdown(graph);

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(mermaidCode);
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownText);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadJSON = () => {
    downloadFile(JSON.stringify(graph, null, 2), `${graph.title.replace(/\s+/g, "_")}_mindmap.json`, "application/json");
  };

  const handleDownloadMarkdown = () => {
    downloadFile(markdownText, `${graph.title.replace(/\s+/g, "_")}_outline.md`, "text/markdown");
  };

  const handleExportPNG = async () => {
    const rfCanvas = document.querySelector(".react-flow__viewport") as HTMLElement;
    if (!rfCanvas) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(rfCanvas, { backgroundColor: "#0b0f19" });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${graph.title.replace(/\s+/g, "_")}_mindmap.png`;
      a.click();
    } catch (err) {
      console.error("PNG export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    const rfCanvas = document.querySelector(".react-flow__viewport") as HTMLElement;
    if (!rfCanvas) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(rfCanvas, { backgroundColor: "#0b0f19" });
      const pdf = new jsPDF("landscape", "px", [1200, 800]);
      pdf.addImage(dataUrl, "PNG", 0, 0, 1200, 800);
      pdf.save(`${graph.title.replace(/\s+/g, "_")}_mindmap.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Export Knowledge Map</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Visual Exports */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Image & Document Formats
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl flex flex-col items-center gap-2 transition-all group"
              >
                <ImageIcon className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-slate-200">PNG Image</span>
                <span className="text-[10px] text-slate-500">High-res canvas export</span>
              </button>

              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded-xl flex flex-col items-center gap-2 transition-all group"
              >
                <FileText className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-slate-200">PDF Document</span>
                <span className="text-[10px] text-slate-500">Printable landscape PDF</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 rounded-xl flex flex-col items-center gap-2 transition-all group"
              >
                <Code className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-slate-200">JSON Format</span>
                <span className="text-[10px] text-slate-500">Full graph data backup</span>
              </button>
            </div>
          </div>

          {/* Mermaid Syntax */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Mermaid Mindmap Code
              </h3>
              <button
                onClick={handleCopyMermaid}
                className="flex items-center gap-1.5 px-3 py-1 bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 rounded-lg text-xs transition-colors"
              >
                {copiedMermaid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMermaid ? "Copied!" : "Copy Mermaid"}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-36 scrollbar-thin">
              {mermaidCode}
            </pre>
          </div>

          {/* Markdown Outline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Markdown Document Outline
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadMarkdown}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Download .md
                </button>
                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMd ? "Copied!" : "Copy MD"}</span>
                </button>
              </div>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-36 scrollbar-thin">
              {markdownText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
