// 层服务 API
import { Layer } from '../types/layer';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

// 获取剧本的所有层
export const getLayers = async (scriptId: string): Promise<Layer[]> => {
  const layers = await apiGet<Layer[]>(`/api/scripts/${scriptId}/layers`);
  // 确保按 layer_order 排序
  return layers.sort((a, b) => a.layer_order - b.layer_order);
};

// 创建层
export interface CreateLayerParams {
  title: string;
  description?: string;
  layer_order?: number; // 可选，如果不提供则自动计算
}

export const createLayer = async (
  scriptId: string,
  params: CreateLayerParams
): Promise<Layer> => {
  const layer = await apiPost<Layer>(`/api/scripts/${scriptId}/layers`, params);
  return layer;
};

// 更新层
export interface UpdateLayerParams {
  title?: string;
  description?: string;
  is_collapsed?: boolean;
}

export const updateLayer = async (
  scriptId: string,
  layerId: string,
  params: UpdateLayerParams
): Promise<Layer> => {
  const layer = await apiPut<Layer>(`/api/scripts/${scriptId}/layers/${layerId}`, params);
  return layer;
};

// 删除层
export const deleteLayer = async (
  scriptId: string,
  layerId: string
): Promise<void> => {
  await apiDelete(`/api/scripts/${scriptId}/layers/${layerId}`);
};

