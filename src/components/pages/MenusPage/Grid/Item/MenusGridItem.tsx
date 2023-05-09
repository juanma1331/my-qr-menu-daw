import { Card, Space } from "@mantine/core";

import type { RouterOutputs } from "~/utils/api";
import MenuActions from "./MenuActions";
import MenuImage from "./MenuImage";
import MenuInfo from "./MenuInfo";
import MenuTitle from "./MenuTitle";
import NoMenuImage from "./NoMenuImage";

export type MenusGridItemProps = {
  menu: RouterOutputs["menus"]["getMenusInfo"]["menus"][0];
  onRemove: (menuId: string) => void;
};

const MenusGridItem: React.FC<MenusGridItemProps> = ({ menu, onRemove }) => {
  return (
    <Card shadow="md" radius="sm" withBorder>
      <Card.Section
        style={{
          position: "relative",
          height: "200px",
        }}
      >
        {menu.menuImage !== null ? (
          <MenuImage menuImage={menu.menuImage} />
        ) : (
          <NoMenuImage />
        )}
      </Card.Section>

      <Space m="md" />

      <MenuTitle title={menu.title} isPublic={menu.isPublic} />

      <Space m="sm" />

      <MenuInfo sections={menu.sections} products={menu.products} />

      <Space m="sm" />

      <MenuActions
        menuId={menu.menuId}
        onRemove={onRemove}
        qrImageId={menu.qrImage}
      />
    </Card>
  );
};

export default MenusGridItem;
