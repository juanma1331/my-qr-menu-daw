import { Button, Paper, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

import type { RouterInputs } from "~/utils/api";
import { createMenuAndVersionSchema } from "~/server/procedures/create-menu-and-version/create-menu-and-version.schema";

export type NewMenu = RouterInputs["menus"]["createMenuAndVersion"];

const NewMenuForm: React.FC<{ onNew: (menu: NewMenu) => void }> = ({
  onNew,
}) => {
  const form = useForm<NewMenu>({
    initialValues: {
      title: "",
    },
    validate: zodResolver(createMenuAndVersionSchema),
  });

  return (
    <Paper
      component="form"
      onSubmit={form.onSubmit(onNew)}
      p="sm"
      style={{ width: "100%" }}
    >
      <Stack>
        <TextInput label="Título" {...form.getInputProps("title")} />

        <Button type="submit">Crear</Button>
      </Stack>
    </Paper>
  );
};

export default NewMenuForm;
