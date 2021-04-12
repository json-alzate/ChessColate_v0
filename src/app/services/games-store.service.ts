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

  updateGames() {

  }

  saveGame() {

  }



}
