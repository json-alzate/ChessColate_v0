import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import { Chess } from 'chess.js';
import {
  COLOR,
  INPUT_EVENT_TYPE,
  MOVE_INPUT_MODE,
  Chessboard
} from 'cm-chessboard/src/cm-chessboard/Chessboard.js';


// models
import { Game } from '../models/game.model';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit {

  board;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private storage: Storage
  ) {

  }

  ngOnInit(): void {
  }
  
  ionViewDidEnter(){
    this.loadBoard();
  }

  async loadBoard() {    
    this.board =  await new Chessboard(document.getElementById('board1'), {
      position: 'start',
      moveInputMode: MOVE_INPUT_MODE.dragPiece
    });
    this.board.enableMoveInput((event) => {
      // handle user input here
      switch (event.type) {
        case INPUT_EVENT_TYPE.moveStart:
          console.log(`moveStart: ${event.square}`);
          // return `true`, if input is accepted/valid, `false` aborts the interaction, the piece will not move
          return true;
        case INPUT_EVENT_TYPE.moveDone:
          console.log(`moveDone: ${event.squareFrom}-${event.squareTo}`);
          // return true, if input is accepted/valid, `false` takes the move back
          return true;
        case INPUT_EVENT_TYPE.moveCanceled:
          console.log(`moveCanceled`);
      }
    });
    this.changeDetectorRef.markForCheck();
  }


  openSettings() {

  }



}
