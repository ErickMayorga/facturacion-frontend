import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaClientesComponent } from './ruta-clientes.component';

describe('RutaClientesComponent', () => {
  let component: RutaClientesComponent;
  let fixture: ComponentFixture<RutaClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
