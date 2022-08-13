import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRetencionComponent } from './modal-retencion.component';

describe('ModalRetencionComponent', () => {
  let component: ModalRetencionComponent;
  let fixture: ComponentFixture<ModalRetencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRetencionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRetencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
