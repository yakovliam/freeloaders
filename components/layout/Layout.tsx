import TopHeader from "../header/TopHeader";
import BottomFooter from "../footer/BottomFooter";
import { Box } from "grommet";

export default function Layout({ children }: any) {
  return (
    <Box justify="center" overflow="none" height={"100vh"}>
      <Box fill>
        <TopHeader />
        <Box flex="grow">{children}</Box>
        <BottomFooter />
      </Box>
    </Box>
  );
}
