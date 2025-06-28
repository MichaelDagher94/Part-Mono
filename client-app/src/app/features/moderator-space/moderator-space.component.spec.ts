import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorSpaceComponent } from './moderator-space.component';

describe('ModeratorSpaceComponent', () => {
  let component: ModeratorSpaceComponent;
  let fixture: ComponentFixture<ModeratorSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
