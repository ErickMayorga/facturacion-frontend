import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionDeAccionComponent } from './confirmacion-de-accion.component';

describe('ConfirmacionDeAccionComponent', () => {
  let component: ConfirmacionDeAccionComponent;
  let fixture: ComponentFixture<ConfirmacionDeAccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacionDeAccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacionDeAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
