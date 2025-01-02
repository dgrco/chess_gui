"use client";
import styles from "./Board.module.css";
import Image from "next/image";
import { useState } from "react";

import wPawnSvg from "../public/chess_sprites/svg/w_pawn_svg_NoShadow.svg";
import wBishopSvg from "../public/chess_sprites/svg/w_bishop_svg_NoShadow.svg";
import wKnightSvg from "../public/chess_sprites/svg/w_knight_svg_NoShadow.svg";
import wRookSvg from "../public/chess_sprites/svg/w_rook_svg_NoShadow.svg";
import wQueenSvg from "../public/chess_sprites/svg/w_queen_svg_NoShadow.svg";
import wKingSvg from "../public/chess_sprites/svg/w_king_svg_NoShadow.svg";

import bPawnSvg from "../public/chess_sprites/svg/b_pawn_svg_NoShadow.svg";
import bBishopSvg from "../public/chess_sprites/svg/b_bishop_svg_NoShadow.svg";
import bKnightSvg from "../public/chess_sprites/svg/b_knight_svg_NoShadow.svg";
import bRookSvg from "../public/chess_sprites/svg/b_rook_svg_NoShadow.svg";
import bQueenSvg from "../public/chess_sprites/svg/b_queen_svg_NoShadow.svg";
import bKingSvg from "../public/chess_sprites/svg/b_king_svg_NoShadow.svg";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function Piece(props) {
  let scale = "0%";
  const pText = props.altText;
  if (pText.includes("Pawn")) {
    scale = "50%";
  } else if (pText.includes("Rook")) {
    scale = "57%";
  } else if (pText.includes("Knight")) {
    scale = "60%";
  } else {
    scale = "67%";
  }
  return (
    <div className={styles.pieceContainer}>
      <Image
        priority
        className={styles.piece}
        width={0}
        draggable="false"
        height={0}
        style={{ width: scale, height: "auto" }}
        src={props.svgSrc}
        alt={props.altText}
      />
    </div>
  );
}

export function Board() {
  const isDarkSquare = (r, c) => {
    return ((7 - r) % 2 == 1 && c % 2 == 1) || ((7 - r) % 2 == 0 && c % 2 == 0);
  };

  const rowColToBoardIdx = (r, c) => {
    return (7 - r) * 8 + c;
  };

  const boardIdxToArrayIdx = (boardIdx) => {
    return (7 - (Math.floor(boardIdx / 8))) * 8 + boardIdx % 8;
  }

  /// Convert a FEN string to Pieces
  const fenToPieces = (fen) => {
    const pieces = new Map();
    let curr = 0;
    for (let i = 0; fen[i] != " "; i++) {
      let row = Math.floor(curr / 8);
      let col = curr % 8;
      let boardIdx = rowColToBoardIdx(row, col);
      switch (fen[i]) {
        case "p":
          pieces.set(
            boardIdx,
            <Piece svgSrc={bPawnSvg} altText="Black Pawn" />,
          );
          curr++;
          break;
        case "b":
          pieces.set(
            boardIdx,
            <Piece svgSrc={bBishopSvg} altText="Black Bishop" />,
          );
          curr++;
          break;
        case "n":
          pieces.set(
            boardIdx,
            <Piece svgSrc={bKnightSvg} altText="Black Knight" />,
          );
          curr++;
          break;
        case "r":
          pieces.set(
            boardIdx,
            <Piece svgSrc={bRookSvg} altText="Black Rook" />,
          );
          curr++;
          break;
        case "q":
          pieces.set(
            boardIdx,
            <Piece svgSrc={bQueenSvg} altText="Black Queen" />,
          );
          curr++;
          break;
        case "k":
          pieces.set(
            boardIdx,
            <Piece svgSrc={bKingSvg} altText="Black King" />,
          );
          curr++;
          break;
        case "P":
          pieces.set(
            boardIdx,
            <Piece svgSrc={wPawnSvg} altText="White Pawn" />,
          );
          curr++;
          break;
        case "B":
          pieces.set(
            boardIdx,
            <Piece svgSrc={wBishopSvg} altText="White Bishop" />,
          );
          curr++;
          break;
        case "N":
          pieces.set(
            boardIdx,
            <Piece svgSrc={wKnightSvg} altText="White Knight" />,
          );
          curr++;
          break;
        case "R":
          pieces.set(
            boardIdx,
            <Piece svgSrc={wRookSvg} altText="White Rook" />,
          );
          curr++;
          break;
        case "Q":
          pieces.set(
            boardIdx,
            <Piece svgSrc={wQueenSvg} altText="White Queen" />,
          );
          curr++;
          break;
        case "K":
          pieces.set(
            boardIdx,
            <Piece svgSrc={wKingSvg} altText="White King" />,
          );
          curr++;
          break;
        default:
          if (!isNaN(fen[i])) {
            curr += fen[i] - "0";
          }
      }
    }
    return pieces;
  };

  let pieces = fenToPieces(DEFAULT_FEN);
  let buffer = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const boardIdx = rowColToBoardIdx(row, col);
      buffer.push({ 'idx': boardIdx, 'piece': pieces.get(boardIdx) });
    }
  }
  const [board, setBoard] = useState(buffer);
  const [selected, setSelected] = useState(undefined);

  const handleMove = (boardIdx) => {
    const arrayIdx = boardIdxToArrayIdx(boardIdx);
    const selectedIdx = selected !== undefined ? boardIdxToArrayIdx(selected.idx) : undefined;
    if (selectedIdx !== undefined && selectedIdx !== arrayIdx) {
      // Make move
      let tmp = Array.from(board);
      tmp[arrayIdx].piece = selected.piece;
      tmp[selectedIdx].piece = undefined;
      setBoard(tmp);
      setSelected(undefined);
    } else if (selectedIdx === undefined && board[arrayIdx].piece != undefined) {
      // Initialize selection
      setSelected(board[arrayIdx]);
    } else if (selectedIdx === arrayIdx) {
      // Unmake selection
      setSelected(undefined);
    }
  };

  const renderTable = () => {
    let tableRows = [];
    for (let i = 0; i < board.length; i += 8) {
      const rowSquares = board.slice(i, i + 8);
      tableRows.push(
        <tr key={7 - i}>
          {rowSquares.map(({ idx, piece }, j) => (
            <td key={i + j} style={{ border: "0px" }}>
              <div
                role="button"
                onClick={() => handleMove(idx)}
                className={`${styles.cell} ${isDarkSquare(Math.floor(i / 8), j) ? styles.dark : styles.light} ${selected !== undefined && selected.idx === idx && styles.selected}`}
              >
                {piece}
              </div>
            </td>
          ))
          }
        </tr >,
      );
    }

    return tableRows;
  };

  return (
    <table
      className={styles.table}
      border="1"
      style={{ borderCollapse: "collapse", textAlign: "center" }}
    >
      <tbody>{renderTable()}</tbody>
    </table>
  );
}
