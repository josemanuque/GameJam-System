import { Component } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavComponent } from "../../shared/sidenav/sidenav.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    imports: [MatSidenavModule, MatFormFieldModule, SidenavComponent]
})
export class DashboardComponent {

  email = "";

  ngOnInit(): void {
    this.email = localStorage.getItem("email")!;
  }

}
