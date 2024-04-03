import { Component, ElementRef, ViewChild } from '@angular/core';
import { Dictionary } from './dictionary-structure';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Router, RouterModule  } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserResponseI } from '../../../interfaces/user.interface';

export interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatSidenav, MatDividerModule, MatIconModule, MatToolbarModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  userDict = new Dictionary<[string, string], string>([
    //icon // ruta //boton
    [['settings', '/dashboard'], 'Settings'],
    [['games', '/dashboard/submit-game'], 'Game'],
    [['info', '/dashboard/notifications'], 'Notifications'],
    [['person', '/dashboard/register-user'], 'Register'],
    [['location_on', '/dashboard/sites'], 'Sites'],
    [['people', '/dashboard/team'], 'Team'],
  ]);
  

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(
    private userService: UserService, 
    private observer: BreakpointObserver, 
    private readonly elementRef: ElementRef, 
    private router: Router
    ) { }

  currentName = "";
  currentAt = "";
  currentPhoto = "";

  entries:any;

  toggleMenu = false;

  user: UserResponseI | null = null;

  ngOnInit(): void {
    this.user = this.userService.getUser()!
    const margin = 32;
    this.entries = this.getEntries();
    if (this.user.roles.includes("Jammer")){
      this.currentName = this.user.name;
      this.currentAt = this.user.roles.join(' - ');
    }
  }

  openSN(){
    this.sidenav.open();
  }
  closeSN(){
    this.sidenav.close();
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 1350px)']).subscribe((res) =>{
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
        this.toggleMenu = true;
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
        this.toggleMenu = false;
      }

    });
    const nameEls = document.querySelectorAll('h1');
    nameEls.forEach((nameEls) => {
      (nameEls as HTMLElement).style.textTransform = "capitalize";
    });
  }

  getEntries() {
    const entries = [];
    if (this.user!.roles.includes("Jammer")){
      //this.currentFile = this.sanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64, ${localStorage.getItem("currentPhoto")}`);
      for (const [key, value] of this.userDict.toMap()) {
        entries.push({
          key: value,
          value1: key[0],
          value2: key[1],
          value,
        });
      }
    }

    return entries;
  }

  logOut(){
    this.router.navigate(['/login']);
    localStorage.setItem("logged","false");
  }

}
