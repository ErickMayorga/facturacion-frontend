import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormatoGuiaRemisionComponent } from './modal-formato-guia-remision.component';

describe('ModalFormatoGuiaRemisionComponent', () => {
  let component: ModalFormatoGuiaRemisionComponent;
  let fixture: ComponentFixture<ModalFormatoGuiaRemisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFormatoGuiaRemisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFormatoGuiaRemisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
