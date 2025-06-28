import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitsContentComponent } from './benefits-content.component';

describe('BenefitsContentComponent', () => {
  let component: BenefitsContentComponent;
  let fixture: ComponentFixture<BenefitsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenefitsContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenefitsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
