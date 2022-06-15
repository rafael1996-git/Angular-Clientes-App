import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string="detalle del cliente";
  public fotoSeleccionada: File;
   progreso:number =0;
  constructor( private clienteService: ClienteService, 
    public modalService: ModalService) { }

  ngOnInit(): void {
   
    
  }
  seleccionarFoto(event: any){
    this.fotoSeleccionada= event.target.files[0];
    this.progreso =0; 
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire('Error Selecionar Imagen','El archivo debe ser tipo Imagen', 'error');
      this.fotoSeleccionada =null as any;
    }
  }
  subirFoto(){

    if (!this.fotoSeleccionada) {
      Swal.fire('Error Upload','Debe seleccionar una foto', 'error');

    }else{
    this.clienteService.subirFoto( this.fotoSeleccionada,this.cliente.id)
    .subscribe(event => {

      if (event.type === HttpEventType.UploadProgress) {
        if (event.total) {  
          const total: number = event.total;  
          this.progreso = Math.round((event.loaded / total)*100);    
      }     
      }else if(event.type === HttpEventType.Response){
        let response: any = event.body;
        this.cliente= response.cliente as Cliente;
        this.modalService.notificarUpload.emit( this.cliente);
        Swal.fire('La foto ah subido con completamente',response.mensaje, 'success');

      }
    });
  }
}
public cerrarModal(){
  this.modalService.cerrarModal();
  this.fotoSeleccionada = null as any;
  this.progreso = 0;
}

}
