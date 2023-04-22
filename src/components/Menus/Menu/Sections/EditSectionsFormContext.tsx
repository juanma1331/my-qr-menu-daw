import { createFormContext } from "@mantine/form";

import type { RouterOutputs } from "~/utils/api";

export type EditSectionsFormValues = {
  sections: RouterOutputs["menus"]["createVersionWithSections"]["sections"];
};

export const [
  EditSectionsFormProvider,
  useEditSectionsFormContext,
  useEditSectionsForm,
] = createFormContext<EditSectionsFormValues>();
