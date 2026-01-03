"use client";
import Modal from "@/atoms/Modal";
import { Typography } from "@mui/material";
import { LinkBox } from "@/atoms/Link";
import { FlexColumnBox } from "@/atoms/Box";
import { useTheme } from "@mui/material/styles";
import * as ContextCommon from "@/contexts/Common";
import * as ContextMap from "@/contexts/MapData";

const Main = () => {
  const theme = useTheme();

  const { flgMenus, setFlgMenus } = ContextCommon.useContents();
  const { menus } = ContextMap.Contents();

  const flgMenuInTop = menus.some(
    (menu) => menu.slug === "" || menu.slug === "/"
  )
    ? true
    : false;

  const handleMenuClose = () => {
    console.log("handleMenuClose");
    setFlgMenus(false);
  };

  return (
    <Modal
      title={""}
      actions={<></>}
      open={flgMenus}
      width={"xl"}
      onClose={handleMenuClose}
      fullScreen={true}
    >
      <FlexColumnBox gapSize={2}>
        <FlexColumnBox gapSize={1}>
          <Typography
            variant="h2"
            component={"h3"}
            sx={{ borderBottom: "1px solid black" }}
          >
            MENU
          </Typography>
          <FlexColumnBox gapSize={0} sx={{ p: theme.spacing(2) }}>
            {/*
            <LinkBox href={"/"}>
              {header.flgLogo && header.logo ? (
                <Image.MediaImage
                  media={getResponsiveValue<tMedia>(
                    header.logo,
                    screenSize,
                    "xs",
                    "xl",
                    "down",
                    true,
                    true,
                    IMAGE_DEFAULT
                  )}
                  objectFit="contain"
                  alt={header.siteName || organize?.organization_name || "Logo"}
                  fill={false}
                  imgProps={{
                    style: {
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
            </LinkBox>
            */}
            {!flgMenuInTop && (
              <LinkBox onClick={handleMenuClose} href={"/"}>
                TOP
              </LinkBox>
            )}
            {menus.map((menu, index) => (
              <LinkBox
                key={`head-navi-sp-${index}`}
                onClick={handleMenuClose}
                href={menu.slug ? `${menu.slug}` : "/"}
              >
                {menu.label}
              </LinkBox>
            ))}
          </FlexColumnBox>
        </FlexColumnBox>
      </FlexColumnBox>
    </Modal>
  );
};

export default Main;
