import { useCallback, useState, useEffect, useRef } from 'react';
import { BaseEdge, EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react';
import { Button } from '@douyinfe/semi-ui';
import { IconDelete } from '@douyinfe/semi-icons';

// 使用 window 对象存储全局状态
if (typeof window !== 'undefined') {
  (window as any).selectedEdgeId = null;
  (window as any).edgeClickCallbacks = new Map<string, () => void>();
}

export const setSelectedEdge = (edgeId: string | null) => {
  if (typeof window !== 'undefined') {
    (window as any).selectedEdgeId = edgeId;
  }
};

export const registerEdgeClick = (edgeId: string, callback: () => void) => {
  if (typeof window !== 'undefined') {
    (window as any).edgeClickCallbacks.set(edgeId, callback);
  }
};

export const unregisterEdgeClick = (edgeId: string) => {
  if (typeof window !== 'undefined') {
    (window as any).edgeClickCallbacks.delete(edgeId);
  }
};

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  onDelete,
  label,
}: EdgeProps & { onDelete?: (id: string) => void }) {
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const edgeRef = useRef<SVGPathElement>(null);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // 监听全局选中状态变化
  useEffect(() => {
    const checkSelected = () => {
      const currentSelectedId = (window as any).selectedEdgeId;
      if (currentSelectedId === id) {
        setShowDeleteButton(true);
      } else if (currentSelectedId !== id && showDeleteButton) {
        setShowDeleteButton(false);
      }
    };

    // 定期检查选中状态（用于响应外部点击）
    const interval = setInterval(checkSelected, 100);
    return () => clearInterval(interval);
  }, [id, showDeleteButton]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete) {
        onDelete(id);
        setShowDeleteButton(false);
        setSelectedEdge(null);
      }
    },
    [id, onDelete]
  );

  const handleEdgeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setShowDeleteButton(true);
      setSelectedEdge(id);
    },
    [id]
  );

  // 点击外部区域时隐藏删除按钮
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // 如果点击的不是删除按钮或连接线，则隐藏
      if (
        !target.closest('.edge-delete-button') &&
        !target.closest(`[data-edge-id="${id}"]`)
      ) {
        setShowDeleteButton(false);
        const currentSelectedId = (window as any).selectedEdgeId;
        if (currentSelectedId === id) {
          setSelectedEdge(null);
        }
      }
    };

    if (showDeleteButton) {
      // 延迟添加事件监听，避免立即触发
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true);
      }, 0);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }
  }, [showDeleteButton, id]);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          cursor: 'pointer',
        }}
      />
      {/* 使用一个更宽的透明路径来捕获鼠标事件 */}
      <path
        ref={edgeRef}
        data-edge-id={id}
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={30}
        style={{ cursor: 'pointer', pointerEvents: 'all' }}
        onClick={handleEdgeClick}
        onMouseDown={(e) => e.stopPropagation()}
      />
      <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
          className="nodrag nopan"
        >
          {/* Label 展示 */}
          {label && (
            <div
              onClick={handleEdgeClick}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                padding: '2px 8px',
                background: '#ffffff',
                border: '1px solid #1890ff',
                borderRadius: '10px',
                fontSize: '11px',
                color: '#1890ff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                opacity: style.opacity || 1, // 跟随连线的透明度
              }}
            >
              {label}
            </div>
          )}

          {/* 删除按钮 */}
          {showDeleteButton && (
            <div
              className="edge-delete-button"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Button
              icon={<IconDelete />}
              theme="solid"
              type="danger"
              size="small"
              onClick={handleDelete}
              style={{
                minWidth: 'auto',
                padding: '4px 8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  borderRadius: '12px',
              }}
            />
          </div>
        )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

