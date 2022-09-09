import { NextPage } from "next";
import Head from "next/head";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import {
  Box,
  Button,
  DataTable,
  Heading,
  Meter,
  Paragraph,
  Spinner,
  Text,
} from "grommet";
import { Login } from "grommet-icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CompletePackage } from "../../types/package";

export const getServerSideProps = withPageAuth({ redirectTo: "/enter" });

const Dashboard: NextPage = () => {
  const router = useRouter();

  const [packages, setPackages] = useState<CompletePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      fetch("/api/packages/get")
        .then((response) => response.json())
        .then((data) => {
          setPackages(data);
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
        <title>dashboard</title>
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
          <Button label="purchase a new package" />
          <Box gap="small" align="center">
            <Heading>your packages</Heading>
            {isLoading ? (
              <Spinner size="xlarge" />
            ) : (
              <DataTable
                columns={[
                  {
                    property: "createdAt",
                    header: <Text>date</Text>,
                    primary: true,
                    render: (datum) => (
                      <Text>
                        {new Date(datum.createdAt).toLocaleDateString()}
                      </Text>
                    ),
                  },
                  {
                    property: "balance",
                    header: "balance",
                    render: (datum) => (
                      <Box
                        pad={{ vertical: "xsmall" }}
                        direction="row"
                        align="center"
                        gap="small"
                      >
                        <Paragraph>${datum.currentBalance}</Paragraph>
                        <Meter
                          values={[
                            {
                              value:
                                (datum.currentBalance / datum.initialBalance) *
                                100,
                            },
                          ]}
                          thickness="small"
                          size="small"
                        />
                        <Paragraph>${datum.initialBalance}</Paragraph>
                      </Box>
                    ),
                  },
                  {
                    property: "access",
                    header: <Text>use</Text>,
                    render: (datum) => (
                      <Box pad={{ vertical: "xsmall" }}>
                        <Button
                          icon={<Login />}
                          onClick={() => {
                            router.push("/dashboard/info/" + datum.id);
                          }}
                        />
                      </Box>
                    ),
                  },
                ]}
                data={packages}
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
