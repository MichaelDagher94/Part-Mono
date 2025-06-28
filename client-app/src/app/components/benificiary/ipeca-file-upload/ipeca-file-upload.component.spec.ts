import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpecaFileUploadComponent } from './ipeca-file-upload.component';

describe('IpecaFileUploadComponent', () => {
  let component: IpecaFileUploadComponent;
  let fixture: ComponentFixture<IpecaFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpecaFileUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpecaFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
