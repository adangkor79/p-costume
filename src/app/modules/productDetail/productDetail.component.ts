import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productDetail',
  templateUrl: './productDetail.component.html',
  styleUrls: ['./productDetail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId: any;
  product: any;
  productImgList: any;
  ImageList: any[] = [];
  imageBlobUrl: any;
  productTypeName: string = '';
  quantity: number = 1; // Default quantity
  relatedProducts: any[] = [];
  currentImage: string = ''; // Add this line for current image display

  constructor(
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('productId');
      if (this.productId) {
        this.getProductDetails();
        this.getRelatedProducts();
      } else {
        this.router.navigate(['/']);
      }
    });
    this.getProductType();
  }

  getProductDetails() {
    this.callService.getProductByProductId(this.productId).subscribe((res) => {
      if (res.data) {
        this.product = res.data;
        this.getProductImages();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  getProductImages() {
    this.callService
      .getProductImgByProductId(this.product.productId)
      .subscribe((res) => {
        if (res.data) {
          this.productImgList = res.data;
          this.ImageList = []; // Initialize ImageList
          for (let productImg of this.productImgList) {
            this.getImage(productImg.productImageName);
          }
          this.currentImage = this.ImageList.length > 0 ? this.ImageList[0].value : ''; // Set initial image
        } else {
          this.router.navigate(['/']);
        }
      });
  }

  getImage(fileNames: any) {
    this.callService.getBlobThumbnail(fileNames).subscribe((res) => {
      let objectURL = URL.createObjectURL(res);
      this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.ImageList.push({
        key: fileNames,
        value: this.imageBlobUrl,
      });

      // Update currentImage if it's the first image
      if (this.ImageList.length === 1) {
        this.currentImage = this.ImageList[0].value;
      }
    });
  }

  addToCart(product: any) {
    let userDetail = JSON.parse(sessionStorage.getItem('userDetail') || '{}');
    if (!userDetail.userId) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        text: 'กรุณาลงชื่อเข้าใช้เพื่อเพิ่มสินค้าไปยังตะกร้า',
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
      item.quantity += this.quantity; // Add the selected quantity
    } else {
      cart.push({
        ...product,
        quantity: this.quantity,
        userId: userDetail.userId,
      });
    }
    sessionStorage.setItem(userDetail.userId + 'cart', JSON.stringify(cart));

    Swal.fire({
      icon: 'success',
      title: 'เพิ่มสินค้าลงในตะกร้าเรียบร้อยแล้ว',
      toast: true,
      position: 'bottom-right',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }

  addRelateToCart(product: any, event: Event) {
    event.stopPropagation();
    let userDetail = JSON.parse(sessionStorage.getItem('userDetail') || '{}');
    if (!userDetail.userId) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        text: 'กรุณาลงชื่อเข้าใช้เพื่อเพิ่มสินค้าไปยังตะกร้า',
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
      item.quantity += 1; // Default quantity for related products
    } else {
      cart.push({
        ...product,
        quantity: 1,
        userId: userDetail.userId,
      });
    }
    sessionStorage.setItem(userDetail.userId + 'cart', JSON.stringify(cart));

    Swal.fire({
      icon: 'success',
      title: 'เพิ่มสินค้าลงในตะกร้าเรียบร้อยแล้ว',
      toast: true,
      position: 'bottom-right',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getProductType() {
    this.callService.getProductTypeAll().subscribe((res) => {
      if (res.data) {
        const productType = res.data.find(
          (type: any) => type.productTypeId === this.product.productTypeId
        );
        this.productTypeName = productType ? productType.productTypeName : '';
      }
    });
  }

  getRelatedProducts() {
    this.callService.getAllProduct().subscribe(
      (res) => {
        if (res.data) {
          this.relatedProducts = res.data.filter(
            (product: any) => product.productId !== this.productId
          );

          // Fetch images for related products
          this.relatedProducts.forEach((product) => {
            product.imgList = [];
            this.callService
              .getProductImgByProductId(product.productId)
              .subscribe((res) => {
                if (res.data) {
                  this.productImgList = res.data;
                  for (let productImg of this.productImgList) {
                    this.getImageForRelated(productImg.productImageName, product.imgList);
                  }
                }
              });
          });
        } else {
          this.relatedProducts = []; // Fallback to empty array if no data
        }
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าเกี่ยวข้อง', error);
        this.relatedProducts = []; // Handle errors by falling back to an empty array
      }
    );
  }

  getImageForRelated(fileNames: any, imgList: any) {
    this.callService.getBlobThumbnail(fileNames).subscribe((res) => {
      if (res) {
        let objectURL = URL.createObjectURL(res);
        let imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        imgList.push({
          key: fileNames,
          value: imageBlobUrl,
        });
      }
    });
  }

  viewProductDetail(productId: number) {
    this.router.navigate(['/productDetail', productId]).then(() => {
      window.location.reload();
    });
  }

  onThumbnailHover(imgUrl: string): void {
    this.currentImage = imgUrl;
  }

  onThumbnailLeave(): void {
    this.currentImage = this.ImageList.length > 0 ? this.ImageList[0].value : '';
  }
}
