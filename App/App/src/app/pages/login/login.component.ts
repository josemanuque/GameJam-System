import { Component, ElementRef, ViewChild } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router, RouterModule  } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, RouterModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  hide = true;
  currentUser: any;
  constructor(private authService: AuthServiceService, private router: Router){}

  ngOnInit(){
  }

  login(){
    const email = this.emailInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;
    this.authService.login(email, password).subscribe(
      (auth) => {
        console.log(auth)
        if(auth){
          localStorage.setItem('currentType', 'jammer');
          localStorage.setItem('email', auth.email);
          this.router.navigate(['/dashboard']);
        } else {
          alert('Invalid credentials');
        }
      }
    );
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const username = form.value.username;
      const password = form.value.password;
      
      // Now you can perform your login logic here
      console.log('Username:', username);
      console.log('Password:', password);
    }
  }
}