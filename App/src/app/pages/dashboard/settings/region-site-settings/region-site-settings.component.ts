import { Component } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from '../../../../shared/sidenav/sidenav.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { UserResponseI } from '../../../../../interfaces/user.interface';
import { SitesService } from '../../../../services/sites.service';
import { SiteListResponseI, SiteResponseI } from '../../../../../interfaces/site.interface';
import { SnackBarService } from '../../../../services/snack-bar.service';

interface Data {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-region-site-settings',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSidenavModule, 
    SidenavComponent,
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './region-site-settings.component.html',
  styleUrl: './region-site-settings.component.scss'
})

export class RegionSiteSettingsComponent {
  form!: FormGroup;
  user!: UserResponseI;
  siteData: SiteResponseI[] = [];

  regions: Data[] = [
    {value: '0', viewValue: 'North America'},
    {value: '1', viewValue: 'LATAM'},
    {value: '2', viewValue: 'Europe'},
    {value: '3', viewValue: 'Asia'},
    {value: '4', viewValue: 'MENA'},
  ];

  constructor(
    private userService: UserService,
    private siteService: SitesService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.userService.userData$.subscribe({
      next: (user: UserResponseI) => {
        if (!user) return;
        this.user = user;
        this.getSites(this.user.region);
        this.initializeForm();
        console.log('User fetched successfully');
      },
      error: (error) => {
        console.error('Error occurred while fetching user:', error);
        alert('Error occurred while fetching User. Please try again.');
      }
    });
  }

  initializeForm(): void {
    if (this.user) {
      this.form = this.formBuilder.group({
        region: [this.user.region, Validators.required],
        site: [this.user.site, Validators.required]
      });
    } else {
      this.form = this.formBuilder.group({
        region: ['', Validators.required],
        site: ['', Validators.required]
      });
    }
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

  onUpdate(): void {
    if(this.form.valid) {
      this.userService.updateUserData(this.user!.username, this.form.value).subscribe({
        next: (res) => {
          console.log(res);
          this.snackbarService.openSnackBar('Profile updated successfully', 'Close', 5000);
        },
        error: (err) => {
          console.log(err);
          this.snackbarService.openSnackBar('An error occurred while updating your profile', 'Close', 5000);
        }
      });
    }
  }
}
