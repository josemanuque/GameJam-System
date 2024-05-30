import { Component, Inject } from '@angular/core';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { StageService } from '../../../../services/stage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {provideNativeDateAdapter} from '@angular/material/core';
import { JamService } from '../../../../services/jam.service';
import { switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { StageI } from '../../../../../interfaces/stage.interface';

@Component({
  selector: 'app-create-stage',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatCardModule,
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
  ],
  templateUrl: './create-stage.component.html',
  styleUrl: './create-stage.component.scss'
})
export class CreateStageComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private stageService: StageService,
    private jamService: JamService,
    private snackbarService: SnackBarService,
    private router: ActivatedRoute,
    public dialogRef: MatDialogRef<CreateStageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { jam_id: string, stage: StageI}
  ) { }

  ngOnInit(): void {
    if (this.data.stage) {
      this.form = this.fb.group({
        name: [this.data.stage.name, Validators.required],
        priority: [this.data.stage.priority, Validators.required],
        startingDate: [this.data.stage.startingDate, Validators.required],
        endingDate: [this.data.stage.endingDate, Validators.required],
        buildDeliveryDate: [this.data.stage.buildDeliveryDate],
        pitchPreviewDeliveryDate: [this.data.stage.pitchPreviewDeliveryDate],
        pitchDeliveryDate: [this.data.stage.pitchDeliveryDate],
        pitchTestDate: [this.data.stage.pitchTestDate],
        demoDayDate: [this.data.stage.demoDayDate],
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        priority: ['', Validators.required],
        startingDate: ['', Validators.required],
        endingDate: ['', Validators.required],
        buildDeliveryDate: [''],
        pitchPreviewDeliveryDate: [''],
        pitchDeliveryDate: [''],
        pitchTestDate: [''],
        demoDayDate: [''],
      });
    }
  }
 
  onSubmit() {
    if (this.form.valid) {
      const data = this.form.value;
      this.stageService.createStage(data).pipe(switchMap((response) => {
        console.log('Stage created successfully:', response);
        return this.jamService.addStageToJam(this.data.jam_id, response._id);
      })).subscribe({
          next: (response) => {
            this.snackbarService.openSnackBar('Stage created successfully!', 'Close', 5000);
            window.location.reload();
          },
          error: (error) => {
            console.error('Error occurred while creating jam:', error);
            this.snackbarService.openSnackBar('Error occurred while creating jam. Please try again.', 'Close', 5000);
          }
        });
      }
        
  }

  onUpdate() {
    if (this.form.valid) {
      const data = this.form.value;
      this.stageService.updateStage(this.data.stage._id, data).subscribe({
          next: (response) => {
            this.snackbarService.openSnackBar('Stage created successfully!', 'Close', 5000);
            window.location.reload();
          },
          error: (error) => {
            console.error('Error occurred while creating jam:', error);
            this.snackbarService.openSnackBar('Error occurred while creating jam. Please try again.', 'Close', 5000);
          }
        });
      }
        
  }

}
