import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import * as ContextCommon from "@/contexts/Common";

/**
 * 一般的なバーガーメニュー
 * @returns
 */
export const MainMenuButton = () => {
  const { flgMenus, setFlgMenus } = ContextCommon.useContents();
  return (
    <IconButton
      size="large"
      edge="end"
      aria-label="menu"
      sx={{ color: "inherit", backgroundColor: "transparent" }}
      onClick={() => setFlgMenus(!flgMenus)}
    >
      <MenuIcon />
    </IconButton>
  );
};
