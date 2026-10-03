import React, { useState } from "react";
import { MindMapGraph } from "@/types";
import { UserProfile, UserFileRecord } from "@/lib/auth/store";
import {
  Brain,
  Calendar,
  Layers,
  Trash2,
  ExternalLink,
  Plus,
  FolderOpen,
  FileText,
  Clock,
  Sparkles,
  LogOut,
  User as UserIcon
} from "lucide-react";

interface SavedMapsDashboardProps {
  currentUser: UserProfile | null;
  savedGraphs: MindMapGraph[];
  recentFiles: UserFileRecord[];
  onOpenGraph: (graph: MindMapGraph) => void;
  onDeleteGraph: (id: string) => void;
  onReProcessFile: (fileRecord: UserFileRecord) => void;
  onCreateNew: () => void;
  onLogout: () => void;
}

export const SavedMapsDashboard: React.FC<SavedMapsDashboardProps> = ({
  currentUser,
  savedGraphs,
  recentFiles,
  onOpenGraph,
  onDeleteGraph,
  onReProcessFile,
  onCreateNew,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<"maps" | "files">("maps");

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8 animate-in fade-in-50">
      {/* User Profile Banner Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg overflow-hidden border border-blue-400/30">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser?.name.charAt(0) || "U"
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{currentUser?.name || "Guest User"}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 font-bold">
                PRO USER
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">{currentUser?.email || "alex.rivera@mindmap.ai"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Document</span>
          </button>
          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("maps")}
          className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "maps"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Saved Knowledge Maps ({savedGraphs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("files")}
          className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "files"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Recent Uploaded Files ({recentFiles.length})</span>
        </button>
      </div>

      {/* Tab 1: Saved Mind Maps */}
      {activeTab === "maps" && (
        <>
          {savedGraphs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-900 flex items-center justify-center mx-auto border border-blue-200 dark:border-slate-800">
                <FolderOpen className="w-8 h-8 text-blue-600 dark:text-slate-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-200">No saved maps found for this user.</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs max-w-sm mx-auto">
                  Upload a resource to generate your first AI-powered interactive mind map.
                </p>
              </div>
              <button
                onClick={onCreateNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow"
              >
                Upload Resource
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedGraphs.map((g) => (
                <div
                  key={g.id}
                  className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60 font-bold uppercase">
                        {g.metadata.sourceFiles[0]?.split(".").pop() || "MAP"}
                      </span>
                      <button
                        onClick={() => onDeleteGraph(g.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Mind Map"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {g.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {g.description || "Interactive knowledge graph generated with MindMap AI"}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <Layers className="w-3 h-3" />
                        {g.nodes.length} nodes
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(g.metadata.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenGraph(g)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg transition-all text-xs font-semibold shadow-sm hover:bg-blue-500"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Recent Uploaded Files */}
      {activeTab === "files" && (
        <div className="space-y-4">
          {recentFiles.length === 0 ? (
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-sm">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-slate-600 dark:text-slate-400 text-xs">No recent uploaded files recorded yet.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md">
              <table className="w-full text-left text-xs text-slate-800 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 uppercase font-mono text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3">File Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Size</th>
                    <th className="px-6 py-3">Uploaded Date</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {recentFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{file.fileName}</span>
                      </td>
                      <td className="px-6 py-4 uppercase font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {file.fileType}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {formatFileSize(file.fileSize)}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {new Date(file.uploadedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onReProcessFile(file)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs transition-all shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate Mind Map</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
