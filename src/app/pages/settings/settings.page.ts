import { Component, OnInit } from '@angular/core';

import { environment } from '@environments/environment';

import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  version = environment.versionName;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  loginGoogle() {
    this.authService.loginGoogle();
  }

}
