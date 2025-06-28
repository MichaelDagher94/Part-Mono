import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailsEditComponent } from './bank-details-edit.component';

describe('BankDetailsEditComponent', () => {
  let component: BankDetailsEditComponent;
  let fixture: ComponentFixture<BankDetailsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankDetailsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
