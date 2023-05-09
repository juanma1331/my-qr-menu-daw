import type { PropsWithChildren } from "react";
import { Box, Popover, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export type PopOverProps = PropsWithChildren & {
  width?: number | string;
  text: string;
  textSize?: "xs" | "sm" | "md" | "lg" | "xl";
  position?:
    | "bottom"
    | "left"
    | "right"
    | "top"
    | "bottom-end"
    | "bottom-start"
    | "left-end"
    | "left-start"
    | "right-end"
    | "right-start"
    | "top-end"
    | "top-start";
};

const PopOver: React.FC<PopOverProps> = ({
  children,
  width,
  text,
  textSize,
  position,
}) => {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover
      width={width ?? 200}
      position={position ?? "bottom"}
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <Box onMouseEnter={open} onClick={close} onMouseLeave={close}>
          {children}
        </Box>
      </Popover.Target>
      <Popover.Dropdown sx={{ pointerEvents: "none" }}>
        <Text size={textSize ?? "sm"}>{text}</Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default PopOver;
