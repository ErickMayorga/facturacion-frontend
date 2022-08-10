import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {FacturaDetalleCreateInterface} from "./factura-detalle-create.interface";
import {FacturaDetalleInterface} from "./factura-detalle.interface";
import {ProductoImpuestoInterface} from "../producto_impuesto/producto-impuesto.interface";

@Injectable({
  providedIn: 'root'
})
export class FacturaDetalleService {
  url = environment.urlAPI + '/factura-detalle'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: FacturaDetalleCreateInterface): Observable<FacturaDetalleInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<FacturaDetalleInterface[]>{
    Object
      .keys(queryParams)
      .forEach( k => {
        if(!queryParams[k]){
          delete queryParams[k]
        }
      })
    return this.httpClient
      .get(
        this.url,
        {
          params: queryParams
        }
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface[]
        )
      );
  }

  get(idObject: number):Observable<FacturaDetalleInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface
        )
      );
  }

  getDetalleFactura(idFactura: number) {
    return this.httpClient
      .get(
        this.url + '/factura/' + idFactura,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface[]
        )
      );
  }

  update(idObject:number, object: FacturaDetalleInterface): Observable<FacturaDetalleInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface
        )
      )
  }

  delete(idObject:number):Observable<FacturaDetalleInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface
        )
      )
  }

  deleteDetalle(idFactura: number){
    return this.httpClient.delete(this.url  + '/factura/' + idFactura)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface[]
        )
      )
  }

}
