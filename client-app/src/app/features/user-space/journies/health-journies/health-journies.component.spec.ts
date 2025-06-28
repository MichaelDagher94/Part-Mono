import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthJourniesComponent } from './health-journies.component';

describe('HealthJourniesComponent', () => {
  let component: HealthJourniesComponent;
  let fixture: ComponentFixture<HealthJourniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthJourniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthJourniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
