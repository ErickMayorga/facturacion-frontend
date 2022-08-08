import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RutaLoginComponent} from "./rutas/ruta-login/ruta-login.component";
import {RutaNotFoundComponent} from "./rutas/ruta-not-found/ruta-not-found.component";
import {RutaHomeComponent} from "./rutas/ruta-home/ruta-home.component";
import {RutaComprobantesComponent} from "./rutas/ruta-comprobantes/ruta-comprobantes.component";
import {RutaSignupComponent} from "./rutas/ruta-signup/ruta-signup.component";
import {RutaFacturasComponent} from "./rutas/ruta-facturas/ruta-facturas.component";
import {RutaGuiasDeRemisionComponent} from "./rutas/ruta-guias-de-remision/ruta-guias-de-remision.component";
import {RutaNotasDeDebitoComponent} from "./rutas/ruta-notas-de-debito/ruta-notas-de-debito.component";
import {RutaNotasDeCreditoComponent} from "./rutas/ruta-notas-de-credito/ruta-notas-de-credito.component";
import {RutaRetencionesComponent} from "./rutas/ruta-retenciones/ruta-retenciones.component";
import {RutaEmpresaComponent} from "./rutas/ruta-empresa/ruta-empresa.component";
import {RutaClientesComponent} from "./rutas/ruta-clientes/ruta-clientes.component";
import {RutaTransportistasComponent} from "./rutas/ruta-transportistas/ruta-transportistas.component";
import {RutaProductosComponent} from "./rutas/ruta-productos/ruta-productos.component";

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
      // Empresa
      {
        path: 'empresa',
        component: RutaEmpresaComponent
      },
      // Clientes
      {
        path: 'clientes',
        component: RutaClientesComponent
      },
      // Transportistas
      {
        path: 'transportistas',
        component: RutaTransportistasComponent
      },
      // Productos
      {
        path: 'productos',
        component: RutaProductosComponent
      },
      // Comprobantes
      {
        path: 'comprobantes',
        component: RutaComprobantesComponent
      },
      {
        path: 'comprobantes/facturas',
        component: RutaFacturasComponent
      },
      {
        path: 'comprobantes/guias_de_remision',
        component: RutaGuiasDeRemisionComponent
      },
      {
        path: 'comprobantes/notas_de_debito',
        component: RutaNotasDeDebitoComponent
      },
      {
        path: 'comprobantes/notas_de_credito',
        component: RutaNotasDeCreditoComponent
      },
      {
        path: 'comprobantes/retenciones',
        component: RutaRetencionesComponent
      },
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
