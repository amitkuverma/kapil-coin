import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  cards = [
    { title: 'Total Users', content: '1000' },
    { title: 'Active Sessions', content: '250' },
    { title: 'New Registrations', content: '50' },
    { title: 'Revenue', content: '$5000' }
  ];
}
