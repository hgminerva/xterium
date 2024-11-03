import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Address } from '../../models/address';
import { mnemonicGenerate, mnemonicValidate, mnemonicToMiniSecret, sr25519PairFromSeed, encodeAddress } from '@polkadot/util-crypto';
import { u8aToHex} from '@polkadot/util';

@Component({
  selector: 'address-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address-detail.html',
  styleUrl: './address-detail.css'
})
export class AddressDetailComponent {
  addresses: Array<Address> = [];
  message: string = "";
  
  addressType: string = "Xode";
  mnemonicKey: string = "";
  secretKey: string;
  publicKey: string;

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

  saveToCookie(): void {
    const address: Address = {
      secretKey: this.secretKey,
      publicKey: this.publicKey,
      addressType: this.addressType,
    };
    this.addresses.push(address);
    this.cookieservice.set('addresses',JSON.stringify(this.addresses));
    this.message = "Address saved to storage."
  }

  generate(): void {
    this.mnemonicKey = mnemonicGenerate();
    this.message = "Mnemonic phrase generated";
  }

  createKeys(): void {
    if(mnemonicValidate(this.mnemonicKey)) {
      const seed = mnemonicToMiniSecret(this.mnemonicKey);
      const { publicKey, secretKey } = sr25519PairFromSeed(seed);
      this.publicKey = encodeAddress(publicKey);
      this.secretKey = u8aToHex(secretKey);
    } else {
      this.message = "Mnemonic not valid";
    }
  }

  close(): void {
    this.router.navigateByUrl('/address');
  }

}