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
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
    MatSidenavModule, 
    SidenavComponent, 
    MatDialogModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.scss'
})
export class ViewUserComponent {
  displayedColumns: string[] = ['username', 'name', 'lastname', 'email', 'region', 'roles', 'delete'];
  dataSource!: MatTableDataSource<UserResponseI>;
  validRoles: RoleResponseI[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService, 
    private dialog: MatDialog,
    private route: Router
  ) { }
  
  ngOnInit() {
    this.userService.getAllValidRoles().pipe(switchMap(
      data => {
        this.validRoles = data.roles;
        this.validRoles.map((role: RoleResponseI) => role.name);
        return this.userService.getAllUsers();
      })).subscribe(this.handleUsers.bind(this));
  }

  private handleUsers(users: UserResponseI[]) {
    this.dataSource = new MatTableDataSource(users);
    this.dataSource.paginator = this.paginator;
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

  loadRoles(user: UserResponseI): string {
    return user.roles.map(role => role.name).join(', ');
  }

  onEditUser(user: UserResponseI) {
    this.route.navigate([`dashboard/update-user/${user.username}`]);
  }

  onDelete(user: UserResponseI) {
    this.userService.deleteUser(user.username).pipe(switchMap(() => this.userService.getAllUsers())).subscribe(this.handleUsers.bind(this));
  }
}
