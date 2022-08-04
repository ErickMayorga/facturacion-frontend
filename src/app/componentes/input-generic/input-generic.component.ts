import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-input-generic',
  templateUrl: './input-generic.component.html',
  styleUrls: ['./input-generic.component.scss']
})
export class InputGenericComponent implements OnInit {

  @Input() formGroup: FormGroup = new FormGroup({})
  @Input() type: string = 'text'
  @Input() title: string = ''
  @Input() nameField: string = ''
  @Input() helpText: string = ''
  @Input() requiredMessage?: string = ''
  @Input() lengthMessage?: string = ''
  @Input() options?: string[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
