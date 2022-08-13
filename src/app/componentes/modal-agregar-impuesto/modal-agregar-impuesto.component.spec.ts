import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarImpuestoComponent } from './modal-agregar-impuesto.component';

describe('ModalAgregarImpuestoComponent', () => {
  let component: ModalAgregarImpuestoComponent;
  let fixture: ComponentFixture<ModalAgregarImpuestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAgregarImpuestoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarImpuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
