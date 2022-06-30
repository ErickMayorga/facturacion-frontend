import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaNotFoundComponent } from './ruta-not-found.component';

describe('RutaNotFoundComponent', () => {
  let component: RutaNotFoundComponent;
  let fixture: ComponentFixture<RutaNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaNotFoundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
