import {GlobalProvider} from '@/GlobalContext'
import {SessionProvider} from "next-auth/react"
import {AppProps} from "next/app";
import '../static/style/global.scss'
import Layout from "@/components/layout";

const App = ({Component, pageProps}: AppProps) => {
    return (
        <GlobalProvider>
            <SessionProvider session={pageProps.session}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SessionProvider>
        </GlobalProvider>
    );
};

export default App;
