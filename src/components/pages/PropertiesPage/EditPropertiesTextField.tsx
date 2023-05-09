import { useState } from "react";
import {
  ActionIcon,
  CloseButton,
  Flex,
  createStyles,
  type TextInputProps,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";

import TextInput from "~/components/Shared/Form/TextInput";
import EditModeToggler from "./EditModeToggler";
import { useEditPropertiesFormContext } from "./EditPropertiesFormContext";

export interface EditPropertiesTextFieldProps extends TextInputProps {
  fieldName: string;
}

const useStyles = createStyles((theme) => ({
  input: {
    color: theme.colors.cGray[9],
    "&:disabled": {
      backgroundColor: "transparent",
      color: theme.colors.cGray[9],
      border: "none",
      opacity: 1,
    },
  },
  actionIcon: {
    "&:focus": {
      outline: `1px solid ${theme.colors.cPink[3]}`,
    },
  },
}));

const EditPropertiesTextField: React.FC<EditPropertiesTextFieldProps> = ({
  fieldName,
  label,
  ...rest
}) => {
  const { classes } = useStyles();
  const form = useEditPropertiesFormContext();
  const [editMode, setEditMode] = useState(false);

  return (
    <Flex justify="space-between" align="start">
      <TextInput
        classNames={{
          input: classes.input,
        }}
        w="80%"
        label={label}
        disabled={!editMode}
        error={form.errors[fieldName]}
        {...form.getInputProps(fieldName)}
        {...rest}
      />

      <EditModeToggler
        editMode={editMode}
        onEnterEditMode={() => setEditMode(true)}
        onExitEditMode={() => setEditMode(false)}
      />
    </Flex>
  );
};

export default EditPropertiesTextField;
