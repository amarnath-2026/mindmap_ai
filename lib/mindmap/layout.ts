import dagre from "@dagrejs/dagre";
import { MindMapNode, MindMapEdge, LayoutDirection, ThemeMode } from "@/types";

export interface GraphLayoutResult {
  nodes: (MindMapNode & { position: { x: number; y: number } })[];
  edges: MindMapEdge[];
}

/**
 * Calculates node coordinates and edges based on chosen layout algorithm (LR, TB, Radial, Tree).
 */
export function calculateGraphLayout(
  rawNodes: MindMapNode[],
  layoutDirection: LayoutDirection = "horizontal"
): GraphLayoutResult {
  // Filter visible nodes if collapsible branch feature is active
  const collapsedMap = new Set<string>();
  rawNodes.forEach(n => {
    if (n.collapsed && n.children) {
      const addChildrenToCollapsed = (childIds: string[]) => {
        childIds.forEach(id => {
          collapsedMap.add(id);
          const childNode = rawNodes.find(cn => cn.id === id);
          if (childNode?.children) addChildrenToCollapsed(childNode.children);
        });
      };
      addChildrenToCollapsed(n.children);
    }
  });

  const visibleNodes = rawNodes.filter(n => !collapsedMap.has(n.id));

  // Construct edges from parent-child relationships
  const edges: MindMapEdge[] = [];
  visibleNodes.forEach(n => {
    if (n.parentId && visibleNodes.some(vn => vn.id === n.parentId)) {
      edges.push({
        id: `e-${n.parentId}-${n.id}`,
        source: n.parentId,
        target: n.id,
        type: "smoothstep",
        animated: false
      });
    }
  });

  if (layoutDirection === "radial") {
    return layoutRadialGraph(visibleNodes, edges);
  }

  // Dagre layout configuration for LR (horizontal) or TB (vertical / tree)
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: layoutDirection === "horizontal" ? "LR" : "TB",
    nodesep: layoutDirection === "tree" ? 30 : 45,
    ranksep: layoutDirection === "horizontal" ? 180 : 110,
    marginx: 50,
    marginy: 50
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Define node dimensions based on node type
  visibleNodes.forEach(n => {
    const isRoot = n.type === "root";
    const isTopic = n.type === "topic";
    const width = isRoot ? 260 : isTopic ? 220 : 190;
    const height = isRoot ? 90 : isTopic ? 75 : 65;

    g.setNode(n.id, { width, height });
  });

  edges.forEach(e => {
    g.setEdge(e.source, e.target);
  });

  dagre.layout(g);

  const laidOutNodes = visibleNodes.map(n => {
    const nodeWithPos = g.node(n.id);
    const isRoot = n.type === "root";
    const isTopic = n.type === "topic";
    const width = isRoot ? 260 : isTopic ? 220 : 190;
    const height = isRoot ? 90 : isTopic ? 75 : 65;

    return {
      ...n,
      position: {
        x: (nodeWithPos?.x || 0) - width / 2,
        y: (nodeWithPos?.y || 0) - height / 2
      }
    };
  });

  return { nodes: laidOutNodes, edges };
}

function layoutRadialGraph(
  nodes: MindMapNode[],
  edges: MindMapEdge[]
): GraphLayoutResult {
  const root = nodes.find(n => n.type === "root") || nodes[0];
  const radiusStep = 220;

  const resultNodes = nodes.map(n => {
    if (n.id === root.id) {
      return { ...n, position: { x: 0, y: 0 } };
    }
    return { ...n, position: { x: 0, y: 0 } };
  });

  // Calculate angles for level 1 topics
  const l1Nodes = nodes.filter(n => n.parentId === root.id);
  const totalL1 = l1Nodes.length || 1;
  const angleStep = (2 * Math.PI) / totalL1;

  l1Nodes.forEach((l1, i) => {
    const angle = i * angleStep;
    const l1X = radiusStep * Math.cos(angle);
    const l1Y = radiusStep * Math.sin(angle);

    const nodeRef = resultNodes.find(n => n.id === l1.id);
    if (nodeRef) nodeRef.position = { x: l1X, y: l1Y };

    // Subchildren
    const children = nodes.filter(n => n.parentId === l1.id);
    if (children.length > 0) {
      const subAngleSpread = Math.PI / 3;
      const subAngleStep = children.length > 1 ? subAngleSpread / (children.length - 1) : 0;
      const startAngle = angle - subAngleSpread / 2;

      children.forEach((c, j) => {
        const subAngle = startAngle + j * subAngleStep;
        const subX = l1X + (radiusStep * 0.9) * Math.cos(subAngle);
        const subY = l1Y + (radiusStep * 0.9) * Math.sin(subAngle);
        const subNodeRef = resultNodes.find(n => n.id === c.id);
        if (subNodeRef) subNodeRef.position = { x: subX, y: subY };
      });
    }
  });

  return { nodes: resultNodes, edges };
}
