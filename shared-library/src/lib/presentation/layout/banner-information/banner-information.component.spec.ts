import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerInformationComponent } from './banner-information.component';

describe('BannerInformationComponent', () => {
  let component: BannerInformationComponent;
  let fixture: ComponentFixture<BannerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
