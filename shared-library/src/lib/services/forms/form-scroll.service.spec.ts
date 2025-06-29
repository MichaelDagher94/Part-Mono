import { TestBed } from '@angular/core/testing';

import { FormScrollService } from './form-scroll.service';

describe('FormScrollService', () => {
  let service: FormScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
