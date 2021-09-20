// core and third party libraries
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

// rxjs
import { Observable, Subscriber, Observer } from 'rxjs';


// states

// actions

// selectors

// models
import { Game } from '@models/game.model';

// services

// components



// variables local storage
// ChessColate_games

@Injectable({
  providedIn: 'root'
})
export class GamesStorageService {

  observerNeedReadGames: Subscriber<boolean>;
  public readAllGames: Observable<boolean> = new Observable((observer) => {
    // observable execution
    this.observerNeedReadGames = observer;
  });



  constructor(
  ) { }


  getGames() {

    return Storage.get({
      key: 'ChessColate_games'
    });

  }

  updateGame(game: Game, isFromFirestore?: boolean) {

    // ¿por que lo eliminaba?  8/05/2021
    // delete game.currentMoveNumber;

    Storage.get({
      key: 'ChessColate_games'
    }).then(data => {
      const games = JSON.parse(data.value) as Game[];      
      games.splice(games.findIndex(a => a.id === game.id), 1);
      games.push(game);
      Storage.set({
        key: 'ChessColate_games',
        value: JSON.stringify(games)
      }).then(() => {
        if (isFromFirestore) {
          this.observerNeedReadGames.next(true);
        }
      });
    });
  }


  updateGames(games: Game[]) {
    Storage.set({
      key: 'ChessColate_games',
      value: JSON.stringify(games)
    });
  }


  saveGame(game: Game) {

    // ¿por que lo eliminaba? 8/05/2021
    // delete game.currentMoveNumber;

    Storage.get({
      key: 'ChessColate_games'
    }).then(data => {

      if (data.value) {
        const games = JSON.parse(data.value);
        games.push(game);
        Storage.set({
          key: 'ChessColate_games',
          value: JSON.stringify(games)
        });
      } else {
        Storage.set({
          key: 'ChessColate_games',
          value: JSON.stringify([game])
        });
      }
    });

  }

  saveGames(games: Game[]) {

    return new Observable((observer: Observer<Game[]>) => {

      Storage.get({
        key: 'ChessColate_games'
      }).then(data => {
  
        if (data.value) {
          const gamesInStorage = JSON.parse(data.value) as Game[];          
          const combinedGames: Game[]= [...gamesInStorage, ...games];          
          Storage.set({
            key: 'ChessColate_games',
            value: JSON.stringify(combinedGames)
          }).then(() => {
            observer.next(games);
            observer.complete();
          });
        } else {
          Storage.set({
            key: 'ChessColate_games',
            value: JSON.stringify(games)
          }).then(() => {
            observer.next(games);
            observer.complete();
          });
        }
      });

    });
  }


  async deleteGame(game: Game) {
    return await Storage.get({
      key: 'ChessColate_games'
    }).then(data => {
      const games = JSON.parse(data.value) as Game[];
      games.splice(games.findIndex(a => a.id === game.id), 1);
      Storage.set({
        key: 'ChessColate_games',
        value: JSON.stringify(games)
      });
    });
  }

}
