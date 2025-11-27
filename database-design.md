# 数据库设计文档

## 概述

本文档描述了 AI 剧本生产系统的数据库表结构设计。系统使用 PostgreSQL 数据库，采用 Node.js 作为后端技术栈。

## 核心概念

- **剧本（Script）**：一个完整的剧本项目，包含多层结构化的叙事方案
- **层（Layer）**：剧本的分层结构，用于组织不同层级的叙事内容
- **节点（Node）**：每层中的具体片段，包含明确的内容、镜头长度等信息
- **分支（Branch）**：节点之间的连接关系，支持分支剧情

## 数据库表设计

### 1. 用户表（users）

存储系统用户信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 用户唯一标识 |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名 |
| email | VARCHAR(100) | UNIQUE, NOT NULL | 邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | 密码哈希值 |
| avatar_url | VARCHAR(500) | NULL | 头像URL |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |
| deleted_at | TIMESTAMP | NULL | 软删除时间 |

**索引：**
- `idx_users_email` ON `email`
- `idx_users_username` ON `username`
- `idx_users_deleted_at` ON `deleted_at`

---

### 2. 剧本表（scripts）

存储剧本的基本信息和元数据。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 剧本唯一标识 |
| user_id | UUID | FOREIGN KEY(users.id), NOT NULL | 创建者ID |
| title | VARCHAR(200) | NOT NULL | 剧本标题 |
| description | TEXT | NULL | 剧本描述 |
| outline | TEXT | NULL | 故事大纲（用户输入的原始大纲） |
| world_setting | JSONB | NULL | 基础世界观（JSON格式，包含世界观相关字段） |
| status | VARCHAR(20) | DEFAULT 'draft', NOT NULL | 状态：draft(草稿)/editing(编辑中)/completed(已完成)/archived(已归档) |
| is_auto_generated | BOOLEAN | DEFAULT FALSE | 是否自动生成的世界观 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |
| deleted_at | TIMESTAMP | NULL | 软删除时间 |

**索引：**
- `idx_scripts_user_id` ON `user_id`
- `idx_scripts_status` ON `status`
- `idx_scripts_created_at` ON `created_at DESC`
- `idx_scripts_deleted_at` ON `deleted_at`
- `idx_scripts_title` ON `title` (用于搜索)

**外键约束：**
- `fk_scripts_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE

---

### 3. 剧本标签表（script_tags）

存储剧本的标签信息，支持多对多关系。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 标签唯一标识 |
| script_id | UUID | FOREIGN KEY(scripts.id), NOT NULL | 剧本ID |
| tag_name | VARCHAR(50) | NOT NULL | 标签名称 |
| color | VARCHAR(20) | NULL | 标签颜色（用于UI展示） |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**索引：**
- `idx_script_tags_script_id` ON `script_id`
- `idx_script_tags_tag_name` ON `tag_name`
- `UNIQUE idx_script_tags_unique` ON (`script_id`, `tag_name`)

**外键约束：**
- `fk_script_tags_script_id` FOREIGN KEY (`script_id`) REFERENCES `scripts`(`id`) ON DELETE CASCADE

---

### 4. 层表（layers）

存储剧本的层级结构信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 层唯一标识 |
| script_id | UUID | FOREIGN KEY(scripts.id), NOT NULL | 所属剧本ID |
| layer_order | INTEGER | NOT NULL | 层顺序（从1开始） |
| title | VARCHAR(200) | NOT NULL | 层标题 |
| description | TEXT | NULL | 层描述 |
| is_collapsed | BOOLEAN | DEFAULT FALSE | UI展开/折叠状态（可选，用于前端状态保存） |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引：**
- `idx_layers_script_id` ON `script_id`
- `idx_layers_script_order` ON (`script_id`, `layer_order`)
- `UNIQUE idx_layers_script_order_unique` ON (`script_id`, `layer_order`)

**外键约束：**
- `fk_layers_script_id` FOREIGN KEY (`script_id`) REFERENCES `scripts`(`id`) ON DELETE CASCADE

---

### 5. 节点表（nodes）

存储每层中的具体片段节点信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 节点唯一标识 |
| layer_id | UUID | FOREIGN KEY(layers.id), NOT NULL | 所属层ID |
| node_order | INTEGER | NOT NULL | 节点在层中的顺序（从1开始） |
| title | VARCHAR(200) | NOT NULL | 节点标题 |
| content | TEXT | NOT NULL | 节点内容（结构化文本） |
| duration | INTEGER | NULL | 镜头长度（秒） |
| metadata | JSONB | NULL | 扩展元数据（JSON格式，可存储镜头类型、人物、场景等信息） |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引：**
- `idx_nodes_layer_id` ON `layer_id`
- `idx_nodes_layer_order` ON (`layer_id`, `node_order`)
- `UNIQUE idx_nodes_layer_order_unique` ON (`layer_id`, `node_order`)
- `idx_nodes_created_at` ON `created_at`

**外键约束：**
- `fk_nodes_layer_id` FOREIGN KEY (`layer_id`) REFERENCES `layers`(`id`) ON DELETE CASCADE

---

### 6. 分支表（branches）

存储节点之间的连接关系，支持分支剧情。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 分支唯一标识 |
| from_node_id | UUID | FOREIGN KEY(nodes.id), NOT NULL | 源节点ID |
| to_node_id | UUID | FOREIGN KEY(nodes.id), NOT NULL | 目标节点ID |
| branch_label | VARCHAR(100) | NULL | 分支标签/描述（如"选择A"、"选择B"） |
| branch_type | VARCHAR(20) | DEFAULT 'default', NOT NULL | 分支类型：default(默认)/choice(选择)/condition(条件) |
| condition | JSONB | NULL | 分支条件（JSON格式，用于条件分支） |
| branch_order | INTEGER | DEFAULT 1 | 同一源节点的分支顺序 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**索引：**
- `idx_branches_from_node` ON `from_node_id`
- `idx_branches_to_node` ON `to_node_id`
- `idx_branches_from_order` ON (`from_node_id`, `branch_order`)
- `UNIQUE idx_branches_unique` ON (`from_node_id`, `to_node_id`)

**外键约束：**
- `fk_branches_from_node` FOREIGN KEY (`from_node_id`) REFERENCES `nodes`(`id`) ON DELETE CASCADE
- `fk_branches_to_node` FOREIGN KEY (`to_node_id`) REFERENCES `nodes`(`id`) ON DELETE CASCADE

**检查约束：**
- `chk_branches_no_self_loop` CHECK (`from_node_id` != `to_node_id`)

---

### 7. 节点版本表（node_versions）

存储节点的历史版本，支持版本回退和历史查看。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 版本唯一标识 |
| node_id | UUID | FOREIGN KEY(nodes.id), NOT NULL | 节点ID |
| version_number | INTEGER | NOT NULL | 版本号（从1开始递增） |
| title | VARCHAR(200) | NOT NULL | 节点标题（该版本） |
| content | TEXT | NOT NULL | 节点内容（该版本） |
| duration | INTEGER | NULL | 镜头长度（该版本） |
| metadata | JSONB | NULL | 扩展元数据（该版本） |
| change_reason | VARCHAR(100) | NULL | 变更原因（如"regen"、"edit"、"continue"） |
| created_by | UUID | FOREIGN KEY(users.id), NULL | 创建者ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**索引：**
- `idx_node_versions_node_id` ON `node_id`
- `idx_node_versions_node_version` ON (`node_id`, `version_number`)
- `UNIQUE idx_node_versions_unique` ON (`node_id`, `version_number`)
- `idx_node_versions_created_at` ON `created_at DESC`

**外键约束：**
- `fk_node_versions_node_id` FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON DELETE CASCADE
- `fk_node_versions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL

---

## 表关系图

```
users (用户)
  │
  ├── scripts (剧本) ──┐
  │                    │
  │                    ├── script_tags (剧本标签)
  │                    │
  │                    └── layers (层)
  │                         │
  │                         └── nodes (节点) ──┐
  │                                            │
  │                                            ├── branches (分支) ──┐
  │                                            │                     │
  │                                            │                     └── nodes (目标节点)
  │                                            │
  │                                            └── node_versions (节点版本)
  │                                                      │
  │                                                      └── users (创建者)
```

## 数据示例

### 剧本示例结构

```json
{
  "script": {
    "id": "uuid-1",
    "title": "科幻短剧：时间旅行者",
    "outline": "一个科学家发明了时间机器...",
    "world_setting": {
      "era": "未来",
      "location": "地球",
      "main_characters": ["科学家", "助手"]
    }
  },
  "layers": [
    {
      "id": "layer-1",
      "layer_order": 1,
      "title": "第一幕：发现",
      "nodes": [
        {
          "id": "node-1",
          "title": "实验室场景",
          "content": "科学家在实验室中...",
          "duration": 30,
          "branches": [
            {
              "to_node_id": "node-2",
              "branch_label": "继续"
            }
          ]
        }
      ]
    }
  ]
}
```

## 查询场景示例

### 1. 获取用户的所有剧本列表

```sql
SELECT 
  s.id,
  s.title,
  s.status,
  s.created_at,
  s.updated_at,
  COUNT(DISTINCT st.tag_name) as tag_count
FROM scripts s
LEFT JOIN script_tags st ON s.id = st.script_id
WHERE s.user_id = $1 AND s.deleted_at IS NULL
GROUP BY s.id
ORDER BY s.updated_at DESC;
```

### 2. 获取剧本的完整结构（包含所有层和节点）

```sql
SELECT 
  l.id as layer_id,
  l.layer_order,
  l.title as layer_title,
  n.id as node_id,
  n.node_order,
  n.title as node_title,
  n.content,
  n.duration
FROM layers l
LEFT JOIN nodes n ON l.id = n.layer_id
WHERE l.script_id = $1
ORDER BY l.layer_order, n.node_order;
```

### 3. 获取节点的所有分支

```sql
SELECT 
  b.id,
  b.to_node_id,
  b.branch_label,
  b.branch_type,
  n.title as target_node_title
FROM branches b
JOIN nodes n ON b.to_node_id = n.id
WHERE b.from_node_id = $1
ORDER BY b.branch_order;
```

### 4. 获取节点的历史版本

```sql
SELECT 
  version_number,
  title,
  content,
  change_reason,
  created_at
FROM node_versions
WHERE node_id = $1
ORDER BY version_number DESC;
```

### 5. Continue 操作：创建新节点并自动生成分支

```sql
-- 1. 创建新节点
INSERT INTO nodes (layer_id, node_order, title, content, duration)
VALUES ($1, $2, $3, $4, $5)
RETURNING id;

-- 2. 创建分支连接
INSERT INTO branches (from_node_id, to_node_id, branch_label, branch_type)
VALUES ($6, $7, '继续', 'default');
```

### 6. Regen 操作：重写节点内容并保存版本

```sql
-- 1. 保存当前版本到历史表
INSERT INTO node_versions (node_id, version_number, title, content, duration, metadata, change_reason)
SELECT 
  id,
  (SELECT COALESCE(MAX(version_number), 0) + 1 FROM node_versions WHERE node_id = nodes.id),
  title,
  content,
  duration,
  metadata,
  'regen'
FROM nodes
WHERE id = $1;

-- 2. 更新节点内容
UPDATE nodes
SET 
  content = $2,
  updated_at = NOW()
WHERE id = $1;
```

## 数据库初始化脚本建议

### 启用 UUID 扩展

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 创建更新时间触发器函数

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### 为需要自动更新 updated_at 的表创建触发器

```sql
CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON scripts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_layers_updated_at BEFORE UPDATE ON layers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nodes_updated_at BEFORE UPDATE ON nodes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 性能优化建议

1. **索引优化**
   - 所有外键字段已建立索引
   - 常用查询字段（如 `created_at`, `status`）已建立索引
   - 考虑为 JSONB 字段建立 GIN 索引（如果需要进行 JSON 查询）

2. **分区策略**
   - 如果 `node_versions` 表数据量很大，可以考虑按时间分区
   - 如果 `scripts` 表数据量很大，可以考虑按 `created_at` 分区

3. **归档策略**
   - 定期归档已删除的剧本（`deleted_at` 不为 NULL 且超过一定时间）
   - 定期清理过旧的节点版本记录（保留最近 N 个版本）

4. **JSONB 字段使用**
   - `world_setting`、`metadata`、`condition` 使用 JSONB 类型，支持高效的 JSON 查询和索引
   - 可以使用 PostgreSQL 的 JSONB 操作符进行复杂查询

## 注意事项

1. **软删除**：`scripts` 和 `users` 表使用软删除机制，通过 `deleted_at` 字段标记删除
2. **级联删除**：子表（layers, nodes, branches 等）使用 CASCADE 删除，确保数据一致性
3. **唯一性约束**：层顺序和节点顺序在同一父级内必须唯一
4. **版本管理**：节点版本号在同一节点内必须唯一且递增
5. **分支自环检查**：分支不能连接节点到自身

## 后续扩展建议

1. **协作功能**：可以添加 `script_collaborators` 表，支持多人协作编辑
2. **评论功能**：可以添加 `script_comments` 或 `node_comments` 表
3. **导出历史**：可以添加 `script_exports` 表，记录每次导出的信息
4. **模板功能**：可以添加 `script_templates` 表，支持剧本模板
5. **AI 生成记录**：可以添加 `ai_generation_logs` 表，记录每次 AI 调用的详细信息

