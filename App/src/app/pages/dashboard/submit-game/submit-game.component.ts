import { Component } from '@angular/core';

import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../shared/sidenav/sidenav.component";
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormArray } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-submit-game',
  standalone: true,
  imports: [MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,MatInputModule,FormsModule,ReactiveFormsModule, MatButtonModule],
  templateUrl: './submit-game.component.html',
  styleUrl: './submit-game.component.css'
})
export class SubmitGameComponent {
  form!: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      gameTitle: ['', Validators.required],
      description: ['', Validators.required],
      teamInfo: ['', Validators.required],
      gameplayVideo: ['', Validators.required],
      pitchVideo: ['', Validators.required],
      buildLink: ['', Validators.required],
      themes: [[], Validators.required],
      categories: [[], Validators.required]
    });
  }

  // Methods to add and remove themes and categories
  addTheme(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();

    // Add theme
    if (value) {
      const themes = this.form.get('themes') as FormArray;
      themes.push(this.fb.control(value));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTheme(theme: string): void {
    const index = this.form.get('themes')!.value.indexOf(theme);

    if (index >= 0) {
      const themes = this.form.get('themes') as FormArray;
      themes.removeAt(index);
    }
  }

  addCategory(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();

    // Add category
    if (value) {
      const categories = this.form.get('categories') as FormArray;
      categories.push(this.fb.control(value));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeCategory(category: string): void {
    const index = this.form.get('categories')!.value.indexOf(category);

    if (index >= 0) {
      const categories = this.form.get('categories') as FormArray;
      categories.removeAt(index);
    }
  }

  submitForm(): void {
    alert('Form submitted successfully!')
    if (this.form.valid) {
      // Handle form submission
      console.log('Form submitted successfully!');
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid!');
    }
  }

}
