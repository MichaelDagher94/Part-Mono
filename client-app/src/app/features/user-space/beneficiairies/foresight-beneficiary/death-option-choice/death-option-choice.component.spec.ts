import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeathOptionChoiceComponent } from './death-option-choice.component';

describe('DeathOptionChoiceComponent', () => {
  let component: DeathOptionChoiceComponent;
  let fixture: ComponentFixture<DeathOptionChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeathOptionChoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeathOptionChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
