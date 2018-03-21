import { Routes } from '@angular/router';
import { TreeContainerComponent } from 'app/tree/tree-container.component';
import { TodoContainerComponent } from 'app/todos/todo-container.component';
import { HomeContainerComponent, LauncherContainerComponent, EmailVerifyComponent } from './home';
import { UserListContainerComponent } from 'app/admin-user-list';
import { AddUserComponent, SelfUpdateComponent, AdminUserUpdateComponent } from './add-update-user';
import { InviteUserComponent } from 'app/user-invite';
import { InvalidInviteComponent } from 'app/error-page';

import { EmailVerifyResolver, IdResolver, UserAdminListResolver, 
  ManagedUserResolver, UserInviteResolver } from 'app/core/resolve';
import { AuthGuard, LoginGuard, SocialLoginGuard, UserAdminGuard} from 'app/core/guards';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeContainerComponent,
    canActivate: [AuthGuard],
    children:
    [
      {
        path: 'tree',
        component: TreeContainerComponent
      },
      {
        path: 'todo',
        component: TodoContainerComponent
      },
      {
        path: 'users/me/update',
        component: SelfUpdateComponent,
        resolve: { userId: IdResolver }
      },
      {
        path: 'admin/users',
        component: UserListContainerComponent,
        canActivate: [UserAdminGuard],
        resolve: { unused: UserAdminListResolver}
      },
      {
        path: 'admin/users/:userId/update',
        component: AdminUserUpdateComponent,
        canActivate: [UserAdminGuard],
        resolve: { unused: ManagedUserResolver}
      },
      {
        path: 'admin/users/invite-user',
        component: InviteUserComponent,
        canActivate: [UserAdminGuard]
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
  },
  {
    path: 'user-create',
    pathMatch: 'full',
    component: AddUserComponent,
    canActivate: [LoginGuard],
    resolve: { email: UserInviteResolver }
  },
  {
    path: 'user-create/invalid-token',
    pathMatch: 'full',
    component: InvalidInviteComponent
  },
  {
    path: '', pathMatch: 'full', component: LauncherContainerComponent, canActivate: [LoginGuard]
  }
];
