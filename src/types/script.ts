// 剧本相关类型定义

export interface Script {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  outline?: string;
  world_setting?: {
    era?: string;
    location?: string;
    main_characters?: string[];
    [key: string]: any;
  };
  status: 'draft' | 'editing' | 'completed' | 'archived';
  is_auto_generated: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  tags?: ScriptTag[];
}

export interface ScriptTag {
  id: string;
  script_id: string;
  tag_name: string;
  color?: string;
  created_at: string;
}

export interface CreateScriptParams {
  title: string;
  description?: string;
  outline?: string;
  tags?: string[];
}

export interface UpdateScriptParams {
  title?: string;
  description?: string;
  outline?: string;
  tags?: string[];
}

