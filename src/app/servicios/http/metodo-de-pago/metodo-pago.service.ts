import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {MetodoPagoCreateInterface} from "./metodo-pago-create.interface";
import {MetodoPagoInterface} from "./metodo-pago.interface";

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  url = environment.urlAPI + '/metodo-pago'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: MetodoPagoCreateInterface): Observable<MetodoPagoInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as MetodoPagoInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<MetodoPagoInterface[]>{
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
          (resultadoEnData) => resultadoEnData as MetodoPagoInterface[]
        )
      );
  }
  get(idObject: number):Observable<MetodoPagoInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as MetodoPagoInterface
        )
      );
  }

  update(idObject:number, object: MetodoPagoInterface): Observable<MetodoPagoInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as MetodoPagoInterface
        )
      )
  }

  delete(idObject:number):Observable<MetodoPagoInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as MetodoPagoInterface
        )
      )
  }


}
