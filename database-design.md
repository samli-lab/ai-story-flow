# 数据库设计文档

## 概述

本文档描述了 AI 剧本生产系统的数据库表结构设计。系统使用 PostgreSQL 数据库，采用 Node.js 作为后端技术栈。

## 核心概念

- **剧本（Script）**：一个完整的剧本项目，包含多层结构化的叙事方案
- **层（Layer）**：剧本的分层结构，用于组织不同层级的叙事内容
- **节点（Node）**：每层中的具体片段，包含明确的内容、镜头长度等信息
- **分支（Branch）**：节点之间的连接关系，支持分支剧情

## 数据库表设计

### 1. 剧本表（BranchesScript）

存储剧本的基本信息和元数据。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 剧本唯一标识 |
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
- `idx_BranchesScript_status` ON `status`
- `idx_BranchesScript_createdAt` ON `created_at DESC`
- `idx_BranchesScript_deletedAt` ON `deleted_at`
- `idx_BranchesScript_title` ON `title` (用于搜索)

---

### 2. 剧本标签表（BranchesScriptTag）

存储剧本的标签信息，支持多对多关系。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 标签唯一标识 |
| script_id | UUID | NOT NULL | 剧本ID |
| tag_name | VARCHAR(50) | NOT NULL | 标签名称 |
| color | VARCHAR(20) | NULL | 标签颜色（用于UI展示） |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**索引：**
- `idx_BranchesScriptTag_scriptId` ON `script_id`
- `idx_BranchesScriptTag_tagName` ON `tag_name`

---

### 3. 层表（BranchesLayer）

存储剧本的层级结构信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 层唯一标识 |
| script_id | UUID | NOT NULL | 所属剧本ID |
| layer_order | INTEGER | NOT NULL | 层顺序（从1开始） |
| title | VARCHAR(200) | NOT NULL | 层标题 |
| description | TEXT | NULL | 层描述 |
| is_collapsed | BOOLEAN | DEFAULT FALSE | UI展开/折叠状态（可选，用于前端状态保存） |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引：**
- `idx_BranchesLayer_scriptId` ON `script_id`
- `idx_BranchesLayer_scriptOrder` ON (`script_id`, `layer_order`)

---

### 4. 节点表（BranchesNode）

存储每层中的具体片段节点信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 节点唯一标识 |
| layer_id | UUID | NOT NULL | 所属层ID |
| node_order | INTEGER | NOT NULL | 节点在层中的顺序（从1开始） |
| title | VARCHAR(200) | NOT NULL | 节点标题 |
| content | TEXT | NOT NULL | 节点内容（结构化文本） |
| duration | INTEGER | NULL | 镜头长度（秒） |
| position_x | NUMERIC | NULL | 节点在画布上的X坐标（用于前端可视化布局） |
| position_y | NUMERIC | NULL | 节点在画布上的Y坐标（用于前端可视化布局） |
| metadata | JSONB | NULL | 扩展元数据（JSON格式，可存储镜头类型、人物、场景等信息） |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引：**
- `idx_BranchesNode_layerId` ON `layer_id`
- `idx_BranchesNode_layerOrder` ON (`layer_id`, `node_order`)
- `idx_BranchesNode_createdAt` ON `created_at`

---

### 5. 分支连接表（BranchesConnection）

存储节点之间的连接关系，支持分支剧情。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 分支唯一标识 |
| from_node_id | UUID | NOT NULL | 源节点ID |
| to_node_id | UUID | NOT NULL | 目标节点ID |
| branch_label | VARCHAR(100) | NULL | 分支标签/描述（如"选择A"、"选择B"） |
| branch_type | VARCHAR(20) | DEFAULT 'default', NOT NULL | 分支类型：default(默认)/choice(选择)/condition(条件) |
| condition | JSONB | NULL | 分支条件（JSON格式，用于条件分支） |
| branch_order | INTEGER | DEFAULT 1 | 同一源节点的分支顺序 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**索引：**
- `idx_BranchesConnection_fromNodeId` ON `from_node_id`
- `idx_BranchesConnection_toNodeId` ON `to_node_id`
- `idx_BranchesConnection_fromOrder` ON (`from_node_id`, `branch_order`)

---

### 6. 节点版本表（BranchesNodeVersion）

存储节点的历史版本，支持版本回退和历史查看。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 版本唯一标识 |
| node_id | UUID | NOT NULL | 节点ID |
| version_number | INTEGER | NOT NULL | 版本号（从1开始递增） |
| title | VARCHAR(200) | NOT NULL | 节点标题（该版本） |
| content | TEXT | NOT NULL | 节点内容（该版本） |
| duration | INTEGER | NULL | 镜头长度（该版本） |
| metadata | JSONB | NULL | 扩展元数据（该版本） |
| change_reason | VARCHAR(100) | NULL | 变更原因（如"regen"、"edit"、"continue"） |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**索引：**
- `idx_BranchesNodeVersion_nodeId` ON `node_id`
- `idx_BranchesNodeVersion_nodeVersion` ON (`node_id`, `version_number`)
- `idx_BranchesNodeVersion_createdAt` ON `created_at DESC`

---

## 表关系图

```
BranchesScript (剧本) ──┐
                        │
                        ├── BranchesScriptTag (剧本标签)
                        │
                        └── BranchesLayer (层)
                             │
                             └── BranchesNode (节点) ──┐
                                                       │
                                                       ├── BranchesConnection (分支连接) ──┐
                                                       │                                   │
                                                       │                                   └── BranchesNode (目标节点)
                                                       │
                                                       └── BranchesNodeVersion (节点版本)
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
          "position_x": 400,
          "position_y": 300,
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

5. 

