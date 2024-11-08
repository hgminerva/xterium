import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Address } from '../../models/address';
import { Balance } from '../../models/balance';
import { BalanceService } from '../../services/balance-service';

@Component({
  selector: 'balance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './balance.html',
  styleUrl: './balance.css'
})
export class BalanceComponent {
  addresses: Array<Address> = [];
  balances: Array<Balance> = [];

  message: string = "";
  
  network: string = "Xode";
  publicKey: string = "";

  constructor(
    private cookieservice: CookieService,
    private balanceService: BalanceService,
    private router: Router
  ) {
    if (this.cookieservice.check('addresses') == true) {
      this.addresses = JSON.parse(this.cookieservice.get('addresses'));
      this.message = "Addresses extracted from storage";
      this.publicKey = this.cookieservice.get('balanceAddress');
      this.getBalances();
    } else {
      this.message = "No addresses";
    }
  }

  getBalances(): void {
    // Clean the balances
    this.balances = [];

    this.balanceService.getSubstrateBalance(this.network,this.publicKey).then(data => {
      if (data.length > 0) {
        for(let i=0;i<data.length;i++) {
          this.balances.push({
            owner: data[i].owner,
            network: data[i].network,
            networkId: data[i].networkId,
            assetType: data[i].assetType,
            symbol: data[i].symbol,
            description: data[i].description,
            free: this.fixBalance(data[i].free,12),
            reserved: this.fixBalance(data[i].reserved,12),
          })
          this.cookieservice.set('balances',JSON.stringify(this.balances));
        }
      } 
    });
  }

  onAddressChange(): void {
    this.cookieservice.set('balanceAddress',this.publicKey);
    this.message = this.publicKey + " is stored";

    this.getBalances();
  }

  transfer(assetIndex: number) {
    this.router.navigateByUrl('/transfer/'+assetIndex.toString());
  }

  fixBalance(value: string, decimal: number): string {
    let newValue: string = "";
    let multiplier: number = 10 ** decimal;

    newValue = (parseFloat(value)/multiplier).toString();

    return newValue;
  }
}