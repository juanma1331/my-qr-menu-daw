import { Grid } from "@mantine/core";
import { randomId } from "@mantine/hooks";

import type { RouterOutputs } from "~/utils/api";
import MenusGridItem from "./Item/MenusGridItem";

export type MenusProps = RouterOutputs["menus"]["getMenusInfo"] & {
  onRemove: (menuId: string) => void;
};

const MenusGrid: React.FC<MenusProps> = ({ menus, onRemove }) => {
  return (
    <Grid>
      {menus.map((m) => (
        <Grid.Col sm={6} md={4} lg={3} key={randomId()}>
          <MenusGridItem key={m.menuId} menu={m} onRemove={onRemove} />
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default MenusGrid;
