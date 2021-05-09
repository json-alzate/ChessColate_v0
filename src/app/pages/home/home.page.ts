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
import { Game, Move } from '../../models/game.model';
import { Phrase } from '../../models/phrase.model';

// components
import { NewChooseComponent } from './components/new-choose/new-choose.component';

// services
import { GamesStorageService } from '../../services/games-storage.service';
import { MessagesService } from '../../services/messages.service';
import { PhrasesService } from '../../services/phrases.service';


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
  turn: 'white' | 'black';

  countGames: number;

  gamesSearched: Game[] = [];
  allGames: Game[] = [];

  loadingDots: boolean;

  activeSplash = true;
  phrase: Phrase;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private modalController: ModalController,
    public popoverController: PopoverController,
    private alertController: AlertController,
    private gamesStorageService: GamesStorageService,
    private messagesService: MessagesService,
    private phrasesService: PhrasesService
  ) {
    this.phrase = this.phrasesService.getOnePhrase();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.activeSplash = false;
      this.changeDetectorRef.markForCheck();
    }, 3000);
    this.getGames();
  }

  ionViewDidEnter() {
    this.loadBoard();
  }

  getGames() {

    this.gamesStorageService.getGames().then(data => {
      this.gamesSearched = JSON.parse(data.value);
      this.orderGameSearched();
      this.allGames = JSON.parse(data.value);
      this.countGames = this.gamesSearched ? this.gamesSearched.length : 0;
      this.changeDetectorRef.markForCheck();
    });

  }


  async loadBoard() {
    this.board = await new Chessboard(document.getElementById('board1'), {
      position: 'start',
      sprite: { url: '/assets/images/chessboard-sprite.svg' },
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

            if (theMove.color === 'b') {
              this.turn = 'white';
            } else {
              this.turn = 'black';
            }

            this.board.setPosition(this.chessInstance.fen()).then(() => {
              this.isLastMove = false;
              this.isFirstMove = false;
              if (this.currentGame) {

                console.log('current game ', this.currentGame);

                const currentMoveNumber = this.currentGame.currentMoveNumber;
                const onStepForward = currentMoveNumber ? currentMoveNumber + 1 : 1;
                this.currentGame.currentMoveNumber = onStepForward; // revisar que sucede en la navegación si lo suma de mas?
                console.log('esto ', onStepForward);

                if (onStepForward === this.currentGame.movesFEN.length) { // es la ultima jugada
                  console.log('0');

                  // se guarda el movimiento en la partida
                  const chessHistory = this.chessInstance.history();
                  // TODO se puede eliminar?
                  // this.currentGame.movesHuman = this.chessInstance.pgn(); // 1.e4 e5 2.Cc3
                  this.currentGame.moves = [...this.currentGame.moves, objectMove];
                  // this.currentGame.movesFEN = [...this.currentGame.movesFEN, this.board.getPosition()];
                  this.currentGame.movesFEN = [...this.currentGame.movesFEN, this.chessInstance.fen()];
                  this.currentGame.movesHumanHistoryRow = [...this.currentGame.movesHumanHistoryRow, chessHistory[chessHistory.length - 1]];

                  this.gamesStorageService.updateGame(this.currentGame);
                  this.searchGameByFen(this.chessInstance.fen());

                } else {
                  console.log('1');

                  // cuando el movimiento no es el ultimo y es diferente al que sigue
                  if (this.currentGame.movesFEN[onStepForward] !== this.chessInstance.fen()) {

                    console.log('2');
                    // TODO se debe guardar no solo el movimiento actual, sino el ultimo movimiento de la partida actual, 
                    // para que lo encuentre el buscador
                    this.presentAlertPrompt(objectMove, 'current');

                  } else { // si el siguiente movimiento de la partida es igual al que se realiza manualmente
                    console.log('3');
                    this.moveNext();
                  }
                }


              } else {
                this.presentAlertPrompt(objectMove);
              }
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

  setBoardPosition(fen: string) {

    if (fen) {
      this.board.setPosition(fen, true).then(() => {
        this.searchGameByFen(fen);
        if (fen === 'start') {
          fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        }
        this.chessInstance.load(fen);
      });
    }

  }


  doRefresh() {
    this.currentGame = null;
    this.isFirstMove = true;
    this.isLastMove = true;
    this.setBoardPosition('start');
    this.turn = 'white';
  }

  // new game
  async openNewChoose(ev) {
    const popover = await this.popoverController.create({
      component: NewChooseComponent,
      event: ev
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data) {
      this.presentAlertPrompt(null, data);
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
          text: 'Cancelar', se esta guardando la jugada del negro dos veces se debe guardar es la ultima jugada del oponente blanco en este caso
          role: 'cancel',
          handler: () => {
            if (fromPopover === 'new' || !fromPopover) {
              this.doRefresh();
            } else {
              // TODO se devuelve la jugada por que se cancelo el guardado de una variante
            }
          }
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

    let movesFEN = move ? [this.chessInstance.fen()] : [];
    let moves = [];
    let currentMoveNumber;

    if (this.currentGame) {
      currentMoveNumber = this.currentGame.currentMoveNumber;
    }

    if (move && !this.currentGame) {
      moves = [move];
    } else if (move && this.currentGame) {
      moves = [this.currentGame.moves[currentMoveNumber], move];
      movesFEN = [this.currentGame.movesFEN[currentMoveNumber], this.chessInstance.fen()];
    }
    // TODO crear dos objetos otro para cuando se guarda desde una posición para que el buscador
    // lo ubique se guarda con el ultimo historial conocido de la partida actual

    console.log('juego actual ', this.currentGame);
    console.log('history  ', this.chessInstance.history());
    console.log('pgn  ', this.chessInstance.pgn());



    const newObject: Game = {
      id: uuidv4(),
      name,

      movesFEN,
      // TODO ¿se puede eliminar?
      // movesHuman: this.chessInstance.pgn(),
      movesHumanHistoryRow: this.chessInstance.history(),

      moves,
      isShowing: true,
      inFavorites: false
    };


    this.gamesStorageService.saveGame(newObject);
    this.currentGame = newObject;
    this.getGames();
    this.messagesService.showToast('Juego creado!');
    this.changeDetectorRef.markForCheck();
  }

  onClickOnGame(game: Game) {
    this.setBoardPosition(game.movesFEN[0]);
    this.currentGame = game;
    this.currentGame.currentMoveNumber = 0;
    this.isFirstMove = game.movesFEN.length >= 0 ? true : false;
    this.isLastMove = (game.movesFEN.length <= 1) ? true : false;
  }



  // Navigation in game
  moveInitial() {
    this.currentGame.currentMoveNumber = 0;
    this.isFirstMove = true;
    this.isLastMove = false;
    const fen = this.currentGame.movesFEN[0];
    this.setBoardPosition(fen);
  }

  moveBack() {
    if (this.currentGame.currentMoveNumber > 0) {

      this.currentGame.currentMoveNumber = this.currentGame.currentMoveNumber - 1;
      const fen = this.currentGame.movesFEN[this.currentGame.currentMoveNumber];

      if (this.currentGame.currentMoveNumber < 1) {
        this.isFirstMove = true;
      }
      this.isLastMove = false;
      this.setBoardPosition(fen);
    }
  }

  moveNext() {

    if (this.currentGame.currentMoveNumber < this.currentGame.movesFEN.length - 1) {
      this.currentGame.currentMoveNumber = this.currentGame.currentMoveNumber + 1;
      const fen = this.currentGame.movesFEN[this.currentGame.currentMoveNumber];
      if (this.currentGame.currentMoveNumber === this.currentGame.movesFEN.length - 1) {
        this.isLastMove = true;
      }
      this.isFirstMove = false;
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


  // Favorites
  addToFavorites() {
    this.currentGame.inFavorites = true;
    this.gamesStorageService.updateGame(this.currentGame);
  }

  removeFromFavorites() {
    this.currentGame.inFavorites = false;
    this.gamesStorageService.updateGame(this.currentGame);
  }

  // delete
  async confirmDeleteGame(game: Game) {
    const alert = await this.alertController.create({
      header: '¿Eliminar el juego?',
      message: 'No podrás recuperarlo.',
      cssClass: 'ion-text-center',
      buttons: [
        {
          text: 'Conservar',
          role: 'cancel',
        }, {
          text: 'Eliminar',
          cssClass: 'alert-btn-one-delete',
          handler: () => {
            this.onDeleteGame(game);
          }
        }
      ]
    });

    await alert.present();
  }

  onDeleteGame(game: Game) {
    this.gamesStorageService.deleteGame(game).then(() => {
      this.getGames();
      this.messagesService.showToast('Juego eliminado...', 'danger');
    });
  }

  // search
  searchGameByFen(fen: string) {

    this.loadingDots = true;
    if (fen === 'start') {
      this.getGames();
      this.loadingDots = false;
      return;
    }
    if (this.allGames) {
      const gamesResult: Game[] = [];
      this.allGames.forEach(game => {
        const find = game.movesFEN.find(moveFen => {
          const fenGameSpliced = moveFen.split(' ');
          const fenToSearchSpliced = fen.split(' ');

          if (fenGameSpliced[0] === fenToSearchSpliced[0]) {
            return moveFen;
          }

        });

        if (find && game.id !== this.currentGame.id) {
          gamesResult.push(game);
        }
      });
      this.gamesSearched = gamesResult;
      this.orderGameSearched();
      this.loadingDots = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  orderGameSearched() {
    const temSearched = this.gamesSearched?.sort((obj1, obj2) => {
      if (obj1.name > obj2.name) {
        return 1;
      }
      if (obj1.name < obj2.name) {
        return -1;
      }
      return 0;
    });

    this.gamesSearched = temSearched ? temSearched : [];
  }


  openSettings() { }

}
