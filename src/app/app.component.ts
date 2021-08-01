// core and third party libraries
import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import  firebase  from 'firebase/app';


// rxjs

// states

// actions

// selectors

// models

// services
import { AppRateService } from '@services/app-rate.service';
import { AuthService } from '@services/auth.service';

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
    private authService: AuthService
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
        // const usersRef = this.angularFirestore.firestore.collection('Users').doc(fbUser.uid);
        // usersRef.get().then((doc) => {
        // });
      } else {
        console.log('sin usuario logueado')
      }
    });
  }


}
