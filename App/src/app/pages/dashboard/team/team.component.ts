import { Component, Inject } from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../shared/sidenav/sidenav.component";
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TeamService } from '../../../services/team.service';
import { TeamResponseI } from '../../../../interfaces/team.interface';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [MatSidenavModule, MatFormFieldModule, SidenavComponent, MatCardModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {
  notInTeam = true;
  teamData: TeamResponseI | undefined;
  constructor(public dialog: MatDialog, private router: Router, private teamService:TeamService) {}

  ngOnInit(): void {
    this.teamService.getUserTeam(localStorage.getItem('email')!).subscribe((team) => {
      if (team) {
        this.notInTeam = false;
        this.teamData = team;
        console.log(this.teamData);
      }
    });
  }

  goToCreateTeam() {
    this.router.navigate(['/dashboard/team/create']);
  }
}