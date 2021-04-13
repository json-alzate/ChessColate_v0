import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


import { Game } from "../models/game.model";

@Injectable({
  providedIn: 'root'
})
export class GamesStoreService {

  public games;

  constructor(
    private storage: Storage
  ) { }

  loadGames() {

  }

  getGames() {

  }

  updateGame(game: Game) {
    console.log('game to update ', game);

  }

  updateGames() {

  }

  saveGame(game: Game) {
    console.log('game to save ', game);
  }



}
