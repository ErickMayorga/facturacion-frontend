import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaSignupComponent } from './ruta-signup.component';

describe('RutaSignupComponent', () => {
  let component: RutaSignupComponent;
  let fixture: ComponentFixture<RutaSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaSignupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
