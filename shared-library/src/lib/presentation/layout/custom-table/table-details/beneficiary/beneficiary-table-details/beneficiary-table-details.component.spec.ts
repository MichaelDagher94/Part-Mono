import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryTableDetailsComponent } from './beneficiary-table-details.component';

describe('BeneficiaryTableDetailsComponent', () => {
  let component: BeneficiaryTableDetailsComponent;
  let fixture: ComponentFixture<BeneficiaryTableDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiaryTableDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryTableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
