import { TestBed } from '@angular/core/testing';

import { AuthenticationFacadeService } from './authentication-facade.service';

describe('AuthFacadeService', () => {
  let service: AuthenticationFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
