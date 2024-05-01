import { Component } from '@angular/core';

import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../shared/sidenav/sidenav.component";
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormArray } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { CategoryService } from '../../../services/category.service';
import { TeamService } from '../../../services/team.service';
import { TeamResponseI } from '../../../../interfaces/team.interface';
import { GameService } from '../../../services/game.service';
import { GameRequestI } from '../../../../interfaces/game.interface';
import { UserService } from '../../../services/user.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-submit-game',
  standalone: true,
  imports: [MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,MatInputModule,FormsModule,ReactiveFormsModule, MatButtonModule],
  templateUrl: './submit-game.component.html',
  styleUrl: './submit-game.component.css'
})
export class SubmitGameComponent {
  form!: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categories: any;
  notInTeam = true;
  teamData: TeamResponseI | undefined;

  constructor(
    private fb: FormBuilder,
    private catService: CategoryService, 
    private teamService: TeamService, 
    private gameService: GameService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      teamID: [''],
      youtubeLinkGameplay: ['', Validators.required],
      buildLink: ['', Validators.required],
      youtubeLinkPitch: ['', Validators.required],
      categories: [[], Validators.required]
    });
    this.catService.getCategoriesName().subscribe(
      (response) => {
        this.categories = response.categoryNames;
      },
      (error) => {
        console.error('Error occurred while fetching categories:', error);
      }
    );
    this.userService.userData$.pipe(
      switchMap(user => {
        if(!user) return of(null);
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
  }

  submitForm(): void {
    if (this.form.valid) {
      this.form.patchValue({teamID: this.teamData?._id});
      const gameData: GameRequestI = this.form.value;
      console.log('Game data:', gameData);
      this.gameService.submitGame(gameData).subscribe(
        (response) => {
          console.log('Game created successfully:', response);
          this.form.reset();
          alert('Game Submited successfully!');
          window.location.reload();
        },
        (error) => {
          console.error('Error occurred while creating game:', error);
        }
      );
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid!');
    }
  }

}
