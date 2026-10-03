import React, { useMemo, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  BackgroundVariant,
  useReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { MindMapGraph, MindMapNode, LayoutDirection, ThemeMode } from "@/types";
import { calculateGraphLayout } from "@/lib/mindmap/layout";
import { CustomNode } from "./CustomNode";

interface MindMapCanvasProps {
  graph: MindMapGraph;
  layoutDirection: LayoutDirection;
  theme: ThemeMode;
  selectedNodeId?: string;
  highlightedNodeId?: string;
  onSelectNode: (node: MindMapNode) => void;
  onGraphChange?: (updatedGraph: MindMapGraph) => void;
}

const nodeTypes = {
  customNode: CustomNode
};

export const MindMapCanvas: React.FC<MindMapCanvasProps> = ({
  graph,
  layoutDirection,
  theme,
  selectedNodeId,
  highlightedNodeId,
  onSelectNode,
  onGraphChange
}) => {
  const { fitView } = useReactFlow();

  const handleToggleCollapse = useCallback(
    (nodeId: string) => {
      const updatedNodes = graph.nodes.map((n) => {
        if (n.id === nodeId) {
          return { ...n, collapsed: !n.collapsed };
        }
        return n;
      });
      onGraphChange?.({ ...graph, nodes: updatedNodes });
    },
    [graph, onGraphChange]
  );

  const layoutResult = useMemo(() => {
    return calculateGraphLayout(graph.nodes, layoutDirection);
  }, [graph.nodes, layoutDirection]);

  const rfNodes: Node[] = useMemo(() => {
    return layoutResult.nodes.map((n) => ({
      id: n.id,
      type: "customNode",
      position: n.position,
      data: {
        node: n,
        theme,
        isSelected: n.id === selectedNodeId,
        isHighlighted: n.id === highlightedNodeId,
        onToggleCollapse: handleToggleCollapse,
        onSelectNode
      }
    }));
  }, [layoutResult.nodes, theme, selectedNodeId, highlightedNodeId, handleToggleCollapse, onSelectNode]);

  // NotebookLM Fanning Curved Edges (Image 2 style: Bezier smooth curves with slate lavender stroke)
  const rfEdges: Edge[] = useMemo(() => {
    const getEdgeColor = () => {
      if (theme === "light_academic") return "#94a3b8";
      if (theme === "midnight_ai") return "#06b6d4";
      return "#7b8cb8"; // NotebookLM signature lavender-slate curve color from Image 2!
    };

    return layoutResult.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: "default", // Bezier curve fanning!
      animated: true,
      style: {
        stroke: getEdgeColor(),
        strokeWidth: 2,
        opacity: 0.85
      }
    }));
  }, [layoutResult.edges, theme]);

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);

  useEffect(() => {
    setNodes(rfNodes);
    setEdges(rfEdges);
  }, [rfNodes, rfEdges, setNodes, setEdges]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.25, duration: 400 });
    }, 100);
    return () => clearTimeout(timer);
  }, [layoutDirection, graph.id, fitView]);

  useEffect(() => {
    if (highlightedNodeId) {
      const match = nodes.find((n) => n.id === highlightedNodeId);
      if (match) {
        fitView({ nodes: [match], duration: 500, maxZoom: 1.4 });
      }
    }
  }, [highlightedNodeId, nodes, fitView]);

  const getCanvasBackground = () => {
    if (theme === "light_academic") return "bg-[#f8fafc]";
    if (theme === "midnight_ai") return "bg-[#030712]";
    return "bg-[#13161f]"; // NotebookLM signature deep pitch canvas from Image 2!
  };

  return (
    <div className={`w-full h-full relative overflow-hidden ${getCanvasBackground()}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2.5}
        defaultEdgeOptions={{ type: "default" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1.2}
          color={theme === "light_academic" ? "#cbd5e1" : "#1e2433"}
        />
        <Controls className="!bg-[#1c202d] !border-slate-800 !fill-slate-300 !rounded-xl !shadow-xl" />
        <MiniMap
          nodeColor={(n) => {
            const nodeData = n.data?.node as MindMapNode;
            if (nodeData?.type === "root") return "#373955";
            if (nodeData?.type === "topic") return "#282d3c";
            if (nodeData?.type === "concept") return "#152720";
            return "#475569";
          }}
          maskColor="rgba(19, 22, 31, 0.75)"
          className="!bg-[#1c202d] !border-slate-800 !rounded-xl overflow-hidden"
        />
      </ReactFlow>
    </div>
  );
};
