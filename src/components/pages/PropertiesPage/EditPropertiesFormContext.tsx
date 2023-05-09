import { createFormContext } from "@mantine/form";

export type EditPropertiesFormValues = {
  title: string;
  subtitle: string | null;
  image: File | null;
  deleteImage: boolean;
};

export const [
  EditPropertiesFormProvider,
  useEditPropertiesFormContext,
  useEditPropertiesForm,
] = createFormContext<EditPropertiesFormValues>();
