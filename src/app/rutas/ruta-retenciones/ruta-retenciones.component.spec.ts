import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaRetencionesComponent } from './ruta-retenciones.component';

describe('RutaRetencionesComponent', () => {
  let component: RutaRetencionesComponent;
  let fixture: ComponentFixture<RutaRetencionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaRetencionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaRetencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
