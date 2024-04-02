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
  constructor(private fb: FormBuilder, private jamService: JamService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      theme: ['', Validators.required],
      startingDate: ['', Validators.required],
      endingDate: ['', Validators.required],
    });
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
}
