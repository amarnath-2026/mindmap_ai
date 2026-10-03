import React, { useState, useCallback, useEffect } from "react";
import {
  MindMapGraph,
  ParsedDocument,
  MindMapNode,
  LayoutDirection,
  ThemeMode,
  GenerationDepth,
  RegenerationMode
} from "@/types";
import { Toolbar } from "./Toolbar";
import { MindMapCanvas } from "./MindMapCanvas";
import { DocumentOutline } from "../sidebar/DocumentOutline";
import { NodeDetailsPanel } from "../sidebar/NodeDetailsPanel";
import { AIChatPanel } from "../chat/AIChatPanel";
import { ExportModal } from "../modals/ExportModal";
import { QuestionGeneratorModal } from "../modals/QuestionGeneratorModal";
import { SettingsModal } from "../modals/SettingsModal";
import { expandNodeBranch } from "@/lib/ai/agents";
import { saveMindMapGraph } from "@/lib/mindmap/storage";
import { ReactFlowProvider } from "@xyflow/react";

interface MindMapWorkspaceProps {
  initialGraph: MindMapGraph;
  parsedDoc?: ParsedDocument;
  appTheme?: "dark" | "light";
  onBackToDashboard: () => void;
}

export const MindMapWorkspace: React.FC<MindMapWorkspaceProps> = ({
  initialGraph,
  parsedDoc,
  appTheme = "dark",
  onBackToDashboard
}) => {
  const [graph, setGraph] = useState<MindMapGraph>(initialGraph);
  const [layoutDirection, setLayoutDirection] = useState<LayoutDirection>(initialGraph.metadata.layout || "horizontal");
  const [theme, setTheme] = useState<ThemeMode>(
    appTheme === "light" ? "light_academic" : initialGraph.metadata.theme || "dark_professional"
  );
  const [depth, setDepth] = useState<GenerationDepth>(initialGraph.metadata.depthMode || "detailed");
  const [mode, setMode] = useState<RegenerationMode>("balanced");

  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | undefined>(undefined);

  const [showAIChat, setShowAIChat] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Sync canvas theme with app-wide theme toggle
  useEffect(() => {
    if (appTheme === "light") {
      setTheme("light_academic");
    } else {
      setTheme("dark_professional");
    }
  }, [appTheme]);

  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setHighlightedNodeId(undefined);
        return;
      }
      const match = graph.nodes.find(
        (n) =>
          n.label.toLowerCase().includes(query.toLowerCase()) ||
          n.description?.toLowerCase().includes(query.toLowerCase())
      );
      if (match) {
        setHighlightedNodeId(match.id);
        setSelectedNode(match);
      }
    },
    [graph.nodes]
  );

  const handleSelectOutlineSection = useCallback(
    (sectionHeading: string) => {
      const match = graph.nodes.find(
        (n) =>
          n.label.toLowerCase().includes(sectionHeading.toLowerCase()) ||
          sectionHeading.toLowerCase().includes(n.label.toLowerCase())
      );
      if (match) {
        setHighlightedNodeId(match.id);
        setSelectedNode(match);
      }
    },
    [graph.nodes]
  );

  const handleGraphChange = useCallback((newGraph: MindMapGraph) => {
    setGraph(newGraph);
    saveMindMapGraph(newGraph);
  }, []);

  const handleUpdateNode = useCallback(
    (nodeId: string, newLabel: string, newDesc: string) => {
      const updatedNodes = graph.nodes.map((n) =>
        n.id === nodeId ? { ...n, label: newLabel, description: newDesc } : n
      );
      const updatedGraph = { ...graph, nodes: updatedNodes };
      handleGraphChange(updatedGraph);
      if (selectedNode?.id === nodeId) {
        setSelectedNode({ ...selectedNode, label: newLabel, description: newDesc });
      }
    },
    [graph, selectedNode, handleGraphChange]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const updatedNodes = graph.nodes.filter((n) => n.id !== nodeId && n.parentId !== nodeId);
      const updatedGraph = { ...graph, nodes: updatedNodes };
      handleGraphChange(updatedGraph);
      setSelectedNode(null);
    },
    [graph, handleGraphChange]
  );

  const handleExpandBranch = useCallback(
    async (nodeToExpand: MindMapNode) => {
      if (!parsedDoc) return;
      const newSubNodes = await expandNodeBranch(nodeToExpand, parsedDoc);
      const updatedNodes = [...graph.nodes];

      const targetInGraph = updatedNodes.find((n) => n.id === nodeToExpand.id);
      if (targetInGraph) {
        targetInGraph.children = [...(targetInGraph.children || []), ...newSubNodes.map((n) => n.id)];
      }

      const mergedGraph = {
        ...graph,
        nodes: [...updatedNodes, ...newSubNodes]
      };
      handleGraphChange(mergedGraph);
    },
    [graph, parsedDoc, handleGraphChange]
  );

  return (
    <ReactFlowProvider>
      <div className={`w-full h-screen flex flex-col overflow-hidden font-sans transition-colors ${
        theme === "light_academic" ? "bg-slate-100 text-slate-900" : "bg-slate-950 text-slate-100"
      }`}>
        <Toolbar
          graph={graph}
          currentDoc={parsedDoc}
          layoutDirection={layoutDirection}
          theme={theme}
          depth={depth}
          mode={mode}
          onBack={onBackToDashboard}
          onSearch={handleSearch}
          onLayoutChange={setLayoutDirection}
          onThemeChange={setTheme}
          onDepthChange={setDepth}
          onRegenerate={setMode}
          onOpenExportModal={() => setShowExportModal(true)}
          onToggleAIChat={() => setShowAIChat(!showAIChat)}
          onFitView={() => setHighlightedNodeId(graph.rootId)}
        />

        <div className="flex-1 flex relative overflow-hidden">
          <DocumentOutline
            document={parsedDoc}
            graph={graph}
            onSelectSection={handleSelectOutlineSection}
          />

          <main className="flex-1 h-full relative">
            <MindMapCanvas
              graph={graph}
              layoutDirection={layoutDirection}
              theme={theme}
              selectedNodeId={selectedNode?.id}
              highlightedNodeId={highlightedNodeId}
              onSelectNode={setSelectedNode}
              onGraphChange={handleGraphChange}
            />
          </main>

          {selectedNode && (
            <NodeDetailsPanel
              node={selectedNode}
              document={parsedDoc}
              onClose={() => setSelectedNode(null)}
              onExpandBranch={handleExpandBranch}
              onExplainNode={() => setShowAIChat(true)}
              onSimplifyNode={() => setShowAIChat(true)}
              onGenerateQuestions={() => setShowQuestionModal(true)}
              onGenerateFlashcards={() => setShowQuestionModal(true)}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={handleDeleteNode}
            />
          )}

          {showAIChat && (
            <AIChatPanel
              document={parsedDoc}
              graph={graph}
              onClose={() => setShowAIChat(false)}
              onGenerateQuizModal={() => setShowQuestionModal(true)}
            />
          )}
        </div>

        {showExportModal && <ExportModal graph={graph} onClose={() => setShowExportModal(false)} />}
        {showQuestionModal && (
          <QuestionGeneratorModal document={parsedDoc} graph={graph} onClose={() => setShowQuestionModal(false)} />
        )}
        {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
      </div>
    </ReactFlowProvider>
  );
};
