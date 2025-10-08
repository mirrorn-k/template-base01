"use client";
import Modal from "@/packages/core/atoms/Modal";
import { Typography } from "@mui/material";
import { LinkBox } from "@/packages/core/atoms/Link";
import { FlexColumnBox } from "@/packages/core/atoms/Box";
import { useTheme } from "@mui/material/styles";
import * as ContextCommon from "@/packages/core/context/Common";

interface Props {
  menus: { label: string; href: string }[];
  children?: React.ReactNode;
}

const Main = ({ menus, children }: Props) => {
  const theme = useTheme();

  const { flgMenus, setFlgMenus } = ContextCommon.useContents();

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
            <LinkBox href={"/"}>
              <Typography className={"font-tittle"}>HOME</Typography>
            </LinkBox>
            {menus.map((menu, index) => (
              <LinkBox
                key={`head-navi-sp-${index}`}
                onClick={handleMenuClose}
                href={menu.href}
              >
                {menu.label}
              </LinkBox>
            ))}
          </FlexColumnBox>
        </FlexColumnBox>
        {children}
      </FlexColumnBox>
    </Modal>
  );
};

export default Main;
