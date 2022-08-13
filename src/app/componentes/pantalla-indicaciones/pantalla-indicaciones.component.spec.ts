import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaIndicacionesComponent } from './pantalla-indicaciones.component';

describe('PantallaIndicacionesComponent', () => {
  let component: PantallaIndicacionesComponent;
  let fixture: ComponentFixture<PantallaIndicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PantallaIndicacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaIndicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
