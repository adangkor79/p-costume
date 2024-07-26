import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { HomeComponent } from './modules/home/home.component';
import { FullwidthComponent } from './layouts/fullwidth/fullwidth.component';
import { RegisterComponent } from './modules/register/register.component';
import { LoginComponent } from './modules/login/login.component';
import { DashbordAdminComponent } from './modules/dashbordAdmin/dashbordAdmin.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { ManageUserComponent } from './modules/manageUser/manageUser.component';
import { ManageProductComponent } from './modules/manageProduct/manageProduct.component';
import { ProductComponent } from './modules/product/product.component';
import { UpdateProductComponent } from './modules/updateProduct/updateProduct.component';
import { ReportComponent } from './modules/report/report.component';
import { ProductDetailComponent } from './modules/productDetail/productDetail.component';
import { OrderAdminComponent } from './modules/orderAdmin/orderAdmin.component';
import { ProfileEditComponent } from './modules/profileEdit/profileEdit.component';
import { CartComponent } from './modules/cart/cart.component';
import { CreateOrderComponent } from './modules/createOrder/createOrder.component';
import { OrderDetailAdminComponent } from './modules/orderDetailAdmin/orderDetailAdmin.component';
import { OrderUserComponent } from './modules/orderUser/orderUser.component';
import { OrderDetailUserComponent } from './modules/orderDetailUser/orderDetailUser.component';
import { PaymentComponent } from './modules/payment/payment.component';


const routes: Routes = [
  {
    path: '',
    component: FullwidthComponent,
    children: [{
      path: '',
      component: HomeComponent
    },{
      path: 'register',
      component: RegisterComponent
    },{
      path: 'login',
      component: LoginComponent
    },{
      path: 'dashbord-admin',
      component: DashbordAdminComponent
    },{
      path: 'profile',
      component: ProfileComponent
    },{
      path: 'manage-user',
      component: ManageUserComponent
    },{
      path: 'profile/:userId',
      component: ProfileComponent
    },{
      path: 'manage-product',
      component: ManageProductComponent
    },{
      path: 'product',
      component: ProductComponent
    },{
      path: 'product/:productId',
      component: UpdateProductComponent
    },{
      path: 'report',
      component: ReportComponent
    },{
      path: 'productDetail/:productId',
      component: ProductDetailComponent
    },{
      path: 'order-admin',
      component: OrderAdminComponent
    },{
      path: 'profileEdit/:userId',
      component: ProfileEditComponent
    },{
      path: 'cart',
      component: CartComponent
    },{
      path: 'createOrder',
      component: CreateOrderComponent
    },{
      path: 'orderDetailAdmin/:orderId',
      component: OrderDetailAdminComponent
    },{
      path: 'order-user',
      component: OrderUserComponent
    },{
      path: 'orderDetailUser/:orderId',
      component: OrderDetailUserComponent
    },{
      path: 'payment/:orderId',
      component: PaymentComponent
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
