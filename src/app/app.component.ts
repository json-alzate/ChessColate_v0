import { Component, OnInit } from '@angular/core';
import { Capacitor, Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { AppRateService } from '@services/app-rate.service';

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
    private screenOrientation: ScreenOrientation,
    private appRateService: AppRateService
  ) {
    SplashScreen.hide();
    if (Capacitor.getPlatform() !== 'web') {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

  ngOnInit() {
    this.appRateService.validateAppRate();
  }


}
