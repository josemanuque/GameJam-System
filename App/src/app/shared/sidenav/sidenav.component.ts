import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Dictionary } from './dictionary-structure';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Router, RouterModule  } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserResponseI } from '../../../interfaces/user.interface';
import { RoleListResponseI, RoleResponseI } from '../../../interfaces/role.interface';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

export interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatSidenav, 
    MatDividerModule, 
    MatIconModule, 
    MatToolbarModule, 
    RouterModule,
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  adminDict = new Dictionary<[string, string], string>([
    //icon // ruta //boton
    [['settings', '/settings'], 'Settings'],
    [['assignment', '/dashboard/stages'], 'Stages'],
    [['calendar_today', '/dashboard/jam'], 'Jam'],
    [['location_on', '/dashboard/sites'], 'Sites'],
    [['person', '/dashboard/view-user'], 'Users'],
    [['label', '/dashboard/category'], 'Category'],
    //[['people', '/dashboard/team'], 'Team'],
    //[['games', '/dashboard/submit-game'], 'Game'],
    [['info', '/dashboard/notifications'], 'Notifications'],
    [['assignment', '/dashboard/theme'], 'Themes'],
  ]);

  localDict = new Dictionary<[string, string], string>([
    //icon // ruta //boton
    [['settings', '/dashboard'], 'Settings'],
    [['person', '/dashboard/view-user'], 'Register'],
    //[['people', '/dashboard/team'], 'Team'],
  ]);

  jammerDict = new Dictionary<[string, string], string>([
    //icon // ruta //boton
    [['settings', '/settings'], 'Settings'],
    [['games', '/dashboard/submit-game'], 'Game'],
    [['people', '/dashboard/team'], 'Team'],
    [['info', '/dashboard/notifications'], 'Notifications'],
  ]);
  

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(
    private authService: AuthService,
    private userService: UserService, 
    private observer: BreakpointObserver, 
    private readonly elementRef: ElementRef, 
    private router: Router,
    private cdr: ChangeDetectorRef
    ) { }

  currentName = "";
  currentRole = "";
  currentPhoto = "";

  entries:any;

  toggleMenu = false;

  user!: any;
  validRoles: RoleResponseI[] = [];
  userRoles: string[] = [];

  ngOnInit(): void {
    this.userService.userData$.subscribe({
      next: (user) => {
        if (!user) return;
        this.user = user;
        this.currentName = user.name;
        this.currentPhoto = user.photo.data;
        console.log(this.currentPhoto);
        this.currentRole = user.roles.map((role: { name: any; }) => role.name).join(' - ');
        this.entries = this.getEntries();
      },
      error: (error) => {
        console.error(error);
      }
    });
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
      this.cdr.detectChanges();
    });
    const nameEls = document.querySelectorAll('h1');
    nameEls.forEach((nameEls) => {
      (nameEls as HTMLElement).style.textTransform = "capitalize";
    });
  }

  getEntries() {
    const entries = [];
    
    //this.currentFile = this.sanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64, ${localStorage.getItem("currentPhoto")}`);
    //alert(this.currentRole);
    if (this.currentRole.includes("Global")){
      for (const [key, value] of this.adminDict.toMap()) {
        entries.push({
          key: value,
          value1: key[0],
          value2: key[1],
          value,
        });
      }
    }
    if (this.currentRole.includes("Local")){
      for (const [key, value] of this.localDict.toMap()) {
        entries.push({
          key: value,
          value1: key[0],
          value2: key[1],
          value,
        });
      }
    }
    if (this.currentRole.includes("Jammer")){
      for (const [key, value] of this.jammerDict.toMap()) {
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
    this.userService.logout();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
