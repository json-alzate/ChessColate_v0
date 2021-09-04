import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { from, Observable, Subscriber } from 'rxjs';


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

  syncGames(uidUser: string) {

    this.getRemoteGames(uidUser).subscribe(remoteGames => {
      this.gamesStorageService.getGames().then(data => {
        const localGames: Game[] = JSON.parse(data.value) as Game[];
        this.applySyncGames(remoteGames, localGames);
      });
    });

  }

  applySyncGames(remoteGames: Game[], localGames: Game[]) {

    // graba de juego en juego cada vez que se carga el perfil aunque muestre los 5 que estan firestore
    remoteGames?.forEach( async game => {
      console.log('el juego remoto ', game);
      if(!localGames?.find(g => g.id === game.id)) {
        console.log('a grabar');
        await this.gamesStorageService.saveGame(game);
      }
    });


    localGames?.forEach(async game => {
      if(!remoteGames.find(g => g.id === game.id)) {
        await this.saveGameInFirestore(game).toPromise().then(() => {});
      }
    });

    console.log('sync complete!!!');
    

  }

  readLocalGames(uidUser: string) {
    this.gamesStorageService.getGames().then(data => {
      const allGames: Game[] = JSON.parse(data.value) as Game[];

      allGames?.forEach(game => {

        if (!game.syncFirestore) {
          const gameToUpdate: Game = { ...game, syncFirestore: true, uidUser };
          this.saveGameInFirestore(game).toPromise().then(() => {
            this.gamesStorageService.updateGame(gameToUpdate, true);
          });
        }

      });

    });
  }


  getRemoteGames(uidUser: string): Observable<Game[]> {
    let gameToAdd: Game;
    const objectGames: Game[] = [];

    const promise = new Promise((resolve, reject) => {

      this.angularFirestore.collection<Game>('games-cheat', ref => {
        return ref.where('uidUser', '==', uidUser);
      }).get().subscribe(result => {
        const docs = result.docs;
        docs.forEach(doc => {
          gameToAdd = doc.data() as Game;
          gameToAdd.id = doc.id;
          objectGames.push(gameToAdd);
        });

        resolve(objectGames);

      });

    });

    return from<Promise<Game[]>>(promise as unknown as Promise<Game[]>);
  }


  saveGameInFirestore(game: Game): Observable<Game> {
    const toReturn = this.angularFirestore.collection<Game>('games-cheat').doc(game.id).set({
      ...game
    });
    return from<Promise<Game>>(toReturn as unknown as Promise<Game>);
  }


  updateGame(game: Game) {
    const toReturn = this.angularFirestore.doc(`games-cheat/${game.id}`).update({
      ...game
    });
    return from<Promise<Game>>(toReturn as unknown as Promise<Game>);
  }


  deleteGame(uidGame: string) {
    const toReturn = this.angularFirestore.doc(`games-cheat/${uidGame}`).delete();
    return from<Promise<Game>>(toReturn as unknown as Promise<Game>);
  }


}
