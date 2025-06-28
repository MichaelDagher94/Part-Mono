import { TestBed } from '@angular/core/testing';

import { GuaranteeFacadeService } from './guarantee-facade.service';

describe('GuaranteeFacadeService', () => {
  let service: GuaranteeFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuaranteeFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
