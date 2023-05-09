import { FileInput as MFileInput, type FileInputProps } from "@mantine/core";

const FileInput: React.FC<FileInputProps> = (props) => {
  return (
    <MFileInput
      sx={(theme) => ({
        button: {
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

export default FileInput;
