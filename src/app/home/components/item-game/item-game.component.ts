import { Component, OnInit, Input } from '@angular/core';

import { Game } from '../../../models/game.model';

@Component({
  selector: 'app-item-game',
  templateUrl: './item-game.component.html',
  styleUrls: ['./item-game.component.scss'],
})
export class ItemGameComponent implements OnInit {

  @Input() game: Game;

  constructor() { }

  ngOnInit() {
    console.log('el juego ', this.game);
    
  }

}
