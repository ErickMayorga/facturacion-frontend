import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ProductoImpuestoInterface} from "./producto-impuesto.interface";
import {ProductoImpuestoCreateInterface} from "./producto-impuesto-create.interface";

@Injectable({
  providedIn: 'root'
})
export class ProductoImpuestoService {
  url = environment.urlAPI + '/producto-impuesto'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: ProductoImpuestoCreateInterface): Observable<ProductoImpuestoInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ProductoImpuestoInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<ProductoImpuestoInterface[]>{
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
          (resultadoEnData) => resultadoEnData as ProductoImpuestoInterface[]
        )
      );
  }
  get(idObject: number):Observable<ProductoImpuestoInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ProductoImpuestoInterface
        )
      );
  }

  getImpuestosPorProducto(idProducto: number) {
    return this.httpClient
      .get(
        this.url + '/producto/' + idProducto,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ProductoImpuestoInterface[]
        )
      );
  }

  update(idObject:number, object: ProductoImpuestoInterface): Observable<ProductoImpuestoInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ProductoImpuestoInterface
        )
      )
  }

  delete(idObject:number):Observable<ProductoImpuestoInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ProductoImpuestoInterface
        )
      )
  }

  deleteImpuestos(idProducto: number){
    return this.httpClient.delete(this.url  + '/producto/' + idProducto)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ProductoImpuestoInterface[]
        )
      )
  }
}
