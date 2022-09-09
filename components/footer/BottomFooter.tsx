import { Box, Footer, Text } from "grommet";

function BottomFooter() {
  return (
    <Footer background="brand" align="center" pad="medium">
      <Box align="center" width={"100%"}>
        <Text>copyright © FreeLoaders {new Date().getFullYear()}</Text>
      </Box>
    </Footer>
  );
}

export default BottomFooter;
