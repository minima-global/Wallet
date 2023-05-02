import { Typography } from "@mui/material";

const MiTicker = ({ symbol }: any) => {
  return (
    <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
      <i>{symbol}</i>
    </Typography>
  );
};
export default MiTicker;
