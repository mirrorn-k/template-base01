// app/loading.tsx
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress color="primary" />
    </div>
  );
}
