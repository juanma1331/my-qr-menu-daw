import {
  Box,
  Button,
  FileInput,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconFileUpload } from "@tabler/icons-react";

import type { RouterOutputs } from "~/utils/api";
import { formatPrice } from "~/utils/client";
import { ACCEPTED_IMAGE_TYPES } from "~/server/procedures/constants";
import { createVersionWithNewProductFormSchema } from "~/server/procedures/create-version-with-new-product/create-version-with-new-product.schema";

type NewProductFormProps = {
  onSubmit: (product: NewProductFormValues) => void;
  sections: RouterOutputs["menus"]["getSectionsWithoutProducts"]["sections"];
  isLoading: boolean;
};

export type NewProductFormValues = {
  sectionId: number;
  product: {
    name: string;
    description: string | null;
    price: number;
    image: File | null;
  };
};

const NewProductForm: React.FC<NewProductFormProps> = ({
  onSubmit,
  sections,
  isLoading,
}) => {
  const form = useForm<NewProductFormValues>({
    initialValues: {
      sectionId: 0,
      product: {
        name: "",
        description: "",
        price: 0,
        image: null,
      },
    },
    validate: zodResolver(createVersionWithNewProductFormSchema),
  });

  const selectData = sections.map((s) => ({
    label: s.name,
    value: s.id.toString(),
  }));

  return (
    <Box component="form" onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Select
          label="Sección"
          placeholder="Elige la sección para tu producto"
          data={selectData}
          withAsterisk
          onChange={(e) => {
            if (!e) {
              return;
            }
            form.setFieldValue("sectionId", parseInt(e)); // TODO check if this is correct
          }}
          error={form.errors.sectionId}
        />
        <TextInput
          label="Nombre"
          placeholder="Cerveza"
          withAsterisk
          {...form.getInputProps("product.name")}
        />
        <TextInput
          label="Descripción"
          placeholder="Nuestra cerveza a su óptima temperatura"
          {...form.getInputProps("product.description")}
        />
        <NumberInput
          label="Precio"
          placeholder="1300"
          withAsterisk
          description={formatPrice(form.values.product.price)}
          step={100}
          {...form.getInputProps("product.price")}
        />
        <FileInput
          label="Imagen"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          placeholder="Elige una imagen para el producto"
          clearable
          withAsterisk
          rightSection={<IconFileUpload size={18} color="gray" />}
          {...form.getInputProps("product.image")}
        />

        <Button type="submit" loading={isLoading}>
          Añadir
        </Button>
      </Stack>
    </Box>
  );
};

export default NewProductForm;
