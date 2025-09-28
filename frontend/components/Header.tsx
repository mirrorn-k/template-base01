"use client";

import * as Theme from "@/themes/Header";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FlexBox } from "@/packages/core/atoms/Box";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import * as ContextCommon from "@/packages/core/context/Common";

const Main = () => {
  const { flgMenus, setFlgMenus } = ContextCommon.useContents();
  return (
    <Theme.default>
      <AppBar className="appbar">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Application
          </Typography>
          <FlexBox
            sx={{
              gap: 3,
              alignItems: "center",
              display: { xs: "none", md: "flex" },
            }}
          >
            <Link color="inherit" href="/">
              Home
            </Link>
            <Link color="inherit" href="/about">
              About
            </Link>
            <Button variant="contained" color="secondary">
              Contact
            </Button>
          </FlexBox>

          {/* モバイルナビゲーション */}
          <Box sx={{ display: { xs: "flex", md: "none" }, marginLeft: "auto" }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="menu"
              onClick={() => setFlgMenus(!flgMenus)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Theme.default>
  );
};
export default Main;
