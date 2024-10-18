import { Component } from '@angular/core';
import { CookieService } from 'src/app/services/cookie.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  userInfo: any[] = [];
  userActive: any[] = [];
  widthInfo: any[] = [];
  sendInfo: any[] = [];
  constructor(public cookies:CookieService, private userService: UsersService, private trans:TransactionService){
    this.loadUsers();
    this.loadTrans();
  }
  cards = [
    { title: 'Total Users', content: '1000' },
    { title: 'Active Sessions', content: '250' },
    { title: 'New Registrations', content: '50' },
    { title: 'Revenue', content: '$5000' }
  ];

  loadUsers(){
    this.userService.getUsers().subscribe(
      (res)=>{
        this.userInfo = res;
        this.userActive = res.filter((item:any)=>item.status === 'active');
        console.log(res);
        
      },
      (error:any)=>{
        console.log(error);
        
      }
    )
  }
  loadTrans(){
    this.trans.getAllTransaction().subscribe(
      (res)=>{
        console.log(res);
        
        this.widthInfo = res.filter((item:any)=>item.paymentType === 'withdraw' && item.status === 'pending');
        this.sendInfo = res.filter((item:any)=>item.paymentType === 'buy' && item.status === 'pending');
        console.log(res);
        
      },
      (error:any)=>{
        console.log(error);
        
      }
    )
  }
}
