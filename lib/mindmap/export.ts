import { MindMapGraph, MindMapNode } from "@/types";

/**
 * Converts MindMapGraph into valid Mermaid mindmap syntax.
 */
export function exportToMermaid(graph: MindMapGraph): string {
  const rootNode = graph.nodes.find(n => n.id === graph.rootId) || graph.nodes[0];
  if (!rootNode) return "mindmap\n  root((Mind Map))";

  let result = `mindmap\n  root(("${escapeMermaidText(rootNode.label)}"))\n`;

  function buildBranch(parentId: string, indentLevel: number): string {
    let text = "";
    const children = graph.nodes.filter(n => n.parentId === parentId);
    const indent = " ".repeat(indentLevel * 2 + 2);

    for (const child of children) {
      const cleanLabel = escapeMermaidText(child.label);
      if (child.type === "topic") {
        text += `${indent}${cleanLabel}\n`;
      } else if (child.type === "subtopic" || child.type === "concept") {
        text += `${indent}${cleanLabel}\n`;
      } else {
        text += `${indent}${cleanLabel}\n`;
      }
      text += buildBranch(child.id, indentLevel + 1);
    }
    return text;
  }

  result += buildBranch(rootNode.id, 1);
  return result;
}

function escapeMermaidText(text: string): string {
  return text.replace(/["()]/g, "").trim();
}

/**
 * Converts MindMapGraph into formatted Markdown outline.
 */
export function exportToMarkdown(graph: MindMapGraph): string {
  const rootNode = graph.nodes.find(n => n.id === graph.rootId) || graph.nodes[0];
  if (!rootNode) return `# ${graph.title}\n`;

  let md = `# ${rootNode.label}\n\n${rootNode.description || ""}\n\n`;

  function appendNodeMarkdown(parentId: string, depth: number) {
    const children = graph.nodes.filter(n => n.parentId === parentId);
    const prefix = "#".repeat(Math.min(depth, 6));

    for (const child of children) {
      md += `${prefix} ${child.label}\n`;
      if (child.description) {
        md += `${child.description}\n\n`;
      }
      if (child.sourceReferences && child.sourceReferences.length > 0) {
        const sr = child.sourceReferences[0];
        md += `*Source: ${sr.file}${sr.page ? `, Page ${sr.page}` : ""}${sr.section ? `, Section ${sr.section}` : ""}*\n\n`;
      }
      appendNodeMarkdown(child.id, depth + 1);
    }
  }

  appendNodeMarkdown(rootNode.id, 2);
  return md;
}

/**
 * Downloads data string as a file on client.
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
