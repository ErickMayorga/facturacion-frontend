import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNotaDebitoComponent } from './modal-nota-debito.component';

describe('ModalNotaDebitoComponent', () => {
  let component: ModalNotaDebitoComponent;
  let fixture: ComponentFixture<ModalNotaDebitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNotaDebitoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNotaDebitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
