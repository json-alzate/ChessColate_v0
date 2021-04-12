import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';

import { Chess } from 'chess.js';
import {
  COLOR,
  INPUT_EVENT_TYPE,
  MOVE_INPUT_MODE,
  Chessboard
} from 'cm-chessboard/src/cm-chessboard/Chessboard.js';


// models
import { Game } from '../models/game.model';

// components
import { NewChooseComponent } from './components/new-choose/new-choose.component';

// services
import { GamesStoreService } from '../services/games-store.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit {

  board;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private modalController: ModalController,
    public popoverController: PopoverController,
    private alertController: AlertController
  ) {

  }

  ngOnInit(): void {
  }

  ionViewDidEnter() {
    this.loadBoard();
  }

  async loadBoard() {
    this.board = await new Chessboard(document.getElementById('board1'), {
      position: 'start',
      moveInputMode: MOVE_INPUT_MODE.dragPiece
    });
    this.board.enableMoveInput((event) => {
      // handle user input here
      switch (event.type) {
        case INPUT_EVENT_TYPE.moveStart:
          console.log(`moveStart: ${event.square}`);
          // return `true`, if input is accepted/valid, `false` aborts the interaction, the piece will not move
          return true;
        case INPUT_EVENT_TYPE.moveDone:
          console.log(`moveDone: ${event.squareFrom}-${event.squareTo}`);
          // return true, if input is accepted/valid, `false` takes the move back
          return true;
        case INPUT_EVENT_TYPE.moveCanceled:
          console.log(`moveCanceled`);
      }
    });
    this.changeDetectorRef.markForCheck();
  }


  async openNewChoose(ev) {
    const popover = await this.popoverController.create({
      component: NewChooseComponent,
      event: ev
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data && data === 'new') {
      this.presentAlertPrompt();
    }

  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      message: 'Escribe un nombre para guardarla',
      backdropDismiss: false,
      cssClass: 'alert-new-name',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Guardar',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  openSettings() {

  }



}
