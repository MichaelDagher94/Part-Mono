import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpCardsComponent } from './tp-cards.component';

describe('TpCardsComponent', () => {
  let component: TpCardsComponent;
  let fixture: ComponentFixture<TpCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TpCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TpCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
