import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-new-choose',
  templateUrl: './new-choose.component.html',
  styleUrls: ['./new-choose.component.scss'],
})
export class NewChooseComponent implements OnInit {

  constructor(
    private popoverController: PopoverController
  ) { }

  ngOnInit() { }

  choose(option: 'new' | 'current') {
    this.popoverController.dismiss(option);
  }


}
