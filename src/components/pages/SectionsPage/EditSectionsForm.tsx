import { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Box, Center, Group, Space, Text } from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";

import type { RouterOutputs } from "~/utils/api";
import Button from "~/components/Shared/Button";
import { createVersionWithSectionsInputSchema } from "~/server/procedures/user/create-version-with-sections/create-version-with-sections.schema";
import EditSectionFormField from "./EditSectionFormField";
import {
  EditSectionsFormProvider,
  useEditSectionsForm,
  type EditSectionsFormValues,
} from "./EditSectionsFormContext";

export type EditSectionFormProps = {
  sections: RouterOutputs["menus"]["getSectionsWithoutProducts"]["sections"];
  onEdit: (newSections: EditSectionsFormValues) => void;
};

const sectionsSchema = createVersionWithSectionsInputSchema.omit({
  menuId: true,
});

const EditSectionForm: React.FC<EditSectionFormProps> = ({
  sections,
  onEdit,
}) => {
  const form = useEditSectionsForm({
    initialValues: {
      sections,
    } as EditSectionsFormValues,
    validate: zodResolver(sectionsSchema),
  });

  // Actualizamos los valores del formulario manualmente ya que no se actualiza automáticamente cuando cambian las secciones
  useEffect(() => {
    form.setValues({
      sections,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  const addNewSection = () => {
    form.insertListItem("sections", {
      name: "",
      id: null,
    });
  };

  const fields = form.values.sections.map(
    (s: { name: string; id: number }, index: number) => (
      <Draggable key={index} index={index} draggableId={index.toString()}>
        {(provided) => (
          <EditSectionFormField draggableProps={provided} index={index} />
        )}
      </Draggable>
    ),
  );

  return (
    <EditSectionsFormProvider form={form}>
      <Box component="form" onSubmit={form.onSubmit(onEdit)}>
        <Group position="center">
          <Button
            size="sm"
            vr="neutral"
            rightIcon={<IconPlus size={16} />}
            onClick={addNewSection}
          >
            Nueva sección
          </Button>
        </Group>

        <Space h="lg" />

        <DragDropContext
          onDragEnd={({ destination, source }) => {
            form.reorderListItem("sections", {
              from: source.index,
              to: destination ? destination.index : source.index,
            });
          }}
        >
          <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {form.isDirty() && (
          <>
            <Space h="lg" />

            <Group position="right">
              <Button
                variant="outline"
                size="xs"
                vr="neutral"
                onClick={form.reset}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="xs"
                color="cPink.3"
                rightIcon={<IconDeviceFloppy size={16} />}
              >
                Guardar
              </Button>
            </Group>
          </>
        )}

        {form.values.sections.length === 0 && (
          <Center h="200px">
            <Text size="md" color="cGray.3">
              Este menú no tiene secciones
            </Text>
          </Center>
        )}
      </Box>
    </EditSectionsFormProvider>
  );
};

export default EditSectionForm;
