import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';

@Component({
  selector: 'app-dashbord-admin',
  templateUrl: './dashbordAdmin.component.html',
  styleUrls: ['./dashbordAdmin.component.css']
})
export class DashbordAdminComponent implements OnInit {

  userDetail: any;
  profiles = [/* ข้อมูลโปรไฟล์ */];
  projects = [/* ข้อมูลโปรเจ็ค */];
  orders: any[] = [];
  purchasePercentage: number = 0; // เพิ่มตัวแปรเพื่อเก็บเปอร์เซ็นต์

  constructor(private callService: CallserviceService) { }

  ngOnInit() {
    this.loadUserDetails();
    this.loadOrders(); // โหลดคำสั่งซื้อ
  }

  private loadUserDetails() {
    const userDetailSession = sessionStorage.getItem("userDetail");
    if (userDetailSession) {
      this.userDetail = JSON.parse(userDetailSession);
    }
  }

  private loadOrders() {
    this.callService.getAllOrders().subscribe(response => {
      this.orders = response.data;
      this.calculatePurchasePercentage(); // คำนวณเปอร์เซ็นต์หลังจากโหลดคำสั่งซื้อ
    });
  }

  private calculatePurchasePercentage() {
    if (this.orders.length > 0) {
      // คำนวณเปอร์เซ็นต์การซื้อสินค้าตามข้อมูลที่มี
      const totalOrders = this.orders.length;
      const purchasedOrders = this.orders.filter(order => order.status === 'paid').length; // สมมติว่า 'paid' คือสถานะที่แสดงว่ามีการซื้อ
      this.purchasePercentage = (purchasedOrders / totalOrders) * 100;
    }
  }
}
