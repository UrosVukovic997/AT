import { Component, OnInit } from '@angular/core';
import {MENU_ITEMS} from './pages-menu';
import {LoginService} from '../@core/services/login.service';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: []
})
export class PagesComponent implements OnInit {

  constructor(private service: LoginService, private router: Router) {
  }

  menu = MENU_ITEMS;

  ngOnInit(): void {
  }
}
