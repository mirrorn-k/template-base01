"use client";

import Box from "@mui/material/Box";
import { tMedia } from "@/types/ttnouMap";
import { MainMenuButton } from "./atoms/Button";
import * as ContextMap from "@/contexts/MapData";
import { tHeaderItem } from "@/lib/api/header/type";
import Typography from "@mui/material/Typography";
import MenuItems from "@/components/menu/Items";
import { Link } from "@mui/material";
import Button from "@mui/material/Button";
import * as ContextCommon from "@/contexts/Common";
import * as Image from "@/components/media/Index";
import { getResponsiveValue } from "@/lib/responsiveValue/index";
import { IMAGE_DEFAULT } from "@/const/Image";

const Main = ({ content }: { content: tHeaderItem }) => {
  const { flgContactModal, setFlgContactModal, screenSize } =
    ContextCommon.useContents();
  const { menus, organize } = ContextMap.Contents();
  return (
    <>
      <Link href="/" color="inherit" underline="none">
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
            {organize?.organization_name}
          </Typography>
        )}
      </Link>
      {/* PCナビゲーション */}
      {content.flgMenus && <MenuItems menus={menus} />}
      {/* お問い合わせボタン */}
      {content.flgContactButton && (
        <Button
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 12, display: { xs: "none", md: "flex" } }}
          onClick={() => setFlgContactModal(!flgContactModal)}
        >
          Contact
        </Button>
      )}
      {/* モバイルナビゲーション */}
      <Box sx={{ display: { xs: "flex", md: "none" }, marginLeft: "auto" }}>
        <MainMenuButton />
      </Box>
    </>
  );
};
export default Main;
