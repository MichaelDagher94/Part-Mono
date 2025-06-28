import { TestBed } from '@angular/core/testing';

import { DocumentFacadeService } from './document-facade.service';

describe('DocumentFacadeService', () => {
  let service: DocumentFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
