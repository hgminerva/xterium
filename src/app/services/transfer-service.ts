import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SubstrateFee } from '../models/substrate-fee';
import { Balance } from '../models/balance';
import { Address } from '../models/address';

import '@polkadot/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
    constructor(private cookieService: CookieService) { }

    // Estimate Fee
    async getEstimateFee(sender: string, value: number, recipient: string, balance: Balance) : Promise<SubstrateFee> {
        let substrateFee: SubstrateFee = new SubstrateFee();

        const rpc = this.cookieService.get('network');
        const wsProvider = new WsProvider(rpc);
        const api = await ApiPromise.create({ provider: wsProvider });

        if(balance.assetType=="Native") {
          const info = await api.tx.balances['transfer'](recipient, value).paymentInfo(sender);
          substrateFee.feeClass = info.class.toString();
          substrateFee.weight = info.weight.toString();
          substrateFee.partialFee = info.partialFee.toString();
        } else {
          const info = await api.tx.assets['transfer'](parseInt(balance.networkId),recipient, value).paymentInfo(sender);
          substrateFee.feeClass = info.class.toString();
          substrateFee.weight = info.weight.toString();
          substrateFee.partialFee = info.partialFee.toString();
        }
      
        return substrateFee;
    }

    // Transfer
    async transfer(sender: string, value: number, recipient: string, balance: Balance): Promise<string> {
      let returnMessage: string = "";
      let addresses: Array<Address> = [];

      const rpc = this.cookieService.get('network');
      const wsProvider = new WsProvider(rpc);
      const api = await ApiPromise.create({ provider: wsProvider });

      if (this.cookieService.check('addresses') == true) {
        addresses = JSON.parse(this.cookieService.get('addresses'));
        for (const address of addresses) {
          if(address.publicKey == sender) {
            const keyring = new Keyring({ type: 'sr25519' });
            const signature = keyring.addFromUri(address.seed);

            if(balance.assetType=="Native") {
              const transfer = api.tx.balances.transferAllowDeath(recipient, value);
              const hash = await transfer.signAndSend(signature);
              returnMessage = hash.toHex(); 
            } else {
              const transfer = api.tx.assets.transfer(parseInt(balance.networkId), recipient, value);
              const hash = await transfer.signAndSend(signature);
              returnMessage = hash.toHex(); 
            }
          }
        }
      } else {
        returnMessage = "No signature"
      }

      return returnMessage;
    }
}