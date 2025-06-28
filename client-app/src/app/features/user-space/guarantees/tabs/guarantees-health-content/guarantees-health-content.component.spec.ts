import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GuaranteesHealthContentComponent } from "./guarantees-health-content.component";

describe("GuaranteesHealthContentComponent", () => {
  let component: GuaranteesHealthContentComponent;
  let fixture: ComponentFixture<GuaranteesHealthContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuaranteesHealthContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GuaranteesHealthContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
