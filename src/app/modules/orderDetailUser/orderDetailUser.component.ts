import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-orderDetailUser',
  templateUrl: './orderDetailUser.component.html',
  styleUrls: ['./orderDetailUser.component.css']
})
export class OrderDetailUserComponent implements OnInit {
  order: any = {};
  orderId: number | null = null;
  productImgList: any[] = [];
  ImageList: any[] = [];

  constructor(
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));
      if (this.orderId) {
        this.fetchOrderDetails(this.orderId);
      }
    });
  }

  fetchOrderDetails(orderId: number): void {
    this.callService.getOrderDetails(orderId).subscribe(
      response => {
        this.order = response.data;
        this.fetchProductDetailsForOrderItems();
      },
      error => {
        console.error('Error fetching order details:', error);
      }
    );
  }

  fetchProductDetailsForOrderItems(): void {
    this.order.items.forEach((item: any) => {
      this.callService.getProductByProductId(item.productId).subscribe(
        productResponse => {
          if (productResponse.data) {
            item.productDetails = productResponse.data;
            this.fetchProductImages(item);
          } else {
            // Handle error: product not found
          }
        },
        error => {
          console.error('Error fetching product details:', error);
        }
      );
    });
  }

  fetchProductImages(item: any): void {
    this.callService.getProductImgByProductId(item.productId).subscribe(
      imageResponse => {
        if (imageResponse.data) {
          item.images = [];
          this.productImgList = imageResponse.data;
          this.productImgList.forEach((img: any) => {
            this.getImage(img.productImageName, item);
          });
        } else {
          // Handle error: no images found
        }
      },
      error => {
        console.error('Error fetching product images:', error);
      }
    );
  }

  getImage(fileName: string, item: any): void {
    this.callService.getImageByte(fileName).subscribe(
      imageBlob => {
        let objectURL = URL.createObjectURL(imageBlob);
        let imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        item.images.push({ key: fileName, value: imageUrl });
      },
      error => {
        console.error('Error fetching image:', error);
      }
    );
  }

  navigateToPayment(): void {
    if (this.orderId) {
      this.router.navigate(['/payment', this.orderId]);
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
