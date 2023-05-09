import React from "react";
import type { DraggableProvided } from "@hello-pangea/dnd";
import { ActionIcon, Center, Group, createStyles } from "@mantine/core";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";

import TextInput from "~/components/Shared/Form/TextInput";
import { useEditSectionsFormContext } from "./EditSectionsFormContext";

export type EditSectionFormFieldProps = {
  index: number;
  draggableProps: DraggableProvided;
};

const useStyles = createStyles((theme) => ({
  trash: {
    "&:focus": {
      outline: `1px solid ${theme.colors.cPink[3]}`,
    },
  },
}));

const EditSectionFormField: React.FC<EditSectionFormFieldProps> = ({
  index,
  draggableProps,
}) => {
  const { classes } = useStyles();
  const form = useEditSectionsFormContext();

  return (
    <Group
      ref={draggableProps.innerRef}
      mt="xs"
      position="center"
      {...draggableProps.draggableProps}
    >
      <Center {...draggableProps.dragHandleProps}>
        <IconGripVertical focusable={false} size={18} />
      </Center>

      <TextInput
        placeholder="Bebidas"
        w="70%"
        {...form.getInputProps(`sections.${index}.name`)}
      />

      <ActionIcon
        className={classes.trash}
        onClick={() => form.removeListItem("sections", index)}
      >
        <IconTrash size={18} />
      </ActionIcon>
    </Group>
  );
};

export default EditSectionFormField;
