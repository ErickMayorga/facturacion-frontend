import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaComprobantesComponent } from './ruta-comprobantes.component';

describe('RutaComprobantesComponent', () => {
  let component: RutaComprobantesComponent;
  let fixture: ComponentFixture<RutaComprobantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaComprobantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaComprobantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
