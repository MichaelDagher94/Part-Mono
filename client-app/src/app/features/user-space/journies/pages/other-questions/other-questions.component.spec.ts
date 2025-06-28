import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherQuestionsComponent } from './other-questions.component';

describe('OtherQuestionsComponent', () => {
  let component: OtherQuestionsComponent;
  let fixture: ComponentFixture<OtherQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
