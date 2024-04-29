import { Component, Inject } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { RoleResponseI } from '../../../../../interfaces/role.interface';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from '../../../../services/snack-bar.service';

@Component({
  selector: 'app-update-role-popup',
  standalone: true,
  imports: [
    MatCardModule, 
    MatCheckboxModule,
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './update-role-popup.component.html',
  styleUrl: './update-role-popup.component.scss'
})
export class UpdateRolePopupComponent {
  validRoles: RoleResponseI[] = [];
  selectedRoles: string[] = [];
  constructor(
    private userService: UserService,
    private snackbarService: SnackBarService,
    public dialogRef: MatDialogRef<UpdateRolePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { username: string }
  ) { }

  ngOnInit(): void {
    this.userService.getAllValidRoles().subscribe({
      next: (res) => {
        this.validRoles = res.roles;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  toggleSelection(roleID: string) {
    this.selectedRoles = this.selectedRoles.includes(roleID) ? this.selectedRoles.filter(id => id !== roleID) : [...this.selectedRoles, roleID];
  }

  onUpdate() {
    this.userService.setRoles(this.data.username, this.selectedRoles).subscribe({
      next: (res) => {
        console.log(res);
        this.snackbarService.openSnackBar("Roles updated successfully!", "Close", 5000);
        this.dialogRef.close();
      },
      error: (err) => {
        console.log(err);
        this.snackbarService.openSnackBar("An error occured while updating the roles", "Close", 5000);
      }
    });
  }

}
