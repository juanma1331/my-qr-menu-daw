import { CldImage } from "next-cloudinary";

export type MenuImageProps = {
  menuImage: string;
};

const MenuImage: React.FC<MenuImageProps> = ({ menuImage }) => {
  return (
    <CldImage
      fill
      priority
      sizes="100vw"
      src={menuImage}
      alt="imagen del local al que pertenece el menú"
      effects={[
        {
          improve: true,
        },
      ]}
    />
  );
};

export default MenuImage;
