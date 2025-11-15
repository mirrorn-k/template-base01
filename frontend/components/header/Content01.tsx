"use client";

import Menu from "@/components/menu/Main";
import Box from "@mui/material/Box";
import { MenuButton } from "@/atoms/Button";
import * as ContextMap from "@/contexts/MapData";

const Main = () => {
  const { menus, organize } = ContextMap.Contents();
  return (
    <>
      <Menu menus={menus} organizeName={organize?.organization_name || ""} />
      {/* モバイルナビゲーション */}
      <Box sx={{ display: { xs: "flex", md: "none" }, marginLeft: "auto" }}>
        <MenuButton />
      </Box>
    </>
  );
};
export default Main;
