import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarModificacionComponent } from './modal-agregar-modificacion.component';

describe('ModalAgregarModificacionComponent', () => {
  let component: ModalAgregarModificacionComponent;
  let fixture: ComponentFixture<ModalAgregarModificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAgregarModificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
