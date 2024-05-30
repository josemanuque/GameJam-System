import { Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
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
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../services/snack-bar.service';


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
  dataSource!: any;
  validRoles: RoleResponseI[] = [];
  @ViewChild(MatTable) table!: MatTable<UserResponseI[]>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService, 
    private dialog: MatDialog,
    private route: Router,
    private snackBarService: SnackBarService
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.username}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User clicked 'OK', delete the user
        this.snackBarService.openSnackBar('User deleted successfully', 'OK', 5000);
        this.userService.deleteUser(user.username).pipe(switchMap(() => this.userService.getAllUsers())).subscribe({
          next: (response) => {
            this.handleUsers(response); // Call handleUsers as a function
            this.dataSource.data = this.dataSource.data.filter((item: any) => item._id !== user._id);
            this.table.renderRows();
            this.snackBarService.openSnackBar('User deleted successfully', 'OK', 5000);
          },
          error: (err) => {
            console.error('Error occurred while deleting user:', err);
            this.snackBarService.openSnackBar('Error occurred while deleting user. Please try again.', 'OK', 5000);
          }
        });

      }
    });
    //this.userService.deleteUser(user.username).pipe(switchMap(() => this.userService.getAllUsers())).subscribe(this.handleUsers.bind(this));
  }
}
