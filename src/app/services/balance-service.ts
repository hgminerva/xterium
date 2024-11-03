import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { Asset } from '../models/asset';
import { Balance } from '../models/balance';

import '@polkadot/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { u128 } from '@polkadot/types';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  constructor( private cookieservice: CookieService) { }

  async getSubstrateBalance(network: string, publicKey: string): Promise<Array<Balance>> {
    let balances: Array<Balance> = [];

    if (this.cookieservice.check('network') == true) {
      const rpc = this.cookieservice.get('network');
      const wsProvider = new WsProvider(rpc);
      const api = await ApiPromise.create({ provider: wsProvider });

      let { data: { free, reserved }, nonce } = await api.query.system.account(publicKey);

      console.log(
        'nonce=', nonce.toNumber(),
        'free=', free.toString(),
        'reserved=', reserved.toString()
      );

      if (this.cookieservice.check('assets') == true) {
        let assets: Array<Asset> = [];
        assets = JSON.parse(this.cookieservice.get('assets'));
        for (const asset of assets) {
          if(asset.network==network) {
            let freeBalance: string = "0";
            let reservedBalance: string = "0";
            if (asset.assetType=="Native") {
              freeBalance = free.toString();
              reservedBalance = reserved.toString();
            }
            const balance: Balance = {
                assetType: asset.assetType,
                symbol: asset.symbol,
                description: asset.description,
                free: freeBalance,
                reserved: reservedBalance,
              };
            balances.push(balance);
          }
        } 
      }

    }

    return balances;
  }

}