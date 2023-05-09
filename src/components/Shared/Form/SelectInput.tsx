import {
  Select as MSelect,
  type SelectProps as MSelectProps,
} from "@mantine/core";

export interface SelectProps extends MSelectProps {
  labelAlign?: "left" | "center" | "right";
}

const SelectInput: React.FC<SelectProps> = ({
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
    <MSelect
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

export default SelectInput;
