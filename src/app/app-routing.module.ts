import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RutaLoginComponent} from "./rutas/ruta-login/ruta-login.component";
import {RutaNotFoundComponent} from "./rutas/ruta-not-found/ruta-not-found.component";
import {RutaHomeComponent} from "./rutas/ruta-home/ruta-home.component";
import {RutaComprobantesComponent} from "./rutas/ruta-comprobantes/ruta-comprobantes.component";
import {RutaSignupComponent} from "./rutas/ruta-signup/ruta-signup.component";

const routes: Routes = [
  {
    path: 'login',
    component: RutaLoginComponent
  },
  {
    path: 'sign-up',
    component: RutaSignupComponent
  },
  {
    path: 'usuario/:idUsuario',
    component: RutaHomeComponent,
    children: [
      {
        path: 'comprobantes',
        component: RutaComprobantesComponent
      }
    ]
  },
  /*
  {
    path: '**',
    component: RutaNotFoundComponent
  },

   */
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {useHash: true}
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
