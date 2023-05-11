import { Paper, Slider, Stack } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

import Button from "~/components/Shared/Button";
import { editUserMenuCreationLimitFormSchema } from "~/server/procedures/admin/edit-user-menu-creation-limit/edit-user-menu-creation-limit.schema";

export type MenuCreationLimitFormProps = {
  actualLimit: number;
  onSubmit: (formValues: MenuCreationLimitFormValues) => void;
};

export type MenuCreationLimitFormValues = {
  limit: number;
};

const MenuCreationLimitForm: React.FC<MenuCreationLimitFormProps> = ({
  actualLimit,
  onSubmit,
}) => {
  const form = useForm<MenuCreationLimitFormValues>({
    initialValues: {
      limit: actualLimit,
    },
    validate: zodResolver(editUserMenuCreationLimitFormSchema),
  });

  return (
    <Paper component="form" onSubmit={form.onSubmit(onSubmit)}>
      <Stack
        spacing="xl"
        style={{
          marginTop: "2rem",
        }}
      >
        <Slider
          labelAlwaysOn
          styles={(theme) => ({
            label: {
              color: theme.colors.yellow[7],
            },
          })}
          marks={[
            { value: 0, label: "0" },
            { value: 5, label: "5" },
            { value: 10, label: "10" },
            { value: 15, label: "15" },
            { value: 20, label: "20" },
          ]}
          max={20}
          {...form.getInputProps("limit")}
        />
        <Button type="submit">Modificar</Button>
      </Stack>
    </Paper>
  );
};

export default MenuCreationLimitForm;
