import type { PropsWithChildren } from "react";
import { Title, type TitleProps } from "@mantine/core";

const PageSectionTitle: React.FC<PropsWithChildren<TitleProps>> = ({
  children,
  ...rest
}) => {
  return (
    <Title color="cGray.8" order={2} {...rest}>
      {children}
    </Title>
  );
};

export default PageSectionTitle;
