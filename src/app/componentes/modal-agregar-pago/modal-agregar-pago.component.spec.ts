import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarPagoComponent } from './modal-agregar-pago.component';

describe('ModalAgregarPagoComponent', () => {
  let component: ModalAgregarPagoComponent;
  let fixture: ComponentFixture<ModalAgregarPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAgregarPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
