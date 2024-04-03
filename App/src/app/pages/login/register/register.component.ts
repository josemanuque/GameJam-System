import { Component, ElementRef, ViewChild } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule  } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import { SitesService } from '../../../services/sites.service';
import { SiteListResponseI, SiteResponseI } from '../../../../interfaces/site.interface';

interface Region {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, RouterModule, MatSelectModule, MatMenuModule],
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
  constructor(private siteService:SitesService, private authService: AuthService, private router: Router){}

  ngOnInit(){
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

  register(){
    const username = this.usernameInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;
    this.authService.login({ username, password }).subscribe(
      (auth) => {
        if(auth){
          localStorage.setItem('currentType', 'jammer');
          localStorage.setItem('email', auth.email);
          this.router.navigate(['/dashboard']);
        } else {
          alert('Invalid credentials');
        }
      }
    );
  }

}
