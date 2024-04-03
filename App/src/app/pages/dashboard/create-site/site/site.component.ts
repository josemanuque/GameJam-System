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
  constructor(private siteService: SitesService, private router: Router) {}
  siteData: SiteResponseI[] = [];

  ngOnInit(): void {
    this.siteService.getSites().subscribe(
      (response: SiteListResponseI) => {
        this.siteData = response.sites;
        console.log('Sites fetched successfully:', this.siteData)
      },
      (error) => {
        console.error('Error occurred while fetching sites:', error);
        alert('Error occurred while fetching sites. Please try again.');
      }
    );
  }

  goToCreateSites(): void {
    this.router.navigate(['dashboard/sites/create']);
  }
}
