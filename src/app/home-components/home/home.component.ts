import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  myScriptElement: HTMLScriptElement;
  search_term: string = '';
  constructor(
    private auth: AuthService,
    private router: Router,
    private dataService: DataService
  ) {
    this.myScriptElement = document.createElement('script');
    this.myScriptElement.src = '/assets/js/navbar.js';
    document.body.appendChild(this.myScriptElement);
  }
  ngOnInit(): void {
    if (localStorage.getItem('token') !== 'true')
      this.router.navigate(['login']);
    // else this.router.navigate(['scribble']); //Todo remove this line
  }
  logout() {
    this.auth.logout();
  }
  search() {
    this.dataService.onSearchClicked(this.search_term);
  }
}
