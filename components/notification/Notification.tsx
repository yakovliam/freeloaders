import { Box, Button, Text } from "grommet";
import { Close } from "grommet-icons";

export type NotificationProps = {
  type: NotificationType;
  message: string;
  closeNotification: () => void;
};

export type BackgroundForegroundColorPair = {
  background: string;
  foreground: string;
};

export type NotificationType = "error" | "success" | "info";

function Notification(props: NotificationProps) {
  const determineColor = (): BackgroundForegroundColorPair => {
    if (props.type === "error") {
      return {
        background: "status-error",
        foreground: "light-1",
      };
    } else if (props.type === "info") {
      return {
        background: "status-warning",
        foreground: "dark-1",
      };
    } else {
      return {
        background: "status-ok",
        foreground: "light-1",
      };
    }
  };

  return (
    <Box
      direction="row"
      round="small"
      pad={"small"}
      align="center"
      background={determineColor().background}
    >
      <Text color={determineColor().foreground}>{props.message}</Text>
      <Button icon={<Close />} onClick={props.closeNotification} />
    </Box>
  );
}

export default Notification;
