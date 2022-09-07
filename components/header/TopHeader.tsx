import { Button, Header, Menu } from "grommet";
import { Home } from "grommet-icons";
import { useRouter } from "next/router";

function TopHeader() {
  const router = useRouter();
  return (
    <Header background="brand">
      <Button icon={<Home />} hoverIndicator onClick={() => router.push("/")} />
      <Menu label="account" items={[{ label: "logout" }]} />
    </Header>
  );
}

export default TopHeader;
