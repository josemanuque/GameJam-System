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
  private email: string = '';
  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(){
  }

  sendCode(){
    this.email = this.emailInput.nativeElement.value;
    this.authService.sendPasswordResetEmail({email: this.email}).subscribe(
      res => {
        if (res){
          this.coded = true;
          alert("Code sent successfully");
        }else{
          alert("Code send failed");
        }
      }
    );
  }

  verifyCode(){
    const code = this.codeInput.nativeElement.value;
    this.coded = false;
    this.confirmed = true;
  }

  confirmPass(){
    const OTP = this.codeInput.nativeElement.value;
    const newPassword = this.newPasswordInput.nativeElement.value;
    const confirmPassword = this.confirmPasswordInput.nativeElement.value;
    if(newPassword != confirmPassword){
      alert("Passwords do not match");
      return;
    }
    this.authService.resetPassword({email: this.email, OTP, password : newPassword}).subscribe(
      res => {
        if (res){
          console.log(res);
          alert("Password reset successful");
        }else{
          alert("Password reset failed");
        }
        this.router.navigate(['/login']);
      }
    );
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
