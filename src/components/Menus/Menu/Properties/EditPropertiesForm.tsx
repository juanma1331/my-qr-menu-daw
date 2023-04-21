import Image from "next/image";
import {
  ActionIcon,
  Box,
  Button,
  FileButton,
  FileInput,
  Group,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconFileUpload } from "@tabler/icons-react";
import { CldImage } from "next-cloudinary";

import type { RouterOutputs } from "~/utils/api";
import { createVersionWithPropertiesFormSchema } from "~/server/procedures/create-version-with-new-properties/create-version-with-new-properties.schema";

type MenuProperties = RouterOutputs["menus"]["getMenuProperties"]["properties"];

export type EditPropertiesFormValues = {
  properties: {
    title: string;
    subtitle: string | null;
    image: File | null;
    deleteImage: boolean;
  };
};

export type EditPropertiesFormProps = {
  properties: MenuProperties;
  editMode: boolean;
  onEdit: (properties: EditPropertiesFormValues) => void;
};

const EditPropertiesForm: React.FC<EditPropertiesFormProps> = ({
  editMode,
  onEdit,
  properties,
}) => {
  const theme = useMantineTheme();
  const form = useForm<EditPropertiesFormValues>({
    initialValues: {
      properties: {
        title: properties.title,
        subtitle: properties.subtitle || "",
        image: null,
        deleteImage: false,
      },
    },
    validate: zodResolver(createVersionWithPropertiesFormSchema),
  });

  return (
    <Box component="form" onSubmit={form.onSubmit(onEdit)}>
      <Stack>
        <TextInput
          label="Título"
          disabled={!editMode}
          {...form.getInputProps("properties.title")}
        />

        <TextInput
          label="Subtítulo"
          disabled={!editMode}
          placeholder="Sin Subtítulo"
          {...form.getInputProps("properties.subtitle")}
        />

        <Group>
          {properties.image && (
            <>
              <Text size={14} weight={500}>
                Imagen
              </Text>
              <CldImage
                src={
                  form.values.properties.image
                    ? URL.createObjectURL(form.values.properties.image)
                    : properties.image
                }
                alt="La imagen del restaurante o local"
                width={174}
                height={100}
                style={{
                  borderRadius: theme.radius.sm,
                  filter: editMode ? "none" : "brightness(0.5)",
                }}
              />

              <FileButton
                onChange={(file) =>
                  form.setFieldValue("properties.image", file)
                }
                accept="image/png,image/jpeg"
              >
                {(props) => (
                  <ActionIcon
                    style={{ marginTop: theme.spacing.sm }}
                    disabled={!editMode}
                    color="blue"
                  >
                    <IconFileUpload size={18} {...props} />
                  </ActionIcon>
                )}
              </FileButton>

              <Button
                onClick={() => {
                  form.setFieldValue("properties.deleteImage", true);
                }}
              >
                Eliminar
              </Button>
            </>
          )}

          {!properties.image && (
            <FileInput
              w="100%"
              label="Imagen"
              disabled={!editMode}
              placeholder="Imagen principal para el menú"
              {...form.getInputProps("properties.image")}
            />
          )}
        </Group>

        {form.isDirty() && <Button type="submit">Guardar Cambios</Button>}
      </Stack>
    </Box>
  );
};

export default EditPropertiesForm;
