import { Routes } from '@angular/router';

import { TreeContainerComponent } from 'app/tree/tree-container.component';
import { TodoContainerComponent } from 'app/todos/todo-container.component';
import { HomeContainerComponent } from './home/home-container.component';
import { LauncherComponent } from 'app/home/launcher.component';
import { AuthGuard, LoginGuard} from 'app/core/guards';

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
    path: '', pathMatch: 'full', component: LauncherComponent, canActivate: [LoginGuard]
  }
];
