import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../@core/services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isSubmitted  =  false;

  constructor(private service: LoginService, private router: Router, private formBuilder: FormBuilder ) {
    if (localStorage.getItem('jwt') !== undefined){
      this.service.isLoggedIn().subscribe(
        data => {
          const str = JSON.stringify(data);
          const d = JSON.parse(str);
          localStorage.setItem('username', d.username);
          this.router.navigate(['/agent/dashboard']);
        }, error => {
          localStorage.clear();
          console.log(error.status);
        }
      );
    }
  }
  ngOnInit(): void {


    this.loginForm  =  this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get formControls() { return this.loginForm.controls; }

  login(){
    this.isSubmitted = true;
    if (this.loginForm.invalid){
      return;
    }
    const user = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      role: 'Agent'
    };
    this.service.login(user).subscribe(
      data => {
        const str = JSON.stringify(data);
        const d = JSON.parse(str);
        localStorage.setItem('jwt', d.jwttoken);
        this.router.navigate(['/agent/dashboard']);
      }, error => {
        console.log(error.status);
      }
   );
  }

}
