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
          console.error('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้:', error);
        }
      );
    } else {
      console.error('ไม่พบข้อมูลผู้ใช้ใน session storage');
    }
  }

  viewOrder(order: any) {
    this.router.navigate(['/orderDetailUser', order.orderId]);
  }

  deleteOrder(orderId: number) {
    if (confirm('คุณแน่ใจว่าต้องการลบคำสั่งซื้อนี้หรือไม่?')) {
      this.callService.deleteOrder(orderId).subscribe(
        (response) => {
          console.log('ลบคำสั่งซื้อเรียบร้อยแล้ว');
          this.fetchOrders(); // รีเฟรชรายการคำสั่งซื้อ
          alert('ลบคำสั่งซื้อเรียบร้อยแล้ว.');
        },
        (error) => {
          console.error('ไม่สามารถลบคำสั่งซื้อได้:', error);
          alert('ไม่สามารถลบคำสั่งซื้อได้ กรุณาลองอีกครั้ง.');
        }
      );
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'unpaid':
        return 'ยังไม่ชำระเงิน';
      // case 'paid':
      //   return 'ชำระเงินแล้ว';
      // case 'shipped':
      //   return 'จัดส่งแล้ว';
      // case 'delivered':
      //   return 'จัดส่งถึงแล้ว';
      default:
        return 'กำลังตรวจสอบ';
    }
  }
}
