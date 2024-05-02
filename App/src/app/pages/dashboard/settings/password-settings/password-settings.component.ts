import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../../../../shared/sidenav/sidenav.component';
import { NgForm } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../../services/user.service';
import { SnackBarService } from '../../../../services/snack-bar.service';

@Component({
  selector: 'app-password-settings',
  standalone: true,
  imports: [
    FormsModule, 
    RouterModule, 
    MatFormFieldModule, 
    SidenavComponent, 
    MatSidenavModule, 
    MatInputModule
  ],
  templateUrl: './password-settings.component.html',
  styleUrl: './password-settings.component.scss'
})
export class PasswordSettingsComponent {
  username: string = ''; 
  constructor(
    private userService: UserService, 
    private snackbarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.userService.userData$.subscribe({
      next: (userData) => {
        if(!userData) return;
        this.username = userData.username;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onPasswordChange(form: NgForm): void {
    
    if(!form.value.currentPassword || !form.value.newPassword || !form.value.newPasswordConfirmation) {
      this.snackbarService.openSnackBar("Please fill out all fields", "Close", 5000);
      return;
    }
    if(form.value.newPassword !== form.value.newPasswordConfirmation) {
      this.snackbarService.openSnackBar("Passwords do not match", "Close", 5000);
      return;
    }
    if(form.value.newPassword === form.value.currentPassword) {
      this.snackbarService.openSnackBar("New password must be different from old password", "Close", 5000);
      return;
    }
    
    form.value.username = this.username;
    this.userService.updatePassword(form.value).subscribe({
      next: () => {
        this.snackbarService.openSnackBar("Password updated", "Close", 5000);
      },
      error: (err) => {
        console.log(err);
        this.snackbarService.openSnackBar("Error updating password", "Close", 5000);
      }
    })
  }
}
