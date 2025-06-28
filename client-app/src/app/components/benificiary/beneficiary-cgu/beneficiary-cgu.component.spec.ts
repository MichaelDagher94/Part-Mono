import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryCguComponent } from './beneficiary-cgu.component';

describe('BeneficiaryCguComponent', () => {
  let component: BeneficiaryCguComponent;
  let fixture: ComponentFixture<BeneficiaryCguComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiaryCguComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryCguComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
