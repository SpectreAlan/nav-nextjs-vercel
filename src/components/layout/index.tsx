import React, {useState, ReactNode, useEffect} from 'react';
import {Layout, theme, Drawer} from 'antd';
import CustomHeader from './Header'
import SideMenu from './SideMenu'
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons'
import GlobalLoading from '@/components/GlobalLoading'
import Loading from '@/components/Loading'
import {Analytics} from '@vercel/analytics/react';

type Props = {
    children: ReactNode;
};

const {Header, Sider, Content} = Layout;

const App: React.FC<Props> = ({children}) => {

    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mobile = (global?.window?.innerWidth || 699) < 700
        setIsMobile(mobile)
        if(mobile){
            setCollapsed(!mobile)
        }
    }, [])

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <>
            <GlobalLoading/>
            <Analytics/>
            <Loading/>
            <Layout>
                {
                    isMobile ? <Drawer
                        closeIcon={null}
                        title="Have a nice day!"
                        placement={'left'}
                        width={300}
                        onClose={() => setCollapsed(false)}
                        open={collapsed}
                        classNames={
                            {
                                header: 'hidden'
                            }
                        }
                    >
                        <SideMenu theme={colorBgContainer} setCollapsed={setCollapsed} isMobile={isMobile}/>
                    </Drawer> : <Sider
                        theme={'light'}
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        className={'overflow-auto fixed left-0 top-0 bottom-0 h-screen border-r-grey'}
                    >
                        <SideMenu theme={colorBgContainer} setCollapsed={setCollapsed} isMobile={isMobile}/>
                    </Sider>
                }
                <Layout style={{
                    paddingLeft: isMobile ? '0' : (collapsed ? '80px' : '200px'),
                }}>
                    <Header
                        className={`p-0 pl-5 fixed top-0 flex items-center justify-between border-b-grey`}
                        style=
                            {{
                                left: isMobile ? 0 : (collapsed ? '80px' : '200px'),
                                width: isMobile ? '100%' : `calc(100% - ${collapsed ? '80px' : '200px'})`,
                                backgroundColor: colorBgContainer
                            }}
                    >
                        <div
                            onClick={() => setCollapsed(!collapsed)}
                            className={'text-xl cursor-pointer'}
                        >
                            {collapsed ? <MenuUnfoldOutlined rev=''/> : <MenuFoldOutlined rev=''/>}
                        </div>
                        <CustomHeader theme={colorBgContainer}/>
                    </Header>
                    <Content
                        className={'app-content flex justify-between overflow-y-auto p-[14px]'}
                        style={{
                            background: colorBgContainer,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default App;