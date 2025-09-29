"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import * as ContextCommon from "@/packages/core/context/Common";
import Menu01 from "@/components/menu/Menu01";

const Main = () => {
  const { flgMenus, setFlgMenus } = ContextCommon.useContents();

  return (
    <>
      <AppBar className="appbar">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Application
          </Typography>
          <Menu01 flgContact={true} />

          {/* モバイルナビゲーション */}
          <Box sx={{ display: { xs: "flex", md: "none" }, marginLeft: "auto" }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="menu"
              sx={{ color: "inherit", backgroundColor: "transparent" }}
              onClick={() => setFlgMenus(!flgMenus)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};
export default Main;
