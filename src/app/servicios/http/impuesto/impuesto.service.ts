import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ImpuestoInterface} from "./impuesto.interface";
import {ImpuestoCreateInterface} from "./impuesto-create.interface";

@Injectable({
  providedIn: 'root'
})
export class ImpuestoService {
  url = environment.urlAPI + '/impuestos'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: ImpuestoCreateInterface): Observable<ImpuestoInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ImpuestoInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<ImpuestoInterface[]>{
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
          (resultadoEnData) => resultadoEnData as ImpuestoInterface[]
        )
      );
  }
  get(idObject: number):Observable<ImpuestoInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ImpuestoInterface
        )
      );
  }

  update(idObject:number, object: ImpuestoInterface): Observable<ImpuestoInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ImpuestoInterface
        )
      )
  }

  delete(idObject:number):Observable<ImpuestoInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ImpuestoInterface
        )
      )
  }

  getImpuestosPorCategoria(categoria: string){
    return this.httpClient
      .get(this.url + '/categoria/' + categoria,)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ImpuestoInterface[]
        )
      );
  }

}
