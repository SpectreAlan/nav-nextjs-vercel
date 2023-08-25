import {GlobalProvider} from '@/GlobalContext'
import {AppProps} from "next/app";
import '../static/style/global.css'
import Layout from "@/components/layout";

const App = ({Component, pageProps}: AppProps) => {
    return (
        <GlobalProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </GlobalProvider>
    );
};

export default App;
