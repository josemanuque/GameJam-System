import { Component, ElementRef, ViewChild } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule  } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import { SitesService } from '../../../services/sites.service';
import { SiteListResponseI, SiteResponseI } from '../../../../interfaces/site.interface';
import { UserRegisterI } from '../../../../interfaces/auth.interface';

interface Region {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, RouterModule, MatSelectModule, MatMenuModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  regions: Region[] = [
    {value: '0', viewValue: 'North America'},
    {value: '1', viewValue: 'LATAM'},
    {value: '2', viewValue: 'Europe'},
    {value: '3', viewValue: 'Asia'},
    {value: '4', viewValue: 'MENA'},
  ];
  siteData: SiteResponseI[] = [];

  hide = true;
  currentUser: any;
  form!: FormGroup;
  formStep: number = 1;

  constructor(private fb: FormBuilder, private siteService:SitesService, private authService: AuthService, private router: Router){}

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

  onRegister(){
    const userData: UserRegisterI = this.form.value;
    this.authService.register(userData).subscribe(
      auth => {
        if (auth) {
          localStorage.setItem('email', auth.username);
          this.router.navigate(['/dashboard']);
        } else {
          alert('Invalid credentials');
        }
      }
    );
  }

  isStepComplete() {
    let fields: string[] = [];
    if (this.formStep == 1) {
      fields = ['username', 'email', 'password'];
    } else if (this.formStep == 2) {
      fields = ['name', 'lastname', 'phone'];
    } else {
      fields = ['site', 'region'];
    }
    for (let field of fields) {
      if (this.form.get(field)?.value === '') {
            return true;
      }
    }
    return false;
  }

}
