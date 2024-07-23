import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orderUser',
  templateUrl: './orderUser.component.html',
  styleUrls: ['./orderUser.component.css']
})
export class OrderUserComponent implements OnInit {
  orders: any[] = [];

  constructor(
    private callService: CallserviceService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    const userDetailString = sessionStorage.getItem('userDetail');
    if (userDetailString) {
      const userDetail = JSON.parse(userDetailString);
      const userDetailId = userDetail.userDetailId;

      console.log(userDetail.userDetailId);

      this.callService.getOrdersByUserId(userDetailId).subscribe(
        (response) => {
          this.orders = response.data || response;
          console.log(this.orders);
        },
        (error) => {
          console.error('Failed to fetch orders:', error);
        }
      );
    } else {
      console.error('User detail not found in session storage');
    }
  }

  viewOrder(order: any) {
    this.router.navigate(['/orderDetailUser', order.orderId]);
  }

  deleteOrder(orderId: number) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.callService.deleteOrder(orderId).subscribe(
        (response) => {
          console.log('Order deleted successfully');
          this.fetchOrders(); // Refresh the orders list
          alert('Order deleted successfully.');
        },
        (error) => {
          console.error('Failed to delete order:', error);
          alert('Failed to delete the order. Please try again.');
        }
      );
    }
  }
}
