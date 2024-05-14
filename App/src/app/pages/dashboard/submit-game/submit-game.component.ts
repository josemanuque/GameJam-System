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
import { FileService } from '../../../services/file.service';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-submit-game',
  standalone: true,
  imports: [MatProgressBarModule,MatCardModule,MatIconModule,MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,MatInputModule,FormsModule,ReactiveFormsModule, MatButtonModule],
  templateUrl: './submit-game.component.html',
  styleUrl: './submit-game.component.css'
})
export class SubmitGameComponent {
  form!: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categories: any;
  notInTeam = true;
  teamData: any;
  fileName = '';
  gameData: any;

  constructor(
    private fb: FormBuilder,
    private catService: CategoryService, 
    private teamService: TeamService, 
    private gameService: GameService,
    private userService: UserService,
    private fileService: FileService,
  ) { }

  ngOnInit(): void {
    
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      youtubeLinkGameplay: ['', Validators.required],
      buildLink: ['', Validators.required],
      youtubeLinkPitch: ['', Validators.required],
      categories: [[], Validators.required],
      file: [null, Validators.required],
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
          console.log('Team:', this.teamData);
          this.gameService.getGame(this.teamData?._id!).subscribe(
            (response) => {
              this.gameData = response;
              console.log('Game:', this.gameData);
            },
            (error) => {
              console.error('Error occurred while fetching game:', error);
            }
          );
        }
      },
      error: err => {
        console.error('Error occurred while getting user or team:', err);
      }
    });
    
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;
      this.form.patchValue({file: file});
    }
  }

  submitForm(): void {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('teamID', this.teamData?._id!);
      Object.keys(this.form.controls).forEach(key => {
        formData.append(key, this.form.get(key)!.value);
      });
      console.log('Form data:', formData.get('teamID'))


      this.gameService.submitGame(formData).subscribe(
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

  redirect(){
    window.open(this.gameData.youtubeLinkGameplay, '_blank'); // Replace with your specific YouTube URL
  }

  

}
