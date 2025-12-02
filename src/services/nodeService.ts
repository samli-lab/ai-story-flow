// 节点服务 API
import { StoryNode } from '../types/layer';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

// 获取单个节点
export const getNode = async (scriptId: string, nodeId: string): Promise<StoryNode> => {
  const node = await apiGet<StoryNode>(`/api/scripts/${scriptId}/nodes/${nodeId}`);
  return node;
};

// 创建节点
export interface CreateNodeParams {
  title: string;
  content: string;
  duration?: number;
  node_order?: number; // 可选，如果不提供则自动计算
  position_x?: number;
  position_y?: number;
  metadata?: {
    camera_type?: string;
    characters?: string[];
    scene?: string;
    [key: string]: any;
  };
}

export const createNode = async (
  scriptId: string,
  layerId: string,
  params: CreateNodeParams
): Promise<StoryNode> => {
  const node = await apiPost<StoryNode>(`/api/scripts/${scriptId}/layers/${layerId}/nodes`, params);
  return node;
};

// 更新节点
export interface UpdateNodeParams {
  title?: string;
  content?: string;
  duration?: number;
  position_x?: number;
  position_y?: number;
  metadata?: {
    camera_type?: string;
    characters?: string[];
    scene?: string;
    [key: string]: any;
  };
  change_reason?: string; // 变更原因：edit/regen/continue/restore
}

export const updateNode = async (
  scriptId: string,
  nodeId: string,
  params: UpdateNodeParams
): Promise<StoryNode> => {
  const node = await apiPut<StoryNode>(`/api/scripts/${scriptId}/nodes/${nodeId}`, params);
  return node;
};

// 批量更新节点位置
export interface NodePosition {
  node_id: string;
  position_x: number;
  position_y: number;
}

export interface BatchUpdatePositionsResponse {
  updated_count: number;
}

export const batchUpdateNodePositions = async (
  scriptId: string,
  nodes: NodePosition[]
): Promise<BatchUpdatePositionsResponse> => {
  const result = await apiPut<BatchUpdatePositionsResponse>(`/api/scripts/${scriptId}/nodes/positions`, { nodes });
  return result;
};

// 删除节点
export interface DeleteNodeResponse {
  deleted_node_id: string;
  deleted_branches_count: number;
}

export const deleteNode = async (
  scriptId: string,
  nodeId: string
): Promise<DeleteNodeResponse> => {
  const result = await apiDelete<DeleteNodeResponse>(`/api/scripts/${scriptId}/nodes/${nodeId}`);
  return result;
};

