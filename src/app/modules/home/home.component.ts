import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  imageBlobUrl: any;
  imageBlobUrls: any = [];
  productImgList: any;
  productList: any;
  productTypeList: any = [];
  filteredProductList: any = [];
  loading: boolean = false;
  searchText: string = '';

  ngOnInit() {
    this.getProductTypeAll();
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.callService.getAllProduct().subscribe((res) => {
      if (res.data) {
        this.productList = res.data;
        for (let product of this.productList) {
          product.imgList = [];

          product.productType = this.productTypeList.filter(
            (x: any) => x.productTypeId == product.productTypeId
          );

          if (null == product.productType[0]) {
            window.location.reload();
          }

          this.callService
            .getProductImgByProductId(product.productId)
            .subscribe((res) => {
              if (res.data) {
                this.productImgList = res.data;
                for (let productImg of this.productImgList) {
                  this.getImage(productImg.productImageName, product.imgList);
                }
              } else {
                window.location.reload();
              }
            });
        }
        this.filteredProductList = this.productList;
      }
      this.loading = false;
    });
  }

  getProductTypeAll() {
    this.callService.getProductTypeAll().subscribe((res) => {
      if (res.data) {
        this.productTypeList = res.data;
      }
    });
  }

  getImage(fileNames: any, imgList: any) {
    console.log(fileNames);
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

  OnGetProductById(productId: any) {
    this.router.navigate(['/productDetail/' + productId]);
  }

  addToCart(product: any, event: Event) {
    event.stopPropagation();
    let userDetail = JSON.parse(sessionStorage.getItem('userDetail') || '{}');
    if (!userDetail.userId) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        text: 'Please log in to add items to the cart.',
        toast: true,
        position: 'bottom-right',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    let cart = JSON.parse(
      sessionStorage.getItem(userDetail.userId + 'cart') || '[]'
    );
    let item = cart.find(
      (item: any) =>
        item.productId === product.productId &&
        item.userId === userDetail.userId
    );
    if (item) {
      item.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1, userId: userDetail.userId });
    }
    sessionStorage.setItem(userDetail.userId + 'cart', JSON.stringify(cart));

    Swal.fire({
      icon: 'success',
      title: 'เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว',
      toast: true,
      position: 'bottom-right',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }

  filterProducts(productTypeId: any) {
    if (productTypeId === 'all') {
      this.filteredProductList = this.productList;
    } else {
      this.filteredProductList = this.productList.filter(
        (product: any) => product.productTypeId === productTypeId
      );
    }
  }

  filterProductsByText() {
    if (this.searchText.trim() === '') {
      this.filteredProductList = this.productList;
    } else {
      this.filteredProductList = this.productList.filter((product: any) =>
        product.productName
          .toLowerCase()
          .includes(this.searchText.trim().toLowerCase())
      );
    }
  }
}
