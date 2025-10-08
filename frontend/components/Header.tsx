import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Menu01 from "@/components/menu/Menu01";
import { MenuItem } from "@/types/mapMenu";
import { MenuButton } from "@/packages/core/atoms/Button";
import { Link } from "@mui/material";

const Main = (props: { menus: MenuItem[]; organizeName: string }) => {
  console.log("[Header] render", props.menus);
  return (
    <>
      <AppBar className="appbar">
        <Toolbar>
          <Link href="/" color="inherit" underline="none" sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{props.organizeName}</Typography>
          </Link>
          {/* PCナビゲーション */}
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
