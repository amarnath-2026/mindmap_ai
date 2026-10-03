import React from "react";
import { Brain, CheckCircle, Loader2, Sparkles } from "lucide-react";

interface ProcessingPipelineProps {
  currentStep: string;
  percent: number;
}

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({
  currentStep,
  percent
}) => {
  const steps = [
    { label: "File uploaded", threshold: 10 },
    { label: "Text extracted", threshold: 30 },
    { label: "Sections identified", threshold: 50 },
    { label: "Important concepts detected", threshold: 70 },
    { label: "Building knowledge hierarchy", threshold: 85 },
    { label: "Generating mind map", threshold: 100 }
  ];

  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center space-y-8 animate-in zoom-in-95">
      {/* Animated Brain Pulse Icon */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 p-0.5 shadow-2xl animate-float">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Brain className="w-10 h-10 text-blue-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <span>Analyzing your resource...</span>
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </h2>
        <p className="text-xs text-slate-400 font-mono">{currentStep}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="text-right text-[10px] text-slate-500 font-mono">{percent}%</div>
      </div>

      {/* Step List Checkmarks */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-left space-y-2.5 text-xs">
        {steps.map((s, idx) => {
          const isDone = percent >= s.threshold;
          const isCurrent = percent < s.threshold && (idx === 0 || percent >= steps[idx - 1].threshold);

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 transition-colors ${
                isDone
                  ? "text-emerald-400 font-medium"
                  : isCurrent
                  ? "text-blue-300 font-medium"
                  : "text-slate-600"
              }`}
            >
              {isDone ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
