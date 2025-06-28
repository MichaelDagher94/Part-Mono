import { TestBed } from '@angular/core/testing';

import { TpCardsFacadeService } from './tp-cards-facade.service';

describe('TpCardsFacadeService', () => {
  let service: TpCardsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TpCardsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
