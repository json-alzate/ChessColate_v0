import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board-actions-buttons',
  templateUrl: './board-actions-buttons.component.html',
  styleUrls: ['./board-actions-buttons.component.scss'],
})
export class BoardActionsButtonsComponent implements OnInit {

  @Input() isFirstMove: boolean;
  @Input() isLastMove: boolean;

  @Output() newGame = new EventEmitter();

  @Output() moveBack = new EventEmitter();
  @Output() moveBackAll = new EventEmitter();
  @Output() moveFront = new EventEmitter();
  @Output() moveFrontAll = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log(this.isFirstMove);
    
   }

  clickNew($event) {
    this.newGame.emit($event);
  }

  emitMoveBackAll(){
    this.moveBackAll.emit();
  }
  emitMoveBack(){
    this.moveBack.emit();
  }
  emitMoveFront(){
    this.moveFront.emit();
  }
  emitMoveFrontAll(){
    this.moveFrontAll.emit();
  }

}
