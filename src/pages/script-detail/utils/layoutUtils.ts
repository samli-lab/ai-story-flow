import { Toast } from "@douyinfe/semi-ui";
import { StoryNode, Layer } from "../../../types/layer";

interface NodeDimension {
  id: string;
  leftExtent: number;
  rightExtent: number;
  x: number; // X offset relative to parent
  children: NodeDimension[];
}

interface AutoLayoutOptions {
  layers: Layer[];
  layoutDirection: "horizontal" | "vertical";
  mode?: "tree" | "compact";
  nodeWidth?: number;
  gapX?: number;
  gapY?: number;
}

/**
 * Auto-layout nodes
 */
export const calculateNodePositions = (
  options: AutoLayoutOptions
): Layer[] | null => {
  const {
    layers,
    layoutDirection,
    mode = "tree",
    nodeWidth = 220,
    gapX = 60,
    gapY = 180,
  } = options;

  if (layers.length === 0) {
    Toast.warning("没有可整理的节点");
    return null;
  }

  const isHorizontal = layoutDirection === "horizontal";

  // 紧凑模式：按层简单排列
  if (mode === "compact") {
    const updatedLayers = layers.map((layer, layerIndex) => {
      const nodeCount = layer.nodes?.length || 0;
      if (nodeCount === 0) return layer;

      const nodeHeight = 120; // 假设节点高度

      // 在紧凑模式下，将 gapX 设置为非常小的值，使节点紧挨着
      const compactGap = -20;

      let totalSize;
      if (isHorizontal) {
        // 水平布局：同层节点垂直排列
        totalSize = nodeCount * nodeHeight + (nodeCount - 1) * compactGap;
      } else {
        // 垂直布局：同层节点水平排列
        totalSize = nodeCount * nodeWidth + (nodeCount - 1) * compactGap;
      }

      let startPos =
        -totalSize / 2 + (isHorizontal ? nodeHeight : nodeWidth) / 2;

      const updatedNodes = layer.nodes?.map((node, nodeIndex) => {
        let x, y;

        if (isHorizontal) {
          // 水平布局：x由层决定，y由节点顺序决定
          // 层间距稍微留一点空隙，不用完全紧贴
          const layerGap = 200;
          x = layerIndex * layerGap;
          y = startPos + nodeIndex * (nodeHeight + compactGap);
        } else {
          // 垂直布局：y由层决定，x由节点顺序决定
          // 层间距稍微留一点空隙
          const layerGap = 190;
          y = layerIndex * layerGap;
          x = startPos + nodeIndex * (nodeWidth + compactGap);
        }

        // 加上偏移量，避免负坐标太偏
        x += isHorizontal ? 100 : 400;
        y += isHorizontal ? 300 : 100;

        return {
          ...node,
          position_x: x,
          position_y: y,
          updated_at: new Date().toISOString(),
        };
      });

      return {
        ...layer,
        nodes: updatedNodes,
        updated_at: new Date().toISOString(),
      };
    });
    return updatedLayers;
  }

  try {
    // 1. Build graph structure (Tree mode)
    const nodeMap = new Map<string, StoryNode>();
    const edgesMap = new Map<string, string[]>(); // parent -> children
    const inDegreeMap = new Map<string, number>();

    // Initialize Maps
    layers.forEach((layer) => {
      layer.nodes?.forEach((node) => {
        nodeMap.set(node.id, node);
        if (!edgesMap.has(node.id)) edgesMap.set(node.id, []);
        if (!inDegreeMap.has(node.id)) inDegreeMap.set(node.id, 0);
      });
    });

    // Establish connections
    layers.forEach((layer) => {
      layer.nodes?.forEach((node) => {
        node.branches?.forEach((branch) => {
          // 支持两种字段名格式：to_node_id 和 toNodeId
          const childId =
            (branch as any).to_node_id ?? (branch as any).toNodeId;
          if (childId && nodeMap.has(childId)) {
            edgesMap.get(node.id)?.push(childId);
            inDegreeMap.set(childId, (inDegreeMap.get(childId) || 0) + 1);
          }
        });
      });
    });

    // 2. Find roots (nodes with 0 in-degree)
    let roots = Array.from(inDegreeMap.entries())
      .filter(([_, count]) => count === 0)
      .map(([id]) => id);

    // Fallback if no roots found
    if (roots.length === 0) {
      // 支持两种字段名格式：layer_order 和 layerOrder
      const firstLayer = layers.find((l) => {
        const order = (l as any).layer_order ?? (l as any).layerOrder;
        return order === 1;
      });
      if (firstLayer && firstLayer.nodes && firstLayer.nodes.length > 0) {
        roots = [firstLayer.nodes[0].id];
      } else if (
        layers.length > 0 &&
        layers[0].nodes &&
        layers[0].nodes.length > 0
      ) {
        roots = [layers[0].nodes[0].id];
      }
    }

    roots = roots.filter((id) => nodeMap.has(id));

    if (roots.length === 0) {
      Toast.warning("无法确定根节点");
      return null;
    }

    // 3. Build layout tree (BFS)
    const layoutChildren = new Map<string, string[]>();
    const visited = new Set<string>();

    const buildTree = (rootId: string) => {
      const queue = [rootId];
      visited.add(rootId);

      while (queue.length > 0) {
        const u = queue.shift()!;
        const children = edgesMap.get(u) || [];
        const validChildren: string[] = [];

        children.forEach((v) => {
          if (!visited.has(v)) {
            visited.add(v);
            validChildren.push(v);
            queue.push(v);
          }
        });

        layoutChildren.set(u, validChildren);
      }
    };

    roots.forEach((root) => {
      if (!visited.has(root)) buildTree(root);
    });

    // 4. Calculate dimensions (Post-order)
    const calculateDimensions = (u: string): NodeDimension => {
      const childrenIds = layoutChildren.get(u) || [];
      const childrenDims = childrenIds.map((v) => calculateDimensions(v));

      if (childrenDims.length === 0) {
        return {
          id: u,
          leftExtent: nodeWidth / 2,
          rightExtent: nodeWidth / 2,
          x: 0,
          children: [],
        };
      }

      let currentX = 0;
      const childCenters: number[] = [];

      childrenDims.forEach((child) => {
        const childCenter = currentX + child.leftExtent;
        childCenters.push(childCenter);
        currentX += child.leftExtent + child.rightExtent + gapX;
      });

      const rowWidth = currentX - gapX;

      const firstChildCenter = childCenters[0];
      const lastChildCenter = childCenters[childCenters.length - 1];
      const parentCenter = (firstChildCenter + lastChildCenter) / 2;

      const leftExtent = Math.max(parentCenter, nodeWidth / 2);
      const rightExtent = Math.max(rowWidth - parentCenter, nodeWidth / 2);

      childrenDims.forEach((child, index) => {
        child.x = childCenters[index] - parentCenter;
      });

      return {
        id: u,
        leftExtent,
        rightExtent,
        x: 0,
        children: childrenDims,
      };
    };

    // 5. Assign absolute positions (Pre-order)
    const newPositions = new Map<string, { x: number; y: number }>();

    const assignAbsolutePositions = (
      node: NodeDimension,
      startX: number,
      startY: number
    ) => {
      newPositions.set(node.id, { x: startX, y: startY });

      node.children.forEach((child) => {
        assignAbsolutePositions(child, startX + child.x, startY + gapY);
      });
    };

    let currentRootX = 0;
    roots.forEach((root) => {
      const rootDim = calculateDimensions(root);
      const rootX = currentRootX + rootDim.leftExtent;
      assignAbsolutePositions(rootDim, rootX, 0);
      currentRootX += rootDim.leftExtent + rootDim.rightExtent + gapX * 2;
    });

    // 6. Apply updates
    const isHorizontal = layoutDirection === "horizontal";

    const updatedLayers = layers.map((layer) => ({
      ...layer,
      nodes: layer.nodes?.map((node) => {
        const pos = newPositions.get(node.id);
        if (pos) {
          let finalX = pos.x;
          let finalY = pos.y;

          if (isHorizontal) {
            const temp = finalX;
            finalX = finalY;
            finalY = temp;
          }

          finalX += isHorizontal ? 100 : 400;
          finalY += isHorizontal ? 300 : 100;

          return {
            ...node,
            position_x: finalX,
            position_y: finalY,
            updated_at: new Date().toISOString(),
          };
        }
        return node;
      }),
      updated_at: new Date().toISOString(),
    }));

    return updatedLayers;
  } catch (error) {
    console.error("Layout calculation failed:", error);
    throw error;
  }
};
