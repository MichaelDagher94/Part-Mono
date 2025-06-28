import { TestBed } from '@angular/core/testing';

import { MyDocumentsFacadeService } from './my-documents-facade.service';

describe('MyDocumentsFacadeService', () => {
  let service: MyDocumentsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyDocumentsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
