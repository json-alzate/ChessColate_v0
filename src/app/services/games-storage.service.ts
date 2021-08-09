// core and third party libraries
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

// rxjs
import { Observable } from 'rxjs';

// states
import { AppState } from '@redux/states/app.state'

// actions

// selectors
import { getProfile } from '@redux/selectors/profile.selector';

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


  constructor() { }


  getGames() {

    return Storage.get({
      key: 'ChessColate_games'
    });

  }

  updateGame(game: Game) {

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
