// core and third party libraries
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '@environments/environment';
import { Store, select } from '@ngrx/store';

// rxjs

// states
import { AppState } from '@redux/states/app.state'

// actions
import { logOut, setProfile } from '@redux/actions/profile.actions';

// selectors
import { getProfile } from '@redux/selectors/profile.selector';

// models
import { Profile, Settings } from '@models/profile.model';

// services
import { AuthService } from '@services/auth.service';
import { AppRateService } from '@services/app-rate.service';

// components




@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  version = environment.versionName;
  profile: Profile;

  figures = true;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private appRateService: AppRateService
  ) {
  }

  ngOnInit() {
    this.listenProfile();
  }


  listenProfile() {
    this.store.pipe(
      select(getProfile)
    ).subscribe(profile => {
      if (profile) {
        this.profile = profile;
        this.figures = profile?.settings?.figures;
      }
    });
  }

  loginGoogle() {
    this.authService.loginGoogle();
  }

  onChangeFigures() {
    const settings = { ...this.profile?.settings, figures: this.figures };
    const profileToUpdate: Profile = { ...this.profile, settings };
    this.authService.updateProfile(profileToUpdate);
    this.updateProfile(profileToUpdate)
  }

  rateApp() {
    this.appRateService.rateApp();
  }

  updateProfile(profile: Profile) {
    const action = setProfile({ profile });
    this.store.dispatch(action);
  }

  onLogout() {
    const action = logOut();
    this.store.dispatch(action);
    this.profile = null;
    this.authService.logout();
  }

}
