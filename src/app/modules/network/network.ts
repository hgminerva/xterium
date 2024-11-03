import { Component } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'network',
  standalone: true,
  imports: [],
  templateUrl: './network.html',
  styleUrl: './network.css'
})
export class NetworkComponent {
  rpc_address: string = "wss://rpcnodea01.xode.net/n7yoxCmcIrCF6VziCcDmYTwL8R03a/rpc"; // Default Xode RPC node
  message: string = "";
  
  constructor(
    private cookieservice: CookieService
  ) {
    this.rpc_address = this.cookieservice.get('network');
     this.message = "Network address extracted from storage."
  }

  saveToCookie(rpc_address: string): void {
    this.rpc_address = rpc_address;
    this.cookieservice.set('network',rpc_address);
    this.message = "Network address saved to storage."
  }


}