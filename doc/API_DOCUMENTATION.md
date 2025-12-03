# 后端 API 接口文档

## 基础信息

- **Base URL**: `https://api.example.com/v1`
- **认证方式**: Bearer Token (JWT)
- **Content-Type**: `application/json`
- **时间格式**: ISO 8601 (例如: `2025-11-27T21:19:31.000Z`)

---

## 1. 剧本（Script）相关接口

### 1.1 获取剧本列表

**接口**: `GET /scripts`

**描述**: 获取当前用户的所有剧本列表

**请求参数**:
```json
{
  "page": 1,           // 页码，可选，默认1
  "page_size": 20,     // 每页数量，可选，默认20
  "status": "draft",   // 状态筛选，可选: draft|editing|completed|archived
  "keyword": ""        // 搜索关键词，可选
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "items": [
      {
        "id": "003ab0f6-a980-49d5-b27b-3dfe49b64ce6",
        "title": "我的第一个剧本",
        "description": "这是一个测试剧本",
        "outline": "故事大纲...",
        "world_setting": {
          "era": "现代",
          "location": "都市",
          "main_characters": ["角色1", "角色2"]
        },
        "status": "editing",
        "is_auto_generated": false,
        "created_at": "2025-11-27T21:19:31.000Z",
        "updated_at": "2025-11-27T21:19:31.000Z",
        "tags": [
          {
            "id": "tag-1",
            "script_id": "003ab0f6-a980-49d5-b27b-3dfe49b64ce6",
            "tag_name": "悬疑",
            "color": "#722ed1",
            "created_at": "2025-11-27T21:19:31.000Z"
          }
        ]
      }
    ]
  }
}
```

---

### 1.2 获取单个剧本详情

**接口**: `GET /scripts/{script_id}`

**描述**: 根据ID获取剧本详情

**路径参数**:
- `script_id` (string, required): 剧本ID

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "003ab0f6-a980-49d5-b27b-3dfe49b64ce6",
    "title": "我的第一个剧本",
    "description": "这是一个测试剧本",
    "outline": "故事大纲...",
    "world_setting": {
      "era": "现代",
      "location": "都市",
      "main_characters": ["角色1", "角色2"]
    },
    "status": "editing",
    "is_auto_generated": false,
    "created_at": "2025-11-27T21:19:31.000Z",
    "updated_at": "2025-11-27T21:19:31.000Z",
    "tags": []
  }
}
```

---

### 1.3 创建剧本

**接口**: `POST /scripts`

**描述**: 创建新剧本

**请求体**:
```json
{
  "title": "新剧本标题",
  "description": "剧本描述",
  "outline": "故事大纲",
  "world_setting": {
    "era": "现代",
    "location": "都市",
    "main_characters": ["角色1"]
  },
  "tags": ["悬疑", "爱情"]
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "003ab0f6-a980-49d5-b27b-3dfe49b64ce6",
    "title": "新剧本标题",
    "description": "剧本描述",
    "outline": "故事大纲",
    "world_setting": {
      "era": "现代",
      "location": "都市",
      "main_characters": ["角色1"]
    },
    "status": "draft",
    "is_auto_generated": false,
    "created_at": "2025-11-27T21:19:31.000Z",
    "updated_at": "2025-11-27T21:19:31.000Z",
    "tags": [
      {
        "id": "tag-1",
        "script_id": "003ab0f6-a980-49d5-b27b-3dfe49b64ce6",
        "tag_name": "悬疑",
        "color": "#722ed1",
        "created_at": "2025-11-27T21:19:31.000Z"
      }
    ]
  }
}
```

---

### 1.4 更新剧本

**接口**: `PUT /scripts/{script_id}`

**描述**: 更新剧本信息

**路径参数**:
- `script_id` (string, required): 剧本ID

**请求体**:
```json
{
  "title": "更新后的标题",
  "description": "更新后的描述",
  "outline": "更新后的大纲",
  "status": "editing",
  "tags": ["悬疑", "爱情", "科幻"]
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "003ab0f6-a980-49d5-b27b-3dfe49b64ce6",
    "title": "更新后的标题",
    "description": "更新后的描述",
    "outline": "更新后的大纲",
    "status": "editing",
    "updated_at": "2025-11-27T22:00:00.000Z",
    "tags": []
  }
}
```

---

### 1.5 删除剧本（软删除）

**接口**: `DELETE /scripts/{script_id}`

**描述**: 软删除剧本（设置 deleted_at 字段）

**路径参数**:
- `script_id` (string, required): 剧本ID

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

## 2. 层（Layer）相关接口

### 2.1 获取剧本的所有层

**接口**: `GET /scripts/{script_id}/layers`

**描述**: 获取指定剧本的所有层及其节点和分支

**路径参数**:
- `script_id` (string, required): 剧本ID

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "6cb48640-90d7-44e1-bdba-94ff74c01e20",
      "script_id": "003ab0f6-a980-49d5-b27b-3dfe49b64ce6",
      "layer_order": 1,
      "title": "第1层",
      "description": "第一层的描述",
      "is_collapsed": false,
      "created_at": "2025-11-27T21:19:31.000Z",
      "updated_at": "2025-11-27T21:19:31.000Z",
      "nodes": [
        {
          "id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
          "layer_id": "6cb48640-90d7-44e1-bdba-94ff74c01e20",
          "node_order": 1,
          "title": "节点标题",
          "content": "节点内容...",
          "duration": 30,
          "position_x": 100,
          "position_y": 200,
          "metadata": {
            "camera_type": "全景",
            "characters": ["角色1"],
            "scene": "场景1"
          },
          "created_at": "2025-11-27T21:19:31.000Z",
          "updated_at": "2025-11-27T21:19:31.000Z",
          "branches": [
            {
              "id": "056e237e-d318-460a-9975-9d70d11b4ab6",
              "from_node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
              "to_node_id": "936e0d13-0b92-42a4-9e54-95b8785da6db",
              "branch_label": "选择A",
              "branch_type": "choice",
              "condition": null,
              "branch_order": 1,
              "created_at": "2025-11-27T21:19:31.000Z"
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 2.2 创建层

**接口**: `POST /scripts/{script_id}/layers`

**描述**: 为指定剧本创建新层

**路径参数**:
- `script_id` (string, required): 剧本ID

**请求体**:
```json
{
  "title": "第5层",
  "description": "层的描述",
  "layer_order": 5
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "new-layer-id",
    "script_id": "003ab0f6-a980-49d5-b27b-3dfe49b64ce6",
    "layer_order": 5,
    "title": "第5层",
    "description": "层的描述",
    "is_collapsed": false,
    "created_at": "2025-11-27T21:19:31.000Z",
    "updated_at": "2025-11-27T21:19:31.000Z",
    "nodes": []
  }
}
```

---

### 2.3 更新层

**接口**: `PUT /scripts/{script_id}/layers/{layer_id}`

**描述**: 更新层信息

**路径参数**:
- `script_id` (string, required): 剧本ID
- `layer_id` (string, required): 层ID

**请求体**:
```json
{
  "title": "更新后的层标题",
  "description": "更新后的描述",
  "is_collapsed": true
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "6cb48640-90d7-44e1-bdba-94ff74c01e20",
    "script_id": "003ab0f6-a980-49d5-b27b-3dfe49b64ce6",
    "layer_order": 1,
    "title": "更新后的层标题",
    "description": "更新后的描述",
    "is_collapsed": true,
    "updated_at": "2025-11-27T22:00:00.000Z"
  }
}
```

---

### 2.4 删除层

**接口**: `DELETE /scripts/{script_id}/layers/{layer_id}`

**描述**: 删除层（需要同时删除层下的所有节点和分支）

**路径参数**:
- `script_id` (string, required): 剧本ID
- `layer_id` (string, required): 层ID

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

## 3. 节点（StoryNode）相关接口

### 3.1 获取单个节点

**接口**: `GET /scripts/{script_id}/nodes/{node_id}`

**描述**: 获取节点详情（包含分支信息）

**路径参数**:
- `script_id` (string, required): 剧本ID
- `node_id` (string, required): 节点ID

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
    "layer_id": "6cb48640-90d7-44e1-bdba-94ff74c01e20",
    "node_order": 1,
    "title": "节点标题",
    "content": "节点内容...",
    "duration": 30,
    "position_x": 100,
    "position_y": 200,
    "metadata": {
      "camera_type": "全景",
      "characters": ["角色1"],
      "scene": "场景1"
    },
    "created_at": "2025-11-27T21:19:31.000Z",
    "updated_at": "2025-11-27T21:19:31.000Z",
    "branches": []
  }
}
```

---

### 3.2 创建节点

**接口**: `POST /scripts/{script_id}/layers/{layer_id}/nodes`

**描述**: 在指定层中创建新节点

**路径参数**:
- `script_id` (string, required): 剧本ID
- `layer_id` (string, required): 层ID

**请求体**:
```json
{
  "title": "新节点标题",
  "content": "节点内容",
  "duration": 30,
  "node_order": 1,
  "position_x": 100,
  "position_y": 200,
  "metadata": {
    "camera_type": "全景",
    "characters": ["角色1"],
    "scene": "场景1"
  }
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "new-node-id",
    "layer_id": "6cb48640-90d7-44e1-bdba-94ff74c01e20",
    "node_order": 1,
    "title": "新节点标题",
    "content": "节点内容",
    "duration": 30,
    "position_x": 100,
    "position_y": 200,
    "metadata": {
      "camera_type": "全景",
      "characters": ["角色1"],
      "scene": "场景1"
    },
    "created_at": "2025-11-27T21:19:31.000Z",
    "updated_at": "2025-11-27T21:19:31.000Z",
    "branches": []
  }
}
```

---

### 3.3 更新节点

**接口**: `PUT /scripts/{script_id}/nodes/{node_id}`

**描述**: 更新节点信息（标题、内容、位置等）

**路径参数**:
- `script_id` (string, required): 剧本ID
- `node_id` (string, required): 节点ID

**请求体**:
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容",
  "duration": 45,
  "position_x": 150,
  "position_y": 250,
  "metadata": {
    "camera_type": "特写",
    "characters": ["角色1", "角色2"],
    "scene": "场景2"
  },
  "change_reason": "edit"
}
```

**注意**: 
- `change_reason` 字段可选，用于记录变更原因
- 更新节点时，系统会自动创建版本记录
- 如果只更新位置（position_x, position_y），可以不创建版本记录（可选实现）

**响应示例**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
    "layer_id": "6cb48640-90d7-44e1-bdba-94ff74c01e20",
    "node_order": 1,
    "title": "更新后的标题",
    "content": "更新后的内容",
    "duration": 45,
    "position_x": 150,
    "position_y": 250,
    "metadata": {
      "camera_type": "特写",
      "characters": ["角色1", "角色2"],
      "scene": "场景2"
    },
    "updated_at": "2025-11-27T22:00:00.000Z"
  }
}
```

---

### 3.4 批量更新节点位置

**接口**: `PUT /scripts/{script_id}/nodes/positions`

**描述**: 批量更新多个节点的位置（用于自动保存功能）

**路径参数**:
- `script_id` (string, required): 剧本ID

**请求体**:
```json
{
  "nodes": [
    {
      "node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
      "position_x": 100,
      "position_y": 200
    },
    {
      "node_id": "936e0d13-0b92-42a4-9e54-95b8785da6db",
      "position_x": 300,
      "position_y": 400
    }
  ]
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "批量更新成功",
  "data": {
    "updated_count": 2
  }
}
```

---

### 3.5 删除节点

**接口**: `DELETE /scripts/{script_id}/nodes/{node_id}`

**描述**: 删除节点（需要同时删除该节点的所有分支，以及指向该节点的分支）

**路径参数**:
- `script_id` (string, required): 剧本ID
- `node_id` (string, required): 节点ID

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": {
    "deleted_node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
    "deleted_branches_count": 3
  }
}
```

---

## 4. 分支（Branch）相关接口

### 4.1 创建分支

**接口**: `POST /scripts/{script_id}/branches`

**描述**: 创建节点之间的分支连接

**路径参数**:
- `script_id` (string, required): 剧本ID

**请求体**:
```json
{
  "from_node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
  "to_node_id": "936e0d13-0b92-42a4-9e54-95b8785da6db",
  "branch_label": "选择A",
  "branch_type": "choice",
  "branch_order": 1,
  "condition": null
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "new-branch-id",
    "from_node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
    "to_node_id": "936e0d13-0b92-42a4-9e54-95b8785da6db",
    "branch_label": "选择A",
    "branch_type": "choice",
    "branch_order": 1,
    "condition": null,
    "created_at": "2025-11-27T21:19:31.000Z"
  }
}
```

---

### 4.2 更新分支

**接口**: `PUT /scripts/{script_id}/branches/{branch_id}`

**描述**: 更新分支信息（主要是分支标签）

**路径参数**:
- `script_id` (string, required): 剧本ID
- `branch_id` (string, required): 分支ID

**请求体**:
```json
{
  "branch_label": "更新后的选择标签",
  "branch_type": "choice",
  "branch_order": 2,
  "condition": null
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "056e237e-d318-460a-9975-9d70d11b4ab6",
    "from_node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
    "to_node_id": "936e0d13-0b92-42a4-9e54-95b8785da6db",
    "branch_label": "更新后的选择标签",
    "branch_type": "choice",
    "branch_order": 2,
    "condition": null,
    "created_at": "2025-11-27T21:19:31.000Z"
  }
}
```

---

### 4.3 删除分支

**接口**: `DELETE /scripts/{script_id}/branches/{branch_id}`

**描述**: 删除分支连接

**路径参数**:
- `script_id` (string, required): 剧本ID
- `branch_id` (string, required): 分支ID

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

## 5. 批量操作接口

### 5.1 批量保存层和节点数据

**接口**: `PUT /scripts/{script_id}/layers/batch`

**描述**: 批量保存整个剧本的层、节点和分支数据（用于手动保存功能）

**路径参数**:
- `script_id` (string, required): 剧本ID

**请求体**:
```json
{
  "layers": [
    {
      "id": "6cb48640-90d7-44e1-bdba-94ff74c01e20",
      "script_id": "003ab0f6-a980-49d5-b27b-3dfe49b64ce6",
      "layer_order": 1,
      "title": "第1层",
      "description": "描述",
      "is_collapsed": false,
      "nodes": [
        {
          "id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
          "layer_id": "6cb48640-90d7-44e1-bdba-94ff74c01e20",
          "node_order": 1,
          "title": "节点标题",
          "content": "节点内容",
          "duration": 30,
          "position_x": 100,
          "position_y": 200,
          "metadata": {},
          "branches": [
            {
              "id": "056e237e-d318-460a-9975-9d70d11b4ab6",
              "from_node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
              "to_node_id": "936e0d13-0b92-42a4-9e54-95b8785da6db",
              "branch_label": "选择A",
              "branch_type": "choice",
              "branch_order": 1,
              "condition": null
            }
          ]
        }
      ]
    }
  ]
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "批量保存成功",
  "data": {
    "updated_layers_count": 1,
    "updated_nodes_count": 1,
    "updated_branches_count": 1
  }
}
```

**注意**: 
- 此接口会进行全量更新，建议在用户点击"保存"按钮时调用
- 后端需要处理新增、更新、删除的逻辑
- 如果某个节点/分支在请求中不存在但在数据库中存在，应该被删除
- 更新节点时，需要自动创建版本记录（change_reason: "edit"）

---

### 5.2 AI生成节点内容（批量创建节点和分支）

**接口**: `POST /scripts/{script_id}/nodes/ai-generate`

**描述**: AI生成下一章内容，自动创建节点和分支

**路径参数**:
- `script_id` (string, required): 剧本ID

**请求体**:
```json
{
  "source_node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
  "context": "当前节点的内容，用于AI生成上下文",
  "generated_content": "AI生成的剧情内容（不含options部分）",
  "branches": [
    {
      "branch_label": "Kiss him to survive",
      "node_title": "Kiss him to survive",
      "node_content": ""
    },
    {
      "branch_label": "Bite his hand hard",
      "node_title": "Bite his hand hard",
      "node_content": ""
    }
  ]
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "AI生成成功",
  "data": {
    "updated_node": {
      "id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
      "content": "更新后的内容",
      "updated_at": "2025-11-27T22:00:00.000Z"
    },
    "created_layer": {
      "id": "new-layer-id",
      "layer_order": 2,
      "title": "第2层"
    },
    "created_nodes": [
      {
        "id": "new-node-1",
        "title": "Kiss him to survive",
        "content": "",
        "layer_id": "new-layer-id"
      },
      {
        "id": "new-node-2",
        "title": "Bite his hand hard",
        "content": "",
        "layer_id": "new-layer-id"
      }
    ],
    "created_branches": [
      {
        "id": "new-branch-1",
        "from_node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
        "to_node_id": "new-node-1",
        "branch_label": "Kiss him to survive"
      },
      {
        "id": "new-branch-2",
        "from_node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
        "to_node_id": "new-node-2",
        "branch_label": "Bite his hand hard"
      }
    ]
  }
}
```

**业务逻辑**:
1. 更新源节点的内容为 `generated_content`，并创建版本记录（change_reason: "continue"）
2. 如果下一层不存在，自动创建新层（layer_order = 当前层 + 1）
3. 在下一层创建新节点，节点标题使用 `node_title`，内容使用 `node_content`（通常为空）
4. 创建从源节点到新节点的分支，分支标签使用 `branch_label`
5. 返回所有创建和更新的数据

**注意**: 
- 更新源节点时，需要创建版本记录（change_reason: "continue"）
- 新创建的节点初始版本号为 1

---

## 6. 错误响应格式

所有接口在出错时都应返回统一的错误格式：

```json
{
  "code": 400,
  "message": "错误描述信息",
  "data": null,
  "error": {
    "type": "ValidationError",
    "details": [
      {
        "field": "title",
        "message": "标题不能为空"
      }
    ]
  }
}
```

**常见错误码**:
- `200`: 成功
- `400`: 请求参数错误
- `401`: 未授权（需要登录）
- `403`: 无权限
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 7. 数据库表结构说明

### 7.1 实际数据库表结构

根据数据库设计文档，系统使用 PostgreSQL 数据库，表名使用 `Branches` 前缀。

#### BranchesScript 表（剧本表）
```sql
CREATE TABLE BranchesScript (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  outline TEXT,
  world_setting JSONB,
  status VARCHAR(20) DEFAULT 'draft' NOT NULL,
  is_auto_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

-- 索引
CREATE INDEX idx_BranchesScript_status ON BranchesScript(status);
CREATE INDEX idx_BranchesScript_createdAt ON BranchesScript(created_at DESC);
CREATE INDEX idx_BranchesScript_deletedAt ON BranchesScript(deleted_at);
CREATE INDEX idx_BranchesScript_title ON BranchesScript(title);
```

#### BranchesScriptTag 表（剧本标签表）
```sql
CREATE TABLE BranchesScriptTag (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_id UUID NOT NULL,
  tag_name VARCHAR(50) NOT NULL,
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (script_id) REFERENCES BranchesScript(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_BranchesScriptTag_scriptId ON BranchesScriptTag(script_id);
CREATE INDEX idx_BranchesScriptTag_tagName ON BranchesScriptTag(tag_name);
```

#### BranchesLayer 表（层表）
```sql
CREATE TABLE BranchesLayer (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_id UUID NOT NULL,
  layer_order INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  is_collapsed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (script_id) REFERENCES BranchesScript(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_BranchesLayer_scriptId ON BranchesLayer(script_id);
CREATE INDEX idx_BranchesLayer_scriptOrder ON BranchesLayer(script_id, layer_order);
```

#### BranchesNode 表（节点表）
```sql
CREATE TABLE BranchesNode (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  layer_id UUID NOT NULL,
  node_order INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  duration INTEGER,
  position_x NUMERIC,
  position_y NUMERIC,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (layer_id) REFERENCES BranchesLayer(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_BranchesNode_layerId ON BranchesNode(layer_id);
CREATE INDEX idx_BranchesNode_layerOrder ON BranchesNode(layer_id, node_order);
CREATE INDEX idx_BranchesNode_createdAt ON BranchesNode(created_at);
```

#### BranchesConnection 表（分支连接表）
```sql
CREATE TABLE BranchesConnection (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_node_id UUID NOT NULL,
  to_node_id UUID NOT NULL,
  branch_label VARCHAR(100),
  branch_type VARCHAR(20) DEFAULT 'default' NOT NULL,
  condition JSONB,
  branch_order INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (from_node_id) REFERENCES BranchesNode(id) ON DELETE CASCADE,
  FOREIGN KEY (to_node_id) REFERENCES BranchesNode(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_BranchesConnection_fromNodeId ON BranchesConnection(from_node_id);
CREATE INDEX idx_BranchesConnection_toNodeId ON BranchesConnection(to_node_id);
CREATE INDEX idx_BranchesConnection_fromOrder ON BranchesConnection(from_node_id, branch_order);
```

#### BranchesNodeVersion 表（节点版本表）
```sql
CREATE TABLE BranchesNodeVersion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  duration INTEGER,
  metadata JSONB,
  change_reason VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (node_id) REFERENCES BranchesNode(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_BranchesNodeVersion_nodeId ON BranchesNodeVersion(node_id);
CREATE INDEX idx_BranchesNodeVersion_nodeVersion ON BranchesNodeVersion(node_id, version_number);
CREATE INDEX idx_BranchesNodeVersion_createdAt ON BranchesNodeVersion(created_at DESC);
```

### 7.2 字段说明

**重要字段类型说明**:
- `UUID`: PostgreSQL UUID 类型，使用 `uuid_generate_v4()` 生成
- `JSONB`: PostgreSQL JSONB 类型，用于存储结构化 JSON 数据
- `NUMERIC`: 用于存储精确的数值（position_x, position_y）
- `TIMESTAMP`: 时间戳类型，使用 `NOW()` 默认值

**字段命名规范**:
- 所有字段使用下划线命名（snake_case）
- 时间字段统一使用 `created_at`, `updated_at`, `deleted_at`

---

## 8. 接口调用示例

### 8.1 前端调用示例（TypeScript）

```typescript
// 获取剧本的所有层和节点
const getLayers = async (scriptId: string) => {
  const response = await fetch(`/api/v1/scripts/${scriptId}/layers`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const result = await response.json();
  return result.data;
};

// 批量保存节点位置
const saveNodePositions = async (scriptId: string, nodes: Array<{node_id: string, position_x: number, position_y: number}>) => {
  const response = await fetch(`/api/v1/scripts/${scriptId}/nodes/positions`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nodes })
  });
  const result = await response.json();
  return result;
};

// 更新节点内容
const updateNode = async (scriptId: string, nodeId: string, data: {
  title?: string;
  content?: string;
  position_x?: number;
  position_y?: number;
  change_reason?: string; // 可选，默认为 "edit"
}) => {
  const response = await fetch(`/api/v1/scripts/${scriptId}/nodes/${nodeId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result.data;
};

// 获取节点版本列表
const getNodeVersions = async (scriptId: string, nodeId: string, page: number = 1, pageSize: number = 20) => {
  const response = await fetch(`/api/v1/scripts/${scriptId}/nodes/${nodeId}/versions?page=${page}&page_size=${pageSize}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const result = await response.json();
  return result.data;
};

// 回退节点到指定版本
const restoreNodeVersion = async (scriptId: string, nodeId: string, versionNumber: number) => {
  const response = await fetch(`/api/v1/scripts/${scriptId}/nodes/${nodeId}/versions/${versionNumber}/restore`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      change_reason: 'restore'
    })
  });
  const result = await response.json();
  return result.data;
};

// AI生成节点内容
const aiGenerateNodes = async (scriptId: string, sourceNodeId: string, generatedContent: string, branches: Array<{branch_label: string, node_title: string, node_content: string}>) => {
  const response = await fetch(`/api/v1/scripts/${scriptId}/nodes/ai-generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      source_node_id: sourceNodeId,
      context: '', // 当前节点内容
      generated_content: generatedContent,
      branches
    })
  });
  const result = await response.json();
  return result.data;
};
```

---

## 9. 节点版本管理接口

### 9.1 获取节点版本列表

**接口**: `GET /scripts/{script_id}/nodes/{node_id}/versions`

**描述**: 获取节点的所有历史版本

**路径参数**:
- `script_id` (string, required): 剧本ID
- `node_id` (string, required): 节点ID

**查询参数**:
- `page` (integer, optional): 页码，默认1
- `page_size` (integer, optional): 每页数量，默认20

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 10,
    "page": 1,
    "page_size": 20,
    "items": [
      {
        "id": "version-uuid-1",
        "node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
        "version_number": 1,
        "title": "节点标题 v1",
        "content": "节点内容 v1",
        "duration": 30,
        "metadata": {},
        "change_reason": "edit",
        "created_at": "2025-11-27T21:19:31.000Z"
      },
      {
        "id": "version-uuid-2",
        "node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
        "version_number": 2,
        "title": "节点标题 v2",
        "content": "节点内容 v2",
        "duration": 35,
        "metadata": {},
        "change_reason": "regen",
        "created_at": "2025-11-27T22:00:00.000Z"
      }
    ]
  }
}
```

---

### 9.2 获取节点指定版本

**接口**: `GET /scripts/{script_id}/nodes/{node_id}/versions/{version_number}`

**描述**: 获取节点的指定版本详情

**路径参数**:
- `script_id` (string, required): 剧本ID
- `node_id` (string, required): 节点ID
- `version_number` (integer, required): 版本号

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "version-uuid-1",
    "node_id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
    "version_number": 1,
    "title": "节点标题 v1",
    "content": "节点内容 v1",
    "duration": 30,
    "metadata": {},
    "change_reason": "edit",
    "created_at": "2025-11-27T21:19:31.000Z"
  }
}
```

---

### 9.3 回退节点到指定版本

**接口**: `POST /scripts/{script_id}/nodes/{node_id}/versions/{version_number}/restore`

**描述**: 将节点回退到指定版本，并创建新版本记录

**路径参数**:
- `script_id` (string, required): 剧本ID
- `node_id` (string, required): 节点ID
- `version_number` (integer, required): 要回退到的版本号

**请求体**:
```json
{
  "change_reason": "restore"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "回退成功",
  "data": {
    "node": {
      "id": "c50187dc-f61e-4576-981b-c2eddba0bcbd",
      "title": "节点标题 v1",
      "content": "节点内容 v1",
      "duration": 30,
      "updated_at": "2025-11-27T23:00:00.000Z"
    },
    "new_version": {
      "id": "version-uuid-new",
      "version_number": 3,
      "change_reason": "restore",
      "created_at": "2025-11-27T23:00:00.000Z"
    }
  }
}
```

**业务逻辑**:
1. 获取指定版本的数据
2. 更新节点当前数据为版本数据
3. 创建新的版本记录（version_number + 1），记录回退操作
4. 返回更新后的节点和新版本信息

---

## 10. 注意事项

1. **事务处理**: 批量操作接口（如批量保存、AI生成）需要使用数据库事务，确保数据一致性
2. **权限验证**: 所有接口都需要验证用户是否有权限操作该剧本（建议在应用层实现用户权限管理）
3. **数据校验**: 
   - 层顺序（layer_order）在同一剧本内不能重复
   - 节点顺序（node_order）在同一层内不能重复
   - 分支不能形成循环（需要验证）
   - UUID 格式验证
4. **级联删除**: 
   - 删除剧本时，级联删除所有层、节点、分支和版本
   - 删除层时，级联删除层下的所有节点、分支和版本
   - 删除节点时，级联删除节点的所有分支和版本
5. **性能优化**: 
   - 批量保存接口建议使用 PostgreSQL 的批量插入/更新（INSERT ... ON CONFLICT）
   - 获取层数据时，使用 JOIN 查询一次性获取所有相关数据
   - 使用 JSONB 索引优化 metadata 字段查询
6. **版本控制**: 
   - 每次更新节点时，自动创建版本记录
   - change_reason 字段记录变更原因：`edit`（手动编辑）、`regen`（AI重新生成）、`continue`（AI续写）、`restore`（版本回退）
7. **数据库特性**: 
   - 使用 PostgreSQL 的 JSONB 类型存储结构化数据（world_setting, metadata, condition）
   - 使用 NUMERIC 类型存储精确的坐标值（position_x, position_y）
   - 使用 UUID 作为主键，提高分布式系统兼容性

---

## 11. 接口优先级

**高优先级**（核心功能）:
1. `GET /scripts/{script_id}/layers` - 获取层和节点数据
2. `PUT /scripts/{script_id}/nodes/positions` - 批量更新节点位置（自动保存）
3. `PUT /scripts/{script_id}/layers/batch` - 批量保存（手动保存）
4. `PUT /scripts/{script_id}/nodes/{node_id}` - 更新节点内容
5. `POST /scripts/{script_id}/nodes/ai-generate` - AI生成节点

**中优先级**:
1. `POST /scripts/{script_id}/layers/{layer_id}/nodes` - 创建节点
2. `POST /scripts/{script_id}/branches` - 创建分支
3. `DELETE /scripts/{script_id}/nodes/{node_id}` - 删除节点
4. `DELETE /scripts/{script_id}/branches/{branch_id}` - 删除分支

**低优先级**:
1. `POST /scripts/{script_id}/layers` - 创建层
2. `PUT /scripts/{script_id}/layers/{layer_id}` - 更新层
3. `DELETE /scripts/{script_id}/layers/{layer_id}` - 删除层

