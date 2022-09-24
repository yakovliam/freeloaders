import { NextPage } from "next";
import Head from "next/head";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Box, Clock, Heading, Spinner, Text } from "grommet";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const getServerSideProps = withPageAuth({ redirectTo: "/enter" });

const Loading: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/dashboard");
    }, 10000);
  }, []);

  return (
    <>
      <Head>
        <title>loading...</title>
        <meta name="description" content="loading" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        align="center"
        direction="column"
        background="white"
        pad="medium"
        flex="grow"
      >
        <Box align="center" direction="column" margin={{ top: "medium" }}>
          <Box align="center" gap="medium">
            <Heading margin={{ bottom: "none" }}>working on it...</Heading>
            <Text>please wait while we generate your $5</Text>
            <Clock
              size="xxlarge"
              type="digital"
              run="backward"
              time="2000-01-01T00:00:10"
            />
            <Spinner size="xlarge" />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Loading;
