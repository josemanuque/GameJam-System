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
import { ViewJamComponent } from './pages/dashboard/jam/view-jam/view-jam.component';
import { SiteComponent } from './pages/dashboard/create-site/site/site.component';
import { CreateTeamComponent } from './pages/dashboard/team/create-team/create-team.component';
import { CategoriesComponent } from './pages/dashboard/categories/categories.component';
import { SettingsComponent } from './pages/dashboard/settings/settings.component';
import { ProfileSettingsComponent } from './pages/dashboard/settings/profile-settings/profile-settings.component';
import { PasswordSettingsComponent } from './pages/dashboard/settings/password-settings/password-settings.component';
import { RegionSiteSettingsComponent } from './pages/dashboard/settings/region-site-settings/region-site-settings.component';
import { ViewUserComponent } from './pages/dashboard/view-user/view-user.component';
import { ThemeComponent } from './pages/dashboard/theme/theme.component';
import { StageComponent } from './pages/dashboard/stage/stage.component';
import { EditSiteComponent } from './pages/dashboard/create-site/edit-site/edit-site.component';
import { StagesViewComponent } from './pages/dashboard/jam/stages-view/stages-view.component';
import { JamsViewComponent } from './pages/dashboard/jam/jams-view/jams-view.component';
import { UpdateUserComponent } from './pages/dashboard/view-user/update-user/update-user.component';

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
                component:  SettingsComponent,
            },
            {
                path:   'sites',
                component:  SiteComponent
            },
            {
                path:   'sites/create',
                component:  CreateSiteComponent
            },
            {
                path:   'sites/edit',
                component:  EditSiteComponent
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
                path:   'team/create',
                component:  CreateTeamComponent
            },
            {
                path:   'register-user',
                component:  RegisterUserComponent
            },
            {
                path:   'view-user',
                component:  ViewUserComponent
            },
            {
                path:  'update-user/:username',
                component: UpdateUserComponent
            },
            {
                path:   'notifications',
                component:  NotificationsComponent
            },
            {
                path:   'jam',
                component:  JamsViewComponent
            },
            {
                path:   'jam/edit/:id',
                component:  ViewJamComponent
            },
            {
                path:   'jam/:id/stages',
                component:  StagesViewComponent
            },
            {
                path:   'jam/create',
                component:  JamComponent
            },
            {
                path:   'category',
                component:  CategoriesComponent
            },
            {
                path:   'theme',
                component:  ThemeComponent
            },
            {
                path:   'stages',
                component:  StageComponent
            },
        ]
    },
    {
        path:       'settings',
        children:  [
            {
                path:   '',
                component:  SettingsComponent
            },
            {
                path:   'profile',
                component:  ProfileSettingsComponent
            },
            {
                path:   'password',
                component:  PasswordSettingsComponent
            },
            {
                path:   'region-site',
                component: RegionSiteSettingsComponent
            }
        ]
    },
    {
        path:       '**',
        redirectTo:  ''
    },
];
