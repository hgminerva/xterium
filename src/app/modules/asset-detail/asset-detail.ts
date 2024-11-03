import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Asset } from '../../models/asset';

@Component({
  selector: 'asset-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asset-detail.html',
  styleUrl: './asset-detail.css'
})
export class AssetDetailComponent {
  assets: Array<Asset> = [];
  message: string = "";
  
  assetType: string = "Native";
  network: string = "Xode";
  networkId: string = "0";
  symbol: string = "";
  description: string = "";

  constructor(
    private cookieservice: CookieService,
    private router: Router
  ) {
    if (this.cookieservice.check('assets') == true) {
      this.assets = JSON.parse(this.cookieservice.get('assets'));
      this.message = "Assets extracted from storage"
    } else {
      this.message = "No data"
    }
  }

  saveToCookie(): void {
    const asset: Asset = {
      assetType: this.assetType,
      network: this.network,
      networkId: this.networkId,
      symbol: this.symbol,
      description: this.description,
    };
    this.assets.push(asset);
    this.cookieservice.set('assets',JSON.stringify(this.assets));
    this.message = "Asset saved to storage."
  }

  close(): void {
    this.router.navigateByUrl('/asset');
  }
}