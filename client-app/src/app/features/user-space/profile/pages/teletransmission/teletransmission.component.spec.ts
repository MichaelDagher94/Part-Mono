import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeletransmissionComponent } from './teletransmission.component';

describe('TeletransmissionComponent', () => {
  let component: TeletransmissionComponent;
  let fixture: ComponentFixture<TeletransmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeletransmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeletransmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
