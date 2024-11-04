import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Asset } from '../models/asset';
import { Balance } from '../models/balance';

import '@polkadot/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  constructor( private cookieservice: CookieService) { }

  async getSubstrateBalance(network: string, publicKey: string): Promise<Array<Balance>> {
    let balances: Array<Balance> = [];

    if (this.cookieservice.check('network') == true) {

      // Get the native coin balance
      const rpc = this.cookieservice.get('network');
      const wsProvider = new WsProvider(rpc);
      const api = await ApiPromise.create({ provider: wsProvider });
      let { data: { free, reserved }, nonce } = await api.query.system.account(publicKey);

      // Display the balance
      if (this.cookieservice.check('assets') == true) {
        
        // Get all the asset in the wallet
        let assets: Array<Asset> = [];
        assets = JSON.parse(this.cookieservice.get('assets'));

        for (const asset of assets) {

          // Display only asset on that network
          if(asset.network==network) {

            let freeBalance: string = "0";
            let reservedBalance: string = "0";
            if (asset.assetType=="Native") {
              freeBalance = free.toString();
              reservedBalance = reserved.toString();
            } else if(asset.assetType=="Asset") {
              const data = await api.query.assets.account(asset.networkId, publicKey);
              if (data.toHuman() != null) {
                const humanData = (data.toHuman() as { [key: string]: any })["balance"] as string
                freeBalance = humanData.split(',').join('');
              }
            }

            const balance: Balance = {
              owner: publicKey,
              network: network,
              networkId: asset.networkId,
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