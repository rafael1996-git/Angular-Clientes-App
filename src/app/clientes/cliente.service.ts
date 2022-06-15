import { Injectable } from '@angular/core';
import {CLIENTES} from './clientes.json'; 
import {Cliente} from './cliente'; 
import { Observable,tap } from 'rxjs';
import { of ,throwError} from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders,HttpRequest } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Router } from '@angular/router';

@Injectable()
export class ClienteService {

  private urlEndpoint:string= 'http://localhost:8080/api/clientes';
  private httpHeaders =new HttpHeaders({'Content-type':'application/json'})
  constructor(private http: HttpClient,private router: Router) { }

  getClientes(page: number): Observable<any>{
   // return of(CLIENTES) ;
   return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
     tap((response:any) => {
     
     console.log('clienteService tap 1');
     (response.content as Cliente[]).forEach(cliente =>{
       console.log(cliente.nombre);
     });
     
    }),
    map((response:any) =>{
      (response.content as Cliente[]).map(cliente => {
        cliente.nombre = cliente.nombre.toUpperCase();
        return cliente;
      });
      return response;
    }),
    tap((response:any) => {
      console.log('clienteService tap 2');
     (response.content as Cliente[]).forEach(cliente =>{
       console.log(cliente.nombre);
     });
    })
   );
  }

  create(cliente: Cliente) : Observable<Cliente>{
    // return of(CLIENTES) ;
    return this.http.post<any>(this.urlEndpoint,cliente,{headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(() => e);
        }

        console.error(e.error.mensaje)
        Swal.fire(e.error.mensaje,e.error.Error,'error');
        return throwError(() => e);
      })
    );
   }

   getCliente(id: number): Observable<Cliente>{

    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje)
        Swal.fire("Error al editar",e.error.mensaje,'error');

        return throwError(() => e);
      })
    );
   }

   update(cliente: Cliente ): Observable<Cliente>{

    return this.http.put<Cliente>(`${this.urlEndpoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(() => e);
        }
        console.error(e.error.mensaje)
        Swal.fire(e.error.mensaje,e.error.Error,'error');
        return throwError(() => e);
      })
    );  
  
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndpoint}/${id}`,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje)
        Swal.fire(e.error.mensaje,e.error.Error,'error');
        return throwError(() => e);
      })
    );
  }
  subirFoto(archivo: File, id:any): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST',`${this.urlEndpoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
