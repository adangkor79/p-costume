import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // เพิ่ม Validators
import { CallserviceService } from '../services/callservice.service';

@Component({
  selector: 'app-createOrder',
  templateUrl: './createOrder.component.html',
  styleUrls: ['./createOrder.component.css']
})
export class CreateOrderComponent implements OnInit {
  cart: any[] = [];
  userDetail: any;
  selectedPaymentMethod: number;
  updateForm: FormGroup;

  constructor(
    private router: Router,
    private callService: CallserviceService,
    private formBuilder: FormBuilder
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { cart: any[], userDetail: any };
    this.cart = state.cart;
    this.userDetail = state.userDetail;

    this.updateForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      roleId: '',
      userName: ''
    });
  }

  ngOnInit() {
    if (!this.cart || !this.userDetail) {
      this.router.navigate(['/']);
    }
    this.setDataForm(this.userDetail);
  }

  placeOrder() {
    if (!this.selectedPaymentMethod) {
      alert('กรุณาเลือกวิธีการชำระเงิน');
      return;
    }

    if (!this.updateForm.valid) {
      alert('กรุณากรอกข้อมูลของคุณให้ครบก่อนทำการสั่งซื้อ');
      return;
    }

    const orderDetails = {
      userDetailId: this.userDetail.userId,
      paymentId: this.selectedPaymentMethod,
      totalAmount: this.cart.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0),
      status: "unpaid",
      items: this.cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.productPrice
      }))
    };

    this.callService.placeOrder(orderDetails).subscribe(
      response => {
        if (response.status === 'SUCCESS') {
          alert('ส่งคำสั่งซื้อเรียบร้อยแล้ว');
          sessionStorage.removeItem(this.userDetail.userId + 'cart');
          this.router.navigate(['order-user']);
        } else {
          alert('เกิดข้อผิดพลาดในการสั่งซื้อ: ' + response.message);
        }
      },
      error => {
        alert('เกิดข้อผิดพลาดในการสั่งซื้อ: ' + error.message);
      }
    );
  }

  editProfile() {
    this.router.navigate(['/profile']);
  }

  setDataForm(data: any) {
    this.updateForm.patchValue({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      roleId: data.roleId,
      userName: data.userName,
    });
  }

  get isFormInvalid(): boolean {
    return !this.updateForm.valid;
  }
}


