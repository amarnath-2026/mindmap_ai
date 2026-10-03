import React, { useState, useRef } from "react";
import { Upload, FileText, X, FileUp, Sparkles, Clipboard, ArrowRight } from "lucide-react";
import { DEMO_DATASETS } from "@/lib/ai/demo-data";

interface UploadedFileCard {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
}

interface FileUploaderProps {
  onProcessFiles: (files: File[]) => void;
  onPasteText: (title: string, text: string) => void;
  onSelectDemo: (demoId: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onProcessFiles,
  onPasteText,
  onSelectDemo
}) => {
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileCard[]>([]);
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteContent, setPasteContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map((f) => ({
      file: f,
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: f.name,
      size: f.size,
      type: f.name.split(".").pop()?.toUpperCase() || "FILE"
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleStartProcessing = () => {
    if (activeTab === "file" && uploadedFiles.length > 0) {
      onProcessFiles(uploadedFiles.map((f) => f.file));
    } else if (activeTab === "paste" && pasteContent.trim()) {
      onPasteText(pasteTitle || "Pasted Knowledge Notes", pasteContent);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-in fade-in-50">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Upload Your Study or Work Resource
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Drop any educational, technical, or research document to generate an AI mind map.
        </p>
      </div>

      {/* Upload Mode Tabs */}
      <div className="flex items-center justify-center gap-2 bg-slate-200/80 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-300 dark:border-slate-800 w-fit mx-auto text-xs">
        <button
          onClick={() => setActiveTab("file")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "file"
              ? "bg-blue-600 text-white shadow"
              : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
        <button
          onClick={() => setActiveTab("paste")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "paste"
              ? "bg-blue-600 text-white shadow"
              : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Clipboard className="w-3.5 h-3.5" />
          <span>Paste Text</span>
        </button>
      </div>

      {/* File Drag Drop Zone */}
      {activeTab === "file" ? (
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-300 dark:border-slate-700 hover:border-blue-500 bg-blue-50/50 dark:bg-slate-900/40 hover:bg-blue-50 dark:hover:bg-slate-900/80 rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 group shadow-lg"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.md,image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800/60 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Drop your resource here
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs mb-3">or click to browse files from device</p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-mono shadow-sm">
              PDF • PPT • PPTX • DOC • DOCX • TXT • MD • Images
            </div>
          </div>

          {/* Uploaded Files Cards List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Selected Resources ({uploadedFiles.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {uploadedFiles.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center font-bold text-[10px] text-blue-700 dark:text-blue-400 shrink-0 uppercase border border-blue-300 dark:border-blue-800/50">
                        {f.type}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{f.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{formatFileSize(f.size)} • Ready</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(f.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Paste Text Zone */
        <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Resource Title</label>
            <input
              type="text"
              value={pasteTitle}
              onChange={(e) => setPasteTitle(e.target.value)}
              placeholder="e.g. Prompt Engineering Principles"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Text Content</label>
            <textarea
              value={pasteContent}
              rows={8}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder="Paste raw notes, lecture transcript, or study material here..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none font-mono"
            />
          </div>
        </div>
      )}

      {/* Start Action Button */}
      {(uploadedFiles.length > 0 || (activeTab === "paste" && pasteContent.trim())) && (
        <div className="text-center pt-2">
          <button
            onClick={handleStartProcessing}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-sm rounded-xl shadow-xl transition-all scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Knowledge Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sample Demo Documents */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center mb-4">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Or try instant sample documents:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.values(DEMO_DATASETS).map((demo) => (
            <button
              key={demo.id}
              onClick={() => onSelectDemo(demo.id)}
              className="p-4 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 rounded-xl text-left transition-all shadow-sm group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="font-bold text-xs text-slate-900 dark:text-slate-200 leading-snug">{demo.title}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{demo.tagline}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
