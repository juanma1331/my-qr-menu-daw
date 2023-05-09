import { Box, Text } from "@mantine/core";
import { CldImage } from "next-cloudinary";

export type CurrentProductImageProps = {
  imageId: string;
};

const CurrentProductImage: React.FC<CurrentProductImageProps> = ({
  imageId,
}) => {
  return (
    <Box>
      <Text color="cGray.8" weight={500} size="sm">
        Imagen actual
      </Text>
      <CldImage
        src={imageId}
        width={150}
        height={150}
        alt="imagen del producto"
        priority
        style={{ borderRadius: "4px" }}
      />
    </Box>
  );
};

export default CurrentProductImage;
