import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaTransportistasComponent } from './ruta-transportistas.component';

describe('RutaTransportistasComponent', () => {
  let component: RutaTransportistasComponent;
  let fixture: ComponentFixture<RutaTransportistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaTransportistasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaTransportistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
