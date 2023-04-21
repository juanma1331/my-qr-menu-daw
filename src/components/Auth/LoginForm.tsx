import { Box, Button, Divider, Title } from "@mantine/core";
import { IconBrandDiscord } from "@tabler/icons-react";

type LoginFormProps = {
  onDiscordLogin: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onDiscordLogin }) => {
  return (
    <Box style={{ width: "90%", maxWidth: "300px" }}>
      <Title align="center" order={3}>
        Acceso a su cuenta
      </Title>
      <Divider
        labelPosition="center"
        my="sm"
        label="Acceda mediante autenticación externa"
      />
      <Button
        fullWidth
        variant="outline"
        onClick={() => onDiscordLogin()}
        leftIcon={<IconBrandDiscord />}
      >
        Discord
      </Button>
    </Box>
  );
};

export default LoginForm;
