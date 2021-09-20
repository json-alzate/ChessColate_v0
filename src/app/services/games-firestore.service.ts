import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { from, Observable, Observer, Subscriber } from 'rxjs';


import { GamesStorageService } from '@services/games-storage.service';

import { Game } from '@models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GamesFirestoreService {


  constructor(
    private readonly angularFirestore: AngularFirestore,
    private gamesStorageService: GamesStorageService
  ) { }

  syncGames(uidUser: string) {

    return new Observable((observer: Observer<boolean>) => {

      this.getRemoteGames(uidUser).subscribe(remoteGames => {
        this.gamesStorageService.getGames().then((data) => {
          const localGames: Game[] = JSON.parse(data.value) as Game[];
          this.applySyncGames(remoteGames, localGames, uidUser).subscribe(result => {
            if (result) {
              observer.next(true);
              observer.complete();
            }
          });
        });
      });
    });


  }

  applySyncGames(remoteGames: Game[], localGames: Game[], uidUser: string) {

    return new Observable((observer: Observer<boolean>) => {


      let gameToStorage: Game[] = [];
      remoteGames?.forEach(game => {
        const find = localGames?.find(g => g.id === game.id);
        if (!find) {
          gameToStorage.push(game);
        }
      });

      if (gameToStorage.length > 0) {        
        this.gamesStorageService.saveGames(gameToStorage).toPromise().then(() => {
          observer.next(true);
          observer.complete();
        });
      }

      localGames?.forEach(async game => {
        if (!remoteGames.find(g => g.id === game.id)) {
          await this.saveGameInFirestore(game, uidUser).toPromise().then(() => { });
        }
      });


    });

  }

  readLocalGames(uidUser: string) {
    this.gamesStorageService.getGames().then(async data => {
      const allGames: Game[] = await JSON.parse(data.value) as Game[];
      allGames?.forEach(game => {

        if (!game.syncFirestore) {
          const gameToUpdate: Game = { ...game, syncFirestore: true, uidUser };
          this.saveGameInFirestore(game, uidUser).toPromise().then(() => {
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


  saveGameInFirestore(game: Game, uidUser: string): Observable<Game> {
    const toReturn = this.angularFirestore.collection<Game>('games-cheat').doc(game.id).set({
      ...game, uidUser
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
