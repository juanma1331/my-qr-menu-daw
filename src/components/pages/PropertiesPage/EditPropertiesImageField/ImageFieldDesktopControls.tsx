import { FileButton, MediaQuery, Stack } from "@mantine/core";

import Button from "~/components/Shared/Button";

export type ImageFieldDesktopControlsProps = {
  showedImage: string | null;
  onNewImage: (file: File) => void;
  onDeleteImage: () => void;
};

const ImageFieldDesktopControls: React.FC<ImageFieldDesktopControlsProps> = ({
  showedImage,
  onNewImage,
  onDeleteImage,
}) => {
  return (
    <MediaQuery
      smallerThan="xs"
      styles={{
        display: "none",
      }}
    >
      <Stack style={{ alignSelf: "center" }}>
        <FileButton onChange={onNewImage} accept="image/png,image/jpeg">
          {(props) => (
            <Button size="xs" variant="outline" {...props}>
              Nueva imagen
            </Button>
          )}
        </FileButton>

        {showedImage && (
          <Button vr="neutral" size="xs" onClick={onDeleteImage}>
            Eliminar
          </Button>
        )}
      </Stack>
    </MediaQuery>
  );
};

export default ImageFieldDesktopControls;
