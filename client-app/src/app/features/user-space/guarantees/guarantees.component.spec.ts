import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteesComponent } from './guarantees.component';

describe('GuaranteesComponent', () => {
  let component: GuaranteesComponent;
  let fixture: ComponentFixture<GuaranteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuaranteesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuaranteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
