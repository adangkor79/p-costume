import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CallserviceService } from '../services/callservice.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  setCart: any[] = [];
  qrcodelink = '';
  promptpay = '0610598374';
  total = 0;
  userId: any;
  paymentMethods: any;
  bankNumber: number = 4460559552;
  cartsItem: any;
  totalAmount = 0;
  Calculate: any;
  totalPrice = 0;
  productImg: any;
  file: any;

  order: any = { orderId: '', paymentAmount: 0 }; // กำหนดค่าเริ่มต้น

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private callService: CallserviceService
  ) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { order: any, cart: any[] };
    if (state) {
      this.order = state.order;
      this.setCart = state.cart;
      this.userId = this.order.userDetailId;
      this.totalAmount = this.order.totalAmount; // Use the order's totalAmount
      this.onCalculateTotal(this.setCart);
    } else {
      this.router.navigate(['/']);
    }
  }


  onQrCode(total: any) {
    this.qrcodelink = `https://promptpay.io/${this.promptpay}/${total}.png`;
  }

  onCart() {
    if (typeof window !== 'undefined') {
      let cart = sessionStorage.getItem('carts');
      if (cart) {
        let cartData = JSON.parse(cart);
        this.setCart = cartData.map((product: any) => ({
          ...product,
          img: [],
        }));

        if (Array.isArray(this.setCart)) {
          this.setCart.forEach((product: any) => {
            if (product) {
              this.callService.getProductImgByProductId(product.id).subscribe(
                (res) => {
                  if (res) {
                    res.forEach((item: any) => {
                      product.img.push(item.productImgData);
                    });
                  }
                }
              );
              product.formatPrice = Number(product.price).toLocaleString('en-US');
            }
          });
          this.onCalculateTotal(this.setCart);
        } else {
          console.error('Invalid cart data format');
          this.setCart = [];
        }
      } else {
        console.error('No cart data found');
        this.setCart = [];
      }
    }
  }

  onCalculateTotal(CalculateTotal: any) {
    if (CalculateTotal) {
      let total = 0;
      CalculateTotal.forEach((item: any) => {
        total += item.price * item.qty;
      });
      this.totalAmount = total;
      this.Calculate = total.toLocaleString('en-US');
      this.onQrCode(total);
      this.total = total;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e: any) => {
        this.productImg = e.target.result;
        this.file = file;
      };
    }
  }

  orderForm = this.formBuilder.group({
    userId: '',
    total: [0, Validators.required],
    status: 'รอการชำระ',
    createDate: '',
  });

  paymentForm = this.formBuilder.group({
    orderId: [this.order?.orderId || '', Validators.required],
    paymentAmount: [this.totalAmount, Validators.required],
    paymentMethod: ['', Validators.required],
    status: 'รอยืนยัน',
    approvedBy: '',
    createDate: '',
    file: '',
  });

  onSubmit() {
    const orderDto = this.orderForm.value as any;
    orderDto.userId = this.userId;
    orderDto.total = this.total;
    orderDto.status = 'รอการชำระ';
    Swal.fire({
      icon: 'question',
      title: 'คุณต้องการจ่ายเงินใช่หรือไม่',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.callService.placeOrder(orderDto).subscribe((res) => {
          if (res) {
            this.setCart.forEach((product: any) => {
              const orderDetailDto = {
                orderId: res.id,
                id: product.id,
                price: product.price,
                quantity: 1,
              };
              this.callService.saveOrderDetail(orderDetailDto).subscribe((resDetail) => {
                console.log(resDetail);
              });
            });
            const paymentDto = new FormData();
            paymentDto.append('orderId', res.id);
            paymentDto.append('paymentAmount', this.total as any);
            paymentDto.append('paymentMethod', this.paymentMethods);
            paymentDto.append('status', 'รอยืนยัน');
            paymentDto.append('approvedBy', '-');
            paymentDto.append('file', this.file);
            this.callService.registerPayment(paymentDto).subscribe((res) => {
              if (res) {
                Swal.fire({
                  icon: 'success',
                  title: 'บันทึกข้อมูลสำเร็จ',
                  timer: 1000,
                }).then(() => {
                  sessionStorage.setItem('carts', '[]');
                  this.router.navigate(['user/userHome']);
                });
              }
            });
          }
        });
      }
    });
  }
}
