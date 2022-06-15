import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente()
  public titulo:string = "Crear Cliente"

   public errores: string[];
  
  constructor(private clienteService: ClienteService,  private router: Router, private activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.CargarCliente()
  }
 
  CargarCliente(): void{

    this.activatedRoute.params.subscribe(params =>{
      let id = params['id']
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) =>  this.cliente = cliente)
      } 
    })
  }

  public create(): void{
    this.clienteService.create(this.cliente).subscribe(

      response => {
        this.router.navigate(['/clientes'])
        Swal.fire('Nuevo Cliente',`Cliente ${this.cliente.nombre} creado con exito`,'success')
      },
      err => {
        this.errores= err.error.errors as string[];
        console.error('codigo de status'+ err.status)
        console.error(  err.error.errors)

      }
    );

  }

  update(): void{

    this.clienteService.update(this.cliente)
    .subscribe( cliente => {
      this.router.navigate(['/clientes'])
      Swal.fire('Cliente Actualzado',`Cliente ${this.cliente.nombre} Actualizado con Exito!`,'success')
    },
    err => {
      this.errores= err.error.errores as string[];
      console.error('codigo de status'+ err.status)
      console.error(  err.error.errores)

    }
    
    );
  }

  

}
