import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteesNoticeForesightComponent } from './guarantees-notice-foresight.component';

describe('GuaranteesNoticeForesightComponent', () => {
  let component: GuaranteesNoticeForesightComponent;
  let fixture: ComponentFixture<GuaranteesNoticeForesightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuaranteesNoticeForesightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuaranteesNoticeForesightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
