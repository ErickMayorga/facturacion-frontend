import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaNotasDeCreditoComponent } from './ruta-notas-de-credito.component';

describe('RutaNotasDeCreditoComponent', () => {
  let component: RutaNotasDeCreditoComponent;
  let fixture: ComponentFixture<RutaNotasDeCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaNotasDeCreditoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaNotasDeCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
