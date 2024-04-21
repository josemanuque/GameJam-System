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
  error: Boolean = false;
  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(){
    
  }

  onInputFocus(): void {
    this.error = false;
  }
  
  onLogin(form: NgForm): void {
    this.authService.login(form.value).subscribe({
      next: auth => {
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.error = true;
      }
    });
  }
}