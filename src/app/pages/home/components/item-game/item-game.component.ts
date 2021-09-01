// core and third party libraries
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';

// rxjs

// states
import { AppState } from '@redux/states/app.state'


// actions

// selectors
import { getProfile } from '@redux/selectors/profile.selector';


// models

// services

// components

import { Game } from '@models/game.model';
import { Profile } from '@models/profile.model';

@Component({
  selector: 'app-item-game',
  templateUrl: './item-game.component.html',
  styleUrls: ['./item-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemGameComponent implements OnInit {

  game: Game;
  profile: Profile;

  @Input()
  set setGame(game: Game) {
    this.setHumanMoves(game);
  }
  @Input() showTrash = true;
  @Output() clicked = new EventEmitter<Game>();
  @Output() delete = new EventEmitter<Game>();

  constructor(
    private store: Store<AppState>,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    this.store.pipe(
      select(getProfile)
    ).subscribe(profile => {
      this.profile = profile;
      if (this.game) {
        console.log('otra vez');

        this.setHumanMoves(this.game);
      }
    });

  }

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

      let reyB;
      let damaB;
      let torreB;
      let alfilB;
      let caballoB;
      let reyN;
      let damaN;
      let torreN;
      let alfilN;
      let caballoN;
      console.log(this.profile?.settings?.figures, this.profile);

      if (this.profile?.settings?.figures || !this.profile) {

        reyB = String('<span class="figure"><img  src="assets-images-pieces-wK.svg"></span>').replace(/-/g, "\\");
        damaB = String('<span class="figure"><img  src="assets-images-pieces-wQ.svg"></span>').replace(/-/g, "\\");
        torreB = String('<span class="figure"><img  src="assets-images-pieces-wR.svg"></span>').replace(/-/g, "\\");
        alfilB = String('<span class="figure"><img  src="assets-images-pieces-wB.svg"></span>').replace(/-/g, "\\");
        caballoB = String('<span class="figure"><img  src="assets-images-pieces-wN.svg"></span>').replace(/-/g, "\\");
        reyN = String('<span class="figure"><img  src="assets-images-pieces-bK.svg"></span>').replace(/-/g, "\\");
        damaN = String('<span class="figure"><img  src="assets-images-pieces-bQ.svg"></span>').replace(/-/g, "\\");
        torreN = String('<span class="figure"><img  src="assets-images-pieces-bR.svg"></span>').replace(/-/g, "\\");
        alfilN = String('<span class="figure"><img  src="assets-images-pieces-bB.svg"></span>').replace(/-/g, "\\");
        caballoN = String('<span class="figure"><img  src="assets-images-pieces-bN.svg"></span>').replace(/-/g, "\\");
      } else {
        reyB = 'R';
        damaB = 'D';
        torreB = 'T';
        alfilB = 'A';
        caballoB = 'C';
        reyN = 'R';
        damaN = 'D';
        torreN = 'T';
        alfilN = 'A';
        caballoN = 'C';
      }

      // const reyB = '<span class="figure">&#x2654;</span>';
      // const damaB = '<span class="figure">&#x2655;</span>';
      // const torreB = '<span class="figure-t">&#x2656;</span>';
      // const alfilB = '<span class="figure">&#x2657;</span>';
      // const caballoB = '<span class="figure">&#x2658;</span>';

      // const reyN = '<span class="figure">&#x265A;</span>';
      // const damaN = '<span class="figure">&#x265B;</span>';
      // const torreN = '<span class="figure-t">&#x265C;</span>';
      // const alfilN = '<span class="figure">&#x265D;</span>';
      // const caballoN = '<span class="figure">&#x265E;</span>';

      const moveW = moves[i].replace('N', caballoB).replace('B', alfilB).replace('R', torreB).replace('Q', damaB).replace('K', reyB);
      const moveB = moves[i + 1] ? ' ' + moves[i + 1].replace('N', caballoN).replace('B', alfilN).replace('R', torreN)
        .replace('Q', damaN).replace('K', reyN) : '';
      movesHuman += `&nbsp;&nbsp;&nbsp;<b>${countMoves}.</b>${moveW}${moveB}`;
      countMoves++;
    }

    game.movesHuman = movesHuman;
    this.game = game;
    this.changeDetectorRef.markForCheck();
  }

  deleteGame() {
    this.delete.emit(this.game);
  }

}
