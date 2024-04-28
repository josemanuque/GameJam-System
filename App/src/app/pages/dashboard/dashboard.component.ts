import { Component } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../shared/sidenav/sidenav.component";

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';

import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SitesService } from '../../services/sites.service';
import { SiteListResponseI, SiteResponseI } from '../../../interfaces/site.interface';
import { UserRegisterI } from '../../../interfaces/auth.interface';
import { UserResponseI } from '../../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

interface Data {
  value: string;
  viewValue: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    imports: [MatCheckboxModule,MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,MatInputModule,MatButtonModule,FormsModule,ReactiveFormsModule,],
})
export class DashboardComponent {
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

  
  username2 = localStorage.getItem('email');

  userData!: UserResponseI;

  form!: FormGroup;
  siteData: SiteResponseI[] = [];
  constructor(private fb: FormBuilder,private authService: AuthService, private router: Router,
    private siteService:SitesService, private userService: UserService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      lastname: [''],
      username: [''],
      email: [''],
      password: [''],
      phone: [''],
      site: [''],
      region: [''],
      roles: [[]], // Empty array as default
    });

    this.userService.getUser().subscribe({
      next: user => {
        console.log('User:', user);
        this.userData = user;
      },
      error: err => {
        console.error('Error occurred while fetching user:', err);
      }
    });

    this.userService.getUserByUsername(this.username2!).subscribe(
      (response: UserResponseI) => {
        this.userData = response;
        console.log('User fetched successfully:', this.userData);
      },
      (error) => {
        console.error('Error occurred while fetching user:', error);
        alert('Error occurred while fetching User. Please try again.');
      }
    );
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
      const form = {
        name: this.form.value.name? this.form.value.name : this.userData.name,
        lastname: this.form.value.lastname ? this.form.value.lastname : this.userData.lastname,
        username: this.form.value.username ? this.form.value.username : this.userData.username,
        email: this.form.value.email ? this.form.value.email : this.userData.email,
        phone: this.form.value.phone ? this.form.value.phone : this.userData.phone,
        site: this.userData.site,
        region: this.userData.region,
        roles: this.userData.roles
      };
      console.log('User data:', form);
      this.userService.updateUserByUsername(this.userData.username,form).subscribe(
        (response) => {
          console.log('User updated successfully:', form);
          // Optionally, you can reset the form after successful submission
          this.form.reset();
          alert('User updated successfully!');
          window.location.reload();
        },
        (error) => {
          console.error('Error occurred while updatading user:', error);
          alert('Error occurred while updating User. Please try again.');
        }
      );
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid!');
    }
  }

}
