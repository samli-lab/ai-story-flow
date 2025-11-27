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
  Node as FlowNode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Layout,
  Button,
  Typography,
  Space,
  Tooltip,
  Modal,
  Form,
  Toast,
  Tree,
} from '@douyinfe/semi-ui';
import {
  IconSave,
  IconRefresh,
  IconPlus,
  IconArrowLeft,
  IconEdit,
  IconSidebar,
  IconChevronLeft,
  IconChevronRight,
} from '@douyinfe/semi-icons';
import { getScriptById } from '../../services/scriptService';
import { Script } from '../../types/script';
import { Layer, StoryNode } from '../../types/layer';
import { getLayersByScriptId, updateNodeContent } from '../../mock/data/layers';
import AppLayout from '../../components/AppLayout';
import './ScriptDetail.css';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function ScriptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [script, setScript] = useState<Script | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [formApi, setFormApi] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (id) {
      loadScript();
      loadLayers();
    }
  }, [id]);

  const loadScript = async () => {
    if (!id) return;
    try {
      const data = await getScriptById(id);
      setScript(data);
    } catch (error) {
      console.error('加载剧本失败', error);
    }
  };

  const loadLayers = async () => {
    if (!id) return;
    try {
      const layersData = await getLayersByScriptId(id);
      setLayers(layersData);
      convertToFlowNodes(layersData);
    } catch (error) {
      console.error('加载层数据失败', error);
    }
  };

  // 将层和节点数据转换为 ReactFlow 的 nodes 和 edges
  const convertToFlowNodes = (layersData: Layer[]) => {
    const flowNodes: FlowNode[] = [];
    const flowEdges: Edge[] = [];

    layersData.forEach((layer) => {
      const nodeCount = layer.nodes?.length || 0;
      layer.nodes?.forEach((node, index) => {
        // 计算节点位置（金字塔结构，居中排列）
        const x = layer.layer_order * 400; // 层之间的水平间距
        // 垂直居中：根据节点总数计算，使节点在垂直方向居中分布
        const startY = 100; // 起始Y位置
        const y = startY + (index - (nodeCount - 1) / 2) * 120;

        flowNodes.push({
          id: node.id,
          type: index === 0 && layer.layer_order === 1 ? 'input' :
            index === nodeCount - 1 && layer.layer_order === layersData.length ? 'output' :
              'default',
          position: { x, y },
          data: {
            label: node.title,
            content: node.content,
            node: node,
          },
        });

        // 添加分支连接（带动画和样式）
        node.branches?.forEach((branch, branchIndex) => {
          flowEdges.push({
            id: branch.id,
            source: branch.from_node_id,
            target: branch.to_node_id,
            label: branch.branch_label || '',
            type: 'smoothstep', // 使用平滑步骤样式
            animated: true, // 启用动画
            style: {
              strokeWidth: 3,
              stroke: branchIndex === 0 ? '#1890ff' : '#52c41a', // 选择A用蓝色，选择B用绿色
            },
            labelStyle: {
              fill: branchIndex === 0 ? '#1890ff' : '#52c41a',
              fontWeight: 600,
            },
            labelBgStyle: {
              fill: '#fff',
              fillOpacity: 0.8,
            },
          });
        });
      });
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = () => {
    console.log('保存流程', { nodes, edges, script, layers });
    Toast.success('保存成功');
    // TODO: 保存剧本的层和节点数据
  };

  const handleReset = () => {
    convertToFlowNodes(layers);
  };

  // 处理节点点击
  const handleNodeClick = (_event: any, node: FlowNode) => {
    const nodeData = node.data?.node as StoryNode;
    if (nodeData) {
      setCurrentNode(nodeData);
      setEditModalVisible(true);
    }
  };

  // 更新节点内容
  const handleUpdateNodeContent = async (values: any) => {
    if (!currentNode || !id) return;
    try {
      const updated = await updateNodeContent(currentNode.id, values.content, layers);
      if (updated) {
        // 更新 layers 状态
        const updatedLayers = layers.map(layer => ({
          ...layer,
          nodes: layer.nodes?.map(n => n.id === updated.id ? updated : n),
        }));
        setLayers(updatedLayers);

        // 更新 ReactFlow 节点
        setNodes(prevNodes =>
          prevNodes.map(n => {
            if (n.id === updated.id) {
              return {
                ...n,
                data: {
                  ...(n.data || {}),
                  content: updated.content,
                  node: updated
                }
              };
            }
            return n;
          })
        );

        setEditModalVisible(false);
        Toast.success('更新成功');
      }
    } catch (error) {
      Toast.error('更新失败');
      console.error(error);
    }
  };

  // 构建树形结构数据
  const buildTreeData = () => {
    return layers.map(layer => ({
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text strong>{layer.title}</Text>
          <Text type="tertiary" size="small">
            {layer.nodes?.length || 0} 个节点
          </Text>
        </div>
      ),
      key: layer.id,
      value: layer.id,
      children: layer.nodes?.map(node => ({
        label: (
          <div
            style={{
              padding: '4px 0',
              cursor: 'pointer',
            }}
            onClick={() => {
              const flowNode = nodes.find((n: FlowNode) => n.id === node.id);
              if (flowNode) {
                handleNodeClick(null, flowNode);
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconEdit size="small" />
              <Text>{node.title}</Text>
            </div>
            <Text
              type="secondary"
              size="small"
              ellipsis={{ showTooltip: true, rows: 2 }}
              style={{ marginTop: 4, display: 'block' }}
            >
              {node.content}
            </Text>
          </div>
        ),
        key: node.id,
        value: node.id,
      })),
    }));
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
      <Tooltip content={isCollapsed ? '展开侧边栏' : '折叠侧边栏'} position="bottom">
        <Button
          icon={<IconSidebar />}
          theme="borderless"
          size="large"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </Tooltip>
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
      <Layout style={{ height: 'calc(100vh - 72px)', position: 'relative' }}>
        <Sider
          style={{
            backgroundColor: 'var(--semi-color-bg-1)',
            borderRight: '1px solid var(--semi-color-border)',
            width: isCollapsed ? 0 : 280,
            overflow: 'hidden',
            transition: 'width 0.3s ease',
            opacity: isCollapsed ? 0 : 1,
            position: 'relative',
          }}
        >
          <div style={{ padding: '16px', height: '100%', overflow: 'auto', width: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Title heading={5} style={{ margin: 0 }}>
                层结构
              </Title>
              <Button
                icon={<IconChevronLeft />}
                theme="borderless"
                type="tertiary"
                size="small"
                onClick={() => setIsCollapsed(true)}
                style={{ minWidth: 'auto', padding: '4px 8px' }}
              />
            </div>
            {layers.length > 0 ? (
              <Tree
                treeData={buildTreeData()}
                defaultExpandAll
                style={{ fontSize: 14 }}
              />
            ) : (
              <Text type="tertiary">加载中...</Text>
            )}
          </div>
        </Sider>
        {/* 折叠状态下的展开按钮 - 放在侧边栏外部 */}
        {isCollapsed && (
          <Button
            icon={<IconChevronRight />}
            theme="solid"
            type="primary"
            size="small"
            onClick={() => setIsCollapsed(false)}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              borderRadius: '0 4px 4px 0',
              zIndex: 100,
              boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
            }}
          />
        )}
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
              onNodeClick={handleNodeClick}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </Content>
      </Layout>

      {/* 编辑节点内容弹窗 */}
      <Modal
        title={`编辑节点：${currentNode?.title || ''}`}
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentNode(null);
        }}
        onOk={() => formApi?.submitForm()}
        width={700}
      >
        <Form
          getFormApi={(api) => setFormApi(api)}
          onSubmit={handleUpdateNodeContent}
          labelPosition="left"
          labelWidth={80}
          initValues={{
            content: currentNode?.content || '',
          }}
        >
          <Form.TextArea
            field="content"
            label="内容"
            placeholder="请输入节点内容"
            autosize={{ minRows: 10 }}
            rules={[{ required: true, message: '请输入节点内容' }]}
          />
          {currentNode && (
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" size="small">
                节点ID: {currentNode.id}
              </Text>
              <br />
              <Text type="secondary" size="small">
                所属层: 第{layers.find(l => l.nodes?.some(n => n.id === currentNode.id))?.layer_order}层
              </Text>
              {currentNode.duration && (
                <>
                  <br />
                  <Text type="secondary" size="small">
                    时长: {currentNode.duration}秒
                  </Text>
                </>
              )}
            </div>
          )}
        </Form>
      </Modal>
    </AppLayout>
  );
}
