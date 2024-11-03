import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Asset } from '../../models/asset';

@Component({
  selector: 'asset',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset.html',
  styleUrl: './asset.css'
})
export class AssetComponent {
  assets: Array<Asset> = [];
  message: string = "";

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

  delete(i: number): void {
    this.assets.splice(i, 1);
    this.cookieservice.set('assets',JSON.stringify(this.assets));
    this.message = "Asset deleted";
  }

  add(): void {
    this.router.navigateByUrl('/asset-detail');
  }
}