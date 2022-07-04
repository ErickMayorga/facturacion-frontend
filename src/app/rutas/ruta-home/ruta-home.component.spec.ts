import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaHomeComponent } from './ruta-home.component';

describe('RutaHomeComponent', () => {
  let component: RutaHomeComponent;
  let fixture: ComponentFixture<RutaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
