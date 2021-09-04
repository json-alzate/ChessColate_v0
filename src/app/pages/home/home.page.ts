// core and third party libraries
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { Store, select } from '@ngrx/store';

import { v4 as uuidv4 } from 'uuid';
import Chess from 'chess.js';
import {
  COLOR,
  INPUT_EVENT_TYPE,
  MOVE_INPUT_MODE,
  Chessboard
} from 'cm-chessboard/src/cm-chessboard/Chessboard.js';

// rxjs
import { Observable } from 'rxjs';


// states
import { AppState } from '@redux/states/app.state'


// actions

// selectors
import { getProfile } from '@redux/selectors/profile.selector';


// models
import { Game, Move } from '@models/game.model';
import { Profile } from '@models/profile.model';


// services
import { GamesStorageService } from '@services/games-storage.service';
import { GamesFirestoreService } from '@services/games-firestore.service';
import { MessagesService } from '@services/messages.service';

// components
import { ModalSearchGameComponent } from './components/modal-search-game/modal-search-game.component';



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

  whitTextInBoxSearchName: boolean;
  gamesSearched: Game[] = [];
  allGames: Game[] = [];

  remoteGames: Game[] = [];


  readyTutorial = false;
  readyDidEnter = false;

  profile: Profile;
  profile$: Observable<Profile>;


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private modalController: ModalController,
    public popoverController: PopoverController,
    private alertController: AlertController,
    private gamesStorageService: GamesStorageService,
    private messagesService: MessagesService,
    private gamesFirestoreService: GamesFirestoreService,
    private store: Store<AppState>
  ) {

    Storage.get({
      key: 'ChessColate_tutorial'
    }).then(data => {
      if (data?.value === 'ready_1') {
        this.readyTutorial = true;
      }
    });

    this.listenNeedReadAllGames();
  }


  ngOnInit(): void {
    this.getGames();
    this.listenProfile();
  }


  ionViewDidEnter() {
    if (!this.readyDidEnter) {
      this.loadBoard();
      this.readyDidEnter = true;
    }
  }


  listenNeedReadAllGames() {
    this.gamesStorageService.readAllGames.subscribe(() => this.getGames());
  }


  listenProfile() {
    this.profile$ = this.store.pipe(
      select(getProfile)
    );
    this.profile$.subscribe(profile => {
      this.profile = profile;
      if(this.profile){
        this.gamesFirestoreService.syncGames(this.profile.uid);
      }
    });
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
      // sprite: { url: '/assets/images/chessboard-sprite.svg' }
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
                const currentMoveNumber = this.currentGame.currentMoveNumber;
                const onStepForward = currentMoveNumber ? currentMoveNumber + 1 : 1;
                this.currentGame.currentMoveNumber = onStepForward; // revisar que sucede en la navegación si lo suma de mas?

                if (onStepForward === this.currentGame.movesFEN.length) { // es la ultima jugada

                  // se guarda el movimiento en la partida
                  const chessHistory = this.chessInstance.history();
                  this.currentGame.moves = [...this.currentGame.moves, objectMove];
                  // this.currentGame.movesFEN = [...this.currentGame.movesFEN, this.board.getPosition()];
                  this.currentGame.movesFEN = [...this.currentGame.movesFEN, this.chessInstance.fen()];
                  this.currentGame.movesHumanHistoryRow = [...this.currentGame.movesHumanHistoryRow, chessHistory[chessHistory.length - 1]];

                  this.gamesStorageService.updateGame(this.currentGame);
                  this.updateGameOnFirestore();
                  this.searchGameByFen(this.chessInstance.fen());

                } else {

                  // cuando el movimiento no es el ultimo y es diferente al que sigue
                  if (this.currentGame.movesFEN[onStepForward] !== this.chessInstance.fen()) {

                    this.presentAlertPrompt(objectMove, 'current');

                  } else { // si el siguiente movimiento de la partida es igual al que se realiza manualmente
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
        if (this.chessInstance.turn() === 'w') {
          this.turn = 'white';
        } else {
          this.turn = 'black';
        }
      });
    }

  }

  doRefresh() {
    this.currentGame = null;
    this.isFirstMove = true;
    this.isLastMove = true;
    this.setBoardPosition('start');
    this.turnRoundBoard('w');
    this.turn = 'white';
  }

  turnRoundBoard(orientation?: 'w' | 'b') {
    let orientationToSave = orientation;
    if (orientation) {
      this.board.setOrientation(orientation);
    } else {
      if (this.board.getOrientation() === 'w') {
        this.board.setOrientation('b');
        orientationToSave = 'b';
      } else {
        this.board.setOrientation('w')
        orientationToSave = 'w';
      }
    }

    if (this.currentGame) {
      this.currentGame.orientation = orientationToSave;
      this.gamesStorageService.updateGame(this.currentGame);
      this.updateGameOnFirestore();
    }


  }


  // new game
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
          role: 'cancel',
          handler: () => {
            if (fromPopover === 'new' || !fromPopover) {
              this.doRefresh();
            } else {
              // se devuelve la jugada por que se cancelo el guardado de una variante
              this.setBoardPosition(this.currentGame.movesFEN[this.currentGame.currentMoveNumber - 1]);
              this.currentGame.currentMoveNumber = this.currentGame.currentMoveNumber - 1;
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
    let nameFrom: string;
    const movesHumanHistoryRow: string[] = this.chessInstance.history();
    if (!this.readyTutorial) {
      this.readyTutorial = true;
      this.markTutorialReady();
    }

    if (this.currentGame) {
      // se resta 1 para que no guarde el historial con la jugada del mismo color sino del oponente
      currentMoveNumber = this.currentGame.currentMoveNumber - 1;
      nameFrom = this.currentGame.name;
      if (this.turn === 'white') {
        movesHumanHistoryRow.unshift(this.currentGame.movesHumanHistoryRow[currentMoveNumber]);
      } else {
        // importante mantener este orden de unshift
        movesHumanHistoryRow.unshift(this.currentGame.movesHumanHistoryRow[currentMoveNumber]);
        movesHumanHistoryRow.unshift('...');
      }
    }

    if (move && !this.currentGame) {
      moves = [move];
    } else if (move && this.currentGame) {
      moves = [this.currentGame.moves[currentMoveNumber], move];
      movesFEN = [this.currentGame.movesFEN[currentMoveNumber], this.chessInstance.fen()];
    }

    let uidUser;
    if (this.profile) {
      uidUser = this.profile.uid;
    }

    const newObject: Game = {
      id: uuidv4(),
      name,
      nameFrom,
      uidUser,
      movesFEN,
      movesHumanHistoryRow,
      moves,
      isShowing: true,
      inFavorites: false
    };

    this.gamesStorageService.saveGame(newObject);

    this.currentGame = newObject;
    if (this.currentGame) {
      this.currentGame.currentMoveNumber = 1;
      this.isLastMove = true;
      this.searchGameByFen(this.chessInstance.fen());
    } else {
      this.getGames();
    }
    this.messagesService.showToast('Juego creado!');
    this.changeDetectorRef.markForCheck();
  }

  onClickOnGame(game: Game) {
    if (game.orientation) {
      this.turnRoundBoard(game.orientation);
    }
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
    this.updateGameOnFirestore();
  }

  removeFromFavorites() {
    this.currentGame.inFavorites = false;
    this.gamesStorageService.updateGame(this.currentGame);
    this.updateGameOnFirestore();
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
      if (game.syncFirestore) {
        this.gamesFirestoreService.deleteGame(game.id);
      }
    });
  }


  // search
  searchGameByFen(fen: string) {

    if (fen === 'start') {
      this.getGames();
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


  async activeSearchByName() {
    const modal = await this.modalController.create({
      component: ModalSearchGameComponent,
      componentProps: { allGames: this.allGames }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.gameChosen) {
      this.onClickOnGame(data.gameChosen);
    }

  }

  // tutorial
  markTutorialReady() {
    Storage.set({
      key: 'ChessColate_tutorial',
      value: 'ready_1'
    });
  }

  openSettings() { }


  // update game on firestore
  updateGameOnFirestore() {
    if (this.profile && this.currentGame.syncFirestore) {
      const gameToFirestore: Game = {
        ...this.currentGame,
        uidUser: this.profile.uid
      };
      this.gamesFirestoreService.updateGame(gameToFirestore).toPromise().then(() => { });
    }

  }

}
