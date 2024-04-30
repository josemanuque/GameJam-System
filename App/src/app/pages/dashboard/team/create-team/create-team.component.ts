import { MatSidenavModule } from '@angular/material/sidenav';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { UserService } from '../../../../services/user.service';
import { UserFindResponseI } from '../../../../../interfaces/user.interface';
import { SidenavComponent } from "../../../../shared/sidenav/sidenav.component";
import { SnackBarService } from '../../../../services/snack-bar.service';
import { TeamService } from '../../../../services/team.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../services/notification.service';

/**
 * @title Filter autocomplete
 */
@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSidenavModule,
    AsyncPipe,
    SidenavComponent,
    MatCardModule,
    MatButtonModule,
  ],
})
export class CreateTeamComponent implements OnInit {
  form!: FormGroup;
  username: string = "";
  userSearchControl = new FormControl('');
  filteredOptions!: Observable<UserFindResponseI[]>;
  selectedMembers: UserFindResponseI[] = [];

  constructor(
    private userService: UserService,
    private teamService: TeamService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.userService.getUser().subscribe(user => {
      this.username = user.username
      this.selectedMembers.push(user);
      this.initForm();
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

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      members: [[this.username],],
    });
  }

  addUserToTeam(user: UserFindResponseI) {
    this.selectedMembers.push(user);
    this.userSearchControl.setValue('');
  }

  onSubmit() {
    if (this.form.valid) {
      this.teamService.createTeam(this.form.value).subscribe({
        next: (team) => {
          for(let member of this.selectedMembers) {
              if (member.username !== this.username){
              this.notificationService.sendNotification({
                username: member.username,
                team: team._id,
                message: `${this.username} has invited you to join their team ${team.name}`,
                type: 'joinTeam'
              }).subscribe();
            }
          }
          this.snackbarService.openSnackBar('Team created successfully', 'Close', 5000);
          this.router.navigate(['/dashboard/team']);
        },
        error: () => {
          this.snackbarService.openSnackBar('Error creating team', 'Close', 5000);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/team']);
  }

}