import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {FacturaCreateInterface} from "./factura-create.interface";
import {FacturaInterface} from "./factura.interface";

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  url = environment.urlAPI + '/facturas'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: FacturaCreateInterface): Observable<FacturaInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<FacturaInterface[]>{
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
          (resultadoEnData) => resultadoEnData as FacturaInterface[]
        )
      );
  }
  get(idObject: number):Observable<FacturaInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaInterface
        )
      );
  }

  update(idObject:number, object: FacturaInterface): Observable<FacturaInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaInterface
        )
      )
  }

  delete(idObject:number):Observable<FacturaInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaInterface
        )
      )
  }


}
