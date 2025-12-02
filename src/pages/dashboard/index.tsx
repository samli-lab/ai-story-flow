import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Button,
  Space,
  Empty,
} from '@douyinfe/semi-ui';
import {
  IconPlus,
} from '@douyinfe/semi-icons';
import { useEffect, useState } from 'react';
import { getScripts } from '../../services/scriptService';
import { Script } from '../../types/script';
import AppLayout from '../../components/AppLayout';
import './styles/Dashboard.css';

const { Title, Text } = Typography;

export default function Dashboard() {
  const navigate = useNavigate();
  const [recentScripts, setRecentScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentScripts();
  }, []);

  const loadRecentScripts = async () => {
    setLoading(true);
    try {
      const scripts = await getScripts();
      // 获取最近更新的5个剧本
      const sorted = scripts
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);
      setRecentScripts(sorted);
    } catch (error) {
      console.error('加载剧本失败', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const textMap: Record<string, string> = {
      draft: '草稿',
      editing: '编辑中',
      completed: '已完成',
      archived: '已归档',
    };
    return textMap[status] || status;
  };

  return (
    <AppLayout headerTitle="首页">
      <div style={{ padding: '48px', backgroundColor: 'var(--semi-color-bg-1)' }}>
        <div className="dashboard-container">
          <div className="dashboard-hero">
            <Title heading={1} style={{ marginBottom: 16 }}>
              欢迎使用 AI Story Flow
            </Title>
            <Text type="secondary" style={{ marginBottom: 32, fontSize: 16 }}>
              专业的AI剧本创作平台，让故事创作更简单、更高效
            </Text>
            <br />
            <br />
            <Space>
              <Button
                icon={<IconPlus />}
                theme="solid"
                type="primary"
                size="large"
                onClick={() => navigate('/scripts')}
              >
                开始创作
              </Button>
            </Space>
          </div>

          {recentScripts.length > 0 && (
            <div className="dashboard-recent">
              <Title heading={4} style={{ marginBottom: 24 }}>
                最近编辑
              </Title>
              <div className="recent-scripts-grid">
                {recentScripts.map(script => (
                  <div
                    key={script.id}
                    className="recent-script-card-wrapper"
                    onClick={() => navigate(`/script/${script.id}`)}
                  >
                    <Card className="recent-script-card">
                      <div className="recent-script-content">
                        <Text strong ellipsis={{ showTooltip: true }}>
                          {script.title}
                        </Text>
                        {script.description && (
                          <Text
                            type="secondary"
                            size="small"
                            ellipsis={{ showTooltip: true, rows: 2 }}
                            style={{ marginTop: 8 }}
                          >
                            {script.description}
                          </Text>
                        )}
                        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text type="tertiary" size="small">
                            {getStatusText(script.status)}
                          </Text>
                          <Text type="tertiary" size="small">
                            {new Date(script.updatedAt).toLocaleDateString('zh-CN')}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentScripts.length === 0 && !loading && (
            <div className="dashboard-empty">
              <Empty
                description="还没有剧本，开始创建你的第一个剧本吧"
                image={<IconPlus size="extra-large" />}
              >
                <Button
                  icon={<IconPlus />}
                  theme="solid"
                  type="primary"
                  onClick={() => navigate('/scripts')}
                >
                  创建剧本
                </Button>
              </Empty>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
