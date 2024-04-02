import { Component } from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../../shared/sidenav/sidenav.component";
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';



@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MatIconModule,MatButtonModule,MatSidenavModule, MatFormFieldModule, SidenavComponent, MatCardModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

}
