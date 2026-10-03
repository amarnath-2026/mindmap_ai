export type NodeType = "root" | "topic" | "subtopic" | "concept" | "detail";

export interface SourceReference {
  file: string;
  page?: number;
  slide?: number;
  section?: string;
  snippet?: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  type: NodeType;
  description?: string;
  parentId?: string;
  children?: string[];
  sourceReferences?: SourceReference[];
  collapsed?: boolean;
  color?: string;
  icon?: string;
  tags?: string[];
  // For custom positioning or layout overrides
  position?: { x: number; y: number };
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  type?: string;
}

export interface MindMapGraph {
  id: string;
  title: string;
  description: string;
  rootId: string;
  nodes: MindMapNode[];
  edges?: MindMapEdge[];
  metadata: {
    sourceFiles: string[];
    createdAt: string;
    updatedAt: string;
    nodeCount: number;
    depthMode: GenerationDepth;
    theme: ThemeMode;
    layout: LayoutDirection;
  };
}

export type GenerationDepth = "quick" | "detailed" | "deep";
export type RegenerationMode = "compact" | "balanced" | "detailed" | "exam_revision" | "presentation" | "research";
export type LayoutDirection = "horizontal" | "vertical" | "radial" | "tree";
export type ThemeMode = "dark_professional" | "light_academic" | "midnight_ai" | "minimal_white";

export interface DocumentSection {
  id: string;
  heading: string;
  content: string;
  level: number;
  pageOrSlide?: number;
  subsections?: DocumentSection[];
}

export interface ParsedDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  title: string;
  extractedText: string;
  sections: DocumentSection[];
  metadata: {
    totalPages?: number;
    totalSlides?: number;
    wordCount: number;
    parsedAt: string;
  };
}

export interface AIProviderConfig {
  provider: "demo" | "openai" | "gemini" | "anthropic" | "custom";
  apiKey?: string;
  model?: string;
  customUrl?: string;
  groundedMode: boolean;
}

export interface ExamQuestion {
  id: string;
  type: "mcq" | "short" | "viva" | "concept";
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  sourceNodeId?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  sourceNodeId?: string;
}

export interface MindMapVersion {
  id: string;
  timestamp: string;
  description: string;
  graph: MindMapGraph;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: "expand_node" | "add_branch" | "generate_quiz";
    nodeId?: string;
    data?: any;
  };
}
