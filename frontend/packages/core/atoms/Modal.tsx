import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
//import { useTheme } from "@mui/material/styles";

interface MainProps {
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  width?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  fullScreen?: boolean;
}
export default function Main({
  title,
  children,
  actions,
  open,
  onClose,
  width = false,
  fullScreen = false,
}: MainProps) {
  //const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={width}
      fullWidth={fullScreen}
      disableScrollLock
      //sx={{ p: theme.spacing(8) }}
    >
      <DialogTitle component={"h3"} variant="h3" sx={{ textAlign: "left" }}>
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}

// 閉じる処理
/*
const handleClose = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  callback?: () => void
) => {
  setOpen(false);
  if (!callback) return;
  callback();
};
*/
