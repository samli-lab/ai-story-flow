import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Layout,
  Nav,
  Button,
  Typography,
  Space,
  Tooltip,
  Avatar,
  Dropdown,
} from "@douyinfe/semi-ui";
import {
  IconSave,
  IconRefresh,
  IconPlus,
  IconSetting,
  IconHome,
  IconSidebar,
  IconUser,
  IconExit,
} from "@douyinfe/semi-icons";
import "./Dashboard.css";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "开始" },
    position: { x: 250, y: 0 },
  },
  {
    id: "2",
    data: { label: "AI 处理节点" },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    data: { label: "决策节点" },
    position: { x: 400, y: 100 },
  },
  {
    id: "4",
    type: "output",
    data: { label: "结束" },
    position: { x: 250, y: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-4", source: "3", target: "4" },
];

function Dashboard() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = () => {
    console.log("保存流程", { nodes, edges });
  };

  const handleReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          backgroundColor: "var(--semi-color-bg-0)",
          borderBottom: "1px solid var(--semi-color-border)",
          padding: "0 32px",
          height: 72,
          minHeight: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Space spacing="loose">
            <Button
              icon={<IconSidebar />}
              theme="borderless"
              onClick={toggleSidebar}
              style={{ marginRight: 8 }}
            />
            <IconHome size="extra-large" style={{ color: "var(--semi-color-primary)" }} />
            <Title heading={3} style={{ margin: 0, fontWeight: 600 }}>
              AI Story Flow
            </Title>
          </Space>
          <Space spacing="loose">
            <Tooltip content="添加节点" position="bottom">
              <Button icon={<IconPlus />} theme="borderless" size="large" />
            </Tooltip>
            <Tooltip content="重置" position="bottom">
              <Button icon={<IconRefresh />} theme="borderless" size="large" onClick={handleReset} />
            </Tooltip>
            <Tooltip content="保存" position="bottom">
              <Button
                icon={<IconSave />}
                theme="solid"
                type="primary"
                size="large"
                onClick={handleSave}
              >
                保存
              </Button>
            </Tooltip>
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
                      console.log("退出登录");
                      // 这里可以添加退出登录的逻辑
                    }}
                  >
                    退出登录
                  </Dropdown.Item>
                </Dropdown.Menu>
              }
            >
              <Space
                style={{
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  transition: "background-color 0.2s",
                }}
                className="user-info-trigger"
              >
                <Avatar
                  size="small"
                  color="blue"
                  style={{ backgroundColor: "var(--semi-color-primary)" }}
                >
                  <IconUser />
                </Avatar>
                <Typography.Text strong>用户名</Typography.Text>
              </Space>
            </Dropdown>
          </Space>
        </div>
      </Header>
      <Layout>
        <Sider
          style={{
            backgroundColor: "var(--semi-color-bg-1)",
            borderRight: "1px solid var(--semi-color-border)",
            width: isCollapsed ? 60 : 240,
            transition: "width 0.3s ease",
          }}
        >
          <Nav
            style={{ height: "100%" }}
            items={[
              {
                itemKey: "nodes",
                text: "节点库",
                icon: <IconHome />,
              },
              {
                itemKey: "templates",
                text: "模板",
                icon: <IconSetting />,
              },
            ]}
            defaultOpenKeys={["nodes"]}
            isCollapsed={isCollapsed}
          />
        </Sider>
        <Content
          style={{
            backgroundColor: "var(--semi-color-bg-0)",
            padding: 0,
            position: "relative",
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;

