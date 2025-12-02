// 分支服务 API
import { Branch } from '../types/layer';
import { apiPost, apiPut, apiDelete } from '../utils/api';

// 创建分支
export interface CreateBranchParams {
  from_node_id: string;
  to_node_id: string;
  branch_label?: string;
  branch_type?: 'default' | 'choice' | 'condition';
  branch_order?: number; // 可选，如果不提供则自动计算
  condition?: any;
}

export const createBranch = async (
  scriptId: string,
  params: CreateBranchParams
): Promise<Branch> => {
  const branch = await apiPost<Branch>(`/api/scripts/${scriptId}/branches`, params);
  return branch;
};

// 更新分支
export interface UpdateBranchParams {
  branch_label?: string;
  branch_type?: 'default' | 'choice' | 'condition';
  branch_order?: number;
  condition?: any;
}

export const updateBranch = async (
  scriptId: string,
  branchId: string,
  params: UpdateBranchParams
): Promise<Branch> => {
  const branch = await apiPut<Branch>(`/api/scripts/${scriptId}/branches/${branchId}`, params);
  return branch;
};

// 删除分支
export const deleteBranch = async (
  scriptId: string,
  branchId: string
): Promise<void> => {
  await apiDelete(`/api/scripts/${scriptId}/branches/${branchId}`);
};

