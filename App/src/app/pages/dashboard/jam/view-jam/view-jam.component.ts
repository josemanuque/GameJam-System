import { Component, Inject } from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../../shared/sidenav/sidenav.component";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider'; 

import { JamListResponseI, JamResponseI, JamRequestI, JamMessageResponseI } from '../../../../../interfaces/jam.interface';
import { JamService } from '../../../../services/jam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StageService } from '../../../../services/stage.service';

import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { ThemeService } from '../../../../services/theme.service';
import {provideNativeDateAdapter} from '@angular/material/core';
import { SnackBarService } from '../../../../services/snack-bar.service';

interface Region {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-view-jam',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    MatSidenavModule, 
    MatFormFieldModule, 
    SidenavComponent, 
    MatCardModule, 
    MatDivider,
    MatDatepickerModule
  ],
  templateUrl: './view-jam.component.html',
  styleUrl: './view-jam.component.scss'
})
export class ViewJamComponent {
  constructor(
    private fb: FormBuilder,
    private jamService: JamService, 
    private router: Router, 
    private stageService: StageService,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private snackBarService: SnackBarService,
  ) {}
  jamData: JamResponseI = {} as JamResponseI;
  stages: any;
  jamStages: any;
  themesData: any;
  editFlag: boolean = false;
  form!: FormGroup;
  fileName = '';
  modalities: Region[] = [
    {value: 'm1', viewValue: 'Virtual'},
    {value: 'm2', viewValue: 'Presential'},
    {value: 'm3', viewValue: 'Hybrid'}
  ];

  ngOnInit(): void {
    this.route.params.pipe(switchMap((params) => {
      return this.jamService.getJam(params['id']);
    })).subscribe({
      next: (response: JamResponseI) => {
        this.jamData = response;
        this.initializeForm();
        this.jamStages = this.jamData.stages;
      },
      error: (error) => {
        console.error('Error occurred while fetching jam:', error);
      }
    });
    
    this.themeService.getThemes().subscribe({
      next: (response) => {
        console.log('Themes fetched successfully:', response);
        this.themesData = response;
      },
      error: (error) => {
        console.error('Error occurred while fetching themes:', error);
      }
    });
  }

  isStageSelected(stageId: string): boolean {
    if (!this.jamData || !this.form.value.stages) {
        return false;
    }
    // Check if the stageId is included in the form value's stages array
    return this.form.value.stages.includes(stageId);
}

initializeForm(): void {
  this.form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    themes: [''],
    startingDate: ['', Validators.required],
    endingDate: ['', Validators.required]
  });

  // Set selected stages based on jam's stages
  if (this.jamData) {
    const jamStages = this.jamData.stages; // Assuming stages are stored in the first jam's stages property
    if (jamStages && jamStages.length > 0) {
      const selectedStages = jamStages.map(stage => stage);
      this.form.get('stages')?.setValue(selectedStages);
    }
    this.form.get('title')?.setValue(this.jamData.title);
    this.form.get('description')?.setValue(this.jamData.description);
    this.form.get('startingDate')?.setValue(this.jamData.startingDate);
    this.form.get('endingDate')?.setValue(this.jamData.endingDate);
    this.form.get('theme')?.setValue(this.jamData.theme);
    console.log('Form initialized:', this.form.value);
  }
}


  submitForm(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
  
      // Create a new FormData instance
      const formData = new FormData();
  
      // Append each form field to the FormData instance
      for (const key in this.form.value) {
        if (key === 'stages') {
          // If the form field is 'stages', append each stage separately
          this.form.value[key].forEach((stage: string) => {
            formData.append(key, stage);
          });
        } else {
          formData.append(key, this.form.value[key]);
        }
      }
  
      this.jamService.updateJam(this.jamData._id, formData).subscribe(
        (response: any) => {
          console.log('Jam updated successfully:', response);
          this.snackBarService.openSnackBar('Jam updated successfully', "Close", 5000);
          this.editFlag = false;
          const params = this.route.snapshot.params['id'];
          this.router.navigate(['dashboard/jam', params, 'stages']);
        },
        (error) => {
          console.error('Error occurred while updating jam:', error);
          this.snackBarService.openSnackBar('Error occurred while updating jam. Please try again.', "Close", 5000);
        }
      );
    }
  }

  goToCreateJam(): void {
    this.router.navigate(['dashboard/jam/create']);
  }

  deleteJam(): void {
    const jamId = this.jamData._id;
    this.jamService.removeJam(jamId).subscribe(
      (response: JamMessageResponseI) => {
        console.log('Jam deleted successfully:', response);
        alert('Jam deleted successfully.');
        window.location.reload();
      },
      (error) => {
        console.error('Error occurred while deleting jam:', error);
        alert('Error occurred while deleting jam. Please try again.');
      }
    );
  }

  updateJam(): void {
    this.editFlag =! this.editFlag;
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;
      this.form.patchValue({file: file});
    }
  }

}
