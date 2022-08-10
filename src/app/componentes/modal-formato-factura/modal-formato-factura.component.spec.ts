import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormatoFacturaComponent } from './modal-formato-factura.component';

describe('ModalFormatoFacturaComponent', () => {
  let component: ModalFormatoFacturaComponent;
  let fixture: ComponentFixture<ModalFormatoFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFormatoFacturaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFormatoFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
