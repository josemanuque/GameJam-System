import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './pages/login/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { CreateSiteComponent } from './pages/dashboard/create-site/create-site.component';
import { SubmitGameComponent } from './pages/dashboard/submit-game/submit-game.component';
import { TeamComponent } from './pages/dashboard/team/team.component';
import { RegisterUserComponent } from './pages/dashboard/register-user/register-user.component';
import { NotificationsComponent } from './pages/dashboard/notifications/notifications.component';
import { JamComponent } from './pages/dashboard/jam/jam.component';

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
        children: [
            {
                path:   '',
                component:  DashboardComponent,
            },
            {
                path:   'sites',
                component:  CreateSiteComponent
            },
            {
                path:   'submit-game',
                component:  SubmitGameComponent
            },
            {
                path:   'team',
                component:  TeamComponent
            },
            {
                path:   'register-user',
                component:  RegisterUserComponent
            },
            {
                path:   'notifications',
                component:  NotificationsComponent
            },
            {
                path:   'jam',
                component:  JamComponent
            }
        ]
    },
    {
        path:       '**',
        redirectTo:  ''
    },
];
