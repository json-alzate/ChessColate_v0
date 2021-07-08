import { Injectable } from '@angular/core';

import { AppRate } from '@ionic-native/app-rate/ngx';

@Injectable({
  providedIn: 'root'
})
export class AppRateService {

  constructor(
    private appRate: AppRate
  ) { }


  launchRate() {
    // const objt = {
    //   useLanguage: 'es',
    //   displayAppName: 'ChessColate',
    //   promptAgainForEachNewVersion: true,
    //   usesUntilPrompt: 3,
    //   storeAppURL: {
    //     // ios: '< my_app_id >',
    //     android: 'market://details?id=com.jheison.chesscolate'
    //   },
    //   simpleMode: true,
    //   customLocale: {
    //     title: 'Te gusta %@?',
    //     message: 'Si te gusta %@. consideras calificarla?',
    //     cancelButtonLabel: 'No, gracias',
    //     laterButtonLabel: 'Recuerdamelo luego',
    //     rateButtonLabel: 'Calificarla'
    //   },
    //   callbacks: {
    //     onRateDialogShow: function (callback) {
    //       console.log('User Prompt for Rating');
    //     },
    //     onButtonClicked: function (buttonIndex) {
    //       console.log('Selected Button Index', buttonIndex);
    //     }
    //   }
    // };
    // this.appRate.setPreferences(objt);

    // this.appRate.preferences.useLanguage = 'es';

    // this.appRate.setPreferences({
    //   useLanguage: 'es'
    // });
    // this.appRate.navigateToAppStore();


    // .storeAppURL = {
    // ios: '<app_id>',
    // android: 'market://details?id=com.jheison.chesscolate'
    // windows: 'ms-windows-store://review/?ProductId=<store_id>'
    // }

    // this.appRate.promptForRating(false);

        // tslint:disable-next-line: no-string-literal
        const appRate: any = window['AppRate'];
        const preferences = appRate.getPreferences();
        preferences.simpleMode = true;
        preferences.storeAppURL = {
          android: 'market://details?id=com.jheison.chesscolate'
        };
        appRate.setPreferences(preferences);
        appRate.promptForRating(true);
    
  }

}
