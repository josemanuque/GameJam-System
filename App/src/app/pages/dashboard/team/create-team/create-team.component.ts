import { Component } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../../shared/sidenav/sidenav.component";
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';

import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';
import { TeamService } from '../../../../services/team.service';
import { UserService } from '../../../../services/user.service';
import { UserFindResponseI } from '../../../../../interfaces/user.interface';
import { TeamCreateRequestI } from '../../../../../interfaces/team.interface';


interface Data {
  username: string;
  email: string;
}

@Component({
  selector: 'app-create-team',
  standalone: true,
  imports: [MatCardModule,MatCheckboxModule,MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,
    MatInputModule,MatButtonModule,FormsModule,ReactiveFormsModule,MatDatepickerModule],
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.scss'
})
export class CreateTeamComponent {
  form!: FormGroup;
  searchControl = new FormControl();
  constructor(private fb: FormBuilder, private teamService: TeamService, private router:Router,
    private userService: UserService) { }

  user = localStorage.getItem('USER');

  usernames: UserFindResponseI[] = [];
  selectedMembers: any[] = [JSON.parse(this.user!)]; // Hold selected members

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      members: [[JSON.parse(this.user!).username],],
    });
    this.searchControl.valueChanges.subscribe((searchTerm: string) => {
      this.findUser(searchTerm);
    });
  }

  selectMember(username: UserFindResponseI): void {
    if(!this.selectedMembers.includes(username)){
      this.selectedMembers.push(username);
      this.form.get('members')!.setValue(this.selectedMembers.map(member => member.username));
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

  submitForm(): void {
    if (this.form.valid) {
      const teamData: TeamCreateRequestI = this.form.value;
      console.log('Team data:', teamData);
      this.teamService.createTeam(teamData).subscribe( 
        (response) => {
          console.log('Team created successfully:', response);
          // Optionally, you can reset the form after successful submission
          this.form.reset();
          alert('Team created successfully!');
          window.location.reload();
        },
        (error) => {
          console.error('Error occurred while creating team:', error);
          alert('Error occurred while creating team. Please try again.');
        }
      );
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid!');
    }
  }

  goToViewTeam(): void {
    this.router.navigate(['dashboard/team']);
  }
}
