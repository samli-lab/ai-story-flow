import { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Nav,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Button,
} from '@douyinfe/semi-ui';
import {
  IconHome,
  IconEdit,
  IconSetting,
  IconExit,
  IconUser,
  IconSidebar,
  IconPlay,
} from '@douyinfe/semi-icons';
import { IconTag } from '@douyinfe/semi-icons-lab';
import './AppLayout.css';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  headerTitle?: string;
  headerExtra?: ReactNode;
}

export default function AppLayout({
  children,
  showHeader = true,
  headerTitle = 'AI Story Flow',
  headerExtra,
}: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navItems = [
    {
      itemKey: '/dashboard',
      text: '首页',
      icon: <IconHome />,
    },
    {
      itemKey: '/scripts',
      text: '剧本管理',
      icon: <IconEdit />,
    },
    {
      itemKey: '/videos',
      text: '视频管理',
      icon: <IconPlay />,
    },
    {
      itemKey: '/tags',
      text: '标签管理',
      icon: <IconTag />,
    },
  ];

  const handleNavSelect = (itemKey: string) => {
    navigate(itemKey);
  };

  // 根据当前路径确定选中的导航项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/dashboard') return '/dashboard';
    if (path.startsWith('/script/')) return '/scripts';
    if (path === '/scripts') return '/scripts';
    if (path === '/videos') return '/videos';
    if (path === '/tags') return '/tags';
    return path;
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        style={{
          backgroundColor: 'var(--semi-color-bg-1)',
          width: isCollapsed ? 60 : 240,
        }}
        {...({ collapsible: true, onCollapse: (collapsed: boolean) => setIsCollapsed(collapsed) } as any)}
      >
        <div className="app-layout-logo" style={{ borderRight: '1px solid var(--semi-color-border)' }}>
          {!isCollapsed && (
            <Space spacing="loose">
              <IconHome size="large" style={{ color: 'var(--semi-color-primary)' }} />
              <Text strong>AI Story Flow</Text>
            </Space>
          )}
          {isCollapsed && (
            <IconHome size="large" style={{ color: 'var(--semi-color-primary)' }} />
          )}
        </div>
        <Nav
          style={{ height: 'calc(100vh - 72px)' }}
          items={navItems}
          selectedKeys={[getSelectedKey()]}
          onSelect={({ itemKey }) => handleNavSelect(itemKey as string)}
          isCollapsed={isCollapsed}
        />
      </Sider>
      <Layout>
        {showHeader && (
          <Header
            style={{
              backgroundColor: 'var(--semi-color-bg-0)',
              borderBottom: '1px solid var(--semi-color-border)',
              padding: '0 32px',
              height: 72,
              minHeight: 72,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Space spacing="loose">
                <Button
                  icon={<IconSidebar />}
                  theme="borderless"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                />
                <Text strong size="normal">
                  {headerTitle}
                </Text>
              </Space>
              <Space spacing="loose">
                {headerExtra}
                <Dropdown
                  trigger="click"
                  position="bottomRight"
                  render={
                    <Dropdown.Menu>
                      <Dropdown.Item icon={<IconSetting />}>
                        个人设置
                      </Dropdown.Item>
                      <Dropdown.Item
                        icon={<IconExit />}
                        onClick={() => {
                          navigate('/login');
                        }}
                      >
                        退出登录
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  }
                >
                  <Space
                    style={{
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s',
                    }}
                    className="user-info-trigger"
                  >
                    <Avatar
                      size="small"
                      color="blue"
                      style={{ backgroundColor: 'var(--semi-color-primary)' }}
                    >
                      <IconUser />
                    </Avatar>
                    <Text strong>用户名</Text>
                  </Space>
                </Dropdown>
              </Space>
            </div>
          </Header>
        )}
        <Content
          style={{
            backgroundColor: 'var(--semi-color-bg-0)',
            padding: showHeader ? 0 : 0,
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

