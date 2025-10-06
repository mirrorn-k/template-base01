import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Menu01 from "@/components/menu/Menu01";
import { MenuItem } from "@/types/mapMenu";
import { MenuButton } from "@/packages/core/atoms/Button";

const Main = (props: { menus: MenuItem[] }) => {
  console.log("[Header] render", props.menus);
  return (
    <>
      <AppBar className="appbar">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Application
          </Typography>{" "}
          <Menu01 flgContact={true} menus={props.menus} />
          {/* モバイルナビゲーション */}
          <Box sx={{ display: { xs: "flex", md: "none" }, marginLeft: "auto" }}>
            <MenuButton />
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};
export default Main;
