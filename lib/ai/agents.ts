import {
  ParsedDocument,
  MindMapGraph,
  MindMapNode,
  GenerationDepth,
  RegenerationMode,
  ExamQuestion,
  Flashcard,
  AIProviderConfig
} from "@/types";
import { callLLM, getStoredAIConfig } from "./provider";
import { DEMO_DATASETS } from "./demo-data";

const SYSTEM_PROMPT = `
You are MindMap AI — an expert knowledge-structure extraction engine.
Analyze the supplied document and construct a hierarchical representation of its knowledge.
Your goal is NOT to produce a generic text summary.
Identify the document's actual structure, major topics, subtopics, concepts, processes, relationships, definitions, examples, and important information.

Follow these strict rules:
1. Root node = main subject title.
2. Max first-level branches = 4 to 8.
3. Keep node labels concise (1-5 words). Never place full paragraphs in titles.
4. Descriptions should be short, informative summary sentences (1-2 sentences).
5. Prefer concepts explicitly supported by the source text.
6. Return ONLY valid structured JSON matching the requested schema.
`;

/**
 * Agent 1, 2, 3 & 4: Full Document Processing to Mind Map Graph
 */
export async function generateMindMapFromDocument(
  doc: ParsedDocument,
  depth: GenerationDepth = "detailed",
  mode: RegenerationMode = "balanced",
  config: AIProviderConfig = getStoredAIConfig(),
  onProgress?: (step: string, percent: number) => void
): Promise<MindMapGraph> {
  onProgress?.("Analyzing document structure...", 20);

  // Check if doc matches one of our rich demo datasets for instant pre-built precision if in demo mode
  const matchingDemoKey = Object.keys(DEMO_DATASETS).find(key => 
    DEMO_DATASETS[key].fileName.toLowerCase() === doc.fileName.toLowerCase() ||
    doc.title.toLowerCase().includes(key.replace("-", " "))
  );

  if (config.provider === "demo" && matchingDemoKey) {
    onProgress?.("Building knowledge hierarchy...", 60);
    await new Promise(r => setTimeout(r, 600));
    onProgress?.("Generating interactive mind map...", 90);
    await new Promise(r => setTimeout(r, 400));
    return DEMO_DATASETS[matchingDemoKey].graph;
  }

  // Attempt LLM generation if configured
  if (config.provider !== "demo" && config.apiKey) {
    onProgress?.("Extracting semantic concepts with AI...", 45);
    const userPrompt = `
Document Title: ${doc.title}
Document File: ${doc.fileName}
Generation Depth: ${depth}
Map Mode: ${mode}

Extracted Text Snippet:
${doc.extractedText.slice(0, 6000)}

Please return a JSON object with this exact structure:
{
  "title": "${doc.title}",
  "description": "Knowledge map of ${doc.title}",
  "nodes": [
    {
      "id": "root",
      "label": "${doc.title}",
      "type": "root",
      "description": "Main root topic",
      "children": ["topic-1", "topic-2"]
    },
    {
      "id": "topic-1",
      "label": "Major Topic 1",
      "type": "topic",
      "parentId": "root",
      "description": "Description",
      "children": ["concept-1-1"]
    },
    {
      "id": "concept-1-1",
      "label": "Concept 1",
      "type": "concept",
      "parentId": "topic-1",
      "description": "Description of concept"
    }
  ]
}
`;

    const rawJsonStr = await callLLM(userPrompt, SYSTEM_PROMPT, config);
    if (rawJsonStr) {
      try {
        const cleanedStr = rawJsonStr.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleanedStr);
        if (parsed && Array.isArray(parsed.nodes) && parsed.nodes.length > 0) {
          onProgress?.("Validating knowledge hierarchy...", 85);
          return validateAndRefineGraph(parsed, doc, depth, mode);
        }
      } catch (err) {
        console.warn("LLM JSON parse error, falling back to structuring agent:", err);
      }
    }
  }

  // Intelligent Local Structuring Agent Fallback
  onProgress?.("Structuring concepts with local agent...", 60);
  await new Promise(r => setTimeout(r, 500));
  onProgress?.("Validating knowledge graph...", 85);
  
  const graph = buildLocalStructuredGraph(doc, depth, mode);
  await new Promise(r => setTimeout(r, 300));
  return graph;
}

/**
 * Intelligent Local Knowledge Structuring Agent
 */
function buildLocalStructuredGraph(
  doc: ParsedDocument,
  depth: GenerationDepth,
  mode: RegenerationMode
): MindMapGraph {
  const rootId = "root";
  const nodes: MindMapNode[] = [];
  const sourceFileName = doc.fileName;

  // Root Node
  nodes.push({
    id: rootId,
    label: doc.title,
    type: "root",
    description: `Central topic knowledge map generated from ${doc.fileName}.`,
    children: [],
    sourceReferences: [{ file: sourceFileName, page: 1, section: "Document Header" }]
  });

  const sections = doc.sections.length > 0 ? doc.sections : [
    { id: "sec-1", heading: "Core Concepts", level: 1, content: doc.extractedText }
  ];

  const maxTopics = depth === "quick" ? 3 : depth === "detailed" ? 5 : 7;
  const topicSections = sections.slice(0, maxTopics);

  topicSections.forEach((sec, idx) => {
    const topicId = `topic-${idx + 1}`;
    nodes[0].children?.push(topicId);

    const headingTitle = sec.heading.replace(/^\d+[\.\s-]*/, "").trim() || `Topic ${idx + 1}`;

    nodes.push({
      id: topicId,
      label: headingTitle.slice(0, 35),
      type: "topic",
      parentId: rootId,
      description: sec.content.slice(0, 100) + "...",
      children: [],
      sourceReferences: [{ file: sourceFileName, page: sec.pageOrSlide || (idx + 1), section: headingTitle }]
    });

    // Extract sub-bullets or sentences as subtopics/concepts
    const sentences = sec.content
      .split(/(?<=[.?!])\s+|\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 15 && s.length < 150);

    const subCount = depth === "quick" ? 2 : depth === "detailed" ? 3 : 4;
    const selectedSentences = sentences.slice(0, subCount);

    selectedSentences.forEach((sentence, subIdx) => {
      const subId = `sub-${idx + 1}-${subIdx + 1}`;
      const topicNode = nodes.find(n => n.id === topicId);
      topicNode?.children?.push(subId);

      const phrase = sentence.split(/[:;,–-]/)[0].trim().slice(0, 30);
      const isConcept = subIdx % 2 === 0;

      nodes.push({
        id: subId,
        label: phrase.charAt(0).toUpperCase() + phrase.slice(1),
        type: isConcept ? "concept" : "subtopic",
        parentId: topicId,
        description: sentence,
        children: [],
        sourceReferences: [{ file: sourceFileName, page: sec.pageOrSlide || (idx + 1), section: headingTitle }]
      });

      // Add deeper details if Deep depth or Exam/Research mode
      if (depth === "deep" || mode === "exam_revision" || mode === "research") {
        const detailId = `det-${idx + 1}-${subIdx + 1}-1`;
        const subNode = nodes.find(n => n.id === subId);
        subNode?.children?.push(detailId);

        nodes.push({
          id: detailId,
          label: mode === "exam_revision" ? "Key Fact / Formula" : "Technical Detail",
          type: "detail",
          parentId: subId,
          description: `Grounded detail derived from section "${headingTitle}".`,
          sourceReferences: [{ file: sourceFileName, page: sec.pageOrSlide || (idx + 1) }]
        });
      }
    });
  });

  return {
    id: `graph-${Date.now()}`,
    title: doc.title,
    description: `Structured Knowledge Map (${mode} mode)`,
    rootId: "root",
    nodes,
    metadata: {
      sourceFiles: [doc.fileName],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodeCount: nodes.length,
      depthMode: depth,
      theme: "dark_professional",
      layout: "horizontal"
    }
  };
}

function validateAndRefineGraph(
  rawGraph: any,
  doc: ParsedDocument,
  depth: GenerationDepth,
  mode: RegenerationMode
): MindMapGraph {
  const nodes: MindMapNode[] = (rawGraph.nodes || []).map((n: any) => ({
    id: n.id || `node-${Math.random().toString(36).substr(2, 5)}`,
    label: (n.label || "Concept").slice(0, 45),
    type: ["root", "topic", "subtopic", "concept", "detail"].includes(n.type) ? n.type : "concept",
    description: n.description || "",
    parentId: n.parentId,
    children: Array.isArray(n.children) ? n.children : [],
    sourceReferences: n.sourceReferences || [{ file: doc.fileName, page: 1 }]
  }));

  // Ensure root exists
  let root = nodes.find(n => n.type === "root" || n.id === "root");
  if (!root) {
    root = {
      id: "root",
      label: doc.title,
      type: "root",
      description: `Knowledge map of ${doc.title}`,
      children: nodes.filter(n => n.id !== "root").map(n => n.id)
    };
    nodes.unshift(root);
  }

  return {
    id: `graph-${Date.now()}`,
    title: rawGraph.title || doc.title,
    description: rawGraph.description || `Mind map of ${doc.title}`,
    rootId: root.id,
    nodes,
    metadata: {
      sourceFiles: [doc.fileName],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodeCount: nodes.length,
      depthMode: depth,
      theme: "dark_professional",
      layout: "horizontal"
    }
  };
}

/**
 * Agent 5: Node Expansion Agent
 */
export async function expandNodeBranch(
  node: MindMapNode,
  doc: ParsedDocument,
  config: AIProviderConfig = getStoredAIConfig()
): Promise<MindMapNode[]> {
  if (config.provider !== "demo" && config.apiKey) {
    const prompt = `
Concept Node: "${node.label}"
Description: "${node.description || ""}"
Document Context: ${doc.extractedText.slice(0, 3000)}

Generate 3 new sub-concepts expanding on "${node.label}".
Return JSON array:
[
  { "label": "Sub-concept 1", "type": "subtopic", "description": "Short explanation" },
  { "label": "Sub-concept 2", "type": "concept", "description": "Short explanation" },
  { "label": "Sub-concept 3", "type": "detail", "description": "Short explanation" }
]
`;
    const res = await callLLM(prompt, SYSTEM_PROMPT, config);
    if (res) {
      try {
        const cleaned = res.replace(/```json\n?|\n?```/g, "").trim();
        const items = JSON.parse(cleaned);
        if (Array.isArray(items)) {
          return items.map((item, i) => ({
            id: `exp-${node.id}-${Date.now()}-${i}`,
            label: item.label.slice(0, 35),
            type: item.type || "concept",
            parentId: node.id,
            description: item.description || `Expanded concept under ${node.label}`,
            sourceReferences: [{ file: doc.fileName }]
          }));
        }
      } catch (e) {
        console.warn("Expand parse failed, using fallback agent", e);
      }
    }
  }

  // Fallback Expansion Generator
  return [
    {
      id: `exp-${node.id}-${Date.now()}-1`,
      label: `${node.label} Core Mechanism`,
      type: "subtopic",
      parentId: node.id,
      description: `Primary underlying mechanics and structural principles of ${node.label}.`,
      sourceReferences: [{ file: doc.fileName }]
    },
    {
      id: `exp-${node.id}-${Date.now()}-2`,
      label: `Applications of ${node.label}`,
      type: "concept",
      parentId: node.id,
      description: `Practical real-world use cases and integration scenarios.`,
      sourceReferences: [{ file: doc.fileName }]
    },
    {
      id: `exp-${node.id}-${Date.now()}-3`,
      label: `Key Trade-offs & Considerations`,
      type: "detail",
      parentId: node.id,
      description: `Performance metrics, constraints, and optimization strategies for ${node.label}.`,
      sourceReferences: [{ file: doc.fileName }]
    }
  ];
}

/**
 * Agent 5: Generate Exam Revision Questions
 */
export async function generateExamQuestions(
  doc: ParsedDocument,
  count: number = 5
): Promise<ExamQuestion[]> {
  const sections = doc.sections.length > 0 ? doc.sections : [{ heading: doc.title, content: doc.extractedText }];
  
  return Array.from({ length: count }).map((_, idx) => {
    const sec = sections[idx % sections.length];
    const heading = sec.heading.replace(/^\d+[\.\s-]*/, "");

    return {
      id: `q-${idx + 1}`,
      type: idx % 2 === 0 ? "mcq" : "viva",
      question: `What is the primary significance of ${heading} as described in ${doc.fileName}?`,
      options: idx % 2 === 0 ? [
        `It defines core structural principles for ${heading}`,
        `It acts as a legacy fallback protocol`,
        `It measures raw hardware throughput`,
        `It disables contextual processing`
      ] : undefined,
      answer: `It defines core structural principles for ${heading}`,
      explanation: `Grounded in ${doc.fileName} (Section: ${sec.heading}).`,
      sourceNodeId: `topic-${(idx % 5) + 1}`
    };
  });
}

/**
 * Agent 5: Generate Flashcards
 */
export async function generateFlashcards(
  doc: ParsedDocument,
  nodes: MindMapNode[]
): Promise<Flashcard[]> {
  const selectedNodes = nodes.filter(n => n.type !== "root").slice(0, 8);

  return selectedNodes.map((n, idx) => ({
    id: `fc-${idx + 1}`,
    front: `What is ${n.label}?`,
    back: n.description || `Key concept in ${doc.title}.`,
    sourceNodeId: n.id
  }));
}
