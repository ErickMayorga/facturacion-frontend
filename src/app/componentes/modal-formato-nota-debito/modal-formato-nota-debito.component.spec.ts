import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormatoNotaDebitoComponent } from './modal-formato-nota-debito.component';

describe('ModalFormatoNotaDebitoComponent', () => {
  let component: ModalFormatoNotaDebitoComponent;
  let fixture: ComponentFixture<ModalFormatoNotaDebitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFormatoNotaDebitoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFormatoNotaDebitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
