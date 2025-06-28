import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiRibAddComponent } from './multi-rib-add.component';

describe('MultiRibAddComponent', () => {
  let component: MultiRibAddComponent;
  let fixture: ComponentFixture<MultiRibAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiRibAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiRibAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
