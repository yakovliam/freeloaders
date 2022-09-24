import { Box, Button, Heading, Select, TextInput } from "grommet";
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import Notification from "../../components/notification/Notification";
import { NotificationType } from "../../components/notification/Notification";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const SignIn: NextPage = () => {
  const user = useUser();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [notificationType, setNotificationType] =
    useState<null | NotificationType>(null);
  const [notificationMessage, setNotificationMessage] = useState<null | string>(
    null
  );
  const closeNotification = () => {
    setNotificationMessage(null);
    setNotificationType(null);
  };
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSignin = async () => {
    if (!email) {
      return;
    }
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });
      if (error) throw error;
      setNotificationMessage("check your UC email for a login link!");
      setNotificationType("success");
    } catch (error: any) {
      const message =
        error.message === "{}"
          ? "to use this service, you must be a UC student."
          : error.message;
      setNotificationMessage(error.error_description || message);
      setNotificationType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>enter your UC email</title>
        <meta name="description" content="enter FreeLoaders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        align="center"
        direction="column"
        background="white"
        pad="medium"
        flex="grow"
      >
        <Box align="center" direction="column" gap={"large"}>
          <Heading margin={{ bottom: "none" }}>enter your UC email</Heading>
          {notificationType && notificationMessage && (
            <Notification
              closeNotification={closeNotification}
              type={notificationType}
              message={notificationMessage}
            />
          )}
          <Box
            background="white"
            round="small"
            elevation="large"
            gap="small"
            pad={"medium"}
          >
            <Box direction="row" overflow={"none"}>
              <TextInput
                placeholder="UC Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Box>
            <Button label="enter freeloaders" onClick={() => handleSignin()} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SignIn;
