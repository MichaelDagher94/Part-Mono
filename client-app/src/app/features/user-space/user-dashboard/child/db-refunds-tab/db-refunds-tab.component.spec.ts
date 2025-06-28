import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbRefundsTabComponent } from './db-refunds-tab.component';

describe('DbRefundsTabComponent', () => {
  let component: DbRefundsTabComponent;
  let fixture: ComponentFixture<DbRefundsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbRefundsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbRefundsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
