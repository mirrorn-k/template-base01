import * as React from "react";
import { Button } from "@mui/material";
import { useContents } from "@/packages/core/context/Common";

type Props = {
  text?: string;
} & Omit<React.ComponentProps<typeof Button>, "href" | "children">;

export default function Main({ text, ...rest }: Props) {
  const { setFlgContactModal } = useContents();

  const handleClick = () => {
    setFlgContactModal(true);
  };

  return (
    <Button variant="contained" onClick={handleClick} {...rest}>
      {text || "お問い合わせ"}
    </Button>
  );
}
