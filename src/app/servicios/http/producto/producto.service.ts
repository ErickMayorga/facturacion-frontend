import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ProductoInterface} from "./producto.interface";
import {ProductoCreateInterface} from "./producto-create.interface";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  url = environment.urlAPI + '/productos'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: ProductoCreateInterface): Observable<ProductoInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ProductoInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<ProductoInterface[]>{
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
          (resultadoEnData) => resultadoEnData as ProductoInterface[]
        )
      );
  }
  get(idObject: number):Observable<ProductoInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ProductoInterface
        )
      );
  }

  update(idObject:number, object: ProductoInterface): Observable<ProductoInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ProductoInterface
        )
      )
  }

  delete(idObject:number):Observable<ProductoInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ProductoInterface
        )
      )
  }

}
