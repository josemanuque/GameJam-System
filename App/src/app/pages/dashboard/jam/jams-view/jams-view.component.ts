import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { SidenavComponent } from '../../../../shared/sidenav/sidenav.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { JamService } from '../../../../services/jam.service';
import { JamResponseI } from '../../../../../interfaces/jam.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jams-view',
  standalone: true,
  imports: [
    MatTableModule, 
    MatSidenavModule, 
    SidenavComponent, 
    MatDialogModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './jams-view.component.html',
  styleUrl: './jams-view.component.scss'
})
export class JamsViewComponent {
  displayedColumns: string[] = ['title', 'startingDate', 'endingDate', 'delete'];
  dataSource: JamResponseI[] = [];

  constructor(
    private router: Router,
    private jamService: JamService,
    private snackbarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.jamService.getJams().subscribe({
      next: (response) => {
        this.dataSource = response.jams;
      },
      error: (error) => {
        console.error('Error occurred while fetching jams:', error);
      }
    });
  }

  onAddJam(){
    this.router.navigate(['dashboard/jam/create']);
  }

  onEditJam(jam: any){
    this.router.navigate(['dashboard/jam/edit', jam._id]);
  }

  onDelete(jam: any){
    this.jamService.removeJam(jam._id).subscribe({
      next: (response) => {
        this.snackbarService.openSnackBar(response.message, 'Close', 5000);
        this.dataSource = this.dataSource.filter((element) => element._id !== jam._id);
      },
      error: (error) => {
        console.error('Error occurred while deleting jam:', error);
        this.snackbarService.openSnackBar('Error occurred while deleting jam', 'Close', 5000);
      }
    });
  }
}
