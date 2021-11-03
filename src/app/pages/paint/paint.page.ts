import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

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

  contextCanvas: any;


  board;
  chessInstance = new Chess();
  turn: 'white' | 'black';

  readyDidEnter = false;
  isEnableDarkMode: boolean;


  pieces: Piece[] = [
    { piece: 'W_TR', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_CR', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_AR', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_RR', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_DD', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_AD', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_CD', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_TD', color: '#36abe0', positionStart: '', positionEnd: '' },

    { piece: 'W_PH', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_PG', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_PF', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_PE', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_PD', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_PC', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_PB', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'W_PA', color: '#36abe0', positionStart: '', positionEnd: '' },

    { piece: 'B_TR', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_CR', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_AR', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_RR', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_DD', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_AD', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_CD', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_TD', color: '#36abe0', positionStart: '', positionEnd: '' },

    { piece: 'B_PH', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_PG', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_PF', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_PE', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_PD', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_PC', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_PB', color: '#36abe0', positionStart: '', positionEnd: '' },
    { piece: 'B_PA', color: '#36abe0', positionStart: '', positionEnd: '' },


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


        this.contextCanvas.fillStyle = 'red';
        this.contextCanvas.fillRect(x, y, 1, 1);


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
    console.log(this.pieces);
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
    console.log('elementTo ', elementTo);
    console.log('elementFrom ', elementFrom);

    if (elementFrom && elementTo) {

      if (!elementTo.piece) {
        // No es una captura
        this.matrizBoardBox[elementToIndex].piece = this.matrizBoardBox[elementFromIndex].piece;
        this.matrizBoardBox[elementFromIndex].piece = null;
      } else {
        // TODO: es una captura
      }

      this.drawRoute(elementFrom, elementTo);

    } else {
      console.log('error al obtener casillas de movimiento');
      // TODO: mostrar error

    }

    console.log('this.matrizBoardBox ', this.matrizBoardBox);


  }


  onChangeShowCanvas(event: Event) {
    this.showingCanvas = !this.showingCanvas;
  }


  drawRoute(elementFrom: MatrizBoardBox, elementTo: MatrizBoardBox){
  
  }

}  





// const canvas = document.getElementById('myCanvas');
// let c = canvas.getContext("2d");
// width = window.innerWidth;
// height = window.innerHeight;
// canvas.width = width;
// canvas.height = height;

// var mouseX, mouseY, pMouseX, pMouseY;
// let baseR, baseG, baseB;
// let color;
// setup();



// function setup() {
//     width = window.innerWidth;
//     height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;

//     baseR = Math.floor(Math.random() * 255);
//     baseG = Math.floor(Math.random() * 255);
//     baseB = Math.floor(Math.random() * 255);

//     color = `rgba(${baseR}, ${baseG}, ${baseB})`;

//     background("rgba(255, 255, 255, 0.00025)");
//     draw();
// };

// function draw() {
//     c.lineCap = "round";
//     c.lineJoin = "round";
//     background("rgba(255, 255, 255, .00001");
//     c.strokeStyle = color;

//     c.beginPath();
//     c.lineWidth = 30;
//     c.globalCompositeOperation = 'source-over';
//     c.filter = `blur(30px) opacity(5%)`;
//     c.stroke();
//     c.lineWidth = 28;
//     c.globalCompositeOperation = 'darken';
//     c.filter = `blur(30px) opacity(10%)`;
//     c.moveTo(pMouseX, pMouseY);

//     const xOffset = (Math.random() - .5) * 30,
//     yOffset = (Math.random() - .5) * 30;
//     c.lineTo(mouseX + xOffset, mouseY + yOffset);
//     c.stroke();
//     c.closePath();

//     setTimeout(draw, 10);
// };

// function background(color) {
//     c.beginPath();
//     c.rect(0, 0, width, height);
//     c.fillStyle = color;
//     c.fill();
//     c.closePath();
// }

// document.onmousemove = function (e) {
//     pMouseX = mouseX;
//     pMouseY = mouseY;
//     mouseX = e.clientX;
//     mouseY = e.clientY;
// };

// window.onresize = function (event) {
//     setup();
// };

// document.onkeydown = function () {
//     console.log('hi');
//     color = `rgba(${Math.floor(Math.random() * baseR)},
//     ${Math.floor(Math.random() * baseG)},
//     ${Math.floor(Math.random() * baseB)})`;
//     console.log(color);

// }