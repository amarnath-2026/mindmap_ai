import { MindMapGraph, MindMapVersion } from "@/types";

const STORAGE_KEY = "mindmap_ai_saved_graphs";
const HISTORY_KEY_PREFIX = "mindmap_ai_history_";

export function getSavedMindMaps(): MindMapGraph[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read saved mind maps", e);
    return [];
  }
}

export function saveMindMapGraph(graph: MindMapGraph): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedMindMaps();
    const idx = existing.findIndex(g => g.id === graph.id);
    const updatedGraph = {
      ...graph,
      metadata: {
        ...graph.metadata,
        updatedAt: new Date().toISOString()
      }
    };

    if (idx >= 0) {
      existing[idx] = updatedGraph;
    } else {
      existing.unshift(updatedGraph);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    // Also record snapshot in version history
    saveVersionSnapshot(graph.id, updatedGraph, "Saved Map edit");
  } catch (e) {
    console.error("Failed to save mind map graph", e);
  }
}

export function deleteSavedMindMap(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedMindMaps();
    const filtered = existing.filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete mind map", e);
  }
}

export function getVersionHistory(graphId: string): MindMapVersion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${HISTORY_KEY_PREFIX}${graphId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveVersionSnapshot(graphId: string, graph: MindMapGraph, description: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getVersionHistory(graphId);
    const newVersion: MindMapVersion = {
      id: `v-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description,
      graph: JSON.parse(JSON.stringify(graph))
    };
    // Keep max 10 versions
    const updatedHistory = [newVersion, ...history].slice(0, 10);
    localStorage.setItem(`${HISTORY_KEY_PREFIX}${graphId}`, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error("Failed to save version history", e);
  }
}
