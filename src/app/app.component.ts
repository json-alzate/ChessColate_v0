import { Component } from '@angular/core';

// services
import { GamesStorageService } from './services/games-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private gamesStorageService: GamesStorageService
  ) {
    this.gamesStorageService.loadGames();
  }
}
