import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board-actions-buttons',
  templateUrl: './board-actions-buttons.component.html',
  styleUrls: ['./board-actions-buttons.component.scss'],
})
export class BoardActionsButtonsComponent implements OnInit {

  @Input() isFirstMove: boolean;
  @Input() isLastMove: boolean;

  @Input() turn: 'white' | 'black';

  @Output() newGame = new EventEmitter();

  @Output() moveBack = new EventEmitter();
  @Output() moveInitial = new EventEmitter();
  @Output() moveNext = new EventEmitter();
  @Output() moveEnd = new EventEmitter();
  @Output() turnRound = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  clickNew($event) {
    this.newGame.emit($event);
  }

  emitMoveBackAll() {
    this.moveInitial.emit();
  }

  emitMoveBack() {
    this.moveBack.emit();
  }

  emitMoveFront() {
    this.moveNext.emit();
  }

  emitMoveFrontAll() {
    this.moveEnd.emit();
  }

  emitTurnRound(){
    this.turnRound.emit();
  }

}
