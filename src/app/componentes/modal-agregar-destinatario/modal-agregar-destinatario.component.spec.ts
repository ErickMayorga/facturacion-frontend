import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarDestinatarioComponent } from './modal-agregar-destinatario.component';

describe('ModalAgregarDestinatarioComponent', () => {
  let component: ModalAgregarDestinatarioComponent;
  let fixture: ComponentFixture<ModalAgregarDestinatarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAgregarDestinatarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarDestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
