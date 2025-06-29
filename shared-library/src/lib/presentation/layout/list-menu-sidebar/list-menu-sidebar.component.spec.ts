import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMenuSidebarComponent } from './list-menu-sidebar.component';

describe('ListMenuSidebarComponent', () => {
  let component: ListMenuSidebarComponent;
  let fixture: ComponentFixture<ListMenuSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMenuSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMenuSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
