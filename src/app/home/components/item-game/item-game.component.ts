import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Game } from '../../../models/game.model';

@Component({
  selector: 'app-item-game',
  templateUrl: './item-game.component.html',
  styleUrls: ['./item-game.component.scss'],
})
export class ItemGameComponent implements OnInit {

  @Input() game: Game;
  @Output() clicked = new EventEmitter<Game>();

  constructor() { }

  ngOnInit() {
  }

  onClickItem() {
    this.clicked.emit(this.game);
  }

}
