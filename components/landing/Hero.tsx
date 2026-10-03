import React from "react";
import { DemoPreview } from "./DemoPreview";
import { ArrowRight, Sparkles, FileText, Brain, ShieldCheck, Zap } from "lucide-react";

interface HeroProps {
  onStartUpload: () => void;
  onTryDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartUpload, onTryDemo }) => {
  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 dark:bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI-Powered Knowledge Extraction Engine</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Turn Any Document Into an{" "}
            <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 dark:from-blue-400 dark:via-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Intelligent Mind Map
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            Upload a PDF, PowerPoint, Word document, or research paper and let AI transform complex information into a clear, interactive knowledge map.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartUpload}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Create Mind Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onTryDemo}
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-slate-900 text-slate-100 hover:bg-slate-800 border border-slate-800 font-semibold text-sm rounded-xl transition-all shadow-md"
            >
              <Brain className="w-4 h-4 text-emerald-400" />
              <span>Try a Demo</span>
            </button>
          </div>

          {/* Value props badges */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>100% Source Grounded</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500 shrink-0" />
              <span>PDF • PPT • DOCX • OCR</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Instant AI Hierarchy</span>
            </div>
          </div>
        </div>

        {/* Right Visual Mind Map Interactive Preview */}
        <div className="lg:col-span-5">
          <DemoPreview />
        </div>
      </div>
    </section>
  );
};
