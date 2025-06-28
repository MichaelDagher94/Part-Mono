import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLayoutWrapperComponent } from './public-layout-wrapper.component';

describe('PublicLayoutWrapperComponent', () => {
  let component: PublicLayoutWrapperComponent;
  let fixture: ComponentFixture<PublicLayoutWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLayoutWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicLayoutWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
