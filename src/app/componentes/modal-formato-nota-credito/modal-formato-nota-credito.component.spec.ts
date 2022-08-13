import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormatoNotaCreditoComponent } from './modal-formato-nota-credito.component';

describe('ModalFormatoNotaCreditoComponent', () => {
  let component: ModalFormatoNotaCreditoComponent;
  let fixture: ComponentFixture<ModalFormatoNotaCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFormatoNotaCreditoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFormatoNotaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
