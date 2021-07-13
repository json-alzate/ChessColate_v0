import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

import { Phrase } from '@models/phrase.model';

import { PhrasesService } from '@services/phrases.service';


@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  phrase: Phrase;

  constructor(
    private router: Router,
    private phrasesService: PhrasesService
  ) {
    this.phrase = this.phrasesService.getOnePhrase();
  }

  ngOnInit() {
    interval(3000).pipe(take(1)).subscribe(() => this.goToHome());
  }

  goToHome() {
    this.router.navigate(['/tabs/home'], { replaceUrl: true });
  }

}
