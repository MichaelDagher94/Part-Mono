import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiairiesComponent } from './beneficiairies.component';

describe('BeneficiairiesComponent', () => {
  let component: BeneficiairiesComponent;
  let fixture: ComponentFixture<BeneficiairiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiairiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiairiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
