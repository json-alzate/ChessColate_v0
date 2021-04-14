import { Injectable } from '@angular/core';

// import { Storage } from '@capacitor/storage';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

import { Observable } from 'rxjs';

import { Game } from '../models/game.model';

// variables local storage
// ChessColate_games

@Injectable({
  providedIn: 'root'
})
export class GamesStorageService {

  public games;
  public observerGames: Observable<Game[]>;

  constructor() { }


  async loadGames() {


    this.observerGames = new Observable(observer => {
      Storage.get({
        key: 'ChessColate_games'
      }).then(data => {
        console.log('data ', data.value);
        this.games = JSON.parse(data.value);
        observer.next(this.games);
      });
    });

    this.observerGames.subscribe(games => {
      console.log('service games ', games);

    });


  }


  getGames() {
    if (!this.games) {
      this.loadGames();
    }
    return this.games;
  }


  getObserverGames() {
    return this.observerGames;
  }


  updateGame(game: Game) {
    Storage.get({
      key: 'ChessColate_games'
    }).then(data => {
      const games = JSON.parse(data.value) as Game[];
      games.splice(games.findIndex(a => a.id === game.id), 1);
      games.push(game);
      Storage.set({
        key: 'ChessColate_games',
        value: JSON.stringify(games)
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

}
