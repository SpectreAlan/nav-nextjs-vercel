import React, {useState, ReactNode, useContext, useEffect} from 'react';
import {Layout, theme, Spin} from 'antd';
import CustomHeader from './Header'
import SideMenu from './SideMenu'
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons'
import {GlobalContext} from "@/GlobalContext";
import GlobalLoading from '@/components/GlobalLoading'
import {useRouter} from "next/navigation";


type Props = {
    children: ReactNode;
};

const {Header, Sider, Content} = Layout;

const App: React.FC<Props> = ({children}) => {
    const router = useRouter();
    const {globalLoading} = useContext(GlobalContext)
    const [collapsed, setCollapsed] = useState(false);
    useEffect(()=>{
        setCollapsed((global?.window?.innerWidth || 699) < 700)
    }, [])
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Spin spinning={globalLoading}>
            <GlobalLoading/>
            <Layout>
                <Sider
                    theme={'light'}
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    className={'overflow-auto fixed left-0 top-0 bottom-0 h-screen border-r-grey'}
                >
                    <div className='w-full text-center align-middle'>
                        <img
                            src='https://nav-vercel.oss-cn-hongkong.aliyuncs.com/base/logo.png'
                            alt="logo"
                            onClick={() => router.push(`/`)}
                            className={'cursor-pointer w-20'}
                        />
                    </div>
                    <SideMenu theme={colorBgContainer}/>
                </Sider>
                <Layout style={{
                    paddingLeft: collapsed ? '80px' : '200px',
                }}>
                    <Header
                        className={`p-0 pl-5 fixed top-0 flex items-center justify-between border-b-grey`}
                        style=
                            {{
                                left: collapsed ? '80px' : '200px',
                                width: `calc(100% - ${collapsed ? '80px' : '200px'})`,
                                backgroundColor: colorBgContainer
                            }}
                    >
                        <div
                            onClick={() => setCollapsed(!collapsed)}
                            className={'text-xl cursor-pointer'}
                        >
                            {collapsed ? <MenuUnfoldOutlined rev=''/> : <MenuFoldOutlined rev='' />}
                        </div>
                        <CustomHeader theme={colorBgContainer}/>
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