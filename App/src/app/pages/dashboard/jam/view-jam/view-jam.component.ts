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
import { Router } from '@angular/router';
import { StageService } from '../../../../services/stage.service';

import { CommonModule } from '@angular/common';


interface Region {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-view-jam',
  standalone: true,
  imports: [MatInputModule,ReactiveFormsModule,MatIconModule,MatSelectModule,MatSidenavModule, MatFormFieldModule, SidenavComponent, MatCardModule, MatDivider],
  templateUrl: './view-jam.component.html',
  styleUrl: './view-jam.component.scss'
})
export class ViewJamComponent {
  constructor(private fb: FormBuilder,private jamService: JamService, private router: Router, private stageService: StageService) {}
  jamData: JamResponseI[] = [];
  stages: any;
  jamStages: any;
  editFlag: boolean = false;
  form!: FormGroup;
  fileName = '';
  modalities: Region[] = [
    {value: 'm1', viewValue: 'Virtual'},
    {value: 'm2', viewValue: 'Presential'},
    {value: 'm3', viewValue: 'Hybrid'}
  ];

  ngOnInit(): void {
    this.jamService.getJams().subscribe(
      (response) => {
        console.log('Jams fetched successfully:', response);
        this.jamData = response.jams;
        this.initializeForm();
        this.jamStages = []; // Initialize this.jamStages as an array
    
        for (const stage of this.jamData[0].stages) {
          this.stageService.getStage(stage).subscribe(
            (response) => {
              console.log('Stage:', response);
              this.jamStages.push(response); // Append each stage to this.jamStages
              console.log('Jam Stages:', this.jamStages);
            },
            (error) => {
              console.error('Error occurred while fetching stage:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error occurred while fetching jams:', error);
        alert('Error occurred while fetching jams. Please try again.');
      }
    );
    
    this.stageService.getStages().subscribe(
      (response) => {
        console.log('Stages:', response);
        this.stages = response;
      },
      (error) => {
        console.error('Error occurred while fetching stages:', error);
      }
    );

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
    title: [''],
    description: [''],
    stages: ['', Validators.required],
  });

  // Set selected stages based on jam's stages
  if (this.jamData && this.jamData.length > 0) {
    const jamStages = this.jamData[0].stages; // Assuming stages are stored in the first jam's stages property
    if (jamStages && jamStages.length > 0) {
      const selectedStages = jamStages.map(stage => stage);
      this.form.get('stages')?.setValue(selectedStages);
    }
    this.form.get('title')?.setValue(this.jamData[0].title);
    this.form.get('description')?.setValue(this.jamData[0].description);
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
  
      this.jamService.updateJam(this.jamData[0]._id, formData).subscribe(
        (response: any) => {
          console.log('Jam updated successfully:', response);
          alert('Jam updated successfully.');
          this.editFlag = false;
          window.location.reload();
        },
        (error) => {
          console.error('Error occurred while updating jam:', error);
          alert('Error occurred while updating jam. Please try again.');
        }
      );
    }
  }

  goToCreateJam(): void {
    this.router.navigate(['dashboard/jam/create']);
  }

  deleteJam(): void {
    const jamId = this.jamData[0]._id;
    this.jamService.removeJam(jamId).subscribe(
      (response: JamMessageResponseI) => {
        console.log('Jam deleted successfully:', response);
        alert('Jam deleted successfully.');
        this.jamData = this.jamData.filter((jam) => jam._id !== jamId);
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
