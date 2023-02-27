import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home-components/home/home.component';
import { LoginComponent } from './authentication-components/login/login.component';
import { ForgotPasswordComponent } from './authentication-components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './authentication-components/verify-email/verify-email.component';
import { DirectoryComponent } from './home-components/directory/directory.component';
import { AllnotesComponent } from './home-components/allnotes/allnotes.component';
import { AboutComponent } from './home-components/about/about.component';
import { LogoutComponent } from './home-components/logout/logout.component';
import { ScribbleComponent } from './home-components/scribble/scribble.component';

const routes: Routes = [
  { path: '', redirectTo: 'home/directory', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent },
  { path: 'forgot-password', component: LoginComponent },
  { path: 'scribble/:scribbleId', component: ScribbleComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      // Change
      { path: '', redirectTo: 'allnotes', pathMatch: 'full' },
      { path: 'allnotes', redirectTo: 'allnotes' },
      {
        path: 'directory',
        component: DirectoryComponent,
      },
      {
        path: 'allnotes',
        component: AllnotesComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
    ],
  },

  // { path: '**', redirectTo: '/login' },
  // { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
