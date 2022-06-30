import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'facturacion-frontend';
  constructor(private readonly router: Router,) {
    const ruta = ['/login'];
    this.router.navigate(ruta);
  }
}
