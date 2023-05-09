import {
  TextInput as MTextInput,
  type TextInputProps as MTextInputProps,
} from "@mantine/core";

export interface TextInputProps extends MTextInputProps {
  labelAlign?: "left" | "center" | "right";
}

const TextInput: React.FC<TextInputProps> = ({
  labelAlign = "left",
  ...rest
}) => {
  const align =
    labelAlign === "left"
      ? "start"
      : labelAlign === "center"
      ? "center"
      : "end";

  return (
    <MTextInput
      sx={(theme) => ({
        input: {
          color: theme.colors.cGray[7],
          "&:focus": {
            borderColor: theme.colors.cPink[2],
          },
        },
        error: {
          backgroundColor: theme.colors.red[1],
        },
        label: {
          display: "flex",
          justifyContent: align,
          alignItems: "center",
        },
      })}
      {...rest}
    />
  );
};

export default TextInput;
