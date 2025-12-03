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
  TextArea,
  Card,
  Input,
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
  IconPlay,
  IconTicketCode,
} from '@douyinfe/semi-icons';
import { getScriptById } from '../../services/scriptService';
import { generateInitialNode } from '../../services/nodeAIService';
import { getLayers, createLayer } from '../../services/layerService';
import { createNode, updateNode, deleteNode, batchUpdateNodePositions } from '../../services/nodeService';
import { createBranch, deleteBranch } from '../../services/branchService';
import { Script } from '../../types/script';
import { Layer, StoryNode } from '../../types/layer';
import AppLayout from '../../components/AppLayout';
import { calculateNodePositions } from './utils/layoutUtils';
import FunctionMenu from './components/FunctionMenu';
import CustomEdge from './components/CustomEdge';
import CustomNode from './components/CustomNode';
import TaskProgressPanel from './components/TaskProgressPanel';
import './styles/ScriptDetail.css';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function ScriptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [script, setScript] = useState<Script | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [isLoadingLayers, setIsLoadingLayers] = useState(false);
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

  // AI State
  const [aiResult, setAiResult] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingInitialNode, setIsGeneratingInitialNode] = useState(false);
  const [isUpdatingNode, setIsUpdatingNode] = useState(false);
  const [isAutoGeneratingNodes, setIsAutoGeneratingNodes] = useState(false);
  const [autoGenerateModalVisible, setAutoGenerateModalVisible] = useState(false);
  const [isDeletingEmptyNodes, setIsDeletingEmptyNodes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [isAddingLayer, setIsAddingLayer] = useState(false);
  const [deletingNodeIds, setDeletingNodeIds] = useState<Set<string>>(new Set());
  const [taskProgress, setTaskProgress] = useState<{
    currentStep: string;
    totalSteps: number;
    completedSteps: number;
    currentLayer: number;
    targetLayer: number;
    currentNodeIndex: number;
    totalNodes: number;
    isRunning: boolean;
  } | null>({
    currentStep: '等待任务开始...',
    totalSteps: 0,
    completedSteps: 0,
    currentLayer: 0,
    targetLayer: 0,
    currentNodeIndex: 0,
    totalNodes: 0,
    isRunning: false,
  });

  // Preview State
  const [previewContent, setPreviewContent] = useState<string>('');
  const [previewBranches, setPreviewBranches] = useState<{ label: string }[]>([]);
  const [aiRawResult, setAiRawResult] = useState<string>(''); // 保存 AI 返回的原始内容

  const highlightedNodeIdsRef = useRef<Set<string>>(new Set());
  const selectedNodeRef = useRef<StoryNode | null>(null);
  // const saveTimeoutRef = useRef<number | null>(null); // 自动保存已禁用

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

  // 监听节点位置变化，自动保存（防抖）- 已禁用
  // useEffect(() => {
  //   if (nodes.length === 0 || layers.length === 0) return;

  //   // 清除之前的定时器
  //   if (saveTimeoutRef.current) {
  //     clearTimeout(saveTimeoutRef.current);
  //   }

  //   // 设置新的定时器，2秒后自动保存
  //   saveTimeoutRef.current = window.setTimeout(() => {
  //     handleAutoSave();
  //   }, 2000);

  //   return () => {
  //     if (saveTimeoutRef.current) {
  //       clearTimeout(saveTimeoutRef.current);
  //     }
  //   };
  // }, [nodes]); // 当 nodes 变化时触发

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
    setIsLoadingLayers(true);
    try {
      const layersData = await getLayers(id);
      setLayers(layersData);
      convertToFlowNodes(layersData);
    } catch (error) {
      console.error('加载层数据失败', error);
      Toast.error('加载层数据失败');
    } finally {
      setIsLoadingLayers(false);
    }
  };

  // 将层和节点数据转换为 ReactFlow 的 nodes 和 edges
  const convertToFlowNodes = (layersData: Layer[], ignoreSavedPositions: boolean = false, direction?: 'horizontal' | 'vertical') => {
    const flowNodes: FlowNode[] = [];
    const flowEdges: Edge[] = [];
    const currentDirection = direction || layoutDirection;

    layersData.forEach((layer) => {
      const nodeCount = layer.nodes?.length || 0;
      // 支持两种字段名格式：layer_order 和 layerOrder
      const layerOrder = (layer as any).layer_order ?? (layer as any).layerOrder ?? 1;
      const isFirstLayer = layerOrder === 1;
      const isLastLayer = layerOrder === layersData.length;

      layer.nodes?.forEach((node, index) => {
        // 根据布局方向计算默认位置
        let x: number, y: number;
        // 支持两种字段名格式：layer_order 和 layerOrder
        const layerOrder = (layer as any).layer_order ?? (layer as any).layerOrder ?? 1;

        // 支持两种字段名格式：position_x/position_y 和 positionX/positionY
        const positionX = (node as any).position_x ?? (node as any).positionX;
        const positionY = (node as any).position_y ?? (node as any).positionY;

        if (currentDirection === 'horizontal') {
          // 水平布局：从左到右
          if (!ignoreSavedPositions && positionX !== undefined && positionX !== null && !isNaN(positionX)) {
            x = positionX;
          } else {
            x = layerOrder * 400; // 层之间的水平间距
          }

          if (!ignoreSavedPositions && positionY !== undefined && positionY !== null && !isNaN(positionY)) {
            y = positionY;
          } else {
            const centerOffset = nodeCount > 0 ? (index - (nodeCount - 1) / 2) * 120 : 0;
            y = 100 + centerOffset; // 垂直居中分布
          }
        } else {
          // 垂直布局：从上到下
          if (!ignoreSavedPositions && positionX !== undefined && positionX !== null && !isNaN(positionX)) {
            x = positionX;
          } else {
            const centerOffset = nodeCount > 0 ? (index - (nodeCount - 1) / 2) * 200 : 0;
            x = 100 + centerOffset; // 水平居中分布
          }

          if (!ignoreSavedPositions && positionY !== undefined && positionY !== null && !isNaN(positionY)) {
            y = positionY;
          } else {
            y = layerOrder * 200; // 层之间的垂直间距
          }
        }

        // 确保 x 和 y 是有效数字
        if (isNaN(x) || !isFinite(x)) x = 100;
        if (isNaN(y) || !isFinite(y)) y = 100;

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
            isDeleting: deletingNodeIds.has(node.id),
          },
          style: {
            width: 200,
            height: 120,
          },
        });

        // 添加分支连接（带动画和样式）
        node.branches?.forEach((branch) => {
          // 支持两种字段名格式：from_node_id/to_node_id 和 fromNodeId/toNodeId
          const fromNodeId = (branch as any).from_node_id ?? (branch as any).fromNodeId;
          const toNodeId = (branch as any).to_node_id ?? (branch as any).toNodeId;
          const branchLabel = (branch as any).branch_label ?? (branch as any).branchLabel ?? '';

          if (!fromNodeId || !toNodeId) {
            console.warn('分支缺少必要的节点ID:', branch);
            return;
          }

          flowEdges.push({
            id: branch.id,
            source: fromNodeId,
            target: toNodeId,
            label: branchLabel,
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

  // 一键整理：按照指定模式排列节点
  const handleAutoLayout = (mode: 'tree' | 'compact' = 'tree') => {
    try {
      const updatedLayers = calculateNodePositions({
        layers,
        layoutDirection,
        mode
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
    async (params: Connection) => {
      if (!params.source || !params.target || !id) return;

      try {
        // 找到源节点的分支数量，用于计算 branch_order
        const sourceNode = layers
          .flatMap(l => l.nodes || [])
          .find(n => n.id === params.source);
        const existingBranchesCount = sourceNode?.branches?.length || 0;

        // 调用 API 创建分支
        const newBranch = await createBranch(id, {
          from_node_id: params.source,
          to_node_id: params.target,
          branch_label: '连接',
          branch_type: 'default',
          branch_order: existingBranchesCount + 1,
        });

        // 创建新的边
        // 支持两种字段名格式：branch_label 和 branchLabel
        const branchLabel = (newBranch as any).branch_label ?? (newBranch as any).branchLabel ?? '连接';
        const newEdge: Edge = {
          id: newBranch.id,
          source: params.source,
          target: params.target,
          label: branchLabel,
          type: 'custom',
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
      } catch (error) {
        Toast.error('创建连接失败');
        console.error(error);
      }
    },
    [id, setEdges, layers]
  );

  // 自动保存节点位置（静默保存，不显示提示）- 已禁用
  // const handleAutoSave = useCallback(async () => {
  //   if (!id || nodes.length === 0 || layers.length === 0) return;

  //   try {
  //     // 收集所有需要更新位置的节点
  //     const positionsToUpdate = nodes
  //       .map(flowNode => {
  //         const node = layers
  //           .flatMap(l => l.nodes || [])
  //           .find(n => n.id === flowNode.id);

  //         const x = flowNode.position?.x;
  //         const y = flowNode.position?.y;

  //         // 确保位置值是有效的数字
  //         if (x === null || x === undefined || y === null || y === undefined ||
  //           typeof x !== 'number' || typeof y !== 'number' ||
  //           isNaN(x) || isNaN(y)) {
  //           return null;
  //         }

  //         // 只更新位置有变化的节点
  //         if (node && (
  //           node.position_x !== x ||
  //           node.position_y !== y
  //         )) {
  //           return {
  //             node_id: flowNode.id,
  //             position_x: x,
  //             position_y: y,
  //           };
  //         }
  //         return null;
  //       })
  //       .filter((item): item is { node_id: string; position_x: number; position_y: number } => item !== null);

  //     if (positionsToUpdate.length === 0) return;

  //     // 调用批量更新位置 API
  //     await batchUpdateNodePositions(id, positionsToUpdate);

  //     // 更新本地状态
  //     const updatedLayers = layers.map(layer => ({
  //       ...layer,
  //       nodes: layer.nodes?.map(node => {
  //         const flowNode = nodes.find((n: FlowNode) => n.id === node.id);
  //         if (flowNode) {
  //           const x = flowNode.position?.x;
  //           const y = flowNode.position?.y;

  //           // 只更新有效的位置值
  //           if (x !== null && x !== undefined && y !== null && y !== undefined &&
  //             typeof x === 'number' && typeof y === 'number' &&
  //             !isNaN(x) && !isNaN(y)) {
  //             return {
  //               ...node,
  //               position_x: x,
  //               position_y: y,
  //               updated_at: new Date().toISOString(),
  //             };
  //           }
  //         }
  //         return node;
  //       }),
  //       updated_at: new Date().toISOString(),
  //     }));

  //     setLayers(updatedLayers);
  //     // 静默保存，不显示提示
  //   } catch (error) {
  //     console.error('自动保存失败', error);
  //   }
  // }, [id, nodes, layers]);

  // 手动保存节点位置和所有数据
  const handleSave = async () => {
    if (!id || isSaving) return;

    setIsSaving(true);
    const loadingToast = Toast.info({
      content: '正在保存...',
      duration: 0,
    });

    try {
      // 收集所有需要更新位置的节点，过滤掉无效的位置值
      const positionsToUpdate = nodes
        .map(flowNode => {
          const x = flowNode.position?.x;
          const y = flowNode.position?.y;

          // 确保位置值是有效的数字
          if (x !== null && x !== undefined && y !== null && y !== undefined &&
            typeof x === 'number' && typeof y === 'number' &&
            !isNaN(x) && !isNaN(y)) {
            return {
              node_id: flowNode.id,
              position_x: x,
              position_y: y,
            };
          }
          return null;
        })
        .filter((item): item is { node_id: string; position_x: number; position_y: number } => item !== null);

      if (positionsToUpdate.length > 0) {
        // 调用批量更新位置 API
        await batchUpdateNodePositions(id, positionsToUpdate);
      }

      // 更新本地状态
      const updatedLayers = layers.map(layer => ({
        ...layer,
        nodes: layer.nodes?.map(node => {
          const flowNode = nodes.find((n: FlowNode) => n.id === node.id);
          if (flowNode) {
            const x = flowNode.position?.x;
            const y = flowNode.position?.y;

            // 只更新有效的位置值
            if (x !== null && x !== undefined && y !== null && y !== undefined &&
              typeof x === 'number' && typeof y === 'number' &&
              !isNaN(x) && !isNaN(y)) {
              return {
                ...node,
                position_x: x,
                position_y: y,
                updated_at: new Date().toISOString(),
              };
            }
          }
          return node;
        }),
        updated_at: new Date().toISOString(),
      }));

      setLayers(updatedLayers);
      Toast.close(loadingToast);
      Toast.success('保存成功');
    } catch (error) {
      Toast.close(loadingToast);
      Toast.error('保存失败');
      console.error(error);
    } finally {
      setIsSaving(false);
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
    async (edgeId: string) => {
      if (!id) return;

      try {
        // 调用 API 删除分支
        await deleteBranch(id, edgeId);

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
      } catch (error) {
        Toast.error('删除连接线失败');
        console.error(error);
      }
    },
    [id, setEdges, layers]
  );

  // 处理节点删除
  const handleDeleteNode = useCallback(
    async (nodeId: string) => {
      if (!id || deletingNodeIds.has(nodeId)) return;

      setDeletingNodeIds(prev => new Set(prev).add(nodeId));
      const loadingToast = Toast.info({
        content: '正在删除节点...',
        duration: 0,
      });

      try {
        // 调用 API 删除节点（会自动删除相关分支）
        const result = await deleteNode(id, nodeId);

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
                branch => {
                  const toNodeId = (branch as any).to_node_id ?? (branch as any).toNodeId;
                  return toNodeId !== nodeId;
                }
              );
            }
            return true;
          }),
          updated_at: new Date().toISOString(),
        }));

        setLayers(updatedLayers);

        // 重新转换节点（移除已删除的节点）
        convertToFlowNodes(updatedLayers);

        Toast.close(loadingToast);
        Toast.success(`节点已删除${result.deleted_branches_count > 0 ? `（已删除 ${result.deleted_branches_count} 个分支）` : ''}`);
      } catch (error) {
        Toast.close(loadingToast);
        Toast.error('删除节点失败');
        console.error(error);
      } finally {
        setDeletingNodeIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(nodeId);
          return newSet;
        });
      }
    },
    [id, edges, layers, setEdges, deletingNodeIds]
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

  // Parse AI result when it changes
  useEffect(() => {
    if (!aiResult) {
      setPreviewContent('');
      setPreviewBranches([]);
      setAiRawResult('');
      return;
    }

    // 保存原始内容
    setAiRawResult(aiResult);

    // 使用和 parseAIResponse 相同的解析逻辑
    let content = aiResult;
    const options: string[] = [];

    // 先移除代码块标记 ```
    content = content.replace(/```[\s\S]*?```/g, '').trim();

    // 查找 <options> 标签
    const optionsMatch = content.match(/<options>([\s\S]*?)<\/options>/i);
    if (optionsMatch) {
      const optionsText = optionsMatch[1].trim();

      // 从 <options> 标签中提取选项
      const lines = optionsText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      lines.forEach(line => {
        // 移除编号前缀（如 "1. " 或 "1."）和引号
        const cleaned = line.replace(/^\d+\.\s*/, '').replace(/^["']|["']$/g, '').trim();
        if (cleaned.length > 0 && !cleaned.startsWith('{') && !cleaned.startsWith('[')) {
          // 排除 JSON 格式的行
          options.push(cleaned);
        }
      });

      // 移除 <options> 标签及其内容
      content = content.replace(optionsMatch[0], '').trim();
    }

    // 移除 JSON 格式的选项数据（如果在 <options> 标签外）
    try {
      const jsonMatch = content.match(/\{"items":\s*\[[\s\S]*?\]\}/);
      if (jsonMatch) {
        content = content.replace(jsonMatch[0], '').trim();
      }
    } catch (e) {
      // JSON 解析失败，忽略
    }

    // 再次清理代码块标记（防止有残留）
    content = content.replace(/```[\s\S]*?```/g, '').trim();
    // 清理多余的换行
    content = content.replace(/\n{3,}/g, '\n\n').trim();

    setPreviewContent(content.trim());
    setPreviewBranches(options.filter(opt => opt.length > 0).map(opt => ({ label: opt })));
  }, [aiResult]);

  // 构建从根节点到当前节点的历史对话
  const buildHistoryFromRootToCurrent = (targetNode: StoryNode): Array<{ role: string; content: string }> => {
    const history: Array<{ role: string; content: string }> = [];
    const visited = new Set<string>();

    // 找到从当前节点到根节点的路径
    const findPathToRoot = (nodeId: string, path: StoryNode[] = []): StoryNode[] | null => {
      if (visited.has(nodeId)) return null;
      visited.add(nodeId);

      // 找到当前节点
      const currentNode = layers
        .flatMap(l => l.nodes || [])
        .find(n => n.id === nodeId);

      if (!currentNode) return null;

      const currentPath = [...path, currentNode];

      // 检查是否是根节点（没有父节点）
      const hasParent = layers.some(layer =>
        layer.nodes?.some(n =>
          n.branches?.some(branch => {
            const toNodeId = (branch as any).to_node_id ?? (branch as any).toNodeId;
            return toNodeId === nodeId;
          })
        )
      );

      if (!hasParent) {
        // 这是根节点
        return currentPath;
      }

      // 找到父节点（通过分支）
      for (const layer of layers) {
        for (const node of layer.nodes || []) {
          const parentBranch = node.branches?.find(branch => {
            const toNodeId = (branch as any).to_node_id ?? (branch as any).toNodeId;
            return toNodeId === nodeId;
          });

          if (parentBranch) {
            const parentPath = findPathToRoot(node.id, currentPath);
            if (parentPath) return parentPath;
          }
        }
      }

      return null;
    };

    // 找到路径
    const path = findPathToRoot(targetNode.id);
    if (!path || path.length === 0) {
      return history;
    }

    // 构建历史对话
    for (let i = 0; i < path.length; i++) {
      const node = path[i];

      // 添加 assistant 消息（节点的 AI 原始内容）
      const metadata = node.metadata as any;
      const aiRawContent = metadata?.aiRawContent ?? metadata?.ai_raw_content;
      if (aiRawContent) {
        history.push({
          role: 'assistant',
          content: typeof aiRawContent === 'string' ? aiRawContent : JSON.stringify(aiRawContent, null, 2),
        });
      }

      // 如果不是最后一个节点，添加 user 消息（分支标签）
      if (i < path.length - 1) {
        const nextNode = path[i + 1];
        // 找到从当前节点到下一个节点的分支
        const branch = node.branches?.find(branch => {
          const toNodeId = (branch as any).to_node_id ?? (branch as any).toNodeId;
          return toNodeId === nextNode.id;
        });

        if (branch) {
          const branchLabel = (branch as any).branch_label ?? (branch as any).branchLabel ?? '';
          if (branchLabel) {
            history.push({
              role: 'user',
              content: branchLabel,
            });
          }
        }
      }
    }

    return history;
  };

  // AI 生成处理
  const handleGenerateAI = async () => {
    if (!currentNode || !id) {
      Toast.warning('请先选择节点');
      return;
    }

    const NODE_AI_API_URL = import.meta.env.VITE_NODE_AI_API_URL || '';
    if (!NODE_AI_API_URL) {
      Toast.error('AI 节点生成 API URL 未配置');
      return;
    }

    setIsGenerating(true);
    try {
      setAiResult('');

      // 构建历史对话
      const history = buildHistoryFromRootToCurrent(currentNode);

      // 找到当前节点的父节点和分支标签
      let parentBranchLabel = '';
      for (const layer of layers) {
        for (const node of layer.nodes || []) {
          const branch = node.branches?.find(branch => {
            const toNodeId = (branch as any).to_node_id ?? (branch as any).toNodeId;
            return toNodeId === currentNode.id;
          });
          if (branch) {
            parentBranchLabel = (branch as any).branch_label ?? (branch as any).branchLabel ?? '';
            break;
          }
        }
        if (parentBranchLabel) break;
      }

      // 构建 question
      const question = parentBranchLabel
        ? `I choose ${parentBranchLabel}, please continue generating the script.`
        : 'Please continue generating the script.';

      // 调用 AI API
      const apiUrl = `${NODE_AI_API_URL}/chat/simple-chat`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId: '剧本-副本',
          promptId: 'x09UFh3AtIcSO2lJ0UFcF',
          history: history,
          featureFlag: 'normal',
          streamReply: false,
          question: question,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 请求失败: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const result = await response.json();

      // 支持多种响应格式
      let rawContent = '';
      if (result.content) {
        rawContent = result.content;
      } else if (result.text) {
        rawContent = result.text;
      } else if (result.message) {
        rawContent = result.message;
      } else if (result.data?.content) {
        rawContent = result.data.content;
      } else if (result.data?.text) {
        rawContent = result.data.text;
      } else {
        rawContent = JSON.stringify(result, null, 2);
      }

      setAiResult(rawContent);
      setAiRawResult(rawContent); // 保存原始内容用于后续保存到 metadata
    } catch (error) {
      Toast.error(error instanceof Error ? error.message : '生成失败');
      console.error('生成失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyAI = async () => {
    if (!currentNode || !id || isUpdatingNode) return;

    setIsUpdatingNode(true);

    // 显示开始提示
    let loadingToast: any = null;

    const showProgress = (message: string) => {
      if (loadingToast) {
        Toast.close(loadingToast);
      }
      loadingToast = Toast.info({
        content: message,
        duration: 0, // 不自动关闭
      });
    };

    try {
      const newContent = previewContent;
      const newBranches = previewBranches;

      // 先把正则后的内容展示到上面的内容框
      if (formApi) {
        formApi.setValue('content', newContent);
      }

      showProgress('正在保存节点内容...');

      // 更新当前节点的内容和 metadata
      const updatedCurrentNode = await updateNode(id, currentNode.id, {
        title: currentNode.title,
        content: newContent,
        change_reason: 'continue',
        metadata: {
          ...(currentNode.metadata || {}),
          aiRawContent: aiRawResult, // 保存 AI 返回的原始内容
        },
      });

      const currentLayerIndex = layers.findIndex(l => l.nodes?.some(n => n.id === currentNode.id));
      if (currentLayerIndex === -1) {
        if (loadingToast) Toast.close(loadingToast);
        return;
      }

      const currentLayer = layers[currentLayerIndex];
      let nextLayer = layers[currentLayerIndex + 1];

      // 如果有分支预览，创建子节点（不生成内容，只创建节点）
      if (newBranches && newBranches.length > 0) {
        showProgress(`正在创建 ${newBranches.length} 个子节点...`);

        // 确保下一层存在
        if (!nextLayer) {
          // 支持两种字段名格式：layer_order 和 layerOrder
          const currentLayerOrder = (currentLayer as any).layer_order ?? (currentLayer as any).layerOrder ?? 1;
          const newLayerOrder = currentLayerOrder + 1;
          nextLayer = await createLayer(id, {
            title: `第${newLayerOrder}层`,
            description: '分支层',
            layer_order: newLayerOrder,
          });
        }

        // 为每个分支创建子节点
        for (let index = 0; index < newBranches.length; index++) {
          const branchLabel = newBranches[index].label;

          // 更新进度提示
          showProgress(`正在创建子节点 ${index + 1}/${newBranches.length}: ${branchLabel}`);

          // 计算子节点位置
          const secondLayerOrder = (nextLayer as any).layer_order ?? (nextLayer as any).layerOrder ?? 2;
          const childPositionX = layoutDirection === 'horizontal'
            ? secondLayerOrder * 400
            : 100 + (index - (newBranches.length - 1) / 2) * 200;
          const childPositionY = layoutDirection === 'horizontal'
            ? 100 + (index - (newBranches.length - 1) / 2) * 120
            : secondLayerOrder * 200;

          // 创建子节点（空内容）
          const childNode = await createNode(id, nextLayer.id, {
            title: branchLabel,
            content: '',
            duration: 30,
            position_x: childPositionX,
            position_y: childPositionY,
          });

          // 创建分支连接
          await createBranch(id, {
            from_node_id: updatedCurrentNode.id,
            to_node_id: childNode.id,
            branch_label: branchLabel,
            branch_type: 'default',
            branch_order: index + 1,
          });
        }
      }

      showProgress('正在刷新页面数据...');

      // 重新加载层数据以更新 UI
      await loadLayers();

      // 关闭进度提示
      if (loadingToast) {
        Toast.close(loadingToast);
      }

      Toast.success('AI生成内容并应用成功');

      setAiResult('');
      setAiRawResult('');

      // 成功以后退出模态框
      setEditModalVisible(false);
      setCurrentNode(null);
    } catch (error) {
      console.error(error);
      // 关闭进度提示
      if (loadingToast) {
        Toast.close(loadingToast);
      }
      Toast.error(error instanceof Error ? `应用失败: ${error.message}` : '应用失败');
    } finally {
      setIsUpdatingNode(false);
    }
  };

  // 一键自动生成节点
  const handleAutoGenerateNodes = async () => {
    if (!id || !script) {
      Toast.warning('请先加载剧本信息');
      return;
    }

    const values = formApi?.getValues();
    if (!values?.targetLayer || values.targetLayer < 1) {
      Toast.warning('请输入有效的目标层数');
      return;
    }

    const targetLayer = values.targetLayer;
    const NODE_AI_API_URL = import.meta.env.VITE_NODE_AI_API_URL || '';
    if (!NODE_AI_API_URL) {
      Toast.error('AI 节点生成 API URL 未配置');
      return;
    }

    setIsAutoGeneratingNodes(true);
    setAutoGenerateModalVisible(false);

    // 配置：最大重试次数（格式错误时自动重新生成）
    const MAX_RETRY_COUNT = 3;

    let loadingToast: any = null;
    const showProgress = (message: string) => {
      if (loadingToast) {
        Toast.close(loadingToast);
      }
      loadingToast = Toast.info({
        content: message,
        duration: 0,
      });
    };

    try {
      // 获取当前最大层数
      const getMaxLayerOrder = () => {
        let maxOrder = 0;
        for (const layer of layers) {
          const order = (layer as any).layer_order ?? (layer as any).layerOrder ?? 0;
          if (order > maxOrder) {
            maxOrder = order;
          }
        }
        return maxOrder;
      };

      // 检测节点是否有子节点（通过分支）
      const getChildNodeCount = (node: StoryNode): number => {
        return node.branches?.length || 0;
      };

      // 检测节点是否有内容
      const hasContent = (node: StoryNode): boolean => {
        return !!(node.content && node.content.trim().length > 0);
      };

      // 获取需要生成子节点的节点列表
      const getNodesNeedingChildren = (currentLayers: Layer[], maxLayerOrder: number): StoryNode[] => {
        const nodes: StoryNode[] = [];
        for (const layer of currentLayers) {
          const layerOrder = (layer as any).layer_order ?? (layer as any).layerOrder ?? 0;

          // 如果当前层已经达到或超过目标层数，跳过（不生成子节点）
          if (layerOrder >= maxLayerOrder) {
            continue;
          }

          for (const node of layer.nodes || []) {
            const childCount = getChildNodeCount(node);
            const nodeHasContent = hasContent(node);

            // 如果节点没有内容，或者子节点数量少于2个，都需要生成
            if (!nodeHasContent || childCount < 2) {
              nodes.push(node);
            }
          }
        }
        return nodes;
      };

      // 为单个节点生成内容和子节点
      const generateNodeContent = async (node: StoryNode, currentLayers: Layer[]): Promise<{ content: string; options: string[]; rawContent: string }> => {
        // 构建历史对话（使用最新的层数据）
        const buildHistoryWithLayers = (targetNode: StoryNode, layersData: Layer[]): Array<{ role: string; content: string }> => {
          const history: Array<{ role: string; content: string }> = [];
          const visited = new Set<string>();

          // 找到从当前节点到根节点的路径
          const findPathToRoot = (nodeId: string, path: StoryNode[] = []): StoryNode[] | null => {
            if (visited.has(nodeId)) return null;
            visited.add(nodeId);

            // 找到当前节点
            const currentNode = layersData
              .flatMap(l => l.nodes || [])
              .find(n => n.id === nodeId);

            if (!currentNode) return null;

            const currentPath = [...path, currentNode];

            // 检查是否是根节点（没有父节点）
            const hasParent = layersData.some(layer =>
              layer.nodes?.some(n =>
                n.branches?.some(branch => {
                  const toNodeId = (branch as any).to_node_id ?? (branch as any).toNodeId;
                  return toNodeId === nodeId;
                })
              )
            );

            if (!hasParent) {
              // 这是根节点
              return currentPath;
            }

            // 找到父节点（通过分支）
            for (const layer of layersData) {
              for (const node of layer.nodes || []) {
                const parentBranch = node.branches?.find(branch => {
                  const toNodeId = (branch as any).to_node_id ?? (branch as any).toNodeId;
                  return toNodeId === nodeId;
                });

                if (parentBranch) {
                  const parentPath = findPathToRoot(node.id, currentPath);
                  if (parentPath) return parentPath;
                }
              }
            }

            return null;
          };

          // 找到路径
          const path = findPathToRoot(targetNode.id);
          if (!path || path.length === 0) {
            return history;
          }

          // 构建历史对话
          for (let i = 0; i < path.length; i++) {
            const node = path[i];

            // 添加 assistant 消息（节点的 AI 原始内容）
            const metadata = node.metadata as any;
            const aiRawContent = metadata?.aiRawContent ?? metadata?.ai_raw_content;
            if (aiRawContent) {
              history.push({
                role: 'assistant',
                content: typeof aiRawContent === 'string' ? aiRawContent : JSON.stringify(aiRawContent, null, 2),
              });
            }

            // 如果不是最后一个节点，添加 user 消息（分支标签）
            if (i < path.length - 1) {
              const nextNode = path[i + 1];
              // 找到从当前节点到下一个节点的分支
              const branch = node.branches?.find(branch => {
                const toNodeId = (branch as any).to_node_id ?? (branch as any).toNodeId;
                return toNodeId === nextNode.id;
              });

              if (branch) {
                const branchLabel = (branch as any).branch_label ?? (branch as any).branchLabel ?? '';
                if (branchLabel) {
                  history.push({
                    role: 'user',
                    content: branchLabel,
                  });
                }
              }
            }
          }

          return history;
        };

        // 构建历史对话（使用最新的层数据）
        const history = buildHistoryWithLayers(node, currentLayers);

        // 找到当前节点的父节点和分支标签（使用最新的层数据）
        let parentBranchLabel = '';
        for (const layer of currentLayers) {
          for (const n of layer.nodes || []) {
            const branch = n.branches?.find(branch => {
              const toNodeId = (branch as any).to_node_id ?? (branch as any).toNodeId;
              return toNodeId === node.id;
            });
            if (branch) {
              parentBranchLabel = (branch as any).branch_label ?? (branch as any).branchLabel ?? '';
              break;
            }
          }
          if (parentBranchLabel) break;
        }

        // 构建 question
        const question = parentBranchLabel
          ? `I choose ${parentBranchLabel}, please continue generating the script.`
          : 'Please continue generating the script.';

        // 调用 AI API
        const apiUrl = `${NODE_AI_API_URL}/chat/simple-chat`;
        let retryCount = 0;
        let isValidFormat = false;
        let result: { content: string; options: string[]; rawContent: string } | null = null;

        while (retryCount < MAX_RETRY_COUNT && !isValidFormat) {
          try {
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                modelId: '剧本-副本',
                promptId: 'x09UFh3AtIcSO2lJ0UFcF',
                history: history,
                featureFlag: 'normal',
                streamReply: false,
                question: question,
              }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`API 请求失败: ${response.status} ${response.statusText}. ${errorText}`);
            }

            const apiResult = await response.json();

            // 支持多种响应格式
            let rawContent = '';
            if (apiResult.content) {
              rawContent = apiResult.content;
            } else if (apiResult.text) {
              rawContent = apiResult.text;
            } else if (apiResult.message) {
              rawContent = apiResult.message;
            } else if (apiResult.data?.content) {
              rawContent = apiResult.data.content;
            } else if (apiResult.data?.text) {
              rawContent = apiResult.data.text;
            } else {
              rawContent = JSON.stringify(apiResult, null, 2);
            }

            // 解析内容和选项（使用和 parseAIResponse 相同的逻辑）
            let content = rawContent;
            const options: string[] = [];

            // 先移除代码块标记 ```
            content = content.replace(/```[\s\S]*?```/g, '').trim();

            // 查找 <options> 标签
            const optionsMatch = content.match(/<options>([\s\S]*?)<\/options>/i);
            if (optionsMatch) {
              const optionsText = optionsMatch[1].trim();
              const lines = optionsText.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

              lines.forEach(line => {
                const cleaned = line.replace(/^\d+\.\s*/, '').replace(/^["']|["']$/g, '').trim();
                if (cleaned.length > 0 && !cleaned.startsWith('{') && !cleaned.startsWith('[')) {
                  options.push(cleaned);
                }
              });

              content = content.replace(optionsMatch[0], '').trim();
            }

            // 移除 JSON 格式的选项数据
            try {
              const jsonMatch = content.match(/\{"items":\s*\[[\s\S]*?\]\}/);
              if (jsonMatch) {
                content = content.replace(jsonMatch[0], '').trim();
              }
            } catch (e) {
              // 忽略
            }

            content = content.replace(/```[\s\S]*?```/g, '').trim();
            content = content.replace(/\n{3,}/g, '\n\n').trim();

            // 检查格式是否正确：应该至少提取到2个选项
            if (options && options.length >= 2) {
              isValidFormat = true;
              result = {
                content: content.trim(),
                options: options.slice(0, 2), // 只取前2个选项
                rawContent: rawContent,
              };
            } else {
              retryCount++;
              if (retryCount < MAX_RETRY_COUNT) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          } catch (error) {
            retryCount++;
            if (retryCount >= MAX_RETRY_COUNT) {
              throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        if (!result || !isValidFormat) {
          throw new Error(`经过 ${MAX_RETRY_COUNT} 次重试后，仍无法提取到有效的选项格式。`);
        }

        return result;
      };

      // 主循环：逐层生成
      let currentMaxLayer = getMaxLayerOrder();
      let totalSteps = 0;
      let completedSteps = 0;

      // 初始化任务进度
      setTaskProgress({
        currentStep: '准备开始生成...',
        totalSteps: 0,
        completedSteps: 0,
        currentLayer: currentMaxLayer,
        targetLayer: targetLayer,
        currentNodeIndex: 0,
        totalNodes: 0,
        isRunning: true,
      });

      try {
        while (currentMaxLayer < targetLayer) {
          // 重新加载层数据
          const currentLayers = await getLayers(id);
          setLayers(currentLayers);

          // 获取需要生成子节点的节点（传入目标层数，确保不会在目标层生成子节点）
          const nodesNeedingChildren = getNodesNeedingChildren(currentLayers, targetLayer);

          if (nodesNeedingChildren.length === 0) {
            // 没有需要生成的节点，检查是否已达到目标层数
            if (currentMaxLayer >= targetLayer) {
              break;
            }
            // 如果还没有达到目标层数但没有需要生成的节点，说明所有节点都有子节点了
            // 这种情况不应该发生，但为了安全起见，我们继续下一层
            currentMaxLayer++;
            continue;
          }

          // 更新总步骤数（只在第一次计算）
          if (totalSteps === 0) {
            // 估算总步骤数：每层节点数 + 层数
            let estimatedSteps = 0;
            for (let layerOrder = currentMaxLayer; layerOrder < targetLayer; layerOrder++) {
              const layerNodes = currentLayers.filter(l => {
                const order = (l as any).layer_order ?? (l as any).layerOrder ?? 0;
                return order === layerOrder;
              });
              estimatedSteps += layerNodes.reduce((sum, l) => sum + (l.nodes?.length || 0), 0);
            }
            totalSteps = estimatedSteps || nodesNeedingChildren.length;
          }

          showProgress(`正在生成第 ${currentMaxLayer + 1} 层，共 ${nodesNeedingChildren.length} 个节点需要生成子节点...`);

          // 更新任务进度
          setTaskProgress({
            currentStep: `正在生成第 ${currentMaxLayer + 1} 层`,
            totalSteps: totalSteps,
            completedSteps: completedSteps,
            currentLayer: currentMaxLayer + 1,
            targetLayer: targetLayer,
            currentNodeIndex: 0,
            totalNodes: nodesNeedingChildren.length,
            isRunning: true,
          });

          // 为每个需要生成子节点的节点生成内容
          for (let i = 0; i < nodesNeedingChildren.length; i++) {
            const node = nodesNeedingChildren[i];
            const nodeLayer = currentLayers.find(l => l.nodes?.some(n => n.id === node.id));

            if (!nodeLayer) continue;

            showProgress(`正在为节点 "${node.title}" 生成内容 (${i + 1}/${nodesNeedingChildren.length})...`);

            // 更新节点进度
            setTaskProgress({
              currentStep: `正在为节点 "${node.title}" 生成内容`,
              totalSteps: totalSteps,
              completedSteps: completedSteps,
              currentLayer: currentMaxLayer + 1,
              targetLayer: targetLayer,
              currentNodeIndex: i + 1,
              totalNodes: nodesNeedingChildren.length,
              isRunning: true,
            });

            try {
              const nodeHasContent = hasContent(node);
              const childCount = getChildNodeCount(node);

              // 如果节点没有内容，先生成内容
              if (!nodeHasContent) {
                // 生成节点内容（传入最新的层数据）
                const { content, options, rawContent } = await generateNodeContent(node, currentLayers);

                // 更新节点内容
                await updateNode(id, node.id, {
                  title: node.title,
                  content: content,
                  change_reason: 'continue',
                  metadata: {
                    ...(node.metadata || {}),
                    aiRawContent: rawContent,
                  },
                });

                // 重新加载层数据以获取更新后的节点，并立即刷新页面展示
                const updatedLayers = await getLayers(id);
                setLayers(updatedLayers);
                convertToFlowNodes(updatedLayers);

                // 从更新后的层数据中获取最新的节点信息
                const updatedNode = updatedLayers
                  .flatMap(l => l.nodes || [])
                  .find(n => n.id === node.id);

                if (!updatedNode) {
                  console.error(`无法找到更新后的节点: ${node.id}`);
                  continue;
                }

                // 如果节点已经有内容但子节点不足2个，需要生成子节点
                // 检查下一层是否会超过目标层数
                const nodeLayerOrder = (nodeLayer as any).layer_order ?? (nodeLayer as any).layerOrder ?? 1;
                const nextLayerOrder = nodeLayerOrder + 1;

                // 如果下一层会超过目标层数，不生成子节点
                if (childCount < 2 && options && options.length >= 2 && nextLayerOrder <= targetLayer) {
                  // 确保下一层存在

                  let nextLayer = updatedLayers.find(l => {
                    const order = (l as any).layer_order ?? (l as any).layerOrder;
                    return order === nextLayerOrder;
                  });

                  if (!nextLayer) {
                    nextLayer = await createLayer(id, {
                      title: `第${nextLayerOrder}层`,
                      description: '分支层',
                      layer_order: nextLayerOrder,
                    });
                    // 重新加载层数据
                    const refreshedLayers = await getLayers(id);
                    setLayers(refreshedLayers);
                    nextLayer = refreshedLayers.find(l => {
                      const order = (l as any).layer_order ?? (l as any).layerOrder;
                      return order === nextLayerOrder;
                    }) || nextLayer;
                  }

                  // 为每个选项创建子节点（只创建2个）
                  for (let index = 0; index < Math.min(2, options.length); index++) {
                    const optionLabel = options[index];

                    // 计算子节点位置
                    const childPositionX = layoutDirection === 'horizontal'
                      ? nextLayerOrder * 400
                      : 100 + (index - 0.5) * 200;
                    const childPositionY = layoutDirection === 'horizontal'
                      ? 100 + (index - 0.5) * 120
                      : nextLayerOrder * 200;

                    // 创建子节点（空内容）
                    const childNode = await createNode(id, nextLayer.id, {
                      title: optionLabel,
                      content: '',
                      duration: 30,
                      position_x: childPositionX,
                      position_y: childPositionY,
                    });

                    // 创建分支连接
                    await createBranch(id, {
                      from_node_id: updatedNode.id,
                      to_node_id: childNode.id,
                      branch_label: optionLabel,
                      branch_type: 'default',
                      branch_order: index + 1,
                    });

                    // 立即刷新页面展示新创建的节点和分支
                    const refreshedLayersAfterCreate = await getLayers(id);
                    setLayers(refreshedLayersAfterCreate);
                    convertToFlowNodes(refreshedLayersAfterCreate);
                  }
                }
              } else if (childCount < 2) {
                // 如果节点有内容但子节点不足2个，需要生成子节点
                // 检查下一层是否会超过目标层数
                const nodeLayerOrder = (nodeLayer as any).layer_order ?? (nodeLayer as any).layerOrder ?? 1;
                const nextLayerOrder = nodeLayerOrder + 1;

                // 如果下一层会超过目标层数，不生成子节点
                if (nextLayerOrder > targetLayer) {
                  continue;
                }

                // 生成节点内容（传入最新的层数据）
                const { options } = await generateNodeContent(node, currentLayers);

                // 确保下一层存在

                let nextLayer = currentLayers.find(l => {
                  const order = (l as any).layer_order ?? (l as any).layerOrder;
                  return order === nextLayerOrder;
                });

                if (!nextLayer) {
                  nextLayer = await createLayer(id, {
                    title: `第${nextLayerOrder}层`,
                    description: '分支层',
                    layer_order: nextLayerOrder,
                  });
                  // 重新加载层数据
                  const refreshedLayers = await getLayers(id);
                  setLayers(refreshedLayers);
                  nextLayer = refreshedLayers.find(l => {
                    const order = (l as any).layer_order ?? (l as any).layerOrder;
                    return order === nextLayerOrder;
                  }) || nextLayer;
                }

                // 为每个选项创建子节点（只创建2个）
                for (let index = 0; index < Math.min(2, options.length); index++) {
                  const optionLabel = options[index];

                  // 计算子节点位置
                  const childPositionX = layoutDirection === 'horizontal'
                    ? nextLayerOrder * 400
                    : 100 + (index - 0.5) * 200;
                  const childPositionY = layoutDirection === 'horizontal'
                    ? 100 + (index - 0.5) * 120
                    : nextLayerOrder * 200;

                  // 创建子节点（空内容）
                  const childNode = await createNode(id, nextLayer.id, {
                    title: optionLabel,
                    content: '',
                    duration: 30,
                    position_x: childPositionX,
                    position_y: childPositionY,
                  });

                  // 创建分支连接
                  await createBranch(id, {
                    from_node_id: node.id,
                    to_node_id: childNode.id,
                    branch_label: optionLabel,
                    branch_type: 'default',
                    branch_order: index + 1,
                  });

                  // 立即刷新页面展示新创建的节点和分支
                  const refreshedLayersAfterCreate = await getLayers(id);
                  setLayers(refreshedLayersAfterCreate);
                  convertToFlowNodes(refreshedLayersAfterCreate);
                }
              }

              // 完成一个节点，更新进度
              completedSteps++;
              setTaskProgress({
                currentStep: `节点 "${node.title}" 生成完成`,
                totalSteps: totalSteps,
                completedSteps: completedSteps,
                currentLayer: currentMaxLayer + 1,
                targetLayer: targetLayer,
                currentNodeIndex: i + 1,
                totalNodes: nodesNeedingChildren.length,
                isRunning: true,
              });
            } catch (error) {
              console.error(`为节点 ${node.title} 生成内容失败:`, error);
              // 继续处理下一个节点
              completedSteps++;
            }
          }

          // 更新当前最大层数
          const updatedLayers = await getLayers(id);
          setLayers(updatedLayers);
          currentMaxLayer = getMaxLayerOrder();
        }

        // 重新加载层数据以更新 UI
        await loadLayers();

        // 关闭进度提示
        if (loadingToast) {
          Toast.close(loadingToast);
        }

        // 更新任务进度为完成状态
        setTaskProgress({
          currentStep: '生成完成！',
          totalSteps: totalSteps,
          completedSteps: completedSteps,
          currentLayer: currentMaxLayer,
          targetLayer: targetLayer,
          currentNodeIndex: 0,
          totalNodes: 0,
          isRunning: false,
        });

        Toast.success(`自动生成节点完成！已生成到第 ${currentMaxLayer} 层`);

        // 3秒后重置为等待状态
        setTimeout(() => {
          setTaskProgress({
            currentStep: '任务已完成，等待下一个任务...',
            totalSteps: totalSteps,
            completedSteps: completedSteps,
            currentLayer: currentMaxLayer,
            targetLayer: targetLayer,
            currentNodeIndex: 0,
            totalNodes: 0,
            isRunning: false,
          });
        }, 3000);
      } catch (error) {
        console.error('自动生成节点失败:', error);
        if (loadingToast) {
          Toast.close(loadingToast);
        }

        // 更新任务进度为失败状态
        setTaskProgress({
          currentStep: '生成失败',
          totalSteps: totalSteps || 0,
          completedSteps: completedSteps || 0,
          currentLayer: currentMaxLayer || 0,
          targetLayer: targetLayer,
          currentNodeIndex: 0,
          totalNodes: 0,
          isRunning: false,
        });

        Toast.error(error instanceof Error ? `自动生成失败: ${error.message}` : '自动生成失败');

        // 3秒后重置为等待状态
        setTimeout(() => {
          setTaskProgress({
            currentStep: '任务失败，等待重试...',
            totalSteps: totalSteps || 0,
            completedSteps: completedSteps || 0,
            currentLayer: currentMaxLayer || 0,
            targetLayer: targetLayer,
            currentNodeIndex: 0,
            totalNodes: 0,
            isRunning: false,
          });
        }, 3000);
      } finally {
        setIsAutoGeneratingNodes(false);
      }
    } catch (error) {
      console.error('自动生成节点失败:', error);
      if (loadingToast) {
        Toast.close(loadingToast);
      }
      Toast.error(error instanceof Error ? `自动生成失败: ${error.message}` : '自动生成失败');
      setTaskProgress({
        currentStep: '任务失败，等待重试...',
        totalSteps: 0,
        completedSteps: 0,
        currentLayer: 0,
        targetLayer: 0,
        currentNodeIndex: 0,
        totalNodes: 0,
        isRunning: false,
      });
      setIsAutoGeneratingNodes(false);
    }
  };

  // 一键删除所有空内容的节点
  const handleDeleteEmptyNodes = async () => {
    if (!id) return;

    // 确认对话框
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除所有没有内容的节点吗？此操作不可恢复。',
      onOk: async () => {
        setIsDeletingEmptyNodes(true);
        let deletedCount = 0;
        let errorCount = 0;

        try {
          // 收集所有没有内容的节点
          const emptyNodes: StoryNode[] = [];
          for (const layer of layers) {
            for (const node of layer.nodes || []) {
              // 检查节点是否有内容（content为空或只有空白字符）
              const hasContent = node.content && node.content.trim().length > 0;
              if (!hasContent) {
                emptyNodes.push(node);
              }
            }
          }

          if (emptyNodes.length === 0) {
            Toast.info('没有找到空内容的节点');
            setIsDeletingEmptyNodes(false);
            return;
          }

          // 批量删除空节点
          for (const node of emptyNodes) {
            try {
              await deleteNode(id, node.id);
              deletedCount++;
            } catch (error) {
              console.error(`删除节点 ${node.title} 失败:`, error);
              errorCount++;
            }
          }

          // 重新加载层数据
          await loadLayers();

          if (errorCount === 0) {
            Toast.success(`成功删除 ${deletedCount} 个空节点`);
          } else {
            Toast.warning(`删除了 ${deletedCount} 个节点，${errorCount} 个节点删除失败`);
          }
        } catch (error) {
          console.error('删除空节点失败:', error);
          Toast.error('删除空节点失败');
        } finally {
          setIsDeletingEmptyNodes(false);
        }
      },
    });
  };

  // 更新节点内容
  const handleUpdateNodeContent = async (values: any) => {
    // 防止重复提交
    if (isUpdatingNode || !currentNode || !id) return;

    setIsUpdatingNode(true);
    try {
      // 调用 API 更新节点
      const updated = await updateNode(id, currentNode.id, {
        title: values.title,
        content: values.content,
        change_reason: 'edit',
      });

      // 重新加载层数据以获取最新状态
      await loadLayers();

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
      setCurrentNode(updated);
      Toast.success('更新成功');
    } catch (error) {
      Toast.error('更新失败');
      console.error(error);
    } finally {
      setIsUpdatingNode(false);
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
  const handleAddNode = async (values: any) => {
    if (!id || isAddingNode) return;

    setIsAddingNode(true);
    try {
      // 找到要添加节点的层
      const targetLayer = layers.find(l => l.id === values.layerId);
      if (!targetLayer) {
        Toast.error('找不到指定的层');
        return;
      }

      // 调用 API 创建节点
      await createNode(id, values.layerId, {
        title: values.title,
        content: values.content,
        duration: values.duration || 30,
        metadata: {
          camera_type: '全景',
          characters: [],
          scene: targetLayer.title,
        },
        // node_order 不传，后端会自动计算
      });

      // 重新加载层数据
      await loadLayers();

      setAddNodeModalVisible(false);
      Toast.success('节点添加成功');
    } catch (error) {
      Toast.error('添加节点失败');
      console.error(error);
    } finally {
      setIsAddingNode(false);
    }
  };

  // 添加层的处理函数
  const handleAddLayer = async (values: any) => {
    if (!id || isAddingLayer) return;

    setIsAddingLayer(true);
    try {
      await createLayer(id, {
        title: values.title,
        description: values.description,
        // layer_order 不传，后端会自动计算
      });

      // 重新加载层数据
      await loadLayers();

      setAddLayerModalVisible(false);
      Toast.success('层添加成功');
    } catch (error) {
      Toast.error('添加层失败');
      console.error(error);
    } finally {
      setIsAddingLayer(false);
    }
  };

  // 生成初始节点
  const handleGenerateInitialNode = async () => {
    // 防止重复点击
    if (isGeneratingInitialNode) {
      return;
    }

    if (!id || !script) {
      Toast.warning('请先加载剧本信息');
      return;
    }

    if (!script.outline || script.outline.trim().length === 0) {
      Toast.warning('请先填写剧本大纲');
      return;
    }

    // 配置：最大重试次数（格式错误时自动重新生成）
    const MAX_RETRY_COUNT = 3;

    setIsGeneratingInitialNode(true);
    try {
      // 确保第一层存在，如果不存在则自动创建
      let firstLayer = layers.find(l => {
        const order = (l as any).layer_order ?? (l as any).layerOrder;
        return order === 1;
      });
      if (!firstLayer) {
        // 自动创建第一层
        firstLayer = await createLayer(id, {
          title: '第1层',
          description: '初始层',
          layer_order: 1,
        });
        // 更新本地 layers 状态
        setLayers([...layers, { ...firstLayer, nodes: [] }]);
      }

      // 重试逻辑：如果选项提取失败，自动重新生成
      let generatedContent = '';
      let options: string[] = [];
      let rawContent = '';
      let retryCount = 0;
      let isValidFormat = false;

      while (retryCount < MAX_RETRY_COUNT && !isValidFormat) {
        try {
          const result = await generateInitialNode(script.outline);
          generatedContent = result.content;
          options = result.options;
          rawContent = result.rawContent;

          // 检查格式是否正确：应该至少提取到2个选项
          if (options && options.length >= 2) {
            isValidFormat = true;
          } else {
            retryCount++;
            if (retryCount < MAX_RETRY_COUNT) {
              Toast.warning(`选项格式不正确，正在重新生成... (${retryCount}/${MAX_RETRY_COUNT})`);
              // 等待一下再重试，避免请求过快
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        } catch (error) {
          retryCount++;
          if (retryCount >= MAX_RETRY_COUNT) {
            throw error;
          }
          Toast.warning(`生成失败，正在重试... (${retryCount}/${MAX_RETRY_COUNT})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // 如果重试后仍然格式不正确，抛出错误
      if (!isValidFormat) {
        throw new Error(`经过 ${MAX_RETRY_COUNT} 次重试后，仍无法提取到有效的选项格式。请检查 AI API 返回格式。`);
      }

      // 计算初始节点的位置（第一层，第一个节点）
      const firstLayerOrder = (firstLayer as any).layer_order ?? (firstLayer as any).layerOrder ?? 1;
      const initialPositionX = layoutDirection === 'horizontal'
        ? firstLayerOrder * 400
        : 100;
      const initialPositionY = layoutDirection === 'horizontal'
        ? 100
        : firstLayerOrder * 200;

      // 创建初始节点（带位置和原始 AI 内容）
      const initialNode = await createNode(id, firstLayer.id, {
        title: '初始节点',
        content: generatedContent,
        duration: 30,
        position_x: initialPositionX,
        position_y: initialPositionY,
        metadata: {
          aiRawContent: rawContent, // 保存 AI 返回的原始内容到 metadata
        },
        // node_order 不传，后端会自动计算
      });

      // 收集需要保存位置的节点
      const nodesToUpdatePositions: Array<{ node_id: string; position_x: number; position_y: number }> = [
        {
          node_id: initialNode.id,
          position_x: initialPositionX,
          position_y: initialPositionY,
        },
      ];

      // 如果有选项，创建第二层和子节点
      if (options && options.length > 0) {
        // 确保第二层存在
        let secondLayer = layers.find(l => {
          const order = (l as any).layer_order ?? (l as any).layerOrder;
          return order === 2;
        });
        if (!secondLayer) {
          secondLayer = await createLayer(id, {
            title: '第2层',
            description: '分支层',
            layer_order: 2,
          });
          // 重新加载 layers 以确保获取到最新数据
          const updatedLayers = await getLayers(id);
          setLayers(updatedLayers);
          secondLayer = updatedLayers.find(l => {
            const order = (l as any).layer_order ?? (l as any).layerOrder;
            return order === 2;
          }) || secondLayer;
        }

        // 为每个选项创建子节点
        const createdNodes = [];
        for (let index = 0; index < options.length; index++) {
          const optionLabel = options[index];

          // 计算子节点位置
          const secondLayerOrder = (secondLayer as any).layer_order ?? (secondLayer as any).layerOrder ?? 2;
          const childPositionX = layoutDirection === 'horizontal'
            ? secondLayerOrder * 400
            : 100 + (index - (options.length - 1) / 2) * 200;
          const childPositionY = layoutDirection === 'horizontal'
            ? 100 + (index - (options.length - 1) / 2) * 120
            : secondLayerOrder * 200;

          const childNode = await createNode(id, secondLayer.id, {
            title: optionLabel,
            content: '',
            duration: 30,
            position_x: childPositionX,
            position_y: childPositionY,
          });
          createdNodes.push(childNode);

          // 添加到位置更新列表
          nodesToUpdatePositions.push({
            node_id: childNode.id,
            position_x: childPositionX,
            position_y: childPositionY,
          });

          // 创建分支连接，确保 branch_order 正确（从 1 开始）
          await createBranch(id, {
            from_node_id: initialNode.id,
            to_node_id: childNode.id,
            branch_label: optionLabel,
            branch_type: 'default',
            branch_order: index + 1, // 明确设置顺序，从 1 开始
          });
        }
      }

      // 批量保存所有节点的位置（确保位置被正确保存）
      if (nodesToUpdatePositions.length > 0) {
        await batchUpdateNodePositions(id, nodesToUpdatePositions);
      }

      // 重新加载层数据以更新 UI
      await loadLayers();

      Toast.success(`初始节点生成成功${options && options.length > 0 ? `，已创建 ${options.length} 个子节点` : ''}`);
    } catch (error) {
      Toast.error(error instanceof Error ? error.message : '生成初始节点失败');
      console.error('生成初始节点失败:', error);
    } finally {
      setIsGeneratingInitialNode(false);
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
          loading={isSaving}
          disabled={isSaving}
        >
          {isSaving ? '保存中...' : '保存'}
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
            ) : isLoadingLayers ? (
              <Text type="tertiary">加载中...</Text>
            ) : (
              <Text type="tertiary">暂无层数据，请点击右侧菜单创建</Text>
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
          onAutoLayout={handleAutoLayout}
          onGenerateInitialNode={handleGenerateInitialNode}
          isGeneratingInitialNode={isGeneratingInitialNode}
          onAutoGenerateNodes={() => setAutoGenerateModalVisible(true)}
          isAutoGeneratingNodes={isAutoGeneratingNodes}
          onDeleteEmptyNodes={handleDeleteEmptyNodes}
          isDeletingEmptyNodes={isDeletingEmptyNodes}
        />
      </Layout>

      {/* 任务进度面板 - 独立渲染在画布上 */}
      <TaskProgressPanel progress={taskProgress} isRightCollapsed={isRightCollapsed} />

      {/* 编辑节点内容弹窗 */}
      <Modal
        title={`编辑节点：${currentNode?.title || ''}`}
        visible={editModalVisible}
        onCancel={() => {
          if (!isUpdatingNode) {
            setEditModalVisible(false);
            setCurrentNode(null);
            setAiResult('');
          }
        }}
        onOk={() => {
          if (!isUpdatingNode) {
            formApi?.submitForm();
          }
        }}
        confirmLoading={isUpdatingNode}
        okButtonProps={{
          disabled: isUpdatingNode,
          loading: isUpdatingNode,
        }}
        cancelButtonProps={{
          disabled: isUpdatingNode,
        }}
        width={800}
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
              <div style={{ marginBottom: 16 }}>
                <Button
                  onClick={handleGenerateAI}
                  loading={isGenerating}
                  icon={<IconPlay />}
                  theme='solid'
                >
                  {currentNode?.content ? '重新生成内容' : '生成内容'}
                </Button>
              </div>

              {aiResult && (
                <Card
                  title="AI生成结果预览"
                  style={{ marginBottom: 16, backgroundColor: 'var(--semi-color-fill-0)' }}
                  footer={
                    <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        onClick={handleGenerateAI}
                        loading={isGenerating}
                        icon={<IconRefresh />}
                        type='tertiary'
                      >
                        重新生成
                      </Button>
                      <Button
                        onClick={handleApplyAI}
                        theme='solid'
                        type='primary'
                        loading={isUpdatingNode}
                        disabled={isUpdatingNode}
                      >
                        应用结果
                      </Button>
                    </Space>
                  }
                >
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>剧情内容预览</Text>
                    <TextArea
                      value={previewContent}
                      onChange={(val) => setPreviewContent(val)}
                      autosize={{ minRows: 4, maxRows: 8 }}
                      style={{ marginTop: 8 }}
                    />
                  </div>

                  <div>
                    <Text strong>生成分支预览 ({previewBranches.length})</Text>
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {previewBranches.map((branch, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Text type="secondary" style={{ width: 20 }}>{idx + 1}.</Text>
                          <Input
                            value={branch.label}
                            onChange={(val) => {
                              const newBranches = [...previewBranches];
                              newBranches[idx].label = val;
                              setPreviewBranches(newBranches);
                            }}
                            style={{ width: '100%' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              <Text type="secondary" size="small">
                节点ID: {currentNode.id}
              </Text>
              <br />
              <Text type="secondary" size="small">
                所属层: 第{(() => {
                  const layer = layers.find(l => l.nodes?.some(n => n.id === currentNode.id));
                  return layer ? ((layer as any).layer_order ?? (layer as any).layerOrder ?? 0) : 0;
                })()}层
              </Text>
              {currentNode.duration && (
                <>
                  <br />
                  <Text type="secondary" size="small">
                    时长: {currentNode.duration}秒
                  </Text>
                </>
              )}

              {/* 展示 AI 原始内容 */}
              {(() => {
                // 支持两种字段名格式：aiRawContent 和 ai_raw_content
                const metadata = currentNode.metadata as any;
                const aiRawContent = metadata?.aiRawContent ?? metadata?.ai_raw_content;

                if (!aiRawContent) return null;

                return (
                  <>
                    <br />
                    <br />
                    <Card
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <IconTicketCode style={{ color: '#1890ff' }} />
                          <Text strong>AI 原始生成内容</Text>
                        </div>
                      }
                      style={{
                        marginTop: 16,
                        backgroundColor: 'var(--semi-color-fill-0)',
                        border: '1px solid var(--semi-color-border)',
                      }}
                      bodyStyle={{ padding: '12px' }}
                    >
                      <TextArea
                        value={typeof aiRawContent === 'string' ? aiRawContent : JSON.stringify(aiRawContent, null, 2)}
                        readOnly
                        autosize={{ minRows: 6, maxRows: 12 }}
                        style={{
                          width: '100%',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          backgroundColor: 'var(--semi-color-bg-0)',
                        }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Text type="tertiary" size="small">
                          提示：这是 AI 生成时的原始内容，包含完整的响应数据（包括 options 标签和 JSON 数据）
                        </Text>
                      </div>
                    </Card>
                  </>
                );
              })()}
            </div>
          )}
        </Form>
      </Modal>

      {/* 添加节点弹窗 */}
      <Modal
        title="添加新节点"
        visible={addNodeModalVisible}
        onCancel={() => {
          if (!isAddingNode) {
            setAddNodeModalVisible(false);
          }
        }}
        onOk={() => {
          if (!isAddingNode) {
            const values = formApi?.getValues();
            if (values?.layerId && values?.title && values?.content) {
              handleAddNode(values);
            }
          }
        }}
        confirmLoading={isAddingNode}
        okButtonProps={{
          disabled: isAddingNode,
          loading: isAddingNode,
        }}
        cancelButtonProps={{
          disabled: isAddingNode,
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
                第{((layer as any).layer_order ?? (layer as any).layerOrder ?? 0)}层 - {layer.title} ({layer.nodes?.length || 0}个节点)
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
          if (!isAddingLayer) {
            setAddLayerModalVisible(false);
          }
        }}
        onOk={() => {
          if (!isAddingLayer) {
            const values = formApi?.getValues();
            if (values?.title) {
              handleAddLayer(values);
            }
          }
        }}
        confirmLoading={isAddingLayer}
        okButtonProps={{
          disabled: isAddingLayer,
          loading: isAddingLayer,
        }}
        cancelButtonProps={{
          disabled: isAddingLayer,
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

      {/* 一键自动生成节点弹窗 */}
      <Modal
        title="一键自动生成节点"
        visible={autoGenerateModalVisible}
        onCancel={() => {
          setAutoGenerateModalVisible(false);
        }}
        onOk={handleAutoGenerateNodes}
        confirmLoading={isAutoGeneratingNodes}
        width={500}
      >
        <Form
          getFormApi={(api) => setFormApi(api)}
          labelPosition="left"
          labelWidth={120}
        >
          <Form.InputNumber
            field="targetLayer"
            label="生成到第几层"
            placeholder="请输入目标层数"
            min={1}
            rules={[{ required: true, message: '请输入目标层数' }]}
            style={{ width: '100%' }}
          />
          <div style={{ marginTop: 16, padding: 12, backgroundColor: 'var(--semi-color-fill-0)', borderRadius: 4 }}>
            <Text type="secondary" size="small">
              说明：系统会自动检测当前所有没有子节点（或子节点不足2个）的节点，为每个节点生成2个分支，循环生成直到达到指定层数。
            </Text>
          </div>
        </Form>
      </Modal>
    </AppLayout>
  );
}
