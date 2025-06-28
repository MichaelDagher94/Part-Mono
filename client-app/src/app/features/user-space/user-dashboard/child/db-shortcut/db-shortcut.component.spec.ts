import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbShortcutComponent } from './db-shortcut.component';

describe('DbShortcutComponent', () => {
  let component: DbShortcutComponent;
  let fixture: ComponentFixture<DbShortcutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbShortcutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
