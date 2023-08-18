import React, { useState, ReactNode  } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
type Props = {
    children: ReactNode;
};
const { Header, Sider, Content } = Layout;

const App: React.FC<Props> = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const handleClick = (item, key, keyPath)=>{
        console.log(item, key, keyPath);
        const anchorElement = document.getElementById(item.key);
        console.log(anchorElement);
        // 如果对应id的锚点存在，就跳转到锚点
        if(anchorElement) { anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'}); }
    }

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={handleClick}
                    items={[
                        {
                            key: 'nav1',
                            icon: <UserOutlined />,
                            label: 'nav 1',
                        },
                        {
                            key: 'nav2',
                            icon: <VideoCameraOutlined />,
                            label: 'nav 2',
                        },
                        {
                            key: 'nav3',
                            icon: <UploadOutlined />,
                            label: 'nav 3',
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    {props.children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;