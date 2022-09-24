import { NextPage } from "next";
import Head from "next/head";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Box, Button, Text, Spinner, Heading, Paragraph } from "grommet";
import { Previous } from "grommet-icons";
import { useRouter } from "next/router";
import { CompletePackage } from "../../../types/package";
import { useEffect, useState } from "react";
import useSWR from "swr";

export const getServerSideProps = withPageAuth({ redirectTo: "/enter" });

const fetcher = (args: any) => fetch(args).then((res) => res.json());

const Info: NextPage = () => {
  const router = useRouter();
  const id: string | string[] | undefined = router.query.id;

  const [completePackage, setPackage] = useState<CompletePackage | null>(null);

  const { data, error } = useSWR(
    "/api/packages/info?id=" + String(id),
    fetcher,
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404.
        if (error.status === 404) return;

        // Only retry up to 10 times.
        if (retryCount >= 10) return;

        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 2000);
      },
      loadingTimeout: 3000,
    }
  );

  useEffect(() => {
    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      if (data.message) {
        return;
      }
      setPackage(data);
      return;
    }
  }, [data, error]);

  return (
    <>
      <Head>
        <title>info</title>
        <meta name="description" content="dashboard" />
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
          <Box align="center">
            <Button
              icon={<Previous />}
              label="return to dashboard"
              onClick={() => {
                router.push("/dashboard");
              }}
            />
            <Heading>use this package</Heading>

            {!completePackage ? (
              <Spinner size="xlarge" />
            ) : (
              <>
                {" "}
                <Box
                  round="small"
                  background={"dark-1"}
                  pad="medium"
                  margin={{ bottom: "large" }}
                >
                  {completePackage.currentBalance === -1 ? (
                    <Text weight={"bold"} size="3xl" color={"status-warning"}>
                      check later
                    </Text>
                  ) : (
                    <Text weight={"bold"} size="3xl" color={"status-ok"}>
                      ${completePackage.currentBalance}
                    </Text>
                  )}
                </Box>
                <Box gap="large" align="center">
                  <Box
                    background={"white"}
                    elevation="large"
                    pad="medium"
                    round
                  >
                    <Box direction="row" gap={"medium"}>
                      <Paragraph>email:</Paragraph>
                      <Paragraph>{completePackage?.email}</Paragraph>
                    </Box>
                    <Box direction="row" gap={"medium"}>
                      <Paragraph>password:</Paragraph>
                      <Paragraph>{completePackage?.password}</Paragraph>
                    </Box>
                  </Box>
                  <Box gap="small">
                    <Text textAlign="center">1. enter the CSC Mobile app</Text>
                    <Text textAlign="center">
                      2. sign out of your current account
                    </Text>
                    <Text textAlign="center">
                      3. sign into a new account with the email/password below
                    </Text>
                    <Text textAlign="center">4. scan into a machine</Text>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Info;
