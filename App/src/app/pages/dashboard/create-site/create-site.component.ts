import {Component} from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder} from '@angular/forms';
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

import { NgbAlertModule, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SitesService } from '../../../services/sites.service';
import { SiteResponseI, SiteCreateRequestI, SiteListResponseI, SiteMessageResponseI } from '../../../../interfaces/site.interface';

interface Region {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-site',
  standalone: true,
  imports: [MatCheckboxModule,MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,
    MatInputModule,MatButtonModule,FormsModule,ReactiveFormsModule,MatDatepickerModule],
  templateUrl: './create-site.component.html',
  styleUrl: './create-site.component.css'
})
export class CreateSiteComponent {
  regions: Region[] = [
    {value: 'steak-0', viewValue: 'North America'},
    {value: 'pizza-1', viewValue: 'LATAM'},
    {value: 'tacos-2', viewValue: 'Europe'},
    {value: 'tacos-3', viewValue: 'Asia'},
    {value: 'tacos-4', viewValue: 'MENA'},
  ];
  modalities: Region[] = [
    {value: 'm1', viewValue: 'Virtual'},
    {value: 'm2', viewValue: 'Presential'},
    {value: 'm3', viewValue: 'Mixed'}
  ];
  form!: FormGroup;
  constructor(private fb: FormBuilder, private siteService: SitesService, private router:Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      region: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      modality: ['', Validators.required],
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      const siteData: SiteCreateRequestI = this.form.value;
      this.siteService.createSite(siteData).subscribe(
        (response) => {
          console.log('Site created successfully:', response);
          // Optionally, you can reset the form after successful submission
          this.form.reset();
          alert('Site created successfully!');
          //window.location.reload();
        },
        (error) => {
          console.error('Error occurred while creating site:', error);
          alert('Error occurred while creating site. Please try again.');
        }
      );
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid!');
    }
  }

  goToViewSite(): void {
    this.router.navigate(['dashboard/sites']);
  }

}

// @Component({
//   selector: 'dialog-animations-example-dialog',
//   templateUrl: 'create-site-dialog.html',
//   styleUrl: './create-site-dialog.css',
//   standalone: true,
//   providers: [provideNativeDateAdapter()],
//   imports: [MatDatepickerModule, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle,
//            MatDialogContent, MatCardModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
//            FormsModule, RouterModule, MatSelectModule, MatMenuModule, MatDividerModule, MatCheckboxModule,
//            NgbDatepickerModule, NgbAlertModule],
// })
// export class DialogAnimationsExampleDialog {
//   presentialChecked: boolean = false;
//   virtualChecked: boolean = false;
//   mixedChecked: boolean = false;
//   model: NgbDateStruct | undefined;
//   model2: NgbDateStruct | undefined;
//   regions: Region[] = [
//     {value: 'steak-0', viewValue: 'North America'},
//     {value: 'pizza-1', viewValue: 'LATAM'},
//     {value: 'tacos-2', viewValue: 'Europe'},
//     {value: 'tacos-3', viewValue: 'Asia'},
//     {value: 'tacos-4', viewValue: 'MENA'},
//   ];
//   constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
// }