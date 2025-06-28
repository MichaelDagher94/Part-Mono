import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeathContentComponent } from './heath-content.component';

describe('HeathContentComponent', () => {
  let component: HeathContentComponent;
  let fixture: ComponentFixture<HeathContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeathContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeathContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
