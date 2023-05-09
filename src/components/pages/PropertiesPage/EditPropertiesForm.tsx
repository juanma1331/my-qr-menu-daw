import { useState } from "react";
import { Box, Group, Stack } from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { IconDeviceFloppy } from "@tabler/icons-react";

import type { RouterOutputs } from "~/utils/api";
import Button from "~/components/Shared/Button";
import { createVersionWithPropertiesFormSchema } from "~/server/procedures/user/create-version-with-new-properties/create-version-with-new-properties.schema";
import {
  EditPropertiesFormProvider,
  useEditPropertiesForm,
  type EditPropertiesFormValues,
} from "./EditPropertiesFormContext";
import EditPropertiesImageField from "./EditPropertiesImageField/EditPropertiesImageField";
import EditPropertiesTextField from "./EditPropertiesTextField";

export type MenuProperties =
  RouterOutputs["menus"]["getMenuProperties"]["properties"];

export type EditPropertiesFormProps = {
  properties: MenuProperties;
  onEdit: (properties: EditPropertiesFormValues) => void;
};

const EditPropertiesForm: React.FC<EditPropertiesFormProps> = ({
  onEdit,
  properties,
}) => {
  const form = useEditPropertiesForm({
    initialValues: {
      title: properties.title,
      subtitle: properties.subtitle || "",
      image: null,
      deleteImage: false,
    },
    validate: zodResolver(createVersionWithPropertiesFormSchema),
  });
  const [showedImage, setShowedImage] = useState<string | null>(
    properties.image,
  );

  const handleOnCancel = () => {
    form.reset();
    setShowedImage(properties.image);
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(onEdit)}>
      <EditPropertiesFormProvider form={form}>
        <Stack spacing="lg">
          <EditPropertiesTextField
            withAsterisk
            fieldName="title"
            label="Título"
          />

          <EditPropertiesTextField
            fieldName="subtitle"
            label="Subtítulo"
            placeholder="Sin subtítulo"
          />

          <EditPropertiesImageField
            showedImage={showedImage}
            setShowedImage={setShowedImage}
          />

          {form.isDirty() && (
            <Group position="right">
              <Button vr="neutral" onClick={handleOnCancel}>
                Cancelar
              </Button>
              <Button type="submit" rightIcon={<IconDeviceFloppy size={16} />}>
                Guardar
              </Button>
            </Group>
          )}
        </Stack>
      </EditPropertiesFormProvider>
    </Box>
  );
};

export default EditPropertiesForm;
