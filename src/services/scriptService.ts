// 剧本服务 API（使用 Mock 数据）
import { Script, CreateScriptParams, UpdateScriptParams } from '../types/script';
import { mockScripts, mockDelay } from '../mock/data/scripts';

// 存储当前脚本列表（模拟数据库）
let scriptsData: Script[] = [...mockScripts];

// 获取所有剧本列表
export const getScripts = async (): Promise<Script[]> => {
  await mockDelay(300);
  return scriptsData.filter(script => !script.deleted_at);
};

// 根据ID获取剧本
export const getScriptById = async (id: string): Promise<Script | null> => {
  await mockDelay(200);
  const script = scriptsData.find(s => s.id === id && !s.deleted_at);
  return script || null;
};

// 创建新剧本
export const createScript = async (params: CreateScriptParams): Promise<Script> => {
  await mockDelay(500);
  const newScript: Script = {
    id: Date.now().toString(),
    user_id: 'user-1',
    title: params.title,
    description: params.description,
    outline: params.outline,
    status: 'draft',
    is_auto_generated: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: params.tags?.map((tagName, index) => ({
      id: `tag-${Date.now()}-${index}`,
      script_id: Date.now().toString(),
      tag_name: tagName,
      color: getTagColor(tagName),
      created_at: new Date().toISOString(),
    })),
  };
  scriptsData.push(newScript);
  return newScript;
};

// 更新剧本
export const updateScript = async (
  id: string,
  params: UpdateScriptParams
): Promise<Script> => {
  await mockDelay(400);
  const index = scriptsData.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('剧本不存在');
  }
  
  const updatedScript: Script = {
    ...scriptsData[index],
    ...params,
    updated_at: new Date().toISOString(),
    tags: params.tags?.map((tagName, tagIndex) => ({
      id: `tag-${Date.now()}-${tagIndex}`,
      script_id: id,
      tag_name: tagName,
      color: getTagColor(tagName),
      created_at: new Date().toISOString(),
    })) || scriptsData[index].tags,
  };
  
  scriptsData[index] = updatedScript;
  return updatedScript;
};

// 删除剧本（软删除）
export const deleteScript = async (id: string): Promise<void> => {
  await mockDelay(300);
  const index = scriptsData.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('剧本不存在');
  }
  scriptsData[index].deleted_at = new Date().toISOString();
};

// 重命名剧本
export const renameScript = async (id: string, newTitle: string): Promise<Script> => {
  return updateScript(id, { title: newTitle });
};

// 更新剧本标签
export const updateScriptTags = async (id: string, tags: string[]): Promise<Script> => {
  return updateScript(id, { tags });
};

// 获取标签颜色（简单映射）
const getTagColor = (tagName: string): string => {
  const colorMap: Record<string, string> = {
    '科幻': '#1890ff',
    '悬疑': '#722ed1',
    '爱情': '#f5222d',
    '武侠': '#fa8c16',
    '恐怖': '#000000',
    '冒险': '#52c41a',
    '推理': '#eb2f96',
    '古装': '#13c2c2',
  };
  return colorMap[tagName] || '#595959';
};

