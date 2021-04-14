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
  currentMove: string;
  currentMoveFem: string;

  gamesSearched: Game[] = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private modalController: ModalController,
    public popoverController: PopoverController,
    private alertController: AlertController,
    private gamesStorageService: GamesStorageService
  ) {

    this.gamesStorageService.getObserverGames().subscribe(games =>{
      console.log('estos son los games sub', games);
    });

  }

  ngOnInit(): void {
    this.gamesSearched = this.gamesStorageService.getGames();
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
      console.log('event ', event);

      switch (event.type) {
        case INPUT_EVENT_TYPE.moveStart:
          console.log(`moveStart: ${event.square}`);
          // return `true`, if input is accepted/valid, `false` aborts the interaction, the piece will not move
          return true;
        case INPUT_EVENT_TYPE.moveDone:
          const objectMove = { from: event.squareFrom, to: event.squareTo };
          const theMove = this.chessInstance.move(objectMove);

          if (theMove) {
            this.board.setPosition(this.chessInstance.fen());
            if (this.currentGame) {
              this.currentGame.pgn = this.chessInstance.pgn(); // 1.e4 e5 2.Cc3
              this.currentGame.moves = [...this.currentGame.moves, objectMove];
            } else {
              this.presentAlertPrompt(objectMove);
            }
          }
          // return true, if input is accepted/valid, `false` takes the move back
          return theMove;
        case INPUT_EVENT_TYPE.moveCanceled:
          console.log(`moveCanceled`);
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
      this.presentAlertPrompt();
    }

  }


  async presentAlertPrompt(move?: Move) {
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
      movesFEM: [currentPosition],
      pgn: this.chessInstance.pgn(),
      moves,
      isShowing: true,
      inFavorites: false
    };
    this.gamesStorageService.saveGame(newObject);
    this.currentGame = newObject;
    this.currentMoveFem = currentPosition;
    this.changeDetectorRef.markForCheck();
  }


  openSettings() { }

}
