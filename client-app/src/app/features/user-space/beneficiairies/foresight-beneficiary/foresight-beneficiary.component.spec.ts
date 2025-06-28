import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForesightBeneficiaryComponent } from './foresight-beneficiary.component';

describe('ForesightBeneficiaryComponent', () => {
  let component: ForesightBeneficiaryComponent;
  let fixture: ComponentFixture<ForesightBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForesightBeneficiaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForesightBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
