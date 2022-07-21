import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonComprobanteComponent } from './boton-comprobante.component';

describe('BotonComprobanteComponent', () => {
  let component: BotonComprobanteComponent;
  let fixture: ComponentFixture<BotonComprobanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotonComprobanteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonComprobanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
