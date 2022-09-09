import { NextPage } from "next";
import Head from "next/head";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import {
  Box,
  Button,
  Text,
  Spinner,
  Heading,
  Tag,
  TextInput,
  Paragraph,
  Markdown,
  List,
  Card,
  CardBody,
} from "grommet";
import { Previous } from "grommet-icons";
import { useRouter } from "next/router";
import { CompletePackage } from "../../../types/package";
import { useEffect, useState } from "react";

export const getServerSideProps = withPageAuth({ redirectTo: "/enter" });

const Info: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;

  const [completePackage, setPackage] = useState<CompletePackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      fetch("/api/packages/info?" + new URLSearchParams({ id: id }))
        .then((response) => response.json())
        .then((data) => {
          setPackage(data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    fetchData();
  }, []);

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
        background="graph-2"
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

            {isLoading ? (
              <Spinner size="xlarge" />
            ) : (
              <>
                {" "}
                <Box
                  round
                  background={"dark-1"}
                  pad="medium"
                  margin={{ bottom: "large" }}
                >
                  <Text weight={"bold"} size="3xl" color={"status-ok"}>
                    ${completePackage?.currentBalance}
                  </Text>
                </Box>
                <Box gap="large" align="center">
                  <Box background={"light-1"} pad="medium" round>
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
