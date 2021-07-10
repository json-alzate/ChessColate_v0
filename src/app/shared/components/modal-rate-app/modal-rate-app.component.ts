import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-modal-rate-app',
  templateUrl: './modal-rate-app.component.html',
  styleUrls: ['./modal-rate-app.component.scss'],
})
export class ModalRateAppComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  close(option: 'after' | 'yes' | 'no') {
    this.modalController.dismiss(option);
  }
}
