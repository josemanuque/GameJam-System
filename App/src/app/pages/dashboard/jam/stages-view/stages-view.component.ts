import { Component, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTable, MatTableModule } from '@angular/material/table';
import { SidenavComponent } from '../../../../shared/sidenav/sidenav.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CreateStageComponent } from '../create-stage/create-stage.component';
import { StageService } from '../../../../services/stage.service';
import { JamService } from '../../../../services/jam.service';
import { switchMap } from 'rxjs';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-stages-view',
  standalone: true,
  imports: [
    MatTableModule, 
    MatSidenavModule, 
    SidenavComponent, 
    MatDialogModule,
    RouterLink,
    DragDropModule,
    MatIconModule
  ],
  templateUrl: './stages-view.component.html',
  styleUrl: './stages-view.component.scss'
})

export class StagesViewComponent {
  displayedColumns: string[] = ['dragHandle','name', 'startingDate', 'endingDate', 'buildDeliveryDate', 'pitchDeliveryDate', 'delete'];
  dataSource: any = ELEMENT_DATA;
  @ViewChild(MatTable) table!: MatTable<PeriodicElement>;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private stageService: StageService,
    private jamService: JamService,
    private snackbarService: SnackBarService
  ){}

  ngOnInit() {
    this.route.params.pipe(switchMap((params) => {
      return this.jamService.getJam(params['id']);
    })).subscribe({
      next: (response) => {
        this.dataSource = response.stages;
      },
      error: (error) => {
        console.error('Error occurred while fetching jam:', error);
      }
    });

    
    }

  drag(event: CdkDragDrop<PeriodicElement[]>) {
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
    this.table.renderRows();

    let stageIds = this.dataSource.map((element:any) => element._id);

    this.jamService.updateStagePriority(this.route.snapshot.params['id'], stageIds).subscribe({
      next: (response) => {
        console.log('Stage priority updated successfully:', response);
      },
      error: (error) => {
        console.error('Error occurred while updating stage priority:', error);
      }
    });
  }

  onAddStage() {
    const popup = this.dialog.open(CreateStageComponent, {
      width: '50%',
      data: { jam_id: this.route.snapshot.params['id'] }
    })

    
    this.table.renderRows();
  }

  onEditStage(stage: any) {
    const popup = this.dialog.open(CreateStageComponent, {
      width: '50%',
      data: { stage }
    })
  }

  onDelete(stage: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Delete Stage',
        message: `Are you sure you want to delete ${stage.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.jamService.removeStageFromJam(this.route.snapshot.params['id'], stage._id).pipe(switchMap((response) => {
          return this.stageService.removeStage(stage._id);
        })).subscribe({
          next: (response) => {
            this.snackbarService.openSnackBar('Stage deleted successfully!', 'Close', 5000);
            this.dataSource = this.dataSource.filter((item: any) => item._id !== stage._id);
            this.table.renderRows();
          },
          error: (error) => {
            console.error('Error occurred while deleting stage:', error);
          }
        });
      }
    });
    
  }
}
