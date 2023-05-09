import { Box, Divider, ScrollArea, Title, createStyles } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { getCldImageUrl } from "next-cloudinary";

import { josefinSans } from "~/styles/typography";
import VersionBrandLogo from "./VersionBrandLogo";
import VersionSection from "./VersionSection";
import VersionTitle from "./VersionTitle";

export type Product = {
  name: string;
  description: string | null;
  price: number;
  imageId: string;
};

export type Section = {
  name: string;
  products: Product[];
};

export type MenuVersion = {
  title: string;
  subtitle: string | null;
  bgImageId: string | null;
  sections: Section[];
};

export type VersionProps = {
  version: MenuVersion;
  top?: React.ReactNode | React.ReactNode;
};

const useStyles = createStyles(
  (theme, { imageId }: { imageId: string | null }) => ({
    root: { height: "100%" },
    brandLogo: {
      position: "absolute",
      width: "90%",
      height: "5%",
      top: "2rem",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      position: "absolute",
      top: "6rem",
      left: "50%",
      transform: "translateX(-47%)",
      zIndex: 3,
    },
    cartTitle: {
      fontFamily: josefinSans.style.fontFamily,
      color: theme.colors.cGray[4],
    },
    bgOverlay: {
      position: "absolute",
      width: "100%",
      height: "70vh",
      top: 0,
      left: 0,
      zIndex: 2,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    bgImage: {
      width: "100%",
      position: "absolute",
      zIndex: 1,
      height: "70vh",
      backgroundImage: imageId
        ? `url(${getCldImageUrl({ src: imageId })})`
        : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    sections: {
      position: "absolute",
      top: "18rem",
      left: "50%",
      zIndex: 2,
      transform: "translateX(-50%)",
      width: "70%",
      maxWidth: "50rem",
    },
    scrollArea: {
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
    },
  }),
);

const Version: React.FC<VersionProps> = ({ version, top }) => {
  const { classes } = useStyles({ imageId: version.bgImageId });

  return (
    <Box className={classes.root}>
      <Box className={classes.brandLogo}>
        <VersionBrandLogo />
        {top}
      </Box>

      <Box className={classes.title}>
        <VersionTitle title={version.title} subtitle={version.subtitle} />
      </Box>

      <Box className={classes.bgOverlay}></Box>
      <Box className={classes.sections}>
        <Title className={classes.cartTitle} order={2}>
          Nuestra carta
        </Title>

        <Divider color="cGray.4" h={20} />

        <ScrollArea
          type="auto"
          offsetScrollbars
          styles={(theme) => ({
            viewport: {
              height: 482,
              [theme.fn.largerThan("md")]: {
                height: 570,
              },
            },
            scrollbar: {
              "&, &:hover": {
                background: "transparent",
              },

              '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                backgroundColor: theme.colors.cEmerald[6],
              },
            },
          })}
        >
          <Box className={classes.scrollArea}>
            {version.sections.map((section) => (
              <VersionSection key={randomId()} section={section} />
            ))}
          </Box>
        </ScrollArea>
      </Box>

      <Box className={classes.bgImage}></Box>
    </Box>
  );
};

export default Version;
