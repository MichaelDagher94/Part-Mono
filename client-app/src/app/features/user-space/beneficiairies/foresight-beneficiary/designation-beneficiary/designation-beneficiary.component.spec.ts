import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationBeneficiaryComponent } from './designation-beneficiary.component';

describe('DesignationBeneficiaryComponent', () => {
  let component: DesignationBeneficiaryComponent;
  let fixture: ComponentFixture<DesignationBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationBeneficiaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
