import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import tinycolor from 'tinycolor2';

import Chess from 'chess.js';

import {
  COLOR,
  INPUT_EVENT_TYPE,
  MOVE_INPUT_MODE,
  Chessboard
} from 'cm-chessboard/src/cm-chessboard/Chessboard.js';

import { AuthService } from '@services/auth.service';

interface Piece {
  piece: string;
  color: string;
  positionStart: string;
  positionEnd: string;
};


interface MatrizBoardBox {
  name: string;
  x: number,
  y: number;
  matrizLetter: number;
  matrizNumber: number;
  piece?: Piece;
  letter: string;
  numb: number;
};

interface Brush {
  distance: number,
  thickness: number,
  color: string
}

@Component({
  selector: 'app-paint',
  templateUrl: './paint.page.html',
  styleUrls: ['./paint.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaintPage implements OnInit {

  @ViewChild('myCanvas') canvas: ElementRef;
  canvasElement: any;
  canvasReadyBuild = false;
  disableShowCanvas = true;
  showingCanvas = false;


  currentAngle;

  contextCanvas: any;


  board;
  chessInstance = new Chess();
  turn: 'white' | 'black';

  readyDidEnter = false;
  isEnableDarkMode: boolean;


  pieces: Piece[] = [
    { piece: 'W_TR', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_CR', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_AR', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_RR', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_DD', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_AD', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_CD', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_TD', color: this.getRandomColor(), positionStart: '', positionEnd: '' },

    { piece: 'W_PH', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_PG', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_PF', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_PE', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_PD', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_PC', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_PB', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'W_PA', color: this.getRandomColor(), positionStart: '', positionEnd: '' },

    { piece: 'B_TR', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_CR', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_AR', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_RR', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_DD', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_AD', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_CD', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_TD', color: this.getRandomColor(), positionStart: '', positionEnd: '' },

    { piece: 'B_PH', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_PG', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_PF', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_PE', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_PD', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_PC', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_PB', color: this.getRandomColor(), positionStart: '', positionEnd: '' },
    { piece: 'B_PA', color: this.getRandomColor(), positionStart: '', positionEnd: '' },


  ];

  matrizBoardBox: MatrizBoardBox[] = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    if (!this.readyDidEnter) {

      this.authService.getDarkMode().then(isEnable => {
        this.isEnableDarkMode = isEnable?.value === 'enabled' ? true : false;

      }).finally(() => {
        this.loadBoard();
        this.readyDidEnter = true;
      })

    }
  }

  async loadBoard() {
    this.board = await new Chessboard(document.getElementById('boardPaint'), {
      position: 'start',
      style: {
        cssClass: this.isEnableDarkMode ? "black-and-white" : null
      }
      // sprite: { url: '/assets/images/chessboard-sprite.svg' }
    });


    if (!this.canvasReadyBuild) {
      this.buildCanvas();
    }
    this.board.enableMoveInput((event) => {

      console.log('board event ', event);

      // handle user input here
      switch (event.type) {
        case INPUT_EVENT_TYPE.moveStart:
          // console.log(`moveStart: ${event.square}`);
          // return `true`, if input is accepted/valid, `false` aborts the interaction, the piece will not move
          return true;
        case INPUT_EVENT_TYPE.moveDone:

          const objectMove = { from: event.squareFrom, to: event.squareTo };
          const theMove = this.chessInstance.move(objectMove);
          if (theMove) {

            if (theMove.color === 'b') {
              this.turn = 'white';
            } else {
              this.turn = 'black';
            }
            this.executeMove(event.squareFrom, event.squareTo);
            this.board.setPosition(this.chessInstance.fen()).then(() => {

              // se dibuja la linea
            });
            this.changeDetectorRef.markForCheck();
          }
          // return true, if input is accepted/valid, `false` takes the move back
          return theMove;
        case INPUT_EVENT_TYPE.moveCanceled:
          console.log('moveCanceled ', this.chessInstance.pgn());
      }
    });
    this.changeDetectorRef.markForCheck();
  }

  buildCanvas() {

    this.canvasElement = this.canvas.nativeElement;
    this.contextCanvas = this.canvasElement.getContext('2d');

    this.canvasElement.width = this.board.view.width;
    this.canvasElement.height = this.board.view.height;

    // console.log(0, this.board.view.width);
    // console.log(0, this.board.view.height);


    // this.contextCanvas.fillStyle = 'red';
    // this.contextCanvas.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.canvasReadyBuild = true;
    this.matrizBoard();
    this.disableShowCanvas = false;
  }

  matrizBoard() {

    const sizeBoxX = this.board.view.width / 8;
    const sizeBoxY = this.board.view.height / 8;

    const halfSizeBoxX = sizeBoxX / 2;
    const halfSizeBoxY = sizeBoxY / 2;



    this.matrizBoardBox = [];
    const letters = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    // se crean desde la fila a [a8, b8, c8...]


    let temX = 0;
    let temY = 0;
    // esto corresponde a cada casilla, x, y = el punto medio de la casilla para dibujar
    for (let numb = 8; numb >= 1; numb--) {

      let y;
      if (temY === 0) {
        y = halfSizeBoxY;
        temY = y;
      } else {
        y = temY + sizeBoxY;
        temY = y;
      }

      for (let letter = 1; letter <= 8; letter++) {

        let x;
        if (temX === 0) {
          x = halfSizeBoxX;
          temX = x
        } else {
          x = temX + sizeBoxX;
          temX = x;
        }

        // console.log(x, y);


        // this.contextCanvas.fillStyle = 'red';
        // this.contextCanvas.fillRect(x, y, 1, 1);


        // console.log('letra ', letters[letter]);
        const element: MatrizBoardBox = {
          matrizLetter: letter,
          matrizNumber: numb,
          name: `${letters[letter]}${numb}`,
          letter: letters[letter],
          numb,
          x,
          y
        };

        this.matrizBoardBox.push(element);
        // console.log('numero ', numb);

      }

      temX = 0;
    }
    // console.log(this.matrizBoardBox);
    // console.log(this.pieces);
    this.initialPositionOnMatriz();

  }

  initialPositionOnMatriz() {

    let j = 31;
    for (let i = 0; i < 16; i++) {
      this.matrizBoardBox[i].piece = this.pieces[j];
      j--;
    }

    let jj = 0;

    for (let i = 63; i > 47; i--) {
      this.matrizBoardBox[i].piece = this.pieces[jj];
      jj++;
    }

    console.log(this.matrizBoardBox);

  }


  executeMove(sFrom: string, sTo: string) {

    const elementFromIndex = this.matrizBoardBox.findIndex(mbb => mbb.name === sFrom);
    const elementToIndex = this.matrizBoardBox.findIndex(mbb => mbb.name === sTo);
    const elementFrom = this.matrizBoardBox[elementFromIndex];
    const elementTo = this.matrizBoardBox[elementToIndex];

    if (elementFrom && elementTo) {

      if (!elementTo.piece) {
        // No es una captura
        this.matrizBoardBox[elementToIndex].piece = this.matrizBoardBox[elementFromIndex].piece;
        this.matrizBoardBox[elementFromIndex].piece = null;
      } else {
        // TODO: es una captura
      }

      const latestPoint = [elementFrom.x, elementFrom.y];
      const newPoint = [elementTo.x, elementTo.y];
      const newAngle = this.getNewAngle(latestPoint, newPoint, this.currentAngle);
      this.drawRoute(elementFrom, elementTo,this.currentAngle, newAngle);

    } else {
      console.log('error al obtener casillas de movimiento');
      // TODO: mostrar error

    }

    console.log('this.matrizBoardBox ', this.matrizBoardBox);


  }


  onChangeShowCanvas(event: Event) {
    this.showingCanvas = !this.showingCanvas;
  }


  async drawRoute(elementFrom: MatrizBoardBox, elementTo: MatrizBoardBox, oldAngle, newAngle) {


    const colour = elementTo?.piece?.color ? elementTo?.piece?.color : "#3d34a5";
    const strokeWidth = 25;

    const bristleCount = Math.round(strokeWidth / 3);

    const bristles = await this.makeBrush(strokeWidth, colour);
    bristles.forEach(bristle => {

      const bristleOriginX = elementFrom.x - strokeWidth / 2 + bristle.distance;
      const start = bristle.distance - strokeWidth / 2;
      // const bristleOriginX = this.rotatePoint(start, oldAngle, elementFrom.x );

      const bristleDestinationX = elementTo.x - strokeWidth / 2 + bristle.distance;

      this.contextCanvas.beginPath();
      this.contextCanvas.moveTo(bristleOriginX, elementFrom.y);
      this.contextCanvas.strokeStyle = bristle.color;
      this.contextCanvas.lineWidth = 2;
      this.contextCanvas.lineCap = "round";
      this.contextCanvas.lineJoin = "round";
      this.contextCanvas.lineTo(bristleDestinationX, elementTo.y);
      this.contextCanvas.stroke();

    });


    const gap = strokeWidth / bristleCount;
    for (let i = 0; i < bristleCount; i++) {

      // Drawing state
      this.contextCanvas.beginPath();
      this.contextCanvas.moveTo(elementFrom.x + i * gap, elementFrom.y);
      this.contextCanvas.strokeStyle = colour;
      this.contextCanvas.lineWidth = 2;
      this.contextCanvas.lineCap = "round";
      this.contextCanvas.lineJoin = "round";
      this.contextCanvas.lineTo(elementTo.x + i * gap, elementTo.y);
      this.contextCanvas.stroke();

    }

  }


  makeBrush(size: number, color) {
    const brush: Brush[] = [];
    const strokeWidth = size;
    let bristleCount = Math.round(size / 3);
    const gap = strokeWidth / bristleCount;
    for (let i = 0; i < bristleCount; i++) {
      const distance =
        i === 0 ? 0 : gap * i + Math.random() * gap / 2 - gap / 2;
      brush.push({
        distance,
        thickness: Math.random() * 2 + 2,
        color
      });
    }
    return brush;
  };

  varyColour(sourceColour) {
    const varyBrightness = 5;
    const amount = Math.round(Math.random() * 2 * varyBrightness);
    const c = tinycolor(sourceColour);
    const varied =
      amount > varyBrightness
        ? c.brighten(amount - varyBrightness)
        : c.darken(amount);
    return varied.toHexString();
  }

  rotatePoint(distance, angle, origin) {
    return [
      origin[0] + distance * Math.cos(angle),
      origin[1] + distance * Math.sin(angle)
    ];
  }

  getBearing(origin, destination) {
    return (Math.atan2(destination[1] - origin[1], destination[0] - origin[0]) - Math.PI / 2) % (Math.PI * 2);
  }

  angleDiff(angleA, angleB) {
    const twoPi = Math.PI * 2;
    const diff =
      (angleA - (angleB > 0 ? angleB : angleB + twoPi) + Math.PI) % twoPi -
      Math.PI;
    return diff < -Math.PI ? diff + twoPi : diff;
  };

  getNewAngle(origin, destination, oldAngle) {
    const bearing = this.getBearing(origin, destination);
    return oldAngle - this.angleDiff(oldAngle, bearing);
  };


  // obsolete -----------------
  lineBluer(elementFrom: MatrizBoardBox, elementTo: MatrizBoardBox) {
    this.contextCanvas.lineCap = "round";
    this.contextCanvas.lineJoin = "round";
    this.background("rgba(255, 255, 255, .00001");
    this.contextCanvas.strokeStyle = elementTo.piece?.color;

    console.log(elementFrom);
    console.log(elementTo);


    this.contextCanvas.beginPath();
    console.log('drawing');

    this.contextCanvas.lineWidth = 20;
    this.contextCanvas.globalCompositeOperation = 'source-over';
    this.contextCanvas.filter = `blur(15px) opacity(25%)`;
    this.contextCanvas.stroke();
    this.contextCanvas.lineWidth = 17;
    this.contextCanvas.globalCompositeOperation = 'darken';
    this.contextCanvas.filter = `blur(15px) opacity(50%)`;

    // this.contextCanvas.moveTo(pMouseX, pMouseY);
    this.contextCanvas.moveTo(elementFrom.x, elementFrom.y);

    const xOffset = (Math.random() - .5) * 30,
      yOffset = (Math.random() - .5) * 30;
    this.contextCanvas.lineTo(elementTo.x + xOffset, elementTo.y + yOffset);
    this.contextCanvas.stroke();

    this.contextCanvas.closePath();
  }
  background(color) {
    this.contextCanvas.beginPath();
    this.contextCanvas.rect(0, 0, this.board.view.width, this.board.view.height);
    this.contextCanvas.fillStyle = color;
    this.contextCanvas.fill();
    this.contextCanvas.closePath();
  }
  ///--------------------------


  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    console.log('color ', color);

    return color;
  }

}

