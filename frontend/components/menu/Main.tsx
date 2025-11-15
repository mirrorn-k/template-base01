"use client";
import Typography from "@mui/material/Typography";
import MenuItems from "@/components/menu/Items";
import { tMenuItem } from "@/lib/api/menu/type";
import { Link } from "@mui/material";
import Button from "@mui/material/Button";
import * as ContextCommon from "@/contexts/Common";

export default function Menu02(props: {
  menus: tMenuItem[];
  organizeName: string;
}) {
  const { flgContactModal, setFlgContactModal } = ContextCommon.useContents();
  return (
    <>
      <Link href="/" color="inherit" underline="none">
        <Typography variant="h6">{props.organizeName}</Typography>
      </Link>
      {/* PCナビゲーション */}
      <MenuItems flgContact={true} menus={props.menus} />
      {/* お問い合わせボタン */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ borderRadius: 12, display: { xs: "none", md: "flex" } }}
        onClick={() => setFlgContactModal(!flgContactModal)}
      >
        Contact
      </Button>
    </>
  );
}
