/* eslint-disable react/jsx-props-no-spreading */
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import Head from "next/head";

import defaultSEOConfig from "../../next-seo.config";
import { Antd } from "lib/components/Antd";
import Layout from "lib/layout";
//import Header from "../lib/layout/Header";
//import Footer from "../lib/layout/Footer";
const { Header, Footer } = Layout;
import "lib/styles/globals.css";
import "lib/styles/tailwind.css";
import "lib/styles/antdTheme/antd-theme.css";
import { configureAppStore } from "lib/store/configureStore";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useStore } from "react-redux";
// import "antd/dist/antd.css";

const { persistor, store } = configureAppStore();
const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Antd>
          <Head>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
            />
          </Head>
          <DefaultSeo {...defaultSEOConfig} />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Antd>
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
