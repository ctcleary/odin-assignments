import "./styles.css";
import Knight from "./Knight";

const k = new Knight();
window.k = k;
window.knightMoves = k.moves.bind(k);