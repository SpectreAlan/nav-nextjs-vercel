import { AppProps } from "next/app";
import '../static/style/common.css'
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Component {...pageProps} />
  );
};

export default App;
