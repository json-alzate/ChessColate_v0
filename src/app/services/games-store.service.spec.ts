import { TestBed } from '@angular/core/testing';

import { GamesStoreService } from './games-store.service';

describe('GamesStoreService', () => {
  let service: GamesStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamesStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
