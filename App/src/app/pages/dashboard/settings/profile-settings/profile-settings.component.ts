import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from '../../../../shared/sidenav/sidenav.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { UserResponseI } from '../../../../../interfaces/user.interface';
import { SnackBarService } from '../../../../services/snack-bar.service';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    MatSidenavModule, 
    SidenavComponent,
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss'
})
export class ProfileSettingsComponent {
  userForm!: FormGroup;
  user!: UserResponseI | null;
  submissionError: any;

  constructor(
    private userService: UserService, 
    private formBuilder: FormBuilder,
    private snackbarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    console.log(this.user);

    this.userForm = this.formBuilder.group({
      firstname: [this.user?.name, Validators.required],
      lastname: [this.user?.lastname, Validators.required],
      username: [this.user?.username, Validators.required],
      email: [this.user?.email, [Validators.email]],
      phone: [this.user?.phone, Validators.required]
    });
  }
  


  onUpdate(): void {
    console.log(this.userForm.value);

    if(this.userForm.valid) {
      this.userService.updateUser(this.user!.username, this.userForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.userService.setUser(res);
          this.snackbarService.openSnackBar('Profile updated successfully', 'Close', 5000);
        },
        error: (err) => {
          console.log(err);
          this.submissionError = err;
          this.snackbarService.openSnackBar('An error occurred while updating your profile', 'Close', 5000);
        }
      });
    }
  }
}
