import { TestBed } from '@angular/core/testing';

import { BeneficiaryFacadeService } from './beneficiary-facade.service';

describe('BeneficiaryFacadeService', () => {
  let service: BeneficiaryFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiaryFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
