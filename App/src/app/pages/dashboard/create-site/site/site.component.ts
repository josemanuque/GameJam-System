import { Component } from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../../shared/sidenav/sidenav.component";

import { SitesService } from '../../../../services/sites.service';
import { Router } from '@angular/router';
import { SiteResponseI, SiteCreateRequestI, SiteListResponseI, SiteMessageResponseI } from '../../../../../interfaces/site.interface';

@Component({
  selector: 'app-site',
  standalone: true,
  imports: [MatSidenavModule, MatFormFieldModule, SidenavComponent, MatCardModule],
  templateUrl: './site.component.html',
  styleUrl: './site.component.scss'
})
export class SiteComponent {
  // constructor(private siteService: SitesService, private router: Router) {}
  // siteData: SiteResponseI[] = [];

  // ngOnInit(): void {
  //   this.siteService.getSites().subscribe(
  //     (response: SiteListResponseI) => {
  //       this.siteData = response.sites;
  //       console.log('Sites fetched successfully:', this.siteData)
  //     },
  //     (error) => {
  //       console.error('Error occurred while fetching sites:', error);
  //       alert('Error occurred while fetching sites. Please try again.');
  //     }
  //   );
  // }

  siteData :any;

  constructor(private siteService: SitesService, private router: Router) {}

  ngOnInit(): void {
    // Fetch sites from the service
    this.siteService.getSites().subscribe(
      (response: any) => {
        this.siteData = response.sites;
        console.log('Sites fetched successfully:', this.siteData);
        console.log('Sites fetched successfully:', this.siteData[0].photo.data);
      },
      (error) => {
        // Handle error if fetching sites fails
        console.error('Error occurred while fetching sites:', error);
        alert('Error occurred while fetching sites. Please try again.');
      }
    );
  }

  // Function to convert local image path to URL
  getImageUrl(localPath: string): string {
    // Use the File URL scheme to create a URL for the local image
    // Replace 'file:///C:/Code/ULTRAGAMEJAM/GameJam-System/App/backend/app/utils/uploads/' with the path to your images
    return `file:///${localPath}`;
  }
  

  // Function to navigate to create sites page
  goToCreateSites(): void {
    this.router.navigate(['dashboard/sites/create']);
  }

  goToUpdateSites(id: any): void {
    this.router.navigate(['dashboard/sites/edit']);
    localStorage.setItem('siteId', id);
  }
}
