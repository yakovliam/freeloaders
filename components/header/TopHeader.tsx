import { Box, Button, Header, Menu } from "grommet";
import { Dashboard, Home } from "grommet-icons";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";

function TopHeader() {
  const router = useRouter();
  const user = useUser();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/enter");
    router.reload();
  };

  return (
    <Header background="brand">
      <Button icon={<Home />} hoverIndicator onClick={() => router.push("/")} />
      {user && (
        <Box direction="row">
          <Button
            icon={<Dashboard />}
            onClick={() => {
              router.push("/dashboard");
            }}
          />
          <Menu
            label={user.email?.substring(0, user.email?.indexOf("@"))}
            items={[{ label: "logout", onClick: signOut }]}
          />
        </Box>
      )}
    </Header>
  );
}

export default TopHeader;
