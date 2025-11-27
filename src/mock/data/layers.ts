// Mock 层和节点数据
import { Layer, StoryNode, Branch } from '../../types/layer';

// 生成6个层，金字塔结构的mock数据
// 第1层：1个节点
// 第2层：2个节点（每个节点从第1层分出）
// 第3层：4个节点（每个节点从第2层分出）
// 第4层：8个节点（每个节点从第3层分出）
// 以此类推
export const generateMockLayers = (scriptId: string): Layer[] => {
  const layers: Layer[] = [];
  let nodeIdCounter = 1;
  let branchIdCounter = 1;
  
  // 存储每层的节点ID，用于创建分支连接
  const layerNodeIds: string[][] = [];

  for (let layerOrder = 1; layerOrder <= 6; layerOrder++) {
    const layerId = `layer-${layerOrder}`;
    const nodes: StoryNode[] = [];
    
    // 计算当前层的节点数量（金字塔结构：1, 2, 4, 8, 16, 32...）
    const nodeCount = Math.pow(2, layerOrder - 1);
    
    // 当前层的节点ID数组
    const currentLayerNodeIds: string[] = [];

    // 创建当前层的节点
    for (let nodeOrder = 1; nodeOrder <= nodeCount; nodeOrder++) {
      const nodeId = `node-${nodeIdCounter++}`;
      currentLayerNodeIds.push(nodeId);
      const branches: Branch[] = [];

      // 如果不是最后一层，创建分支连接到下一层的节点
      if (layerOrder < 6) {
        // 下一层的节点数量
        const nextLayerNodeCount = Math.pow(2, layerOrder);
        // 当前节点在层中的索引（从0开始）
        const currentNodeIndex = nodeOrder - 1;
        // 每个节点分出2个分支到下一层
        const startIndex = currentNodeIndex * 2;
        
        // 创建2个分支
        for (let branchIndex = 0; branchIndex < 2; branchIndex++) {
          const nextNodeIndex = startIndex + branchIndex;
          if (nextNodeIndex < nextLayerNodeCount) {
            // 下一层的节点ID需要预先计算
            // 由于下一层还没创建，我们需要使用公式计算
            const nextLayerStartNodeId = `node-${nodeIdCounter + nextNodeIndex}`;
            branches.push({
              id: `branch-${branchIdCounter++}`,
              from_node_id: nodeId,
              to_node_id: nextLayerStartNodeId,
              branch_label: branchIndex === 0 ? '选择A' : '选择B',
              branch_type: 'choice',
              branch_order: branchIndex + 1,
              created_at: new Date().toISOString(),
            });
          }
        }
      }

      nodes.push({
        id: nodeId,
        layer_id: layerId,
        node_order: nodeOrder,
        title: `第${layerOrder}层 - 节点${nodeOrder}`,
        content: `这是第${layerOrder}层第${nodeOrder}个节点的内容。\n\n这里可以描述场景、对话、动作等详细信息。\n\n点击编辑可以修改此内容。`,
        duration: 30 + (layerOrder - 1) * 10 + nodeOrder * 5,
        metadata: {
          camera_type: layerOrder % 2 === 0 ? '特写' : '全景',
          characters: [`角色${nodeOrder}`],
          scene: `场景${layerOrder}`,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        branches,
      });
    }
    
    layerNodeIds.push(currentLayerNodeIds);

    layers.push({
      id: layerId,
      script_id: scriptId,
      layer_order: layerOrder,
      title: `第${layerOrder}幕`,
      description: `第${layerOrder}幕的描述信息（${nodeCount}个节点）`,
      is_collapsed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      nodes,
    });
  }

  // 重新处理分支连接，使用实际的节点ID
  layers.forEach((layer, layerIndex) => {
    if (layerIndex < layers.length - 1) {
      const nextLayer = layers[layerIndex + 1];
      const currentNodeIds = layerNodeIds[layerIndex];
      const nextNodeIds = layerNodeIds[layerIndex + 1];
      
      layer.nodes?.forEach((node, nodeIndex) => {
        const branches: Branch[] = [];
        const startIndex = nodeIndex * 2;
        
        // 每个节点分出2个分支
        for (let branchIndex = 0; branchIndex < 2; branchIndex++) {
          const nextNodeIndex = startIndex + branchIndex;
          if (nextNodeIndex < nextNodeIds.length && nextLayer.nodes) {
            const nextNode = nextLayer.nodes[nextNodeIndex];
            branches.push({
              id: `branch-${branchIdCounter++}`,
              from_node_id: node.id,
              to_node_id: nextNode.id,
              branch_label: branchIndex === 0 ? '选择A' : '选择B',
              branch_type: 'choice',
              branch_order: branchIndex + 1,
              created_at: new Date().toISOString(),
            });
          }
        }
        
        // 更新节点的分支
        node.branches = branches;
      });
    }
  });

  return layers;
};

// 获取剧本的所有层和节点
export const getLayersByScriptId = async (scriptId: string): Promise<Layer[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  return generateMockLayers(scriptId);
};

// 获取单个节点
export const getNodeById = async (nodeId: string, layers: Layer[]): Promise<StoryNode | null> => {
  for (const layer of layers) {
    const node = layer.nodes?.find(n => n.id === nodeId);
    if (node) return node;
  }
  return null;
};

// 更新节点内容
export const updateNodeContent = async (
  nodeId: string,
  content: string,
  layers: Layer[]
): Promise<StoryNode | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  for (const layer of layers) {
    const nodeIndex = layer.nodes?.findIndex(n => n.id === nodeId);
    if (nodeIndex !== undefined && nodeIndex >= 0 && layer.nodes) {
      layer.nodes[nodeIndex] = {
        ...layer.nodes[nodeIndex],
        content,
        updated_at: new Date().toISOString(),
      };
      return layer.nodes[nodeIndex];
    }
  }
  return null;
};

