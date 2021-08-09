// core and third party libraries
import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Store, select } from '@ngrx/store';

// rxjs

// states
import { AppState } from '@redux/states/app.state'

// actions
import { setProfile } from '@redux/actions/profile.actions';

// selectors

// models
import { Profile } from '@models/profile.model';

// services
import { AppRateService } from '@services/app-rate.service';
import { AuthService } from '@services/auth.service';
import { GamesFirestoreService } from '@services/games-firestore.service';

// components





// variables local storage
// ChessColate_games
// ChessColate_tutorial

// chesscolate_readyRate
// chesscolate_countDateAppRate

// chesscolate_lastDateOpenApp
// chesscolate_timesOpenApp



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly angularFirestore: AngularFirestore,
    private screenOrientation: ScreenOrientation,
    private appRateService: AppRateService,
    private authService: AuthService,
    private gamesFirestoreService: GamesFirestoreService,
    private store: Store<AppState>
  ) {
    SplashScreen.hide();
    if (Capacitor.getPlatform() !== 'web') {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
    this.listenerAuth();
  }

  ngOnInit() {
    this.appRateService.validateAppRate();
  }

  listenerAuth() {
    this.authService.getAuthState().subscribe((fbUser: firebase.User) => {
      if (fbUser) {
        console.log('listo el usuario ', fbUser);
        const usersRef = this.angularFirestore.firestore.collection('Users').doc(fbUser.uid);
        usersRef.get().then((doc) => {
          console.log('el doc ', doc);
          if (doc.exists) {
            const profile: Profile = { ...doc.data() as Profile, uid: doc.id };
            this.setProfile(profile);
          } else {

            this.registerUserOnFirestore(fbUser);
          }
        });
        this.gamesFirestoreService.readLocalGames(fbUser.uid);
      } else {
        console.log('sin usuario logueado')
      }
    });
  }

  setProfile(profile: Profile) {
    const action = setProfile({ profile });
    this.store.dispatch(action);
  }

  registerUserOnFirestore(fbUser) {
    const profile: Profile = {
      uid: fbUser.uid,
      email: fbUser.email,
      avatarUrl: fbUser.photoURL,
      name: fbUser.displayName,
      createdAt: new Date().getTime(),
      settings: {
        figures: true
      }
    };
    this.authService.createDocumentUser(profile).toPromise().then(() => this.setProfile(profile));

  }


}
