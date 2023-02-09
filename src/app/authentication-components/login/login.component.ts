import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLogin = true;
  constructor(private router: Router) {}
  ngOnInit(): void {
    console.log(this.router.url);
    if (this.router.url === '/register') {
      this.isLogin = false;
    }
  }
}
