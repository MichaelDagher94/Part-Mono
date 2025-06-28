import { TestBed } from '@angular/core/testing';

import { JourniesFacadeService } from './journies-facade.service';

describe('JourniesFacadeService', () => {
  let service: JourniesFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JourniesFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
