import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Typography } from '@douyinfe/semi-ui';
import { IconDelete, } from '@douyinfe/semi-icons';
import { IconSteps } from '@douyinfe/semi-icons-lab';
import '../styles/CustomNode.css';

const { Text } = Typography;

type CustomNodeData = {
  label: string;
  content: string;
  node: any;
  isDimmed?: boolean;
  onDelete?: () => void;
  onTraceAncestors?: () => void;
  isDeleting?: boolean;
}

type CustomNodeProps = NodeProps<Node<CustomNodeData>>;

function CustomNode(props: CustomNodeProps) {
  const { data, selected, sourcePosition, targetPosition } = props;

  // 根据 sourcePosition 和 targetPosition 确定连接点位置
  const getTargetPosition = () => {
    if (targetPosition === 'left') return Position.Left;
    if (targetPosition === 'right') return Position.Right;
    if (targetPosition === 'bottom') return Position.Bottom;
    return Position.Top; // 默认顶部
  };

  const getSourcePosition = () => {
    if (sourcePosition === 'left') return Position.Left;
    if (sourcePosition === 'right') return Position.Right;
    if (sourcePosition === 'bottom') return Position.Bottom;
    return Position.Top; // 默认顶部
  };

  return (
    <div
      className={`custom-node ${selected ? 'selected' : ''} ${data.isDimmed ? 'dimmed' : ''}`}
    >
      {targetPosition && (
        <Handle
          type="target"
          position={getTargetPosition()}
          style={{ background: '#555', width: 8, height: 8 }}
        />
      )}
      <div className="custom-node-content">
        <div className="custom-node-header">
          <Text strong ellipsis={{ showTooltip: false }} style={{ fontSize: 14 }}>
            {data.label || '未命名节点'}
          </Text>
        </div>
        <div className="custom-node-body">
          <Text
            type="secondary"
            size="small"
            ellipsis={{ showTooltip: false, rows: 2 }}
            style={{ fontSize: 12, lineHeight: '1.4' }}
          >
            {data.content || '暂无描述'}
          </Text>
        </div>
      </div>
      {selected && (
        <>
          <div
            className="trace-icon-wrapper"
            onClick={(e) => {
              e.stopPropagation();
              data.onTraceAncestors?.();
            }}
            title="向上溯源"
          >
            {/* <IconArrowUp style={{ color: '#fff', fontSize: 14 }} /> */}
            <IconSteps />
          </div>
          <div
            className={`delete-icon-wrapper ${data.isDeleting ? 'deleting' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!data.isDeleting) {
                data.onDelete?.();
              }
            }}
            title={data.isDeleting ? '正在删除...' : '删除节点'}
            style={{
              opacity: data.isDeleting ? 0.6 : 1,
              cursor: data.isDeleting ? 'not-allowed' : 'pointer',
              pointerEvents: data.isDeleting ? 'none' : 'auto',
            }}
          >
            <IconDelete style={{ color: '#fff', fontSize: 14 }} />
          </div>
        </>
      )}
      {sourcePosition && (
        <Handle
          type="source"
          position={getSourcePosition()}
          style={{ background: '#555', width: 8, height: 8 }}
        />
      )}
    </div>
  );
}

export default memo(CustomNode);

