import { Typography, Empty } from '@douyinfe/semi-ui';
import AppLayout from '../../components/AppLayout';

const { Title } = Typography;

export default function TagsPage() {
  return (
    <AppLayout headerTitle="标签管理">
      <div style={{ padding: '24px' }}>
        <Title heading={4} style={{ marginBottom: 24 }}>
          标签管理
        </Title>
        <Empty description="标签管理功能开发中..." />
      </div>
    </AppLayout>
  );
}

