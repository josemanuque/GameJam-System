import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserResponseI } from '../../../../interfaces/user.interface';
import { SidenavComponent } from '../../../shared/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UserService } from '../../../services/user.service';

interface User {
  _id: string,
  name: string,
  lastname: string,
  username: string,
  email: string,
  phone: string,
  site: string,
  region: string,
}



@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSidenavModule, SidenavComponent],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.scss'
})
export class ViewUserComponent {
  displayedColumns: string[] = ['username', 'name', 'lastname', 'email', 'region', 'site'];
  dataSource!: MatTableDataSource<User>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService) { }
  ngOnInit() {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
    });
  }

}
