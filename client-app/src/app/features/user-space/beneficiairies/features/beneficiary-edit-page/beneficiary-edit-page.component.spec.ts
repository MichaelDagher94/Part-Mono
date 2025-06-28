import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryEditPageComponent } from './beneficiary-edit-page.component';

describe('BeneficiaryEditPageComponent', () => {
  let component: BeneficiaryEditPageComponent;
  let fixture: ComponentFixture<BeneficiaryEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiaryEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
