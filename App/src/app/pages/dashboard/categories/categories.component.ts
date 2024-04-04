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

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [MatCardModule,MatCheckboxModule,MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,
    MatInputModule,MatButtonModule,FormsModule,ReactiveFormsModule,MatDatepickerModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  form!: FormGroup;
  categories: any;
  constructor(private fb: FormBuilder, private catService: CategoryService, private router:Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.catService.getCategoriesName().subscribe(
      (response) => {
        this.categories = response.categoryNames;
      },
      (error) => {
        console.error('Error occurred while fetching categories:', error);
      }
    );
    
  }

  submitForm(): void {
    if (this.form.valid) {
       const catData: CategoryCreateRequestI = this.form.value;
       this.catService.createCategory(catData).subscribe(
         (response) => {
           console.log('Category created successfully:', response);
           // Optionally, you can reset the form after successful submission
           this.form.reset();
           alert('Category created successfully!');
           //window.location.reload();
         },
         (error) => {
           console.error('Error occurred while creating category:', error);
           alert('Error occurred while creating category. Please try again.');
         }
       );
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid!');
    }
  }
}
