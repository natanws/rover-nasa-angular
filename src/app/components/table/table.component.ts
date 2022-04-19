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
    pathing: any;
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

  rotationControl = {
    L: function Left(orientation: string, position: Position) {
      switch (orientation) {
        case "N":
          position.orientation = "W";
          break;
        case "W":
          position.orientation = "S";
          break;
        case "S":
          position.orientation = "E";
          break;
        case "E":
          position.orientation = "N";
          break;
      }
    },
    R: function Right(orientation: string, position: Position) {
      switch (orientation) {
        case "N":
          position.orientation = "E";
          break;
        case "W":
          position.orientation = "N";
          break;
        case "S":
          position.orientation = "W";
          break;
        case "E":
          position.orientation = "S";
          break;
      }
    },
    M: function Move(orientation: string, position: Position) {
      switch (orientation) {
        case "N":
          position.y++;
          break;
        case "W":
          position.x--;
          break;
        case "S":
          position.y--;
          break;
        case "E":
          position.x++;
          break;
      }
    },
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

    for (let order in this.newCommands.pathing) {
      let currentOrder: keyof typeof this.rotationControl =
        this.newCommands.pathing[order];
      setTimeout(() => {
        this.rotationControl[currentOrder](
          this.position.orientation,
          this.position
        );
        this.updateBoard(boardArray, this.position);
      }, 1000 + 300 * +order);
    }
    if (this.board.length > 0) {
      this.displayBoard = true;
    }
  };
}
