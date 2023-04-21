import { createFormContext } from "@mantine/form";
import { createVersionWithSectionsInputSchema } from "../../../../server/procedures/menus/create-version-with-sections/create-version-with-sections.schema";

export type EditSectionsFormValues = {
  sections: CreateVersionWithSectionsInputSchema["sections"];
};

// You can give context variables any name
export const [
  EditSectionsFormProvider,
  useEditSectionsFormContext,
  useEditSectionsForm,
] = createFormContext<EditSectionsFormValues>();
