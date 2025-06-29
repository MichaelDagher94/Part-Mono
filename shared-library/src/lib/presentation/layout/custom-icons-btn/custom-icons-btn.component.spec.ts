import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomIconsBtnComponent } from './custom-icons-btn.component';

describe('CustomIconsBtnComponent', () => {
  let component: CustomIconsBtnComponent;
  let fixture: ComponentFixture<CustomIconsBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomIconsBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomIconsBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
