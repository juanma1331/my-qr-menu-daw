import { useRouter } from "next/router";
import { Box, Group, Stack } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconDeviceFloppy, IconFileUpload } from "@tabler/icons-react";

import type { RouterOutputs } from "~/utils/api";
import { formatPrice } from "~/utils/client";
import Button from "~/components/Shared/Button";
import FileInput from "~/components/Shared/Form/FileInput";
import NumberInput from "~/components/Shared/Form/NumberInput";
import SelectInput from "~/components/Shared/Form/SelectInput";
import TextInput from "~/components/Shared/Form/TextInput";
import { ACCEPTED_IMAGE_TYPES } from "~/server/procedures/constants";
import { createVersionWithEditedProductFormSchema } from "~/server/procedures/user/create-version-with-edited-product/create-version-with-edited-product.schema";
import CurrentProductImage from "./CurrentProductImage";

export type EditProductFormProps = {
  onSubmit: (product: EditProductFormValues) => void;
  sections: RouterOutputs["menus"]["getSectionsWithoutProducts"]["sections"];
  productData: RouterOutputs["menus"]["getProduct"];
};

export type EditProductFormValues = {
  sectionId: number;
  product: {
    name: string;
    description: string | null;
    price: number;
  };
  image: File | null;
};

const EditProductForm: React.FC<EditProductFormProps> = ({
  onSubmit,
  sections,
  productData,
}) => {
  const router = useRouter();
  const form = useForm<EditProductFormValues>({
    initialValues: {
      sectionId: productData.sectionId,
      product: {
        name: productData.product.name,
        description: productData.product.description,
        price: productData.product.price,
      },
      image: null,
    },
    validate: zodResolver(createVersionWithEditedProductFormSchema),
  });

  const selectData = sections.map((s) => {
    return {
      label: s.name,
      value: s.id.toString(),
    };
  });

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

        <CurrentProductImage imageId={productData.product.imageId} />

        <FileInput
          label="Nueva Imagen"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          placeholder="Elige una imagen para el producto"
          clearable
          withAsterisk
          rightSection={<IconFileUpload size={18} color="gray" />}
          {...form.getInputProps("product.image")}
        />

        <SelectInput
          label="Sección"
          placeholder="Elige la sección para tu producto"
          data={selectData}
          withAsterisk
          defaultValue={productData.sectionId.toString()}
          onChange={(e) => {
            if (!e) {
              return;
            }
            form.setFieldValue("sectionId", parseInt(e)); // TODO check if this is correct
          }}
          error={form.errors.sectionId}
        />

        <Group position="right">
          <Button onClick={() => router.back()} vr="neutral" size="sm">
            Atrás
          </Button>

          {form.isDirty() && (
            <Button
              type="submit"
              size="sm"
              rightIcon={<IconDeviceFloppy size={16} />}
            >
              Guardar
            </Button>
          )}
        </Group>
      </Stack>
    </Box>
  );
};

export default EditProductForm;
