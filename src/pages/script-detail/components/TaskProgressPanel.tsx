import { useState } from 'react';
import { Card, Typography, Progress, Button, Badge } from '@douyinfe/semi-ui';
import { IconChevronUp, IconHelm } from '@douyinfe/semi-icons';
import './TaskProgressPanel.css';

const { Text, Title } = Typography;

export interface TaskProgress {
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  currentLayer: number;
  targetLayer: number;
  currentNodeIndex: number;
  totalNodes: number;
  isRunning: boolean;
}


interface TaskProgressPanelProps {
  progress: TaskProgress | null;
  isRightCollapsed?: boolean;
}

export default function TaskProgressPanel({ progress, isRightCollapsed = false }: TaskProgressPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 如果没有进度信息，显示默认状态
  const displayProgress = progress || {
    currentStep: '等待任务开始...',
    totalSteps: 0,
    completedSteps: 0,
    currentLayer: 0,
    targetLayer: 0,
    currentNodeIndex: 0,
    totalNodes: 0,
    isRunning: false,
  };

  const progressPercent = displayProgress.totalSteps > 0
    ? Math.round((displayProgress.completedSteps / displayProgress.totalSteps) * 100)
    : 0;

  const layerProgress = displayProgress.targetLayer > 0
    ? Math.round((displayProgress.currentLayer / displayProgress.targetLayer) * 100)
    : 0;

  const nodeProgress = displayProgress.totalNodes > 0
    ? Math.round((displayProgress.currentNodeIndex / displayProgress.totalNodes) * 100)
    : 0;

  return (
    <div
      className="task-progress-panel"
      style={{
        position: 'absolute',
        right: isRightCollapsed ? '20px' : '300px',
        bottom: '20px',
        transition: 'right 0.3s ease',
      }}
    >
      {!isExpanded ? (
        // 只显示图标
        <div
          className="task-icon-only"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: displayProgress.isRunning
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
            border: displayProgress.isRunning ? 'none' : '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            pointerEvents: 'all',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
        >
          <div className="task-icon-wrapper">
            <IconHelm
              size="large"
              style={{
                color: displayProgress.isRunning ? '#fff' : '#4a5568',
              }}
            />
          </div>
        </div>
      ) : (
        // 展开显示完整信息
        <Card
          className="task-progress-card"
          style={{
            background: displayProgress.isRunning
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
            border: displayProgress.isRunning ? 'none' : '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            minWidth: '320px',
            transition: 'all 0.3s ease',
            pointerEvents: 'all',
          }}
          bodyStyle={{
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="task-icon-wrapper">
                <IconHelm
                  size="large"
                  style={{
                    color: displayProgress.isRunning ? '#fff' : '#4a5568',
                  }}
                />
              </div>
              <div>
                <Title
                  heading={6}
                  style={{
                    color: displayProgress.isRunning ? '#fff' : '#2d3748',
                    margin: 0,
                    fontSize: '14px'
                  }}
                >
                  自动生成任务
                </Title>
                <Text style={{ color: displayProgress.isRunning ? 'rgba(255, 255, 255, 0.8)' : '#718096', fontSize: '12px' }}>
                  {displayProgress.isRunning ? '正在执行中...' : '等待任务开始'}
                </Text>
              </div>
            </div>
            <Button
              theme="borderless"
              type="tertiary"
              icon={<IconChevronUp />}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              style={{ color: displayProgress.isRunning ? '#fff' : '#4a5568' }}
            />
          </div>

          <div className="task-progress-content">
            {/* 总体进度 */}
            <div className="progress-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text style={{ color: displayProgress.isRunning ? 'rgba(255, 255, 255, 0.9)' : '#4a5568', fontSize: '13px', fontWeight: 500 }}>
                  总体进度
                </Text>
                <Badge
                  count={displayProgress.completedSteps}
                  style={{
                    backgroundColor: displayProgress.isRunning ? 'rgba(255, 255, 255, 0.3)' : '#e2e8f0',
                    color: displayProgress.isRunning ? '#fff' : '#4a5568',
                  }}
                >
                  <Text style={{ color: displayProgress.isRunning ? '#fff' : '#2d3748', fontSize: '13px', fontWeight: 600 }}>
                    {progressPercent}%
                  </Text>
                </Badge>
              </div>
              <Progress
                percent={progressPercent}
                stroke={displayProgress.isRunning ? "#fff" : "#667eea"}
                size="small"
                showInfo={false}
                style={{ marginBottom: '16px' }}
              />
            </div>

            {/* 层进度 */}
            <div className="progress-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text style={{ color: displayProgress.isRunning ? 'rgba(255, 255, 255, 0.9)' : '#4a5568', fontSize: '13px', fontWeight: 500 }}>
                  层进度
                </Text>
                <Text style={{ color: displayProgress.isRunning ? '#fff' : '#2d3748', fontSize: '13px', fontWeight: 600 }}>
                  {displayProgress.targetLayer > 0
                    ? `第 ${displayProgress.currentLayer} / ${displayProgress.targetLayer} 层`
                    : '未开始'
                  }
                </Text>
              </div>
              <Progress
                percent={layerProgress}
                stroke={displayProgress.isRunning ? "#a8e6cf" : "#48bb78"}
                size="small"
                showInfo={false}
                style={{ marginBottom: '16px' }}
              />
            </div>

            {/* 节点进度 */}
            {displayProgress.totalNodes > 0 && (
              <div className="progress-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text style={{ color: displayProgress.isRunning ? 'rgba(255, 255, 255, 0.9)' : '#4a5568', fontSize: '13px', fontWeight: 500 }}>
                    节点进度
                  </Text>
                  <Text style={{ color: displayProgress.isRunning ? '#fff' : '#2d3748', fontSize: '13px', fontWeight: 600 }}>
                    {displayProgress.currentNodeIndex} / {displayProgress.totalNodes}
                  </Text>
                </div>
                <Progress
                  percent={nodeProgress}
                  stroke={displayProgress.isRunning ? "#ffd3b6" : "#ed8936"}
                  size="small"
                  showInfo={false}
                  style={{ marginBottom: '16px' }}
                />
              </div>
            )}

            {/* 当前步骤 */}
            <div
              className="current-step"
              style={{
                background: displayProgress.isRunning
                  ? 'rgba(255, 255, 255, 0.15)'
                  : '#f7fafc',
                border: displayProgress.isRunning ? 'none' : '1px solid #e2e8f0',
              }}
            >
              <Text style={{ color: displayProgress.isRunning ? 'rgba(255, 255, 255, 0.9)' : '#4a5568', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>
                当前步骤
              </Text>
              <div
                className="step-text-wrapper"
                style={{
                  background: displayProgress.isRunning
                    ? 'rgba(255, 255, 255, 0.1)'
                    : '#ffffff',
                  borderLeft: `3px solid ${displayProgress.isRunning ? '#fff' : '#667eea'}`,
                }}
              >
                <Text style={{ color: displayProgress.isRunning ? '#fff' : '#2d3748', fontSize: '13px', fontWeight: 500 }}>
                  {displayProgress.currentStep}
                </Text>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

