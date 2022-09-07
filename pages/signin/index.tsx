import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Text,
  TextInput,
} from "grommet";
import type { NextPage } from "next";
import Head from "next/head";
import { em } from "polished";
import { useState } from "react";
import styles from "../styles/Home.module.css";

const SignIn: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();
  return (
    <>
      <Head>
        <title>Sign In</title>
        <meta name="description" content="Sign In" />
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
          <Heading>Sign In</Heading>
          <Box background="light-1" round gap="small" pad={"medium"}>
            <TextInput
              placeholder="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextInput
              placeholder="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button label="sign in" />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SignIn;
