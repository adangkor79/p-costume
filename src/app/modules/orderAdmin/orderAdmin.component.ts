import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-admin',
  templateUrl: './orderAdmin.component.html',
  styleUrls: ['./orderAdmin.component.css']
})
export class OrderAdminComponent implements OnInit {
  orders: any[] = [];

  constructor(
    private callService: CallserviceService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.callService.getAllOrders().subscribe(
      (response) => {
        this.orders = response.data;
        console.log(this.orders);
      },
      (error) => {
        console.error('Error fetching orders:', error);

      }
    );
  }

  viewOrder(order: any) {
    this.router.navigate(['/orderDetailAdmin', order.orderId]);
  }

  deleteOrder(orderId: number) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.callService.deleteOrder(orderId).subscribe(
        (response) => {
          this.fetchOrders();
          alert('Order deleted successfully.');
        },
        (error) => {
          console.error('Error deleting order:', error);
          alert('Failed to delete the order. Please try again.');
        }
      );
    }
  }
}
