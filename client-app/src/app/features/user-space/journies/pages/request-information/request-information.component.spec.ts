import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestInformationComponent } from './request-information.component';

describe('RequestInformationComponent', () => {
  let component: RequestInformationComponent;
  let fixture: ComponentFixture<RequestInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
