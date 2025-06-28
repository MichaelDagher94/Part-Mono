import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbActualityComponent } from './db-actuality.component';

describe('DbActualityComponent', () => {
  let component: DbActualityComponent;
  let fixture: ComponentFixture<DbActualityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbActualityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbActualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
