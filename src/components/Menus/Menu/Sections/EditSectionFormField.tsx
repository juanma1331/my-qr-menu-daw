import React from "react";
import type { DraggableProvided } from "@hello-pangea/dnd";
import { ActionIcon, Center, Group, TextInput } from "@mantine/core";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";

import { useEditSectionsFormContext } from "./EditSectionsFormContext";

type EditSectionFormFieldProps = {
  editMode: boolean;
  index: number;
  draggableProps: DraggableProvided;
};

const EditSectionFormField: React.FC<EditSectionFormFieldProps> = ({
  index,
  editMode,
  draggableProps,
}) => {
  const form = useEditSectionsFormContext();

  return (
    <Group
      ref={draggableProps.innerRef}
      mt="xs"
      position="center"
      {...draggableProps.draggableProps}
    >
      <Center
        {...draggableProps.dragHandleProps}
        style={{
          visibility: editMode ? "visible" : "hidden",
        }}
      >
        <IconGripVertical size={18} />
      </Center>

      <TextInput
        placeholder="Bebidas"
        sx={{
          width: "70%",
          ":disabled": {
            opacity: 1,
          },
        }}
        disabled={!editMode}
        {...form.getInputProps(`sections.${index}.name`)}
      />

      <ActionIcon
        style={{
          visibility: editMode ? "visible" : "hidden",
        }}
        onClick={() => form.removeListItem("sections", index)}
      >
        <IconTrash size={18} />
      </ActionIcon>
    </Group>
  );
};

export default EditSectionFormField;
