import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryDeleteComponent } from './beneficiary-delete.component';

describe('BeneficiaryDeleteComponent', () => {
  let component: BeneficiaryDeleteComponent;
  let fixture: ComponentFixture<BeneficiaryDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiaryDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
