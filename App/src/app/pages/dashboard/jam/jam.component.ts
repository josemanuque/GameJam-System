import { Component } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../shared/sidenav/sidenav.component";
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';

import {provideNativeDateAdapter} from '@angular/material/core';

import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JamService } from '../../../services/jam.service';
import { JamRequestI, JamResponseI } from '../../../../interfaces/jam.interface';
import { Router } from '@angular/router';
import { StageService } from '../../../services/stage.service';
import { ThemeService } from '../../../services/theme.service';
import { SnackBarService } from '../../../services/snack-bar.service';

@Component({
  selector: 'app-jam',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatCheckboxModule,MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,
    MatInputModule,MatButtonModule,FormsModule,ReactiveFormsModule,MatDatepickerModule],
  templateUrl: './jam.component.html',
  styleUrl: './jam.component.scss'
})
export class JamComponent {
  form!: FormGroup;
  themesData: any;
  constructor(
    private fb: FormBuilder, 
    private jamService: JamService, 
    private router: Router, 
    private stageService: StageService,
    private themeService: ThemeService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      themes: ['', Validators.required],
      startingDate: ['', Validators.required],
      endingDate: ['', Validators.required]
    });

    this.themeService.getThemes().subscribe(
      {next: (response) => {
        console.log('Themes fetched successfully:', response);
        this.themesData = response;
      },
      error: (error) => {
        console.error('Error occurred while fetching themes:', error);
        this.snackBarService.openSnackBar('Error occurred while fetching themes', "Close", 5000);
      }
    });

  }

  submitForm(): void {
    if (this.form.valid) {
      const jamData: JamRequestI = this.form.value;
      this.jamService.createJam(jamData).subscribe({
        next: (response: JamResponseI) => {
          console.log('Jam created successfully:', response);
          this.snackBarService.openSnackBar('Jam created successfully', "Close", 5000);
          this.router.navigate(['dashboard/jam', response._id, 'stages']);
        },
        error: (error) => {
          console.error('Error occurred while creating jam:', error);
          this.snackBarService.openSnackBar('Error occurred while creating jam. Please try again.', "Close", 5000);
        }
      });
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid!');
    }
  }

  goToViewJam(): void {
    this.router.navigate(['dashboard/jam']);
  }

}
