import { TestBed } from '@angular/core/testing';

import { FirstLoginModalFacadeService } from './first-login-modal-facade.service';

describe('FirstLoginModalFacadeService', () => {
  let service: FirstLoginModalFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstLoginModalFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
