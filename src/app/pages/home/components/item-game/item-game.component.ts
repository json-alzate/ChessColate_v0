import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Game } from '../../../../models/game.model';

@Component({
  selector: 'app-item-game',
  templateUrl: './item-game.component.html',
  styleUrls: ['./item-game.component.scss'],
})
export class ItemGameComponent implements OnInit {

  game: Game;

  @Input()
  set setGame(game: Game) {
    this.setHumanMoves(game);
  }
  @Output() clicked = new EventEmitter<Game>();
  @Output() delete = new EventEmitter<Game>();

  constructor() { }

  ngOnInit() { }

  onClickItem() {
    this.clicked.emit(this.game);
  }

  setHumanMoves(game: Game) {

    let movesHuman = '';
    const moves = game.movesHumanHistoryRow;
    let countMoves = 1;


    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < moves.length; i = i + 2) {

      const reyB = '<span class="figure">&#x2654;</span>';
      const damaB = '<span class="figure">&#x2655;</span>';
      const torreB = '<span class="figure-t">&#x2656;</span>';
      const alfilB = '<span class="figure">&#x2657;</span>';
      const caballoB = '<span class="figure">&#x2658;</span>';

      const reyN = '<span class="figure">&#x265A;</span>';
      const damaN = '<span class="figure">&#x265B;</span>';
      const torreN = '<span class="figure-t">&#x265C;</span>';
      const alfilN = '<span class="figure">&#x265D;</span>';
      const caballoN = '<span class="figure">&#x265E;</span>';

      const moveW = moves[i].replace('N', caballoB).replace('B', alfilB).replace('R', torreB).replace('Q', damaB).replace('K', reyB);
      const moveB = moves[i + 1] ? ' ' + moves[i + 1].replace('N', caballoN).replace('B', alfilN).replace('R', torreN)
        .replace('Q', damaN).replace('K', reyN) : '';
      movesHuman += `&nbsp;&nbsp;&nbsp;<b>${countMoves}.</b>${moveW}${moveB}`;
      countMoves++;
    }

    game.movesHuman = movesHuman;
    this.game = game;
  }

  deleteGame() {
    this.delete.emit(this.game);
  }

}
