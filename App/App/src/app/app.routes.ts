import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path:       '',
        component:  LoginComponent
    },
    {
        path:       'login',
        component:  LoginComponent
    },
    {
        path:       'dashboard',
        component:  DashboardComponent
    },
    {
        path:       '**',
        redirectTo:  ''
    },
];
