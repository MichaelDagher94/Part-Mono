import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofProviderComponent } from './proof-provider.component';

describe('ProofProviderComponent', () => {
  let component: ProofProviderComponent;
  let fixture: ComponentFixture<ProofProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProofProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProofProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
