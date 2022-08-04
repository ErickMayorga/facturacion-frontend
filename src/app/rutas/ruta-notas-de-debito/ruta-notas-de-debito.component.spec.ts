import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaNotasDeDebitoComponent } from './ruta-notas-de-debito.component';

describe('RutaNotasDeDebitoComponent', () => {
  let component: RutaNotasDeDebitoComponent;
  let fixture: ComponentFixture<RutaNotasDeDebitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaNotasDeDebitoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaNotasDeDebitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
