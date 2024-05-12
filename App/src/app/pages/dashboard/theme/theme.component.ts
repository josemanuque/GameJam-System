import { Component } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../shared/sidenav/sidenav.component";
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';

import {provideNativeDateAdapter} from '@angular/material/core';

import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { CategoryCreateRequestI, CategoryListResponseI, CategoryResponseI } from '../../../../interfaces/category.interface';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [MatCardModule,MatCheckboxModule,MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,
    MatInputModule,MatButtonModule,FormsModule,ReactiveFormsModule,MatDatepickerModule],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss'
})
export class ThemeComponent {
  form!: FormGroup;
  categories: any;
  selectedFileEng: any = null;
  selectedFileSpa: any = null;
  selectedFilePort: any = null;
  constructor(private fb: FormBuilder, private themeService: ThemeService, private router:Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nameEng: ['', Validators.required],
      descriptionEng: ['', Validators.required],
      nameSpa: ['', Validators.required],
      descriptionSpa: ['', Validators.required],
      namePort: ['', Validators.required],
      descriptionPort: ['', Validators.required],
      manualEng: [null],
      manualSpa: [null],
      manualPort: [null],
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      const data = this.form.value;
      // if (this.selectedFileEng) {
      //   data.manualEng = this.selectedFileEng;
      // }
      // if (this.selectedFileSpa) {
      //   data.manualSpa = this.selectedFileSpa;
      // }
      // if (this.selectedFilePort) {
      //   data.manualPort = this.selectedFilePort;
      // }
      this.themeService.createTheme(data).subscribe(
        (response) => {
          console.log('Theme created successfully:', response);
          // Optionally, you can reset the form after successful submission
          this.form.reset();
          alert('Theme created successfully!');
          window.location.reload();
          this.router.navigate(['/dashboard/theme']);
        },
        (error) => {
          console.error('Error occurred while creating theme:', error);
          alert('Error occurred while creating theme. Please try again.');
        }
      );
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid!');
    }
  }
  onFileSelectedEng(event: any): void {
    this.selectedFileEng = event.target.files[0] ?? null;
  }
  onFileSelectedSpa(event: any): void {
    this.selectedFileSpa = event.target.files[0] ?? null;
  }
  onFileSelectedPort(event: any): void {
    this.selectedFilePort = event.target.files[0] ?? null;
  }

}
