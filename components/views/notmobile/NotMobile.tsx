import { Box, Heading, Text } from "grommet";

function NotMobile() {
  return (
    <Box align="center" height={"full"} width={"full"}>
      <Heading>Sorry!</Heading>
      <Text>FreeLoaders is only for use on a mobile phone.</Text>
    </Box>
  );
}

export default NotMobile;
