import { useState } from "react";
import { Box, Flex, Text, useMantineTheme } from "@mantine/core";
import { CldImage } from "next-cloudinary";

import EditModeToggler from "../EditModeToggler";
import { useEditPropertiesFormContext } from "../EditPropertiesFormContext";
import ImageFieldDesktopControls from "./ImageFieldDesktopControls";
import ImageFieldMobileControls from "./ImageFieldMobileControls";

export type EditPropertiesImageFieldProps = {
  showedImage: string | null;
  setShowedImage: (image: string | null) => void;
};

const EditPropertiesImageField: React.FC<EditPropertiesImageFieldProps> = ({
  showedImage,
  setShowedImage,
}) => {
  const form = useEditPropertiesFormContext();
  const theme = useMantineTheme();
  const [editMode, setEditMode] = useState(false);

  const handleDeleteImage = () => {
    form.setFieldValue("deleteImage", true);
    form.setFieldValue("image", null);
    setShowedImage(null);
  };

  const handleNewImage = (file: File) => {
    form.setFieldValue("image", file);
    setShowedImage(URL.createObjectURL(file));
  };

  return (
    <Flex justify="space-between" align="start">
      <Flex direction="column" gap="md">
        <Text size={14} weight={500}>
          Imagen
        </Text>
        <Box sx={{ position: "relative" }}>
          {showedImage ? (
            <CldImage
              src={
                form.values.image
                  ? URL.createObjectURL(form.values.image)
                  : showedImage
              }
              alt="La imagen del restaurante o local"
              height={174}
              width={348}
              effects={[
                {
                  improve: true,
                },
              ]}
              style={{
                borderRadius: theme.radius.sm,
              }}
            />
          ) : (
            <Flex
              justify="center"
              align="end"
              style={{
                borderRadius: theme.radius.sm,
                color: theme.colors.cGray[5],
              }}
              h="174px"
              w="348px"
              bg="cGray.1"
            >
              Sin imagen
            </Flex>
          )}

          {editMode && (
            <ImageFieldMobileControls
              showedImage={showedImage}
              onDeleteImage={handleDeleteImage}
              onNewImage={handleNewImage}
            />
          )}
        </Box>
      </Flex>

      {editMode && (
        <ImageFieldDesktopControls
          showedImage={showedImage}
          onDeleteImage={handleDeleteImage}
          onNewImage={handleNewImage}
        />
      )}

      <EditModeToggler
        editMode={editMode}
        onEnterEditMode={() => setEditMode(true)}
        onExitEditMode={() => setEditMode(false)}
      />
    </Flex>
  );
};

export default EditPropertiesImageField;
