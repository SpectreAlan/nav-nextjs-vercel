import {GlobalProvider} from '@/GlobalContext'
import {SessionProvider} from "next-auth/react"
import {AppProps} from "next/app";
import '../static/style/global.scss'
import Layout from "@/components/layout";
import theme from '../../theme/themeConfig';
import {ConfigProvider} from 'antd';

const App = ({Component, pageProps}: AppProps) => {
    return (
        <GlobalProvider>
            <SessionProvider session={pageProps.session}>
                <ConfigProvider theme={theme}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ConfigProvider>
            </SessionProvider>
        </GlobalProvider>
    );
};

export default App;
