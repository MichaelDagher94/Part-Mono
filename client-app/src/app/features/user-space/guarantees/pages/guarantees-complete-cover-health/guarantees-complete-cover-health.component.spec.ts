import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteesCompleteCoverHealthComponent } from './guarantees-complete-cover-health.component';

describe('GuaranteesCompleteCoverHealthComponent', () => {
  let component: GuaranteesCompleteCoverHealthComponent;
  let fixture: ComponentFixture<GuaranteesCompleteCoverHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuaranteesCompleteCoverHealthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuaranteesCompleteCoverHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
