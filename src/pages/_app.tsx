import React, {useEffect} from 'react'
import {GlobalProvider} from '@/GlobalContext'
import {SessionProvider} from "next-auth/react"
import {AppProps} from "next/app";
import '../static/style/global.scss'
import Layout from "@/components/layout";
import theme from '../../theme/themeConfig';
import {ConfigProvider} from 'antd';
import Head from "next/head";

const App = ({Component, pageProps}: AppProps) => {

    return (
        <SessionProvider session={pageProps.session}>
            <GlobalProvider>
                <ConfigProvider theme={theme}>
                    <Head>
                        <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
                    </Head>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ConfigProvider>
            </GlobalProvider>
        </SessionProvider>
    );
};

export default App;
