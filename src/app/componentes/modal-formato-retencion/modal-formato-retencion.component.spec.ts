import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormatoRetencionComponent } from './modal-formato-retencion.component';

describe('ModalFormatoRetencionComponent', () => {
  let component: ModalFormatoRetencionComponent;
  let fixture: ComponentFixture<ModalFormatoRetencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFormatoRetencionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFormatoRetencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
