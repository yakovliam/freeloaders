import { NextPage } from "next";
import Head from "next/head";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import {
  Box,
  Button,
  Clock,
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
import {
  CompletePackage,
  FreePackageRefreshTimeInHoursResponse,
} from "../../types/package";
import useSWR from "swr";
import { supabase } from "../../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { UserLastRefreshResponse } from "../../types/user";

export const getServerSideProps = withPageAuth({ redirectTo: "/enter" });

const fetcher = (args: any) => fetch(args).then((res) => res.json());

function Dashboard() {
  const router = useRouter();
  const [packages, setPackages] = useState<CompletePackage[]>([]);
  const [refreshTimeInHours, setRefreshTimeInHours] = useState<number | null>(
    null
  );
  const [lastRefreshTimestamp, setLastRefreshTimestamp] = useState<Date | null>(
    null
  );
  const user = useUser();

  const { data: refreshData, error: refreshError } = useSWR(
    "/api/settings/getPackageRefresh",
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

  const { data: lastRefreshData, error: lastRefreshError } = useSWR(
    "/api/user/getLastRefreshTime",
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

  const { data: packageData, error: packageError } = useSWR(
    "/api/packages/get",
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
    if (refreshError) {
      console.error(refreshError);
      return;
    }

    if (refreshData) {
      setRefreshTimeInHours(refreshData.time);
      return;
    }
  }, [refreshData, refreshError]);

  useEffect(() => {
    if (lastRefreshError) {
      console.error(lastRefreshError);
      return;
    }

    if (lastRefreshData) {
      setLastRefreshTimestamp(
        new Date(
          (lastRefreshData as UserLastRefreshResponse).lastRefreshTimestamp
        )
      );
      return;
    }
  }, [lastRefreshData, lastRefreshError]);

  useEffect(() => {
    if (packageError) {
      console.error(packageError);
      return;
    }

    if (packageData) {
      setPackages(packageData);
      return;
    }
  }, [packageData, packageError]);

  const callCreatePackage = async () => {
    if (!user || !user.id) {
      return;
    }
    // call function
    await supabase.functions.invoke("create-new-package", {
      body: JSON.stringify({ userId: user?.id }),
    });
  };

  const [shouldShowRefreshButton, setShouldShowRefreshButton] = useState(false);
  const [shouldSuspendRefreshContent, setShouldSuspendRefreshContent] =
    useState(true);

  useEffect(() => {
    setShouldShowRefreshButton(
      (refreshData || refreshError) &&
        (lastRefreshData || lastRefreshError) &&
        lastRefreshTimestamp != null &&
        refreshTimeInHours != null &&
        Math.abs(lastRefreshTimestamp.getTime() - new Date().getTime()) /
          3.6e6 >
          refreshTimeInHours
    );

    if (
      (refreshData || refreshError) &&
      (lastRefreshData || lastRefreshError)
    ) {
      setShouldSuspendRefreshContent(false);
    }
  }, [
    refreshData,
    refreshError,
    lastRefreshData,
    lastRefreshError,
    refreshTimeInHours,
    lastRefreshTimestamp,
  ]);

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
          {!shouldSuspendRefreshContent ? (
            shouldShowRefreshButton ? (
              <Button
                label={"get $5 more for free"}
                onClick={() => callCreatePackage()}
              />
            ) : (
              <Box align="center" gap="small" direction="column">
                <Text>get another $5 for free in</Text>
                <Clock
                  type="digital"
                  run="backward"
                  time={new Date(
                    lastRefreshTimestamp!.getTime() +
                      refreshTimeInHours! * 3.6e6 -
                      new Date().getTime()
                  ).toISOString()}
                />
              </Box>
            )
          ) : (
            <></>
          )}

          <Box gap="small" align="center">
            <Heading>your packages</Heading>
            {!packageData ? (
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
