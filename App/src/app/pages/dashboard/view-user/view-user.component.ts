import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserResponseI } from '../../../../interfaces/user.interface';
import { SidenavComponent } from '../../../shared/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


const ELEMENT_DATA: any = [
  { _id: 1, name: 'John', lastname: 'Doe', username: 'johndoe' },
  { _id: 2, name: 'Jane', lastname: 'Doe', username: 'janedoe' },
  { _id: 3, name: 'John', lastname: 'Smith', username: 'johnsmith' },
  { _id: 4, name: 'Jane', lastname: 'Smith', username: 'janesmith' },
  { _id: 5, name: 'John', lastname: 'Brown', username: 'johnbrown' },
  { _id: 6, name: 'Jane', lastname: 'Brown', username: 'janebrown' },
  { _id: 7, name: 'John', lastname: 'White', username: 'johnwhite' },
  { _id: 8, name: 'Jane', lastname: 'White', username: 'janewhite' },
  { _id: 9, name: 'John', lastname: 'Black', username: 'johnblack' },
  { _id: 10, name: 'Jane', lastname: 'Black', username: 'janeblack' },
];

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSidenavModule, SidenavComponent],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.scss'
})
export class ViewUserComponent {
  displayedColumns: string[] = ['id', 'name', 'lastname', 'username'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
