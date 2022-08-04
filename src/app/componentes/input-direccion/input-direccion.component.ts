import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-input-direccion',
  templateUrl: './input-direccion.component.html',
  styleUrls: ['./input-direccion.component.scss']
})
export class InputDireccionComponent implements OnInit {

  @Input() formGroup: FormGroup = new FormGroup({})
  @Input() type: string = 'text'
  @Input() title: string = ''
  @Input() nameField: string = ''
  @Input() helpText: string = ''
  @Input() requiredMessage: string = ''
  @Input() lengthMessage: string = ''
  @Input() passwordCheck: boolean = true

  constructor() { }

  ngOnInit(): void {
  }

  guardarDireccion() {

  }
}
