import { Component, ElementRef, ViewChild } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
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
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  hide = true;
  currentUser: any;
  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(){
    this.authService.isAuthenticated().subscribe(user => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
  /**
   * @deprecated
   */
  login():void {
    const username = this.usernameInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;
    this.authService.login({ username, password }).subscribe(
      (auth) => {
        console.log(auth);
        if (auth) {
          localStorage.setItem('currentType', 'jammer');
          localStorage.setItem('email', auth.email);
          this.router.navigate(['/dashboard']);
        } else {
          alert('Invalid credentials');
        }
      },
      (error) => {
        console.error('Error during login:', error);
        // Handle error, maybe show a user-friendly message
      }
    );
  }

  onLogin(): void {
    const username = this.usernameInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;
    this.authService.login({ username, password }).subscribe(
      auth => {
        if (auth) {
          localStorage.setItem('email', auth.username);
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