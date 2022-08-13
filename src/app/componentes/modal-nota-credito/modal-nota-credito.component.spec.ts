import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNotaCreditoComponent } from './modal-nota-credito.component';

describe('ModalNotaCreditoComponent', () => {
  let component: ModalNotaCreditoComponent;
  let fixture: ComponentFixture<ModalNotaCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNotaCreditoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNotaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
