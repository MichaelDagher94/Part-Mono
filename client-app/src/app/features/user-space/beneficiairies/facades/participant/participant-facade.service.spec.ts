import { TestBed } from '@angular/core/testing';

import { ParticipantFacadeService } from './participant-facade.service';

describe('ParticipantFacadeService', () => {
  let service: ParticipantFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
