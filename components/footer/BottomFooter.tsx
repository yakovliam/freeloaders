import { Anchor, Box, Footer, Text } from "grommet";

function BottomFooter() {
  return (
    <Footer background="dark-2" align="center" pad="medium">
      <Box align="center" width={"100%"}>
        <Text>copyright © FreeLoaders {new Date().getFullYear()}</Text>
        <Anchor href="/help" label="help/about us" />
      </Box>
    </Footer>
  );
}

export default BottomFooter;
