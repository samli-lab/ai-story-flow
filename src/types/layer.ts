// 层、节点、分支相关类型定义

export interface Layer {
  id: string;
  script_id: string;
  layer_order: number;
  title: string;
  description?: string;
  is_collapsed: boolean;
  created_at: string;
  updated_at: string;
  nodes?: StoryNode[];
}

export interface StoryNode {
  id: string;
  layer_id: string;
  node_order: number;
  title: string;
  content: string;
  duration?: number;
  position_x?: number; // 节点在画布上的X坐标
  position_y?: number; // 节点在画布上的Y坐标
  metadata?: {
    camera_type?: string;
    characters?: string[];
    scene?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
  branches?: Branch[];
}

export interface Branch {
  id: string;
  from_node_id: string;
  to_node_id: string;
  branch_label?: string;
  branch_type: 'default' | 'choice' | 'condition';
  condition?: any;
  branch_order: number;
  created_at: string;
}

