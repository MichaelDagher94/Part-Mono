import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortabilityComponent } from './portability.component';

describe('PortabilityComponent', () => {
  let component: PortabilityComponent;
  let fixture: ComponentFixture<PortabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
