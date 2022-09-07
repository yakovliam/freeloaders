import "normalize.css/normalize.css";
import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { Box, Grommet, ResponsiveContext } from "grommet";
import { theme } from "../theme/theme";
import Layout from "../components/layout/Layout";
import React from "react";
import Device from "../components/device";
import NotMobile from "../components/views/notmobile/NotMobile";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Grommet theme={theme}>
      <Device>
        {({ isMobile, isTablet }) => {
          if (isMobile && !isTablet)
            return (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            );
          return <NotMobile />;
        }}
      </Device>
    </Grommet>
  );
}

export default MyApp;
