import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficaryAddFormComponent } from './beneficary-add-form.component';

describe('BeneficaryAddFormComponent', () => {
  let component: BeneficaryAddFormComponent;
  let fixture: ComponentFixture<BeneficaryAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficaryAddFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficaryAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
