import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {NotaDebitoDetalleCreateInterface} from "./nota-debito-detalle-create.interface";
import {NotaDebitoDetalleInterface} from "./nota-debito-detalle.interface";

@Injectable({
  providedIn: 'root'
})
export class NotaDebitoDetalleService {
  url = environment.urlAPI + '/nota-de-debito-detalle'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: NotaDebitoDetalleCreateInterface): Observable<NotaDebitoDetalleInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoDetalleInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<NotaDebitoDetalleInterface[]>{
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
          (resultadoEnData) => resultadoEnData as NotaDebitoDetalleInterface[]
        )
      );
  }

  get(idObject: number):Observable<NotaDebitoDetalleInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoDetalleInterface
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
          (resultadoEnData) => resultadoEnData as NotaDebitoDetalleInterface[]
        )
      );
  }

  update(idObject:number, object: NotaDebitoDetalleInterface): Observable<NotaDebitoDetalleInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoDetalleInterface
        )
      )
  }

  delete(idObject:number):Observable<NotaDebitoDetalleInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoDetalleInterface
        )
      )
  }

  deleteDetalle(idComprobante: number){
    return this.httpClient.delete(this.url  + '/comprobante/' + idComprobante)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoDetalleInterface[]
        )
      )
  }

}
