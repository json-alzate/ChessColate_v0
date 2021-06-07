import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { Game } from '../../../../models/game.model';

@Component({
  selector: 'app-modal-search-game',
  templateUrl: './modal-search-game.component.html',
  styleUrls: ['./modal-search-game.component.scss'],
})
export class ModalSearchGameComponent implements OnInit {

  @Input() allGames: Game[] = [];
  gamesSearchedByName: Game[] = [];


  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.gamesSearchedByName = this.allGames;
  }

  onSearchByName(event) {
    const query = event.detail?.value.toLowerCase();
    if (query && this.allGames) {
      this.gamesSearchedByName = [];
      this.allGames.forEach(item => {
        const shouldShow = item.name.toLowerCase().indexOf(query) > -1;
        if (shouldShow) {
          this.gamesSearchedByName.push(item);
        }
      });
    } else {
      this.gamesSearchedByName = this.allGames;
    }
  }

  onClickOnGame(game: Game) {
    this.modalController.dismiss({ gameChosen: game });
  }

  close() {
    this.modalController.dismiss();
  }

}
