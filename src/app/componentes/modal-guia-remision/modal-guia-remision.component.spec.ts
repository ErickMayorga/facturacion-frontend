import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGuiaRemisionComponent } from './modal-guia-remision.component';

describe('ModalGuiaRemisionComponent', () => {
  let component: ModalGuiaRemisionComponent;
  let fixture: ComponentFixture<ModalGuiaRemisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalGuiaRemisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalGuiaRemisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
