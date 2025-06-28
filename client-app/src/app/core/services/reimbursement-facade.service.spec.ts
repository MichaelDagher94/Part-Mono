import { TestBed } from '@angular/core/testing';

import { ReimbursementFacadeService } from './reimbursement-facade.service';

describe('ReimbursementFacadeService', () => {
  let service: ReimbursementFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReimbursementFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
