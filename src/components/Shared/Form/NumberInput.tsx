import {
  NumberInput as MNumberInput,
  type NumberInputProps,
} from "@mantine/core";

const NumberInput: React.FC<NumberInputProps> = (props) => {
  return (
    <MNumberInput
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
      })}
      {...props}
    />
  );
};

export default NumberInput;
