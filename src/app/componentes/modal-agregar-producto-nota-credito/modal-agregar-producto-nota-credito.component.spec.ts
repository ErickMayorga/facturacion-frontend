import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarProductoNotaCreditoComponent } from './modal-agregar-producto-nota-credito.component';

describe('ModalAgregarProductoNotaCreditoComponent', () => {
  let component: ModalAgregarProductoNotaCreditoComponent;
  let fixture: ComponentFixture<ModalAgregarProductoNotaCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAgregarProductoNotaCreditoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarProductoNotaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
