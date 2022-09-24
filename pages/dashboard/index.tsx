import { NextPage } from "next";
import Head from "next/head";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import {
  Box,
  Button,
  Clock,
  DataTable,
  Header,
  Heading,
  Meter,
  Paragraph,
  Spinner,
  Text,
} from "grommet";
import { CaretNext } from "grommet-icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CompletePackage } from "../../types/package";
import useSWR from "swr";
import { supabase } from "../../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { UserLastRefreshResponse } from "../../types/user";

export const getServerSideProps = withPageAuth({ redirectTo: "/enter" });

const fetcher = (args: any) => fetch(args).then((res) => res.json());

function Dashboard() {
  const router = useRouter();
  const [loadingNewPackage, setLoadingNewPackage] = useState(false);
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
    setLoadingNewPackage(true);
    // call function
    await supabase.functions
      .invoke("create-new-package", {
        body: JSON.stringify({ userId: user?.id }),
      })
      .finally(() => {
        setLoadingNewPackage(false);
      });

    router.push("/dashboard/loading");
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

  const determineBarColor = (pack: CompletePackage) => {
    const percent = (pack.currentBalance / pack.initialBalance) * 100;

    if (percent <= 20) {
      return "accent-1";
    } else if (percent <= 50) {
      return "accent-2";
    } else if (percent >= 100) {
      return "status-ok";
    } else {
      return "neutral-1";
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
        background="white"
        pad="medium"
        flex="grow"
      >
        <Box align="center" direction="column" margin={{ top: "medium" }}>
          {!shouldSuspendRefreshContent ? (
            shouldShowRefreshButton ? (
              loadingNewPackage ? (
                <Spinner size="xlarge" />
              ) : (
                <Button
                  label={"get $5 more for free"}
                  onClick={() => callCreatePackage()}
                />
              )
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
              <Box gap="large" justify="around">
                {packages
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((pack) => {
                    return (
                      <Box
                        key={pack.id}
                        round="small"
                        elevation="large"
                        background={"white"}
                        pad="medium"
                        align="center"
                        gap="small"
                      >
                        <Box direction="row">
                          {pack.currentBalance === -1 ? (
                            <Text
                              weight={"bold"}
                              size="3xl"
                              color={"status-warning"}
                            >
                              check later
                            </Text>
                          ) : (
                            <Text
                              weight={"bold"}
                              size="3xl"
                              color={"status-ok"}
                            >
                              ${pack.currentBalance}
                            </Text>
                          )}
                          <Text weight={"bold"} size={"3xl"} color={"light-6"}>
                            /${pack.initialBalance}
                          </Text>
                        </Box>
                        <Meter
                          background="light-3"
                          type="bar"
                          round
                          values={[
                            {
                              color: determineBarColor(pack),
                              value:
                                (pack.currentBalance / pack.initialBalance) *
                                100,
                              label: "sixty",
                              onClick: () => {},
                            },
                          ]}
                          aria-label="meter"
                        />
                        <Box
                          align="center"
                          direction="row"
                          gap="small"
                          width="100%"
                        >
                          <Box flex={{ grow: 2 }} width="2xs" />
                          <Box flex={{ grow: 2 }} align="center">
                            <Text>
                              {new Date(pack.createdAt).toLocaleDateString()}
                            </Text>
                          </Box>
                          <Box flex={{ grow: 1 }} width="2xs" align="end">
                            <Button
                              onClick={() => {
                                router.push("/dashboard/info/" + pack.id);
                              }}
                              secondary
                              icon={<CaretNext />}
                            />
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
