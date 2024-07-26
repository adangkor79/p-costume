import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  order: any = {};
  qrcodelink: string = '';
  promptpay: string = '0610598374';
  selectedFiles: File[] = [];
  imageBlobUrl: any;
  ImageList: any = [];

  constructor(
    private callService: CallserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const orderId = Number(params.get('orderId'));
      if (orderId) {
        this.fetchOrderDetails(orderId);
      }
    });
  }

  fetchOrderDetails(orderId: number): void {
    this.callService.getOrderDetails(orderId).subscribe(
      response => {
        this.order = response.data;
        this.generateQRCode(this.order.totalAmount);
        this.loadOrderImages(orderId);
      },
      error => {
        console.error('Error fetching order details:', error);
      }
    );
  }

  generateQRCode(total: any): void {
    this.qrcodelink = `https://promptpay.io/${this.promptpay}/${total}.png`;
  }

  onFileChanged(event: any): void {
    this.selectedFiles = event.target.files;
  }

  loadOrderImages(orderId: number): void {
    this.callService.getOrderDetails(orderId).subscribe(res => {
      if (res.data && res.data.orderImages) {
        this.ImageList = res.data.orderImages.map((img: any) => {
          return { key: img.fileName, value: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(img)) };
        });
      }
    });
  }

  onDeleteFileChanged(fileName: any): void {
    this.callService.deleteOrderImage(fileName).subscribe(() => {
      this.ImageList = this.ImageList.filter((img: any) => img.key !== fileName);
    });
  }

  confirmPayment(): void {
    if (this.selectedFiles.length > 0) {
      const formData = new FormData();
      for (const file of this.selectedFiles) {
        formData.append('file', file);
      }
      this.callService.saveOrderImage(formData, this.order.orderId).subscribe(() => {
        this.updateOrderStatus();
      });
    } else {
      this.updateOrderStatus();
    }
  }

  updateOrderStatus(): void {
    const updatedOrder = {
      ...this.order,
      status: 'กำลังตรวจสอบ',
    };

    this.callService.updateOrder(this.order.orderId, updatedOrder).subscribe(
      () => {
        alert('ยืนยันการชำระเงิน');
        this.router.navigate(['/order-user']);
      },
      error => {
        console.error('Error updating order status:', error);
      }
    );
  }
}
