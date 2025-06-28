import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForesightJourniesComponent } from './foresight-journies.component';

describe('ForesightJourniesComponent', () => {
  let component: ForesightJourniesComponent;
  let fixture: ComponentFixture<ForesightJourniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForesightJourniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForesightJourniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
