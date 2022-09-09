import { Box, Button, Heading, Text, Image } from "grommet";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

const Home: NextPage = () => {
  const router = useRouter();
  const user = useUser();

  return (
    <>
      <Head>
        <title>UC FreeLoaders</title>
        <meta name="description" content="Pay less for essential services" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        align="center"
        direction="column"
        gap="large"
        background="graph-2"
        pad="medium"
        flex="grow"
      >
        <Box align="center" direction="column">
          <Heading>FreeLoaders</Heading>
          <Text>
            pay less for <em>essential</em> services!
          </Text>
        </Box>
        <Box align="center">
          <Button
            primary
            label={user ? "visit the dashboard" : "get started"}
            onClick={() => {
              if (!user) {
                router.push("/enter");
              } else {
                router.push("/dashboard");
              }
            }}
          />
        </Box>
        <Box margin={{ top: "large" }}>
          <Box
            round={"large"}
            background={"brand"}
            pad="large"
            height="small"
            width="small"
          >
            <Image
              color="light-1"
              alt="Washing Machine"
              fit="cover"
              src="/washing-machine.svg"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
