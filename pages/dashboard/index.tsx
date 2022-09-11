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
import useSWR from "swr";
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "../../utils/supabase";

export const getServerSideProps = withPageAuth({ redirectTo: "/enter" });

const fetcher = (args: any) => fetch(args).then((res) => res.json());

function Dashboard() {
  const router = useRouter();

  const [packages, setPackages] = useState<CompletePackage[]>([]);

  const { data, error } = useSWR("/api/packages/get", fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status === 404) return;

      // Only retry up to 10 times.
      if (retryCount >= 10) return;

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 2000);
    },
    loadingTimeout: 3000,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setPackages(data);
      return;
    }
  }, [data, error]);

  const checkout = async () => {
    const { data, error } = await supabase.functions.invoke(
      "create-stripe-checkout"
    );

    if (error) {
      console.error(error);
      return;
    }

    const sessionId = data.id;

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
    const result = await stripe?.redirectToCheckout({
      sessionId: sessionId,
    });

    if (result?.error) {
      console.error(result?.error.message);
      router.push("/help?error=purchasing%20a%20package");
    }
  };

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
          <Button label="purchase a new package" onClick={() => checkout()} />
          <Box gap="small" align="center">
            <Heading>your packages</Heading>
            {!data ? (
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
                        <Paragraph>
                          {datum.currentBalance !== -1
                            ? "$" + datum.currentBalance
                            : "??"}
                        </Paragraph>
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
}

export default Dashboard;
