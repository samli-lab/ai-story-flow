// AI 生成大纲服务
const AI_OUTLINE_API_URL = import.meta.env.VITE_AI_OUTLINE_API_URL || '';

export interface GenerateOutlineRequest {
  content: string;
}

export interface GenerateOutlineResponse {
  outline: string;
}

/**
 * 调用外部 API 生成剧本大纲
 * @param content 剧本原文内容
 * @returns 生成的大纲文本
 */
export const generateOutline = async (content: string): Promise<string> => {
  if (!AI_OUTLINE_API_URL) {
    throw new Error('AI 大纲生成 API URL 未配置，请在 .env 文件中设置 VITE_AI_OUTLINE_API_URL');
  }

  if (!content || content.trim().length === 0) {
    throw new Error('请输入剧本原文内容');
  }

  try {
    const response = await fetch(AI_OUTLINE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content.trim(),
      } as GenerateOutlineRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const result = await response.json();
    
    // 支持多种响应格式
    if (typeof result === 'string') {
      return result;
    } else if (result.outline) {
      return result.outline;
    } else if (result.data?.outline) {
      return result.data.outline;
    } else if (result.text) {
      return result.text;
    } else if (result.content) {
      return result.content;
    } else {
      // 如果响应是对象，尝试转换为字符串
      return JSON.stringify(result, null, 2);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('生成大纲失败，请检查网络连接和 API 配置');
  }
};

