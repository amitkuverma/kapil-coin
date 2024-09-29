import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router) {
    // Automatically close the panel after each route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const sidepanel = document.getElementById('mySidepanel');
        this.closeNav(sidepanel);  // Pass the element or null
      }
    });
  }

  closeNav(sidepanel: HTMLElement | null): void {
    if (sidepanel) {
      sidepanel.style.width = "0";  // Safely close the panel
    } else {
      console.error('Sidepanel element not found!');
    }
  }

}
