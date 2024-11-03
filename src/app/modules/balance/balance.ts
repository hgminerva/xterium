import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Address } from '../../models/address';
import { Asset } from '../../models/asset';

@Component({
  selector: 'balance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './balance.html',
  styleUrl: './balance.css'
})
export class BalanceComponent {
  addresses: Array<Address> = [];
  assets: Array<Asset> = [];

  message: string = "";
  
  network: string = "Xode";
  publicKey: string = "";

  constructor(
    private cookieservice: CookieService
  ) {
    if (this.cookieservice.check('addresses') == true) {
      this.addresses = JSON.parse(this.cookieservice.get('addresses'));
      this.message = "Addresses extracted from storage";
      if (this.cookieservice.check('balanceAddress') == true) {
        this.publicKey = this.cookieservice.get('balanceAddress');
        if (this.cookieservice.check('assets') == true) {
          this.assets = JSON.parse(this.cookieservice.get('assets'));
          this.message = "Assets extracted from storage"
        } else {
          this.message = "The address has no assets"
        }
      }
    } else {
      this.message = "No addresses";
    }
  }

  onAddressChange(): void {
    this.cookieservice.set('balanceAddress',this.publicKey);
    this.message = this.publicKey + " is stored";
  }

  transfer(assetIndex: number) {

  }
}