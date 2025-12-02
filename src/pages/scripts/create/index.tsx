import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Button,
  Typography,
  Form,
  Toast,
  Space,
  TextArea,
  Radio,
  Input,
  Card,
} from '@douyinfe/semi-ui';
import {
  IconArrowLeft,
  IconSave,
  IconTicketCode,
  IconEdit,
  IconLink,
} from '@douyinfe/semi-icons';
import { createScript } from '../../../services/scriptService';
import AppLayout from '../../../components/AppLayout';

const { Content } = Layout;
const { Text } = Typography;

type OutlineMode = 'manual' | 'ai';

export default function CreateScriptPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formApi, setFormApi] = useState<any>(null);
  const [outlineMode, setOutlineMode] = useState<OutlineMode>('manual');
  const [originalContent, setOriginalContent] = useState('');
  // 从环境变量读取默认 API URL
  const defaultApiUrl = import.meta.env.VITE_AI_OUTLINE_API_URL || '';
  const [apiUrl, setApiUrl] = useState(defaultApiUrl);
  const [generatingOutline, setGeneratingOutline] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 构建 worldSetting，如果有原文内容则存储
      const worldSetting = originalContent.trim()
        ? { originalContent: originalContent.trim() }
        : undefined;

      const newScript = await createScript({
        title: values.title,
        description: values.description,
        outline: values.outline,
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0) : [],
        worldSetting,
      });
      Toast.success('创建成功');
      // 创建后跳转到编辑页面
      navigate(`/script/${newScript.id}`);
    } catch (error) {
      Toast.error('创建失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/scripts');
  };

  // AI 生成大纲
  const handleGenerateOutline = async () => {
    if (!originalContent.trim()) {
      Toast.warning('请先输入剧本原文内容');
      return;
    }

    if (!apiUrl.trim()) {
      Toast.warning('请先输入AI生成API的URL');
      return;
    }

    // 验证URL格式
    try {
      new URL(apiUrl);
    } catch {
      Toast.error('请输入有效的URL地址');
      return;
    }

    setGeneratingOutline(true);
    try {
      const response = await fetch(apiUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: originalContent.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 请求失败: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const result = await response.json();

      // 支持多种响应格式
      let outline = '';
      if (typeof result === 'string') {
        outline = result;
      } else if (result.outline) {
        outline = result.outline;
      } else if (result.data?.outline) {
        outline = result.data.outline;
      } else if (result.text) {
        outline = result.text;
      } else if (result.content) {
        outline = result.content;
      } else {
        outline = JSON.stringify(result, null, 2);
      }

      if (formApi) {
        formApi.setValue('outline', outline);
      }
      Toast.success('大纲生成成功');
    } catch (error) {
      Toast.error(error instanceof Error ? error.message : '生成大纲失败');
      console.error('生成大纲失败:', error);
    } finally {
      setGeneratingOutline(false);
    }
  };

  const headerExtra = (
    <Space spacing="loose">
      <Button
        icon={<IconArrowLeft />}
        theme="borderless"
        onClick={handleCancel}
      >
        返回
      </Button>
      <Button
        icon={<IconSave />}
        theme="solid"
        type="primary"
        loading={loading}
        onClick={() => formApi?.submitForm()}
      >
        创建剧本
      </Button>
    </Space>
  );

  return (
    <AppLayout
      headerTitle="新建剧本"
      headerExtra={headerExtra}
    >
      <Content style={{ padding: '24px', backgroundColor: 'var(--semi-color-bg-0)' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          <Card>
            <Form
              getFormApi={(api) => setFormApi(api)}
              onSubmit={handleSubmit}
              labelPosition="top"
            >
              {/* 基本信息区域 - 从上到下 */}
              <Form.Input
                field="title"
                label="剧本标题"
                placeholder="请输入剧本标题"
                rules={[{ required: true, message: '请输入剧本标题' }]}
                style={{ width: '100%' }}
              />

              <Form.TextArea
                field="description"
                label="剧本描述"
                placeholder="请输入剧本描述（可选）"
                autosize={{ minRows: 3 }}
                style={{ width: '100%', marginTop: 16 }}
              />

              {/* 大纲模式选择 */}
              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text strong style={{ fontSize: 14 }}>
                    故事大纲 <Text type="danger">*</Text>
                  </Text>
                  <Radio.Group
                    value={outlineMode}
                    onChange={(e) => setOutlineMode(e.target.value)}
                    type="button"
                  >
                    <Radio value="manual">
                      <IconEdit style={{ marginRight: 4 }} />
                      自己填写
                    </Radio>
                    <Radio value="ai">
                      <IconTicketCode style={{ marginRight: 4 }} />
                      AI生成
                    </Radio>
                  </Radio.Group>
                </div>

                {/* AI生成模式：显示原文和大纲左右对比 */}
                {outlineMode === 'ai' ? (
                  <div>
                    {/* AI生成配置区域 */}
                    <Card
                      style={{
                        marginBottom: 16,
                        backgroundColor: 'var(--semi-color-fill-0)',
                        border: '1px solid var(--semi-color-border)'
                      }}
                    >
                      <div style={{ marginBottom: 12 }}>
                        <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>
                          <IconLink style={{ marginRight: 4 }} />
                          AI生成API地址
                        </Text>
                        <Input
                          value={apiUrl}
                          onChange={setApiUrl}
                          placeholder="请输入AI生成API的完整URL，例如：https://api.example.com/generate-outline"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <Button
                        icon={<IconTicketCode />}
                        theme="solid"
                        type="primary"
                        loading={generatingOutline}
                        onClick={handleGenerateOutline}
                        disabled={!originalContent.trim() || !apiUrl.trim()}
                        block
                      >
                        {generatingOutline ? '生成中...' : '生成大纲'}
                      </Button>
                      {(!originalContent.trim() || !apiUrl.trim()) && (
                        <Text type="tertiary" size="small" style={{ display: 'block', marginTop: 8 }}>
                          {!originalContent.trim() && !apiUrl.trim()
                            ? '提示：请先输入剧本原文和API地址'
                            : !originalContent.trim()
                              ? '提示：请先在左侧输入剧本原文内容'
                              : '提示：请先输入AI生成API地址'}
                        </Text>
                      )}
                    </Card>

                    {/* 原文和大纲左右对比 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      {/* 左侧：剧本原文 */}
                      <div>
                        <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>剧本原文</Text>
                        <TextArea
                          value={originalContent}
                          onChange={setOriginalContent}
                          placeholder="请输入或粘贴剧本原文内容..."
                          autosize={{ minRows: 25, maxRows: 35 }}
                          style={{ width: '100%' }}
                        />
                      </div>

                      {/* 右侧：故事大纲 */}
                      <div>
                        <Form.TextArea
                          field="outline"
                          placeholder='点击"生成大纲"按钮生成，或手动编辑'
                          autosize={{ minRows: 25, maxRows: 35 }}
                          style={{ width: '100%' }}
                          rules={[{ required: true, message: '请输入故事大纲' }]}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 手动填写模式：只显示大纲输入框 */
                  <Form.TextArea
                    field="outline"
                    placeholder="请输入故事大纲"
                    autosize={{ minRows: 20, maxRows: 30 }}
                    style={{ width: '100%' }}
                    rules={[{ required: true, message: '请输入故事大纲' }]}
                  />
                )}
              </div>

              {/* 标签 */}
              <div style={{ marginTop: 24 }}>
                <Form.Input
                  field="tags"
                  label="标签"
                  placeholder="请输入标签，用逗号分隔（例如：悬疑,爱情,科幻）"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <Text type="tertiary" size="small">
                  提示：创建后会自动跳转到剧本编辑页面
                </Text>
              </div>
            </Form>
          </Card>
        </div>
      </Content>
    </AppLayout>
  );
}

