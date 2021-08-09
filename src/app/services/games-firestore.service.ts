import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { from, Observable } from 'rxjs';


import { GamesStorageService } from '@services/games-storage.service';

import { Game } from '@models/game.model'

@Injectable({
  providedIn: 'root'
})
export class GamesFirestoreService {

  constructor(
    private readonly angularFirestore: AngularFirestore,
    private gamesStorageService: GamesStorageService
  ) { }


  readLocalGames(uidUser: string) {
    this.gamesStorageService.getGames().then(data => {
      const allGames: Game[] = JSON.parse(data.value) as Game[];

      allGames.forEach(game => {

        if( !game.syncFirestore){

          const gameToUpdate: Game = {...game, syncFirestore: true, uidUser};

          this.saveGameInFirestore(game).toPromise().then(() => {
            this.gamesStorageService.updateGame(gameToUpdate);
          });
        }

      });

    });
  }


  saveGameInFirestore(game: Game): Observable<Game> {
    const toReturn = this.angularFirestore.collection<Game>('games-cheat').doc(game.id).set({
      ...game
    });
    return from<Promise<Game>>(toReturn as unknown as Promise<Game>);
  }

}