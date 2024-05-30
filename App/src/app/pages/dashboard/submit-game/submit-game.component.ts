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
import { StageService } from '../../../services/stage.service';

@Component({
  selector: 'app-submit-game',
  standalone: true,
  imports: [MatProgressBarModule,MatCardModule,MatIconModule,MatSidenavModule, MatFormFieldModule, SidenavComponent,MatSelectModule,MatInputModule,FormsModule,ReactiveFormsModule, MatButtonModule],
  templateUrl: './submit-game.component.html',
  styleUrl: './submit-game.component.css'
})
export class SubmitGameComponent {
  form!: FormGroup;
  form2!: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categories: any;
  notInTeam = true;
  teamData: any;
  fileName = '';
  gameData: any;
  private intervalId: any;
  timeRemaining: any;
  timeIsUp: boolean = false; // Add this flag
  updateModeFlag = false;

  constructor(
    private fb: FormBuilder,
    private catService: CategoryService, 
    private teamService: TeamService, 
    private gameService: GameService,
    private userService: UserService,
    private stageService: StageService,
    private fileService: FileService,
  ) { }

  updateMode(){
    this.updateModeFlag =! this.updateModeFlag;
  }

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
    // this.userService.userData$.pipe(
    //   switchMap(user => {
    //     if(!user) return of(null);
    //     return this.teamService.getUserTeam(user.username);
    //   })
    // ).subscribe({
    //   next: team => {
    //     if (team) {
    //       this.notInTeam = false;
    //       this.teamData = team;
    //       console.log('Team:', this.teamData);
    //       this.gameService.getGame(this.teamData?._id!).subscribe(
    //         (response) => {
    //           this.gameData = response;
    //           console.log('Game:', this.gameData);
    //           this.form2 = this.fb.group({
    //             title: [this.gameData.title, Validators.required],
    //             description: [this.gameData.description, Validators.required],
    //             youtubeLinkGameplay: [this.gameData.youtubeLinkGameplay, Validators.required],
    //             buildLink: [this.gameData.buildLink, Validators.required],
    //             youtubeLinkPitch: [this.gameData.youtubeLinkPitch, Validators.required],
    //             categories: [this.gameData.categories, Validators.required],
    //             file: [this.gameData.photo.data, Validators.required],
    //           });
    //         },
    //         (error) => {
    //           console.error('Error occurred while fetching game:', error);
    //         }
    //       );
    //     }
    //   },
    //   error: err => {
    //     console.error('Error occurred while getting user or team:', err);
    //   }
    // });
    this.getGameData();
    this.stageService.getTimeRemaining().subscribe(
      (response) => {
        console.log('Time remaining:', response);
        this.timeRemaining = response;
      },
      (error) => {
        console.error('Error occurred while fetching time remaining:', error);
      }
    );
    this.intervalId = setInterval(() => {
      this.updateTimeRemaining();
    }, 1000);
    
  }
  getGameData(){
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
              this.form2 = this.fb.group({
                title: [this.gameData.title, Validators.required],
                description: [this.gameData.description, Validators.required],
                youtubeLinkGameplay: [this.gameData.youtubeLinkGameplay, Validators.required],
                buildLink: [this.gameData.buildLink, Validators.required],
                youtubeLinkPitch: [this.gameData.youtubeLinkPitch, Validators.required],
                categories: [this.gameData.categories, Validators.required],
                file: [this.gameData.photo.data, Validators.required],
              });
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
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  updateTimeRemaining() {
    if (this.timeRemaining.seconds > 0) {
      this.timeRemaining.seconds--;
    } else {
      this.timeRemaining.seconds = 59;
      if (this.timeRemaining.minutes > 0) {
        this.timeRemaining.minutes--;
      } else {
        this.timeRemaining.minutes = 59;
        if (this.timeRemaining.hours > 0) {
          this.timeRemaining.hours--;
        } else {
          this.timeRemaining.hours = 23;
          if (this.timeRemaining.days > 0) {
            this.timeRemaining.days--;
          } else {
            this.timeIsUp = true;
          }
        }
      }
    }
  }
  getFormattedTime(): string {
    const { days, hours, minutes, seconds } = this.timeRemaining;
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;
      this.form.patchValue({file: file});
    }
  }

  submitForm(): void {

    if (!this.timeIsUp) {
      if(!this.updateModeFlag){
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
      if(this.updateModeFlag){
        if (this.form2.valid) {
          const formData = new FormData();
          formData.append('teamID', this.teamData?._id!);
          Object.keys(this.form2.controls).forEach(key => {
            formData.append(key, this.form2.get(key)!.value);
          });
          console.log('Form data:', formData)
          this.gameService.updateGame(this.gameData._id,formData).subscribe(
            (response) => {
              console.log('Game updated successfully:', response);
              alert('Game Updated successfully!');
              this.getGameData();
              window.location.reload();
            },
            (error) => {
              console.error('Error occurred while updating game:', error);
            }
          );
    
        } else {
          // Form is invalid, display error messages
          console.log('Form is invalid!');
        }
      }

    } else {
      alert('Time is up! You cannot submit the game anymore.');
    }
    
  }

  redirectYT(){
    window.open(this.gameData.youtubeLinkGameplay, '_blank'); // Replace with your specific YouTube URL
  }
  redirectBuild(){
    window.open(this.gameData.buildLink, '_blank');
    
  }

  

}
