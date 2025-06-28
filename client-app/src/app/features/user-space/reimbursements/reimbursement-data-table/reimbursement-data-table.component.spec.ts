import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementDataTableComponent } from './reimbursement-data-table.component';

describe('ReimbursementDataTableComponent', () => {
  let component: ReimbursementDataTableComponent;
  let fixture: ComponentFixture<ReimbursementDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbursementDataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
