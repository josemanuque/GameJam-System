import { Component, Inject } from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../../shared/sidenav/sidenav.component";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { JamListResponseI, JamResponseI, JamRequestI, JamMessageResponseI } from '../../../../../interfaces/jam.interface';
import { JamService } from '../../../../services/jam.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-jam',
  standalone: true,
  imports: [MatSidenavModule, MatFormFieldModule, SidenavComponent, MatCardModule],
  templateUrl: './view-jam.component.html',
  styleUrl: './view-jam.component.scss'
})
export class ViewJamComponent {
  constructor(private jamService: JamService, private router: Router) {}
  jamData: JamResponseI[] = [];

  ngOnInit(): void {
    this.jamService.getJams().subscribe(
      (response: JamListResponseI) => {
        this.jamData = response.jams;
        console.log('Jams fetched successfully:', this.jamData)
      },
      (error) => {
        console.error('Error occurred while fetching jams:', error);
        alert('Error occurred while fetching jams. Please try again.');
      }
    );
  }

  goToCreateJam(): void {
    this.router.navigate(['dashboard/jam/create']);
  }

}
