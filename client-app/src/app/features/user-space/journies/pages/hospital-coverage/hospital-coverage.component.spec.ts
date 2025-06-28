import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalCoverageComponent } from './hospital-coverage.component';

describe('HospitalCoverageComponent', () => {
  let component: HospitalCoverageComponent;
  let fixture: ComponentFixture<HospitalCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalCoverageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
