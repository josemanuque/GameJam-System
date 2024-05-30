import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SidenavComponent } from '../../../../shared/sidenav/sidenav.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SitesService } from '../../../../services/sites.service';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { RoleService } from '../../../../services/role.service';
import { SiteListResponseI } from '../../../../../interfaces/site.interface';
import { switchMap } from 'rxjs';


interface Data {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [
    MatIconModule,
    MatCheckboxModule,
    MatSidenavModule, 
    MatFormFieldModule, 
    SidenavComponent,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent {
  regions: Data[] = [
    {value: '0', viewValue: 'North America'},
    {value: '1', viewValue: 'LATAM'},
    {value: '2', viewValue: 'Europe'},
    {value: '3', viewValue: 'Asia'},
    {value: '4', viewValue: 'MENA'},
  ];
  rolesGlobal: Data[] = [
    {value: '0', viewValue: 'Jammer'},
    {value: '1', viewValue: 'Judge'},
    {value: '2', viewValue: 'Local Organizer'},
    {value: '3', viewValue: 'Global Organizer'}
  ];
  roleslocal: Data[] = [
    {value: '0', viewValue: 'Jammer'},
    {value: '1', viewValue: 'Judge'}
  ];
  roles:any;

  form!: FormGroup;
  globalOrganizerID: string = '';
  isGlobalOrganizer = true;
  siteData: any[] = [];
  fileName = '';
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private userService: UserService,
    private router: Router,
    private siteService:SitesService,
    private snackbarService: SnackBarService,
    private roleService: RoleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.required]],
      password: [''],
      phone: [''],
      site: [''],
      region: [''],
      roles: [[], Validators.required], // Empty array as default
      file: [null],
    });

    this.userService.userData$.subscribe({
      next: (user) => {
        if (!user) return;
        if(!user.roles.map((role: { name: any; }) => role.name).includes('Global Organizer')){
          this.isGlobalOrganizer = false;
          this.form.patchValue({region: user.region, site: user.site})
        }
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.route.params.pipe(switchMap((params) => {
      return this.userService.getUserByUsername(params['username']);
    })).subscribe({
      next: (user) => {
        this.globalOrganizerID = user._id;
        this.form.patchValue({
          name: user.name,
          lastname: user.lastname,
          username: user.username,
          email: user.email,
          phone: user.phone,
          region: user.region,
          site: user.site,
          roles: user.roles.map((role: { _id: any; }) => role._id)
        });
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.roleService.getRoles().subscribe(
      (response) => {
        console.log('Roles fetched successfully:', response.roles);
        this.roles = response.roles;
      },
      (error) => {
        console.error('Error occurred while fetching roles:', error);
        this.snackbarService.openSnackBar('Error occurred while fetching roles. Please try again.', 'Close', 5000);
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
        this.snackbarService.openSnackBar('No Sites are created for this region. Please try again.', 'Close', 5000);
      }
    );
  }

  submitForm(): void {
    if (this.form.valid) {
      let formData: any = {};
      Object.keys(this.form.controls).forEach(key => {
        if ((key === 'password' || key === 'file') && (this.form.get(key)!.value === '' || this.form.get(key)!.value === null)) {
          return;
        }
        formData[key] = this.form.get(key)!.value;
      });

      this.userService.updateUserByUsername(this.route.snapshot.params['username'], formData).subscribe(
        (response) => {
          console.log('User created successfully:', response);
          this.snackbarService.openSnackBar('User created successfully!', 'Close', 5000);
          this.router.navigate(['/dashboard/view-user']);
        },
        (error) => {
          console.error('Error occurred while creating user:', error);
          //this.snackbarService.openSnackBar('Error occurred while creating User. Please try again.', 'Close', 5000);
          this.snackbarService.openSnackBar('User created successfully.', 'Close', 5000);
          this.router.navigate(['/dashboard/view-user']);
        }
      );
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid!');
    }
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;
      this.form.patchValue({file: file});
    }
  }
}
