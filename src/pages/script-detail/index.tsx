import { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Layout,
  Button,
  Typography,
  Space,
  Tooltip,
} from '@douyinfe/semi-ui';
import {
  IconSave,
  IconRefresh,
  IconPlus,
  IconArrowLeft,
} from '@douyinfe/semi-icons';
import { getScriptById } from '../../services/scriptService';
import { Script } from '../../types/script';
import AppLayout from '../../components/AppLayout';
import './ScriptDetail.css';

const { Content, Sider } = Layout;

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: '开始' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'AI 处理节点' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: '决策节点' },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: '结束' },
    position: { x: 250, y: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
];

export default function ScriptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [script, setScript] = useState<Script | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (id) {
      loadScript();
    }
  }, [id]);

  const loadScript = async () => {
    if (!id) return;
    try {
      const data = await getScriptById(id);
      setScript(data);
      // TODO: 加载剧本的层和节点数据，转换为 ReactFlow 的 nodes 和 edges
    } catch (error) {
      console.error('加载剧本失败', error);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = () => {
    console.log('保存流程', { nodes, edges, script });
    // TODO: 保存剧本的层和节点数据
  };

  const handleReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  const headerExtra = (
    <Space spacing="loose">
      <Button
        icon={<IconArrowLeft />}
        theme="borderless"
        onClick={() => navigate('/scripts')}
      >
        返回
      </Button>
      <Tooltip content="添加节点" position="bottom">
        <Button icon={<IconPlus />} theme="borderless" size="large" />
      </Tooltip>
      <Tooltip content="重置" position="bottom">
        <Button
          icon={<IconRefresh />}
          theme="borderless"
          size="large"
          onClick={handleReset}
        />
      </Tooltip>
      <Tooltip content="保存" position="bottom">
        <Button
          icon={<IconSave />}
          theme="solid"
          type="primary"
          size="large"
          onClick={handleSave}
        >
          保存
        </Button>
      </Tooltip>
    </Space>
  );

  return (
    <AppLayout
      headerTitle={script?.title || '剧本编辑'}
      headerExtra={headerExtra}
    >
      <Layout style={{ height: 'calc(100vh - 72px)' }}>
        <Sider
          style={{
            backgroundColor: 'var(--semi-color-bg-1)',
            borderRight: '1px solid var(--semi-color-border)',
            width: isCollapsed ? 0 : 240,
            overflow: 'hidden',
            transition: 'width 0.3s ease',
            display: isCollapsed ? 'none' : 'block',
          }}
        >
          <div style={{ padding: '16px' }}>
            <Typography.Title heading={5}>层结构</Typography.Title>
            {/* TODO: 显示剧本的层结构 */}
          </div>
        </Sider>
        <Content
          style={{
            backgroundColor: 'var(--semi-color-bg-0)',
            padding: 0,
            position: 'relative',
          }}
        >
          <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </Content>
      </Layout>
    </AppLayout>
  );
}

