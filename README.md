# AI Story Flow

一个基于 React Flow 的 AI 流程可视化项目。

## 技术栈

- **React** 18.3+
- **Vite** 7.0+
- **TypeScript**
- **React Flow** (@xyflow/react) - 流程图可视化库
- **Semi Design** (@douyinfe/semi-ui) - 企业级 UI 组件库

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
ai-story-flow/
├── src/
│   ├── App.tsx          # 主应用组件（包含 React Flow）
│   ├── main.tsx         # 应用入口
│   ├── index.css        # 全局样式
│   └── vite-env.d.ts    # Vite 类型定义
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
└── package.json         # 项目依赖
```

## 功能特性

- ✅ React Flow 流程图可视化
- ✅ 节点和边的交互式编辑
- ✅ 背景网格和控件
- ✅ 迷你地图导航
- ✅ Semi Design UI 组件库集成
- ✅ 现代化的布局设计（Header + Sider + Content）
- ✅ 工具栏操作（保存、重置、添加节点）
- ✅ TypeScript 支持
- ✅ 中文语言包支持

## 下一步

你可以根据需要：
- 添加自定义节点类型
- 实现节点数据编辑功能
- 添加保存/加载流程功能
- 集成 AI 处理逻辑

