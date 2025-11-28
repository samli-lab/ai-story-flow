import { Button, Typography, List, Layout } from '@douyinfe/semi-ui';
import {
  IconChevronRight,
  IconPlus,
} from '@douyinfe/semi-icons';

const { Title, Text } = Typography;
const { Sider } = Layout;

interface FunctionMenuProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onAddNode: () => void;
  onAddLayer: () => void;
}

export default function FunctionMenu({
  isCollapsed,
  onCollapse,
  onAddNode,
  onAddLayer,
}: FunctionMenuProps) {
  const menuItems = [
    {
      title: '添加层',
      description: '添加新的层',
      icon: <IconPlus />,
      action: onAddLayer,
      color: '#52c41a',
    },
    {
      title: '添加节点',
      description: '在当前层添加新节点',
      icon: <IconPlus />,
      action: onAddNode,
      color: '#1890ff',
    },
  ];

  return (
    <>
      <Sider
        style={{
          backgroundColor: 'var(--semi-color-bg-1)',
          borderLeft: '1px solid var(--semi-color-border)',
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
              功能菜单
            </Title>
            <Button
              icon={<IconChevronRight />}
              theme="borderless"
              type="tertiary"
              size="small"
              onClick={() => onCollapse(true)}
              style={{ minWidth: 'auto', padding: '4px 8px' }}
            />
          </div>

          <List
            dataSource={menuItems}
            renderItem={(item: any) => (
              <List.Item
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: 'var(--semi-color-bg-0)',
                }}
                onClick={item.action}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--semi-color-fill-0)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--semi-color-bg-0)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      backgroundColor: `${item.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: 'block', marginBottom: 4 }}>
                      {item.title}
                    </Text>
                    <Text type="secondary" size="small">
                      {item.description}
                    </Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Sider>
      {/* 折叠状态下的展开按钮 */}
      {isCollapsed && (
        <Button
          icon={<IconChevronRight />}
          theme="solid"
          type="primary"
          size="small"
          onClick={() => onCollapse(false)}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            borderRadius: '4px 0 0 4px',
            zIndex: 100,
            boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
          }}
        />
      )}
    </>
  );
}

