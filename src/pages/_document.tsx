import Document, {Head, Html, Main, NextScript} from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico'/>
                    <meta name="author" content="SpectreAlan"/>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;