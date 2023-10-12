import React, {useState, ReactNode } from 'react';
import Image from 'next/image'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Layout,  Button, theme} from 'antd';
import CustomHeader from './Header'
import SideMenu from './SideMenu'
import Logo from '@/static/images/logo.gif'


type Props = {
    children: ReactNode;
};

const {Header, Sider, Content} = Layout;

const App: React.FC<Props> = ({children}) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className={'overflow-auto fixed left-0 top-0 bottom-0 h-screen'}
            >
                <Image
                    src={Logo}
                    width={64}
                    height={64}
                    alt="logo"
                    priority
                    className={'mx-auto my-auto'}
                />
                <SideMenu/>
            </Sider>
            <Layout style={{
                paddingLeft: collapsed ? '80px' : '200px',
            }}>
                <Header
                    className={`p-0 fixed top-0 flex items-center justify-between bg-[${colorBgContainer}]`}
                    style=
                        {{
                            left: collapsed ? '80px' : '200px',
                            width: `calc(100% - ${collapsed ? '80px' : '200px'})`,
                        }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined rev={'1.0'}/> : <MenuFoldOutlined rev={'1.0'}/>}
                        onClick={() => setCollapsed(!collapsed)}
                        className={'text-xl text-white'}
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
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;