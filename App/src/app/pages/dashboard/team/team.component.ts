import { Component, Inject } from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../shared/sidenav/sidenav.component";
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [MatSidenavModule, MatFormFieldModule, SidenavComponent, MatCardModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {
  notInTeam = true;
  constructor(public dialog: MatDialog, private router: Router) {}

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(DialogTeam, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { notInTeam: this.notInTeam } // Pass the current value of notInTeam to the dialog
    });    
  
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.notInTeam !== undefined) {
        this.notInTeam = result.notInTeam;
        alert('Dialog closed with result: ' + result.notInTeam);
      }
    });
  }
  openKickDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(KickDialogTeam, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { notInTeam: this.notInTeam } // Pass the current value of notInTeam to the dialog
    });    
  }

  goToCreateTeam() {
    this.router.navigate(['/dashboard/team/create']);
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'create-team-dialog.html',
  styleUrl: './create-team-dialog.css',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDividerModule],
})
export class DialogTeam {
  form!: FormGroup;
  constructor(public dialogRef: MatDialogRef<DialogTeam>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data.notInTeam); // Access the value of notInTeam
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      teamName: ['', Validators.required],
      integrants: ['', Validators.required],
    });
  }
  
  submitForm(): void {
    alert('Form submitted successfully!');
    this.dialogRef.close({ notInTeam: false }); // Close the dialog with the updated value of notInTeam
  }
}

@Component({
  selector: 'dialog-animations-example-dialog2',
  templateUrl: 'kick-integrant-dialog.html',
  styleUrl: './kick-integrant-dialog.css',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDividerModule],
})
export class KickDialogTeam {
  form!: FormGroup;
  constructor(public dialogRef: MatDialogRef<DialogTeam>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data.notInTeam); // Access the value of notInTeam
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      teamName: ['', Validators.required],
      integrants: ['', Validators.required],
    });
  }
  
  submitForm(): void {
    alert('Kicked!');
    this.dialogRef.close({ notInTeam: false }); // Close the dialog with the updated value of notInTeam
  }
}
