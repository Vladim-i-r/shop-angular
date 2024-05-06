import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CatalogComponent } from './catalog/catalog.component';
import { CartItem } from '../models/cartitem';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [CatalogComponent, NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html',
})
export class CartAppComponent implements OnInit{

  items: CartItem[] = [];
  total: number = 0;
  
  constructor(private router: Router, private service: ProductService, private sharingDataService: SharingDataService) {
    
  }
  
  ngOnInit(): void {
    this.items = JSON.parse(sessionStorage.getItem('cart') || "[]");
    this.calculateTotal();
    this.onDeleteCart();   //solo se suscribe y se mantiene atento al evento
    this.onAddCart();
  }
  
  onAddCart(): void {
    this.sharingDataService.productEventEmitter.subscribe ( product => {

      const hasItem = this.items.find(item => {return item.product.id === product.id; });
      if (hasItem) {
        this.items = this.items.map( item => {
          if (item.product.id === product.id) {
            return {
              ... item,
              quantity: item.quantity + 1
            }
          }
          return item;
        })
      } else {
        this.items = [... this.items, {product: {... product}, quantity:1}];
      }
      this.calculateTotal();
      this.saveSession();
      this.router.navigate(['/cart'], {
        state: {items: this.items, total: this.total}
      })

      Swal.fire({
        title: "Shopping Cart",
        text: "New product added to cart",
        icon: "success"
      });
    });
  }

  onDeleteCart(): void{
    this.sharingDataService.idProductEventEmitter.subscribe( id => {
      
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.items = this.items.filter( item => item.product.id !== id);
          if (this.items.length == 0) {
            sessionStorage.removeItem('cart');  //Se agrega esto ya que cuando no existe nada en el carro no lo toma como cambio en OnChanges()
            sessionStorage.clear();
          }
          this.calculateTotal();
          this.saveSession();
          this.router.navigateByUrl('/', {skipLocationChange:true}).then(() => {   // Esto es para hacer un refresh cuando se elimina un item
            
            this.router.navigate(['/cart'], {
              state: {items: this.items, total: this.total}
            })
    
          })
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });

    })

  }

  calculateTotal(): void {
    this.total = this.items.reduce((accumulator, item) => accumulator + item.quantity * item.product.price, 0); // reduce recibe 2 argumentos, la operacion y de donde parte
  }

  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items)); //* todo se debe guardar en tipo string 
  }

  // openCart(): void {
  //   this.showCart = !this.showCart;
  // }
}
