import { Box, FileButton, MediaQuery, createStyles } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

import ActionIcon from "~/components/Shared/ActionIcon";

export type ImageFieldMobileControlsProps = {
  showedImage: string | null;
  onNewImage: (file: File) => void;
  onDeleteImage: () => void;
};

const useStyles = createStyles((theme) => ({
  mobileControls: {
    backgroundColor: theme.colors.cGray[0],
    padding: "0.5rem",
    position: "absolute",
    display: "flex",
    gap: theme.spacing.xs,
    top: "50%",
    right: "50%",
    borderRadius: theme.radius.sm,
    transform: "translate(50%, -50%)",
    opacity: 0.9,
  },
}));

const ImageFieldMobileControls: React.FC<ImageFieldMobileControlsProps> = ({
  showedImage,
  onNewImage,
  onDeleteImage,
}) => {
  const { classes } = useStyles();

  return (
    <MediaQuery largerThan="xs" styles={{ display: "none" }}>
      <Box className={classes.mobileControls}>
        <FileButton onChange={onNewImage} accept="image/png,image/jpeg">
          {(props) => (
            <ActionIcon {...props}>
              <IconPlus size={16} />
            </ActionIcon>
          )}
        </FileButton>

        {showedImage && (
          <ActionIcon onClick={onDeleteImage}>
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </Box>
    </MediaQuery>
  );
};

export default ImageFieldMobileControls;
