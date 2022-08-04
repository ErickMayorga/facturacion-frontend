import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaGuiasDeRemisionComponent } from './ruta-guias-de-remision.component';

describe('RutaGuiasDeRemisionComponent', () => {
  let component: RutaGuiasDeRemisionComponent;
  let fixture: ComponentFixture<RutaGuiasDeRemisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaGuiasDeRemisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaGuiasDeRemisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
