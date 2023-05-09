import { Box, Text, createStyles, type MantineSize } from "@mantine/core";

import { sarpanch } from "~/styles/typography";

export type BrandLogoProps = {
  qrSize?: number;
  fontSize?: MantineSize;
};

const useStyles = createStyles(
  (theme, { fontSize }: { fontSize: MantineSize }) => ({
    box: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      borderRadius: theme.radius.sm,
    },
    text: {
      fontFamily: sarpanch.style.fontFamily,
      fontWeight: 500,
      fontSize: theme.fontSizes[fontSize],
      color: theme.colors.cGray[6],
    },
  }),
);

const BrandLogo: React.FC<BrandLogoProps> = ({
  qrSize = 28,
  fontSize = "sm",
}) => {
  const { classes } = useStyles({ fontSize });
  return (
    <Box className={classes.box}>
      <svg
        width={`${qrSize}`}
        height={`${qrSize}`}
        viewBox="0 0 183 139"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.375 46.375H61.125V0.125H0.375V46.375ZM10.5 7.83333H51V38.6667H10.5V7.83333ZM20.625 15.5417H40.875V30.9583H20.625V15.5417ZM121.875 46.375H182.625V0.125H121.875V46.375ZM132 7.83333H172.5V38.6667H132V7.83333ZM142.125 15.5417H162.375V30.9583H142.125V15.5417ZM0.375 138.875H61.125V92.625H0.375V138.875ZM10.5 100.333H51V131.167H10.5V100.333ZM20.625 108.042H40.875V123.458H20.625V108.042ZM172.5 123.458H182.625V138.875H162.375V115.75H172.5V123.458ZM172.5 100.333H182.625V108.042H172.5V100.333ZM172.5 92.625V100.333H162.375V92.625H172.5ZM71.25 108.042H81.375V138.875H71.25V108.042ZM30.75 54.0833V69.5H10.5V61.7917H0.375V54.0833H30.75ZM71.25 30.9583H81.375V38.6667H71.25V30.9583ZM101.625 7.83333V23.25H91.5V0.125H111.75V7.83333H101.625ZM71.25 7.83333H81.375V15.5417H71.25V7.83333ZM172.5 69.5H182.625V84.9167H162.375V77.2083H172.5V69.5ZM162.375 54.0833V61.7917H142.125V77.2083H121.875V69.5H132V54.0833H162.375ZM91.5 84.9167H81.375V77.2083H71.25V69.5H91.5V84.9167ZM152.25 100.333H162.375V108.042H152.25V100.333ZM172.5 61.7917V69.5H162.375V61.7917H172.5ZM81.375 84.9167V92.625H71.25V84.9167H81.375ZM142.125 123.458H152.25V138.875H132V123.458H142.125ZM111.75 123.458H121.875V131.167H111.75V138.875H91.5V131.167H101.625V123.458H111.75ZM111.75 115.75V108.042H132V115.75H111.75ZM111.75 77.2083H121.875V100.333H111.75V108.042H101.625V115.75H91.5V100.333H81.375V92.625H111.75V84.9167H101.625V77.2083H111.75ZM20.625 77.2083V84.9167H10.5V77.2083H20.625ZM142.125 108.042H132V100.333H142.125V108.042ZM152.25 92.625H132V84.9167H152.25V92.625ZM51 54.0833H61.125V61.7917H51V69.5H61.125V84.9167H51V77.2083H40.875V84.9167H30.75V69.5H40.875V54.0833H51ZM81.375 54.0833V38.6667H111.75V61.7917H91.5V54.0833H101.625V46.375H91.5V54.0833H81.375ZM81.375 23.25H91.5V30.9583H81.375V23.25ZM71.25 54.0833H81.375V61.7917H71.25V54.0833ZM101.625 30.9583V23.25H111.75V30.9583H101.625Z"
          fill="#F13985"
        />
      </svg>

      <Text className={classes.text}>MyQRMenu</Text>
    </Box>
  );
};

export default BrandLogo;
