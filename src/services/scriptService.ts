// 剧本服务 API
import {
  Script,
  CreateScriptParams,
  UpdateScriptParams,
} from "../types/script";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";

// API 响应类型
interface ScriptListResponse {
  total: number;
  page: number;
  page_size: number;
  items: Script[];
}

// 获取所有剧本列表
export const getScripts = async (params?: {
  page?: number;
  page_size?: number;
  status?: "draft" | "editing" | "completed" | "archived";
  keyword?: string;
}): Promise<Script[]> => {
  const response = await apiGet<ScriptListResponse>("/api/scripts", params);
  return response.items;
};

// 根据ID获取剧本
export const getScriptById = async (id: string): Promise<Script | null> => {
  try {
    const script = await apiGet<Script>(`/api/scripts/${id}`);
    return script;
  } catch (error) {
    console.error("获取剧本失败:", error);
    return null;
  }
};

// 创建新剧本
export const createScript = async (
  params: CreateScriptParams
): Promise<Script> => {
  const script = await apiPost<Script>("/api/scripts", params);
  return script;
};

// 更新剧本
export const updateScript = async (
  id: string,
  params: UpdateScriptParams
): Promise<Script> => {
  const script = await apiPut<Script>(`/api/scripts/${id}`, params);
  return script;
};

// 删除剧本（软删除）
export const deleteScript = async (id: string): Promise<void> => {
  await apiDelete(`/api/scripts/${id}`);
};

// 重命名剧本
export const renameScript = async (
  id: string,
  newTitle: string
): Promise<Script> => {
  return updateScript(id, { title: newTitle });
};

// 更新剧本标签
export const updateScriptTags = async (
  id: string,
  tags: string[]
): Promise<Script> => {
  return updateScript(id, { tags });
};
