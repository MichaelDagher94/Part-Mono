import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRefundsTableDetailsComponent } from './my-refunds-table-details.component';

describe('MyRefundsTableDetailsComponent', () => {
  let component: MyRefundsTableDetailsComponent;
  let fixture: ComponentFixture<MyRefundsTableDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRefundsTableDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRefundsTableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
