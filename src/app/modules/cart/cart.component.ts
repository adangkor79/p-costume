import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  userDetail: any;
  imageBlobUrl: SafeResourceUrl;
  itemToRemove: any = null;

  constructor(private callService: CallserviceService, private sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit() {
    this.userDetail = JSON.parse(sessionStorage.getItem('userDetail') || '{}');
    this.loadCart();
  }

  loadCart() {
    this.cart = JSON.parse(sessionStorage.getItem(this.userDetail.userId + 'cart') || '[]');
    this.cart.forEach(item => {
      item.imgList = [];
      this.callService.getProductImgByProductId(item.productId).subscribe((res) => {
        if (res.data) {
          for (let productImg of res.data) {
            this.getImage(productImg.productImageName, item.imgList);
          }
        }
      });
    });
  }

  confirmRemove(product: any) {
    this.itemToRemove = product;
  }

  cancelRemove() {
    this.itemToRemove = null;
  }

  removeFromCartConfirmed() {
    this.cart = this.cart.filter(item => item.productId !== this.itemToRemove.productId);
    this.updateCart();
    this.itemToRemove = null;
  }

  updateQuantity(product: any, change: number) {
    product.quantity += change;
    if (product.quantity <= 0) {
      this.confirmRemove(product);
    } else {
      this.updateCart();
    }
  }

  updateCart() {
    sessionStorage.setItem(this.userDetail.userId + 'cart', JSON.stringify(this.cart));
  }

  getImage(fileNames: any, imgList: any) {
    this.callService.getBlobThumbnail(fileNames).subscribe((res) => {
      if (res) {
        let objectURL = URL.createObjectURL(res);
        this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        imgList.push({
          key: fileNames,
          value: this.imageBlobUrl,
        });
      }
    });
  }

  checkout() {
    this.router.navigate(['/createOrder'], { state: { cart: this.cart, userDetail: this.userDetail } });
  }
}
