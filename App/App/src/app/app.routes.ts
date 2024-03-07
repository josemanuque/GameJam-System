import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './pages/login/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/login/register/register.component';

export const routes: Routes = [
    {
        path:       '',
        component:  LoginComponent
    },
    {
        path:       'login',
        children: [
            {
                path:   '',
                component:  LoginComponent,
            },
            {
                path:   'register',
                component:  RegisterComponent
            },
            {
                path:   'forgot-password',
                component:  ForgotPasswordComponent
            }
        ]
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
