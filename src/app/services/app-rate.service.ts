import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Storage } from '@capacitor/storage';
import { AppRate } from '@ionic-native/app-rate/ngx';

import { differenceInDays } from 'date-fns';

import { ModalRateAppComponent } from '@shared/components/modal-rate-app/modal-rate-app.component';

@Injectable({
  providedIn: 'root'
})
export class AppRateService {

  constructor(
    private appRate: AppRate,
    private modalController: ModalController
  ) { }

  validateAppRate() {
    Storage.get({
      key: 'chesscolate_readyRate'
    }).then(data => {

      if (data?.value !== 'yes' && data?.value !== 'no') {

        Storage.get({
          key: 'chesscolate_countDateAppRate'
        }).then(dataCount => {
          if (dataCount?.value) {

            const result = differenceInDays(
              new Date().getTime(), // +++
              new Date(Number(dataCount.value)) // ---
            );

            if (result >= 3) {
              setTimeout(() => {
                this.launchRate();
              }, 4000);
            }

          } else {
            this.setCountDateAppRate();
          }

        });

      }

    });
  }

  setCountDateAppRate() {

    Storage.set({
      key: 'chesscolate_countDateAppRate',
      value: String(new Date().getTime())
    });

  }

  async launchRate() {
    const modal = await this.modalController.create({
      component: ModalRateAppComponent,
      showBackdrop: true,
      cssClass: 'modal-rate',
      backdropDismiss: false
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data === 'after') {

      this.setCountDateAppRate();

    } else if (data === 'yes') {

      Storage.set({
        key: 'chesscolate_readyRate',
        value: 'yes'
      });

      this.rateApp();

    } else {

      Storage.set({
        key: 'chesscolate_readyRate',
        value: 'no'
      });

    }
  }

  rateApp() {

    // tslint:disable-next-line: no-string-literal
    const appRate: any = window['AppRate'];
    const preferences = appRate.getPreferences();
    preferences.simpleMode = true;
    preferences.storeAppURL = {
      android: 'market://details?id=com.jheison.chesscolate'
    };
    appRate.setPreferences(preferences);
    appRate.navigateToAppStore();
    // appRate.promptForRating(false);

  }

}
