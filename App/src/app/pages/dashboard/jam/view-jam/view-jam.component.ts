import { Component, Inject } from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../../shared/sidenav/sidenav.component";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider'; 

import { JamListResponseI, JamResponseI, JamRequestI, JamMessageResponseI } from '../../../../../interfaces/jam.interface';
import { JamService } from '../../../../services/jam.service';
import { Router } from '@angular/router';
import { StageService } from '../../../../services/stage.service';

@Component({
  selector: 'app-view-jam',
  standalone: true,
  imports: [MatSidenavModule, MatFormFieldModule, SidenavComponent, MatCardModule, MatDivider],
  templateUrl: './view-jam.component.html',
  styleUrl: './view-jam.component.scss'
})
export class ViewJamComponent {
  constructor(private jamService: JamService, private router: Router, private stageService: StageService) {}
  jamData: JamResponseI[] = [];
  stages: any;

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
    this.stageService.getStages().subscribe(
      (response) => {
        console.log('Stages:', response);
        this.stages = response;
      },
      (error) => {
        console.error('Error occurred while fetching stages:', error);
      }
    );
  }

  goToCreateJam(): void {
    this.router.navigate(['dashboard/jam/create']);
  }

  deleteJam(): void {
    const jamId = this.jamData[0]._id;
    this.jamService.removeJam(jamId).subscribe(
      (response: JamMessageResponseI) => {
        console.log('Jam deleted successfully:', response);
        alert('Jam deleted successfully.');
        this.jamData = this.jamData.filter((jam) => jam._id !== jamId);
        window.location.reload();
      },
      (error) => {
        console.error('Error occurred while deleting jam:', error);
        alert('Error occurred while deleting jam. Please try again.');
      }
    );
  }

}
