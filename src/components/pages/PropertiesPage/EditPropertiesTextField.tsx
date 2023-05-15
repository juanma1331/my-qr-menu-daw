import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Title,
  createStyles,
  type TextInputProps,
} from "@mantine/core";

import TextInput from "~/components/Shared/Form/TextInput";
import EditModeToggler from "./EditModeToggler";
import { useEditPropertiesFormContext } from "./EditPropertiesFormContext";

export interface EditPropertiesTextFieldProps extends TextInputProps {
  fieldName: string;
}

const useStyles = createStyles((theme) => ({
  noEditTitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.cGray[7],
    fontWeight: 500,
  },
  noEditText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.cGray[5],
    paddingLeft: theme.spacing.sm,
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
      {editMode ? (
        <TextInput
          w="80%"
          label={label}
          error={form.errors[fieldName]}
          {...form.getInputProps(fieldName)}
          {...rest}
        />
      ) : (
        <Box>
          <Title className={classes.noEditTitle} order={4}>
            {label}
          </Title>
          <Text lineClamp={1} className={classes.noEditText}>
            {/* @ts-expect-error FIX */}
            {form.values[fieldName] ?? ""}
          </Text>
        </Box>
      )}

      <EditModeToggler
        editMode={editMode}
        onEnterEditMode={() => setEditMode(true)}
        onExitEditMode={() => setEditMode(false)}
      />
    </Flex>
  );
};

export default EditPropertiesTextField;
