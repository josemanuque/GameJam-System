import { Component } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../shared/sidenav/sidenav.component";
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';

import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';

interface Region {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [MatCheckboxModule,MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,MatInputModule,MatButtonModule,FormsModule,ReactiveFormsModule,],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  regions: Region[] = [
    {value: '0', viewValue: 'North America'},
    {value: '1', viewValue: 'LATAM'},
    {value: '2', viewValue: 'Europe'},
    {value: '3', viewValue: 'Asia'},
    {value: '4', viewValue: 'MENA'},
  ];

  form!: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      discord: ['', Validators.required],
      password: ['', Validators.required],
      region: ['', Validators.required],
      judgeChecked: [false],
      coordinatorChecked: [false],
      jammerChecked: [false]
    });
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
