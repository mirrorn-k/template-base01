import Content01 from "./Content01";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

export default function Main({}) {
  return (
    <AppBar className="appbar">
      <Toolbar>{<Content01 key={`header-content01`} />}</Toolbar>
    </AppBar>
  );
}
