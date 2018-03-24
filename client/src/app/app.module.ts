
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoreModule, INITIAL_STATE } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { TodoListComponent } from 'app/todos/todo-list.component';
import { TodoComponent } from 'app/todos/todo.component';
import { NewTodoInputComponent } from 'app/todos/new-todo.component';
import { TodoContainerComponent } from 'app/todos/todo-container.component';

import { TreeNodeComponent } from 'app/tree/tree-node.component';
import { TreeNodeListComponent } from 'app/tree/tree-node-list.component';
import { TreeContainerComponent } from 'app/tree/tree-container.component';
import { UserListContainerComponent, AdminUserListComponent, UserItemComponent } from 'app/admin-user-list';
import { TimeZoneComponent, TimeZoneItemComponent, AddUpdateTimeZoneComponent } from 'app/time-zones';
import { InviteUserComponent } from 'app/user-invite';
import { InvalidInviteComponent, NotFoundComponent } from 'app/error-page';

import { MyErrorHandler } from './error-handler';
import { CoreModule } from 'app/core/core.module';
import { routes } from 'app/app.routes';
import { SharedModule } from 'app/shared/shared.module';
import { LauncherContainerComponent, EmailVerifyComponent, HomeContainerComponent } from 'app/home';
import { AddUserComponent, SelfUpdateComponent, AdminUserUpdateComponent } from 'app/add-update-user';
import { AuthEffects, UserUpdateEffects, AdminUserListEffecs, UserInviteEffects, TimeZoneEffects } from 'app/core/effects';
import { AuthGuard, LoginGuard, SocialLoginGuard, UserAdminGuard,
   AdminOrOwnerGuard } from 'app/core/guards';
import { EmailVerifyResolver, IdResolver, UserAdminListResolver, ManagedUserResolver,
  UserInviteResolver, TimeZoneResolver } from 'app/core/resolve';

@NgModule({
  declarations: [
    AppComponent,
    HomeContainerComponent,
    NewTodoInputComponent,
    TodoComponent,
    TodoListComponent,
    TodoContainerComponent,
    TreeNodeComponent,
    TreeNodeListComponent,
    TreeContainerComponent,
    LauncherContainerComponent,
    EmailVerifyComponent,
    AddUserComponent,
    SelfUpdateComponent,
    AdminUserUpdateComponent,
    UserListContainerComponent,
    AdminUserListComponent,
    UserItemComponent,
    InviteUserComponent,
    TimeZoneComponent,
    TimeZoneItemComponent,
    AddUpdateTimeZoneComponent,
    InvalidInviteComponent,
    NotFoundComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    CoreModule,
    SharedModule,
    RouterModule.forRoot(routes, { useHash: true }),
    EffectsModule.run(AuthEffects),
    EffectsModule.run(UserUpdateEffects),
    EffectsModule.run(AdminUserListEffecs),
    EffectsModule.run(UserInviteEffects),
    EffectsModule.run(TimeZoneEffects)
  ],
  providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }, AuthGuard, LoginGuard,
    AdminOrOwnerGuard,
    UserAdminListResolver,
    SocialLoginGuard, UserAdminGuard,
    EmailVerifyResolver, IdResolver, ManagedUserResolver, UserInviteResolver, TimeZoneResolver],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

