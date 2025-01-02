import { Board } from "../../components/Board.js";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Board />
    </div>
  );
}
