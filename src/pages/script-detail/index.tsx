import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
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
  IconArrowLeft,
  IconEdit,
  IconSidebar,
  IconChevronLeft,
  IconChevronRight,
  IconRotate,
  IconSort,
} from '@douyinfe/semi-icons';
import { getScriptById } from '../../services/scriptService';
import { Script } from '../../types/script';
import { Layer, StoryNode } from '../../types/layer';
import { getLayersByScriptId, updateNodeContent, saveNodePositions } from '../../mock/data/layers';
import AppLayout from '../../components/AppLayout';
import { calculateNodePositions } from './utils/layoutUtils';
import FunctionMenu from './components/FunctionMenu';
import CustomEdge from './components/CustomEdge';
import CustomNode from './components/CustomNode';
import './styles/ScriptDetail.css';

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
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [addNodeModalVisible, setAddNodeModalVisible] = useState(false);
  const [addLayerModalVisible, setAddLayerModalVisible] = useState(false);
  const [layoutDirection, setLayoutDirection] = useState<'horizontal' | 'vertical'>('vertical');
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string>>(new Set());
  const highlightedNodeIdsRef = useRef<Set<string>>(new Set());
  const selectedNodeRef = useRef<StoryNode | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  // 使用 ref 来解决闭包陷阱，确保 onData 中的回调始终是最新的
  const handleDeleteNodeRef = useRef<(nodeId: string) => void>(() => { });
  const handleTraceAncestorsRef = useRef<(nodeId: string) => void>(() => { });

  useEffect(() => {
    highlightedNodeIdsRef.current = highlightedNodeIds;
  }, [highlightedNodeIds]);

  useEffect(() => {
    if (id) {
      loadScript();
      loadLayers();
    }
  }, [id]);

  // 监听节点位置变化，自动保存（防抖）
  useEffect(() => {
    if (nodes.length === 0 || layers.length === 0) return;

    // 清除之前的定时器
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // 设置新的定时器，2秒后自动保存
    saveTimeoutRef.current = window.setTimeout(() => {
      handleAutoSave();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [nodes]); // 当 nodes 变化时触发

  // 处理节点单击：更新选中的节点引用
  const handleNodeClick = useCallback((_event: any, node: FlowNode) => {
    const nodeData = node.data?.node as StoryNode;
    selectedNodeRef.current = nodeData || null;
  }, []);

  // 监听键盘事件，处理空格键打开编辑弹窗
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && selectedNodeRef.current && !editModalVisible) {
        event.preventDefault(); // 防止页面滚动
        setCurrentNode(selectedNodeRef.current);
        setEditModalVisible(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editModalVisible]);

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
  const convertToFlowNodes = (layersData: Layer[], ignoreSavedPositions: boolean = false, direction?: 'horizontal' | 'vertical') => {
    const flowNodes: FlowNode[] = [];
    const flowEdges: Edge[] = [];
    const currentDirection = direction || layoutDirection;

    layersData.forEach((layer) => {
      const nodeCount = layer.nodes?.length || 0;
      const isFirstLayer = layer.layer_order === 1;
      const isLastLayer = layer.layer_order === layersData.length;

      layer.nodes?.forEach((node, index) => {
        // 根据布局方向计算默认位置
        let x: number, y: number;

        if (currentDirection === 'horizontal') {
          // 水平布局：从左到右
          x = (!ignoreSavedPositions && node.position_x !== undefined && node.position_x !== null)
            ? node.position_x
            : layer.layer_order * 400; // 层之间的水平间距
          y = (!ignoreSavedPositions && node.position_y !== undefined && node.position_y !== null)
            ? node.position_y
            : 100 + (index - (nodeCount - 1) / 2) * 120; // 垂直居中分布
        } else {
          // 垂直布局：从上到下
          x = (!ignoreSavedPositions && node.position_x !== undefined && node.position_x !== null)
            ? node.position_x
            : 100 + (index - (nodeCount - 1) / 2) * 200; // 水平居中分布
          y = (!ignoreSavedPositions && node.position_y !== undefined && node.position_y !== null)
            ? node.position_y
            : layer.layer_order * 200; // 层之间的垂直间距
        }

        // 设置连接点位置
        let sourcePosition: string | undefined;
        let targetPosition: string | undefined;

        if (currentDirection === 'horizontal') {
          // 水平布局：第一层输出在右侧，最后一层输入在左侧
          sourcePosition = isLastLayer ? undefined : 'right';
          targetPosition = isFirstLayer ? undefined : 'left';
        } else {
          // 垂直布局：第一层输出在底部，最后一层输入在顶部
          sourcePosition = isLastLayer ? undefined : 'bottom';
          targetPosition = isFirstLayer ? undefined : 'top';
        }

        flowNodes.push({
          id: node.id,
          type: 'custom',
          position: { x, y },
          sourcePosition: sourcePosition as any,
          targetPosition: targetPosition as any,
          data: {
            label: node.title,
            content: node.content,
            node: node,
            isDimmed: highlightedNodeIdsRef.current.size > 0 && !highlightedNodeIdsRef.current.has(node.id),
            onDelete: () => handleDeleteNodeRef.current(node.id),
            onTraceAncestors: () => handleTraceAncestorsRef.current(node.id),
          },
          style: {
            width: 200,
            height: 120,
          },
        });

        // 添加分支连接（带动画和样式）
        node.branches?.forEach((branch) => {
          flowEdges.push({
            id: branch.id,
            source: branch.from_node_id,
            target: branch.to_node_id,
            label: branch.branch_label || '',
            type: 'custom', // 使用自定义类型
            animated: true, // 启用动画
            style: {
              strokeWidth: 3,
              stroke: '#1890ff', // 统一使用蓝色
            },
            labelStyle: {
              fill: '#1890ff',
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

  // 切换布局方向
  const handleToggleLayoutDirection = () => {
    const newDirection = layoutDirection === 'horizontal' ? 'vertical' : 'horizontal';
    setLayoutDirection(newDirection);
    // 重新转换节点位置，忽略已保存的位置，使用新的布局方向计算
    convertToFlowNodes(layers, true, newDirection);
  };

  // 一键整理：按照二叉树格式排列节点
  const handleAutoLayout = () => {
    try {
      const updatedLayers = calculateNodePositions({
        layers,
        layoutDirection
      });

      if (updatedLayers) {
        setLayers(updatedLayers);
        // 这里必须传入 false，表示不忽略已保存的位置，使用上面计算出的 position_x/y
        convertToFlowNodes(updatedLayers, false, layoutDirection);
        Toast.success('节点整理完成');
      }
    } catch (error) {
      Toast.error('整理失败');
      console.error(error);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      // 创建新的分支
      const newBranchId = `branch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newEdge: Edge = {
        id: newBranchId,
        source: params.source,
        target: params.target,
        label: '连接',
        type: 'custom', // 使用自定义类型
        animated: true,
        style: {
          strokeWidth: 3,
          stroke: '#1890ff',
        },
        labelStyle: {
          fill: '#1890ff',
          fontWeight: 600,
        },
        labelBgStyle: {
          fill: '#fff',
          fillOpacity: 0.8,
        },
      };

      // 更新 edges
      setEdges((eds) => addEdge(newEdge, eds));

      // 更新 layers 中的分支数据
      const updatedLayers = layers.map(layer => ({
        ...layer,
        nodes: layer.nodes?.map(node => {
          if (node.id === params.source) {
            const existingBranches = node.branches || [];
            const newBranch = {
              id: newBranchId,
              from_node_id: params.source!,
              to_node_id: params.target!,
              branch_label: '连接',
              branch_type: 'default' as const,
              branch_order: existingBranches.length + 1,
              created_at: new Date().toISOString(),
            };
            return {
              ...node,
              branches: [...existingBranches, newBranch],
            };
          }
          return node;
        }),
      }));

      setLayers(updatedLayers);
      Toast.success('连接创建成功');
    },
    [setEdges, layers]
  );

  // 自动保存节点位置（静默保存，不显示提示）
  const handleAutoSave = useCallback(async () => {
    if (!id || nodes.length === 0 || layers.length === 0) return;

    try {
      // 更新所有节点的位置信息
      const updatedLayers = layers.map(layer => ({
        ...layer,
        nodes: layer.nodes?.map(node => {
          const flowNode = nodes.find((n: FlowNode) => n.id === node.id);
          if (flowNode) {
            return {
              ...node,
              position_x: flowNode.position.x,
              position_y: flowNode.position.y,
              updated_at: new Date().toISOString(),
            };
          }
          return node;
        }),
        updated_at: new Date().toISOString(),
      }));

      // 保存到 mock 服务（实际应该调用 API）
      await saveNodePositions(id, updatedLayers);

      setLayers(updatedLayers);
      // 静默保存，不显示提示
    } catch (error) {
      console.error('自动保存失败', error);
    }
  }, [id, nodes, layers]);

  // 手动保存节点位置和所有数据
  const handleSave = async () => {
    if (!id) return;

    try {
      // 更新所有节点的位置信息
      const updatedLayers = layers.map(layer => ({
        ...layer,
        nodes: layer.nodes?.map(node => {
          const flowNode = nodes.find((n: FlowNode) => n.id === node.id);
          if (flowNode) {
            return {
              ...node,
              position_x: flowNode.position.x,
              position_y: flowNode.position.y,
              updated_at: new Date().toISOString(),
            };
          }
          return node;
        }),
        updated_at: new Date().toISOString(),
      }));

      // 保存到 mock 服务（实际应该调用 API）
      await saveNodePositions(id, updatedLayers);

      setLayers(updatedLayers);
      Toast.success('保存成功');
    } catch (error) {
      Toast.error('保存失败');
      console.error(error);
    }
  };

  const handleReset = () => {
    convertToFlowNodes(layers);
  };

  // 处理节点双击：打开编辑弹窗
  const handleNodeDoubleClick = useCallback((_event: any, node: FlowNode) => {
    const nodeData = node.data?.node as StoryNode;
    if (nodeData) {
      setCurrentNode(nodeData);
      setEditModalVisible(true);
    }
  }, []);

  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
  }), []);

  // 处理连接线删除
  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      // 从 edges 中删除
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));

      // 从 layers 中删除对应的分支
      const updatedLayers = layers.map(layer => ({
        ...layer,
        nodes: layer.nodes?.map(node => {
          if (node.branches) {
            return {
              ...node,
              branches: node.branches.filter(branch => branch.id !== edgeId),
            };
          }
          return node;
        }),
      }));

      setLayers(updatedLayers);
      Toast.success('连接线已删除');
    },
    [setEdges, layers]
  );

  // 处理节点删除
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      if (!id) return;

      try {
        // 从 edges 中删除所有与该节点相关的连接
        setEdges((eds) => eds.filter(
          (e) => e.source !== nodeId && e.target !== nodeId
        ));

        // 从 layers 中删除节点和相关的分支
        const updatedLayers = layers.map(layer => ({
          ...layer,
          nodes: layer.nodes?.filter(node => {
            if (node.id === nodeId) {
              return false; // 删除该节点
            }
            // 删除指向该节点的分支
            if (node.branches) {
              node.branches = node.branches.filter(
                branch => branch.to_node_id !== nodeId
              );
            }
            return true;
          }),
          updated_at: new Date().toISOString(),
        }));

        setLayers(updatedLayers);

        // 重新转换节点（移除已删除的节点）
        convertToFlowNodes(updatedLayers);

        Toast.success('节点已删除');
      } catch (error) {
        Toast.error('删除节点失败');
        console.error(error);
      }
    },
    [id, edges, layers, setEdges]
  );

  // 向上溯源
  const handleTraceAncestors = useCallback((nodeId: string) => {
    const ancestors = new Set<string>();
    const queue = [nodeId];
    ancestors.add(nodeId); // 包括自己

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      // 找到所有指向当前节点的边
      const incomingEdges = edges.filter(e => e.target === currentId);
      incomingEdges.forEach(edge => {
        if (!ancestors.has(edge.source)) {
          ancestors.add(edge.source);
          queue.push(edge.source);
        }
      });
    }
    setHighlightedNodeIds(ancestors);
    Toast.info(`已高亮 ${ancestors.size} 个相关节点`);
  }, [edges]);

  // 取消高亮
  const handleCancelTrace = useCallback(() => {
    if (highlightedNodeIds.size > 0) {
      setHighlightedNodeIds(new Set());
    }
  }, [highlightedNodeIds]);

  // 监听 highlightedNodeIds 变化，更新节点和边的样式
  useEffect(() => {
    // 更新节点样式
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isDimmed: highlightedNodeIds.size > 0 && !highlightedNodeIds.has(node.id),
        },
      }))
    );

    // 更新边样式
    setEdges((eds) =>
      eds.map((edge) => {
        // 如果没有高亮，所有边都是动画的
        if (highlightedNodeIds.size === 0) {
          return {
            ...edge,
            animated: true,
            style: {
              ...edge.style,
              stroke: '#1890ff',
              strokeWidth: 3,
              opacity: 1,
            },
            labelStyle: {
              ...edge.labelStyle,
              fill: '#1890ff',
              opacity: 1,
            }
          };
        }

        // 如果连接的两个节点都在高亮集合中，该边也应该高亮并保持动画
        // 注意：边的 source 和 target 必须都在 ancestors 集合中，
        // 且对于向上溯源来说，应该是 target -> source 的查找路径上的边
        // 但简单来说，只要边的两端都在高亮集合里，就认为是相关边
        const isHighlighted = highlightedNodeIds.has(edge.source) && highlightedNodeIds.has(edge.target);

        if (isHighlighted) {
          return {
            ...edge,
            animated: true,
            style: {
              ...edge.style,
              stroke: '#1890ff',
              strokeWidth: 3,
              opacity: 1,
            },
            labelStyle: {
              ...edge.labelStyle,
              fill: '#1890ff',
              opacity: 1,
            }
          };
        } else {
          // 不相关的边变暗且静止
          return {
            ...edge,
            animated: false,
            style: {
              ...edge.style,
              stroke: '#999',
              strokeWidth: 1,
              opacity: 0.2,
            },
            labelStyle: {
              ...edge.labelStyle,
              fill: '#999',
              opacity: 0.2,
            }
          };
        }
      })
    );
  }, [highlightedNodeIds, setNodes, setEdges]);

  // 更新 ref
  useEffect(() => {
    handleDeleteNodeRef.current = handleDeleteNode;
    handleTraceAncestorsRef.current = handleTraceAncestors;
  }, [handleDeleteNode, handleTraceAncestors]);

  // 更新节点内容
  const handleUpdateNodeContent = async (values: any) => {
    if (!currentNode || !id) return;
    try {
      const updated = await updateNodeContent(currentNode.id, values.content, layers, values.title);
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
                  label: updated.title,
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
          <Text
            strong
            ellipsis={{ showTooltip: false }}
            style={{ maxWidth: '180px' }}
          >
            {layer.title}
          </Text>
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
              // 选中节点
              setNodes((nds) =>
                nds.map((n) => ({
                  ...n,
                  selected: n.id === node.id,
                }))
              );
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconEdit size="small" />
              <Text
                ellipsis={{ showTooltip: false }}
                style={{ flex: 1, minWidth: 0 }}
              >
                {node.title}
              </Text>
            </div>
            <Text
              type="secondary"
              size="small"
              ellipsis={{ showTooltip: false, rows: 1 }}
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

  // 添加节点的处理函数
  const handleAddNode = (values: any) => {
    if (!id) return;

    try {
      // 找到要添加节点的层
      const targetLayer = layers.find(l => l.id === values.layerId);
      if (!targetLayer) {
        Toast.error('找不到指定的层');
        return;
      }

      // 生成新的节点ID
      const newNodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // 计算节点顺序（当前层的节点数量 + 1）
      const nodeOrder = (targetLayer.nodes?.length || 0) + 1;

      // 创建新节点
      const newNode: StoryNode = {
        id: newNodeId,
        layer_id: values.layerId,
        node_order: nodeOrder,
        title: values.title,
        content: values.content,
        duration: values.duration || 30,
        metadata: {
          camera_type: '全景',
          characters: [],
          scene: targetLayer.title,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        branches: [], // 新节点初始没有分支
      };

      // 更新 layers 状态
      const updatedLayers = layers.map(layer => {
        if (layer.id === values.layerId) {
          return {
            ...layer,
            nodes: [...(layer.nodes || []), newNode],
            updated_at: new Date().toISOString(),
          };
        }
        return layer;
      });

      setLayers(updatedLayers);

      // 重新转换并更新 ReactFlow 节点
      convertToFlowNodes(updatedLayers);

      Toast.success('节点添加成功');
    } catch (error) {
      Toast.error('添加节点失败');
      console.error(error);
    }
  };

  // 添加层的处理函数
  const handleAddLayer = (values: any) => {
    if (!id) return;

    try {
      // 计算新的层顺序（当前最大层顺序 + 1）
      const maxLayerOrder = layers.length > 0
        ? Math.max(...layers.map(l => l.layer_order))
        : 0;
      const newLayerOrder = maxLayerOrder + 1;

      // 生成新的层ID
      const newLayerId = `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // 创建新层
      const newLayer: Layer = {
        id: newLayerId,
        script_id: id,
        layer_order: newLayerOrder,
        title: values.title || `第${newLayerOrder}层`,
        description: values.description,
        is_collapsed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        nodes: [], // 新层初始没有节点
      };

      // 更新 layers 状态
      const updatedLayers = [...layers, newLayer].sort((a, b) => a.layer_order - b.layer_order);
      setLayers(updatedLayers);

      // 重新转换并更新 ReactFlow 节点
      convertToFlowNodes(updatedLayers);

      setAddLayerModalVisible(false);
      Toast.success('层添加成功');
    } catch (error) {
      Toast.error('添加层失败');
      console.error(error);
    }
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
      <Tooltip content={isLeftCollapsed ? '展开左侧栏' : '折叠左侧栏'} position="bottom">
        <Button
          icon={<IconSidebar />}
          theme="borderless"
          size="large"
          onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
        />
      </Tooltip>
      <Tooltip content={isRightCollapsed ? '展开右侧栏' : '折叠右侧栏'} position="bottom">
        <Button
          icon={<IconSidebar />}
          theme="borderless"
          size="large"
          onClick={() => setIsRightCollapsed(!isRightCollapsed)}
        />
      </Tooltip>
      <Tooltip content={layoutDirection === 'horizontal' ? '切换为垂直布局' : '切换为水平布局'} position="bottom">
        <Button
          icon={<IconRotate />}
          theme="borderless"
          size="large"
          onClick={handleToggleLayoutDirection}
        />
      </Tooltip>
      <Tooltip content="一键整理：按二叉树格式排列节点" position="bottom">
        <Button
          icon={<IconSort />}
          theme="borderless"
          size="large"
          onClick={handleAutoLayout}
        />
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
        {/* 左侧栏：层结构 */}
        <Sider
          style={{
            backgroundColor: 'var(--semi-color-bg-1)',
            borderRight: '1px solid var(--semi-color-border)',
            width: isLeftCollapsed ? 0 : 280,
            overflow: 'hidden',
            transition: 'width 0.3s ease',
            opacity: isLeftCollapsed ? 0 : 1,
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
                onClick={() => setIsLeftCollapsed(true)}
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
        {/* 左侧折叠状态下的展开按钮 */}
        {isLeftCollapsed && (
          <Button
            icon={<IconChevronRight />}
            theme="solid"
            type="primary"
            size="small"
            onClick={() => setIsLeftCollapsed(false)}
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

        {/* 中间内容区域 */}
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
              onNodeDoubleClick={handleNodeDoubleClick}
              onPaneClick={() => {
                // 点击画布时隐藏所有删除按钮和选中状态
                (window as any).selectedEdgeId = null;
                handleCancelTrace();
                selectedNodeRef.current = null; // 清除选中的节点引用
              }}
              nodeTypes={nodeTypes}
              edgeTypes={{
                custom: (props) => <CustomEdge {...props} onDelete={handleDeleteEdge} />,
              }}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
          <style>{`
            .react-flow__attribution {
              display: none !important;
            }
          `}</style>
        </Content>

        {/* 右侧栏：功能菜单 */}
        <FunctionMenu
          isCollapsed={isRightCollapsed}
          onCollapse={setIsRightCollapsed}
          onAddNode={() => setAddNodeModalVisible(true)}
          onAddLayer={() => setAddLayerModalVisible(true)}
        />
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
            title: currentNode?.title || '',
            content: currentNode?.content || '',
          }}
        >
          <Form.Input
            field="title"
            label="标题"
            placeholder="请输入节点标题"
            rules={[{ required: true, message: '请输入节点标题' }]}
          />
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

      {/* 添加节点弹窗 */}
      <Modal
        title="添加新节点"
        visible={addNodeModalVisible}
        onCancel={() => {
          setAddNodeModalVisible(false);
        }}
        onOk={() => {
          const values = formApi?.getValues();
          if (values?.layerId && values?.title && values?.content) {
            handleAddNode(values);
            setAddNodeModalVisible(false);
          }
        }}
        width={600}
      >
        <Form
          getFormApi={(api) => setFormApi(api)}
          labelPosition="left"
          labelWidth={80}
        >
          <Form.Select
            field="layerId"
            label="选择层"
            placeholder="请选择要添加节点的层"
            rules={[{ required: true, message: '请选择层' }]}
            style={{ width: '100%' }}
          >
            {layers.map(layer => (
              <Form.Select.Option key={layer.id} value={layer.id}>
                第{layer.layer_order}层 - {layer.title} ({layer.nodes?.length || 0}个节点)
              </Form.Select.Option>
            ))}
          </Form.Select>
          <Form.Input
            field="title"
            label="节点标题"
            placeholder="请输入节点标题"
            rules={[{ required: true, message: '请输入节点标题' }]}
          />
          <Form.TextArea
            field="content"
            label="节点内容"
            placeholder="请输入节点内容"
            autosize={{ minRows: 6 }}
            rules={[{ required: true, message: '请输入节点内容' }]}
          />
          <Form.InputNumber
            field="duration"
            label="时长（秒）"
            placeholder="请输入时长"
            min={1}
            style={{ width: '100%' }}
          />
        </Form>
      </Modal>

      {/* 添加层弹窗 */}
      <Modal
        title="添加新层"
        visible={addLayerModalVisible}
        onCancel={() => {
          setAddLayerModalVisible(false);
        }}
        onOk={() => {
          const values = formApi?.getValues();
          if (values?.title) {
            handleAddLayer(values);
          }
        }}
        width={600}
      >
        <Form
          getFormApi={(api) => setFormApi(api)}
          labelPosition="left"
          labelWidth={80}
        >
          <Form.Input
            field="title"
            label="层标题"
            placeholder="请输入层标题"
            rules={[{ required: true, message: '请输入层标题' }]}
          />
          <Form.TextArea
            field="description"
            label="层描述"
            placeholder="请输入层描述（可选）"
            autosize={{ minRows: 3 }}
          />
        </Form>
      </Modal>
    </AppLayout>
  );
}
