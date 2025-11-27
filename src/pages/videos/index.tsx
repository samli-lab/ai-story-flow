import { Typography, Empty } from '@douyinfe/semi-ui';
import AppLayout from '../../components/AppLayout';

const { Title } = Typography;

export default function VideosPage() {
  return (
    <AppLayout headerTitle="视频管理">
      <div style={{ padding: '24px' }}>
        <Title heading={4} style={{ marginBottom: 24 }}>
          视频管理
        </Title>
        <Empty description="视频管理功能开发中..." />
      </div>
    </AppLayout>
  );
}

