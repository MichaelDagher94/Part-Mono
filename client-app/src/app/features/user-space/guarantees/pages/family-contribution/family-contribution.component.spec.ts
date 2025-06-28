import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyContributionComponent } from './family-contribution.component';

describe('FamilyContributionComponent', () => {
  let component: FamilyContributionComponent;
  let fixture: ComponentFixture<FamilyContributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyContributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
