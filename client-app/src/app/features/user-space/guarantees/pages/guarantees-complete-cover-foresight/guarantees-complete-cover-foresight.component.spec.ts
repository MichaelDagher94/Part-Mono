import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteesCompleteCoverForesightComponent } from './guarantees-complete-cover-foresight.component';

describe('GuaranteesCompleteCoverForesightComponent', () => {
  let component: GuaranteesCompleteCoverForesightComponent;
  let fixture: ComponentFixture<GuaranteesCompleteCoverForesightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuaranteesCompleteCoverForesightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuaranteesCompleteCoverForesightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
