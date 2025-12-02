// AI 生成初始节点服务
const NODE_AI_API_URL = import.meta.env.VITE_NODE_AI_API_URL || '';

export interface GenerateInitialNodeRequest {
  modelId: string;
  promptId: string;
  history: Array<{
    role: string;
    content: string;
  }>;
  featureFlag: string;
  streamReply: boolean;
  question: string;
}

export interface GenerateInitialNodeResponse {
  content?: string;
  text?: string;
  message?: string;
  data?: {
    content?: string;
    text?: string;
  };
  [key: string]: any;
}

export interface GenerateInitialNodeResult {
  content: string; // 解析后的内容（已移除 options 标签）
  options: string[];
  rawContent: string; // AI 返回的原始内容（包含 options 标签）
}

/**
 * 解析 AI 返回的内容，提取故事内容和选项
 * @param rawContent 原始内容
 * @returns 解析后的内容和选项
 */
const parseAIResponse = (rawContent: string): GenerateInitialNodeResult => {
  const originalRawContent = rawContent; // 保存原始内容
  let content = rawContent;
  const options: string[] = [];

  // 先移除代码块标记 ```
  content = content.replace(/```[\s\S]*?```/g, '').trim();

  // 查找 <options> 标签
  const optionsMatch = content.match(/<options>([\s\S]*?)<\/options>/i);
  if (optionsMatch) {
    const optionsText = optionsMatch[1].trim();
    
    // 从 <options> 标签中提取选项
    // 按行分割，过滤空行
    const lines = optionsText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    lines.forEach(line => {
      // 移除编号前缀（如 "1. " 或 "1."）和引号
      const cleaned = line.replace(/^\d+\.\s*/, '').replace(/^["']|["']$/g, '').trim();
      if (cleaned.length > 0 && !cleaned.startsWith('{') && !cleaned.startsWith('[')) {
        // 排除 JSON 格式的行
        options.push(cleaned);
      }
    });
    
    // 移除 <options> 标签及其内容
    content = content.replace(optionsMatch[0], '').trim();
  }

  // 移除 JSON 格式的选项数据（如果在 <options> 标签外）
  try {
    const jsonMatch = content.match(/\{"items":\s*\[[\s\S]*?\]\}/);
    if (jsonMatch) {
      content = content.replace(jsonMatch[0], '').trim();
    }
  } catch (e) {
    // JSON 解析失败，忽略
  }

  // 再次清理代码块标记（防止有残留）
  content = content.replace(/```[\s\S]*?```/g, '').trim();
  // 清理多余的换行
  content = content.replace(/\n{3,}/g, '\n\n').trim();

  return {
    content: content.trim(),
    options: options.filter(opt => opt.length > 0),
    rawContent: originalRawContent, // 返回原始内容
  };
};

/**
 * 调用 AI API 生成初始节点内容
 * @param outline 剧本大纲
 * @returns 生成的节点内容和选项
 */
export const generateInitialNode = async (outline: string): Promise<GenerateInitialNodeResult> => {
  if (!NODE_AI_API_URL) {
    throw new Error('AI 节点生成 API URL 未配置，请在 .env 文件中设置 VITE_NODE_AI_API_URL');
  }

  if (!outline || outline.trim().length === 0) {
    throw new Error('请先填写剧本大纲');
  }

  const apiUrl = `${NODE_AI_API_URL}/chat/simple-chat`;
  const question = `Please generate a script based on the outline provided above. Each script should be no longer than 400 words. ${outline.trim()}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelId: '剧本-副本',
        promptId: 'x09UFh3AtIcSO2lJ0UFcF',
        history: [],
        featureFlag: 'normal',
        streamReply: false,
        question: question,
      } as GenerateInitialNodeRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const result: GenerateInitialNodeResponse = await response.json();
    
    // 支持多种响应格式
    let rawContent = '';
    if (result.content) {
      rawContent = result.content;
    } else if (result.text) {
      rawContent = result.text;
    } else if (result.message) {
      rawContent = result.message;
    } else if (result.data?.content) {
      rawContent = result.data.content;
    } else if (result.data?.text) {
      rawContent = result.data.text;
    } else {
      // 如果响应是对象，尝试转换为字符串
      rawContent = JSON.stringify(result, null, 2);
    }

    // 解析内容和选项
    return parseAIResponse(rawContent);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('生成初始节点失败，请检查网络连接和 API 配置');
  }
};

