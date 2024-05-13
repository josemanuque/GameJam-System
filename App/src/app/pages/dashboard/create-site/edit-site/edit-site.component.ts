import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from '../../../../shared/sidenav/sidenav.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { UserResponseI } from '../../../../../interfaces/user.interface';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { Router } from '@angular/router';
import { SitesService } from '../../../../services/sites.service';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-edit-site',
  standalone: true,
  imports: [
    MatIconModule,
    MatSidenavModule, 
    SidenavComponent,
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './edit-site.component.html',
  styleUrl: './edit-site.component.scss'
})
export class EditSiteComponent {
  userForm!: FormGroup;
  user!: UserResponseI;
  submissionError: any;
  siteData: any;
  form!: FormGroup;
  fileName = '';

  constructor(
    private userService: UserService, 
    private siteService: SitesService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackBarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.userService.userData$.subscribe({
      next: (res) => {
        if(!res) return;
        this.user = res;
        this.initForm();
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.siteService.getSite(localStorage.getItem("siteId")!).subscribe(
      (response: any) => {
        this.siteData = response;
        console.log('Sites fetched successfully:', this.siteData);
      },
      (error) => {
        console.error('Error occurred while fetching sites:', error);
        alert('Error occurred while fetching sites. Please try again.');
      }
    );
  }
  
  initForm(): void {
    this.userForm = this.formBuilder.group({
      name: [''],
      country: [''],
      region: [''],
      city: [''],
      file: [null]
    });
  }

  onUpdate(): void {

    if(this.userForm.valid) {
      const formData = new FormData();
      Object.keys(this.userForm.controls).forEach(key => {
        if(key === 'file' && this.userForm.get(key)!.value !== null) {
          formData.append('file', this.userForm.get(key)!.value, this.fileName);
        }
        if(key === 'name' && this.userForm.get(key)!.value !== ''){
          formData.append(key, this.userForm.get(key)!.value);
        }
        if(key === 'country' && this.userForm.get(key)!.value !== ''){
          formData.append(key, this.userForm.get(key)!.value);
        }
        if(key === 'region' && this.userForm.get(key)!.value !== ''){
          formData.append(key, this.userForm.get(key)!.value);
        }
        if(key === 'city' && this.userForm.get(key)!.value !== ''){
          formData.append(key, this.userForm.get(key)!.value);
        }
        //formData.append(key, this.userForm.get(key)!.value);
      });
      console.log('Form data:', formData);
      this.siteService.updateSite(localStorage.getItem("siteId")!, formData).subscribe(
        (response) => {
          console.log('Site updated successfully:', response);
          alert('Site updated successfully!');
          this.router.navigate(['/dashboard/sites']);
        },
        (error) => {
          console.error('Error occurred while updating site:', error);
          alert('Error occurred while updating site. Please try again.');
        }
      );
    }
  }

  goToSite(): void {
    this.router.navigate(['/dashboard/sites']);
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;
      this.userForm.patchValue({file: file});
    }
  }

}
