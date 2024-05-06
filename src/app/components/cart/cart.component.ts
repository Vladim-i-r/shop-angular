import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CartItem } from '../../models/cartitem';
import { Router } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html',
})
export class CartComponent{
  
  items: CartItem[] = [];
  
  // @Input() total = 0;
  total = 0;
  
  constructor(private router: Router, private SharingDataService: SharingDataService){
    this.items = this.router.getCurrentNavigation()?.extras.state!['items'];   //Con esto pasamos los items por medio de la ruta 
    this.total = this.router.getCurrentNavigation()?.extras.state!['total'];   //Con esto pasamos los items por medio de la ruta 
  }
  
  onDeleteCart(id: number) {
    this.SharingDataService.idProductEventEmitter.emit(id);
  }

}
