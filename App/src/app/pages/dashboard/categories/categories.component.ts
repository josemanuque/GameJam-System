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
import {MatIconModule} from '@angular/material/icon';
import {provideNativeDateAdapter} from '@angular/material/core';

import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { CategoryCreateRequestI, CategoryListResponseI, CategoryResponseI } from '../../../../interfaces/category.interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [MatIconModule,MatCardModule,MatCheckboxModule,MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,
    MatInputModule,MatButtonModule,FormsModule,ReactiveFormsModule,MatDatepickerModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  form!: FormGroup;
  categories: any;
  selectedFileEng: any = null;
  selectedFileSpa: any = null;
  selectedFilePort: any = null;
  fileNameEng = '';
  fileNameSpa = '';
  fileNamePort = '';
  constructor(private fb: FormBuilder, private catService: CategoryService, private router:Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nameEng: ['', Validators.required],
      descriptionEng: ['', Validators.required],
      nameSpa: ['', Validators.required],
      descriptionSpa: ['', Validators.required],
      namePort: ['', Validators.required],
      descriptionPort: ['', Validators.required],
      manualEng: [null, Validators.required],
      manualSpa: [null, Validators.required],
      manualPort: [null, Validators.required],
    });
    this.catService.getCategoriesName().subscribe(
      (response) => {
        this.categories = response.categoryNames;
        console.log('Categories:', this.categories);
      },
      (error) => {
        console.error('Error occurred while fetching categories:', error);
      }
    );
    
  }

  submitForm(): void {
    if (this.form.valid) {
      const formData = new FormData();
      Object.keys(this.form.controls).forEach(key => {
        formData.append(key, this.form.get(key)!.value);
      });
       this.catService.createCategory(formData).subscribe(
         (response) => {
           console.log('Category created successfully:', response);
           // Optionally, you can reset the form after successful submission
           this.form.reset();
           alert('Category created successfully!');
           window.location.reload();
         },
         (error) => {
           console.error('Error occurred while creating category:', error);
           alert('Error occurred while creating category. Please try again.');
         }
       );
    } else {
      console.log('Form is invalid!');
    }
  }

  onFileSelectedEng(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileNameEng = file.name;
      this.form.patchValue({manualEng: file});
    }
  }
  onFileSelectedSpa(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileNameSpa = file.name;
      this.form.patchValue({manualSpa: file});
    }
  }
  onFileSelectedPort(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileNamePort = file.name;
      this.form.patchValue({manualPort: file});
    }
  }
}
