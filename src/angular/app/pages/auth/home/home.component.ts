import { OdinEvent } from './../../../../../shared/enums/OdinEvent';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { Router } from '@angular/router';
import { CommonFunctions } from '../../../../../shared/CommonFunctions';
import { PaymentType, IOrder } from '../../../../../shared/types/IOrder';
import { IOrderItem } from '../../../../../shared/types/IOrderItem';

declare global {
  interface Window {
    Odin: any;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  itemForm = new FormGroup({
    user: new FormControl(''),
    pass: new FormControl(''),
    id: new FormControl('62001043595'),
    dev: new FormControl(false),
  });

  version = '';

  private _orders: IOrderItem[] = [];
  // router: any;
  constructor(private router: Router, private _odin: MainProcessService) {
    window.Odin = _odin;
  }

  ngOnInit() {
    this.itemForm = new FormGroup({
      user: new FormControl(''),
      pass: new FormControl(''),
      id: new FormControl('62001043595'),
    });
    //console.log('v', process.versions);
    //this.version = process.env.APP_VER;
    this._odin.on(OdinEvent.SYNCED, async (data) => {
      console.log('on OdinEvent.SYNCED', data);

      this._odin.getLastSyncDate().subscribe((data) => {
        console.log(data);
      });
    });
    this._odin.once(OdinEvent.SYNCED, (data) => {
      console.log('once OdinEvent.SYNCED', data);
    });
  }

  sync() {
    this._odin.sync().subscribe((data) => {
      console.log(data);
    });
  }

  checkUpdates() {
    this._odin.checkUpdates().subscribe((data) => {
      console.log(data);
    });
  }

  installUpdate() {
    this._odin.installUpdate().subscribe((data) => {
      console.log(data);
    });
  }

  reboot() {
    this._odin.reboot().subscribe((data) => {
      console.log(data);
    });
  }

  toggleDev() {}

  barcode() {
    this._odin.getProducts('', 0, 10).subscribe((data) => {
      console.log('barcode', data);
    });
  }

  getPurchaseOrders() {
    this._odin.getPurchaseOrders('', 0, 10).subscribe((data) => {
      console.log('barcode', data);
    });
  }

  getOperators() {
    this._odin.getOperators().subscribe((data) => {
      console.log('operators', data);
    });
  }

  closeDay() {
    this._odin.closeDay().subscribe((data) => {
      console.log('closeDay', data);
    });
  }

  async signIn() {
    // console.log('signin true', await this._odin.operatorLogIn(1, '1234'));
    // console.log('signin false', await this._odin.operatorLogIn(1, '1235'));
  }

  async getCategories() {
    // console.log('get categories', await this._odin.getCategories());
  }

  async getSuppliers() {
    // console.log('get suppliers', await this._odin.getSuppliers());
  }

  async onSubmit() {
    console.log(
      await this._odin.registerDevice(
        this.itemForm.value.user,
        this.itemForm.value.pass,
        this.itemForm.value.id
      )
    );
    alert('Closing app. Please start again');
    this._odin.close();
  }

  async pay() {
    const order: IOrder = {
      orderId: this.generateGuid(),
      orderItems: this._orders,
      taxAmount: this._odin.settings.taxRate,
      taxRate: this._odin.settings.taxRate,
      paymentType:
        this.itemForm.value.creditCardPayment == true ? PaymentType.BOG : PaymentType.Cash,
      isDetailed: false,
    };

    console.log(await this._odin.order(order));
    this._orders = [];
    console.log('done');
  }

  async batch() {
    // for (let i = 0; i < 10; i++) {
    //   await this._odin.closeDay();
    // }
    // return;
    // var order: IOrder = {
    //   isDetailed: false,
    //   orderId: '42ee1ac2-2c7a-47d2-9a82-427169d26e55',
    //   orderItems: [
    //     {
    //       discountRate: 0,
    //       name: 'კოკა კოლა 2ლ',
    //       quantity: 1,
    //       stockItemId: 2,
    //       unitPrice: 0.01
    //     }
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01},
    //     // {"discountRate":0,"name":"კოკა კოლა 2ლ","quantity":1,"stockItemId":2,"unitPrice":0.01}
    //   ],
    //   paymentType: PaymentType.Manual
    // };
    // console.log(await this._odin.order(order));
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToSetup() {
    this.router.navigate(['/setup']);
  }

  generateGuid() {
    return CommonFunctions.generateGuid();
  }
}
