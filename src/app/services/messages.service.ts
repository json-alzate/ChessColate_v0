import { Injectable } from '@angular/core';

import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(public toastController: ToastController) { }

  async showToast(message: string, color?: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000
    });
    toast.present();
  }
}
