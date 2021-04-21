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


  constructor() { }


  getGames() {

    return Storage.get({
      key: 'ChessColate_games'
    });

  }

  updateGame(game: Game) {

    delete game.currentMoveNumber;

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

    delete game.currentMoveNumber;

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
