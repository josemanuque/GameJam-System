import {Component} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../shared/sidenav/sidenav.component";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';


import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { Router, RouterModule  } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';

import { NgbAlertModule, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

interface Region {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-site',
  standalone: true,
  imports: [MatSidenavModule, MatFormFieldModule, SidenavComponent, MatButtonModule, MatCardModule, ],
  templateUrl: './create-site.component.html',
  styleUrl: './create-site.component.css'
})
export class CreateSiteComponent {
  longText = `This site is...`;
  constructor(public dialog: MatDialog) {}

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'create-site-dialog.html',
  styleUrl: './create-site-dialog.css',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle,
           MatDialogContent, MatCardModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
           FormsModule, RouterModule, MatSelectModule, MatMenuModule, MatDividerModule, MatCheckboxModule,
           NgbDatepickerModule, NgbAlertModule],
})
export class DialogAnimationsExampleDialog {
  presentialChecked: boolean = false;
  virtualChecked: boolean = false;
  mixedChecked: boolean = false;
  model: NgbDateStruct | undefined;
  model2: NgbDateStruct | undefined;
  regions: Region[] = [
    {value: 'steak-0', viewValue: 'North America'},
    {value: 'pizza-1', viewValue: 'LATAM'},
    {value: 'tacos-2', viewValue: 'Europe'},
    {value: 'tacos-3', viewValue: 'Asia'},
    {value: 'tacos-4', viewValue: 'MENA'},
  ];
  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
}