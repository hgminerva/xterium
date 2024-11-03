import { Component } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
}