import { Routes } from '@angular/router';
import { TreeContainerComponent } from 'app/tree/tree-container.component';
import { TodoContainerComponent } from 'app/todos/todo-container.component';
import { HomeContainerComponent, LauncherContainerComponent, EmailVerifyComponent } from './home';
import { UserListContainerComponent } from 'app/admin-user-list';
import { AddUserComponent, SelfUpdateComponent, AdminUserUpdateComponent } from './add-update-user';
import { EmailVerifyResolver, IdResolver, UserAdminListResolver, ManagedUserResolver } from 'app/core/resolve';
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
