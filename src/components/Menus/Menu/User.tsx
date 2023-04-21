import { Group, Avatar, Text, createStyles, Box } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
  },
}));

type UserProps = {
  user: {
    email?: string;
    name?: string;
    image?: string;
  };
};

const User: React.FC<UserProps> = ({ user }) => {
  const { classes } = useStyles();

  if (!user.name || !user.email || !user.image) {
    return (
      <Box className={classes.user}>
        <Avatar radius="xl" />
      </Box>
    );
  }

  return (
    <Box className={classes.user}>
      <Group>
        {user.image ? (
          <Avatar src={user.image} radius="xl" alt="user image" />
        ) : (
          <Avatar radius="xl" alt="user image">
            {user.name[0]}
          </Avatar>
        )}

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {user.name}
          </Text>

          <Text color="dimmed" size="xs">
            {user.email}
          </Text>
        </div>
      </Group>
    </Box>
  );
};

export default User;
