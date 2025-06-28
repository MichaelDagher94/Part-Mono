import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteesForesightContentComponent } from './guarantees-foresight-content.component';

describe('GuaranteesForesightContentComponent', () => {
  let component: GuaranteesForesightContentComponent;
  let fixture: ComponentFixture<GuaranteesForesightContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuaranteesForesightContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuaranteesForesightContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
