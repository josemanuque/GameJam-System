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
  selector: 'app-stage',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatCheckboxModule,MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,
    MatInputModule,MatButtonModule,FormsModule,ReactiveFormsModule,MatDatepickerModule],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss'
})
export class StageComponent {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private stageService: StageService, private router:Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      priority: ['', Validators.required],
      startingDate: ['', Validators.required],
      endingDate: ['', Validators.required],
      buildDeliveryDate: [''],
      pitchPreviewDeliveryDate: [''],
      pitchDeliveryDate: [''],
      pitchTestDate: [''],
      demoDayDate: ['', Validators.required],
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      const data = this.form.value;
      this.stageService.createStage(data).subscribe(
        (response) => {
          console.log('Stage created successfully:', response);
          // Optionally, you can reset the form after successful submission
          this.form.reset();
          alert('Stage created successfully!');
          window.location.reload();
        },
        (error) => {
          console.error('Error occurred while creating jam:', error);
          alert('Error occurred while creating jam. Please try again.');
        }
      )

  }
}

  goToViewJam(): void {
    this.router.navigate(['dashboard/jam']);
  }

}
