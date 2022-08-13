import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {NotaCreditoCreateInterface} from "./nota-credito-create.interface";
import {NotaCreditoInterface} from "./nota-credito.interface";

@Injectable({
  providedIn: 'root'
})
export class NotaCreditoService {
  url = environment.urlAPI + '/nota-de-credito'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: NotaCreditoCreateInterface): Observable<NotaCreditoInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<NotaCreditoInterface[]>{
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
          (resultadoEnData) => resultadoEnData as NotaCreditoInterface[]
        )
      );
  }

  getComprobantes(idEmpresa: number){
    return this.httpClient
      .get(
        this.url + '/empresa/' + idEmpresa,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoInterface[]
        )
      );
  }

  getComprobantesPorFactura(idFactura: number){
    return this.httpClient
      .get(
        this.url + '/factura/' + idFactura,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoInterface[]
        )
      );
  }

  get(idObject: number):Observable<NotaCreditoInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoInterface
        )
      );
  }

  update(idObject:number, object: NotaCreditoInterface): Observable<NotaCreditoInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoInterface
        )
      )
  }

  delete(idObject:number):Observable<NotaCreditoInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoInterface
        )
      )
  }

  deshabilitar(idComprobante: number){
    return this.httpClient.delete(this.url  + '/deshabilitar/' + idComprobante)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaCreditoInterface
        )
      )
  }


}
