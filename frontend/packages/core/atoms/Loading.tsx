import { Box, CircularProgress } from "@mui/material";
import Modal from "@/packages/core/atoms/Modal";

const Main = ({ flg = true }: { flg?: boolean }) => {
  return flg ? (
    <Box
      position={"fixed"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      bgcolor={"rgba(255, 255, 255, 0.5)"}
    >
      <Modal
        title={"Loading"}
        open={true}
        onClose={() => {
          /* */
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Modal>
    </Box>
  ) : (
    <></>
  );
};

export default Main;
