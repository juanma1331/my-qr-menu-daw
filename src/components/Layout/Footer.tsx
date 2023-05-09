import { Footer as MFooter, Text } from "@mantine/core";

export type FooterProps = {
  style?: React.CSSProperties;
};

const Footer: React.FC<FooterProps> = ({ style }) => {
  return (
    <MFooter
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
      height={40}
    >
      <Text size="xs" color="cPink.2">
        MyQrMenu @ All Rights Reserved 2023
      </Text>
    </MFooter>
  );
};

export default Footer;
