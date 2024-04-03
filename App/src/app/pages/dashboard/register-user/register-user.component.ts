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
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { SitesService } from '../../../services/sites.service';
import { SiteListResponseI, SiteResponseI } from '../../../../interfaces/site.interface';
import { UserRegisterI } from '../../../../interfaces/auth.interface';


interface Data {
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
  regions: Data[] = [
    {value: '0', viewValue: 'North America'},
    {value: '1', viewValue: 'LATAM'},
    {value: '2', viewValue: 'Europe'},
    {value: '3', viewValue: 'Asia'},
    {value: '4', viewValue: 'MENA'},
  ];
  roles: Data[] = [
    {value: '0', viewValue: 'Jammer'},
    {value: '1', viewValue: 'Judge'},
    {value: '2', viewValue: 'Local Organizer'},
    {value: '3', viewValue: 'Global Organizer'}
  ];

  form!: FormGroup;
  siteData: SiteResponseI[] = [];
  constructor(private fb: FormBuilder,private authService: AuthService, private router: Router,
    private siteService:SitesService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.required]],
      password: ['', [Validators.required, Validators.required]],
      phone: ['', Validators.required],
      site: ['', Validators.required],
      region: ['', Validators.required],
      roles: [[], Validators.required], // Empty array as default
    });
  }

  getSites(region: string) {
    this.siteService.getSitesFromRegion(region).subscribe(
      (response: SiteListResponseI) => {
        this.siteData = response.sites;
        console.log('Sites fetched successfully:', this.siteData)
      },
      (error) => {
        console.error('Error occurred while fetching sites:', error);
        alert('No Sites are created for this region. Please try again.');
      }
    );
  }

  submitForm(): void {
    if (this.form.valid) {
      const userData: UserRegisterI = this.form.value;
      this.authService.register(userData).subscribe(
        (response) => {
          console.log('User created successfully:', response);
          // Optionally, you can reset the form after successful submission
          this.form.reset();
          alert('User created successfully!');
          window.location.reload();
        },
        (error) => {
          console.error('Error occurred while creating user:', error);
          alert('Error occurred while creating User. Please try again.');
        }
      );
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid!');
    }
  }
}
