import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteesNoticeHealthComponent } from './guarantees-notice-health.component';

describe('GuaranteesNoticeHealthComponent', () => {
  let component: GuaranteesNoticeHealthComponent;
  let fixture: ComponentFixture<GuaranteesNoticeHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuaranteesNoticeHealthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuaranteesNoticeHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
