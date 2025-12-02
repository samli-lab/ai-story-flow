// API 配置
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// API 错误类型
export interface ApiError {
  code: number;
  message: string;
  error?: {
    type: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

// 获取认证 Token（从 localStorage 或其他地方）
const getAuthToken = (): string | null => {
  // TODO: 从实际的认证存储中获取 token
  return localStorage.getItem("auth_token");
};

// 通用 API 请求函数
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const result: ApiResponse<T> | ApiError = await response.json();

    if (!response.ok) {
      throw new Error((result as ApiError).message || "请求失败");
    }

    if ((result as ApiResponse<T>).code !== 200) {
      throw new Error((result as ApiResponse<T>).message || "请求失败");
    }

    return (result as ApiResponse<T>).data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// GET 请求
export const apiGet = <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> => {
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  }
  return apiRequest<T>(url, { method: "GET" });
};

// POST 请求
export const apiPost = <T>(endpoint: string, data?: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
};

// PUT 请求
export const apiPut = <T>(endpoint: string, data?: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
};

// DELETE 请求
export const apiDelete = <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: "DELETE" });
};
