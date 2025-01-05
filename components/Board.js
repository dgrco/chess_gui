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
            <Piece svgSrc={bPawnSvg} type="Pawn" color="Black" altText="Black Pawn" />,
          );
          curr++;
          break;
        case "b":
          pieces.set(
            boardIdx,
            <Piece svgSrc={bBishopSvg} type="Bishop" color="Black" altText="Black Bishop" />,
          );
          curr++;
          break;
        case "n":
          pieces.set(
            boardIdx,
            <Piece svgSrc={bKnightSvg} type="Knight" color="Black" altText="Black Knight" />,
          );
          curr++;
          break;
        case "r":
          pieces.set(
            boardIdx,
            <Piece svgSrc={bRookSvg} type="Rook" color="Black" altText="Black Rook" />,
          );
          curr++;
          break;
        case "q":
          pieces.set(
            boardIdx,
            <Piece svgSrc={bQueenSvg} type="Queen" color="Black" altText="Black Queen" />,
          );
          curr++;
          break;
        case "k":
          pieces.set(
            boardIdx,
            <Piece svgSrc={bKingSvg} type="King" color="Black" altText="Black King" />,
          );
          curr++;
          break;
        case "P":
          pieces.set(
            boardIdx,
            <Piece svgSrc={wPawnSvg} type="Pawn" color="White" altText="White Pawn" />,
          );
          curr++;
          break;
        case "B":
          pieces.set(
            boardIdx,
            <Piece svgSrc={wBishopSvg} type="Bishop" color="White" altText="White Bishop" />,
          );
          curr++;
          break;
        case "N":
          pieces.set(
            boardIdx,
            <Piece svgSrc={wKnightSvg} type="Knight" color="White" altText="White Knight" />,
          );
          curr++;
          break;
        case "R":
          pieces.set(
            boardIdx,
            <Piece svgSrc={wRookSvg} type="Rook" color="White" altText="White Rook" />,
          );
          curr++;
          break;
        case "Q":
          pieces.set(
            boardIdx,
            <Piece svgSrc={wQueenSvg} type="Queen" color="White" altText="White Queen" />,
          );
          curr++;
          break;
        case "K":
          pieces.set(
            boardIdx,
            <Piece svgSrc={wKingSvg} type="King" color="White" altText="White King" />,
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
  const [legalMoves, setLegalMoves] = useState([]);

  /// Check if a piece is at a location, if the piece is the same color as the selected
  /// piece it will return 1, if it is the opposite color it will return -1, otherwise it returns 0.
  /// These arguments are to be passed as board indices, not array indices.
  const isPieceOccupied = (selectedIdx, newIdx) => {
    selectedIdx = boardIdxToArrayIdx(selectedIdx);
    newIdx = boardIdxToArrayIdx(newIdx);
    const selectedColor = board[selectedIdx].piece !== undefined ? board[selectedIdx].piece.props.color : undefined;
    const newColor = board[newIdx].piece !== undefined ? board[newIdx].piece.props.color : undefined;
    if (selectedColor !== undefined && newColor !== undefined) {
      if (selectedColor === newColor) {
        return 1;
      } else {
        return -1;
      }
    }
    return 0;
  }

  /// Get legal pawn moves
  const getLegalPawnMoves = (boardIdx) => {
    let positions = [];
    const row = Math.floor(boardIdx / 8);
    const col = boardIdx % 8;
    const arrIdx = boardIdxToArrayIdx(boardIdx);
    console.log(board[arrIdx].piece);
    const color = board[arrIdx].piece !== undefined ? board[arrIdx].piece.props.color : undefined;

    if (color === undefined) {
      return [];
    }

    if (color === "White") {
      if (row + 1 <= 7) {
        positions.push((row + 1) * 8 + col);
      }
      if (row === 1) {
        positions.push((row + 2) * 8 + col);
      }
    } else {
      if (row - 1 >= 0) {
        positions.push((row - 1) * 8 + col);
      }
      if (row === 6) {
        positions.push((row - 2) * 8 + col);
      }
    }

    return positions;
  }

  /// Generate legal rays (for rooks/queens)
  const getLegalRays = (boardIdx) => {
    let positions = [];
    const row = Math.floor(boardIdx / 8);
    const col = boardIdx % 8;

    // Right
    for (let i = col + 1; i <= 7; i++) {
      const occupied = isPieceOccupied(boardIdx, row * 8 + i);
      if (occupied === 1) {
        break;
      }
      positions.push(row * 8 + i);
      if (occupied === -1) {
        break;
      }
    }
    // Up
    for (let i = row + 1; i <= 7; i++) {
      const occupied = isPieceOccupied(boardIdx, i * 8 + col);
      if (occupied === 1) {
        break;
      }
      positions.push(i * 8 + col);
      if (occupied === -1) {
        break;
      }
    }
    // Down
    for (let i = row - 1; i >= 0; i--) {
      const occupied = isPieceOccupied(boardIdx, i * 8 + col);
      if (occupied === 1) {
        break;
      }
      positions.push(i * 8 + col);
      if (occupied === -1) {
        break;
      }
    }
    // Left
    for (let i = col - 1; i >= 0; i--) {
      const occupied = isPieceOccupied(boardIdx, row * 8 + i);
      if (occupied === 1) {
        break;
      }
      positions.push(row * 8 + i);
      if (occupied === -1) {
        break;
      }
    }
    return positions;
  }

  /// Generate legal diagonals (for bishops/queens)
  const getLegalDiagonals = (boardIdx) => {
    let positions = [];
    const row = Math.floor(boardIdx / 8);
    const col = boardIdx % 8;
    // Top-Right
    let currRow = row;
    let currCol = col;
    for (let i = Math.max(row, col); i < 7; i++) {
      const occupied = isPieceOccupied(boardIdx, (currRow + 1) * 8 + currCol + 1)
      if (occupied === 1) {
        break;
      }
      positions.push((++currRow) * 8 + (++currCol));
      if (occupied === -1) {
        break;
      }
    }
    // Bottom-Right
    currRow = row;
    currCol = col;
    for (let i = Math.max(7 - row, col); i < 7; i++) {
      const occupied = isPieceOccupied(boardIdx, (currRow - 1) * 8 + currCol + 1)
      if (occupied === 1) {
        break;
      }
      positions.push((--currRow) * 8 + (++currCol));
      if (occupied === -1) {
        break;
      }
    }
    // Bottom-Left
    currRow = row;
    currCol = col;
    for (let i = Math.min(row, col); i > 0; i--) {
      const occupied = isPieceOccupied(boardIdx, (currRow - 1) * 8 + currCol - 1)
      if (occupied === 1) {
        break;
      }
      positions.push((--currRow) * 8 + (--currCol));
      if (occupied === -1) {
        break;
      }
    }
    // Top-Left
    currRow = row;
    currCol = col;
    for (let i = Math.max(row, 7 - col); i < 7; i++) {
      const occupied = isPieceOccupied(boardIdx, (currRow + 1) * 8 + currCol - 1)
      if (occupied === 1) {
        break;
      }
      positions.push((++currRow) * 8 + (--currCol));
      if (occupied === -1) {
        break;
      }
    }
    return positions;
  }

  /// Get the legal knight move positions.
  const getLegalKnightMoves = (boardIdx) => {
    let positions = [];
    const row = Math.floor(boardIdx / 8);
    const col = boardIdx % 8;

    // Left-Left-Up
    if ((col - 2) >= 0 && (row + 1) <= 7) {
      if (isPieceOccupied(boardIdx, (row + 1) * 8 + (col - 2)) !== 1) {
        positions.push((row + 1) * 8 + (col - 2));
      }
    }

    // Left-Left-Down
    if ((col - 2) >= 0 && (row - 1) >= 0) {
      if (isPieceOccupied(boardIdx, (row - 1) * 8 + (col - 2)) !== 1) {
        positions.push((row - 1) * 8 + (col - 2));
      }
    }

    // Left-Up-Up
    if ((col - 1) >= 0 && (row + 2) <= 7) {
      if (isPieceOccupied(boardIdx, (row + 2) * 8 + (col - 1)) !== 1) {
        positions.push((row + 2) * 8 + (col - 1));
      }
    }

    // Left-Down-Down
    if ((col - 1) >= 0 && (row - 2) >= 0) {
      if (isPieceOccupied(boardIdx, (row - 2) * 8 + (col - 1)) !== 1) {
        positions.push((row - 2) * 8 + (col - 1));
      }
    }

    // Right-Right-Up
    if ((col + 2) <= 7 && (row + 1) <= 7) {
      if (isPieceOccupied(boardIdx, (row + 1) * 8 + (col + 2)) !== 1) {
        positions.push((row + 1) * 8 + (col + 2));
      }
    }

    // Right-Right-Down
    if ((col + 2) <= 7 && (row - 1) >= 0) {
      if (isPieceOccupied(boardIdx, (row - 1) * 8 + (col + 2)) !== 1) {
        positions.push((row - 1) * 8 + (col + 2));
      }
    }

    // Right-Up-Up
    if ((col + 1) <= 7 && (row + 2) <= 7) {
      if (isPieceOccupied(boardIdx, (row + 2) * 8 + (col + 1)) !== 1) {
        positions.push((row + 2) * 8 + (col + 1));
      }
    }

    // Right-Down-Down
    if ((col + 1) <= 7 && (row - 2) >= 0) {
      if (isPieceOccupied(boardIdx, (row - 2) * 8 + (col + 1)) !== 1) {
        positions.push((row - 2) * 8 + (col + 1));
      }
    }

    return positions;
  }

  const getLegalKingMoves = (boardIdx) => {
    let positions = [];
    const row = Math.floor(boardIdx / 8);
    const col = boardIdx % 8;

    if (col - 1 >= 0) {
      if (isPieceOccupied(boardIdx, row * 8 + (col - 1)) !== 1) {
        positions.push(row * 8 + (col - 1));
      }
    }
    if (col + 1 <= 7) {
      if (isPieceOccupied(boardIdx, row * 8 + (col + 1)) !== 1) {
        positions.push(row * 8 + (col + 1));
      }
    }

    if (row + 1 <= 7) {
      if (isPieceOccupied(boardIdx, (row + 1) * 8 + col) !== 1) {
        positions.push((row + 1) * 8 + col);
      }
      if (col - 1 >= 0) {
        if (isPieceOccupied(boardIdx, (row + 1) * 8 + (col - 1)) !== 1) {
          positions.push((row + 1) * 8 + (col - 1));
        }
      }
      if (col + 1 <= 7) {
        if (isPieceOccupied(boardIdx, (row + 1) * 8 + (col + 1)) !== 1) {
          positions.push((row + 1) * 8 + (col + 1));
        }
      }
    }

    if (row - 1 >= 0) {
      if (isPieceOccupied(boardIdx, (row - 1) * 8 + col) !== 1) {
        positions.push((row - 1) * 8 + col);
      }
      if (col - 1 >= 0) {
        if (isPieceOccupied(boardIdx, (row - 1) * 8 + (col - 1)) !== 1) {
          positions.push((row - 1) * 8 + (col - 1));
        }
      }
      if (col + 1 <= 7) {
        if (isPieceOccupied(boardIdx, (row - 1) * 8 + (col + 1)) !== 1) {
          positions.push((row - 1) * 8 + (col + 1));
        }
      }
    }
    return positions;
  }

  /// Generate all pseudo-legal moves of the selected piece
  const generatePseudoLegalMoves = (sPiece) => {
    if (sPiece === undefined) {
      return;
    }
    const selectedIdx = sPiece.idx;
    const selectedPiece = sPiece.piece;
    const selectedType = selectedPiece.props.type;
    let legalMoveBuffer = [];
    switch (selectedType) {
      case "Pawn": {
        legalMoveBuffer = [...getLegalPawnMoves(selectedIdx)];
        break;
      };
      case "Bishop": {
        legalMoveBuffer = [...getLegalDiagonals(selectedIdx)];
        break;
      }
      case "Knight": {
        legalMoveBuffer = [...getLegalKnightMoves(selectedIdx)];
        break;
      }
      case "Rook": {
        legalMoveBuffer = [...getLegalRays(selectedIdx)];
        break;
      }
      case "Queen": {
        legalMoveBuffer = [...getLegalRays(selectedIdx), ...getLegalDiagonals(selectedIdx)];
        break;
      }
      case "King": {
        legalMoveBuffer = [...getLegalKingMoves(selectedIdx)];
        break;
      }
    }
    setLegalMoves(legalMoveBuffer);
  }

  /// Handle selection and movement logic.
  const handleMove = (boardIdx) => {
    const newSelectionIdx = boardIdxToArrayIdx(boardIdx);
    const oldSelectionIdx = selected !== undefined ? boardIdxToArrayIdx(selected.idx) : undefined;
    const newSelectionColor = board[newSelectionIdx].piece !== undefined ? board[newSelectionIdx].piece.props.color : undefined;
    const oldSelectedColor = selected !== undefined ? selected.piece.props.color : undefined;
    if (oldSelectionIdx !== undefined && oldSelectionIdx !== newSelectionIdx && legalMoves.includes(boardIdx)) {
      // Make move
      let tmp = Array.from(board);
      tmp[newSelectionIdx].piece = selected.piece;
      tmp[oldSelectionIdx].piece = undefined;
      setBoard(tmp);
      setSelected(undefined);
      setLegalMoves([]);
    } else if (newSelectionColor !== undefined && newSelectionIdx !== oldSelectionIdx) {
      // Initialize selection
      // TODO: edit the condition to avoid swapping sides
      setSelected(board[newSelectionIdx]);
      generatePseudoLegalMoves(board[newSelectionIdx]);
    } else {
      // Unmake selection
      setSelected(undefined);
      setLegalMoves([]);
    }
  };

  /// Render the board
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
                className={`${styles.cell} ${isDarkSquare(Math.floor(i / 8), j) ? styles.dark : styles.light} ${selected !== undefined && selected.idx === idx && styles.selected}
                ${legalMoves.includes(idx) && styles.potentialMove}`}
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
