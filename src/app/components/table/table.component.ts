import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { Position } from "../position.model";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnInit {
  roverImage = "../../../assets/rover.png";
  displayBoard: boolean = false;
  board: string[][] = [];
  position: Position = {
    x: 0,
    y: 0,
    orientation: "",
  };

  newCommands: {
    boardDimensions: string;
    startingPosition: string;
    pathing: string;
  } = {
    boardDimensions: "",
    startingPosition: "",
    pathing: "",
  };

  output: string = "";

  constructor() {}

  ngOnInit(): void {}

  updateBoard = (boardSize: number[], position: Position) => {
    for (let y = 0; y <= boardSize[1]; y++) {
      this.board[y] = [];
      for (let x = 0; x <= boardSize[0]; x++) {
        this.board[y][x] = `${x} x ${boardSize[1] - y}`;
      }
    }

    this.board[boardSize[1] - position.y][position.x] = position.orientation;
  };

  rotationControl = (
    position: Position,
    rotation: string,
    boardArray: number[]
  ) => {
    if (rotation === "M") {
      switch (position.orientation) {
        case "N":
          position.y < boardArray[1] ? (position.y += 1) : position.y;
          break;
        case "W":
          position.x > 0 ? (position.x -= 1) : position.x;
          break;
        case "S":
          position.y > 0 ? (position.y -= 1) : position.y;
          break;
        case "E":
          position.x < boardArray[0] ? (position.x += 1) : position.x;
          break;
      }
    }
    if (position.orientation === "N") {
      switch (rotation) {
        case "L":
          position.orientation = "W";
          break;
        case "R":
          position.orientation = "E";
          break;
      }
    } else if (position.orientation === "W") {
      switch (rotation) {
        case "L":
          position.orientation = "S";
          break;
        case "R":
          position.orientation = "N";
          break;
      }
    } else if (position.orientation === "S") {
      switch (rotation) {
        case "L":
          position.orientation = "E";
          break;
        case "R":
          position.orientation = "W";
          break;
      }
    } else if (position.orientation === "E") {
      switch (rotation) {
        case "L":
          position.orientation = "N";
          break;
        case "R":
          position.orientation = "S";
          break;
      }
    }
  };

  roverMovement = () => {
    this.displayBoard = false;
    let coordinatesArray = this.newCommands.boardDimensions.split(" ");
    let boardArray: number[] = [
      Number(coordinatesArray[0]),
      Number(coordinatesArray[1]),
    ];

    let startingPointArray = this.newCommands.startingPosition.split(" ");
    this.position = {
      x: Number(startingPointArray[0]),
      y: Number(startingPointArray[1]),
      orientation: startingPointArray[2],
    };

    this.updateBoard(boardArray, this.position);

    for (let order = 0; order < this.newCommands.pathing.length; order++) {
      setTimeout(() => {
        this.rotationControl(
          this.position,
          this.newCommands.pathing[order],
          boardArray
        );
        this.updateBoard(boardArray, this.position);
      }, 1000 + 500 * order);
    }
    if (this.board.length > 0) {
      this.displayBoard = true;
    }
  };
}
