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
import { IconFileUpload } from "@tabler/icons";
import { ACCEPTED_IMAGE_TYPES } from "../../../../constants";
import {
  CreateVersionWithNewProductInput,
  createVersionWithNewProductInputSchema,
} from "../../../../server/procedures/menus/create-version-with-new-product/create-version-with-new-product.schema";
import { RouterOutputs } from "../../../../utils/trpc";
import { formatPrice } from "../../../../utils/utils";

type NewProductFormProps = {
  onSubmit: (product: NewProductInitialValues) => void;
  sections: RouterOutputs["menus"]["getLatestVersionSections"]["sections"];
};

export type NewProductInitialValues = {
  product: CreateVersionWithNewProductInput["product"];
};

const productSchema = createVersionWithNewProductInputSchema.omit({
  menuId: true,
  sectionId: true,
});

const NewProductForm: React.FC<NewProductFormProps> = ({
  onSubmit,
  sections,
}) => {
  const form = useForm<NewProductInitialValues>({
    initialValues: {
      product: {
        name: "",
        description: "",
        price: 0,
        sectionId: "",
        image: null,
      },
    },
    validate: zodResolver(productSchema),
  });

  const selectData = sections.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  return (
    <Box component="form" onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Select
          label="Sección"
          placeholder="Elige la sección para tu producto"
          data={selectData}
          {...form.getInputProps("product.sectionId")}
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

        <Button type="submit">Añadir</Button>
      </Stack>
    </Box>
  );
};

export default NewProductForm;
