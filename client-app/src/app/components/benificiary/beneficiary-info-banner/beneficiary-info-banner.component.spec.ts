import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryInfoBannerComponent } from './beneficiary-info-banner.component';

describe('BeneficiaryInfoBannerComponent', () => {
  let component: BeneficiaryInfoBannerComponent;
  let fixture: ComponentFixture<BeneficiaryInfoBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiaryInfoBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryInfoBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
