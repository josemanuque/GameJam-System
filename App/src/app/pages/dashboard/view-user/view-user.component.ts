import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserResponseI } from '../../../../interfaces/user.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SidenavComponent } from '../../../shared/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UserService } from '../../../services/user.service';
import { switchMap } from 'rxjs';
import { RoleResponseI } from '../../../../interfaces/role.interface';
import { UpdateRolePopupComponent } from './update-role-popup/update-role-popup.component';
import { RouterLink } from '@angular/router';

interface User {
  _id: string,
  name: string,
  lastname: string,
  username: string,
  email: string,
  phone: string,
  site: string,
  roles: string[],
  region: string,
}



@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
    MatSidenavModule, 
    SidenavComponent, 
    MatDialogModule,
    RouterLink
  ],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.scss'
})
export class ViewUserComponent {
  displayedColumns: string[] = ['username', 'name', 'lastname', 'email', 'region', 'roles', 'action'];
  dataSource!: MatTableDataSource<User>;
  validRoles: RoleResponseI[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService, private dialog: MatDialog) { }
  
  ngOnInit() {
    this.userService.getAllValidRoles().pipe(switchMap(
      data => {
        this.validRoles = data.roles;
        this.validRoles.map((role: RoleResponseI) => role.name);
        return this.userService.getAllUsers();
      })).subscribe(this.handleUsers.bind(this));
  }

  private handleUsers(users: User[]) {
      users.forEach(user => {
        user.roles = user.roles.map(role => this.validRoles.find(r => r._id === role)!.name);
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
    })
  }

  onUserUpdate(username: string) {
    const popup = this.dialog.open(UpdateRolePopupComponent, {
      width: '25%',
      data: {
        username
      }
    })

    popup.afterClosed().pipe(switchMap(() => this.userService.getAllUsers())).subscribe(this.handleUsers.bind(this));

  }

  openUserDetail(username: string) {

  }
}
