"use client";

import React, { useState, useEffect } from "react";
import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { FileUploader } from "@/components/upload/FileUploader";
import { ProcessingPipeline } from "@/components/processing/ProcessingPipeline";
import { MindMapWorkspace } from "@/components/mindmap/MindMapWorkspace";
import { SavedMapsDashboard } from "@/components/dashboard/SavedMapsDashboard";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { ParsedDocument, MindMapGraph } from "@/types";
import { parseDocument } from "@/lib/document/parser";
import { generateMindMapFromDocument } from "@/lib/ai/agents";
import {
  UserProfile,
  getCurrentUser,
  saveUserMindMapGraph,
  getUserMindMaps,
  deleteUserMindMapGraph,
  saveUserFileRecord,
  getUserRecentFiles,
  logoutUser,
  UserFileRecord
} from "@/lib/auth/store";
import { DEMO_DATASETS } from "@/lib/ai/demo-data";
import {
  Brain,
  Settings as SettingsIcon,
  LayoutDashboard,
  Plus,
  Sun,
  Moon,
  LogIn,
  LogOut,
  FolderOpen
} from "lucide-react";

type ViewState = "landing" | "upload" | "processing" | "workspace" | "dashboard";

export default function Home() {
  const [view, setView] = useState<ViewState>("landing");
  const [appTheme, setAppTheme] = useState<"dark" | "light">("dark");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [parsedDoc, setParsedDoc] = useState<ParsedDocument | undefined>(undefined);
  const [currentGraph, setCurrentGraph] = useState<MindMapGraph | null>(null);

  const [processingStep, setProcessingStep] = useState("Analyzing document structure...");
  const [processingPercent, setProcessingPercent] = useState(15);

  const [savedGraphs, setSavedGraphs] = useState<MindMapGraph[]>([]);
  const [recentFiles, setRecentFiles] = useState<UserFileRecord[]>([]);

  const [showSettings, setShowSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Initialize auth user & per-user workspace
  useEffect(() => {
    const u = getCurrentUser();
    setCurrentUser(u);
    if (u) {
      setSavedGraphs(getUserMindMaps(u.id));
      setRecentFiles(getUserRecentFiles(u.id));
    } else {
      setSavedGraphs([]);
      setRecentFiles([]);
    }
  }, []);

  const toggleAppTheme = (newTheme: "dark" | "light") => {
    setAppTheme(newTheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (newTheme === "light") {
        root.classList.remove("dark");
        root.classList.add("light");
      } else {
        root.classList.remove("light");
        root.classList.add("dark");
      }
    }
  };

  // Reload user data on signin / account switch
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setSavedGraphs(getUserMindMaps(user.id));
    setRecentFiles(getUserRecentFiles(user.id));
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setSavedGraphs([]);
    setRecentFiles([]);
    setView("landing");
  };

  // Auth gate check for creating mind map
  const requireAuthAndNavigateToUpload = () => {
    if (!currentUser) {
      setAuthModalMode("signin");
      setShowAuthModal(true);
      return;
    }
    setView("upload");
  };

  const requireAuthAndNavigateToDashboard = () => {
    if (!currentUser) {
      setAuthModalMode("signin");
      setShowAuthModal(true);
      return;
    }
    setView("dashboard");
  };

  // Processing uploaded files
  const handleProcessFiles = async (files: File[]) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    setView("processing");
    setProcessingPercent(10);
    setProcessingStep("Reading file buffer & metadata...");

    try {
      const file = files[0];
      const doc = await parseDocument(file);
      setParsedDoc(doc);

      saveUserFileRecord(currentUser.id, doc);
      setRecentFiles(getUserRecentFiles(currentUser.id));

      setProcessingPercent(40);
      setProcessingStep("Extracting sections & key concepts...");

      const graph = await generateMindMapFromDocument(
        doc,
        "detailed",
        "balanced",
        undefined,
        (step, pct) => {
          setProcessingStep(step);
          setProcessingPercent(pct);
        }
      );

      setCurrentGraph(graph);
      saveUserMindMapGraph(currentUser.id, graph);
      setSavedGraphs(getUserMindMaps(currentUser.id));

      setProcessingPercent(100);
      setTimeout(() => {
        setView("workspace");
      }, 400);
    } catch (err) {
      console.error("Pipeline processing error:", err);
      const fallbackDemo = DEMO_DATASETS["prompt-engineering"];
      setParsedDoc(fallbackDemo.parsedDoc);
      setCurrentGraph(fallbackDemo.graph);
      setView("workspace");
    }
  };

  const handlePasteText = async (title: string, text: string) => {
    const fakeFile = new File([text], `${title.replace(/\s+/g, "_")}.txt`, { type: "text/plain" });
    await handleProcessFiles([fakeFile]);
  };

  const handleSelectDemo = (demoId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    const demo = DEMO_DATASETS[demoId] || DEMO_DATASETS["prompt-engineering"];
    setParsedDoc(demo.parsedDoc);
    setCurrentGraph(demo.graph);
    saveUserMindMapGraph(currentUser.id, demo.graph);
    setSavedGraphs(getUserMindMaps(currentUser.id));
    setView("workspace");
  };

  const handleDeleteSavedGraph = (id: string) => {
    if (currentUser) {
      deleteUserMindMapGraph(currentUser.id, id);
      setSavedGraphs(getUserMindMaps(currentUser.id));
    }
  };

  const handleReProcessFile = (record: UserFileRecord) => {
    if (!currentUser) return;
    if (record.parsedDoc) {
      setParsedDoc(record.parsedDoc);
      setView("processing");
      setProcessingPercent(30);
      setProcessingStep(`Re-building mind map for ${record.fileName}...`);

      generateMindMapFromDocument(record.parsedDoc, "detailed", "balanced").then((graph) => {
        setCurrentGraph(graph);
        saveUserMindMapGraph(currentUser.id, graph);
        setSavedGraphs(getUserMindMaps(currentUser.id));
        setProcessingPercent(100);
        setTimeout(() => setView("workspace"), 300);
      });
    }
  };

  if (view === "workspace" && currentGraph) {
    return (
      <MindMapWorkspace
        initialGraph={currentGraph}
        parsedDoc={parsedDoc}
        appTheme={appTheme}
        onBackToDashboard={() => setView("dashboard")}
      />
    );
  }

  const isLight = appTheme === "light";

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? "bg-slate-50 text-slate-900" : "bg-[#0b0f19] text-slate-100"
    }`}>
      {/* App Header Bar with Pristine Light & Dark Mode Contrast */}
      <header className={`h-16 border-b px-6 flex items-center justify-between z-40 sticky top-0 transition-colors backdrop-blur-md ${
        isLight
          ? "bg-white border-slate-200 text-slate-900 shadow-sm"
          : "bg-[#0b0f19]/90 border-slate-800/80 text-slate-100"
      }`}>
        {/* Brand Logo */}
        <div
          onClick={() => setView("landing")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-extrabold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent leading-none">
              MindMap AI
            </span>
            <span className={`text-[10px] font-semibold block mt-0.5 ${
              isLight ? "text-slate-600" : "text-slate-400"
            }`}>
              Document Knowledge Engine
            </span>
          </div>
        </div>

        {/* Header Nav Actions */}
        <nav className="flex items-center gap-3">
          {/* Light / Dark Theme Toggle Button */}
          <button
            onClick={() => toggleAppTheme(isLight ? "dark" : "light")}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isLight
                ? "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800"
            }`}
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {isLight ? (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            )}
          </button>

          {/* User Workspace shortcut (Auth Gated) */}
          <button
            onClick={requireAuthAndNavigateToDashboard}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              view === "dashboard"
                ? "bg-blue-600 text-white shadow"
                : isLight
                ? "text-slate-800 hover:text-blue-600 hover:bg-slate-100 font-bold"
                : "text-slate-300 hover:text-white hover:bg-slate-900"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">My Workspace ({savedGraphs.length})</span>
          </button>

          {/* Create Mind Map Button (Auth Gated) */}
          <button
            onClick={requireAuthAndNavigateToUpload}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Mind Map</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-xl border transition-colors ${
              isLight
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300"
                : "bg-slate-900 text-slate-400 hover:text-white border-slate-800"
            }`}
            title="AI Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* User Account / Auth Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-2 p-1 pr-2.5 rounded-xl border transition-colors ${
                  isLight
                    ? "bg-slate-100 border-slate-300 text-slate-900"
                    : "bg-slate-900 border-slate-800 text-slate-200"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <span className="text-xs font-bold truncate max-w-[90px] hidden sm:inline">
                  {currentUser.name}
                </span>
              </button>

              {showProfileMenu && (
                <div className={`absolute right-0 top-full mt-2 w-56 border rounded-xl shadow-2xl py-2 z-50 text-xs ${
                  isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-slate-300"
                }`}>
                  <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setView("dashboard");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>My Saved Files & Maps</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode("signin");
                setShowAuthModal(true);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isLight
                  ? "bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-300"
                  : "bg-slate-900 text-slate-200 hover:bg-slate-800 border-slate-800"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </nav>
      </header>

      {/* Main View Router */}
      <main className="flex-1">
        {view === "landing" && (
          <>
            <Hero
              onStartUpload={requireAuthAndNavigateToUpload}
              onTryDemo={() => handleSelectDemo("prompt-engineering")}
            />
            <FeatureGrid />
          </>
        )}

        {view === "upload" && (
          <FileUploader
            onProcessFiles={handleProcessFiles}
            onPasteText={handlePasteText}
            onSelectDemo={handleSelectDemo}
          />
        )}

        {view === "processing" && (
          <ProcessingPipeline currentStep={processingStep} percent={processingPercent} />
        )}

        {view === "dashboard" && (
          <SavedMapsDashboard
            currentUser={currentUser}
            savedGraphs={savedGraphs}
            recentFiles={recentFiles}
            onOpenGraph={(g) => {
              setCurrentGraph(g);
              setParsedDoc(undefined);
              setView("workspace");
            }}
            onDeleteGraph={handleDeleteSavedGraph}
            onReProcessFile={handleReProcessFile}
            onCreateNew={requireAuthAndNavigateToUpload}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer */}
      {view !== "workspace" && (
        <footer className={`border-t py-8 px-6 text-center text-xs space-y-2 ${
          isLight ? "border-slate-200 text-slate-600 bg-white" : "border-slate-800/80 text-slate-500 bg-[#0b0f19]"
        }`}>
          <p>© {new Date().getFullYear()} MindMap AI • Turn any document into an intelligent visual mind map.</p>
        </footer>
      )}

      {/* Modals */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAuthModal && (
        <AuthModal
          mode={authModalMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
