import { Component, OnInit } from '@angular/core';

import { Chess } from 'chess.js';
import { COLOR, INPUT_EVENT_TYPE, MOVE_INPUT_MODE, Chessboard } from 'cm-chessboard/src/cm-chessboard/Chessboard.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() {

  }
  ngOnInit(): void {
    const board = new Chessboard(document.getElementById('board1'), {
      position: 'rn2k1r1/ppp1pp1p/3p2p1/5bn1/P7/2N2B2/1PPPPP2/2BNK1RR',
      moveInputMode: MOVE_INPUT_MODE.dragPiece,
      style: {aspectRatio: 0.9}
    });
    board.enableMoveInput((event) => {
      // handle user input here
      switch (event.type) {
        case INPUT_EVENT_TYPE.moveStart:
            console.log(`moveStart: ${event.square}`)
            // return `true`, if input is accepted/valid, `false` aborts the interaction, the piece will not move
            return true
        case INPUT_EVENT_TYPE.moveDone:
            console.log(`moveDone: ${event.squareFrom}-${event.squareTo}`)
            // return true, if input is accepted/valid, `false` takes the move back
            return true
        case INPUT_EVENT_TYPE.moveCanceled:
            console.log(`moveCanceled`)
    }


    });
  }



}
