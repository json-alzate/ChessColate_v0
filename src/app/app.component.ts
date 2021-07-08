import { Component } from '@angular/core';
import { Capacitor, Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';


// variables local storage
// ChessColate_games
// ChessColate_tutorial
// chesscolate_readyRate
// chesscolate_lastDateShowRate



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private screenOrientation: ScreenOrientation
  ) {
    SplashScreen.hide();
    if (Capacitor.getPlatform() !== 'web') {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }
}
