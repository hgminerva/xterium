import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import { Balance } from '../../models/balance';
import { SubstrateFee } from '../../models/substrate-fee';
import { TransferService } from '../../services/transfer-service';

import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

@Component({
  selector: 'transfer',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './transfer.html',
  styleUrl: './transfer.css'
})
export class TransferComponent {
  balances: Array<Balance> = [];

  balance: Balance;
  id: string = "";
  message: string = "";

  transferQuantity: string;
  transferToAddress: string;

  transferConfirmationMsg: string;

  readyToTransfer: boolean = false;
  isProcessing: boolean = false;

  constructor (
    private route: ActivatedRoute, 
    private cookieservice: CookieService,
    private transferService: TransferService) {}

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id') != null) {

      this.id = (this.route.snapshot.paramMap.get('id') as string);
      if (this.cookieservice.check('balances') == true) {
        this.balances = JSON.parse(this.cookieservice.get('balances'));
        
        for(let i=0; i<this.balances.length; i++){
          if(i==parseInt(this.id)) {
            this.balance = this.balances[i];
          }
        }

      }
      this.message = "Extracting balance of " + this.balance.symbol;
    }
    
  }

  transfer(): void {
    if (this.transferQuantity == null || this.transferToAddress == null) {
      this.message = "The two fields are required"
    }  else {
      if (parseFloat(this.transferQuantity)>parseFloat(this.balance.free)) {
        this.message = "The quantity must not exceed the existing free balance plus fees"
      } else {
        if (this.validateSubstrateAddress(this.transferToAddress)) {
          this.isProcessing = true;
          this.getEstimateFee();
        }
      }
    }
  }

  fixBalance(value: string, decimal: number): string {
    let newValue: string = "";
    let multiplier: number = 10 ** decimal;

    newValue = (parseFloat(value)/multiplier).toString();

    return newValue;
  }

  fixBalanceReverse(value: string, decimal: number): string {
    let newValue: string = "";
    let multiplier: number = 10 ** decimal;

    newValue = (parseFloat(value)*multiplier).toString();

    return newValue;
  }

  validateSubstrateAddress(value: string): boolean {
    try {
      encodeAddress(
        isHex(value) ? hexToU8a(value) : decodeAddress(value)
      );
      return true;
    } catch (error) {
      this.message = error as string;
      return false;
    }
  }

  getEstimateFee(): void {
    this.transferService.getEstimateFee(this.balance.owner, 
      parseFloat(this.fixBalanceReverse(this.transferQuantity,12)),
      this.transferToAddress,
      this.balance).then(data => {
        this.isProcessing = false;
        this.transferConfirmationMsg = "The estimate fee is " + this.fixBalance(data.partialFee,12);
        this.readyToTransfer = true;
    });
  }

  confirmTransfer(): void {
    this.isProcessing = true;
    this.transferService.transfer(this.balance.owner, 
      parseFloat(this.fixBalanceReverse(this.transferQuantity,12)),
      this.transferToAddress,
      this.balance).then(data => {
        this.isProcessing = false;
        this.message = data;
        this.readyToTransfer = false;
    });
  }

  cancelTransfer(): void {
    this.readyToTransfer = false;
  }
  
}