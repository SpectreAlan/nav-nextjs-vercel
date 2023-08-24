import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import CustomHeader from './Header'

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'nav 1',
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'nav 2',
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'nav 3',
                        },
                    ]}
                />
            </Sider>
            <Layout style={{
                paddingLeft: collapsed ? '80px' : '200px',
            }}>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer,
                    position: 'fixed',
                    left: collapsed ? '80px' : '200px',
                    top: 0,
                    width: `calc(100% - ${collapsed ? '80px' : '200px'})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
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
                    <CustomHeader/>
                </Header>
                <Content
                    style={{
                        margin: '84px 16px 24px',
                        padding: 24,
                        minHeight: 980,
                        background: colorBgContainer,
                    }}
                >
                    Content
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;