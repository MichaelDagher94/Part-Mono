import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiRibManagementComponent } from './multi-rib-management.component';

describe('MultiRibManagementComponent', () => {
  let component: MultiRibManagementComponent;
  let fixture: ComponentFixture<MultiRibManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiRibManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiRibManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
