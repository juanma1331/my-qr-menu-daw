import { Box, Group, ActionIcon, Title, Space } from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { IconPlus, IconDeviceFloppy } from "@tabler/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { createVersionWithSectionsInputSchema } from "../../../../server/procedures/menus/create-version-with-sections/create-version-with-sections.schema";
import { RouterOutputs } from "../../../../utils/trpc";
import EditSectionFormField from "./EditSectionFormField";
import {
  EditSectionsFormProvider,
  type EditSectionsFormValues,
  useEditSectionsForm,
} from "./EditSectionsFormContext";

export type EditSectionFormProps = {
  sections: RouterOutputs["menus"]["getLatestVersionSections"]["sections"];
  editMode: boolean;
  onEdit: (newSections: EditSectionsFormValues) => void;
};

const sectionsSchema = createVersionWithSectionsInputSchema.omit({
  menuId: true,
});

const EditSectionForm: React.FC<EditSectionFormProps> = ({
  sections,
  editMode,
  onEdit,
}) => {
  const form = useEditSectionsForm({
    initialValues: {
      sections,
    } as EditSectionsFormValues,
    validate: zodResolver(sectionsSchema),
  });

  const addNewSection = () => {
    form.insertListItem("sections", {
      name: "",
      id: null,
    });
  };

  const fields = form.values.sections.map((_: any, index: number) => (
    <Draggable
      key={index}
      index={index}
      draggableId={index.toString()}
      isDragDisabled={!editMode}
    >
      {(provided) => (
        <EditSectionFormField
          draggableProps={provided}
          index={index}
          editMode={editMode}
        />
      )}
    </Draggable>
  ));

  return (
    <EditSectionsFormProvider form={form}>
      <Box component="form" onSubmit={form.onSubmit(onEdit)}>
        <Group position="apart">
          <Title order={2}>Secciones</Title>

          <Group
            sx={(theme) => ({
              border: `1px solid ${theme.colors.gray[3]}`,
              borderRadius: theme.radius.sm,
              paddingTop: "0.2rem",
              paddingBottom: "0.2rem",
              paddingLeft: theme.spacing.xs,
              paddingRight: theme.spacing.xs,
              visibility: editMode ? "visible" : "hidden",
            })}
          >
            <ActionIcon onClick={addNewSection} color="blue">
              <IconPlus color="gray" size={20} />
            </ActionIcon>

            {form.isDirty() && (
              <ActionIcon color="blue" type="submit">
                <IconDeviceFloppy color="gray" size={20} />
              </ActionIcon>
            )}
          </Group>
        </Group>

        <Space h="xs" />

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

        {/* <Text size="sm" weight={500} mt="md">
          Form values:
        </Text>
        <Code block>{JSON.stringify(form.values, null, 2)}</Code>
        <Code block>{JSON.stringify(form.errors, null, 2)}</Code> */}
      </Box>
    </EditSectionsFormProvider>
  );
};

export default EditSectionForm;
