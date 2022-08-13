import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {NotaCreditoDetalleCreateInterface} from "./nota-credito-detalle-create.interface";
import {NotaCreditoDetalleInterface} from "./nota-credito-detalle.interface";

@Injectable({
  providedIn: 'root'
})
export class NotaCreditoDetalleService {
  url = environment.urlAPI + '/nota-de-credito-detalle'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: NotaCreditoDetalleCreateInterface): Observable<NotaCreditoDetalleInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoDetalleInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<NotaCreditoDetalleInterface[]>{
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
          (resultadoEnData) => resultadoEnData as NotaCreditoDetalleInterface[]
        )
      );
  }

  get(idObject: number):Observable<NotaCreditoDetalleInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoDetalleInterface
        )
      );
  }

  getDetalles(idComprobante: number) {
    return this.httpClient
      .get(
        this.url + '/comprobante/' + idComprobante,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoDetalleInterface[]
        )
      );
  }

  update(idObject:number, object: NotaCreditoDetalleInterface): Observable<NotaCreditoDetalleInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoDetalleInterface
        )
      )
  }

  delete(idObject:number):Observable<NotaCreditoDetalleInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoDetalleInterface
        )
      )
  }

  deleteDetalle(idComprobante: number){
    return this.httpClient.delete(this.url  + '/comprobante/' + idComprobante)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoDetalleInterface[]
        )
      )
  }

}
