import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Typography,
  Button,
  Input,
  Tag,
  Dropdown,
  Modal,
  Form,
  Toast,
  Empty,
  Spin,
} from '@douyinfe/semi-ui';
import {
  IconPlus,
  IconEdit,
  IconDelete,
  IconMore,
  IconBookmark,
  IconSearch,
} from '@douyinfe/semi-icons';
import { useNavigate } from 'react-router-dom';
import { Script } from '../../types/script';
import {
  getScripts,
  deleteScript,
  renameScript,
  updateScriptTags,
} from '../../services/scriptService';
import AppLayout from '../../components/AppLayout';
import './styles/Scripts.css';

const { Text, Title } = Typography;

export default function ScriptsPage() {
  const navigate = useNavigate();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [currentScript, setCurrentScript] = useState<Script | null>(null);
  const [formApi, setFormApi] = useState<any>(null);

  // 加载剧本列表
  const loadScripts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getScripts();
      setScripts(data);
    } catch (error) {
      Toast.error('加载剧本列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScripts();
  }, [loadScripts]);

  // 过滤剧本
  const filteredScripts = scripts.filter(script => {
    if (!searchKeyword) return true;
    const keyword = searchKeyword.toLowerCase();
    return (
      script.title.toLowerCase().includes(keyword) ||
      script.description?.toLowerCase().includes(keyword) ||
      script.tags?.some(tag => tag.tagName.toLowerCase().includes(keyword))
    );
  });

  // 跳转到创建剧本页面
  const handleCreate = () => {
    navigate('/scripts/create');
  };

  // 重命名剧本
  const handleRename = async (script: Script, newTitle: string) => {
    try {
      const updated = await renameScript(script.id, newTitle);
      setScripts(prev => prev.map(s => (s.id === script.id ? updated : s)));
      Toast.success('重命名成功');
    } catch (error) {
      Toast.error('重命名失败');
      console.error(error);
    }
  };

  // 删除剧本
  const handleDelete = async (script: Script) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除剧本"${script.title}"吗？此操作不可恢复。`,
      onOk: async () => {
        try {
          await deleteScript(script.id);
          setScripts(prev => prev.filter(s => s.id !== script.id));
          Toast.success('删除成功');
        } catch (error) {
          Toast.error('删除失败');
          console.error(error);
        }
      },
    });
  };

  // 更新标签
  const handleUpdateTags = async (values: any) => {
    if (!currentScript) return;
    try {
      const tags = values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [];
      const updated = await updateScriptTags(currentScript.id, tags);
      setScripts(prev => prev.map(s => (s.id === currentScript.id ? updated : s)));
      setTagModalVisible(false);
      Toast.success('标签更新成功');
    } catch (error) {
      Toast.error('标签更新失败');
      console.error(error);
    }
  };

  // 进入编辑页面
  const handleEditScript = (script: Script) => {
    navigate(`/script/${script.id}`);
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string): 'grey' | 'blue' | 'green' | 'orange' => {
    const colorMap: Record<string, 'grey' | 'blue' | 'green' | 'orange'> = {
      draft: 'grey',
      editing: 'blue',
      completed: 'green',
      archived: 'orange',
    };
    return colorMap[status] || 'grey';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const textMap: Record<string, string> = {
      draft: '草稿',
      editing: '编辑中',
      completed: '已完成',
      archived: '已归档',
    };
    return textMap[status] || status;
  };

  // 获取标签颜色（将十六进制颜色转换为 Semi Design 支持的颜色或使用 style）
  const getTagColor = (color?: string | null): 'grey' | 'red' | 'pink' | 'purple' | 'violet' | 'indigo' | 'blue' | 'light-blue' | 'cyan' | 'teal' | 'green' | 'light-green' | 'lime' | 'yellow' | 'amber' | 'orange' | 'white' | undefined => {
    if (!color) return 'grey';

    // Semi Design 支持的颜色列表
    const validColors: Array<'grey' | 'red' | 'pink' | 'purple' | 'violet' | 'indigo' | 'blue' | 'light-blue' | 'cyan' | 'teal' | 'green' | 'light-green' | 'lime' | 'yellow' | 'amber' | 'orange' | 'white'> = ['grey', 'red', 'pink', 'purple', 'violet', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'white'];

    // 如果是预定义的颜色，直接返回
    if (validColors.includes(color.toLowerCase() as any)) {
      return color.toLowerCase() as any;
    }

    // 如果是十六进制颜色，返回 undefined，使用 style 来设置
    if (color.startsWith('#')) {
      return undefined;
    }

    // 默认返回 grey
    return 'grey';
  };

  // 获取标签样式（如果是十六进制颜色，使用 style）
  const getTagStyle = (color?: string | null): React.CSSProperties => {
    if (!color || !color.startsWith('#')) {
      return { marginRight: 4 };
    }

    // 如果是十六进制颜色，使用 style 设置背景色
    return {
      marginRight: 4,
      backgroundColor: color,
      borderColor: color,
      color: '#fff',
    };
  };

  return (
    <AppLayout headerTitle="剧本管理">
      <div style={{ padding: '24px', backgroundColor: 'var(--semi-color-bg-0)' }}>
        <div className="scripts-page-container">
          <div className="scripts-page-header">
            <Title heading={4} style={{ margin: 0 }}>
              剧本管理
            </Title>
            <Button
              icon={<IconPlus />}
              theme="solid"
              type="primary"
              onClick={handleCreate}
            >
              新建剧本
            </Button>
          </div>

          <div className="scripts-page-search">
            <Input
              prefix={<IconSearch />}
              placeholder="搜索剧本..."
              value={searchKeyword}
              onChange={setSearchKeyword}
              showClear
            />
          </div>

          <div className="scripts-page-content">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                <Spin size="large" />
              </div>
            ) : filteredScripts.length === 0 ? (
              <Empty
                description={searchKeyword ? '未找到匹配的剧本' : '暂无剧本，点击"新建剧本"开始创作'}
                image={<IconPlus size="extra-large" />}
              />
            ) : (
              <div className="scripts-grid">
                {filteredScripts.map(script => (
                  <div
                    key={script.id}
                    className="script-card-wrapper"
                    onClick={() => handleEditScript(script)}
                  >
                    <Card
                      className="script-card"
                      style={{ height: '100%', position: 'relative' }}
                    >
                      <div className="script-card-header">
                        <Text strong ellipsis={{ showTooltip: true }}>
                          {script.title}
                        </Text>
                        <Dropdown
                          trigger="click"
                          position="bottomRight"
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          render={
                            <Dropdown.Menu>
                              <Dropdown.Item
                                icon={<IconEdit />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentScript(script);
                                  setEditModalVisible(true);
                                }}
                              >
                                重命名
                              </Dropdown.Item>
                              <Dropdown.Item
                                icon={<IconBookmark />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentScript(script);
                                  setTagModalVisible(true);
                                }}
                              >
                                编辑标签
                              </Dropdown.Item>
                              <Dropdown.Item
                                type="danger"
                                icon={<IconDelete />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(script);
                                }}
                              >
                                删除
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          }
                        >
                          <Button
                            theme="borderless"
                            icon={<IconMore />}
                            onClick={(e) => e.stopPropagation()}
                            className="script-card-more-btn"
                          />
                        </Dropdown>
                      </div>
                      <div className="script-card-content">
                        <div style={{ marginBottom: 12 }}>
                          <Tag color={getStatusColor(script.status)} size="small">
                            {getStatusText(script.status)}
                          </Tag>
                        </div>
                        {script.description && (
                          <Text type="secondary" size="small" className="script-card-desc">
                            {script.description}
                          </Text>
                        )}
                        {script.tags && script.tags.length > 0 && (
                          <div className="script-card-tags">
                            {script.tags.map(tag => (
                              <Tag
                                key={tag.id}
                                color={getTagColor(tag.color)}
                                size="small"
                                style={getTagStyle(tag.color)}
                              >
                                {tag.tagName}
                              </Tag>
                            ))}
                          </div>
                        )}
                        <Text type="tertiary" size="small" className="script-card-time">
                          更新于 {new Date(script.updatedAt).toLocaleDateString('zh-CN')}
                        </Text>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 重命名弹窗 */}
      <Modal
        title="重命名剧本"
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentScript(null);
        }}
        onOk={() => {
          const values = formApi?.getValues();
          if (values?.title && currentScript) {
            handleRename(currentScript, values.title);
            setEditModalVisible(false);
            setCurrentScript(null);
          }
        }}
        width={500}
      >
        <Form
          getFormApi={(api) => setFormApi(api)}
          labelPosition="left"
          labelWidth={80}
          initValues={{ title: currentScript?.title }}
        >
          <Form.Input
            field="title"
            label="标题"
            placeholder="请输入新标题"
            rules={[{ required: true, message: '请输入标题' }]}
          />
        </Form>
      </Modal>

      {/* 编辑标签弹窗 */}
      <Modal
        title="编辑标签"
        visible={tagModalVisible}
        onCancel={() => {
          setTagModalVisible(false);
          setCurrentScript(null);
        }}
        onOk={() => formApi?.submitForm()}
        width={500}
      >
        <Form
          getFormApi={(api) => setFormApi(api)}
          onSubmit={handleUpdateTags}
          labelPosition="left"
          labelWidth={80}
          initValues={{
            tags: currentScript?.tags?.map(t => t.tagName).join(', '),
          }}
        >
          <Form.Input
            field="tags"
            label="标签"
            placeholder="请输入标签，用逗号分隔"
          />
          <Text type="secondary" size="small">
            当前标签：{currentScript?.tags?.map(t => t.tagName).join(', ') || '无'}
          </Text>
        </Form>
      </Modal>
    </AppLayout>
  );
}

