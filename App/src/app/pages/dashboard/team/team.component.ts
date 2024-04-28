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


import { provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { TeamService } from '../../../services/team.service';
import { TeamResponseI } from '../../../../interfaces/team.interface';
import { UserFindResponseI, UserResponseI } from '../../../../interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule,FormsModule,MatSelectModule,MatSidenavModule, MatFormFieldModule, SidenavComponent, MatCardModule],
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
  selectedMembers: any[] = [];
  constructor(private userService: UserService,private fb: FormBuilder, private router: Router, private teamService:TeamService) {}

  ngOnInit(): void {
    this.userService.getUser().pipe(
      switchMap(user => {
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
    this.searchControl.valueChanges.subscribe((searchTerm: string) => {
      this.findUser(searchTerm);
    });
  }

  leaveTeam() {
    this.teamService.kickMember(this.teamData?._id!,this.user!.username).subscribe((team) => {
      this.notInTeam = true;
      alert('You have left the team');
      window.location.reload();
    });
  }
  kickUser(username: string) {
    this.teamService.kickMember(this.teamData?._id!,username).subscribe((team) => {
      alert('You kicked the user from the team');
      window.location.reload();
    });
  }
  addMember(username: string) {
    console.log("data",this.teamData?._id!,username);
    this.teamService.addMember(this.teamData?._id!,username).subscribe((team) => {
      alert('You added the user to the team');
      window.location.reload();
    });
  }

  selectMember(username: any): void {
    if(!this.selectedMembers.includes(username)){
      this.selectedMembers.push(username);
      //this.form.get('members')!.setValue(this.selectedMembers.map(member => member.username));
    }
  }


  findUser(username: string){
    
    //const selectedMembers = this.form.get('members')!.value;
    this.userService.getUsersFromPrefix(username).subscribe(
      (response) => {
        this.usernames = response;
        console.log('User found:', response);
        // Restore selected members after updating usernames
        //this.form.get('members')!.setValue(selectedMembers);
      },
      (error) => {
        console.error('Error occurred while finding user:', error);
      }
    );
  }

  goToCreateTeam() {
    this.router.navigate(['/dashboard/team/create']);
  }
  changeSearchFlag(){
    this.searchUser = !this.searchUser;
    console.log(this.selectedMembers);
  }

}