import { Component, Inject } from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../shared/sidenav/sidenav.component";
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl,FormsModule  } from '@angular/forms';


import { Router } from '@angular/router';
import { TeamService } from '../../../services/team.service';
import { TeamResponseI } from '../../../../interfaces/team.interface';
import { UserFindResponseI, UserResponseI } from '../../../../interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import { Observable, of, startWith, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NotificationService } from '../../../services/notification.service';
import { SnackBarService } from '../../../services/snack-bar.service';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatSidenavModule,
    MatFormFieldModule,
    SidenavComponent, 
    MatCardModule,
    AsyncPipe,
    MatAutocompleteModule,
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {
  notInTeam = true;
  searchUser = false;
  kickUserFlag = false;
  searchControl = new FormControl();
  teamData: TeamResponseI | undefined;
  user: UserResponseI | undefined;
  usernames: UserFindResponseI[] = [];

  username: string = "";
  userSearchControl = new FormControl('');
  filteredOptions!: Observable<UserFindResponseI[]>;
  selectedMembers: UserFindResponseI[] = [];
  selectedUsername: string = '';


  constructor(
    private userService: UserService,
    private fb: FormBuilder, 
    private router: Router, 
    private teamService: TeamService,
    private notificationService: NotificationService,
    private snackbarService: SnackBarService,
  ) {}

  ngOnInit(): void {
    this.userService.userData$.pipe(
      switchMap(user => {
        if (!user) return of(null);
        this.user = user;
        return this.teamService.getUserTeam(user.username);
      })
    ).subscribe({
      next: team => {
        if (team) {
          this.notInTeam = false;
          this.teamData = team;
        }
      },
      error: err => {
        console.error('Error occurred while getting user or team:', err);
      }
    });

    this.filteredOptions = this.userSearchControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        if (value!.trim() === '') {
          return of([]);
        } else {
          return this.userService.getUsersFromPrefix(value!);
        }
      }),
    );
  }

  addUserToTeam(user: UserFindResponseI) {
    this.selectedMembers.push(user);
    this.userSearchControl.setValue('');
  }

  leaveTeam() {
    this.teamService.kickMember(this.teamData?._id!,this.user!.username).subscribe((team) => {
      this.notInTeam = true;
      alert('You have left the team');
      window.location.reload();
    });
  }

  kickUser(username: string) {
    console.log(this.selectedMembers)
    this.teamService.kickMember(this.teamData?._id!,username).subscribe((team) => {
      alert('You kicked the user from the team');
      window.location.reload();
    });
  }

  addMember(username: string) {
    console.log("data",this.teamData?._id!,username);
    this.notificationService.sendNotification({
      username: username,
      team: this.teamData?._id!,
      message: "You have been added to a team",
      type: 'joinTeam'
    }).subscribe({
      next: (notification) => {
        this.snackbarService.openSnackBar('User invited to team', 'Close', 5000);
      },
      error: err => {
        this.snackbarService.openSnackBar('Error inviting user to team', 'Close', 5000);
      }
    });
  }

  selectUsername(username: any): void {
    this.selectedUsername = username;
  }


  goToCreateTeam() {
    this.router.navigate(['/dashboard/team/create']);
  }
  changeSearchFlag(){
    this.searchUser = !this.searchUser;
    console.log(this.selectedMembers);
  }

}