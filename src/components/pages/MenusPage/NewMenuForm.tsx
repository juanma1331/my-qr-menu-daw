import { Paper, Stack } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

import type { RouterInputs } from "~/utils/api";
import { createMenuAndVersionSchema } from "~/server/procedures/user/create-menu-and-version/create-menu-and-version.schema";
import Button from "../../Shared/Button";
import TextInput from "../../Shared/Form/TextInput";

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
        <TextInput
          label="Título"
          aria-label="Título del menú"
          withAsterisk
          error={form.errors.title}
          {...form.getInputProps("title")}
        />

        <Button ml="auto" type="submit">
          Crear
        </Button>
      </Stack>
    </Paper>
  );
};

export default NewMenuForm;
