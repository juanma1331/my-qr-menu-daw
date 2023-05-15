import { useRouter } from "next/router";
import { Box, Group, Stack } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconFileUpload } from "@tabler/icons-react";

import type { RouterOutputs } from "~/utils/api";
import { formatPrice } from "~/utils/client";
import Button from "~/components/Shared/Button";
import FileInput from "~/components/Shared/Form/FileInput";
import NumberInput from "~/components/Shared/Form/NumberInput";
import SelectInput from "~/components/Shared/Form/SelectInput";
import TextInput from "~/components/Shared/Form/TextInput";
import { ACCEPTED_IMAGE_TYPES } from "~/server/procedures/constants";
import { createVersionWithNewProductFormSchema } from "~/server/procedures/user/create-version-with-new-product/create-version-with-new-product.schema";

export type NewProductFormProps = {
  onSubmit: (product: NewProductFormValues) => void;
  sections: RouterOutputs["menus"]["getSectionsWithoutProducts"]["sections"];
};

export type NewProductFormValues = {
  sectionId: number;
  product: {
    name: string;
    description: string | null;
    price: number;
  };
  image: File | null;
};

const NewProductForm: React.FC<NewProductFormProps> = ({
  onSubmit,
  sections,
}) => {
  const router = useRouter();
  const form = useForm<NewProductFormValues>({
    initialValues: {
      sectionId: 0,
      product: {
        name: "",
        description: "",
        price: 100,
      },
      image: null,
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
          {...form.getInputProps("image")}
        />

        <SelectInput
          label="Sección"
          placeholder="Elige la sección para tu producto"
          data={selectData}
          withAsterisk
          onChange={(e) => {
            if (!e) {
              return;
            }
            form.setFieldValue("sectionId", parseInt(e)); // TODO check
          }}
          error={form.errors.sectionId}
        />

        <Group>
          <Button
            onClick={() => router.back()}
            vr="neutral"
            ml="auto"
            size="sm"
          >
            Atrás
          </Button>

          <Button type="submit" size="sm">
            Añadir
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default NewProductForm;
