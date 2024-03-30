import { Component, ElementRef, ViewChild } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule  } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('codeInput') codeInput!: ElementRef;
  @ViewChild('newPasswordInput') newPasswordInput!: ElementRef;
  @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;

  hide = true;
  currentUser: any;
  coded = false;
  confirmed = false;
  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(){
  }

  sendCode(){
    const email = this.emailInput.nativeElement.value;
    this.coded = true;
  }

  verifyCode(){
    const code = this.codeInput.nativeElement.value;
    this.coded = false;
    this.confirmed = true;
  }

  confirmPass(){
    const newPassword = this.newPasswordInput.nativeElement.value;
    const confirmPassword = this.confirmPasswordInput.nativeElement.value;
    this.router.navigate(['/login']);
  }

  onSubmit(form: NgForm) {
    alert(this.coded)
    if (form.valid) {
      const username = form.value.username;
      const password = form.value.password;
      
      // Now you can perform your login logic here
      console.log('Username:', username);
      console.log('Password:', password);
    }
  }

}
