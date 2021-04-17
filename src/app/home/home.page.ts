import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';

import { v4 as uuidv4 } from 'uuid';

import Chess from 'chess.js';

import {
  COLOR,
  INPUT_EVENT_TYPE,
  MOVE_INPUT_MODE,
  Chessboard
} from 'cm-chessboard/src/cm-chessboard/Chessboard.js';


// models
import { Game, Move } from '../models/game.model';

// components
import { NewChooseComponent } from './components/new-choose/new-choose.component';

// services
import { GamesStorageService } from '../services/games-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit {

  board;
  chessInstance = new Chess();

  currentGame: Game;


  isFirstMove = true;
  isLastMove = true;

  countGames: number;

  gamesSearched: Game[] = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private modalController: ModalController,
    public popoverController: PopoverController,
    private alertController: AlertController,
    private gamesStorageService: GamesStorageService
  ) {

  }

  ngOnInit(): void {
    this.gamesSearched = this.gamesStorageService.getGames();
    this.countGames = this.gamesSearched ? this.gamesSearched.length : 0;
  }

  ionViewDidEnter() {
    this.loadBoard();
  }


  async loadBoard() {
    this.board = await new Chessboard(document.getElementById('board1'), {
      position: 'start',
      moveInputMode: MOVE_INPUT_MODE.dragPiece
    });
    this.board.enableMoveInput((event) => {
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
            this.board.setPosition(this.chessInstance.fen()).then(() => {

              if (this.currentGame) {
                // TODO validar tercera forma de nuevo (cuando el movimiento no es el ultimo y es diferente al que sigue)
                // se guarda el movimiento en la partida
                this.currentGame.pgn = this.chessInstance.pgn(); // 1.e4 e5 2.Cc3
                this.currentGame.moves = [...this.currentGame.moves, objectMove];
                this.currentGame.movesFEN = [...this.currentGame.movesFEN, this.board.getPosition()];
                console.log(this.currentGame.movesFEN);

                this.gamesStorageService.updateGame(this.currentGame);

              } else {
                this.presentAlertPrompt(objectMove);
              }
            });


          }
          // return true, if input is accepted/valid, `false` takes the move back
          return theMove;
        case INPUT_EVENT_TYPE.moveCanceled:
          console.log('moveCanceled ', this.chessInstance.pgn());
      }
    });
    this.changeDetectorRef.markForCheck();
  }


  async openNewChoose(ev) {
    const popover = await this.popoverController.create({
      component: NewChooseComponent,
      event: ev
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data && data === 'new') {
      this.presentAlertPrompt(null, 'new');
    }

  }


  async presentAlertPrompt(move?: Move, fromPopover?: 'new' | 'current') {
    const alert = await this.alertController.create({
      message: 'Escribe un nombre para guardarla',
      backdropDismiss: false,
      cssClass: 'alert-new-name',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Guardar',
          handler: (data) => {
            if (fromPopover === 'new') {
              this.setBoardPosition('start');
            }
            this.newGame(data.name, move);
          }
        }
      ]
    });

    await alert.present();
  }

  newGame(name: string, move?: Move) {
    const currentPosition = this.board.getPosition();
    let moves = [];
    if (move) {
      moves = [move];
    }
    const newObject: Game = {
      id: uuidv4(),
      name,
      movesFEN: [currentPosition],
      pgn: this.chessInstance.pgn(),
      moves,
      isShowing: true,
      inFavorites: false
    };
    this.gamesStorageService.saveGame(newObject);
    this.currentGame = newObject;
    this.changeDetectorRef.markForCheck();
  }


  onClickOnGame(game: Game) {
    this.setBoardPosition(game.movesFEN[0]);
    this.currentGame = game;
    this.currentGame.currentMoveNumber = 0;
    this.isFirstMove = true;
    this.isLastMove = game.movesFEN[0].length === 1 ? true : false;
  }



  setBoardPosition(fen: string) {
    this.board.setPosition(fen, true);
    this.chessInstance.clear();
    this.chessInstance.load_pgn(`[fen "${fen}"]`);
  }




  moveInitial() {
    this.currentGame.currentMoveNumber = 0;
    this.isFirstMove = true;
    this.isLastMove = false;
    const fen = this.currentGame.movesFEN[0];
    this.setBoardPosition(fen);
  }

  moveBack() {
    if (this.currentGame.currentMoveNumber < 0) {

      this.currentGame.currentMoveNumber = this.currentGame.currentMoveNumber - 1;
      const fen = this.currentGame.movesFEN[this.currentGame.currentMoveNumber];

      if (this.currentGame.currentMoveNumber > 1) {
        this.isFirstMove = true;
      }
      if (this.currentGame.currentMoveNumber < (this.currentGame.movesFEN.length - 1) && this.isLastMove) {
        this.isLastMove = false;
      }

      this.setBoardPosition(fen);
    }
  }

  moveNext() {
    if (this.currentGame.currentMoveNumber < 0) {

      this.currentGame.currentMoveNumber = this.currentGame.currentMoveNumber - 1;
      const fen = this.currentGame.movesFEN[this.currentGame.currentMoveNumber];

      if (this.currentGame.currentMoveNumber > 1) {
        this.isFirstMove = true;
      }

      this.setBoardPosition(fen);
    }
  }

  moveEnd() {
    const movesLength = this.currentGame.movesFEN.length - 1;
    this.currentGame.currentMoveNumber = movesLength;
    this.isLastMove = true;
    this.isFirstMove = false;
    const fen = this.currentGame.movesFEN[movesLength];
    this.setBoardPosition(fen);
  }




  openSettings() { }

}
