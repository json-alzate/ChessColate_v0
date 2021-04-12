import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board-actions-buttons',
  templateUrl: './board-actions-buttons.component.html',
  styleUrls: ['./board-actions-buttons.component.scss'],
})
export class BoardActionsButtonsComponent implements OnInit {

  @Output() newGame = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  clickNew($event) {
    this.newGame.emit($event);
  }

}
