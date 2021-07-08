import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Capacitor, Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { ModalRateAppComponent } from '@shared/components/modal-rate-app/modal-rate-app.component';

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
export class AppComponent implements OnInit {
  constructor(
    private screenOrientation: ScreenOrientation,
    private modalController: ModalController
  ) {
    SplashScreen.hide();
    if (Capacitor.getPlatform() !== 'web') {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

  ngOnInit(){


    setTimeout(() => {
      this.launchRate();
    }, 3000);

  }


  async launchRate() {
    const modal = await this.modalController.create({
    component: ModalRateAppComponent,
    componentProps: { value: 123 }
    });
  
    await modal.present();
  
  }




}
