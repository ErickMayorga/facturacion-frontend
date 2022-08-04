import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDireccionComponent } from './input-direccion.component';

describe('InputDireccionComponent', () => {
  let component: InputDireccionComponent;
  let fixture: ComponentFixture<InputDireccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputDireccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputDireccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
