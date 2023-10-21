import React, {useState, ReactNode, useContext} from 'react';
import Image from 'next/image'
import {Layout, Button, theme, Spin} from 'antd';
import CustomHeader from './Header'
import SideMenu from './SideMenu'
import Logo from '@/static/images/logo.gif'
import Icon from '@/components/Icon'
import {GlobalContext} from "@/GlobalContext";
import GlobalLoading from '@/components/GlobalLoading'


type Props = {
    children: ReactNode;
};

const {Header, Sider, Content} = Layout;

const App: React.FC<Props> = ({children}) => {
    const {globalLoading} = useContext(GlobalContext)
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Spin spinning={globalLoading}>
            <GlobalLoading/>
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
                            icon={collapsed ? <Icon type={'icon-zhankai'}/> : <Icon type={'icon-zhedie-shouqi'}/>}
                            onClick={() => setCollapsed(!collapsed)}
                            className={'text-xl text-white'}
                        />
                        <CustomHeader/>
                    </Header>
                    <Content
                        className={'app-content'}
                        style={{
                            background: colorBgContainer,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Spin>
    );
};

export default App;