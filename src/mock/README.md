# Mock 数据说明

## 目录结构

```
src/mock/
└── data/
    └── scripts.ts      # 剧本相关的 mock 数据
```

## 使用说明

### 剧本 Mock 数据

`scripts.ts` 文件包含了预定义的剧本数据，用于开发和测试。

#### 数据结构

每个剧本包含以下字段：
- `id`: 唯一标识符
- `user_id`: 用户ID
- `title`: 剧本标题
- `description`: 剧本描述
- `outline`: 故事大纲
- `world_setting`: 世界观设置（JSON格式）
- `status`: 状态（draft/editing/completed/archived）
- `is_auto_generated`: 是否自动生成
- `created_at`: 创建时间
- `updated_at`: 更新时间
- `tags`: 标签列表

#### 预定义数据

当前包含 5 个示例剧本：
1. 科幻短剧：时间旅行者（编辑中）
2. 悬疑剧：消失的线索（草稿）
3. 爱情剧：重逢（已完成）
4. 古装剧：江湖恩怨（编辑中）
5. 恐怖剧：废弃医院（已归档）

### Mock 服务

所有 API 调用都通过 `src/services/scriptService.ts` 处理，该服务：
- 使用内存存储模拟数据库
- 模拟网络延迟（300-500ms）
- 支持 CRUD 操作
- 支持软删除

### 替换为真实 API

当后端 API 准备好后，只需修改 `src/services/scriptService.ts` 中的实现，将 mock 数据替换为真实的 API 调用即可。

示例：
```typescript
// 替换前（Mock）
export const getScripts = async (): Promise<Script[]> => {
  await mockDelay(300);
  return scriptsData.filter(script => !script.deleted_at);
};

// 替换后（真实 API）
export const getScripts = async (): Promise<Script[]> => {
  const response = await fetch('/api/scripts');
  return response.json();
};
```

