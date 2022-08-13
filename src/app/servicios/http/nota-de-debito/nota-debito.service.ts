import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {NotaDebitoCreateInterface} from "./nota-debito-create.interface";
import {NotaDebitoInterface} from "./nota-debito.interface";

@Injectable({
  providedIn: 'root'
})
export class NotaDebitoService {
  url = environment.urlAPI + '/nota-de-debito'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: NotaDebitoCreateInterface): Observable<NotaDebitoInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<NotaDebitoInterface[]>{
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
          (resultadoEnData) => resultadoEnData as NotaDebitoInterface[]
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
          (resultadoEnData) => resultadoEnData as NotaDebitoInterface[]
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
          (resultadoEnData) => resultadoEnData as NotaDebitoInterface[]
        )
      );
  }

  get(idObject: number):Observable<NotaDebitoInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoInterface
        )
      );
  }

  update(idObject:number, object: NotaDebitoInterface): Observable<NotaDebitoInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoInterface
        )
      )
  }

  delete(idObject:number):Observable<NotaDebitoInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoInterface
        )
      )
  }

  deshabilitar(idComprobante: number){
    return this.httpClient.delete(this.url  + '/deshabilitar/' + idComprobante)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as NotaDebitoInterface
        )
      )
  }


}
