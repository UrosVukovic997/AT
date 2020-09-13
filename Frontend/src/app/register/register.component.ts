import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../@core/services/login.service';
import {Router} from '@angular/router';
import {ValidationService} from '../@core/services/validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  loginForm: FormGroup;
  isSubmitted  =  false;

  constructor(private service: LoginService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.loginForm  =  this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, ValidationService.passwordValidator]],
      email: ['', [Validators.required, ValidationService.emailValidator]]
    });
  }

  get formControls() { return this.loginForm.controls; }


  register(){
    this.isSubmitted = true;
    if (this.loginForm.invalid){
      console.log(this.loginForm.controls);
      console.log('ne valja');
      this.isSubmitted = false;
      return;
    }
    const user = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      email: this.loginForm.value.email,
      role: 'Agent'
    };
    this.service.register(user).subscribe(
      data => {
        this.router.navigate(['/agent/login']);
      }, error => {
        console.log(error.status);
      }
    );
  }


}
