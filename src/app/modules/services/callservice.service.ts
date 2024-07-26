import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, concat } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

const API_ENDPOINT = environment.API_ENDPOINT;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    accept: '*/*',
  }),
};
const httpOptionsMultipart = {
  headers: new HttpHeaders({
    'Content-Type': 'multipart/form-data',
    accept: '*/*',
  }),
};
const httpOptionsText = {
  headers: new HttpHeaders({ 'Content-Type': 'text/plain; charset=utf-8' }),
};

@Injectable({
  providedIn: 'root',
})
export class CallserviceService {
  constructor(private http: HttpClient) {}

  getAllRole(): Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/role/getAllRole'));
  }

  saveRegister(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(
      API_ENDPOINT.concat('/register/insert'),
      body,
      httpOptions
    );
  }

  authen(userName: any, password: any): Observable<any> {
    return this.http.get(
      API_ENDPOINT.concat(
        '/login/authen?userName=' + userName + '&password=' + password
      )
    );
  }

  updateProfile(data: any, userId: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.put<any>(
      API_ENDPOINT.concat('/user/update/' + userId),
      body,
      httpOptions
    );
  }

  getByUserId(userId: any): Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/user/getById?userId=' + userId));
  }

  getAllUser(): Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/manage/user/getAllUser'));
  }

  deleteUserByUserId(userId: any): Observable<any> {
    return this.http.delete(
      API_ENDPOINT.concat('/user/delete?userId=' + userId)
    );
  }

  getProductImgByProductId(productId: any): Observable<any> {
    return this.http.get(
      API_ENDPOINT.concat(
        '/product/getProductImgByProductId?productId=' + productId
      )
    );
  }

  getBlobThumbnail(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<Blob>(
      API_ENDPOINT.concat('/product/getImageByte?fileName=' + fileName),
      { headers: headers, responseType: 'blob' as 'json' }
    );
  }

  getImageByte(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<Blob>(
      API_ENDPOINT.concat('/product/getImageByte?fileName=' + fileName),
      { headers: headers, responseType: 'blob' as 'json' }
    );
  }

  getAllProduct(): Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/product/getAll'));
  }

  getProductTypeAll(): Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/product/getAllProductType'));
  }

  saveImage(formData: FormData, productId: any): Observable<any> {
    return this.http.post<any>(
      API_ENDPOINT.concat('/product/saveImage/' + productId),
      formData
    );
  }

  saveProduct(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(
      API_ENDPOINT.concat('/product/insert'),
      body,
      httpOptions
    );
  }

  removeImgByProductId(productId: any): Observable<any> {
    return this.http.delete(
      API_ENDPOINT.concat(
        '/product/removeImgByProductId?productId=' + productId
      )
    );
  }

  deleteProduct(productId: any): Observable<any> {
    return this.http.delete(
      API_ENDPOINT.concat('/product/delete?productId=' + productId)
    );
  }

  getProductByProductId(productId: any): Observable<any> {
    return this.http.get(
      API_ENDPOINT.concat('/product/getById?productId=' + productId)
    );
  }

  updateProduct(data: any, productId: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.put<any>(
      API_ENDPOINT.concat('/product/update/' + productId),
      body,
      httpOptions
    );
  }

  deleteImage(fileName: any): Observable<any> {
    return this.http.delete(
      API_ENDPOINT.concat('/product/deleteImgByFileName?fileName=' + fileName)
    );
  }

  placeOrder(orderDetails: any): Observable<any> {
    return this.http.post<any>(
      API_ENDPOINT.concat('/order/addOrder'),
      orderDetails,
      httpOptions
    );
  }

  getAllOrders(): Observable<any> {
    return this.http.get(API_ENDPOINT.concat('/order/getAllOrders'));
  }

  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(
      API_ENDPOINT.concat('/order/getOrderDetails/' + orderId)
    );
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(
      API_ENDPOINT.concat('/order/deleteOrder/' + orderId),
      httpOptions
    );
  }

  getOrdersByUserId(userDetailId: number): Observable<any> {
    return this.http.get(
      API_ENDPOINT.concat('/order/getOrdersByUserId/' + userDetailId)
    );
  }

  saveOrderImage(formData: FormData, orderId: any): Observable<any> {
    return this.http.post<any>(
      API_ENDPOINT.concat('/order/saveOrderImg/' + orderId),
      formData
    );
  }

  deleteOrderImage(fileName: any): Observable<any> {
    return this.http.delete(
      API_ENDPOINT.concat('/order/deleteOrderImgByFileName?fileName=' + fileName)
    );
  }

  getBlobOrderThumbnail(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<Blob>(
      API_ENDPOINT.concat('/order/getImageByte?fileName=' + fileName),
      { headers: headers, responseType: 'blob' as 'json' }
    );
  }

  getOrderImageByte(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<Blob>(
      API_ENDPOINT.concat('/order/getImageByte?fileName=' + fileName),
      { headers: headers, responseType: 'blob' as 'json' }
    );
  }

  updateOrder(orderId: number, updatedOrder: any): Observable<any> {
    return this.http.put(
      API_ENDPOINT.concat('/order/updateOrder/' + orderId),
      updatedOrder,
      httpOptions
    );
  }


}
