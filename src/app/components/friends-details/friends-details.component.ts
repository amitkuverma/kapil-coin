import { Component } from '@angular/core';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'app-friends-details',
  templateUrl: './friends-details.component.html',
  styleUrls: ['./friends-details.component.scss']
})
export class FriendsDetailsComponent {
  constructor(public cookiesService:CookieService){}

}
