import { useState, useEffect, useCallback } from 'react';
import {
  List,
  Typography,
  Button,
  Input,
  Tag,
  Dropdown,
  Modal,
  Form,
  Toast,
  Empty,
} from '@douyinfe/semi-ui';
import {
  IconPlus,
  IconEdit,
  IconDelete,
  IconMore,
  IconBookmark,
  IconSearch,
} from '@douyinfe/semi-icons';
import { Script } from '../../types/script';
import {
  getScripts,
  createScript,
  deleteScript,
  renameScript,
  updateScriptTags,
} from '../../services/scriptService';
import './ScriptList.css';

const { Text, Title } = Typography;

interface ScriptListProps {
  onSelectScript?: (script: Script) => void;
  selectedScriptId?: string;
}

export default function ScriptList({ onSelectScript, selectedScriptId }: ScriptListProps) {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
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

  // 创建剧本
  const handleCreate = async (values: any) => {
    try {
      const newScript = await createScript({
        title: values.title,
        description: values.description,
        outline: values.outline,
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
      });
      setScripts(prev => [newScript, ...prev]);
      setCreateModalVisible(false);
      Toast.success('创建成功');
      if (onSelectScript) {
        onSelectScript(newScript);
      }
    } catch (error) {
      Toast.error('创建失败');
      console.error(error);
    }
  };

  // 重命名剧本
  const handleRename = async (script: Script, newTitle: string) => {
    try {
      const updated = await renameScript(script.id, newTitle);
      setScripts(prev => prev.map(s => (s.id === script.id ? updated : s)));
      Toast.success('重命名成功');
      if (onSelectScript && currentScript?.id === script.id) {
        onSelectScript(updated);
      }
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
          if (currentScript?.id === script.id) {
            setCurrentScript(null);
          }
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
      if (onSelectScript) {
        onSelectScript(updated);
      }
    } catch (error) {
      Toast.error('标签更新失败');
      console.error(error);
    }
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
    <div className="script-list-container">
      <div className="script-list-header">
        <Title heading={4} style={{ margin: 0 }}>
          剧本列表
        </Title>
        <Button
          icon={<IconPlus />}
          theme="solid"
          type="primary"
          onClick={() => setCreateModalVisible(true)}
        >
          新建
        </Button>
      </div>

      <div className="script-list-search">
        <Input
          prefix={<IconSearch />}
          placeholder="搜索剧本..."
          value={searchKeyword}
          onChange={setSearchKeyword}
          showClear
        />
      </div>

      <div className="script-list-content">
        {filteredScripts.length === 0 ? (
          <Empty
            description={searchKeyword ? '未找到匹配的剧本' : '暂无剧本'}
            image={<IconPlus size="extra-large" />}
          />
        ) : (
          <List
            dataSource={filteredScripts}
            loading={loading}
            renderItem={(script: Script) => (
              <List.Item
                className={`script-list-item ${selectedScriptId === script.id ? 'selected' : ''
                  }`}
                onClick={() => onSelectScript?.(script)}
                extra={
                  <Dropdown
                    trigger="click"
                    position="bottomRight"
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
                    />
                  </Dropdown>
                }
              >
                <div className="script-item-content">
                  <div className="script-item-header">
                    <Text strong>{script.title}</Text>
                    <Tag color={getStatusColor(script.status)} size="small">
                      {getStatusText(script.status)}
                    </Tag>
                  </div>
                  {script.description && (
                    <Text type="secondary" size="small" className="script-item-desc">
                      {script.description}
                    </Text>
                  )}
                  {script.tags && script.tags.length > 0 && (
                    <div className="script-item-tags">
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
                  <Text type="tertiary" size="small" className="script-item-time">
                    {new Date(script.updatedAt).toLocaleDateString('zh-CN')}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>

      {/* 创建剧本弹窗 */}
      <Modal
        title="新建剧本"
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => formApi?.submitForm()}
        width={600}
      >
        <Form
          getFormApi={(api) => setFormApi(api)}
          onSubmit={handleCreate}
          labelPosition="left"
          labelWidth={80}
        >
          <Form.Input
            field="title"
            label="标题"
            placeholder="请输入剧本标题"
            rules={[{ required: true, message: '请输入剧本标题' }]}
          />
          <Form.TextArea
            field="description"
            label="描述"
            placeholder="请输入剧本描述（可选）"
            autosize={{ minRows: 3 }}
          />
          <Form.TextArea
            field="outline"
            label="大纲"
            placeholder="请输入故事大纲（可选）"
            autosize={{ minRows: 4 }}
          />
          <Form.Input
            field="tags"
            label="标签"
            placeholder="请输入标签，用逗号分隔（可选）"
          />
        </Form>
      </Modal>

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
    </div>
  );
}

