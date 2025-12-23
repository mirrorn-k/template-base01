"use client";

import Box from "@mui/material/Box";
import { tMedia } from "@/types/ttnouMap";
import { MainMenuButton } from "./atoms/Button";
import * as ContextMap from "@/contexts/MapData";
import { tHeaderItem } from "@/lib/api/header/type";
import Typography from "@mui/material/Typography";
import MenuItems from "./atoms/MenuItems";
import { Link } from "@mui/material";
import NextLink from "next/link";
import Button from "@mui/material/Button";
import * as ContextCommon from "@/contexts/Common";
import * as Image from "@/components/media/Index";
import { getResponsiveValue } from "@/lib/responsiveValue/index";
import { IMAGE_DEFAULT } from "@/const/Image";
import { useIsDesktop } from "@/lib/isDeviceSize";
import SendIcon from "@mui/icons-material/Send";

const Main = ({ content }: { content: tHeaderItem }) => {
  const { flgContactModal, setFlgContactModal, screenSize } =
    ContextCommon.useContents();
  const { menus, organize } = ContextMap.Contents();
  return (
    <Box className="Header01" sx={{ display: "contents" }}>
      <Link
        component={NextLink}
        href="/"
        color="inherit"
        underline="none"
        sx={{ height: "100%" }}
      >
        {content.flgLogo && content.logo ? (
          <Image.MediaImage
            media={getResponsiveValue<tMedia>(
              content.logo,
              screenSize,
              "xs",
              "xl",
              "down",
              true,
              true,
              IMAGE_DEFAULT
            )}
            objectFit="contain"
            alt={content.siteName || organize?.organization_name || "Logo"}
            fill={false}
            imgProps={{
              style: {
                zIndex: -1,
                objectPosition: "left center",
                width: "auto",
                height: "100%",
                maxWidth: "250px",
                maxHeight: "64px",
              },
            }}
          />
        ) : (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {content.siteName || organize?.organization_name}
          </Typography>
        )}
      </Link>

      {useIsDesktop() ? (
        <>
          {/* PCナビゲーション */}
          {content.flgMenus && <MenuItems menus={menus} />}
          {/* お問い合わせボタン */}
          {content.flgContactButton ? (
            <Button
              variant="contained"
              color="secondary"
              sx={{ borderRadius: 12, display: { xs: "none", md: "flex" } }}
              onClick={() => setFlgContactModal(!flgContactModal)}
            >
              <SendIcon />
              Contact
            </Button>
          ) : (
            <span> </span>
          )}
        </>
      ) : (
        <>
          {/* モバイルナビゲーション */}
          <MainMenuButton />
        </>
      )}
    </Box>
  );
};
export default Main;
