import { Component, OnInit } from '@angular/core';
import {Cliente} from './cliente'; 
import {ClienteService} from './cliente.service'; 
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

   clientes: Cliente[] =[];
  paginador: any;
  clienteSeleccionado:Cliente;

  constructor(private clienteServce: ClienteService , private activatedRoute: ActivatedRoute, private modalService: ModalService) {
    
   }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe (params => {
      
      let page: number = +params.getAll('page');

      if(!page){
        page=0;
      }
      this.clienteServce.getClientes(page).pipe(
      tap(response => {
        console.log('ClientesCompnent: tap 3');
        (response.content as Cliente[]).forEach(cliente => { 
          console.log(cliente.nombre);
        });
      })
      ).subscribe(
       response => {
         this.clientes = response.content as Cliente[];
         this.paginador= response;
      }  );
       

    });

    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
         if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto ==cliente.foto;
          
         }
         return clienteOriginal;
      });
    });
    
  }
  delete(cliente: Cliente): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ',
        cancelButton: 'btn btn-danger '
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estas Seguro?',
      text: `Seguro que Deseas Eliminar al Cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: 'No, Cancelar! ',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteServce.delete(cliente.id).subscribe(
          response =>{
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swalWithBootstrapButtons.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} Eliminado con Exito.`,
              'success'
            )
          }
        )
        
      } 
    });
  }
  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
