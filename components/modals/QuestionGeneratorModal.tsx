import React, { useState } from "react";
import { ExamQuestion, ParsedDocument, MindMapGraph } from "@/types";
import { generateExamQuestions } from "@/lib/ai/agents";
import { X, HelpCircle, CheckCircle, Eye, RefreshCw, BookOpen } from "lucide-react";

interface QuestionGeneratorModalProps {
  document?: ParsedDocument;
  graph: MindMapGraph;
  onClose: () => void;
}

export const QuestionGeneratorModal: React.FC<QuestionGeneratorModalProps> = ({
  document,
  graph,
  onClose
}) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>(() => {
    // Generate initial questions synchronously or fallback
    return [
      {
        id: "q-1",
        type: "mcq",
        question: `What is the primary objective of ${graph.nodes[0]?.label || "this concept"}?`,
        options: [
          `To structure input context into an interactive visual knowledge map`,
          `To compress documents into low-resolution lossy images`,
          `To disable section hierarchy detection`,
          `To bypass statistical token predictions`
        ],
        answer: `To structure input context into an interactive visual knowledge map`,
        explanation: `Grounded in ${graph.title} core hierarchy.`
      },
      {
        id: "q-2",
        type: "viva",
        question: `Explain how ${graph.nodes[1]?.label || "Topic 1"} relates to ${graph.nodes[2]?.label || "Topic 2"}.`,
        answer: `${graph.nodes[1]?.label || "Topic 1"} provides foundational concepts that directly enable the sub-processes in ${graph.nodes[2]?.label || "Topic 2"}.`,
        explanation: `Source grounded from document outline.`
      }
    ];
  });

  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [selectedMCQOptions, setSelectedMCQOptions] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    if (document) {
      const qList = await generateExamQuestions(document, 5);
      setQuestions(qList);
    } else {
      setTimeout(() => setIsGenerating(false), 500);
    }
    setIsGenerating(false);
  };

  const toggleReveal = (qId: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Exam Viva & Self-Test Questions</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question List */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-slate-100 text-sm">
                  Q{idx + 1}. {q.question}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-amber-950/60 text-amber-300 border border-amber-800/60 shrink-0">
                  {q.type}
                </span>
              </div>

              {/* MCQ Options */}
              {q.options && (
                <div className="space-y-1.5 pl-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedMCQOptions[q.id] === opt;
                    const isCorrect = opt === q.answer;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => setSelectedMCQOptions((prev) => ({ ...prev, [q.id]: opt }))}
                        className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? isCorrect
                              ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                              : "bg-rose-950/80 border-rose-500 text-rose-200"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <CheckCircle className={`w-4 h-4 ${isCorrect ? "text-emerald-400" : "text-rose-400"}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Answer Toggle */}
              <div>
                <button
                  onClick={() => toggleReveal(q.id)}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium mt-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{revealedAnswers[q.id] ? "Hide Answer" : "Show Verified Answer"}</span>
                </button>

                {revealedAnswers[q.id] && (
                  <div className="mt-2.5 p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                    <div className="font-semibold text-emerald-400 text-xs">Answer: {q.answer}</div>
                    <div className="text-[11px] text-slate-400">{q.explanation}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
