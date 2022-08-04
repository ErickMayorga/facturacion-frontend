import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaFacturasComponent } from './ruta-facturas.component';

describe('RutaFacturasComponent', () => {
  let component: RutaFacturasComponent;
  let fixture: ComponentFixture<RutaFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaFacturasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
