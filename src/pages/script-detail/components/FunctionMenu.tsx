import { Button, Typography, List, Layout, Dropdown } from '@douyinfe/semi-ui';
import {
  IconChevronRight,
  IconPlus,
  IconSort,
  IconGridStroked,
  IconTicketCode,
  IconSetting,
  IconDelete,
} from '@douyinfe/semi-icons';
import { IconTree } from '@douyinfe/semi-icons-lab';

const { Title, Text } = Typography;
const { Sider } = Layout;

interface FunctionMenuProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onAddNode: () => void;
  onAddLayer: () => void;
  onAutoLayout: (mode: 'tree' | 'compact') => void;
  onGenerateInitialNode: () => void;
  isGeneratingInitialNode?: boolean;
  onAutoGenerateNodes: () => void;
  isAutoGeneratingNodes?: boolean;
  onDeleteEmptyNodes: () => void;
  isDeletingEmptyNodes?: boolean;
}

export default function FunctionMenu({
  isCollapsed,
  onCollapse,
  onAddNode,
  onAddLayer,
  onAutoLayout,
  onGenerateInitialNode,
  isGeneratingInitialNode = false,
  onAutoGenerateNodes,
  isAutoGeneratingNodes = false,
  onDeleteEmptyNodes,
  isDeletingEmptyNodes = false,
}: FunctionMenuProps) {
  const menuItems = [
    {
      title: '生成初始节点',
      description: isGeneratingInitialNode ? '正在生成...' : '基于剧本大纲AI生成初始节点',
      icon: <IconTicketCode />,
      action: onGenerateInitialNode,
      color: '#f5222d',
      disabled: isGeneratingInitialNode,
    },
    {
      title: '一键自动生成节点',
      description: isAutoGeneratingNodes ? '正在生成...' : '自动生成节点到指定层数',
      icon: <IconSetting />,
      action: onAutoGenerateNodes,
      color: '#1890ff',
      disabled: isAutoGeneratingNodes || isGeneratingInitialNode,
    },
    {
      title: '一键删除空节点',
      description: isDeletingEmptyNodes ? '正在删除...' : '删除所有没有内容的节点',
      icon: <IconDelete />,
      action: onDeleteEmptyNodes,
      color: '#ff4d4f',
      disabled: isDeletingEmptyNodes || isAutoGeneratingNodes || isGeneratingInitialNode,
    },
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
    {
      title: '一键整理',
      description: '自动排列所有节点',
      icon: <IconSort />,
      action: () => { }, // 占位，实际由 Dropdown 处理
      isDropdown: true,
      color: '#722ed1',
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
            renderItem={(item: any) => {
              const content = (
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
              );

              const listItem = (
                <List.Item
                  style={{
                    padding: '12px',
                    marginBottom: '8px',
                    borderRadius: '8px',
                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: 'var(--semi-color-bg-0)',
                    opacity: item.disabled ? 0.6 : 1,
                  }}
                  onClick={!item.isDropdown && !item.disabled ? item.action : undefined}
                  onMouseEnter={(e) => {
                    if (!item.disabled) {
                      e.currentTarget.style.backgroundColor = 'var(--semi-color-fill-0)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--semi-color-bg-0)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {content}
                </List.Item>
              );

              if (item.isDropdown) {
                return (
                  <Dropdown
                    trigger="hover"
                    position="rightTop"
                    render={
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => onAutoLayout('tree')} icon={<IconTree />}>
                          结构视图 (层级结构)
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onAutoLayout('compact')} icon={<IconGridStroked />}>
                          紧凑视图 (网格排列)
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    }
                  >
                    {listItem}
                  </Dropdown>
                );
              }

              return listItem;
            }}
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

