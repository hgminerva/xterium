import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Address } from '../../models/address';

@Component({
  selector: 'address',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './address.html',
  styleUrl: './address.css'
})
export class AddressComponent {
  addresses: Array<Address> = [];
  message: string = "";

  constructor(
    private cookieservice: CookieService,
    private router: Router
  ) {
    if (this.cookieservice.check('addresses') == true) {
      this.addresses = JSON.parse(this.cookieservice.get('addresses'));
      this.message = "Addresses extracted from storage"
    } else {
      this.message = "No data"
    }
  }

  delete(i: number): void {
    this.addresses.splice(i, 1);
    this.cookieservice.set('addresses',JSON.stringify(this.addresses));
    this.message = "Address deleted";
  }

  add(): void {
    this.router.navigateByUrl('/address-detail');
  }

}