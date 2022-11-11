import { Card, CardContent } from "@mui/material";
import styles from "./styling/Card.module.css";

const MiCard = ({ children }: any) => {
  return (
    <Card variant="outlined" className={styles["card"]}>
      <CardContent className={styles["card"]}>{children}</CardContent>
    </Card>
  );
};

export default MiCard;
