import { Component } from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../shared/sidenav/sidenav.component";
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { NotificationService } from '../../../services/notification.service';
import { UserService } from '../../../services/user.service';
import { switchMap } from 'rxjs';
import { NotificationIResponse } from '../../../../interfaces/notification.interface';
import { TeamService } from '../../../services/team.service';
import { SnackBarService } from '../../../services/snack-bar.service';



@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MatIconModule,MatButtonModule,MatSidenavModule, MatFormFieldModule, SidenavComponent, MatCardModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  notifications: NotificationIResponse[] = [];
  username: string = '';
  
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private teamService: TeamService,
    private snackbarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.userService.getUser().pipe(switchMap((user) => {
      this.username = user.username;
      return this.notificationService.getNotifications(this.username);
    })).subscribe((notifications) => {
        //console.log(notifications);
        this.notifications = notifications;
    });
  }

  onAcceptJoinTeam(notification: NotificationIResponse){
    this.teamService.addMember(notification.team._id, notification.username).subscribe({
      next: () => {
        this.snackbarService.openSnackBar('Team invite accepted', 'Close', 5000);
        this.notifications = this.notifications.filter((n) => n._id !== notification._id);
        this.notificationService.deleteNotification(notification._id).subscribe();
      },
      error: () => {
        this.snackbarService.openSnackBar('Error accepting team invite', 'Close', 5000);
      }
    });
  }

  onDeclineJoinTeam(notification: NotificationIResponse){
    this.notificationService.deleteNotification(notification._id).subscribe({
      next: () => {
        this.snackbarService.openSnackBar('Team invite declined', 'Close', 5000);
        this.notifications = this.notifications.filter((n) => n._id !== notification._id);
      },
      error: () => {
        this.snackbarService.openSnackBar('Error declining team invite', 'Close', 5000);
      }
    });
  }
}
