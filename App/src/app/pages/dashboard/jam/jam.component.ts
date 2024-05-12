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
import { JamRequestI } from '../../../../interfaces/jam.interface';
import { Router } from '@angular/router';
import { StageService } from '../../../services/stage.service';

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
  stagesData: any;
  constructor(private fb: FormBuilder, private jamService: JamService, private router:Router, private stageService: StageService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      //theme: ['', Validators.required],
      startingDate: ['', Validators.required],
      endingDate: ['', Validators.required],
      stages: [[''], Validators.required]
    });

    this.stageService.getStages().subscribe(
      (response) => {
        this.stagesData = response;
        console.log('Stages fetched successfully:', this.stagesData);
      },
      (error) => {
        console.error('Error occurred while fetching stages:', error);
      }
    );

  }

  submitForm(): void {
    if (this.form.valid) {
      const jamData: JamRequestI = this.form.value;
      this.jamService.createJam(jamData).subscribe(
        (response) => {
          console.log('Jam created successfully:', response);
          // Optionally, you can reset the form after successful submission
          this.form.reset();
          alert('Jam created successfully!');
          this.router.navigate(['dashboard/jam']);
        },
        (error) => {
          console.error('Error occurred while creating jam:', error);
          alert('Error occurred while creating jam. Please try again.');
        }
      );
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid!');
    }
  }

  goToViewJam(): void {
    this.router.navigate(['dashboard/jam']);
  }

}
