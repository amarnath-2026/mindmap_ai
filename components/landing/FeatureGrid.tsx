import React from "react";
import { FileSearch, GitFork, Sparkles, BookOpen, Download, HelpCircle } from "lucide-react";

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <FileSearch className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Multi-Format Resource Parsing",
      desc: "Extract structured headings, slide decks, and OCR scans from PDF, PPTX, DOCX, TXT, and images."
    },
    {
      icon: <GitFork className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: "Intelligent Concept Hierarchy",
      desc: "Automatically maps Root Topics → Major Topics → Subtopics → Grounded Concepts with curved connectors."
    },
    {
      icon: <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: "100% Source Traceability",
      desc: "Click any generated concept node to inspect page numbers, slide citations, and exact document source text."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: "AI Node Actions & Expansion",
      desc: "Dynamically expand branches, request ELI5 simplifications, or generate real-world code examples."
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      title: "Exam & Revision Question Generator",
      desc: "Convert your document maps into interactive self-test MCQs and viva interview preparation quizzes."
    },
    {
      icon: <Download className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      title: "Multi-Format Export",
      desc: "Export high-resolution PNG, SVG, printable PDF, JSON data backups, or copy raw Mermaid syntax."
    }
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/60">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Engineered for Deep Learning & Information Architecture
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Unlike generic summarizers, MindMap AI parses the structural DNA of your documents into an interactive knowledge graph.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-slate-700/80 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] space-y-3 shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-950 flex items-center justify-center border border-blue-100 dark:border-slate-800">
              {f.icon}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{f.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
