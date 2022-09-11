import "normalize.css/normalize.css";
import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { Grommet } from "grommet";
import { theme } from "../theme/theme";
import Layout from "../components/layout/Layout";
import React from "react";
import Device from "../components/device";
import NotMobile from "../components/views/notmobile/NotMobile";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "../utils/supabase";
import { SWRConfig } from "swr";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <SWRConfig>
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
      </SWRConfig>
    </SessionContextProvider>
  );
}

export default MyApp;
