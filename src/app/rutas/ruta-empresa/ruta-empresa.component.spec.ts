import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaEmpresaComponent } from './ruta-empresa.component';

describe('RutaEmpresaComponent', () => {
  let component: RutaEmpresaComponent;
  let fixture: ComponentFixture<RutaEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
