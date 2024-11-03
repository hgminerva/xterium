import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { Asset } from '../models/asset';
import { Balance } from '../models/balance';

import { ApiPromise, WsProvider } from '@polkadot/api';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  constructor( private cookieservice: CookieService) { }

  getBalance(network: string, publicKey: string): Observable<Array<Balance>> {
    return new Observable<Balance[]>((observer) => {
        let assets: Array<Asset> = [];
        let balances: Array<Balance> = [];
        if (this.cookieservice.check('assets') == true) {
            assets = JSON.parse(this.cookieservice.get('assets'));
            for (const asset of assets) {
                if(asset.network==network) {
                    const balance: Balance = {
                        assetType: asset.assetType,
                        symbol: asset.symbol,
                        description: asset.description,
                        quantity: 0,
                      };
                    balances.push(balance);
                }
            }
          } 
        observer.next(balances);
        observer.complete();
    });
  }

}