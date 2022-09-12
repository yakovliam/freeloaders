import { Box, Button, Heading, Text, Image, Anchor } from "grommet";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Notification, {
  NotificationType,
} from "../../components/notification/Notification";

const Help: NextPage = () => {
  const router = useRouter();
  const notificationType: NotificationType = "error";
  const notificationMessage: string = "something went wrong during: ";
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);

  useEffect(() => {
    setNotificationIsOpen(router.query.error != undefined);
  }, [router]);

  return (
    <>
      <Head>
        <title>help</title>
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
        <Box align="center" direction="column" gap="small">
          <Heading>help</Heading>
          {notificationIsOpen && (
            <Notification
              message={notificationMessage + " " + router.query.error}
              type={notificationType}
              closeNotification={function (): void {
                setNotificationIsOpen(false);
              }}
            />
          )}
          <Text>need help? email us!</Text>
          <Anchor color={"accent-3"} href={"mailto:help@ucfreeloaders.org"}>
            help@ucfreeloaders.org
          </Anchor>
        </Box>
        <Box align="center" direction="column" gap="small">
          <Heading>about us</Heading>
          <Box width={"medium"}>
            <Text textAlign="center">
              FreeLoaders @ UC provides access to laundry services at UC for a
              lower cost than the competition. We partner with CSC ServiceWorks
              at UC to provide these services in a more ethical way by cutting
              out the vendor fees through our own transaction system.
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Help;
