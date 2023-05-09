import {
  type DefaultMantineColor,
  type MantineTheme,
  type Tuple,
} from "@mantine/core";

import { roboto } from "./typography";

type ExtendedCustomColors =
  | "cGray"
  | "cPink"
  | "cEmerald"
  | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

export const theme = {
  fontFamily: roboto.style.fontFamily,
  colors: {
    cGray: [
      "#f2f2f2",
      "#d9d9d9",
      "#bfbfbf",
      "#a6a6a6",
      "#8c8c8c",
      "#737373",
      "#595959",
      "#404040",
      "#262626",
      "#0d0d0d",
    ] as Tuple<string, 10>,
    cPink: [
      "#fde7f0",
      "#fab8d3",
      "#f688b6",
      "#f35999",
      "#ef297c",
      "#d61062",
      "#a60c4c",
      "#770936",
      "#470521",
      "#18020b",
    ] as Tuple<string, 10>,
    cEmerald: [
      "#f7faeb",
      "#e7efc3",
      "#d7e49a",
      "#c7d972",
      "#b7cf4a",
      "#9eb530",
      "#7b8d26",
      "#58651b",
      "#353c10",
      "#353c10",
    ] as Tuple<string, 10>,
  },
  globalStyles: (t: MantineTheme) => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    body: {
      ...t.fn.fontStyles(),
      backgroundColor: t.colors.cGray[1],
    },
  }),
};
