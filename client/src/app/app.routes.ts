import { Routes } from '@angular/router';

import { TreeContainerComponent } from 'app/tree/tree-container.component';
import { TodoContainerComponent } from 'app/todos/todo-container.component';
import { HomeContainerComponent, LauncherContainerComponent, EmailVerifyComponent } from './home';
import { AddUserComponent } from './add-update-user';
import { EmailVerifyResolver } from 'app/core/resolve';
import { AuthGuard, LoginGuard, SocialLoginGuard} from 'app/core/guards';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeContainerComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children:
    [
      {
        path: 'tree',
        component: TreeContainerComponent
      },
      {
        path: 'todo',
        component: TodoContainerComponent
      }]
  },
  {
    path: 'social/login',
    component: LauncherContainerComponent,
    pathMatch: 'full', canActivate: [SocialLoginGuard]
  },
  {
    path: 'email-verify',
    pathMatch: 'full',
    component: EmailVerifyComponent,
    resolve: { success: EmailVerifyResolver }
  },  {
    path: 'user-create',
    pathMatch: 'full',
    component: AddUserComponent,
    canActivate: [LoginGuard]
  },
  {
    path: '', pathMatch: 'full', component: LauncherContainerComponent, canActivate: [LoginGuard]
  }
];
