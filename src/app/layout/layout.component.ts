import { Component } from '@angular/core';
import { CookieService } from '../services/cookie.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  constructor(public cookiesService:CookieService){}
}
