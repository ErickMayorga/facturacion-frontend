import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {NotaDebitoPagoCreateInterface} from "./nota-debito-pago-create.interface";
import {NotaDebitoPagoInterface} from "./nota-debito-pago.interface";

@Injectable({
  providedIn: 'root'
})
export class NotaDebitoPagoService {
  url = environment.urlAPI + '/nota-de-debito-pago'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: NotaDebitoPagoCreateInterface): Observable<NotaDebitoPagoInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoPagoInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<NotaDebitoPagoInterface[]>{
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
          (resultadoEnData) => resultadoEnData as NotaDebitoPagoInterface[]
        )
      );
  }

  get(idObject: number):Observable<NotaDebitoPagoInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoPagoInterface
        )
      );
  }

  getPagosFactura(idNotaDebito: number) {
    return this.httpClient
      .get(
        this.url + '/nota-de-debito/' + idNotaDebito,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoPagoInterface[]
        )
      );
  }

  update(idObject:number, object: NotaDebitoPagoInterface): Observable<NotaDebitoPagoInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoPagoInterface
        )
      )
  }

  delete(idObject:number):Observable<NotaDebitoPagoInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoPagoInterface
        )
      )
  }

  deletePagos(idNotaDebito: number){
    return this.httpClient.delete(this.url  + '/nota-de-debito/' + idNotaDebito)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoPagoInterface[]
        )
      )
  }
}
